(function () {
  "use strict";

  var nodeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var positions = {
    1: [450, 105],
    2: [285, 200],
    3: [650, 200],
    4: [185, 300],
    5: [385, 300],
    6: [555, 300],
    7: [755, 300],
    8: [125, 400],
    9: [245, 400]
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
    red: "#a43b35"
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
      { label: "递归路径", fill: palette.amberSoft, stroke: palette.amber },
      { label: "更新完成", fill: palette.greenSoft, stroke: palette.green },
      { label: "正在写入", fill: palette.white, stroke: palette.red }
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
      .attr("y1", function (edge) { return positions[edge[0]][1] + 32; })
      .attr("x2", function (edge) { return positions[edge[1]][0]; })
      .attr("y2", function (edge) { return positions[edge[1]][1] - 32; })
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
      .attr("x", -52)
      .attr("y", -31)
      .attr("width", 104)
      .attr("height", 62)
      .attr("rx", 6)
      .attr("fill", palette.neutral)
      .attr("stroke", palette.line)
      .attr("stroke-width", 2);
    nodeSelection.append("text")
      .attr("class", "node-heading")
      .attr("x", 0)
      .attr("y", -9)
      .attr("fill", palette.muted)
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle");
    nodeSelection.append("text")
      .attr("class", "node-value")
      .attr("x", 0)
      .attr("y", 18)
      .attr("fill", palette.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 16)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle");
  }

  function createOperationPanel() {
    var panel = svg.append("g").attr("class", "operation-panel");
    panel.append("rect")
      .attr("x", 42)
      .attr("y", 448)
      .attr("width", 816)
      .attr("height", 50)
      .attr("rx", 6)
      .attr("fill", "#f2f4f2")
      .attr("stroke", palette.line);
    operationTitle = addText(panel, "operation-title", 60, 470, "初始线段树", 15, 700);
    operationDetail = addText(panel, "operation-detail", 60, 488, "", 12, 400, palette.muted);
  }

  function createInputRow() {
    addText(svg, "input-title", 42, 560, "a[]", 15, 700);
    inputCells = svg.append("g").attr("class", "input-array")
      .selectAll("g").data([1, 2, 3, 4, 5]).enter().append("g")
      .attr("transform", function (value, index) { return "translate(" + (120 + index * 104) + ", 516)"; });
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
    addText(svg, "scene-title", 42, 35, "线段树：单点更新", 20, 700);
    addText(svg, "scene-subtitle", 42, 57, "沿根到叶子的路径修改，并逐层重新计算区间和", 13, 400, palette.muted);
    createLegend();
    createTree();
    createOperationPanel();
    createInputRow();
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
        if (currentStatus.visitedNodes[id] === 2) return palette.greenSoft;
        if (currentStatus.visitedNodes[id] === 1) return palette.amberSoft;
        return palette.neutral;
      })
      .attr("stroke", function (id) {
        if (currentStatus.activeNode === id && currentStatus.activeKind === "write") return palette.red;
        if (currentStatus.activeNode === id) return currentStatus.activeKind === "pushup" ? palette.green : palette.amber;
        return currentStatus.visitedNodes[id] === 2 ? palette.green : palette.line;
      })
      .attr("stroke-width", function (id) { return currentStatus.activeNode === id ? 4 : 2; });
    nodeSelection.select(".node-heading").text(function (id) {
      var range = currentStatus.ranges[id];
      return "rt=" + id + "  [" + range.left + ", " + range.right + "]";
    });
    nodeSelection.select(".node-value").text(function (id) {
      return "sum = " + currentStatus.treeValues[id];
    });

    operationTitle.text(currentStatus.operation);
    operationDetail.text(currentStatus.targetIndex === null
      ? "初始区间和为 15"
      : "目标下标 [" + currentStatus.targetIndex + "]   value = " + currentStatus.updateValue);

    inputCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (value, index) {
        return currentStatus.targetIndex === index + 1 ? palette.amberSoft : palette.white;
      })
      .attr("stroke", function (value, index) {
        return currentStatus.targetIndex === index + 1 ? palette.red : palette.line;
      })
      .attr("stroke-width", function (value, index) {
        return currentStatus.targetIndex === index + 1 ? 3 : 1.5;
      });
    inputCells.select(".array-value").text(function (value, index) {
      return currentStatus.inputValues[index + 1];
    });
  }

  window.render_init = render_init;
  window.render = render;
})();
