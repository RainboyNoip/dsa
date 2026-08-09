(function () {
  "use strict";

  var nodeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var positions = {
    1: [450, 92],
    2: [285, 190],
    3: [650, 190],
    4: [185, 300],
    5: [385, 300],
    6: [555, 300],
    7: [755, 300],
    8: [125, 410],
    9: [245, 410]
  };
  var edges = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7], [4, 8], [4, 9]];
  var colors = {
    ink: "#1f2924",
    muted: "#66716b",
    line: "#cfd7d2",
    unseen: "#f7f8f7",
    visiting: "#fff0cf",
    visitingStroke: "#a5620c",
    complete: "#dcebe3",
    completeStroke: "#236b4d",
    active: "#b34b32",
    white: "#ffffff"
  };
  var svg;
  var edgeSelection;
  var nodeSelection;
  var inputCellSelection;
  var treeCellSelection;

  function appendText(selection, className, x, y, text, options) {
    var element = selection.append("text")
      .attr("class", className)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", options.fill || colors.ink)
      .attr("font-size", options.size || 14)
      .attr("font-weight", options.weight || 400)
      .attr("text-anchor", options.anchor || "start")
      .text(text);

    if (options.family) element.attr("font-family", options.family);
    return element;
  }

  function createLegend() {
    var legend = svg.append("g").attr("transform", "translate(602, 27)");
    var items = [
      { label: "未访问", fill: colors.unseen, stroke: colors.line },
      { label: "递归中", fill: colors.visiting, stroke: colors.visitingStroke },
      { label: "已完成", fill: colors.complete, stroke: colors.completeStroke }
    ];

    var item = legend.selectAll("g").data(items).enter().append("g")
      .attr("transform", function (d, index) { return "translate(" + (index * 96) + ", 0)"; });
    item.append("circle")
      .attr("cx", 7)
      .attr("cy", 0)
      .attr("r", 7)
      .attr("fill", function (d) { return d.fill; })
      .attr("stroke", function (d) { return d.stroke; })
      .attr("stroke-width", 2);
    item.append("text")
      .attr("x", 20)
      .attr("y", 5)
      .attr("fill", colors.muted)
      .attr("font-size", 13)
      .text(function (d) { return d.label; });
  }

  function createTree() {
    var edgeLayer = svg.append("g").attr("class", "tree-edges");
    edgeSelection = edgeLayer.selectAll("line").data(edges).enter().append("line")
      .attr("x1", function (edge) { return positions[edge[0]][0]; })
      .attr("y1", function (edge) { return positions[edge[0]][1] + 34; })
      .attr("x2", function (edge) { return positions[edge[1]][0]; })
      .attr("y2", function (edge) { return positions[edge[1]][1] - 34; })
      .attr("stroke", colors.line)
      .attr("stroke-width", 2);

    var nodeLayer = svg.append("g").attr("class", "tree-nodes");
    nodeSelection = nodeLayer.selectAll("g.tree-node").data(nodeIds).enter().append("g")
      .attr("class", "tree-node")
      .attr("data-node", function (id) { return id; })
      .attr("transform", function (id) {
        return "translate(" + positions[id][0] + ", " + positions[id][1] + ")";
      });

    nodeSelection.append("rect")
      .attr("x", -51)
      .attr("y", -33)
      .attr("width", 102)
      .attr("height", 66)
      .attr("rx", 6)
      .attr("fill", colors.unseen)
      .attr("stroke", colors.line)
      .attr("stroke-width", 2);
    nodeSelection.append("text")
      .attr("class", "node-index")
      .attr("x", 0)
      .attr("y", -13)
      .attr("fill", colors.muted)
      .attr("font-size", 12)
      .attr("font-weight", 650)
      .attr("text-anchor", "middle")
      .text(function (id) { return "rt = " + id; });
    nodeSelection.append("text")
      .attr("class", "node-range")
      .attr("x", 0)
      .attr("y", 7)
      .attr("fill", colors.ink)
      .attr("font-size", 14)
      .attr("font-weight", 650)
      .attr("text-anchor", "middle")
      .text("[ - , - ]");
    nodeSelection.append("text")
      .attr("class", "node-value")
      .attr("x", 0)
      .attr("y", 26)
      .attr("fill", colors.muted)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 13)
      .attr("text-anchor", "middle")
      .text("st = -");
  }

  function createArrayRow(className, title, values, x, y, cellWidth) {
    appendText(svg, className + "-title", 42, y + 30, title, {
      size: 15,
      weight: 700,
      family: "ui-monospace, SFMono-Regular, Consolas, monospace"
    });

    var cells = svg.append("g").attr("class", className)
      .selectAll("g").data(values).enter().append("g")
      .attr("transform", function (value, index) {
        return "translate(" + (x + index * cellWidth) + ", " + y + ")";
      });
    cells.append("rect")
      .attr("width", cellWidth - 6)
      .attr("height", 50)
      .attr("rx", 4)
      .attr("fill", colors.white)
      .attr("stroke", colors.line)
      .attr("stroke-width", 1.5);
    cells.append("text")
      .attr("class", "array-index")
      .attr("x", (cellWidth - 6) / 2)
      .attr("y", 15)
      .attr("fill", colors.muted)
      .attr("font-size", 11)
      .attr("text-anchor", "middle")
      .text(function (value, index) { return "[" + (index + 1) + "]"; });
    cells.append("text")
      .attr("class", "array-value")
      .attr("x", (cellWidth - 6) / 2)
      .attr("y", 39)
      .attr("fill", colors.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 17)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text(function (value) { return value === null ? "-" : value; });
    return cells;
  }

  function render_init() {
    svg = d3.select(".scene > svg:not(.explain)");
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 900 620")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "Inter, Noto Sans SC, Microsoft YaHei, sans-serif");

    appendText(svg, "scene-title", 42, 35, "区间 [1, 5] 的线段树", { size: 20, weight: 700 });
    appendText(svg, "scene-subtitle", 42, 57, "节点值表示所负责区间的元素和", { size: 13, fill: colors.muted });
    createLegend();
    createTree();
    inputCellSelection = createArrayRow("input-array", "input", [1, 2, 3, 4, 5], 120, 478, 64);
    treeCellSelection = createArrayRow("tree-array", "st[]", new Array(9).fill(null), 120, 550, 82);
  }

  function stateFill(state) {
    if (state === 2) return colors.complete;
    if (state === 1) return colors.visiting;
    return colors.unseen;
  }

  function stateStroke(state) {
    if (state === 2) return colors.completeStroke;
    if (state === 1) return colors.visitingStroke;
    return colors.line;
  }

  function render(currentStatus, requestedDelay) {
    var duration = Math.max(0, Number(requestedDelay) || 0);

    edgeSelection.interrupt().transition().duration(duration)
      .attr("stroke", function (edge) {
        return currentStatus.nodeStates[edge[1]] > 0 ? colors.completeStroke : colors.line;
      })
      .attr("stroke-width", function (edge) {
        return currentStatus.activeNode === edge[1] ? 3 : 2;
      });

    nodeSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (id) { return stateFill(currentStatus.nodeStates[id]); })
      .attr("stroke", function (id) {
        return currentStatus.activeNode === id ? colors.active : stateStroke(currentStatus.nodeStates[id]);
      })
      .attr("stroke-width", function (id) { return currentStatus.activeNode === id ? 4 : 2; });

    nodeSelection.select(".node-range").text(function (id) {
      var range = currentStatus.ranges[id];
      return range ? "[ " + range.left + " , " + range.right + " ]" : "[ - , - ]";
    });
    nodeSelection.select(".node-value")
      .attr("fill", function (id) {
        return currentStatus.treeValues[id] === null ? colors.muted : colors.completeStroke;
      })
      .text(function (id) {
        var value = currentStatus.treeValues[id];
        return "st = " + (value === null ? "-" : value);
      });

    inputCellSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (value, index) {
        return currentStatus.activeInput === index + 1 ? colors.visiting : colors.white;
      })
      .attr("stroke", function (value, index) {
        return currentStatus.activeInput === index + 1 ? colors.active : colors.line;
      })
      .attr("stroke-width", function (value, index) {
        return currentStatus.activeInput === index + 1 ? 3 : 1.5;
      });

    treeCellSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (value, index) {
        if (currentStatus.activeNode === index + 1) return colors.visiting;
        return currentStatus.treeValues[index + 1] === null ? colors.white : colors.complete;
      })
      .attr("stroke", function (value, index) {
        return currentStatus.activeNode === index + 1 ? colors.active : colors.line;
      })
      .attr("stroke-width", function (value, index) {
        return currentStatus.activeNode === index + 1 ? 3 : 1.5;
      });
    treeCellSelection.select(".array-value").text(function (value, index) {
      var treeValue = currentStatus.treeValues[index + 1];
      return treeValue === null ? "-" : treeValue;
    });
  }

  window.render_init = render_init;
  window.render = render;
})();
