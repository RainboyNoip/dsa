#include <cstdio>
#include <cstring>
#include <cmath>

#define N 100

int n,m,root;//n个点,m个询问

struct Edge {
    int u,v,w;
    int next;
}E[100];
int size = 0;
int head[N];

void addEdge(int x,int y,int z){
    size++;
    E[size].u =x;
    E[size].v =y;
    E[size].w =z;
    E[size].next = head[x];
    head[x] = size;
}

int fa[N]; //存点的父亲
int d[N]; // 每个点的深度
int p[N][N]; //p[i][j] 点i的2^j倍祖先

void dfs(int s){
    int i;
    for(i=head[s];i!=-1;i=E[i].next){
        int y = E[i].v;
        d[y] = d[s] +1; //深度+1
        dfs(y);
    }
}
//预处理
void st(){
    //找到root点
    memset(p,-1,sizeof(p));

    root =1;
    while( fa[root] != 0)
        root = fa[root];//停下来的时候root 就是根的编号
    fa[root] = -1;
    d[root] = 1;
    dfs(root);  //处理每个点的深度

    int i,j;
    //边界
    for(i=1;i<=n;i++)
        p[i][0] = fa[i];

    //n个点,理论最深是n,也就是最大有n-1倍祖先,我们算大一点:算成n倍祖先
    // 2^j =n --->j=log(n)/log(2)
    int k = int( log(n)/log(2)); //
    for(j=1;j<=k;j++) // 遍历最大深度可能1-->k
        for(i=1;i<=n;i++){
            if( p[i][j-1] != -1)// p[i][j-1] 存在,那p[i][j] 有可能存在
                p[i][j]  = p[ p[i][j-1]][j-1];
        }
}

//爬树法
int lca(int a,int b){
    
    /*    先判断是否 d[a] > d[b] ，如果是的话就交换一下(保证 a 的深度小于b,保证一定是b往上升到a同层) */
    if( d[a] > d[b]){
        int tmp = a;
        a=b;
        b=tmp;
    }

    int k = (int )(log(d[b] - 1)/log(2));//公式 root 点是b点d[b]-1倍祖先
    int i;
    for(i=k;i>=0;i--){
        if( d[b]-(1<<i) >= d[a]) // 1<<i ==2^i,>=d[a] 没有a的高,还要往上爬
            b = p[b][i];
    }

    if( a== b) // 这表明b是a的子树的点
        return a;

    //同时向上爬,到达最接近共同祖先的点
    k = (int)(log(d[b]-1)/log(2));
    for(i=k;i>=0;i--)
        if(p[a][i] != p[b][i])
        {
            a=p[a][i];
            b=p[b][i];
        }
    return p[a][0];
}
int main(){
    memset(head,-1,sizeof(head));
    scanf("%d%d",&n,&m);
    int i,j;
    for(i=1;i<n;i++){ //n-1条边
        int x,y;
        scanf("%d%d",&x,&y);
        addEdge(x,y,1);//默认边权为1
        fa[y] = x;
    }

    //预处理
    st();

    //处理询问
    for(i=1;i<=m;i++){
        int x,y;
        scanf("%d%d",&x,&y);
        int ans = lca(x,y);
        printf("%d\n",ans);
    }
}
