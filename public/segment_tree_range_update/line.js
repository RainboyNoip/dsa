(function () {
  "use strict";

  var initialInput = [null, 1, 2, 3, 4, 5];
  var operations = [
    { type: "update", left: 1, right: 3, value: 8 },
    { type: "query", left: 1, right: 3 },
    { type: "update", left: 1, right: 2, value: 5 },
    { type: "query", left: 1, right: 4 }
  ];
  var frames;
  var status;

  function createStatus() {
    return {
      inputValues: initialInput.slice(),
      treeValues: new Array(10).fill(null),
      lazyValues: new Array(10).fill(null),
      ranges: new Array(10).fill(null),
      visitedNodes: new Array(10).fill(0),
      activeNode: null,
      activeKind: "idle",
      operation: "初始线段树",
      operationType: "idle",
      targetRange: null,
      updateValue: null,
      runningTotal: null,
      queryResult: null
    };
  }

  function snapshot() {
    return {
      inputValues: status.inputValues.slice(),
      treeValues: status.treeValues.slice(),
      lazyValues: status.lazyValues.slice(),
      ranges: status.ranges.map(function (range) {
        return range ? { left: range.left, right: range.right } : null;
      }),
      visitedNodes: status.visitedNodes.slice(),
      activeNode: status.activeNode,
      activeKind: status.activeKind,
      operation: status.operation,
      operationType: status.operationType,
      targetRange: status.targetRange ? {
        left: status.targetRange.left,
        right: status.targetRange.right
      } : null,
      updateValue: status.updateValue,
      runningTotal: status.runningTotal,
      queryResult: status.queryResult
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
    if (rt !== null && status.visitedNodes[rt] === 0) status.visitedNodes[rt] = 1;
  }

  function applyNode(rt, value) {
    var range = status.ranges[rt];
    setActive(rt, "apply");
    stop(16, 16, "进入 apply，准备把节点 " + rt + " 的整个区间赋值为 " + value + "。");

    status.treeValues[rt] = (range.right - range.left + 1) * value;
    status.lazyValues[rt] = value;
    status.visitedNodes[rt] = 2;
    for (var index = range.left; index <= range.right; index += 1) {
      status.inputValues[index] = value;
    }
    stop(17, 19, "更新 Node " + rt + "：sum = " + status.treeValues[rt] + "，lazy = " + value + "，has_lazy = true。");
  }

  function pushdown(rt, callLine) {
    setActive(rt, "pushdown");
    stop(callLine, callLine, "调用 pushdown(" + rt + ")，检查当前节点是否有待下传的赋值标记。");

    if (status.lazyValues[rt] === null) {
      stop(23, 23, "节点 " + rt + " 没有懒标记，直接返回。");
      return;
    }

    var value = status.lazyValues[rt];
    stop(23, 23, "节点 " + rt + " 保存着 lazy = " + value + "，需要下传给两个孩子。");
    setActive(rt << 1, "pushdown");
    stop(24, 24, "把标记 " + value + " 下传给左孩子 " + (rt << 1) + "。");
    applyNode(rt << 1, value);
    setActive(rt << 1 | 1, "pushdown");
    stop(25, 25, "把标记 " + value + " 下传给右孩子 " + (rt << 1 | 1) + "。");
    applyNode(rt << 1 | 1, value);

    status.lazyValues[rt] = null;
    setActive(rt, "pushdown");
    stop(26, 26, "两个孩子已经同步，清除节点 " + rt + " 的懒标记。");
  }

  function update(queryLeft, queryRight, value, rt) {
    var range = status.ranges[rt];
    setActive(rt, "visit");
    stop(43, 43, "update 到达节点 " + rt + "，它负责区间 [" + range.left + ", " + range.right + "]。");

    stop(44, 44, "判断 [" + range.left + ", " + range.right + "] 是否被目标区间 [" + queryLeft + ", " + queryRight + "] 完全覆盖。");
    if (queryLeft <= range.left && range.right <= queryRight) {
      stop(45, 45, "当前区间被完全覆盖，调用 apply(" + rt + ", " + value + ")。");
      applyNode(rt, value);
      setActive(rt, "return");
      stop(46, 46, "节点 " + rt + " 更新完成，返回上一层。");
      return;
    }

    pushdown(rt, 48);
    setActive(rt, "visit");
    var middle = (range.left + range.right) >> 1;
    stop(49, 49, "计算节点 " + rt + " 的中点 middle = " + middle + "。");

    stop(50, 50, "判断目标区间是否与左孩子区间相交。");
    if (queryLeft <= middle) {
      update(queryLeft, queryRight, value, rt << 1);
      setActive(rt, "return");
      stop(50, 50, "左孩子更新完成，返回节点 " + rt + "。");
    }

    stop(51, 51, "判断目标区间是否与右孩子区间相交。");
    if (queryRight > middle) {
      update(queryLeft, queryRight, value, rt << 1 | 1);
      setActive(rt, "return");
      stop(51, 51, "右孩子更新完成，返回节点 " + rt + "。");
    }

    status.treeValues[rt] = status.treeValues[rt << 1] + status.treeValues[rt << 1 | 1];
    status.visitedNodes[rt] = 2;
    setActive(rt, "pushup");
    stop(52, 52, "执行 pushup：节点 " + rt + " 的 sum 更新为 " + status.treeValues[rt] + "。");
  }

  function query(queryLeft, queryRight, rt) {
    var range = status.ranges[rt];
    setActive(rt, "query");
    stop(55, 55, "query 到达节点 " + rt + "，它负责区间 [" + range.left + ", " + range.right + "]。");

    stop(56, 56, "判断当前区间是否被查询区间 [" + queryLeft + ", " + queryRight + "] 完全覆盖。");
    if (queryLeft <= range.left && range.right <= queryRight) {
      status.visitedNodes[rt] = 2;
      setActive(rt, "result");
      stop(57, 57, "完整命中节点 " + rt + "，直接返回 sum = " + status.treeValues[rt] + "。");
      return status.treeValues[rt];
    }

    pushdown(rt, 59);
    var answer = 0;
    status.runningTotal = answer;
    setActive(rt, "query");
    stop(60, 60, "当前节点只被部分覆盖，先令 answer = 0。");

    var middle = (range.left + range.right) >> 1;
    stop(61, 61, "计算节点 " + rt + " 的中点 middle = " + middle + "。");
    stop(62, 62, "判断是否需要查询左孩子。");
    if (queryLeft <= middle) {
      answer += query(queryLeft, queryRight, rt << 1);
      status.runningTotal = answer;
      setActive(rt, "return");
      stop(62, 62, "左孩子返回，当前累计结果为 " + answer + "。");
    }

    stop(63, 63, "判断是否需要查询右孩子。");
    if (queryRight > middle) {
      answer += query(queryLeft, queryRight, rt << 1 | 1);
      status.runningTotal = answer;
      setActive(rt, "return");
      stop(63, 63, "右孩子返回，当前累计结果为 " + answer + "。");
    }

    status.visitedNodes[rt] = 2;
    setActive(rt, "result");
    stop(64, 64, "节点 " + rt + " 汇总完成，返回 answer = " + answer + "。");
    return answer;
  }

  function beginOperation(operation, index) {
    status.visitedNodes = new Array(10).fill(0);
    status.activeNode = null;
    status.activeKind = "idle";
    status.operationType = operation.type;
    status.targetRange = { left: operation.left, right: operation.right };
    status.updateValue = operation.type === "update" ? operation.value : null;
    status.runningTotal = operation.type === "query" ? 0 : null;
    status.queryResult = null;
    status.operation = operation.type === "update"
      ? "操作 " + (index + 1) + "：区间 [" + operation.left + ", " + operation.right + "] 赋值为 " + operation.value
      : "操作 " + (index + 1) + "：查询区间 [" + operation.left + ", " + operation.right + "] 的元素和";
  }

  function run() {
    frames = [];
    status = createStatus();
    buildInitial(1, 5, 1);
    stop(70, 70, "初始数组为 [1, 2, 3, 4, 5]，struct 线段树已经构建完成。");

    operations.forEach(function (operation, index) {
      beginOperation(operation, index);
      if (operation.type === "update") {
        stop(78, 78, status.operation + "，从根节点开始递归。");
        update(operation.left, operation.right, operation.value, 1);
        status.activeNode = null;
        status.activeKind = "done";
        stop(78, 78, status.operation + " 完成。");
      } else {
        stop(82, 82, status.operation + "，从根节点开始递归。");
        var answer = query(operation.left, operation.right, 1);
        status.queryResult = answer;
        status.runningTotal = answer;
        status.activeNode = null;
        status.activeKind = "done";
        stop(82, 82, "查询完成，区间 [" + operation.left + ", " + operation.right + "] 的元素和为 " + answer + "。");
      }
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
