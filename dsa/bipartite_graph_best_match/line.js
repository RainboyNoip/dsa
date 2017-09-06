var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

//颜色数据,第三个数据透明度
//第4个数据,是否增长
var path_c =[
[1,1,0.2,0],
[1,2,0.2,0],
[1,3,0.2,0],
[1,4,0.2,0],
[1,5,0.2,0],
[2,1,0.2,0],
[2,2,0.2,0],
[2,4,0.2,0],
[2,5,0.2,0],
[3,1,0.2,0],
[3,2,0.2,0],
[3,3,0.2,0],
[3,4,0.2,0],
[4,2,0.2,0],
[4,3,0.2,0],
[5,1,0.2,0],
[5,2,0.2,0],
[5,3,0.2,0],
[5,4,0.2,0],
[5,5,0.2,0]
]

/* 数据描述 */

/* 数据描述--结束*/

/* ---- 数据生成主体 */



var A = [0,0,0,0,0]
var B = [0,0,0,0,0]
var match = [-1,-1,-1,-1,-1]

var visx = [0,0,0,0,0]
var visy = [0,0,0,0,0]
var n  = 5;

var w = [
 [3,5,5,4,1],
 [2,2,-1,2,2],
 [2,4,4,1,-1],
 [-1,1,1,-1,-1],
 [1,2,1,3,3]
]

var sp = [0,0,0,0,0]

function change_sp(s){
  sp = [0,0,0,0,0]
  sp[s] = 1;
}

function change_edge_color(i,j,color){
  for(let k = 0 ;k< path_c.length;k++){
    if( path_c[k][0] == i+1 && path_c[k][1] == j+1){
      path_c[k][2] = color;
      break
    }
  }
}


function clear_edge_color(){
  for(let k = 0 ;k< path_c.length;k++){
      path_c[k][2] = 0.2;
    }
}

function deal_match(){
  clear_edge_color();
  for(let i =0; i<match.length;i++){
    if(match[i] != -1){
      change_edge_color( match[i],i,0.8);
    }
  }
}

function change_edge_grow(i,j){
  for(let k = 0 ;k< path_c.length;k++){
    if( path_c[k][0] == i+1 && path_c[k][1] == j+1){
      path_c[k][3] = 1;
      break
    }
  }
}

function change_edge_grow_del(i,j){
  for(let k = 0 ;k< path_c.length;k++){
    if( path_c[k][0] == i+1 && path_c[k][1] == j+1){
      path_c[k][3] = 0;
      break
    }
  }
}


function clear_edge_grow(i,j){
  for(let k = 0 ;k< path_c.length;k++){
      path_c[k][3] = 0;
  }
}
function min(a,b){
  if( a< b ) return a;
  return b;
}

function dfs(u){
  visx[u] = 1;
  for(let v =0 ;v <n ;v++){
    if(visy[v] == 0 && A[u]+B[v] == w[u][v])
    {
      visy[v] = 1;
      //从u走到v
      change_edge_grow(u,v);
      stop(33,33,"找到一条可行边: (x"+ (u+1)+",y"+(v+1)+")");
      if( match[v] == -1 ){
        match[v] = u;
        stop(36,36,"点:y"+(v+1)+"是未匹配点,寻找增广路成功,修改math["+(v+1)+"]的值")
        change_edge_grow_del(u,v);
        return true;
      }
      else {
        stop(36,36,"点:y"+(v+1)+"是匹配点,从它对应的点:x"+(match[v]+1)+"继续开始寻找增广路")
        if( dfs(match[v])){
          match[v] = u;
          change_edge_grow_del(u,v);
          return true;
        }
        else { // 失败
          change_edge_grow_del(u,v);
        }
      }
    }
  }
  stop(41,41,"从点:x"+(u+1)+"寻找增广路失败,没有一个未访问的点y满足条件:A["+(u+1)+"]+B[y] == w["+(u+1)+"][y]")
  return false;
}

function km(){
  let i,j;
  //初始化 A B 的值
  for(i=0;i<n;i++){
    A[i] = -999999;
    B[i] = 0;
    let pre_j = 0;
    for(j=0;j<n;j++){
      if(A[i] < w[i][j]){
        A[i] = w[i][j]
        change_edge_color(i,pre_j,0.2);
        change_edge_color(i,j,2);
        pre_j = j;
      }
    }
  }
  stop(47,53,"找到A[i]的值,为包含点i的边的最大权值,B[i]初始化为0")
  clear_edge_color();

  //从每个点开始 dfs 找增广路
  for(let u = 0; u < n;u++){
    change_sp(u);
    currentStatus.sp = sp
    stop(56,56,"从点x"+(u+1)+"开始寻找增广路")
    while(1){
      for(let z =0; z < visx.length ;z++){
        visx[z] = 0;
        visy[z] = 0;
      }
      if( dfs(u)){
        //清除
        clear_edge_grow();
        deal_match();
        stop(0,0,"路径取反,得到当前匹配边")
        break;
      }
      else {
        clear_edge_grow();
        deal_match();
        stop(63,76,"寻找增广路失败,开始修改顶标")
      }

      let d = 0x7fffffff
      let tx,ty;
      for(i=0;i<n;i++)
        if(visx[i])
          for(j=0;j<n;j++){
            if( visy[j] == 0){
              if( d > A[i]+B[j] - w[i][j] ){
                tx = i;
                ty = j;
              }
              d = min(A[i]+B[j] - w[i][j],d)
            }
          }
      change_edge_color(tx,ty,2)
      stop(63,69,"左部失败增广路径上的点的其它边的最小边权:"+d)

      //更改标号
      for(i=0;i<n;i++){
        if(visx[i])
          A[i] -=d;
        if(visy[i])
          B[i] +=d;
      }
      stop(71,76,"失败增广路径上的x点A顶标减少:"+d+",y点顶标增加:"+d)
      change_edge_color(tx,ty,0.2)
    }
  }

  for(let z =0; z < visx.length ;z++){
    visx[z] = 0;
    visy[z] = 0;
    sp[z] = 0;
  }
  
  let ans = 0;
  for( i = 0 ;i< n;i++)
    ans += w[match[i]][i];
  //修改其它边的的颜色
  for( let x1 = 0; x1 <n;x1++)
    for( let y1 = 0; y1 <n;y1++){
      if( x1 != match[y1])
        change_edge_color(x1,y1,0);
    }
  stop(80,83,"找到最佳匹配,所有匹配边加起和为:"+ans)
  return ans;
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
  stop(12,21,'初始化数据');
  km();
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.path_c = path_c
  currentStatus.A =A
  currentStatus.B = B
  currentStatus.match = match
  currentStatus.sp = sp
  currentStatus.visx = visx
  currentStatus.visy = visy
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
