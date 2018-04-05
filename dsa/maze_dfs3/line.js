var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

var maze_data = [
[{x:1,y:1,val:1},{x:1,y:2,val:1},{x:1,y:3,val:1},{x:1,y:4,val:1},{x:1,y:5,val:1},{x:1,y:6,val:1},{x:1,y:7,val:1},{x:1,y:8,val:1}],
[{x:2,y:1,val:0},{x:2,y:2,val:0},{x:2,y:3,val:0},{x:2,y:4,val:0},{x:2,y:5,val:0},{x:2,y:6,val:0},{x:2,y:7,val:0},{x:2,y:8,val:1}],
[{x:3,y:1,val:1},{x:3,y:2,val:1},{x:3,y:3,val:0},{x:3,y:4,val:1},{x:3,y:5,val:0},{x:3,y:6,val:1},{x:3,y:7,val:0},{x:3,y:8,val:1}],
[{x:4,y:1,val:1},{x:4,y:2,val:0},{x:4,y:3,val:0},{x:4,y:4,val:1},{x:4,y:5,val:0},{x:4,y:6,val:1},{x:4,y:7,val:0},{x:4,y:8,val:1}],
[{x:5,y:1,val:1},{x:5,y:2,val:0},{x:5,y:3,val:1},{x:5,y:4,val:1},{x:5,y:5,val:0},{x:5,y:6,val:0},{x:5,y:7,val:0},{x:5,y:8,val:1}],
[{x:6,y:1,val:1},{x:6,y:2,val:0},{x:6,y:3,val:0},{x:6,y:4,val:0},{x:6,y:5,val:0},{x:6,y:6,val:1},{x:6,y:7,val:1},{x:6,y:8,val:1}],
[{x:7,y:1,val:1},{x:7,y:2,val:1},{x:7,y:3,val:0},{x:7,y:4,val:1},{x:7,y:5,val:0},{x:7,y:6,val:0},{x:7,y:7,val:0},{x:7,y:8,val:0}],
[{x:8,y:1,val:1},{x:8,y:2,val:1},{x:8,y:3,val:1},{x:8,y:4,val:1},{x:8,y:5,val:1},{x:8,y:6,val:1},{x:8,y:7,val:1},{x:8,y:8,val:1}],
]
var cnt = [{val:0,change:false}];

/* 数据描述--结束*/

/* ---- 数据生成主体 */
/*  0 可走点
 *  1 不可走点
 *  2 正在访问的点
 *  3 已经访问过的点
 *  4 尝试走的点
 * */

endx = 7
endy = 8
mgSize = 8
fx = [ [-1,0], [0,1], [1,0], [0,-1] ]

_stack_ = []

function setVis(x,y,val){
  if(val <= 3 || val == undefined)
    maze_data[x-1][y-1].val = val || 3
  else
    maze_data[x-1][y-1].val =val*10 + maze_data[x-1][y-1].val
}

function unsetVis(x,y){
  maze_data[x-1][y-1].val = 0
}

function isRight(x,y){
  if( x>=1 && x<=mgSize && y >=1 && y <= mgSize)
    return true;
  return false
}

function dfs(x,y){
  setVis(x,y,2)

  _stack_.push({x:x,y:y})

  stop(19,19,format("走到点: ({},{}),并加入堆栈",x,y))
  setVis(x,y);


  if(x == endx && y == endy){ //达到终点
    stop(24,28,"找到一种解法");
    return true
  }

  for(let i =0;i<4;i++){
    let nx = x+fx[i][0];
    let ny = y+fx[i][1];

    if(isRight(nx,ny) && maze_data[nx-1][ny-1].val == 0){
      let r = dfs(nx,ny)
      unsetVis(nx,ny)

      setVis(x,y,5)

      _stack_.pop()
      stop(37,37,format("回溯到点: ({},{}),并删除栈顶",x,y))
      maze_data[x-1][y-1].val = maze_data[x-1][y-1].val % 10;
    }
  }

}
/* ---- 数据生成主体--结束*/

/**
 * 生成一帧
 * @param {Number} 高亮开始行
 * @param {Number} 高亮结束行
 * @param {string} 这一帧的注释
 */
function stop(lstart,lstop,log){
  lastStatus=clone(currentStatus)
  frames.push({
    status:lastStatus,
    line:lstart,
    hls:lstart, //hightlight start
    hlt:lstop,//hightlight stop
    log:log || '',
    id:stopid
  });
  stopid++;
}

/**
 * 生成所有的帧
 */
function run(){
  //生成第一帧
  __init__();
  stop(0,0,'初始化数据');
  dfs(2,1)
  stop(0,0,'end');
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.maze_data = maze_data;
  currentStatus.stack= _stack_;
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
