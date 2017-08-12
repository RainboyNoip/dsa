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
var fa = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 ];
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

var query = []
var qhead = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1,-1];
var qsize = -1;

function find(x){
  if(fa[x] == x)  return x;
  return find(fa[x])
}

function addQuery(x,y,num){
  qsize++;
  query.push({ u:x, v:y, next:0 ,num:num})
  query[qsize].next = qhead[x];
  qhead[x]  = qsize;
}

var ans= [0,0,0,0,0];


/* {
 *  u
 *  v
 *  next
 * }
 * 
 * */

/* 数据描述--结束*/


/* ---- 数据生成主体 */
function tarjan(x){
  let i;
  let y;
  fa[x] = x;
  currentStatus.now = [x];//正在访问的点
  stop(54,54,"开始浏览点:"+x)
  for(i=head[x];i!=-1;i=E[i].next){
    y = E[i].v;
    tarjan(y);
    fa[y]=x;
    currentStatus.now = [x];//正在访问的点
    stop(59,61,"回到点:"+x)
  }
  for(i=qhead[x];i!=-1;i=query[i].next){
    y= query[i].v;
    if(vis[y-1] == 1){
      ans[ query[i].num ] = find(y);
      currentStatus.ans = ans;
      stop(69,69,"找到一个答案,lca("+x+","+y+"):"+ans[ query[i].num ]);
    }
  }
  vis[x-1] = 1; // flag
  currentStatus.tree_data = vis
  stop(71,71,"点:"+x+" 已经访问过")
}

function main(){
  //读取边
  for(let i = 0;i<tree_re.length;i++){
    addEdge(tree_re[i][0],tree_re[i][1]);
    fa[tree_re[i][1]] = tree_re[i][0];
  }
  for(let i = 0;i<tree_query.length;i++){
    addQuery(tree_query[i][0],tree_query[i][1],i)
    addQuery(tree_query[i][1],tree_query[i][0],i)
  }

  currentStatus.fa = fa;
  stop(79,84,'添加边,改变fa的值')
  tarjan(root);
  currentStatus.now = []
  stop(0,0,'结束');
  for(let i =0;i<tree_query.length;i++){
    console.log(ans[i]);
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
  currentStatus.fa=fa;
  currentStatus.ans=ans;
  currentStatus.now=[];

}

lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:__init__
}
