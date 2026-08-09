#include <cstdio>

int add(int a,int b){
  int c = a+b;
  return c;
}

int main(){
  int a = 1;
  int b =2;
  int c = add(a,b);
  printf("%d",c);
  return 0;
}
