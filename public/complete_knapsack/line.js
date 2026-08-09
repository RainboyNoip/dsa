(function () {
  "use strict";

  var items = [
    null,
    { weight: 2, value: 3 },
    { weight: 3, value: 5 },
    { weight: 4, value: 6 }
  ];
  var frames;
  var status;

  function createStatus() {
    return {
      dp: new Array(9).fill(0),
      processedCapacities: new Array(9).fill(false),
      completedItems: [false, false, false, false],
      currentItem: null,
      currentCapacity: null,
      sourceCapacity: null,
      sourceUsesCurrentItem: false,
      keepValue: null,
      candidateValue: null,
      resultValue: null,
      decision: "idle",
      operation: "初始化 dp[0..8] = 0"
    };
  }

  function snapshot() {
    return {
      dp: status.dp.slice(),
      processedCapacities: status.processedCapacities.slice(),
      completedItems: status.completedItems.slice(),
      currentItem: status.currentItem,
      currentCapacity: status.currentCapacity,
      sourceCapacity: status.sourceCapacity,
      sourceUsesCurrentItem: status.sourceUsesCurrentItem,
      keepValue: status.keepValue,
      candidateValue: status.candidateValue,
      resultValue: status.resultValue,
      decision: status.decision,
      operation: status.operation
    };
  }

  function stop(firstLine, lastLine, log) {
    frames.push({
      status: snapshot(),
      line: firstLine,
      hls: firstLine,
      hlt: lastLine,
      log: log || "",
      id: frames.length
    });
  }

  function run() {
    frames = [];
    status = createStatus();
    stop(25, 25, "调用 completeKnapsack()，背包容量为 8，每种物品可以选择任意多次。");

    for (var item = 1; item <= 3; item += 1) {
      var product = items[item];
      var currentItemUsage = new Array(9).fill(false);
      status.currentItem = item;
      status.currentCapacity = null;
      status.sourceCapacity = null;
      status.sourceUsesCurrentItem = false;
      status.keepValue = null;
      status.candidateValue = null;
      status.resultValue = null;
      status.processedCapacities = new Array(9).fill(false);
      status.decision = "item-start";
      status.operation = "开始处理物品 " + item + "：重量 " + product.weight + "，价值 " + product.value;
      stop(12, 12, status.operation + "；容量将从 " + product.weight + " 正序枚举到 8。");

      for (var currentCapacity = product.weight; currentCapacity <= 8; currentCapacity += 1) {
        status.currentCapacity = currentCapacity;
        status.sourceCapacity = currentCapacity - product.weight;
        status.sourceUsesCurrentItem = currentItemUsage[status.sourceCapacity];
        status.keepValue = status.dp[currentCapacity];
        status.candidateValue = null;
        status.resultValue = status.dp[currentCapacity];
        status.decision = "capacity-start";
        status.operation = "物品 " + item + "：计算容量 " + currentCapacity;
        stop(13, 15,
          "容量正序到达 " + currentCapacity + "，候选来源是 dp[" + status.sourceCapacity + "]" +
          (status.sourceUsesCurrentItem ? "，该位置已由当前物品更新，可以继续复用它。" : "。")
        );

        status.candidateValue = status.dp[status.sourceCapacity] + product.value;
        status.resultValue = Math.max(status.keepValue, status.candidateValue);
        status.decision = status.candidateValue > status.keepValue ? "take" : "keep";
        status.dp[currentCapacity] = status.resultValue;
        currentItemUsage[currentCapacity] = status.decision === "take";
        stop(16, 19,
          "容量 " + currentCapacity + "：max(" + status.keepValue + ", dp[" + status.sourceCapacity + "] + " + product.value + " = " + status.candidateValue + ") = " + status.resultValue + "。"
        );

        status.processedCapacities[currentCapacity] = true;
        status.decision = "capacity-done";
        stop(15, 15, "dp[" + currentCapacity + "] 已确定为 " + status.dp[currentCapacity] + "，继续处理更大的容量。");
      }

      status.completedItems[item] = true;
      status.currentCapacity = null;
      status.sourceCapacity = null;
      status.sourceUsesCurrentItem = false;
      status.keepValue = null;
      status.candidateValue = null;
      status.resultValue = null;
      status.decision = "item-done";
      status.operation = "物品 " + item + " 处理完成";
      stop(12, 12, status.operation + "，当前 dp = [" + status.dp.join(", ") + "]。");
    }

    status.currentItem = null;
    status.currentCapacity = 8;
    status.sourceCapacity = null;
    status.sourceUsesCurrentItem = false;
    status.keepValue = null;
    status.candidateValue = null;
    status.resultValue = status.dp[8];
    status.decision = "done";
    status.operation = "全部物品处理完成，最优值为 " + status.dp[8];
    stop(26, 26, "输出 dp[8] = " + status.dp[8] + "，完全背包计算结束。");
    return frames;
  }

  window.lineExports = {
    init: run,
    clear: function () {
      status = createStatus();
    }
  };
})();
