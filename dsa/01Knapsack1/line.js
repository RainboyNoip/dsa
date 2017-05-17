var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

var one = [ 0,0,0,0,0,0,0,0,0,0,0 ]

var value = [0,0,0,0,0,0,0,0,0,0,0 ]

/* 数据描述--结束*/

/* ---- 数据生成主体 */

let w = [0,2,2,6,5,4];
let v = [0,6,3,5,4,6];

function clear_one(){
  for(let i =0 ;i<one.length;i++)
    one[i] = 0;
}
function xb(i,j){
  return (i*11)+j;
}

function knapsack(){
  let i,j;
  currentStatus.value = value;
  stop(9,9,"数据清零")
  for(i=1;i<=5;i++){
    for(j=10;j>=w[i];j--){
      //比较
      currentStatus.bc = [[j,j-w[i]]];
      stop(15,15,"比较"+"f["+j+"]("+value[j]+")和"+"f["+j+"-"+w[i]+"]"+"+v["+i+"]("+(value[j-w[i]]+v[i])+")的大小");
      if( value[j] < value[j - w[i]] + v[i]){
        value[j] = value[j - w[i]] + v[i]
        currentStatus.value = value;
        stop(16,16,"更新状态值:"+value[j]);
      }
      else {
        stop(17,17,"不用更新状态值");
      }
    }
    stop(13,13,"前"+(i)+"个物品更新完毕")
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
  knapsack();
  console.log("-----",value[10])
  clear_one();
  currentStatus.one = one;
  currentStatus.bc = []
  stop(0,0,"演示完毕")
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.one = one
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
