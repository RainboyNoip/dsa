/* Frame snapshots follow algorithm.c; paths are explanatory history, not predecessors. */
(function () {
  "use strict";
  const regular = [[1, 2, 6], [1, 3, 2], [1, 4, 9], [2, 4, 1],
    [3, 2, -4], [3, 4, 5], [4, 5, 2], [5, 3, 4]];
  const examples = {
    shortest: { edges: regular, note: "含负权边，但没有负环；点 6 不可达。" },
    negative: { edges: regular.map(e => e[0] === 5 ? [5, 3, -1] : e),
      note: "可达环 3 → 2 → 4 → 5 → 3，权值和为 −2。" },
    unreachable: { edges: [[1, 2, 3], [1, 3, 6], [2, 3, -1], [4, 5, -3], [5, 6, 1], [6, 4, 1]],
      note: "负环 4 → 5 → 6 → 4 不可达，不影响从 1 出发的最短路。" }
  };
  const distance = value => value === null ? "INF" : String(value);

  function buildFrames(key) {
    const example = examples[key] || examples.shortest;
    const n = 6, s = 1, frames = [];
    // null represents INF in serializable snapshots; only reachable vertices are dequeued.
    const state = { n, s, edges: example.edges, note: example.note,
      dis: Array(n + 1).fill(null), cnt: Array(n + 1).fill(0),
      inQueue: Array(n + 1).fill(false), paths: Array.from({ length: n + 1 }, () => []),
      queue: [], u: null, v: null, edge: -1, candidate: null, oldDistance: null,
      phase: "init", result: null, formula: "dis = INF · cnt = 0 · in_queue = false" };
    function emit(phase, first, last, log, formula) {
      state.phase = phase;
      if (formula !== undefined) state.formula = formula;
      frames.push({ status: JSON.parse(JSON.stringify(state)), hls: first, hlt: last, log, id: frames.length });
    }
    emit("init", 30, 33, `初始化数组与空队列。${example.note}`);
    state.dis[s] = 0;
    state.paths[s] = [s];
    state.queue.push(s);
    state.inQueue[s] = true;
    emit("source", 35, 37, "源点 1 的距离设为 0，入队并标记 in_queue[1] = true。", "dis[1] = 0；队列只存点编号，出队时读取最新 dis");
    while (state.queue.length) {
      state.u = state.queue[0];
      state.v = null;
      state.edge = -1;
      const u = state.u;
      emit("front", 40, 40, `读取队首 u = ${u}，当前 dis[${u}] = ${state.dis[u]}。`, `u = ${u} · dis[u] = ${state.dis[u]}`);
      state.queue.shift();
      state.inQueue[u] = false;
      emit("pop", 41, 42, `点 ${u} 出队，立即清除 in_queue[${u}]；以后距离变小仍可再次入队。`);
      for (let i = 0; i < state.edges.length; i++) {
        const [from, v, w] = state.edges[i];
        if (from !== u) continue;
        state.edge = i;
        state.v = v;
        state.candidate = state.dis[u] + w;
        state.oldDistance = state.dis[v];
        const candidate = state.candidate;
        const expression = `${state.dis[u]} + (${w}) = ${candidate}`;
        emit("compare", 44, 47, `检查 ${u} → ${v}：candidate = ${expression}，与 dis[${v}] = ${distance(state.oldDistance)} 比较。`,
          `candidate = ${expression}；dis[${v}] = ${distance(state.oldDistance)}`);
        if (state.dis[v] !== null && candidate >= state.dis[v]) {
          emit("skip", 47, 47, "候选距离没有严格变小，跳过；距离、cnt 和队列均不变。", `${candidate} ≥ ${state.dis[v]}，不松弛`);
          continue;
        }
        state.dis[v] = candidate;
        state.cnt[v] = state.cnt[u] + 1;
        state.paths[v] = [...state.paths[u], v];
        emit("relax", 49, 50, `松弛成功：dis[${v}] = ${candidate}，cnt[${v}] = ${state.cnt[v]}。${state.inQueue[v] ? "该点已在队列中，仍然更新这两个值。" : "随后检查负环与入队条件。"}`,
          `dis[${v}]：${distance(state.oldDistance)} → ${candidate}；cnt[${v}] = ${state.cnt[v]}`);
        if (state.cnt[v] >= n) {
          state.result = false;
          emit("negative", 51, 51, `cnt[${v}] = ${state.cnt[v]} ≥ n = ${n}，发现从源点可达的负环，立即返回 false。此时的距离不是最终最短路。`,
            `返回 false：cnt[${v}] = ${state.cnt[v]} ≥ ${n}，存在可达负环`);
          return frames;
        }
        emit("check", 51, 51, `cnt[${v}] = ${state.cnt[v]} < ${n}，尚未触发负环判定，继续检查入队条件。`, `cnt[${v}] = ${state.cnt[v]} < n = ${n}`);
        if (!state.inQueue[v]) {
          state.queue.push(v);
          state.inQueue[v] = true;
          emit("enqueue", 54, 56, `点 ${v} 当前不在队列中，加入队尾并设置 in_queue[${v}] = true。`, `将 ${v} 加入队尾，等待用最新距离扩展`);
        } else {
          emit("queued", 54, 54, `点 ${v} 已在队列中，不重复入队；轮到它时使用刚刚更新的距离。`, `in_queue[${v}] = true，不重复入队`);
        }
      }
    }
    state.u = null;
    state.v = null;
    state.edge = -1;
    state.result = true;
    emit("done", 60, 60, `队列为空，返回 true，所有可达点的最短距离已确定。${example.note}`, "返回 true：单源最短路完成；INF 表示源点不可达");
    return frames;
  }

  window.spfaDemo = { examples, buildFrames };
  window.lineExports = {
    init: () => buildFrames(document.querySelector("#example-select").value)
  };
})();
