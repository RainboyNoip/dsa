var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

/* 数据描述--结束*/

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
  currentStatus.data=0;
  stop(0,0,'0阶');
  currentStatus.data=1;
  stop(0,0,'1阶');
  currentStatus.data=2;
  stop(0,0,'2阶');
  currentStatus.data=3;
  stop(0,0,'3阶');
  currentStatus.data=4;
  stop(0,0,'4阶');
  currentStatus.data=5;
  stop(0,0,'5阶');
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
