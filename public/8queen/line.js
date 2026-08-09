var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

/* 数据描述--结束*/

var queen_size = 8;
var queen_array = []

xie1 = [] // /
xie2 = [] // \ 
heng = []
shu  = []

//能不能放
function is_right(x,y){
  if( 
    ( xie1[x+y] == 0 || xie1[x+y] == undefined) &&
    ( heng[x] == 0  ||  heng[x] == undefined ) &&
    ( shu[y] == 0 || shu[y] == undefined) &&
    ( xie2[x-y+100] == 0 || xie2[x-y+100] == undefined)
  )
    return true;
  return false;
}

//设定下在操作的格子
function set_now(x,y){
  queen_array[x][y].now = 1;
  if( y >0)
    queen_array[x][y-1].now = 0;
}

function q_set(x,y){
  xie1[x+y]  = 1;
  heng[x] =1;
  shu[y]=1;
  xie2[x-y+100]=1;
}

function unq_set(x,y){
  xie1[x+y]  = 0;
  heng[x] =0;
  shu[y]=0;
  xie2[x-y+100]=0;
}

function queen_array_init(size){

  queen_size = size
  console.log("size:",queen_size)

  xie1 = [] // /
  xie2 = [] // \ 
  heng = []
  shu  = []
  queen_array = []

  for(let i = 0 ;i<queen_size;i++){
    queen_array.push([])
    for(let j = 0 ;j<queen_size;j++){
        queen_array[i].push({x:i,y:j,val:0,now:0}) // now 正在操作这个格子
    }
  }
}

/* ---- 数据生成主体 */

// 数据,二维数据,可以时边框是黑色,不可以时是红色

var cnt = 0
function dfs(x,y){
  if(x == queen_size ){
    cnt++;
    return true; //生成一个闪烁
  }
  let i;
  for(i =0;i<queen_size;i++){
    //生成一帧
    if( is_right(x,i)){
      set_now(x,i);
      queen_array[x][i].val = 1;
      q_set(x,i);
      stop(45,50,"可以放这里:"+(x+1) +" "+(i+1))
      let res = dfs(x+1,0);
      unq_set(x,i);

      queen_array[x][i].now= 0;
      queen_array[x][i].val = 0;
      if(res)
        return true;
    }
    else {
      queen_array[x][i].val = 0;
      set_now(x,i);
      stop(45,45,"不可以放这里:"+(x+1) +" "+(i+1))
    }
  }
  
  queen_array[x][queen_size-1].now= 0;

  return false;
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
  dfs(0,0);
}

/**
 * 初始化数据,第一帧的数据
 */

function __init__(){
  queen_array_init(8); //生成 二维数组
  currentStatus.qa= queen_array;
}

lineExports = {
  init:function(){
    frames = []
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
