(function () {
  "use strict";

  var groups = [
    null,
    [{ weight: 2, value: 6 }, { weight: 3, value: 7 }],
    [{ weight: 2, value: 4 }, { weight: 4, value: 8 }, { weight: 5, value: 9 }],
    [{ weight: 1, value: 2 }, { weight: 3, value: 6 }]
  ];
  var palette = {
    ink: "#1f2924",
    muted: "#66716b",
    line: "#cfd7d2",
    white: "#ffffff",
    neutral: "#f7f8f7",
    green: "#236b4d",
    greenSoft: "#dcebe3",
    amber: "#a5620c",
    amberSoft: "#fff0cf",
    blue: "#28628f",
    blueSoft: "#e4eff7",
    red: "#a43b35"
  };
  var svg;
  var groupSelection;
  var itemSelection;
  var dpCells;
  var operationTitle;
  var keepText;
  var candidateText;
  var resultText;
  var decisionText;

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
    var items = [
      { label: "来源状态", fill: palette.blueSoft, stroke: palette.blue },
      { label: "当前目标", fill: palette.amberSoft, stroke: palette.amber },
      { label: "已确定", fill: palette.greenSoft, stroke: palette.green }
    ];
    var legend = svg.append("g").attr("transform", "translate(607, 28)");
    var item = legend.selectAll("g").data(items).enter().append("g")
      .attr("transform", function (value, index) { return "translate(" + (index * 96) + ", 0)"; });
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

  function createGroups() {
    groupSelection = svg.append("g").attr("class", "item-groups")
      .selectAll("g.group-column").data([1, 2, 3]).enter().append("g")
      .attr("class", "group-column")
      .attr("data-group", function (group) { return group; })
      .attr("transform", function (group) { return "translate(" + (42 + (group - 1) * 276) + ", 79)"; });

    groupSelection.append("line")
      .attr("class", "group-rule")
      .attr("x1", 0)
      .attr("x2", 246)
      .attr("y1", 24)
      .attr("y2", 24)
      .attr("stroke", palette.line)
      .attr("stroke-width", 3);
    groupSelection.append("text")
      .attr("class", "group-title")
      .attr("x", 0)
      .attr("y", 14)
      .attr("fill", palette.ink)
      .attr("font-size", 15)
      .attr("font-weight", 700)
      .text(function (group) { return "第 " + group + " 组"; });
    groupSelection.append("text")
      .attr("class", "group-state")
      .attr("x", 246)
      .attr("y", 14)
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .attr("text-anchor", "end")
      .text("待处理");

    var flattenedItems = [];
    groups.slice(1).forEach(function (items, groupIndex) {
      items.forEach(function (item, itemIndex) {
        flattenedItems.push({
          group: groupIndex + 1,
          item: itemIndex + 1,
          weight: item.weight,
          value: item.value
        });
      });
    });
    itemSelection = svg.append("g").attr("class", "group-items")
      .selectAll("g.item-card").data(flattenedItems).enter().append("g")
      .attr("class", "item-card")
      .attr("data-group", function (item) { return item.group; })
      .attr("data-item", function (item) { return item.item; })
      .attr("transform", function (item) {
        var x = 42 + (item.group - 1) * 276 + (item.item - 1) * 82;
        return "translate(" + x + ", 116)";
      });
    itemSelection.append("rect")
      .attr("width", 74)
      .attr("height", 72)
      .attr("rx", 5)
      .attr("fill", palette.white)
      .attr("stroke", palette.line)
      .attr("stroke-width", 1.5);
    itemSelection.append("text")
      .attr("x", 37)
      .attr("y", 22)
      .attr("fill", palette.muted)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .text(function (item) { return "w = " + item.weight; });
    itemSelection.append("text")
      .attr("x", 37)
      .attr("y", 44)
      .attr("fill", palette.ink)
      .attr("font-size", 14)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text(function (item) { return "v = " + item.value; });
  }

  function createArrayRow(className, label, y) {
    addText(svg, className + "-label", 42, y + 34, label, 14, 700, palette.ink);
    var cells = svg.append("g").attr("class", className)
      .selectAll("g.array-cell").data(d3.range(9)).enter().append("g")
      .attr("class", "array-cell")
      .attr("data-capacity", function (capacity) { return capacity; })
      .attr("transform", function (capacity) { return "translate(" + (130 + capacity * 80) + ", " + y + ")"; });
    cells.append("rect")
      .attr("width", 72)
      .attr("height", 58)
      .attr("rx", 4)
      .attr("fill", palette.white)
      .attr("stroke", palette.line)
      .attr("stroke-width", 1.5);
    cells.append("text")
      .attr("class", "array-index")
      .attr("x", 36)
      .attr("y", 21)
      .attr("fill", palette.muted)
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .text(function (capacity) { return "容量 " + capacity; });
    cells.append("text")
      .attr("class", "array-value")
      .attr("x", 36)
      .attr("y", 54)
      .attr("fill", palette.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 22)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text("0");
    return cells;
  }

  function createComparisonPanel() {
    var panel = svg.append("g").attr("class", "comparison-panel");
    panel.append("rect")
      .attr("x", 42)
      .attr("y", 334)
      .attr("width", 816)
      .attr("height", 199)
      .attr("rx", 6)
      .attr("fill", "#f2f4f2");
    panel.append("line").attr("x1", 310).attr("x2", 310).attr("y1", 397).attr("y2", 481).attr("stroke", palette.line);
    panel.append("line").attr("x1", 608).attr("x2", 608).attr("y1", 397).attr("y2", 481).attr("stroke", palette.line);
    operationTitle = addText(panel, "operation-title", 60, 370, "初始化 dp[0..8] = 0", 17, 700);
    keepText = addText(panel, "comparison-keep", 60, 431, "保留：--", 14, 600, palette.muted);
    candidateText = addText(panel, "comparison-candidate", 329, 431, "选择：--", 14, 600, palette.muted);
    resultText = addText(panel, "operation-result", 627, 431, "结果：--", 15, 700, palette.ink);
    decisionText = addText(panel, "decision-text", 60, 501, "每组最多选择一件物品", 13, 400, palette.muted);
  }

  function render_init() {
    svg = d3.select(".scene > svg:not(.explain)");
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 900 560")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "Inter, Noto Sans SC, Microsoft YaHei, sans-serif");
    addText(svg, "scene-title", 42, 35, "分组背包", 20, 700);
    addText(svg, "scene-subtitle", 42, 57, "同一分组中的物品至多选择一件，背包容量为 8", 13, 400, palette.muted);
    createLegend();
    createGroups();
    dpCells = createArrayRow("dp-array", "dp[]", 225);
    createComparisonPanel();
  }

  function render(currentStatus, requestedDelay) {
    var duration = Math.max(0, Number(requestedDelay) || 0);
    groupSelection.select(".group-rule").interrupt().transition().duration(duration)
      .attr("stroke", function (group) {
        if (currentStatus.currentGroup === group) return palette.amber;
        return currentStatus.completedGroups[group] ? palette.green : palette.line;
      });
    groupSelection.select(".group-state")
      .attr("fill", function (group) {
        if (currentStatus.currentGroup === group) return palette.amber;
        return currentStatus.completedGroups[group] ? palette.green : palette.muted;
      })
      .text(function (group) {
        if (currentStatus.currentGroup === group) return "处理中";
        return currentStatus.completedGroups[group] ? "已完成" : "待处理";
      });

    itemSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (item) {
        if (currentStatus.currentGroup === item.group && currentStatus.currentItem === item.item) return palette.amberSoft;
        if (currentStatus.completedGroups[item.group]) return palette.greenSoft;
        return palette.white;
      })
      .attr("stroke", function (item) {
        return currentStatus.currentGroup === item.group && currentStatus.currentItem === item.item ? palette.red : palette.line;
      })
      .attr("stroke-width", function (item) {
        return currentStatus.currentGroup === item.group && currentStatus.currentItem === item.item ? 3 : 1.5;
      });

    dpCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (capacity) {
        if (currentStatus.sourceCapacity === capacity) return palette.blueSoft;
        if (currentStatus.currentCapacity === capacity) return palette.amberSoft;
        return currentStatus.processedCapacities[capacity] ? palette.greenSoft : palette.white;
      })
      .attr("stroke", function (capacity) {
        if (currentStatus.sourceCapacity === capacity) return palette.blue;
        if (currentStatus.currentCapacity === capacity) return currentStatus.decision === "take" ? palette.red : palette.amber;
        return currentStatus.processedCapacities[capacity] ? palette.green : palette.line;
      })
      .attr("stroke-width", function (capacity) {
        if (currentStatus.sourceCapacity === capacity) return 3;
        return currentStatus.currentCapacity === capacity ? 3 : 1.5;
      });
    dpCells.select(".array-value").text(function (capacity) {
      return currentStatus.dp[capacity];
    });

    operationTitle.text(currentStatus.operation);
    keepText
      .attr("fill", currentStatus.keepValue === null ? palette.muted : palette.ink)
      .text(currentStatus.keepValue === null ? "保留：--" : "保留：dp[" + currentStatus.currentCapacity + "] = " + currentStatus.keepValue);
    candidateText
      .attr("fill", currentStatus.candidateValue === null ? palette.muted : palette.blue)
      .text(function () {
        if (currentStatus.decision === "skip") return "选择：当前物品装不下";
        if (currentStatus.candidateValue === null) return "选择：--";
        return "选择：dp[" + currentStatus.sourceCapacity + "] + v = " + currentStatus.candidateValue;
      });
    resultText
      .attr("fill", currentStatus.decision === "take" ? palette.red : palette.ink)
      .text(currentStatus.resultValue === null ? "结果：--" : "结果：" + currentStatus.resultValue);
    decisionText.text(function () {
      if (currentStatus.decision === "take") return "采用当前候选，更新目标容量";
      if (currentStatus.decision === "keep") return "保留现有最优值";
      if (currentStatus.decision === "skip") return "重量超过当前容量，不参与比较";
      if (currentStatus.decision === "group-done") return "本组全部容量处理完成";
      if (currentStatus.decision === "done") return "最终答案 dp[8] = 17";
      return "容量倒序保证候选来源仍属于上一组";
    });
  }

  window.render_init = render_init;
  window.render = render;
})();
