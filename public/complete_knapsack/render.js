(function () {
  "use strict";

  var items = [
    null,
    { weight: 2, value: 3 },
    { weight: 3, value: 5 },
    { weight: 4, value: 6 }
  ];
  var palette = {
    ink: "#1f2924",
    muted: "#66716b",
    line: "#cfd7d2",
    white: "#ffffff",
    green: "#236b4d",
    greenSoft: "#dcebe3",
    amber: "#a5620c",
    amberSoft: "#fff0cf",
    blue: "#28628f",
    blueSoft: "#e4eff7",
    red: "#a43b35"
  };
  var svg;
  var itemSelection;
  var dpCells;
  var operationTitle;
  var keepText;
  var candidateText;
  var resultText;
  var sourceNote;
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
    var legendItems = [
      { label: "来源状态", fill: palette.blueSoft, stroke: palette.blue },
      { label: "当前目标", fill: palette.amberSoft, stroke: palette.amber },
      { label: "本轮已处理", fill: palette.greenSoft, stroke: palette.green }
    ];
    var legend = svg.append("g").attr("transform", "translate(566, 31)");
    var entry = legend.selectAll("g").data(legendItems).enter().append("g")
      .attr("transform", function (value, index) {
        return "translate(" + (index * 108) + ", 0)";
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
      .attr("fill", palette.muted)
      .attr("font-size", 12)
      .text(function (value) { return value.label; });
  }

  function createItems() {
    itemSelection = svg.append("g").attr("class", "items")
      .selectAll("g.item-card").data(items.slice(1)).enter().append("g")
      .attr("class", "item-card")
      .attr("data-item", function (item, index) { return index + 1; })
      .attr("transform", function (item, index) {
        return "translate(" + (42 + index * 273) + ", 82)";
      });

    itemSelection.append("rect")
      .attr("width", 246)
      .attr("height", 92)
      .attr("rx", 6)
      .attr("fill", palette.white)
      .attr("stroke", palette.line)
      .attr("stroke-width", 1.5);
    itemSelection.append("text")
      .attr("class", "item-title")
      .attr("x", 18)
      .attr("y", 28)
      .attr("fill", palette.ink)
      .attr("font-size", 15)
      .attr("font-weight", 700)
      .text(function (item, index) { return "物品 " + (index + 1); });
    itemSelection.append("text")
      .attr("class", "item-state")
      .attr("x", 228)
      .attr("y", 28)
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .attr("text-anchor", "end")
      .text("待处理");
    itemSelection.append("line")
      .attr("x1", 18)
      .attr("x2", 228)
      .attr("y1", 42)
      .attr("y2", 42)
      .attr("stroke", palette.line);
    itemSelection.append("text")
      .attr("x", 18)
      .attr("y", 69)
      .attr("fill", palette.muted)
      .attr("font-size", 13)
      .text(function (item) { return "重量 " + item.weight; });
    itemSelection.append("text")
      .attr("x", 104)
      .attr("y", 69)
      .attr("fill", palette.ink)
      .attr("font-size", 13)
      .attr("font-weight", 700)
      .text(function (item) { return "价值 " + item.value; });
    itemSelection.append("text")
      .attr("x", 228)
      .attr("y", 69)
      .attr("fill", palette.green)
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("text-anchor", "end")
      .text("可重复选择");
  }

  function createDpRow() {
    addText(svg, "dp-array-label", 42, 245, "dp[]", 14, 700);
    dpCells = svg.append("g").attr("class", "dp-array")
      .selectAll("g.array-cell").data(d3.range(9)).enter().append("g")
      .attr("class", "array-cell")
      .attr("data-capacity", function (capacity) { return capacity; })
      .attr("transform", function (capacity) {
        return "translate(" + (130 + capacity * 80) + ", 211)";
      });
    dpCells.append("rect")
      .attr("width", 72)
      .attr("height", 68)
      .attr("rx", 4)
      .attr("fill", palette.white)
      .attr("stroke", palette.line)
      .attr("stroke-width", 1.5);
    dpCells.append("text")
      .attr("class", "array-index")
      .attr("x", 36)
      .attr("y", 20)
      .attr("fill", palette.muted)
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .text(function (capacity) { return "容量 " + capacity; });
    dpCells.append("text")
      .attr("class", "array-value")
      .attr("x", 36)
      .attr("y", 53)
      .attr("fill", palette.ink)
      .attr("font-family", "ui-monospace, SFMono-Regular, Consolas, monospace")
      .attr("font-size", 24)
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
      .text("0");
  }

  function createComparisonPanel() {
    var panel = svg.append("g").attr("class", "comparison-panel");
    panel.append("rect")
      .attr("x", 42)
      .attr("y", 318)
      .attr("width", 816)
      .attr("height", 215)
      .attr("rx", 6)
      .attr("fill", "#f2f4f2");
    panel.append("line")
      .attr("x1", 310).attr("x2", 310).attr("y1", 381).attr("y2", 456)
      .attr("stroke", palette.line);
    panel.append("line")
      .attr("x1", 608).attr("x2", 608).attr("y1", 381).attr("y2", 456)
      .attr("stroke", palette.line);
    operationTitle = addText(panel, "operation-title", 60, 354, "初始化 dp[0..8] = 0", 17, 700);
    keepText = addText(panel, "comparison-keep", 60, 415, "保留：--", 14, 600, palette.muted);
    candidateText = addText(panel, "comparison-candidate", 329, 415, "选择：--", 14, 600, palette.muted);
    resultText = addText(panel, "operation-result", 627, 415, "结果：--", 15, 700);
    sourceNote = addText(panel, "source-note", 60, 470, "来源状态：--", 13, 600, palette.muted);
    decisionText = addText(panel, "decision-text", 60, 507, "每种物品可以选择任意多次", 13, 400, palette.muted);
  }

  function isActiveTarget(currentStatus, capacity) {
    return currentStatus.currentCapacity === capacity &&
      ["capacity-start", "take", "keep"].indexOf(currentStatus.decision) >= 0;
  }

  function render_init() {
    svg = d3.select(".scene > svg:not(.explain)");
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 900 560")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "Inter, Noto Sans SC, Microsoft YaHei, sans-serif");
    addText(svg, "scene-title", 42, 35, "完全背包", 20, 700);
    addText(svg, "scene-subtitle", 42, 57, "容量正序枚举，同一种物品可以重复选择，背包容量为 8", 13, 400, palette.muted);
    createLegend();
    createItems();
    createDpRow();
    createComparisonPanel();
  }

  function render(currentStatus, requestedDelay) {
    var duration = Math.max(0, Number(requestedDelay) || 0);

    itemSelection.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (item, index) {
        var itemNumber = index + 1;
        if (currentStatus.currentItem === itemNumber) return palette.amberSoft;
        return currentStatus.completedItems[itemNumber] ? palette.greenSoft : palette.white;
      })
      .attr("stroke", function (item, index) {
        var itemNumber = index + 1;
        if (currentStatus.currentItem === itemNumber) return palette.amber;
        return currentStatus.completedItems[itemNumber] ? palette.green : palette.line;
      })
      .attr("stroke-width", function (item, index) {
        return currentStatus.currentItem === index + 1 ? 3 : 1.5;
      });
    itemSelection.select(".item-state")
      .attr("fill", function (item, index) {
        var itemNumber = index + 1;
        if (currentStatus.currentItem === itemNumber) return palette.amber;
        return currentStatus.completedItems[itemNumber] ? palette.green : palette.muted;
      })
      .text(function (item, index) {
        var itemNumber = index + 1;
        if (currentStatus.currentItem === itemNumber) return "处理中";
        return currentStatus.completedItems[itemNumber] ? "已完成" : "待处理";
      });

    dpCells.select("rect").interrupt().transition().duration(duration)
      .attr("fill", function (capacity) {
        if (currentStatus.sourceCapacity === capacity) return palette.blueSoft;
        if (isActiveTarget(currentStatus, capacity)) return palette.amberSoft;
        if (currentStatus.decision === "done" || currentStatus.processedCapacities[capacity]) return palette.greenSoft;
        return palette.white;
      })
      .attr("stroke", function (capacity) {
        if (currentStatus.sourceCapacity === capacity) return palette.blue;
        if (isActiveTarget(currentStatus, capacity)) {
          return currentStatus.decision === "take" ? palette.red : palette.amber;
        }
        if (currentStatus.decision === "done" || currentStatus.processedCapacities[capacity]) return palette.green;
        return palette.line;
      })
      .attr("stroke-width", function (capacity) {
        if (currentStatus.sourceCapacity === capacity || isActiveTarget(currentStatus, capacity)) return 3;
        return 1.5;
      });
    dpCells.select(".array-value").text(function (capacity) {
      return currentStatus.dp[capacity];
    });

    operationTitle.text(currentStatus.operation);
    keepText
      .attr("fill", currentStatus.keepValue === null ? palette.muted : palette.ink)
      .text(currentStatus.keepValue === null
        ? "保留：--"
        : "保留：dp[" + currentStatus.currentCapacity + "] = " + currentStatus.keepValue);
    candidateText
      .attr("fill", currentStatus.candidateValue === null ? palette.muted : palette.blue)
      .text(currentStatus.candidateValue === null
        ? "选择：--"
        : "选择：dp[" + currentStatus.sourceCapacity + "] + v = " + currentStatus.candidateValue);
    resultText
      .attr("fill", currentStatus.decision === "take" ? palette.red : palette.ink)
      .text(currentStatus.resultValue === null ? "结果：--" : "结果：" + currentStatus.resultValue);
    sourceNote
      .attr("fill", currentStatus.sourceUsesCurrentItem ? palette.blue : palette.muted)
      .text(function () {
        if (currentStatus.sourceCapacity === null) return "来源状态：--";
        if (currentStatus.sourceUsesCurrentItem) {
          return "来源状态：dp[" + currentStatus.sourceCapacity + "] 已包含当前物品，可以再次选择";
        }
        return "来源状态：dp[" + currentStatus.sourceCapacity + "] 本轮尚未使用当前物品";
      });
    decisionText.text(function () {
      if (currentStatus.decision === "take") return "候选值更大，更新目标容量";
      if (currentStatus.decision === "keep") return "原值更优或相等，保留现有最优值";
      if (currentStatus.decision === "capacity-done") return "当前容量处理完成，继续向更大的容量移动";
      if (currentStatus.decision === "item-done") return "当前物品的全部可用容量处理完成";
      if (currentStatus.decision === "done") return "最终答案 dp[8] = 13";
      if (currentStatus.decision === "item-start") return "容量正序枚举，使后面的状态可以读取本轮刚更新的 dp";
      if (currentStatus.decision === "capacity-start") return "读取来源状态，准备计算 max(dp[j], dp[j-weight] + value)";
      return "每种物品可以选择任意多次";
    });
  }

  window.render_init = render_init;
  window.render = render;
})();
