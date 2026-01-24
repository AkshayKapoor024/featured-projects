const CODE_TEMPLATES = {
  javascript: `function solve(input) {
  // Write your code here
}

process.stdin.resume();
process.stdin.setEncoding("utf8");
let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => solve(input.trim()));`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,

  python: `def solve():
    pass

if __name__ == "__main__":
    solve()`
};
