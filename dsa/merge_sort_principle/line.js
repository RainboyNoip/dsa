var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

//-----数据


var array_a = [1,3,7]
var array_b = [2,5,6]
var array_tmp = []
var dataStatus = [
  {v:1,p:[1,0]},
  {v:3,p:[1,1]},
  {v:7,p:[1,2]},
  {v:2,p:[2,0]},
  {v:5,p:[2,1]},
  {v:6,p:[2,2]}
]

/* 
 * {
 *   v:1
 *   p:[1,2]
 * }
 * p[0] 表示在哪个array里
 * p[1] 表示是第几个元素
 * */
function getDataStatus(){
  for(let i=0;i<array_tmp.length;i++)
    for(let j=0;j<dataStatus.length;j++)
      if( dataStatus[j].v === array_tmp[i]){
        dataStatus[j].p[0] = 3;
        dataStatus[j].p[1] = i;
      }

  currentStatus.data = dataStatus
}


/* --数据生成 */

function merge_sort(){
  let i=0,j=0,k=0;
  let len_a = array_a.length
  let len_b = array_b.length
  while(i < len_a && j <len_b){
    currentStatus.cmp = [[j,i]];
    stop(11,11,"比较:"+array_a[i]+" "+array_b[j]);
    if(array_a[i] <array_b[j]){
      array_tmp.push(array_a[i]);
      getDataStatus()
      stop(12,12,"移动较小的数"+array_a[i]+"到数组tmp中");
      i++;
    }
    else {
      array_tmp.push(array_b[j])
      getDataStatus()
      stop(14,14,"移动较小的数"+array_b[j]+"到数组tmp中");
      j++;
    }
  }

  while( i <len_a){
    array_tmp.push(array_a[i]);
    array_a[i++]=0;
    getDataStatus()
    stop(17,17,"数组a中剩余的数移动到数组tmp中");
  }

  while( j <len_b){
    array_tmp.push(array_b[j]);
    array_b[j++]=0;
    getDataStatus()
    stop(18,18,"数组b中剩余的数移动到数组tmp中");
  }
}

/* --数据生成 结束 */

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
  stop(2,4,'初始化数据');
  //frames 生成
  merge_sort();

  //最后一帧
  currentStatus.cmp = [];
  stop(22,22,"归并排序原理演示结束!");
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.data = dataStatus;
  currentStatus.cmp= [];
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
