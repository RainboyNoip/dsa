(function () {
  "use strict";
  const ns = "http://www.w3.org/2000/svg";
  const positions = { 1: [62, 192], 2: [207, 110], 3: [207, 272],
    4: [358, 110], 5: [358, 272], 6: [425, 198] };
  let svg, edges, nodes, rows, queue, phase, formula, history, note;
  const display = value => value === null ? "INF" : String(value);
  function element(tag, attrs, parent, text) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    parent.appendChild(node);
    return node;
  }
  function label(parent, x, y, text, cls = "") {
    return element("text", { x, y, class: cls }, parent, text);
  }
  const names = { init: "初始化", source: "源点入队", front: "读取队首", pop: "出队并清除标记",
    compare: "比较候选距离", skip: "无需松弛", relax: "更新 dis 与 cnt", check: "检查路径边数",
    enqueue: "加入队尾", queued: "已在队列中", negative: "发现可达负环", done: "最短路完成" };

  window.render_init = function () {
    svg = document.querySelector(".scene > svg");
    svg.setAttribute("viewBox", "0 0 840 520");
    svg.replaceChildren();
    const defs = element("defs", {}, svg);
    ["base", "active", "success", "danger"].forEach(type => {
      const marker = element("marker", { id: `spfa-arrow-${type}`, viewBox: "0 0 10 10", refX: 9,
        refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      element("path", { d: "M 0 0 L 10 5 L 0 10 z", class: `arrow-${type}` }, marker);
    });
    label(svg, 24, 68, "有向带权图", "section-title");
    label(svg, 480, 68, "实时状态", "section-title");
    edges = element("g", { class: "graph-edges" }, svg);
    nodes = element("g", { class: "graph-nodes" }, svg);
    rows = element("g", { class: "state-table" }, svg);
    ["点", "dis", "cnt", "in_queue"].forEach((t, i) => label(rows, [500, 565, 635, 730][i], 98, t, "table-heading"));
    for (let v = 1; v <= 6; v++) {
      const group = element("g", { "data-vertex": v, class: "state-row" }, rows);
      element("rect", { x: 480, y: 109 + (v - 1) * 30, width: 336, height: 30, rx: 3 }, group);
      label(group, 500, 129 + (v - 1) * 30, v);
      label(group, 565, 129 + (v - 1) * 30, "INF", "distance-value");
      label(group, 635, 129 + (v - 1) * 30, "0", "count-value");
      label(group, 730, 129 + (v - 1) * 30, "false", "in-queue-value");
    }
    label(svg, 480, 313, "cnt：当前距离对应的历史路径边数", "small-label");
    label(svg, 24, 335, "队列 Q", "section-title");
    queue = element("g", { class: "queue" }, svg);
    label(svg, 480, 345, "● 当前处理", "legend-active");
    label(svg, 620, 345, "● 队列中", "legend-queued");
    label(svg, 480, 374, "● 本帧更新", "legend-success");
    label(svg, 620, 374, "○ 未在队列中", "small-label");
    element("rect", { x: 24, y: 405, width: 792, height: 76, rx: 6, class: "operation-background" }, svg);
    phase = label(svg, 38, 429, "", "operation-phase");
    formula = label(svg, 38, 456, "", "operation-formula");
    history = label(svg, 24, 397, "", "history-path");
    note = label(svg, 24, 507, "", "small-label");
    document.querySelector("#example-select").addEventListener("change", () => {
      const player = window.demoPlayer;
      if (!player || !player.editor) return;
      player.pause();
      player.setFrames(window.lineExports.init());
      player.generatedFrameCount = player.frames.length;
      player.renderFrame(0, 0);
    });
  };

  window.render = function (state) {
    edges.replaceChildren();
    nodes.replaceChildren();
    state.edges.forEach(([u, v, w], index) => {
      const [x1, y1] = positions[u], [x2, y2] = positions[v];
      const dx = x2 - x1, dy = y2 - y1, length = Math.hypot(dx, dy);
      // A curved 1→4 edge separates it from the upper path through vertex 2.
      const curved = u === 1 && v === 4;
      const cx = (x1 + x2) / 2 - (curved ? 35 : 0), cy = curved ? 27 : (y1 + y2) / 2;
      const startLength = Math.hypot(cx - x1, cy - y1), endLength = Math.hypot(x2 - cx, y2 - cy);
      const sx = curved ? x1 + (cx - x1) * 24 / startLength : x1 + dx * 24 / length;
      const sy = curved ? y1 + (cy - y1) * 24 / startLength : y1 + dy * 24 / length;
      const ex = curved ? x2 - (x2 - cx) * 29 / endLength : x2 - dx * 29 / length;
      const ey = curved ? y2 - (y2 - cy) * 29 / endLength : y2 - dy * 29 / length;
      const active = state.edge === index;
      const type = active ? state.phase === "negative" ? "danger" : state.phase === "relax" ? "success" : "active" : "base";
      const group = element("g", { class: `graph-edge edge-${type}`, "data-edge": index }, edges);
      element("path", { d: curved ? `M${sx},${sy} Q${cx},${cy} ${ex},${ey}` : `M${sx},${sy} L${ex},${ey}`,
        "marker-end": `url(#spfa-arrow-${type})` }, group);
      const lx = curved ? (sx + 2 * cx + ex) / 4 : (x1 + x2) / 2;
      const ly = curved ? (sy + 2 * cy + ey) / 4 : (y1 + y2) / 2;
      element("rect", { x: lx - 15, y: ly - 11, width: 30, height: 22, rx: 4 }, group);
      label(group, lx, ly + 5, w, "edge-weight");
    });
    for (let v = 1; v <= state.n; v++) {
      const [x, y] = positions[v];
      const updated = state.v === v && state.phase === "relax";
      const type = state.v === v && state.result === false ? "danger" : updated ? "success" : state.u === v ? "active" : state.inQueue[v] ? "queued" : "idle";
      const group = element("g", { class: `graph-node node-${type}`, "data-node": v }, nodes);
      element("circle", { cx: x, cy: y, r: 23 }, group);
      label(group, x, y + 6, v, "node-number");
      label(group, x, y + 42, `d=${display(state.dis[v])}`, "node-distance");
      if (v === state.s) label(group, x, y - 32, "源点", "node-source");
      const row = rows.querySelector(`[data-vertex="${v}"]`);
      row.setAttribute("class", `state-row row-${type}`);
      row.querySelector(".distance-value").textContent = display(state.dis[v]);
      row.querySelector(".count-value").textContent = state.cnt[v];
      row.querySelector(".in-queue-value").textContent = String(state.inQueue[v]);
    }
    queue.replaceChildren();
    if (!state.queue.length) label(queue, 110, 335, "空", "small-label");
    state.queue.forEach((v, i) => {
      const group = element("g", { class: "queue-item", "data-value": v }, queue);
      element("rect", { x: 108 + i * 51, y: 317, width: 40, height: 31, rx: 4 }, group);
      label(group, 128 + i * 51, 339, v, "queue-value");
    });
    if (state.queue.length) {
      label(queue, 108, 370, "↑ 队首", "small-label");
      label(queue, 250, 370, "队尾入 →", "small-label");
    }
    phase.textContent = names[state.phase];
    formula.textContent = state.formula;
    formula.setAttribute("class", `operation-formula${state.result === false ? " result-negative" : ""}`);
    const v = state.v || state.u;
    history.textContent = v && state.paths[v].length
      ? `dis[${v}] 的历史路径：${state.paths[v].join(" → ")}（${state.cnt[v]} 条边）` : "cnt 不是更新次数；每次松弛都随 dis 一起更新。";
    note.textContent = state.note;
    svg.setAttribute("aria-label", `${names[state.phase]}。${state.formula}`);
  };
})();
