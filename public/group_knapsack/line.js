(function () {
  "use strict";

  var groups = [
    null,
    [{ weight: 2, value: 6 }, { weight: 3, value: 7 }],
    [{ weight: 2, value: 4 }, { weight: 4, value: 8 }, { weight: 5, value: 9 }],
    [{ weight: 1, value: 2 }, { weight: 3, value: 6 }]
  ];
  var frames;
  var status;

  function createStatus() {
    return {
      dp: new Array(9).fill(0),
      processedCapacities: new Array(9).fill(false),
      completedGroups: [false, false, false, false],
      currentGroup: null,
      currentCapacity: null,
      currentItem: null,
      sourceCapacity: null,
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
      completedGroups: status.completedGroups.slice(),
      currentGroup: status.currentGroup,
      currentCapacity: status.currentCapacity,
      currentItem: status.currentItem,
      sourceCapacity: status.sourceCapacity,
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

  function compareCandidate(group, item, currentCapacity) {
    var product = groups[group][item - 1];
    status.currentItem = item;
    status.keepValue = status.dp[currentCapacity];
    status.resultValue = status.dp[currentCapacity];

    if (product.weight > currentCapacity) {
      status.sourceCapacity = null;
      status.candidateValue = null;
      status.decision = "skip";
      stop(26, 26, "第 " + item + " 件物品重量为 " + product.weight + "，超过当前容量 " + currentCapacity + "，跳过它。");
      return;
    }

    status.sourceCapacity = currentCapacity - product.weight;
    status.candidateValue = status.dp[status.sourceCapacity] + product.value;
    status.resultValue = Math.max(status.keepValue, status.candidateValue);
    status.decision = status.candidateValue > status.keepValue ? "take" : "keep";
    status.dp[currentCapacity] = status.resultValue;

    var relation = status.decision === "take" ? "选择当前物品更优" : "保留原值更优或相等";
    stop(26, 30,
      "容量 " + currentCapacity + "：max(" + status.keepValue + ", dp[" + status.sourceCapacity + "] + " + product.value + " = " + status.candidateValue + ") = " + status.resultValue + "，" + relation + "。"
    );
  }

  function run() {
    frames = [];
    status = createStatus();
    stop(38, 38, "调用 groupedKnapsack()，背包容量为 8，每个分组最多选择一件物品。");

    for (var group = 1; group <= 3; group += 1) {
      status.currentGroup = group;
      status.currentCapacity = null;
      status.currentItem = null;
      status.sourceCapacity = null;
      status.keepValue = null;
      status.candidateValue = null;
      status.resultValue = null;
      status.processedCapacities = new Array(9).fill(false);
      status.decision = "group-start";
      status.operation = "开始处理第 " + group + " 组，共 " + groups[group].length + " 件候选物品";
      stop(23, 23, status.operation + "；容量将从 8 倒序枚举，确保候选来源尚未被当前组更新。");

      for (var currentCapacity = 8; currentCapacity >= 0; currentCapacity -= 1) {
        status.currentCapacity = currentCapacity;
        status.currentItem = null;
        status.sourceCapacity = null;
        status.keepValue = status.dp[currentCapacity];
        status.candidateValue = null;
        status.resultValue = status.dp[currentCapacity];
        status.decision = "capacity-start";
        status.operation = "第 " + group + " 组：计算容量 " + currentCapacity;
        stop(24, 24, "容量从大到小枚举，现在计算 dp[" + currentCapacity + "]；较小容量仍保存上一组结果。");

        for (var item = 1; item <= groups[group].length; item += 1) {
          compareCandidate(group, item, currentCapacity);
        }

        status.currentItem = null;
        status.sourceCapacity = null;
        status.keepValue = null;
        status.candidateValue = null;
        status.resultValue = status.dp[currentCapacity];
        status.processedCapacities[currentCapacity] = true;
        status.decision = "capacity-done";
        stop(24, 24, "容量 " + currentCapacity + " 的所有组内候选均已比较，最终 dp[" + currentCapacity + "] = " + status.dp[currentCapacity] + "。");
      }

      status.completedGroups[group] = true;
      status.currentCapacity = null;
      status.currentItem = null;
      status.sourceCapacity = null;
      status.resultValue = null;
      status.decision = "group-done";
      status.operation = "第 " + group + " 组处理完成";
      stop(23, 23, status.operation + "，当前 dp = [" + status.dp.join(", ") + "]。");
    }

    status.currentGroup = null;
    status.currentCapacity = 8;
    status.currentItem = null;
    status.sourceCapacity = null;
    status.keepValue = null;
    status.candidateValue = null;
    status.resultValue = status.dp[8];
    status.decision = "done";
    status.operation = "全部分组处理完成，最优值为 " + status.dp[8];
    stop(39, 39, "输出 dp[8] = " + status.dp[8] + "，分组背包计算结束。");
    return frames;
  }

  window.lineExports = {
    init: run,
    clear: function () {
      status = createStatus();
    }
  };
})();
