#include <cstdio>

int func_max(int a,int b){
  if( a>b)
    return a;
  return b;
}

int main(){
    int m = func_max(5,10);
    printf("%d\n",m);
    return 0;
}
