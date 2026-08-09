#include <cstdio>
#include <cstring>


#define N 100

int n,m,root;//n个点,m个询问

bool vis[N] = {0};
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

struct query {
    int u,v;
    int next;
    int num; // 第几个询问
}q[2*N];
int qhead[N];
int qsize=0;;
int ans[2*N];

void addQuery(int x,int y,int num){
    qsize++;
    q[qsize].u =x;
    q[qsize].v =y;
    q[qsize].num = num;
    q[qsize].next = qhead[x];
    qhead[x]  =qsize;
}

//并查集数据
int fa[N] = {0};

int find(int x){
    if( fa[x] == x) return x;
    fa[x]  = find(fa[x]);
    return fa[x];
}

void tarjan(int x){
    int i,y;
    fa[x]  =x; // 正在访问的点 设为自己根

    for(i=head[x];i!=-1;i=E[i].next){
        y = E[i].v;
        tarjan(y);
        fa[y] = x; //子树的点集,变成x的集合
    }
    //x是正在访问的点
    //如果另外一个点u已经访问过
    //那lca(x,u) == fa[u]
    vis[x]=1;//标记 放在这里的原因是用来求 lca(6,6)这样的点
    for(i=qhead[x];i!=-1;i=q[i].next){
        y = q[i].v;
        if( vis[y])
            ans[q[i].num] =find(y);
    }
}

int main(){
    memset(head,-1,sizeof(head));
    memset(qhead,-1,sizeof(qhead));
    scanf("%d%d",&n,&m);
    int i,j;
    for(i=1;i<n;i++){ //n-1条边
        int x,y;
        scanf("%d%d",&x,&y);
        addEdge(x,y,1);//默认边权为1
        fa[y] = x;
    }

    root =1;
    while( fa[root] != 0)
        root = fa[root];//停下来的时候root 就是根的编号

    for(i=1;i<=m;i++){
        int x,y;
        scanf("%d%d",&x,&y);
        addQuery(x,y,i);
        addQuery(y,x,i);
    }
    tarjan(root);
    for(i=1;i<=m;i++){
        printf("%d\n",ans[i]);
    }
    return 0;
}
