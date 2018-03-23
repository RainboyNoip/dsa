var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

var sx=100,sy=100
var path_data = []
var fac = [0,1]
var len_scale = 10;

var total_cnt = 15; //生成fac的总量 >=2

/* 数据描述 */

/* 数据描述--结束*/

var dir = [
[1,0],  //方向0 ->
[0,1],  //方向1 V
[-1,0], //方向2 <-
[0,-1], //方向3 ^
[1,0],  //方向0 ->
[0,1],  //方向1 V
[-1,0], //方向2 <-
]

function gen_fac(){
  let i =3;
  pre = [sx,sy]
  for(i=2;i<=total_cnt;i++){
    let t = fac[i-1] +fac[i-2];
    fac.push(t);

    let tt = walk(pre[0],pre[1],fac[i]*len_scale,(i-2) %4)
    pre = tt.new_point;

    path_data.push( tt.path_data)
    currentStatus.path_data = path_data
    stop(0,0,"创建数据")

  }
}


function walk(x,y,len,redirect){
  let ans = [[x,y]]
  x += dir[redirect][0]*len;
  y += dir[redirect][1]*len;
  ans.push([x,y])

  x += dir[redirect+1][0]*len;
  y += dir[redirect+1][1]*len;
  ans.push([x,y])

  ans.push([
    x+dir[redirect+2][0]*len,
    y+dir[redirect+2][1]*len
  ])

  return {
    new_point:[x,y],
    path_data:ans
  }
}


/* ---- 数据生成主体 */

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
  gen_fac()
  console.log(path_data)
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.path_data = []
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
