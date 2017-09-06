var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};


/* 数据描述 */

//变色用
// 0 
// 1 
// 2 正在
// 3 找查已经访问的点的另一个点
//父亲值
var root =1

var tree_re= [
[1,2],
[1,8],
[1,9],
[2,3],
[2,4],
[9,10],
[9,11],
[3,5],
[3,6],
[10,12],
[5,7],
[5,13]
]

var tree_query = [
  [4,12],
  [7,6],
  [7,13],
  [6,12],
  [12,13]
]

var vis = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

var head = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1];

var E = []
var size = -1;

function addEdge(x,y){
  size++;
  E.push({ u:x, v:y ,next:0});
  E[size].next = head[x];
  head[x] = size;
}


var ans= [0,0,0,0,0];

var p = []
var fa = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
var d = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]


/* 数据描述--结束*/


/* ---- 数据生成主体 */
function dfs(s){
  for(let i = head[s];i!=-1;i=E[i].next){
    let y = E[i].v;
    d[y] = d[s]+1;
    dfs(y);
  }
}

function st(){
  root =1;
  fa[root] =-1;
  d[root] = 1;
  dfs(root);

  for(let i=1;i<=13;i++)
    p[i][0] = fa[i];

  let k = parseInt(Math.log(13)/Math.log(2))
  for(let j=1;j<=k;j++)
    for(let i =1;i<=13;i++){
      if(p[i][j-1]!=-1){
        p[i][j] = p[ p[i][j-1]][j-1];
      }
    }
}
function lca(a,b){
  if( d[a] > d[b]){
    let tmp = a;
    a= b;
    b = tmp;
  }
  let k = parseInt(Math.log(d[b]-1)/Math.log(2))
  let i;
  for(i-k;i>=0;i--){
    if(d[b] - (1<<i) >= d[a])
      b = p[b][i];
  }
  if(a == b)
    return a;
  k = parseInt(Math.log(d[b]-1)/Math.log(2))
  for(i=k;i>=0;i--)
    if( p[a][i] == p[b][i])
    {
      a= p[a][i];
      b=p[b][i];
    }
  return p[a][0];
}

function main(){
  //读取边
  for(let i = 0;i<tree_re.length;i++){
    addEdge(tree_re[i][0],tree_re[i][1]);
    fa[tree_re[i][1]] = tree_re[i][0];
  }
  //初始化p
  for(i=0;i<20;i++)
    p.push([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
  st();
  for(let i =0;i<tree_query.length;i++){
    let ans = lca(tree_query[i][0],tree_query[i][1])
    console.log(ans);
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
  main()
}

/**
 * 初始化数据,第一帧的数据
 */
function __init__(){
  currentStatus.tree_data =vis;
  currentStatus.ans=ans;
  currentStatus.querypos = [];
  currentStatus.now=[];
}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
