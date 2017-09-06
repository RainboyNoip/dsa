#include <cstdio>
#include <cstring>
const int maxn = 1000;
int st[maxn<<2];
int flag[maxn<<2];
#define lson(rt) (rt<<1)
#define rson(rt) ((rt<<1)|1)
int n,m;
void pushup(int rt){
    st[rt] = st[lson(rt)] + st[rson(rt)];
}
void pushdown(int rt,int m){
    if(flag[rt]){
        flag[lson(rt)] = flag[rson(rt)] = flag[rt];
        st[lson(rt)] = flag[rt]*(m-(m>>1));
        st[rson(rt)] = flag[rt]*(m>>1);
        flag[rt] = 0;
    }
}
void update(int l1,int r1,int c,int l,int r,int rt){
    if(l1 <=l && r<=r1){
        flag[rt] = c; //我们到达一个点
        st[rt] = (r-l+1)*c;
        return ;
    }
    pushdown(rt,(r-l+1));
    int m = (l+r)>>1;
    if( l1 <= m) update(l1,r1,c,l,m,lson(rt));
    if( r1 > m) update(l1,r1,c,m+1,r,rson(rt));
    pushup(rt);
}
int query(int l1,int r1,int l,int r,int rt){
    if(l1<=l && r <= r1){//包含
        return st[rt];
    }

    //路过
    pushdown(rt,(r-l+1));
    int ret = 0;
    int m = (l+r)>>1;
    if(l1 <= m) ret+= query(l1,r1,l,m,lson(rt));
    if(r1 > m ) ret+= query(l1,r1,m+1,r,rson(rt));
    return ret;
}
void build(int l,int r,int rt){
    if( l==r){
        scanf("%d",&st[rt]);
        return ;
    }
    int m = (l+r)>>1;
    build(l,m,lson(rt));
    build(m+1,r,rson(rt));
    pushup(rt);
}
int main(){
    memset(flag,0,sizeof(flag));
    scanf("%d",&n);
    build(1,n,1);
    scanf("%d",&m);
    int i,j,k;
    char c;
    while(m--){
        scanf("%c",&c); //读两次,滤掉\n
        scanf("%c",&c);
        if( c == 'c' ){
            scanf("%d%d%d",&i,&j,&k);
            update(i,j,k,1,n,1);
        }else {
            scanf("%d%d",&i,&j);
            int ans = query(i,j,1,n,1);
            printf("%d\n",ans);
        }
    }
    return 0;
}
