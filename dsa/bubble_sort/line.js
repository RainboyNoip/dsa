//数据生成
var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

//排序的数据
var sort_data = [
  {v:6,p:1,sorted:false},
  {v:2,p:2,sorted:false},
  {v:4,p:3,sorted:false},
  {v:1,p:4,sorted:false},
  {v:5,p:5,sorted:false},
]

var __sort_data = [
  {v:6,p:1,sorted:false},
  {v:2,p:2,sorted:false},
  {v:4,p:3,sorted:false},
  {v:1,p:4,sorted:false},
  {v:5,p:5,sorted:false},
]

function bubble_sort(){
  let i,j;
  let tmp;
  for(i=1;i<=sort_data.length-1;i++) //n个数,要进行n-1趟排序
    for(j=0;j<=sort_data.length-i-1;j++){//第i趟排序的最后一个下标:n-i
      bc_data(j+1,j+1+1); //比较
      stop(9,9,'比较第'+(j+1)+'和第'+(j+2)+'个元素');
      if(sort_data[j].v > sort_data[j+1].v){
        tmp =sort_data[j];
        sort_data[j] =sort_data[j+1];
        sort_data[j+1]=tmp;
        __sort_data[ sort_data[j].p-1].p = j+1;
        __sort_data[ sort_data[j+1].p-1].p = j+1+1;
        currentStatus.sort_data = __sort_data; //这个时候已经交换了
        stop(10,12,'交换第'+(j+1)+'和第'+(j+2)+'个元素');
      }
      if(j === sort_data.length-i-1){ //是不是最后一个
        sort_data[j+1].sorted = true;
        __sort_data[ sort_data[j+1].p-1].sorted = true;
        currentStatus.sort_data = __sort_data; 
        //有序的地方
        stop(0,0,'第'+(j+2)+'个元素有序');
      }
      //frames_push(0,0);
    }
  //最后一帧 使第一帧有序
  __sort_data[ sort_data[0].p-1].sorted = true;
  currentStatus.sort_data = __sort_data; 
  stop(0,0,'第1个元素有序');
}

function run(){
  //第一帧
  currentStatus.sort_data = __sort_data;
  currentStatus.bc_data = [];
  stop(0,0,'初始化数据');
  bubble_sort();
}

function bc_data(p1,p2){
  currentStatus.bc_data = [{p1:p1,p2:p2}];
}


function stop(line,i,animation){
  lastStatus=clone(currentStatus)
  frames.push({
    status:lastStatus,
    line:line,
    hls:line, //hightlight start
    hlt:i,//hightlight stop
    log:animation || '',
    id:stopid
  });
  stopid++;
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  }
}
