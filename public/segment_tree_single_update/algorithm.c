#include <cstdio>

const int maxn = 1000;
int tree[maxn << 2];

void pushup(int rt) {
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

void build(int left, int right, int rt) {
    if (left == right) {
        scanf("%d", &tree[rt]);
        return;
    }
    int middle = (left + right) >> 1;
    build(left, middle, rt << 1);
    build(middle + 1, right, rt << 1 | 1);
    pushup(rt);
}

void update(int position, int value, int left, int right, int rt) {
    if (left == right) {
        tree[rt] = value;
        return;
    }
    int middle = (left + right) >> 1;
    if (position <= middle) {
        update(position, value, left, middle, rt << 1);
    } else {
        update(position, value, middle + 1, right, rt << 1 | 1);
    }
    pushup(rt);
}

int main() {
    int n, operations;
    scanf("%d", &n);
    build(1, n, 1);
    scanf("%d", &operations);
    while (operations--) {
        int position, value;
        scanf("%d%d", &position, &value);
        update(position, value, 1, n, 1);
    }
    return 0;
}
