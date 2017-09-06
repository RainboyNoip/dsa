#include <cstdio>
#include <cstring>

#define maxn 100

int n;
int w[maxn][maxn];//w[i][j] 表示i到j的权值
int A[maxn],B[maxn];//顶标
bool visx[maxn],visy[maxn];//是否访问过
int match[maxn];//右边的点点的匹配点是哪个点

void init(){
    memset(match,-1,sizeof(match));

    //读取数据
    int i,j;
    scanf("%d",&n);
    for( i =1;i<=n;i++)
        for( j =1;j<=n;j++)
            scanf("%d",&w[i][j]);
}

int min(int a,int b){
    if( a< b )
        return a;
    return b;
}

bool dfs(int u){
    visx[u] = true;
    int v;
    for(v=1;v<=n;v++){
        if( !visy[v] && A[u]+B[u] == w[u][v]){
            visy[v] = true;
            if( match[v] == -1 || dfs(match[v])){
                match[v] = u;
                return true;
            }
        }
    }
    return false; // 没有找到
}

int km(){
    int i,j;

    for(i=1;i<=n;i++){ //初始化顶标
        A[i] = -0x7fffffff;
        B[i] = 0;
        for(j=1;j<=n;j++)
            if( A[i] < w[i][j])
                A[i] = w[i][j];
    }

    int u;
    for(u=1;u<=n;u++){
        while(1){
            memset(visx,0,sizeof(visx));
            memset(visy,0,sizeof(visy));

            if( dfs(u)) //  如果找到增广路
                break;
            int d = 0x7fffffff;
            for(i=1;i<=n;i++){ // 无增广路,找d值,顶标最小修改值
                if(visx[i])    //参加路径的左点,和未参加路径的右点中行成的边的最小权
                    for(j=1;j<=n;j++)
                        if(!visy[j])
                            d = min(A[i]+B[j]-w[i][j],d);
            }

            for(i=1;i<=n;i++){ // 修改顶标值
                if( visx[i])   //路径上的左边点减d
                    A[i] -= d;
                if( visy[i])
                    B[i] += d; //路径上的右边点加d
            }
        }
    }

    int ans = 0;
    for( i =1;i<=n;i++)
        ans += w[ match[i]][i];
    return ans;
}

int main(){
    init();
    int kk = km();
    printf("%d",kk);
    return 0;
}
