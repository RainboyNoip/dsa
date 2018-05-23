#include <cstdio>

//手动初始化数据
int n=5,c=10;
int w[] = {0,2,2,6,5,4};
int v[] = {0,6,3,5,4,6};

//清空置零,同时前0个物品,边界,f[0][j]=0
int f[6][11]={0};

//二维解法
void Knapsack01(){
    int i,j;
    for(i=1;i<=n;i++)//前i个物品
        for(j=1;j<=c;j++){
            if( j-w[i] >=0){ // 在容量j的条件下能放进去
                if(f[i-1][j] > f[i-1][j-w[i]]+v[i])
                    f[i][j] = f[i-1][j];
                else
                    f[i][j] = f[i-1][j-w[i]]+v[i];
            }
            else { //放不下
                    f[i][j] = f[i-1][j];
            }
        }
}
int main(){
    Knapsack01();
    printf("%d",f[5][10]);//输出答案
    return 0;
}
