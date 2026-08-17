(function () {
  "use strict";

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
  var directions = [
    { dx: 0, dy: 1, name: "向右" },
    { dx: 0, dy: -1, name: "向左" },
    { dx: 1, dy: 0, name: "向下" },
    { dx: -1, dy: 0, name: "向上" }
  ];
  var frames;
  var status;

  function createMatrix(value) {
    return Array.from({ length: 8 }, function () {
      return new Array(8).fill(value);
    });
  }

  function copyPoint(point) {
    return point ? { x: point.x, y: point.y } : null;
  }

  function createStatus() {
    return {
      maze: maze.map(function (row) { return row.slice(); }),
      dis: createMatrix(0),
      processed: createMatrix(false),
      queue: [],
      head: 0,
      tail: 0,
      current: null,
      currentIndex: null,
      candidate: null,
      direction: null,
      candidateState: null,
      phase: "init",
      operation: "读取 8 × 8 迷宫，起点为 (2,1)，终点为 (7,8)",
      result: null,
      targetDistance: 0
    };
  }

  function snapshot() {
    return {
      maze: status.maze.map(function (row) { return row.slice(); }),
      dis: status.dis.map(function (row) { return row.slice(); }),
      processed: status.processed.map(function (row) { return row.slice(); }),
      queue: status.queue.map(function (point) { return copyPoint(point); }),
      head: status.head,
      tail: status.tail,
      current: copyPoint(status.current),
      currentIndex: status.currentIndex,
      candidate: copyPoint(status.candidate),
      direction: status.direction,
      candidateState: status.candidateState,
      phase: status.phase,
      operation: status.operation,
      result: status.result,
      targetDistance: status.targetDistance
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

  function push(point) {
    status.queue.push(copyPoint(point));
    status.tail += 1;
  }

  function inside(point) {
    return point.x >= 1 && point.x <= 8 && point.y >= 1 && point.y <= 8;
  }

  function pointText(point) {
    return "(" + point.x + "," + point.y + ")";
  }

  function run() {
    frames = [];
    status = createStatus();
    stop(59, 59, "读入迷宫：n = 8，起点 (2,1)，终点 (7,8)。");

    status.phase = "call";
    status.operation = "调用 bfs(2,1)";
    stop(60, 60, "从起点 (2,1) 开始广度优先搜索。");

    push({ x: 2, y: 1 });
    status.phase = "push";
    status.operation = "起点写入 a[0]，tail 从 0 移到 1";
    stop(38, 38, "push({2,1})：起点进入队尾，当前队列区间为 [0,1)。");

    status.dis[1][0] = 1;
    status.phase = "distance";
    status.operation = "设置起点距离 dis[2][1] = 1";
    stop(39, 39, "起点的距离记为 1；之后入队节点的距离等于父节点距离加 1。");

    while (status.head !== status.tail) {
      status.current = null;
      status.currentIndex = null;
      status.candidate = null;
      status.direction = null;
      status.candidateState = null;
      status.phase = "while";
      status.operation = "队列非空，继续处理 a[" + status.head + "]";
      stop(41, 41, "head = " + status.head + "，tail = " + status.tail + "，队列非空。");

      status.currentIndex = status.head;
      status.current = copyPoint(status.queue[status.head]);
      status.phase = "front";
      status.operation = "读取队首 a[" + status.head + "] = " + pointText(status.current);
      stop(42, 42, "front() 读取队首 " + pointText(status.current) + "，但此时 head 尚未移动。");

      status.head += 1;
      status.phase = "pop";
      status.operation = "pop()：head 前移到 " + status.head;
      stop(43, 43, "弹出 " + pointText(status.current) + "；有效队列区间变为 [" + status.head + "," + status.tail + ")。");

      for (var directionIndex = 0; directionIndex < directions.length; directionIndex += 1) {
        var direction = directions[directionIndex];
        var candidate = {
          x: status.current.x + direction.dx,
          y: status.current.y + direction.dy
        };
        status.candidate = candidate;
        status.direction = direction.name;
        status.candidateState = "checking";
        status.phase = "neighbor";
        status.operation = direction.name + "考察邻格 " + pointText(candidate);
        stop(45, 47, direction.name + "：由 " + pointText(status.current) + " 得到邻格 " + pointText(candidate) + "。");

        if (!inside(candidate)) {
          status.candidateState = "out-of-bounds";
          status.phase = "reject";
          status.operation = pointText(candidate) + " 越界，跳过";
          stop(48, 48, pointText(candidate) + " 不在 1..8 的迷宫范围内，不入队。");
          continue;
        }

        if (status.maze[candidate.x - 1][candidate.y - 1] === 1) {
          status.candidateState = "wall";
          status.phase = "reject";
          status.operation = pointText(candidate) + " 是墙，跳过";
          stop(49, 49, pointText(candidate) + " 的 maze 值为 1，是墙，不入队。");
          continue;
        }

        if (status.dis[candidate.x - 1][candidate.y - 1] !== 0) {
          status.candidateState = "visited";
          status.phase = "reject";
          status.operation = pointText(candidate) + " 已访问，跳过";
          stop(50, 50, pointText(candidate) + " 的 dis 已非 0，说明已经发现过，不重复入队。");
          continue;
        }

        var nextDistance = status.dis[status.current.x - 1][status.current.y - 1] + 1;
        status.dis[candidate.x - 1][candidate.y - 1] = nextDistance;
        status.candidateState = "discovered";
        status.phase = "distance";
        status.operation = "设置 dis[" + candidate.x + "][" + candidate.y + "] = " + nextDistance;
        stop(52, 52, pointText(candidate) + " 首次被发现，距离更新为 " + nextDistance + "。");

        var insertionIndex = status.tail;
        push(candidate);
        status.phase = "push";
        status.operation = pointText(candidate) + " 写入 a[" + insertionIndex + "]，tail = " + status.tail;
        stop(53, 53, "push(" + pointText(candidate) + ")：节点进入队尾，队列区间变为 [" + status.head + "," + status.tail + ")。");
      }

      status.processed[status.current.x - 1][status.current.y - 1] = true;
      status.candidate = null;
      status.direction = null;
      status.candidateState = null;
      status.phase = "node-done";
      status.operation = pointText(status.current) + " 的四个方向均已处理";
      stop(45, 54, pointText(status.current) + " 扩展完成；BFS 将读取当前 head 指向的下一个队首。");
    }

    status.current = null;
    status.currentIndex = null;
    status.candidate = null;
    status.direction = null;
    status.candidateState = null;
    status.phase = "empty";
    status.operation = "head == tail == " + status.head + "，队列为空";
    stop(41, 41, "所有可达节点均已出队，BFS 结束。");

    status.targetDistance = status.dis[6][7];
    status.result = status.targetDistance !== 0 ? "YES" : "NO";
    status.phase = "done";
    status.operation = "输出 " + status.result + "，dis[7][8] = " + status.targetDistance;
    stop(61, 65, "终点可达，输出 YES 和最短层数 dis[7][8] = " + status.targetDistance + "。");

    return frames;
  }

  window.lineExports = {
    init: run,
    clear: function () {
      status = createStatus();
    }
  };
})();
