#include <cstdio>

int n;//迷宫的大小
int sx,sy,zx,zy;
int map[100][100] = {0}; //存迷宫
int fx[4][2] = {  {-1,0},{0,1},{1,0},{0,-1}};
bool vis[100][100] ={0}; //方向

//x,y是不是在迷宫内
bool in_mg(int x,int y){
    if(x <= n && x>=1 && y <=n && y >=1)
        return true;
    return false;
}

struct _pos {
    int x,y;
};

//队列操作
int tail=0,head = 0;
_pos queue[100*100] = {0};

void push(int x,int y){ //加入队尾
    queue[tail].x = x;
    queue[tail].y = y;
    tail++;
}

void front(int &x,int &y){ //反回队首的值
    x = queue[head].x;
    y = queue[head].y;
}

void pop(){ //弹出
    head++;
}

bool empty(){ //队列是否为空
    return head == tail;
}

// 判断
bool bfs(int x,int y){
    vis[x][y] = 1;
    push(x,y);

    while( !empty()){ //非空
        int nx,ny,tx,ty;
        front(nx,ny);  pop();
        if( nx == zx && ny == zy) //到达终点
            return true;
        int i;
        for(i=0;i<4;i++){
            tx = nx +fx[i][0];
            ty = ny +fx[i][1];

            // 在迷宫内 && 没有访问过
            if( in_mg(tx,ty) && vis[tx][ty] == false){
                vis[tx][ty] = 1;
                push(tx,ty);
            }
        }

    }
    

    return false;
}

int main(){
    int i,j;
    scanf("%d",&n);
    scanf("%d%d%d%d",&sx,&sy,&zx,&zy);
    for (i=1;i<=n;i++){
        for (j=1;j<=n;j++){
            scanf("%d",&map[i][j]);
        }
    }
    if( bfs(sx,sy))
        printf("YES");
    else
        printf("NO");
    return 0;
}

