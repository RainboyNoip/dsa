#include <cstdio>

int a[1000];
int n;
int f[1000];

int main(){
    scanf("%d",&n);
    int i;
    int j;
    for (i=1;i<=n;i++){
        scanf("%d",&a[i]);
    }

    for(i=1;i<=n;i++) f[i] =1;

    int max = -1;//这里是-1,想想为什么
    for (i=2;i<=n;i++){
        for(j=1;j<i;j++){
            if( a[j] < a[i] && f[i] < f[j]+1){
                f[i] = f[j]+1;
                if(max < f[i])
                    max = f[i];
            }
        }
    }

    printf("%d",max);

    return 0;
}
