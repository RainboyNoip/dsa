
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
  }
}


// l1 ,r1 要更新的区间
// c 要加的值
// l,r ,rt 当前的点,和当前下标
function update(l1,r1,c,l,r,rt){
  if(l1 <= l && r <= r1){ // 包含
    fst[rt] = c;
    st[rt] = (r-l+1)*c;
    return ;
  }
  pushdown(rt,(r-l+1)); //这个点是不是有标记,有就下
  let m = (l+r) >>1;
  if(l1 <= m ) update(l1,r1,c,l,m,lson(rt));
  if(r1 > m ) update(l1,r1,c,m+1,r,rson(rt));
  pushup(rt);
}

//路过就更新
function query(l1,r1,l,r,rt){

  debugger;
  if(l1 <= l && r <= r1){//包含
    return st[rt];
  }

  //路过
  pushdown(rt,(r-l+1));

  let ret = 0;
  let m = (l+r) >>1;
  if(l1 <= m ) ret += query(l1,r1,l,m,lson(rt));
  if( r1 > m ) ret += query(l1,r1,m+1,r,rson(rt));
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
  build(1,n,1);

  let m  = q.length

  for(let i =0 ;i < m;i++){
    if( q[i][0] == 'c')
      update(q[i][1],q[i][2],q[i][3],1,n,1);
    else if(q[i][0] == 'q'){
      let ans = query(q[i][1],q[i][2],1,n,1);
      console.log(ans)
    }
  }

}

_init_()
