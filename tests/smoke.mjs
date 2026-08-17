import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.DSA_BASE_URL || "http://127.0.0.1:4173";
const chromium = process.env.CHROMIUM_BIN || "chromium";
const demonstrations = [
  "01Knapsack",
  "01Knapsack1",
  "group_knapsack",
  "complete_knapsack",
  "4queen1",
  "4queen2",
  "8queen",
  "Golden_Spiral",
  "LIS",
  "bipartite_graph_best_match",
  "bubble_sort",
  "factorial",
  "function_pass_parameter",
  "function_principle",
  "koch_curve",
  "lca-tarjan",
  "lifeGame",
  "maze_bfs",
  "maze_dfs",
  "maze_dfs2",
  "merge_sort",
  "merge_sort_principle",
  "prim",
  "quickSort",
  "segment_tree_build",
  "segment_tree_range_update",
  "segment_tree_single_update"
];

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForJson(url, timeout = 10000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await delay(100);
  }
  throw new Error(`Chromium 调试端口未就绪：${url}`);
}

class DevToolsPage {
  constructor(target) {
    this.target = target;
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(target.webSocketDebuggerUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const callbacks = this.listeners.get(message.method) || [];
      callbacks.forEach((callback) => callback(message.params));
    });
  }

  on(method, callback) {
    const callbacks = this.listeners.get(method) || [];
    callbacks.push(callback);
    this.listeners.set(method, callbacks);
  }

  send(method, params = {}) {
    const id = ++this.sequence;
    const promise = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  async evaluate(expression) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description || "页面表达式执行失败");
    }
    return response.result.value;
  }

  close() {
    this.socket.close();
  }
}

async function waitForReady(page, timeout = 10000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    const state = await page.evaluate('document.documentElement?.dataset.demoState || "loading"');
    if (state === "ready" || state === "error") return state;
    await delay(100);
  }
  return "timeout";
}

