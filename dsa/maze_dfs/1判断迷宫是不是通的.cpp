/*============================================================================
* Title : 迷宫问题--有没有解
* Author: Rainboy
* Time  : 2016-07-11 18:34
* update: 2016-07-11 18:34
* © Copyright 2016 Rainboy. All Rights Reserved.
*=============================================================================*/

#include <cstdio>


char mg[5][5] = {
    0,0,0,0,0,
    0,0,0,1,1,
    0,1,0,0,0,
    0,1,1,1,0,
    0,1,1,1,0
};

bool vis[5][5] = {0};
int mgSize =4;

int fx[4][2] = {{1,0},{0,1},{-1,0},{0,-1}}; //某个点的四个方向

bool isRight(int x,int y){
    if(x >=1 && x <= mgSize && y>=1 && y<=mgSize && mg[x][y] == 0 && mg[x][y] == 0)
        return true;
    return false;
}


bool dfs(int x,int y){
    /* 进入一个点,可以走 */
    vis[x][y] = 1;

    /* 判断边界 */
    if(x == mgSize && y == mgSize)
        return true;

    int i;
    for(i=0;i<4;i++){
        int nx = x+fx[i][0];
        int ny = y+fx[i][1];
        if( isRight(nx,ny) && vis[nx][ny] == 0 )
           if( dfs(nx,ny) )
               return true;
    }

    /* 回溯时 不可以走 */
    return false;
}


int main(){

    if( dfs(1,1)){
        printf("yes");
    }
    else
        printf("no");
    return 0;
}

