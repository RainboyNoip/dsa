
var A = [0,0,0,0,0]
var B = [0,0,0,0,0]
var match = [-1,-1,-1,-1,-1]

var visx = [0,0,0,0,0]
var visy = [0,0,0,0,0]
var n  = 5;

var w = [
 [3,5,5,4,1],
 [2,2,0,2,2],
 [2,4,4,1,0],
 [0,1,1,0,0],
 [1,2,1,3,3]
]

function min(a,b){
  if( a< b ) return a;
  return b;
}

function init(){
}

function dfs(u){
  visx[u] = 1;
  for(let v =0 ;v <n ;v++){
    if(visy[v] == 0 && A[u]+B[v] == w[u][v])
    {
      visy[v] = 1;
      if( match[v] == -1 || dfs(match[v])){
        match[v] = u;
        return true;
      }
    }
  }
  return false;
}

function km(){
  let i,j;
  //初始化 A B 的值
  for(i=0;i<n;i++){
    A[i] = -999999;
    B[i] = 0;
    for(j=0;j<n;j++){
      if(A[i] < w[i][j])
        A[i] = w[i][j]
    }
  }

  //从每个点开始 dfs 找增广路
  for(let u = 0; u < n;u++)
    while(1){
      visx = [0,0,0,0,0]
      visy = [0,0,0,0,0]
      if( dfs(u))
        break;

      let d = 0x7fffffff
      for(i=0;i<n;i++)
        if(visx[i])
          for(j=0;j<n;j++){
            if( visy[j] == 0)
              d = min(A[i]+B[j] - w[i][j],d)
          }

      //更改标号
      for(i=0;i<n;i++){
        if(visx[i])
          A[i] -=d;
        if(visy[i])
          B[i] +=d;
      }
    }

  let ans = 0;
  for( i = 0 ;i< n;i++)
    ans += w[match[i]][i];

  console.log( match)
  return ans;
}

function start(){
  let kk = km()
  console.log(kk)
}

start();
