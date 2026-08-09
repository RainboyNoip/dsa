(function () {
  "use strict";

  var input = [null, 1, 2, 3, 4, 5];
  var frames;
  var status;

  function createStatus() {
    return {
      inputValues: input.slice(),
      treeValues: new Array(10).fill(null),
      nodeStates: new Array(10).fill(0),
      ranges: new Array(10).fill(null),
      activeNode: null,
      activeInput: null
    };
  }

  function snapshot() {
    return {
      inputValues: status.inputValues.slice(),
      treeValues: status.treeValues.slice(),
      nodeStates: status.nodeStates.slice(),
      ranges: status.ranges.map(function (range) {
        return range ? { left: range.left, right: range.right } : null;
      }),
      activeNode: status.activeNode,
      activeInput: status.activeInput
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

  function leftChild(rt) {
    return rt << 1;
  }

  function rightChild(rt) {
    return (rt << 1) | 1;
  }

  function build(left, right, rt) {
    status.activeNode = rt;
    status.ranges[rt] = { left: left, right: right };
    status.nodeStates[rt] = 1;
    stop(45, 45, "进入 build(" + left + ", " + right + ", " + rt + ")，节点 " + rt + " 负责区间 [" + left + ", " + right + "]。");

    stop(46, 46, "判断区间 [" + left + ", " + right + "] 是否只包含一个元素。");
    if (left === right) {
      status.activeInput = left;
      stop(47, 47, "到达叶子节点，从输入数组读取第 " + left + " 个值 " + input[left] + "。");

      status.treeValues[rt] = input[left];
      status.nodeStates[rt] = 2;
      stop(47, 48, "令 st[" + rt + "] = " + input[left] + "，叶子节点构建完成并返回。");
      status.activeInput = null;
      return;
    }

    var middle = (left + right) >> 1;
    stop(50, 50, "计算中点 m = (" + left + " + " + right + ") / 2 = " + middle + "。");

    status.activeNode = rt;
    stop(51, 51, "递归构建左孩子 " + leftChild(rt) + "，对应区间 [" + left + ", " + middle + "]。");
    build(left, middle, leftChild(rt));

    status.activeNode = rt;
    stop(51, 51, "左子树已返回节点 " + rt + "，st[" + leftChild(rt) + "] = " + status.treeValues[leftChild(rt)] + "。");

    stop(52, 52, "递归构建右孩子 " + rightChild(rt) + "，对应区间 [" + (middle + 1) + ", " + right + "]。");
    build(middle + 1, right, rightChild(rt));

    status.activeNode = rt;
    stop(52, 52, "右子树已返回节点 " + rt + "，st[" + rightChild(rt) + "] = " + status.treeValues[rightChild(rt)] + "。");

    status.treeValues[rt] = status.treeValues[leftChild(rt)] + status.treeValues[rightChild(rt)];
    status.nodeStates[rt] = 2;
    stop(53, 53, "执行 pushup：st[" + rt + "] = " + status.treeValues[leftChild(rt)] + " + " + status.treeValues[rightChild(rt)] + " = " + status.treeValues[rt] + "。");
  }

  function run() {
    frames = [];
    status = createStatus();
    stop(58, 58, "读入 n = 5，准备从根节点 build(1, 5, 1) 开始建树。");
    build(1, 5, 1);
    status.activeNode = null;
    stop(58, 58, "建树完成，根节点 st[1] = 15，表示区间 [1, 5] 的元素和。");
    return frames;
  }

  window.lineExports = {
    init: run,
    clear: function () {
      status = createStatus();
    }
  };
})();
