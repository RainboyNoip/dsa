var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

var two = [
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0
]

var value = [
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0
]

/* 数据描述--结束*/

/* ---- 数据生成主体 */

let w = [0,2,2,6,5,4];
let v = [0,6,3,5,4,6];

function clear_two(){
  for(let i =0 ;i<two.length;i++)
    two[i] = 0;
}
function xb(i,j){
  return (i*11)+j;
}

function knapsack(){
  currentStatus.value = value;
  stop(9,9,"清空初始化数组");
  let i,j;
  for(i=1;i<=5;i++)
    for(j=1;j<=10;j++){
      if(j -w[i] >=0 ){ //可以取
        //比较
        clear_two()
        two[xb(i-1,j)] = 1
        two[xb(i-1,j-w[i])] = 1
        two[xb(i,j)] = 2;
        currentStatus.two = two
        stop(16,17,"比较两个值的大小")
        if( value[xb(i-1,j)] >value[xb(i-1,j-w[i])]+v[i]){
          value[xb(i,j)] = value[xb(i-1,j)]
          currentStatus.value = value
          stop(18,18,"取f[i-1][j]")
        }
        else{
          value[xb(i,j)] = value[xb(i-1,j-w[i])]+v[i]
          currentStatus.value = value
          stop(20,20,"取f[i-1][j-w[i]]+v[i]")
        }
      }
      else { //放不下
          clear_two()
          two[xb(i-1,j)] = 1
          two[xb(i,j)] = 2;
          currentStatus.two = two
          value[xb(i,j)] = value[xb(i-1,j)];
          currentStatus.value = value
          stop(23,23,format("放不下第{}个物品",i))

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
  knapsack();
  clear_two();
  currentStatus.two = two;
  stop(0,0,"演示完毕")
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.two = two
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
