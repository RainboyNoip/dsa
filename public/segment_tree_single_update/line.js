(function () {
  "use strict";

  var initialInput = [null, 1, 2, 3, 4, 5];
  var operations = [
    { position: 3, value: 8 },
    { position: 5, value: 1 }
  ];
  var frames;
  var status;

  function createStatus() {
    return {
      inputValues: initialInput.slice(),
      treeValues: new Array(10).fill(null),
      ranges: new Array(10).fill(null),
      visitedNodes: new Array(10).fill(0),
      activeNode: null,
      activeKind: "idle",
      operation: "初始线段树",
      targetIndex: null,
      updateValue: null
    };
  }

  function snapshot() {
    return {
      inputValues: status.inputValues.slice(),
      treeValues: status.treeValues.slice(),
      ranges: status.ranges.map(function (range) {
        return range ? { left: range.left, right: range.right } : null;
      }),
      visitedNodes: status.visitedNodes.slice(),
      activeNode: status.activeNode,
      activeKind: status.activeKind,
      operation: status.operation,
      targetIndex: status.targetIndex,
      updateValue: status.updateValue
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

  function buildInitial(left, right, rt) {
    status.ranges[rt] = { left: left, right: right };
    if (left === right) {
      status.treeValues[rt] = status.inputValues[left];
      return;
    }
    var middle = (left + right) >> 1;
    buildInitial(left, middle, rt << 1);
    buildInitial(middle + 1, right, rt << 1 | 1);
    status.treeValues[rt] = status.treeValues[rt << 1] + status.treeValues[rt << 1 | 1];
  }

  function setActive(rt, kind) {
    status.activeNode = rt;
    status.activeKind = kind;
    if (status.visitedNodes[rt] === 0) status.visitedNodes[rt] = 1;
  }

  function update(position, value, left, right, rt) {
    setActive(rt, "visit");
    stop(21, 21, "update 到达节点 " + rt + "，当前区间是 [" + left + ", " + right + "]。");

    stop(22, 22, "判断当前节点是否为目标叶子。");
    if (left === right) {
      status.treeValues[rt] = value;
      status.inputValues[position] = value;
      status.visitedNodes[rt] = 2;
      setActive(rt, "write");
      stop(23, 24, "找到位置 " + position + "，令 tree[" + rt + "] = " + value + " 并返回。");
      return;
    }

    var middle = (left + right) >> 1;
    stop(26, 26, "计算中点 middle = " + middle + "。");
    stop(27, 27, "比较 position = " + position + " 与 middle = " + middle + "，选择递归方向。");
    if (position <= middle) {
      stop(28, 28, "目标位置在左半区间，递归进入左孩子 " + (rt << 1) + "。");
      update(position, value, left, middle, rt << 1);
    } else {
      stop(30, 30, "目标位置在右半区间，递归进入右孩子 " + (rt << 1 | 1) + "。");
      update(position, value, middle + 1, right, rt << 1 | 1);
    }

    status.treeValues[rt] = status.treeValues[rt << 1] + status.treeValues[rt << 1 | 1];
    status.visitedNodes[rt] = 2;
    setActive(rt, "pushup");
    stop(32, 32, "返回节点 " + rt + " 并执行 pushup，区间和更新为 " + status.treeValues[rt] + "。");
  }

  function run() {
    frames = [];
    status = createStatus();
    buildInitial(1, 5, 1);
    stop(38, 38, "初始数组为 [1, 2, 3, 4, 5]，线段树构建完成。");

    operations.forEach(function (operation, index) {
      status.visitedNodes = new Array(10).fill(0);
      status.targetIndex = operation.position;
      status.updateValue = operation.value;
      status.operation = "操作 " + (index + 1) + "：把 a[" + operation.position + "] 修改为 " + operation.value;
      status.activeNode = null;
      status.activeKind = "idle";
      stop(43, 43, status.operation + "，从根节点开始查找。");
      update(operation.position, operation.value, 1, 5, 1);
      status.activeNode = null;
      status.activeKind = "done";
      stop(43, 43, status.operation + " 完成，根节点区间和为 " + status.treeValues[1] + "。");
    });
    return frames;
  }

  window.lineExports = {
    init: run,
    clear: function () {
      status = createStatus();
    }
  };
})();
