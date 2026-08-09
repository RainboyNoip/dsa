#include <algorithm>
#include <cstdio>

const int item_count = 3;
const int capacity = 8;

int weight[item_count + 1] = {0, 2, 3, 4};
int value[item_count + 1] = {0, 3, 5, 6};
int dp[capacity + 1] = {0};

void completeKnapsack() {
    for (int item = 1; item <= item_count; ++item) {
        for (int current_capacity = weight[item];
             current_capacity <= capacity;
             ++current_capacity) {
            dp[current_capacity] = std::max(
                dp[current_capacity],
                dp[current_capacity - weight[item]] + value[item]
            );
        }
    }
}

int main() {
    completeKnapsack();
    printf("%d\n", dp[capacity]);
    return 0;
}
