var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

//line 画线数组,点的含义,哪两个点的连线
// 边(i,j)编号 是j-2
line_data = [
  [1,1],
  [1,1],
  [2,2],
  [2,2],
  [3,3],
  [3,3],
  [4,4],
  [4,4]
]

// 点出现的顺序,和范围
// [[1,"1--5"]]
tree_node = []

/* 数据描述--结束*/

/* ---- 数据生成主体 */

//树
var n = 5
var _in = [0,1,2,3,4,5]
var q = [
  ['c',1,3,8],
  ['q',1,3],
  ['c',1,2,5],
  ['q',1,4]
]
var st = [0,0,0,0,0,0,0,0,0,0];
var fst = [0,0,0,0,0,0,0,0,0,0];

function lson(rt){
  return rt <<1;
}

function rson(rt){
  return (rt<<1)|1;
}

function pushup(rt){
  st[rt] = st[lson(rt)] + st[rson(rt)];
}

function build(l,r,rt){
  if( l== r){
    st[rt] = _in[l]
    return ;
  }
  let m = (l+r) >>1;
  build(l,m,lson(rt));
  build(m+1,r,rson(rt));
  pushup(rt);
}

 function _init_(){
  build(1,n,1);
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
  _init_()
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
