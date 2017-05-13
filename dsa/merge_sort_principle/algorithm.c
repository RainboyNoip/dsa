#include <cstdio>
int a[] = {1,3,7};
int b[] = {2,5,6};
int tmp[100];
int merge(){
    int i=0,j=0;//i,j分别指向a,b的头部
    int k=0;//k是tmp数的下标
    int len_a = sizeof(a)/sizeof(a[0]); //a的长度
    int len_b = sizeof(b)/sizeof(b[0]);//b的长度
    while(i< len_a && j< len_b){
        if(a[i] < b[j]){
            tmp[k]=a[i];i++;k++;
        } else{
            tmp[k]=b[j];j++;k++;
        }
    }
    while(i<len_a) {tmp[k++] = a[i];i++;}; //复制a数组的剩余
    while(j<len_b) {tmp[k++] = b[j];j++;}; //复制b数组的剩余
}
int main(){
    merge();
    int i;
    int len_a = sizeof(a)/sizeof(a[0]); //a的长度
    int len_b = sizeof(b)/sizeof(b[0]);//b的长度
    for(i=0;i<len_a+len_b;i++)
        printf("%d ",tmp[i]);
    return 0;
}
