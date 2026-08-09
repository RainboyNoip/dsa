var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

var array = [
  {v:14,p:[0,1],sorted:false},
  {v:12,p:[0,2],sorted:false},
  {v:15,p:[0,3],sorted:false},
  {v:13,p:[0,4],sorted:false},
  {v:11,p:[0,5],sorted:false},
  {v:16,p:[0,6],sorted:false}
]

var array_a  = [14,12,15,13,11,16]
var array_tmp=[];

/* 数据描述--结束*/


/* ---- 数据生成主体 */

function getDataStatus(){
  for(let i = 0;i<array_a.length;i++)
    for(let j =0;j<array.length;j++)
      if(array_a[i] === array[j].v){
        array[j].p[0] = 0;
        array[j].p[1] = i+1;
      }

  for(let i = 0;i<array_tmp.length;i++)
    for(let j =0;j<array.length;j++)
      if(array_tmp[i] === array[j].v){
        array[j].p[0] = 1;
        array[j].p[1] = i+1;
      }
  currentStatus.data = array
}

function addRange(s,t,deep){
  currentStatus.range.push([s,t,deep])
}

function delRange(num){
  currentStatus.range.splice(currentStatus.range.length-num,num);
}

function merge_sort(s,t,deep=0){
  let mid,i,j,k;
  if(deep === 0){
    addRange(s,t,deep);
    stop(4,4,"初始归并排序的范围")
  }
  if(s==t) return;

  mid = (s+t) >>1;

  addRange(s,mid,deep+1);
  stop(9,9,"归并排序左半部分,元素下标: "+s+"-->"+mid);
  merge_sort(s,mid,deep+1);

  addRange(mid+1,t,deep+1);
  stop(10,10,"归并排序右半部分,元素下标: "+(mid+1)+"-->"+t);
  merge_sort(mid+1,t,deep+1);
  i=s;
  j=mid+1;
  k=s;
  while(i <= mid && j <=t){
    if(array_a[i] <= array_a[j]){
      array_tmp[k]=array_a[i];
      array_a[i]  =0;
      getDataStatus();
      stop(16,16,"比较 " +array_tmp[k] +" 和 "+array_a[j]+" 的大小,小的移动到tmp数组");
      i++;
      k++;
    }
    else {
      array_tmp[k]=array_a[j];
      array_a[j]  =0;
      getDataStatus();
      stop(18,18,"比较 " +array_a[i] +" 和 "+array_tmp[k]+" 的大小,小的移动到tmp数组");
      k++;
      j++;
    }
  }
  while(i<=mid) {
    array_tmp[k]=array_a[i];
    array_a[i] = 0;
      getDataStatus();
      stop(21,21,"左半部分剩余的数:"+array_tmp[k]+"移动到tmp数组")
    k++;
    i++;
  }
  while(j<=t){
    array_tmp[k]=array_a[j];
    array_a[j] =0;
      getDataStatus();
      stop(22,22,"右半部分剩余的数:"+array_tmp[k]+"移动到tmp数组")
    k++;
    j++;
  }
  for(i=s;i<=t;i++){
    array_a[i] = array_tmp[i];
    array_tmp[i] = 0;
    if( deep ===0 )
      array[i].sorted = true;
    getDataStatus();
    stop(23,24,"tmp数组中的数:"+array_a[i]+"移动到原数组")
  }
  delRange(2);
  stop(25,25,"数组下标: "+s+"-->"+t+" 排序完毕")
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
  merge_sort(0,5);
  currentStatus.range=[]
  stop(0,0,"整个数组归并排序完毕")
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.data = array;
  currentStatus.range = []
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
