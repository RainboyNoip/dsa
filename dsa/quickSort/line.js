var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

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

/* ---------- 具体生成代码--------*/

//排序的数据
var sort_data = [
  {v:null,p:0,sorted:false}, //存key的地方
  {v:6,p:1,sorted:false},
  {v:2,p:2,sorted:false},
  {v:7,p:3,sorted:false},
  {v:3,p:4,sorted:false},
  {v:8,p:5,sorted:false},
  {v:9,p:6,sorted:false}
]

var __sort_data = [
  {v:null,p:0,sorted:false}, //存key的地方
  {v:6,p:1,sorted:false},
  {v:2,p:2,sorted:false},
  {v:7,p:3,sorted:false},
  {v:3,p:4,sorted:false},
  {v:8,p:5,sorted:false},
  {v:9,p:6,sorted:false}
]

var sorted_data = [false,false,false,false,false,false];

function quickSort(l,r){
  if(l < r ){
    /* 比较的范围 */
    frame_compare_range(l,r);
    frames_arrow(l,r);
    stop(4,4,'排序范围是:'+l+'-->'+r);
    let s = l;
    let t = r;
    let key = __sort_data[l];
    __sort_data[l] = __sort_data[0];
    __sort_data[0] = key;
    //if(l == 1&& r == 6)
    //{
      //for(let i = 0;i<__sort_data.length;i++)
        //console.log(__sort_data[i]);
    //}
    //取key值
    frame_value();
    stop(6,6,'取key值'+sort_data[0].v);
    while(s < t){
      while( s < t && __sort_data[t].v >= key.v){
        t--;
        frames_arrow(s,t);
        stop(8,8,'t指针减少');
      }

      if( s < t){
        let tp = __sort_data[s];
        __sort_data[s] = __sort_data[t];
        __sort_data[t] = tp;
        frame_value();
        stop(9,9,"交换值1")
        s++;
        frames_arrow(s,t);
        stop(9,9,'s指针增加');
      }

      while(s < t && __sort_data[s].v <= key.v){
        s++;
        frames_arrow(s,t);
        stop(8,8,'s指针增加');
      }
      if( s < t){
        let tp = __sort_data[t];
        __sort_data[t] = __sort_data[s];
        __sort_data[s] = tp;
        frame_value();
        stop(11,11,"交换值2")
        t--;
        frames_arrow(s,t);
        stop(11,11,'t指针减少');
      }
    }
    //取回key值
    let tp = __sort_data[s];
    __sort_data[s] = __sort_data[0];
    __sort_data[0] = tp;
    frame_value();
    stop(13,13,'取回key值');
    let np = sort_data[__sort_data[s].p].p;
    sorted_data[np-1] = true;
    currentStatus.sorted = sorted_data;
    stop(13,13,'key值有序');
    quickSort(l,s-1);
    quickSort(s+1,r);
  }
}

function frames_arrow(l,r){
  currentStatus.arrow  = [l,r];
}

function frame_compare_range(l,r){
  currentStatus.range = [{
    s:l,
    t:r
  }];
}

function frame_value(){
  for(let i = 0;i< __sort_data.length;i++){
    sort_data[ __sort_data[i].p ].v = __sort_data[i].v;
    sort_data[__sort_data[i].p].p = i;
  }
  currentStatus.sort_data = sort_data;
}

/* ---------- 具体生成代码 结束--------*/

/**
 * 生成所有的帧
 */
function run(){
  //生成第一帧
  __init__();
  stop(19,20,'初始化数据');
  quickSort(1,6);
  sorted_data = [true,true,true,true,true,true];
  currentStatus.sorted = sorted_data;
  stop(21,21,'函数结束,剩下的值自动有序');
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.sort_data = __sort_data;
  currentStatus.arrow =[1,6]; //arrow数据
  currentStatus.range = [];
  currentStatus.sorted = sorted_data;
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
