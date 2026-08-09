var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

/* 数据描述--结束*/

/* ---- 数据生成主体 */

function fac(x){
  currentStatus.val.push({
    ret:5,
    val:x!=0?x+'*factorial('+(x-1)+')':null
  })
  stop(2,2,"调用factorial("+x+')')
  if( x == 0){
    currentStatus.val.pop()
    stop(4,4,"函数factorial("+x+")退出,返回值:1")
    return 1;
  }

  let res = x*fac(x-1);

  currentStatus.val.pop()
  stop(5,5,"函数factorial("+x+")退出,返回值:"+res)
  return res
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
  currentStatus.val.push({
    ret:11,
    val:null
  })
  stop(10,10,"在main函数里调用函数factorial(5),把返回地址行:11压入调用栈")
  let res = fac(5);
  currentStatus.val.pop()
  stop(11,11,"变量ans的值为:"+res)
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.val = []
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
