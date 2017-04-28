#include <cstdio>
//排序范围:下标1->5
int a[100] = {0,6,2,4,1,5};
void bubble_sort(int a[],int n){
    int i,j;
    int tmp;
    for(i=1;i<=n-1;i++) //n个数,要进行n-1趟排序
        for(j=1;j<=n-i;j++){//第i趟排序的最后一个下标:n-i
            if(a[j] > a[j+1]){
                tmp =a[j];
                a[j] =a[j+1];
                a[j+1]=tmp;
            }
        }
}
int main(){
    int i;
    bubble_sort(a,5);
    for(i=1;i<=5;i++)
        printf("%d ",a[i]);
}
