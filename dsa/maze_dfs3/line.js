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

_queue_ = []
var tail =0;
var head = 0;

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

function bfs(x,y){
  _queue_.push({x:x,y:y,pop:false}}
  setVis(x,y);
  tail++;
  while(tail != head){
    let nx = _queue_[head].x;
    let ny = _queue_[head].y;

    _queue_[head].pop = true;
    head++;

    for(let i =0;i<4;i++){
      let tx = nx + fx[i][0];
      let ty = ny + fx[i][1];
      if( isRight(tx,ty) && maze_data[x-1][y-1] == 0 ){
          _queue_.push({x:tx,y:ty,pop:false})
          setVis(tx,ty)
          tail++;
      }
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
  currentStatus.queue= _queue_;
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
