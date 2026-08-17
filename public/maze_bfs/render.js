(function () {
  "use strict";

  var colors = {
    ink: "#1f2924",
    muted: "#66716b",
    line: "#cfd7d2",
    white: "#ffffff",
    neutral: "#e8ece9",
    green: "#236b4d",
    greenSoft: "#dcebe3",
    amber: "#a5620c",
    amberSoft: "#fff0cf",
    blue: "#28628f",
    blueSoft: "#e4eff7",
    red: "#a43b35",
    wall: "#26312c"
  };
  var svg;
  var mazeCells;
  var queueCells;
  var headValue;
  var tailValue;
  var queueRange;
  var operationTitle;
  var currentText;
  var candidateText;
  var resultText;

  function addText(parent, className, x, y, text, options) {
    options = options || {};
    return parent.append("text")
      .attr("class", className)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", options.fill || colors.ink)
      .attr("font-size", options.size || 14)
      .attr("font-weight", options.weight || 400)
      .attr("text-anchor", options.anchor || "start")
      .text(text);
  }

  function flattenMaze() {
    var cells = [];
    var maze = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ];
    maze.forEach(function (row, rowIndex) {
      row.forEach(function (wall, columnIndex) {
        cells.push({ x: rowIndex + 1, y: columnIndex + 1, wall: wall === 1 });
      });
    });
    return cells;
  }

  function samePoint(point, cell) {
    return Boolean(point && point.x === cell.x && point.y === cell.y);
  }

  function createLegend() {
    var entries = [
      { label: "队列中", fill: colors.greenSoft, stroke: colors.green },
      { label: "当前出队", fill: colors.amberSoft, stroke: colors.amber },
      { label: "考察邻格", fill: colors.blueSoft, stroke: colors.blue },
      { label: "已扩展", fill: colors.neutral, stroke: colors.muted }
    ];
    var legend = svg.append("g").attr("transform", "translate(466, 31)");
    var entry = legend.selectAll("g").data(entries).enter().append("g")
      .attr("transform", function (value, index) {
        return "translate(" + (index * 105) + ", 0)";
      });
    entry.append("circle")
      .attr("cx", 7)
      .attr("r", 7)
      .attr("fill", function (value) { return value.fill; })
      .attr("stroke", function (value) { return value.stroke; })
      .attr("stroke-width", 2);
    entry.append("text")
      .attr("x", 20)
      .attr("y", 5)
      .attr("fill", colors.muted)
      .attr("font-size", 12)
      .text(function (value) { return value.label; });
  }

  function createMaze() {
    addText(svg, "maze-title", 42, 85, "maze / dis", { size: 15, weight: 700 });
    addText(svg, "maze-caption", 446, 85, "格内数字为 dis", {
      size: 12,
      fill: colors.muted,
      anchor: "end"
    });

    d3.range(1, 9).forEach(function (index) {
      addText(svg, "column-label", 67 + (index - 1) * 51, 106, String(index), {
        size: 10,
        fill: colors.muted,
        anchor: "middle"
      });
      addText(svg, "row-label", 35, 137 + (index - 1) * 51, String(index), {
        size: 10,
        fill: colors.muted,
        anchor: "middle"
      });
    });

    mazeCells = svg.append("g").attr("class", "maze-grid")
      .selectAll("g.maze-cell").data(flattenMaze()).enter().append("g")
      .attr("class", "maze-cell")
      .attr("data-row", function (cell) { return cell.x; })
      .attr("data-column", function (cell) { return cell.y; })
      .attr("transform", function (cell) {
        return "translate(" + (42 + (cell.y - 1) * 51) + ", " + (112 + (cell.x - 1) * 51) + ")";
      });
    mazeCells.append("rect")
      .attr("width", 48)
      .attr("height", 48)
      .attr("rx", 4)
      .attr("fill", function (cell) { return cell.wall ? colors.wall : colors.white; })
      .attr("stroke", colors.line)
      .attr("stroke-width", 1.5);
    mazeCells.append("text")
      .attr("class", "cell-marker")
      .attr("x", 6)
      .attr("y", 13)
      .attr("fill", colors.muted)
      .attr("font-size", 9)
      .attr("font-weight", 700)
      .text(function (cell) {
        if (cell.x === 2 && cell.y === 1) return "S";
        if (cell.x === 7 && cell.y === 8) return "T";
        return "";
      });
    mazeCells.append("text")
      .attr("class", "cell-distance")
      .attr("x", 24)
      .attr("y", 32)
      .attr("fill", function (cell) { return cell.wall ? colors.white : colors.ink; })
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 17)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text(function (cell) { return cell.wall ? "墙" : "0"; });
  }

  function createQueue() {
    addText(svg, "queue-title", 488, 85, "数组队列 a[]", { size: 15, weight: 700 });
    headValue = addText(svg, "head-value", 710, 85, "head = 0", {
      size: 12,
      weight: 700,
      fill: colors.amber
    });
    tailValue = addText(svg, "tail-value", 858, 85, "tail = 0", {
      size: 12,
      weight: 700,
      fill: colors.blue,
      anchor: "end"
    });

    queueCells = svg.append("g").attr("class", "queue-array")
      .selectAll("g.queue-cell").data(d3.range(28)).enter().append("g")
      .attr("class", "queue-cell")
      .attr("data-index", function (index) { return index; })
      .attr("transform", function (index) {
        return "translate(" + (488 + (index % 7) * 53) + ", " + (112 + Math.floor(index / 7) * 83) + ")";
      });
    queueCells.append("rect")
      .attr("width", 48)
      .attr("height", 48)
      .attr("rx", 4)
      .attr("fill", colors.white)
      .attr("stroke", colors.line)
      .attr("stroke-width", 1.5);
    queueCells.append("text")
      .attr("class", "queue-index")
      .attr("x", 24)
      .attr("y", 14)
      .attr("fill", colors.muted)
      .attr("font-size", 9)
      .attr("text-anchor", "middle")
      .text(function (index) { return "[" + index + "]"; });
    queueCells.append("text")
      .attr("class", "queue-value")
      .attr("x", 24)
      .attr("y", 35)
      .attr("fill", colors.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text("");
    queueCells.append("text")
      .attr("class", "head-pointer")
      .attr("x", 15)
      .attr("y", 64)
      .attr("fill", colors.amber)
      .attr("font-size", 11)
      .attr("font-weight", 800)
      .attr("text-anchor", "middle")
      .text("");
    queueCells.append("text")
      .attr("class", "tail-pointer")
      .attr("x", 33)
      .attr("y", 64)
      .attr("fill", colors.blue)
      .attr("font-size", 11)
      .attr("font-weight", 800)
      .attr("text-anchor", "middle")
      .text("");
  }

  function createOperationPanel() {
    var panel = svg.append("g").attr("class", "operation-panel");
    panel.append("rect")
      .attr("x", 488)
      .attr("y", 455)
      .attr("width", 370)
      .attr("height", 121)
      .attr("rx", 6)
      .attr("fill", "#f2f4f2");
    operationTitle = addText(panel, "operation-title", 506, 482, "等待开始", { size: 14, weight: 700 });
    currentText = addText(panel, "current-node", 506, 507, "当前队首 h：--", { size: 12, fill: colors.muted });
    candidateText = addText(panel, "candidate-node", 506, 530, "考察邻格：--", { size: 12, fill: colors.muted });
    queueRange = addText(panel, "queue-range", 506, 553, "有效区间：[0,0)", { size: 12, fill: colors.muted });
    resultText = addText(panel, "bfs-result", 840, 553, "", {
      size: 13,
      weight: 800,
      fill: colors.green,
      anchor: "end"
    });
  }

  function candidateDescription(currentStatus) {
    if (!currentStatus.candidate) return "考察邻格：--";
    var stateNames = {
      checking: "检查中",
      "out-of-bounds": "越界",
      wall: "墙",
      visited: "已访问",
      discovered: "首次发现"
    };
    return "考察邻格：" + currentStatus.direction + " (" +
      currentStatus.candidate.x + "," + currentStatus.candidate.y + ") · " +
      (stateNames[currentStatus.candidateState] || "检查中");
  }

  function render_init() {
    svg = d3.select(".scene > svg:not(.explain)");
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 900 620")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "Inter, Noto Sans SC, Microsoft YaHei, sans-serif");
    addText(svg, "scene-title", 42, 35, "迷宫广度优先搜索", { size: 20, weight: 700 });
    addText(svg, "scene-subtitle", 42, 57, "队列按发现顺序扩展节点，dis 记录从起点开始的层数", {
      size: 13,
      fill: colors.muted
    });
    createLegend();
    createMaze();
    createQueue();
    createOperationPanel();
  }

  function render(currentStatus, requestedDelay) {
    var duration = Math.max(0, Number(requestedDelay) || 0);

    mazeCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (cell) {
        if (cell.wall) return colors.wall;
        if (samePoint(currentStatus.candidate, cell)) return colors.blueSoft;
        if (samePoint(currentStatus.current, cell)) return colors.amberSoft;
        if (currentStatus.processed[cell.x - 1][cell.y - 1]) return colors.neutral;
        if (currentStatus.dis[cell.x - 1][cell.y - 1] !== 0) return colors.greenSoft;
        return colors.white;
      })
      .attr("stroke", function (cell) {
        if (samePoint(currentStatus.candidate, cell)) {
          return currentStatus.candidateState === "wall" || currentStatus.candidateState === "visited"
            ? colors.red
            : colors.blue;
        }
        if (samePoint(currentStatus.current, cell)) return colors.amber;
        if (cell.x === 7 && cell.y === 8) return colors.red;
        if (cell.x === 2 && cell.y === 1) return colors.green;
        return colors.line;
      })
      .attr("stroke-width", function (cell) {
        if (samePoint(currentStatus.candidate, cell) || samePoint(currentStatus.current, cell)) return 3;
        if ((cell.x === 7 && cell.y === 8) || (cell.x === 2 && cell.y === 1)) return 2.5;
        return 1.5;
      });
    mazeCells.select(".cell-distance")
      .attr("fill", function (cell) { return cell.wall ? colors.white : colors.ink; })
      .text(function (cell) {
        return cell.wall ? "墙" : currentStatus.dis[cell.x - 1][cell.y - 1];
      });

    queueCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (index) {
        if (index === currentStatus.currentIndex) return colors.amberSoft;
        if (index < currentStatus.head && index < currentStatus.tail) return colors.neutral;
        if (index >= currentStatus.head && index < currentStatus.tail) return colors.greenSoft;
        return colors.white;
      })
      .attr("stroke", function (index) {
        if (index === currentStatus.currentIndex) return colors.amber;
        if (index === currentStatus.head) return colors.amber;
        if (index === currentStatus.tail) return colors.blue;
        if (index < currentStatus.tail) return colors.green;
        return colors.line;
      })
      .attr("stroke-width", function (index) {
        return index === currentStatus.head || index === currentStatus.tail ||
          index === currentStatus.currentIndex ? 2.5 : 1.5;
      });
    queueCells.select(".queue-value")
      .attr("fill", function (index) {
        return index < currentStatus.head ? colors.muted : colors.ink;
      })
      .text(function (index) {
        var point = currentStatus.queue[index];
        return point ? "(" + point.x + "," + point.y + ")" : "";
      });
    queueCells.select(".head-pointer").text(function (index) {
      return index === currentStatus.head ? "H" : "";
    });
    queueCells.select(".tail-pointer").text(function (index) {
      return index === currentStatus.tail ? "T" : "";
    });

    headValue.text("head = " + currentStatus.head);
    tailValue.text("tail = " + currentStatus.tail);
    operationTitle.text(currentStatus.operation);
    currentText
      .attr("fill", currentStatus.current ? colors.ink : colors.muted)
      .text(currentStatus.current
        ? "当前队首 h：(" + currentStatus.current.x + "," + currentStatus.current.y + ")"
        : "当前队首 h：--");
    candidateText
      .attr("fill", currentStatus.candidateState === "discovered" ? colors.blue : colors.muted)
      .text(candidateDescription(currentStatus));
    queueRange.text("有效区间：[" + currentStatus.head + "," + currentStatus.tail + ") · " +
      (currentStatus.tail - currentStatus.head) + " 个待处理节点");
    resultText.text(currentStatus.result
      ? currentStatus.result + " · dis[7][8] = " + currentStatus.targetDistance
      : "");
  }

  window.render_init = render_init;
  window.render = render;
})();
