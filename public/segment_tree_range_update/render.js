(function () {
  "use strict";

  var nodeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var positions = {
    1: [450, 103],
    2: [285, 195],
    3: [650, 195],
    4: [185, 292],
    5: [385, 292],
    6: [555, 292],
    7: [755, 292],
    8: [125, 389],
    9: [245, 389]
  };
  var edges = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7], [4, 8], [4, 9]];
  var palette = {
    ink: "#1f2924",
    muted: "#66716b",
    line: "#cfd7d2",
    white: "#ffffff",
    neutral: "#f7f8f7",
    amber: "#a5620c",
    amberSoft: "#fff0cf",
    green: "#236b4d",
    greenSoft: "#dcebe3",
    red: "#a43b35",
    blue: "#28628f",
    blueSoft: "#e4eff7"
  };
  var svg;
  var edgeSelection;
  var nodeSelection;
  var inputCells;
  var operationTitle;
  var operationDetail;

  function addText(parent, className, x, y, text, size, weight, fill, anchor) {
    return parent.append("text")
      .attr("class", className)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", fill || palette.ink)
      .attr("font-size", size || 14)
      .attr("font-weight", weight || 400)
      .attr("text-anchor", anchor || "start")
      .text(text);
  }

  function createLegend() {
    var legendItems = [
      { label: "访问路径", fill: palette.amberSoft, stroke: palette.amber },
      { label: "处理完成", fill: palette.greenSoft, stroke: palette.green },
      { label: "懒标记", fill: palette.white, stroke: palette.red }
    ];
    var legend = svg.append("g").attr("transform", "translate(606, 28)");
    var item = legend.selectAll("g").data(legendItems).enter().append("g")
      .attr("transform", function (value, index) { return "translate(" + (index * 97) + ", 0)"; });
    item.append("circle")
      .attr("cx", 7)
      .attr("r", 7)
      .attr("fill", function (value) { return value.fill; })
      .attr("stroke", function (value) { return value.stroke; })
      .attr("stroke-width", 2);
    item.append("text")
      .attr("x", 20)
      .attr("y", 5)
      .attr("fill", palette.muted)
      .attr("font-size", 13)
      .text(function (value) { return value.label; });
  }

  function createTree() {
    edgeSelection = svg.append("g").attr("class", "tree-edges")
      .selectAll("line").data(edges).enter().append("line")
      .attr("x1", function (edge) { return positions[edge[0]][0]; })
      .attr("y1", function (edge) { return positions[edge[0]][1] + 36; })
      .attr("x2", function (edge) { return positions[edge[1]][0]; })
      .attr("y2", function (edge) { return positions[edge[1]][1] - 36; })
      .attr("stroke", palette.line)
      .attr("stroke-width", 2);

    nodeSelection = svg.append("g").attr("class", "tree-nodes")
      .selectAll("g.tree-node").data(nodeIds).enter().append("g")
      .attr("class", "tree-node")
      .attr("data-node", function (id) { return id; })
      .attr("transform", function (id) {
        return "translate(" + positions[id][0] + ", " + positions[id][1] + ")";
      });
    nodeSelection.append("rect")
      .attr("x", -53)
      .attr("y", -35)
      .attr("width", 106)
      .attr("height", 70)
      .attr("rx", 6)
      .attr("fill", palette.neutral)
      .attr("stroke", palette.line)
      .attr("stroke-width", 2);
    nodeSelection.append("text")
      .attr("class", "node-heading")
      .attr("x", 0)
      .attr("y", -17)
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle");
    nodeSelection.append("text")
      .attr("class", "node-sum")
      .attr("x", 0)
      .attr("y", 4)
      .attr("fill", palette.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 14)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle");
    nodeSelection.append("text")
      .attr("class", "node-lazy")
      .attr("x", 0)
      .attr("y", 25)
      .attr("fill", palette.muted)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 12)
      .attr("text-anchor", "middle");
  }

  function createOperationPanel() {
    var panel = svg.append("g").attr("class", "operation-panel");
    panel.append("rect")
      .attr("x", 42)
      .attr("y", 440)
      .attr("width", 816)
      .attr("height", 52)
      .attr("rx", 6)
      .attr("fill", "#f2f4f2")
      .attr("stroke", palette.line);
    operationTitle = addText(panel, "operation-title", 60, 463, "初始线段树", 15, 700);
    operationDetail = addText(panel, "operation-detail", 60, 482, "", 12, 400, palette.muted);
  }

  function createInputRow() {
    addText(svg, "input-title", 42, 556, "a[]", 15, 700, palette.ink);
    inputCells = svg.append("g").attr("class", "input-array")
      .selectAll("g").data([1, 2, 3, 4, 5]).enter().append("g")
      .attr("transform", function (value, index) { return "translate(" + (120 + index * 104) + ", 514)"; });
    inputCells.append("rect")
      .attr("width", 94)
      .attr("height", 62)
      .attr("rx", 5)
      .attr("fill", palette.white)
      .attr("stroke", palette.line)
      .attr("stroke-width", 1.5);
    inputCells.append("text")
      .attr("class", "array-index")
      .attr("x", 47)
      .attr("y", 18)
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .attr("text-anchor", "middle")
      .text(function (value, index) { return "[" + (index + 1) + "]"; });
    inputCells.append("text")
      .attr("class", "array-value")
      .attr("x", 47)
      .attr("y", 46)
      .attr("fill", palette.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 20)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle");
  }

  function render_init() {
    svg = d3.select(".scene > svg:not(.explain)");
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 900 600")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "Inter, Noto Sans SC, Microsoft YaHei, sans-serif");
    addText(svg, "scene-title", 42, 35, "线段树：区间赋值", 20, 700);
    addText(svg, "scene-subtitle", 42, 57, "Node { left, right, sum, lazy, has_lazy }", 13, 400, palette.muted);
    createLegend();
    createTree();
    createOperationPanel();
    createInputRow();
  }

  function activeStroke(kind) {
    if (kind === "query" || kind === "result") return palette.blue;
    if (kind === "pushup") return palette.green;
    if (kind === "apply" || kind === "write") return palette.red;
    return palette.amber;
  }

  function render(currentStatus, requestedDelay) {
    var duration = Math.max(0, Number(requestedDelay) || 0);
    edgeSelection.interrupt().transition().duration(duration)
      .attr("stroke", function (edge) {
        return currentStatus.visitedNodes[edge[1]] > 0 ? palette.green : palette.line;
      })
      .attr("stroke-width", function (edge) {
        return currentStatus.activeNode === edge[1] ? 3 : 2;
      });

    nodeSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (id) {
        if (currentStatus.activeNode === id && (currentStatus.activeKind === "query" || currentStatus.activeKind === "result")) return palette.blueSoft;
        if (currentStatus.visitedNodes[id] === 2) return palette.greenSoft;
        if (currentStatus.visitedNodes[id] === 1) return palette.amberSoft;
        return palette.neutral;
      })
      .attr("stroke", function (id) {
        if (currentStatus.activeNode === id) return activeStroke(currentStatus.activeKind);
        if (currentStatus.lazyValues[id] !== null) return palette.red;
        return currentStatus.visitedNodes[id] === 2 ? palette.green : palette.line;
      })
      .attr("stroke-width", function (id) { return currentStatus.activeNode === id ? 4 : 2; });

    nodeSelection.select(".node-heading").text(function (id) {
      var range = currentStatus.ranges[id];
      return "rt=" + id + "  [" + range.left + ", " + range.right + "]";
    });
    nodeSelection.select(".node-sum").text(function (id) {
      return "sum = " + currentStatus.treeValues[id];
    });
    nodeSelection.select(".node-lazy")
      .attr("fill", function (id) {
        return currentStatus.lazyValues[id] === null ? palette.muted : palette.red;
      })
      .attr("font-weight", function (id) { return currentStatus.lazyValues[id] === null ? 400 : 700; })
      .text(function (id) {
        var value = currentStatus.lazyValues[id];
        return "lazy = " + (value === null ? "--" : value);
      });

    operationTitle.text(currentStatus.operation);
    operationDetail.text(function () {
      if (!currentStatus.targetRange) return "初始区间和为 15";
      var target = "目标 [" + currentStatus.targetRange.left + ", " + currentStatus.targetRange.right + "]";
      if (currentStatus.operationType === "update") return target + "   value = " + currentStatus.updateValue;
      if (currentStatus.queryResult !== null) return target + "   查询结果 = " + currentStatus.queryResult;
      return target + "   当前累计 = " + currentStatus.runningTotal;
    });

    inputCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (value, index) {
        var inTarget = currentStatus.targetRange && index + 1 >= currentStatus.targetRange.left && index + 1 <= currentStatus.targetRange.right;
        if (!inTarget) return palette.white;
        return currentStatus.operationType === "query" ? palette.blueSoft : palette.amberSoft;
      })
      .attr("stroke", function (value, index) {
        var inTarget = currentStatus.targetRange && index + 1 >= currentStatus.targetRange.left && index + 1 <= currentStatus.targetRange.right;
        if (!inTarget) return palette.line;
        return currentStatus.operationType === "query" ? palette.blue : palette.amber;
      })
      .attr("stroke-width", function (value, index) {
        return currentStatus.targetRange && index + 1 >= currentStatus.targetRange.left && index + 1 <= currentStatus.targetRange.right ? 2.5 : 1.5;
      });
    inputCells.select(".array-value").text(function (value, index) {
      return currentStatus.inputValues[index + 1];
    });
  }

  window.render_init = render_init;
  window.render = render;
})();
