

//树
var st = [0,0,0,0,0,0,0,0,0];
var fst = [0,0,0,0,0,0,0,0,0];

function lson(rt){
  return rt <<1;
}

function rson(rt){
  return (rt<<1)|1;
}

function pushup(){
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

}
