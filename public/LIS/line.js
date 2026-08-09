var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */


var data=[ {v:3,e:0}, {v:4,e:0}, {v:1,e:0}, {v:2,e:0}, {v:3,e:0}, {v:6,e:0}]
var f = [ {v:0,e:0}, {v:0,e:0}, {v:0,e:0}, {v:0,e:0}, {v:0,e:0}, {v:0,e:0} ]
var path = [[0,0]]
var max= -1;

/* 数据描述--结束*/

/* ---- 数据生成主体 */
function clear(){
  for(let i =0;i<data.length ;i++){
    f[i].e = data[i].e = 0;
  }
}
function lis(){
  for(let i=0;i<f.length;i++)
    f[i].v = 1;
  stop(20,20,"初始化边界值,f[i]=a[1]")

  var len = data.length
  let i,j;
  for(i=1;i<len;i++){
    for(j=0;j<i;j++){
      path[0][0] = i;
      path[0][1] = j;
      clear();
      data[i].e =1;
      stop(20,20,format("比较a[{}],a[{}],两个元素",i+1,j+1))
      if(data[i].v <=data[j].v){
        if( f[i].v < f[j].v+1){
            f[i].e =1;
            f[i].v = f[j].v+1;
            stop(21,21,format("更新f[{}].v",i))
            if( max < f[i].v){ //更新max
              max = f[i].v;
            }
        }
      }
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
  currentStatus.f  =f; //dp f 值
  currentStatus.data  =data; // data 值
  currentStatus.path=path; // data 值
  __init__();
  stop(0,0,'初始化数据');
  lis();
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
