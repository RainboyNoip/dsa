/* 8皇后-DFS算法 -by Rainboy 2018-04-03 17:10 */
/* 输出一处可能方案 */
#include <cstdio>

#define queen_size 8 //queen的数量
int n;
int map[100][100] = {0}; //棋盘,0表示没有queen
int cnt = 0; //记录共有多少方案数

bool hang[100] ={0}; //标记第i行是否有queen
bool lie[100] ={0};  //标记第i列是否有queen
bool xie1[100] ={0};  //标记 / 行否有queen
bool xie2[100] ={0};  //标记 \ 行否有queen


// 放置queen在(x,y),设置对应的标记
void set(int x,int y){
    hang[x]= 1; lie[y] = 1;
    xie1[x+y] = 1; xie2[x-y+10] =1;
}

// 取消放置queen在(x,y),设置对应的标记
void un_set(int x,int y){
    hang[x]= 0; lie[y] = 0;
    xie1[x+y] = 0; xie2[x-y+10] =0;
}


// 坐标x,y 能否放queen
bool is_right(int x,int y){
    if( hang[x] == 0 && lie[y] == 0 && xie1[x+y] ==0 && xie2[x-y+10] == 0)
        return true;
    return false;
}


//参数x 表示在第x行尝试放一个queen
bool dfs(int x){
    if(x > n){ // 边界:来到n+1行,表示前n行都放好了
        cnt++; //记录一次成功的方案
        return true;
    }
    int i;
    for(i = 1;i <= n;i++){
        if( is_right(x,i)){ //可以放
            set(x,i);
            if( dfs(x+1) )
              return true;
            un_set(x,i);
        }
    }
    return false;
}


int main(){
    scanf("%d",&n);//读取 queen的数量
    dfs(1);
    printf("the total : %d\n",cnt);
    return 0;
}
