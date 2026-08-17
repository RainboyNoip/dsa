#include <bits/stdc++.h>
using namespace std;

int n;
int sx,sy,tx,ty;
int maze[100][100];
int dis[100][100]; // dis = distance

void init(){
    cin >> n;
    cin >> sx >> sy >> tx >> ty;
    for(int i = 1;i<=n;i++){
        for(int j = 1;j<=n;j++)
            cin >> maze[i][j];
    }
}

// 队列的实现 -- start
struct node {
    int x,y;
};
node a[10000];
int head,tail;
// tail 指向最后一个元素的后一个位置
void push(node t) {a[tail++] = t;}
void pop(){ head++;}
node front(){ return a[head];}
node back(){ return a[tail-1];}
bool empty(){
    return head == tail;
}
// 队列的实现 -- end

int dx[] = {0,0,1,-1};
int dy[] = {1,-1,0,0};

void bfs(int x,int y){
    push({x,y});
    dis[x][y] = 1;

    while( !empty() ) {
        node h = front();
        pop();

        for(int i = 0 ;i<4;i++){
            int nx = h.x + dx[i];
            int ny = h.y + dy[i];
            if( nx < 1 || nx > n || ny < 1 || ny > n) continue;
            if( maze[nx][ny]==1 ) continue;
            if( dis[nx][ny] !=0 ) continue;

            dis[nx][ny] = dis[h.x][h.y] + 1;
            push({nx,ny});
        }
    }
}

int main(){
    init();
    bfs(sx,sy);
    if( dis[tx][ty] !=0 )
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
    cout << dis[tx][ty];

    return 0;
}
