#include <cstdio>
int factorial(int x){
    if(x == 0) //边界条件
        return 1;
    return x*factorial(x-1);
}
int main(){
    int n;
    scanf("%d",&n);//输入数字
    int ans = factorial(n);
    printf("the answer of %d! is:%d",n,ans);
    return 0;
}