async function testDemonstration(debugPort, id) {
  const targetResponse = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, {
    method: "PUT"
  });
  const target = await targetResponse.json();
  const page = new DevToolsPage(target);
  const browserErrors = [];
  const badRequests = [];

  await page.connect();
  page.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    browserErrors.push(exceptionDetails.exception?.description || exceptionDetails.text);
  });
  page.on("Network.responseReceived", ({ response }) => {
    if (!/^https?:/.test(response.url)) return;
    if (response.status >= 400) badRequests.push(`${response.status} ${response.url}`);
    const url = new URL(response.url);
    if (url.origin !== new URL(baseUrl).origin || /\/(?:dsa|dist)\//.test(url.pathname)) {
      badRequests.push(`禁止的资源路径 ${response.url}`);
    }
  });

  await Promise.all([
    page.send("Runtime.enable"),
    page.send("Network.enable"),
    page.send("Page.enable")
  ]);
  await page.send("Page.navigate", { url: `${baseUrl}/${id}/` });

  const state = await waitForReady(page);
  const initial = await page.evaluate(`(() => ({
    state: document.documentElement.dataset.demoState,
    error: document.documentElement.dataset.demoError || "",
    frame: Number(document.documentElement.dataset.demoFrame),
    total: Number(document.documentElement.dataset.demoFrameTotal),
    sourceCharacters: document.querySelector("#source-editor").textContent.length,
    sourceEditorHeight: document.querySelector("#source-editor").getBoundingClientRect().height,
    visibleSourceLines: [...document.querySelectorAll("#source-editor .ace_line")]
      .filter((line) => line.getBoundingClientRect().height > 0).length,
    visualNodes: document.querySelectorAll(".scene > svg:not(.explain) *").length,
    firstLogCount: document.querySelectorAll("#narration-list li").length,
    expectedFirstLogCount: typeof window.demoPlayer.frames[0].log === "string" &&
      window.demoPlayer.frames[0].log.trim() ? 1 : 0,
    playDisabled: document.querySelector("#play-toggle").disabled
  }))()`);

  assert(state === "ready", `${id}: 初始化失败（${initial.error || state}）`);
  assert(initial.frame === 1 && initial.total >= 1, `${id}: 帧范围无效`);
  assert(initial.sourceCharacters > 0, `${id}: 源码未显示`);
  assert(initial.sourceEditorHeight > 100, `${id}: 源码编辑器高度无效`);
  assert(initial.visibleSourceLines > 0, `${id}: 源码没有可见行`);
  assert(initial.visualNodes > 0, `${id}: SVG 没有可见内容`);
  assert(initial.firstLogCount === initial.expectedFirstLogCount, `${id}: 第一帧讲解不一致`);

  if (id === "lifeGame") {
    assert(!initial.playDisabled, `${id}: 连续演示播放按钮被禁用`);
    await page.evaluate("window.demoPlayer.play()");
    await delay(250);
    assert(await page.evaluate("window.demoPlayer.playing"), `${id}: 连续演示没有开始`);
    await page.evaluate("window.demoPlayer.setSpeed(100); window.demoPlayer.reset()");
    assert(!(await page.evaluate("window.demoPlayer.playing")), `${id}: 重置后仍在播放`);
  } else if (initial.total > 1) {
    await page.evaluate("window.demoPlayer.setSpeed(100)");
    const speed = await page.evaluate(`(() => ({
      value: document.querySelector("#speed-range").value,
      duration: window.demoPlayer.frameDuration()
    }))()`);
    assert(speed.value === "100" && speed.duration === 500, `${id}: 速度方向或输出错误`);

    if ([
      "group_knapsack",
      "complete_knapsack",
      "maze_bfs",
      "segment_tree_build",
      "segment_tree_range_update",
      "segment_tree_single_update"
    ].includes(id)) {
      await page.evaluate("window.demoPlayer.play()");
      await delay(650);
      const animatedFrame = await page.evaluate(
        "Number(document.documentElement.dataset.demoFrame)"
      );
      assert(animatedFrame > 1, `${id}: 点击播放后动画帧没有前进`);
      await page.evaluate("window.demoPlayer.pause(); window.demoPlayer.reset()");
    }

    await page.evaluate("window.demoPlayer.seekFromUser(window.demoPlayer.frames.length - 1)");
    await delay(450);
    const last = await page.evaluate(`(() => {
      const player = window.demoPlayer;
      const expectedLogs = player.frames
        .slice(0, player.frameIndex + 1)
        .map((frame) => typeof frame.log === "string" ? frame.log.trim() : "")
        .filter(Boolean);
      const actualLogs = [...document.querySelectorAll("#narration-list li")]
        .map((item) => item.textContent);
      const frame = player.frames[player.frameIndex];
      return {
        frame: Number(document.documentElement.dataset.demoFrame),
        total: player.frames.length,
        playing: player.playing,
        logsMatch: JSON.stringify(expectedLogs) === JSON.stringify(actualLogs),
        shouldHighlight: Number(frame.hls) >= 1,
        highlighted: document.querySelectorAll(".demo-active-line").length > 0,
        state: document.documentElement.dataset.demoState,
        error: document.documentElement.dataset.demoError || ""
      };
    })()`);
    assert(last.state === "ready", `${id}: 末帧渲染失败（${last.error}）`);
    assert(last.frame === last.total && !last.playing, `${id}: 末帧状态错误`);
    assert(last.logsMatch, `${id}: 末帧讲解日志不一致`);
    assert(!last.shouldHighlight || last.highlighted, `${id}: 末帧源码未高亮`);

    if (id === "group_knapsack") {
      const renderedKnapsack = await page.evaluate(`(() => ({
        dp: [...document.querySelectorAll('.dp-array .array-value')]
          .map((item) => item.textContent.trim()).join(','),
        result: document.querySelector('.operation-result').textContent.trim(),
        groups: [...document.querySelectorAll('.group-state')]
          .map((item) => item.textContent.trim()).join(','),
        oneArray: document.querySelectorAll('.dp-array').length === 1 &&
          document.querySelector('.baseline-array') === null &&
          window.demoPlayer.frames.every((frame) => !('baseline' in frame.status)),
        descending: window.demoPlayer.editor.getValue()
          .includes('current_capacity >= 0; --current_capacity')
      }))()`);
      assert(renderedKnapsack.dp === "0,2,6,8,10,12,14,16,17", `${id}: 最终 DP 数组错误`);
      assert(renderedKnapsack.result === "结果：17", `${id}: 最优值没有显示`);
      assert(renderedKnapsack.groups === "已完成,已完成,已完成", `${id}: 分组状态错误`);
      assert(renderedKnapsack.oneArray, `${id}: 动画不应维护上一组数组`);
      assert(renderedKnapsack.descending, `${id}: 容量没有倒序枚举`);
    }

    if (id === "complete_knapsack") {
      const renderedKnapsack = await page.evaluate(`(() => ({
        dp: [...document.querySelectorAll('.dp-array .array-value')]
          .map((item) => item.textContent.trim()).join(','),
        result: document.querySelector('.operation-result').textContent.trim(),
        items: [...document.querySelectorAll('.item-state')]
          .map((item) => item.textContent.trim()).join(','),
        oneArray: document.querySelectorAll('.dp-array').length === 1 &&
          document.querySelector('.baseline-array') === null,
        ascending: window.demoPlayer.editor.getValue()
          .includes('current_capacity <= capacity;') &&
          window.demoPlayer.editor.getValue().includes('++current_capacity'),
        reusesCurrentItem: window.demoPlayer.frames.some(
          (frame) => frame.status.sourceUsesCurrentItem === true
        )
      }))()`);
      assert(renderedKnapsack.dp === "0,0,3,5,6,8,10,11,13", `${id}: 最终 DP 数组错误`);
      assert(renderedKnapsack.result === "结果：13", `${id}: 最优值没有显示`);
      assert(renderedKnapsack.items === "已完成,已完成,已完成", `${id}: 物品状态错误`);
      assert(renderedKnapsack.oneArray, `${id}: 动画只应展示源码使用的一维 DP 数组`);
      assert(renderedKnapsack.ascending, `${id}: 容量没有正序枚举`);
      assert(renderedKnapsack.reusesCurrentItem, `${id}: 没有展示复用本轮状态的关键帧`);
    }

    if (id === "maze_bfs") {
      const renderedBfs = await page.evaluate(`(() => {
        const player = window.demoPlayer;
        const finalStatus = player.frames[player.frames.length - 1].status;
        const source = player.editor.getValue();
        const queueValues = [...document.querySelectorAll('.queue-value')]
          .map((item) => item.textContent.trim()).filter(Boolean);
        const finalState = {
          targetDistance: document.querySelector(
            '.maze-cell[data-row="7"][data-column="8"] .cell-distance'
          ).textContent.trim(),
          result: document.querySelector('.bfs-result').textContent.trim(),
          head: document.querySelector('.head-value').textContent.trim(),
          tail: document.querySelector('.tail-value').textContent.trim(),
          headPointer: document.querySelector(
            '.queue-cell[data-index="27"] .head-pointer'
          ).textContent.trim(),
          tailPointer: document.querySelector(
            '.queue-cell[data-index="27"] .tail-pointer'
          ).textContent.trim(),
          queueLength: finalStatus.queue.length,
          queuePrefix: queueValues.slice(0, 5).join(','),
          hasBreadth: player.frames.some(
            (frame) => frame.status.tail - frame.status.head >= 2
          ),
          sourceIsBfs: source.includes('void bfs(int x,int y)') &&
            source.includes('node a[10000]') &&
            source.includes('dis[nx][ny] = dis[h.x][h.y] + 1') &&
            !source.includes('dfs(')
        };

        const frontIndex = player.frames.findIndex(
          (frame) => frame.status.phase === 'front' && frame.status.currentIndex === 0
        );
        player.renderFrame(frontIndex, 0);
        const frontState = {
          value: document.querySelector('.current-node-value').textContent.trim(),
          distance: document.querySelector('.current-node-distance').textContent.trim(),
          stage: document.querySelector('.current-node-stage').textContent.trim(),
          arrowVisible: document.querySelector('.front-copy-arrow').getAttribute('opacity') === '1',
          head: document.querySelector('.head-value').textContent.trim()
        };

        const popIndex = player.frames.findIndex(
          (frame) => frame.status.phase === 'pop' && frame.status.currentIndex === 0
        );
        player.renderFrame(popIndex, 0);
        const popState = {
          value: document.querySelector('.current-node-value').textContent.trim(),
          stage: document.querySelector('.current-node-stage').textContent.trim(),
          arrowHidden: document.querySelector('.front-copy-arrow').getAttribute('opacity') === '0',
          exited: document.querySelector(
            '.queue-cell[data-index="0"] .queue-exited-label'
          ).textContent.trim(),
          head: document.querySelector('.head-value').textContent.trim()
        };

        const nodeDoneIndex = player.frames.findIndex(
          (frame) => frame.status.phase === 'node-done' && frame.status.currentIndex === 0
        );
        player.renderFrame(nodeDoneIndex, 0);
        const nodeDoneState = {
          value: document.querySelector('.current-node-value').textContent.trim(),
          stage: document.querySelector('.current-node-stage').textContent.trim()
        };
        player.renderFrame(player.frames.length - 1, 0);

        return { finalState, frontState, popState, nodeDoneState };
      })()`);
      assert(renderedBfs.finalState.targetDistance === "13", `${id}: 终点距离错误`);
      assert(renderedBfs.finalState.result === "YES · dis[7][8] = 13", `${id}: 最终结果错误`);
      assert(renderedBfs.finalState.head === "head = 27", `${id}: head 指针终态错误`);
      assert(renderedBfs.finalState.tail === "tail = 27", `${id}: tail 指针终态错误`);
      assert(renderedBfs.finalState.headPointer === "H" && renderedBfs.finalState.tailPointer === "T", `${id}: 队空时 H/T 指针没有重合`);
      assert(renderedBfs.finalState.queueLength === 27, `${id}: 入队节点数量错误`);
      assert(renderedBfs.finalState.queuePrefix === "(2,1),(2,2),(2,3),(2,4),(3,3)", `${id}: 队列不是 BFS 顺序`);
      assert(renderedBfs.finalState.hasBreadth, `${id}: 动画中没有形成包含多个节点的队列`);
      assert(renderedBfs.finalState.sourceIsBfs, `${id}: 源码不是指定的 BFS 实现`);
      assert(
        renderedBfs.frontState.value === "(2,1)" &&
          renderedBfs.frontState.distance === "dis = 1" &&
          renderedBfs.frontState.stage === "已读取，等待 pop()" &&
          renderedBfs.frontState.arrowVisible &&
          renderedBfs.frontState.head === "head = 0",
        `${id}: front() 没有正确复制队首`
      );
      assert(
        renderedBfs.popState.value === "(2,1)" &&
          renderedBfs.popState.stage === "已出队，正在扩展" &&
          renderedBfs.popState.arrowHidden &&
          renderedBfs.popState.exited === "出" &&
          renderedBfs.popState.head === "head = 1",
        `${id}: pop() 没有正确移动 head 或保留 h`
      );
      assert(
        renderedBfs.nodeDoneState.value === "(2,1)" &&
          renderedBfs.nodeDoneState.stage === "扩展完成",
        `${id}: h 没有保留到节点扩展完成`
      );
    }

    if (id === "segment_tree_range_update") {
      const renderedRangeTree = await page.evaluate(`(() => ({
        root: document.querySelector('[data-node="1"] .node-sum').textContent.trim(),
        lazy4: document.querySelector('[data-node="4"] .node-lazy').textContent.trim(),
        lazy5: document.querySelector('[data-node="5"] .node-lazy').textContent.trim(),
        input: [...document.querySelectorAll('.input-array .array-value')]
          .map((item) => item.textContent.trim()).join(','),
        result: document.querySelector('.operation-detail').textContent.trim(),
        sourceUsesStruct: window.demoPlayer.editor.getValue().includes('struct Node')
      }))()`);
      assert(renderedRangeTree.root === "sum = 27", `${id}: 根节点区间和错误`);
      assert(renderedRangeTree.lazy4 === "lazy = 5", `${id}: 节点 4 懒标记错误`);
      assert(renderedRangeTree.lazy5 === "lazy = 8", `${id}: 节点 5 懒标记错误`);
      assert(renderedRangeTree.input === "5,5,8,4,5", `${id}: 最终数组错误`);
      assert(renderedRangeTree.result.includes("22"), `${id}: 查询结果没有显示`);
      assert(renderedRangeTree.sourceUsesStruct, `${id}: 源码没有使用 struct Node`);
    }

    if (id === "segment_tree_single_update") {
      const renderedSingleTree = await page.evaluate(`(() => ({
        root: document.querySelector('[data-node="1"] .node-value').textContent.trim(),
        input: [...document.querySelectorAll('.input-array .array-value')]
          .map((item) => item.textContent.trim()).join(',')
      }))()`);
      assert(renderedSingleTree.root === "sum = 16", `${id}: 根节点区间和错误`);
      assert(renderedSingleTree.input === "1,2,8,4,1", `${id}: 最终数组错误`);
    }

    await page.evaluate("window.demoPlayer.play(); window.demoPlayer.setSpeed(80)");
    const replay = await page.evaluate(`(() => ({
      frame: Number(document.documentElement.dataset.demoFrame),
      playing: window.demoPlayer.playing,
      timerScheduled: window.demoPlayer.timer !== null
    }))()`);
    assert(
      replay.frame === 1 && replay.playing && replay.timerScheduled,
      `${id}: 末帧再次播放没有从第 1 帧重启`
    );

    await page.evaluate(
      "window.demoPlayer.seekFromUser(Math.floor(window.demoPlayer.frames.length / 2))"
    );
    const seek = await page.evaluate(`(() => ({
      frame: Number(document.documentElement.dataset.demoFrame),
      expected: Math.floor(window.demoPlayer.frames.length / 2) + 1,
      playing: window.demoPlayer.playing
    }))()`);
    assert(seek.frame === seek.expected && !seek.playing, `${id}: 用户跳帧没有暂停`);

    await page.evaluate("window.demoPlayer.reset()");
    const reset = await page.evaluate(`(() => ({
      frame: Number(document.documentElement.dataset.demoFrame),
      playing: window.demoPlayer.playing,
      logs: document.querySelectorAll("#narration-list li").length,
      expectedLogs: typeof window.demoPlayer.frames[0].log === "string" &&
        window.demoPlayer.frames[0].log.trim() ? 1 : 0
    }))()`);
    assert(
      reset.frame === 1 && !reset.playing && reset.logs === reset.expectedLogs,
      `${id}: 重置状态错误`
    );
  }

  const dialogs = await page.evaluate(`(() => {
    const dialog = document.querySelector("#about-dialog");
    document.querySelector('[data-dialog="about-dialog"]').click();
    const opened = dialog.open;
    dialog.querySelector("[data-dialog-close]").click();
    return { opened, closed: !dialog.open };
  })()`);
  assert(dialogs.opened && dialogs.closed, `${id}: 关于对话框无法开关`);
  await delay(100);
  assert(browserErrors.length === 0, `${id}: 浏览器异常：${browserErrors.join(" | ")}`);
  assert(badRequests.length === 0, `${id}: 资源请求错误：${badRequests.join(" | ")}`);

  page.close();
  return initial.total;
}

const debugPort = await availablePort();
const profileDirectory = mkdtempSync(join(tmpdir(), "dsa-smoke-"));
const browser = spawn(chromium, [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-background-networking",
  "--hide-scrollbars",
  "--window-size=1280,720",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDirectory}`,
  "about:blank"
], { stdio: "ignore" });

let failed = false;
try {
  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  for (const id of demonstrations) {
    try {
      const frames = await testDemonstration(debugPort, id);
      console.log(`PASS  ${id.padEnd(34)} ${String(frames).padStart(4)} 帧`);
    } catch (error) {
      failed = true;
      console.error(`FAIL  ${id}\n      ${error.message}`);
    }
  }
} finally {
  browser.kill("SIGTERM");
  await delay(250);
  rmSync(profileDirectory, { recursive: true, force: true });
}

if (failed) process.exitCode = 1;
