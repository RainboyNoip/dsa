#include <algorithm>
#include <cstdio>

const int group_count = 3;
const int capacity = 8;

int item_count[group_count + 1] = {0, 2, 3, 2};
int weight[group_count + 1][4] = {
    {0, 0, 0, 0},
    {0, 2, 3, 0},
    {0, 2, 4, 5},
    {0, 1, 3, 0}
};
int value[group_count + 1][4] = {
    {0, 0, 0, 0},
    {0, 6, 7, 0},
    {0, 4, 8, 9},
    {0, 2, 6, 0}
};
int dp[capacity + 1] = {0};

void groupedKnapsack() {
    for (int group = 1; group <= group_count; ++group) {
        for (int current_capacity = capacity; current_capacity >= 0; --current_capacity) {
            for (int item = 1; item <= item_count[group]; ++item) {
                if (weight[group][item] <= current_capacity) {
                    dp[current_capacity] = std::max(
                        dp[current_capacity],
                        dp[current_capacity - weight[group][item]] + value[group][item]
                    );
                }
            }
        }
    }
}

int main() {
    groupedKnapsack();
    printf("%d\n", dp[capacity]);
    return 0;
}
