var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};

/* 数据描述 */

/* 数据描述--结束*/

/* ---- 数据生成主体 */

//树
var n = 5
var _in = [0,1,2,3,4,5]
var q = [
  ['c',1,3,8],
  ['q',1,3],
  ['c',1,2,5],
  ['q',1,4]
]
var st = [0,0,0,0,0,0,0,0,0,0];
var fst = [0,0,0,0,0,0,0,0,0,0];

function lson(rt){
  return rt <<1;
}

function rson(rt){
  return (rt<<1)|1;
}

function pushup(rt){
  st[rt] = st[lson(rt)] + st[rson(rt)];
}

//向下推
// 只要 fst 上修改,对应的st立刻修改
function pushdown(rt,m){
  if(fst[rt]){ // 如果这个点有值
    fst[lson(rt)] = fst[rson(rt)] = fst[rt];
    st[lson(rt)] = fst[rt]*(m -(m>>1))
    st[rson(rt)] = fst[rt]*(m>>1)
    fst[rt] = 0;
    stop(13,18,"这个点有标记,用这个标记更新原始树上对应点的儿子的值,并把标记压下.有标记的点对应的原始点一定被更新值")
  }
  else{
    stop(19,19,"这个点没有标记,不用更新")
    //不用更新
  }
}


// l1 ,r1 要更新的区间
// c 要加的值
// l,r ,rt 当前的点,和当前下标
function update(l1,r1,c,l,r,rt){
  currentStatus.tree1_arrow = [rt]
  stop(20,20,"来到点: "+rt)
  if(l1 <= l && r <= r1){ // 包含
    stop(21,21,"点:"+rt+"代表的区间在要查询的区间["+l1+","+r1+"]内");
    fst[rt] = c;
    st[rt] = (r-l+1)*c;
    stop(22,24,"改变这个点的值为:("+r+"-"+l+"+1)*"+c+"="+st[rt]+",修改对应的标记点为:"+fst[rt]);
    return ;
  }
  currentStatus.tree2_arrow = [rt]
  stop(26,26,"标记树来到点: "+rt+",如果有标记就把标记压下")
  pushdown(rt,(r-l+1)); //这个点是不是有标记,有就下
  let m = (l+r) >>1;
  if(l1 <= m ) {
    stop(41,41,"因为:"+l1+"<="+m+",所有有一剖分区间在左孩子上")
    update(l1,r1,c,l,m,lson(rt));
  }
  if(r1 > m ) {
    stop(42,42,"因为:"+r1+">"+m+",所有有一剖分区间在右孩子上")
    update(l1,r1,c,m+1,r,rson(rt));
  }
  pushup(rt);
  currentStatus.tree1_arrow = [rt]
  stop(30,30,"回到父节点:"+rt+",根据左右孩子更新自己为:"+st[rt]);
}

//路过就更新
function query(l1,r1,l,r,rt){
  currentStatus.tree1_arrow = [rt]
  stop(20,20,"查询,来到点: "+rt)
  if(l1 <= l && r <= r1){//包含
    return st[rt];
  }

  //路过
  currentStatus.tree2_arrow = [rt]
  stop(38,38,"标记树来到点: "+rt+",如果有标记就把标记压下")
  pushdown(rt,(r-l+1));

  let ret = 0;
  let m = (l+r) >>1;
  if(l1 <= m ) ret += query(l1,r1,l,m,lson(rt));
  if( r1 > m ) ret += query(l1,r1,m+1,r,rson(rt));
  currentStatus.tree1_arrow = [rt]
  stop(43,43,"查询,返回到点: "+rt+",并返回值:"+ret)
  return ret;
}

function build(l,r,rt){
  if( l== r){
    st[rt] = _in[l]
    return ;
  }
  let m = (l+r) >>1;
  build(l,m,lson(rt));
  build(m+1,r,rson(rt));
  pushup(rt);
}

 function _init_(){
  currentStatus.tree2_data = fst;
  stop(56,56,"初始化标记树!")
  build(1,n,1);
  currentStatus.tree1_data = st;
  stop(58,58,"建树完毕!")

  let m  = q.length

  for(let i =0 ;i < m;i++){
    if( q[i][0] == 'c'){
      stop(67,67,"处理更新: 把" + q[i][1] + " 到 "+ q[i][2] + " 的数据替换成"+ q[i][3])
      update(q[i][1],q[i][2],q[i][3],1,n,1);
      currentStatus.tree1_arrow = []
      currentStatus.tree2_arrow = []
      stop(68,68,"区间修改结束!");
    }
    else if(q[i][0] == 'q'){
      stop(70,70,"查询区间: " + q[i][1] + " 到 "+ q[i][2] + " 的数据和")
      let ans = query(q[i][1],q[i][2],1,n,1);
      currentStatus.tree1_arrow = []
      currentStatus.tree2_arrow = []
      stop(71,71,"查询结束,值为: "+ans);
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
  currentStatus.tree1_data = [];
  currentStatus.tree2_data = [];
  currentStatus.tree1_arrow = []
  currentStatus.tree2_arrow = []
  stop(0,0,'初始化数据');
  _init_()
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
