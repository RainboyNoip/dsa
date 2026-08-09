#include <cstdio>

const int maxn = 1000;

struct Node {
    int left, right;
    int sum;
    int lazy;
    bool has_lazy;
} tree[maxn << 2];

void pushup(int rt) {
    tree[rt].sum = tree[rt << 1].sum + tree[rt << 1 | 1].sum;
}

void apply(int rt, int value) {
    tree[rt].sum = (tree[rt].right - tree[rt].left + 1) * value;
    tree[rt].lazy = value;
    tree[rt].has_lazy = true;
}

void pushdown(int rt) {
    if (!tree[rt].has_lazy) return;
    apply(rt << 1, tree[rt].lazy);
    apply(rt << 1 | 1, tree[rt].lazy);
    tree[rt].has_lazy = false;
}

void build(int left, int right, int rt) {
    tree[rt].left = left;
    tree[rt].right = right;
    tree[rt].has_lazy = false;
    if (left == right) {
        scanf("%d", &tree[rt].sum);
        return;
    }
    int middle = (left + right) >> 1;
    build(left, middle, rt << 1);
    build(middle + 1, right, rt << 1 | 1);
    pushup(rt);
}

void update(int query_left, int query_right, int value, int rt) {
    if (query_left <= tree[rt].left && tree[rt].right <= query_right) {
        apply(rt, value);
        return;
    }
    pushdown(rt);
    int middle = (tree[rt].left + tree[rt].right) >> 1;
    if (query_left <= middle) update(query_left, query_right, value, rt << 1);
    if (query_right > middle) update(query_left, query_right, value, rt << 1 | 1);
    pushup(rt);
}

int query(int query_left, int query_right, int rt) {
    if (query_left <= tree[rt].left && tree[rt].right <= query_right) {
        return tree[rt].sum;
    }
    pushdown(rt);
    int answer = 0;
    int middle = (tree[rt].left + tree[rt].right) >> 1;
    if (query_left <= middle) answer += query(query_left, query_right, rt << 1);
    if (query_right > middle) answer += query(query_left, query_right, rt << 1 | 1);
    return answer;
}

int main() {
    int n, operations;
    scanf("%d", &n);
    build(1, n, 1);
    scanf("%d", &operations);
    while (operations--) {
        char command;
        scanf(" %c", &command);
        if (command == 'C') {
            int left, right, value;
            scanf("%d%d%d", &left, &right, &value);
            update(left, right, value, 1);
        } else {
            int left, right;
            scanf("%d%d", &left, &right);
            printf("%d\n", query(left, right, 1));
        }
    }
    return 0;
}
