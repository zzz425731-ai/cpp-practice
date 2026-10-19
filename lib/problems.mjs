// 原创中文 C++17 练习题库。题目、样例与测试数据随项目提供。
export const problems = [
  {
    "id": "P001",
    "title": "两段路程",
    "difficulty": "入门",
    "topic": "输入输出",
    "tags": [
      "输入输出",
      "long long"
    ],
    "statement": "小车先行驶 a 米，再行驶 b 米。请计算总路程。",
    "inputFormat": "一行两个整数 a、b。",
    "outputFormat": "输出一个整数，表示总路程。",
    "constraints": "0 ≤ a,b ≤ 10^12。",
    "samples": [
      {
        "input": "3 5\n",
        "output": "8\n"
      },
      {
        "input": "0 0\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "结果可能超过 int 的范围。",
      "使用 long long 存储并相加。"
    ],
    "explanation": "直接计算 a+b。时间复杂度 O(1)，额外空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a,b; cin>>a>>b; cout<<a+b<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 5\n",
        "output": "8\n"
      },
      {
        "input": "0 0\n",
        "output": "0\n"
      },
      {
        "input": "0 9\n",
        "output": "9\n"
      },
      {
        "input": "1000000000000 1000000000000\n",
        "output": "2000000000000\n"
      },
      {
        "input": "999999999999 1\n",
        "output": "1000000000000\n"
      },
      {
        "input": "48 72\n",
        "output": "120\n"
      }
    ]
  },
  {
    "id": "P002",
    "title": "整理计时器",
    "difficulty": "入门",
    "topic": "整数运算",
    "tags": [
      "整数除法",
      "取模"
    ],
    "statement": "计时器显示 s 秒。把它转换成完整的小时、剩余分钟和剩余秒数；小时可以超过 23。",
    "inputFormat": "一行一个整数 s。",
    "outputFormat": "依次输出小时、分钟、秒，以空格分隔。",
    "constraints": "0 ≤ s ≤ 10^12。",
    "samples": [
      {
        "input": "3661\n",
        "output": "1 1 1\n"
      },
      {
        "input": "59\n",
        "output": "0 0 59\n"
      }
    ],
    "hints": [
      "一小时等于 3600 秒。",
      "先求商，再对余数继续拆分。"
    ],
    "explanation": "小时为 s/3600，分钟为 (s%3600)/60，秒为 s%60。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long s; cin>>s; cout<<s/3600<<\" \"<<s%3600/60<<\" \"<<s%60<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3661\n",
        "output": "1 1 1\n"
      },
      {
        "input": "59\n",
        "output": "0 0 59\n"
      },
      {
        "input": "0\n",
        "output": "0 0 0\n"
      },
      {
        "input": "3600\n",
        "output": "1 0 0\n"
      },
      {
        "input": "86400\n",
        "output": "24 0 0\n"
      },
      {
        "input": "1000000000000\n",
        "output": "277777777 46 40\n"
      }
    ]
  },
  {
    "id": "P003",
    "title": "围起菜园",
    "difficulty": "入门",
    "topic": "整数运算",
    "tags": [
      "表达式",
      "long long"
    ],
    "statement": "一块长方形菜园长 a 米、宽 b 米。求它的周长和面积。",
    "inputFormat": "一行两个正整数 a、b。",
    "outputFormat": "输出周长和面积，以空格分隔。",
    "constraints": "1 ≤ a,b ≤ 10^9，使用 64 位整数。",
    "samples": [
      {
        "input": "3 4\n",
        "output": "14 12\n"
      },
      {
        "input": "1 1\n",
        "output": "4 1\n"
      }
    ],
    "hints": [
      "周长是两倍的长加宽。",
      "乘积需要 long long。"
    ],
    "explanation": "根据长方形公式计算 2×(a+b) 和 a×b。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a,b; cin>>a>>b; cout<<2*(a+b)<<\" \"<<a*b<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 4\n",
        "output": "14 12\n"
      },
      {
        "input": "1 1\n",
        "output": "4 1\n"
      },
      {
        "input": "1 1000000000\n",
        "output": "2000000002 1000000000\n"
      },
      {
        "input": "1000000000 1000000000\n",
        "output": "4000000000 1000000000000000000\n"
      },
      {
        "input": "8 8\n",
        "output": "32 64\n"
      },
      {
        "input": "12345 67890\n",
        "output": "160470 838102050\n"
      }
    ]
  },
  {
    "id": "P004",
    "title": "分装铅笔",
    "difficulty": "入门",
    "topic": "整数运算",
    "tags": [
      "整数除法",
      "取模"
    ],
    "statement": "仓库有 n 支铅笔，每盒最多装 k 支。先尽量装满盒子，求能装满几盒，以及剩余多少支。",
    "inputFormat": "一行两个整数 n、k。",
    "outputFormat": "输出装满的盒数与剩余支数。",
    "constraints": "0 ≤ n ≤ 10^12；1 ≤ k ≤ 10^6。",
    "samples": [
      {
        "input": "17 5\n",
        "output": "3 2\n"
      },
      {
        "input": "0 7\n",
        "output": "0 0\n"
      }
    ],
    "hints": [
      "整数除法求完整盒数。",
      "余数就是未装盒的铅笔数。"
    ],
    "explanation": "计算 n/k 与 n%k。k 保证非零。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n,k; cin>>n>>k; cout<<n/k<<\" \"<<n%k<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "17 5\n",
        "output": "3 2\n"
      },
      {
        "input": "0 7\n",
        "output": "0 0\n"
      },
      {
        "input": "6 10\n",
        "output": "0 6\n"
      },
      {
        "input": "100 10\n",
        "output": "10 0\n"
      },
      {
        "input": "1000000000000 1\n",
        "output": "1000000000000 0\n"
      },
      {
        "input": "1000000000000 999983\n",
        "output": "1000017 289\n"
      }
    ]
  },
  {
    "id": "P005",
    "title": "温度标记",
    "difficulty": "入门",
    "topic": "条件分支",
    "tags": [
      "if",
      "比较运算"
    ],
    "statement": "输入一个整数温度 t。低于零标记为 NEGATIVE，高于零标记为 POSITIVE，恰好为零标记为 ZERO。",
    "inputFormat": "一行一个整数 t。",
    "outputFormat": "输出对应的英文大写标记。",
    "constraints": "−10^9 ≤ t ≤ 10^9。",
    "samples": [
      {
        "input": "-5\n",
        "output": "NEGATIVE\n"
      },
      {
        "input": "0\n",
        "output": "ZERO\n"
      }
    ],
    "hints": [
      "把负数、正数和零分成三个互斥的情况。",
      "if、else if、else 可以完整覆盖。"
    ],
    "explanation": "按 t 与零的大小关系输出标记。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long t; cin>>t; if(t<0) cout<<\"NEGATIVE\\n\"; else if(t>0) cout<<\"POSITIVE\\n\"; else cout<<\"ZERO\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "-5\n",
        "output": "NEGATIVE\n"
      },
      {
        "input": "0\n",
        "output": "ZERO\n"
      },
      {
        "input": "8\n",
        "output": "POSITIVE\n"
      },
      {
        "input": "-1000000000\n",
        "output": "NEGATIVE\n"
      },
      {
        "input": "1000000000\n",
        "output": "POSITIVE\n"
      },
      {
        "input": "-1\n",
        "output": "NEGATIVE\n"
      }
    ]
  },
  {
    "id": "P006",
    "title": "三座信号塔",
    "difficulty": "入门",
    "topic": "条件分支",
    "tags": [
      "条件分支",
      "最值"
    ],
    "statement": "三座信号塔的高度分别为 a、b、c。输出最高的高度；高度相同也只输出一次。",
    "inputFormat": "一行三个整数 a、b、c。",
    "outputFormat": "输出三个数的最大值。",
    "constraints": "−10^12 ≤ a,b,c ≤ 10^12。",
    "samples": [
      {
        "input": "2 9 5\n",
        "output": "9\n"
      },
      {
        "input": "-5 -3 -8\n",
        "output": "-3\n"
      }
    ],
    "hints": [
      "先比较前两个数。",
      "也可以使用 max 函数。"
    ],
    "explanation": "用两次比较得到最大值。允许负数，因此不要把初始最大值设成零。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a,b,c; cin>>a>>b>>c; cout<<max(a,max(b,c))<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "2 9 5\n",
        "output": "9\n"
      },
      {
        "input": "-5 -3 -8\n",
        "output": "-3\n"
      },
      {
        "input": "0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "1000000000000 -1000000000000 7\n",
        "output": "1000000000000\n"
      },
      {
        "input": "4 4 1\n",
        "output": "4\n"
      },
      {
        "input": "3 2 1\n",
        "output": "3\n"
      }
    ]
  },
  {
    "id": "P007",
    "title": "成绩标签",
    "difficulty": "入门",
    "topic": "条件分支",
    "tags": [
      "if",
      "区间边界"
    ],
    "statement": "给定一次测验的整数成绩 s：90 分及以上为 A，80～89 分为 B，60～79 分为 C，低于 60 分为 D。",
    "inputFormat": "一行一个整数 s。",
    "outputFormat": "输出成绩对应的单个大写字母。",
    "constraints": "0 ≤ s ≤ 100。",
    "samples": [
      {
        "input": "90\n",
        "output": "A\n"
      },
      {
        "input": "59\n",
        "output": "D\n"
      }
    ],
    "hints": [
      "按阈值从大到小判断。",
      "注意 60、80、90 恰好位于边界。"
    ],
    "explanation": "顺次检查 s≥90、s≥80、s≥60，其余情况输出 D。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int s; cin>>s; if(s>=90) cout<<\"A\\n\"; else if(s>=80) cout<<\"B\\n\"; else if(s>=60) cout<<\"C\\n\"; else cout<<\"D\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "90\n",
        "output": "A\n"
      },
      {
        "input": "59\n",
        "output": "D\n"
      },
      {
        "input": "80\n",
        "output": "B\n"
      },
      {
        "input": "60\n",
        "output": "C\n"
      },
      {
        "input": "100\n",
        "output": "A\n"
      },
      {
        "input": "0\n",
        "output": "D\n"
      }
    ]
  },
  {
    "id": "P008",
    "title": "日历校验",
    "difficulty": "基础",
    "topic": "条件分支",
    "tags": [
      "逻辑运算",
      "取模"
    ],
    "statement": "日历系统采用公历。判断年份 y 是否为闰年：能被 400 整除，或者能被 4 整除但不能被 100 整除时，是闰年。",
    "inputFormat": "一行一个正整数 y。",
    "outputFormat": "闰年输出 YES，否则输出 NO。",
    "constraints": "1 ≤ y ≤ 10^9。",
    "samples": [
      {
        "input": "2000\n",
        "output": "YES\n"
      },
      {
        "input": "1900\n",
        "output": "NO\n"
      }
    ],
    "hints": [
      "整百年份需要单独考虑。",
      "用逻辑与、逻辑或组合条件。"
    ],
    "explanation": "直接套用题目给出的公历规则。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long y; cin>>y; cout<<((y%400==0||(y%4==0&&y%100!=0))?\"YES\":\"NO\")<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "2000\n",
        "output": "YES\n"
      },
      {
        "input": "1900\n",
        "output": "NO\n"
      },
      {
        "input": "2024\n",
        "output": "YES\n"
      },
      {
        "input": "2023\n",
        "output": "NO\n"
      },
      {
        "input": "1\n",
        "output": "NO\n"
      },
      {
        "input": "1000000000\n",
        "output": "YES\n"
      }
    ]
  },
  {
    "id": "P009",
    "title": "阶梯积分",
    "difficulty": "入门",
    "topic": "循环",
    "tags": [
      "等差数列",
      "long long"
    ],
    "statement": "小舟完成第 i 天的练习可获得 i 分。连续完成 n 天后，求总积分。",
    "inputFormat": "一行一个整数 n。",
    "outputFormat": "输出 1+2+…+n；n 为 0 时输出 0。",
    "constraints": "0 ≤ n ≤ 10^9。",
    "samples": [
      {
        "input": "5\n",
        "output": "15\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "小范围可以循环累加。",
      "大范围可用等差数列求和公式。"
    ],
    "explanation": "使用 n×(n+1)/2，最大乘积仍在 long long 范围内。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n; cin>>n; cout<<n*(n+1)/2<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n",
        "output": "15\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "2\n",
        "output": "3\n"
      },
      {
        "input": "100000\n",
        "output": "5000050000\n"
      },
      {
        "input": "1000000000\n",
        "output": "500000000500000000\n"
      }
    ]
  },
  {
    "id": "P010",
    "title": "数字能量",
    "difficulty": "入门",
    "topic": "循环",
    "tags": [
      "循环",
      "数位拆分"
    ],
    "statement": "一个非负整数的数字能量等于其十进制各位数字之和。求 n 的数字能量。",
    "inputFormat": "一行一个非负整数 n，不含多余前导零。",
    "outputFormat": "输出各位数字之和。",
    "constraints": "0 ≤ n ≤ 10^18。",
    "samples": [
      {
        "input": "507\n",
        "output": "12\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "n%10 可以取出个位。",
      "每次用 n/10 删除最后一位。"
    ],
    "explanation": "重复取个位并累加，直到 n 变为零。用 do-while 也能自然处理 n=0。时间 O(位数)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n; cin>>n; int s=0; do { s+=n%10; n/=10; } while(n); cout<<s<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "507\n",
        "output": "12\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "9\n",
        "output": "9\n"
      },
      {
        "input": "1000000000000000000\n",
        "output": "1\n"
      },
      {
        "input": "999999999999999999\n",
        "output": "162\n"
      },
      {
        "input": "1002003004\n",
        "output": "10\n"
      }
    ]
  },
  {
    "id": "P011",
    "title": "倒放编号",
    "difficulty": "入门",
    "topic": "循环",
    "tags": [
      "数位拆分",
      "循环"
    ],
    "statement": "把非负整数 n 的十进制数字顺序颠倒，再以整数形式输出。颠倒后的前导零会被去掉，例如 1200 变成 21。",
    "inputFormat": "一行一个非负整数 n，不含多余前导零。",
    "outputFormat": "输出颠倒后的整数。",
    "constraints": "0 ≤ n ≤ 10^18；结果保证在 64 位有符号整数范围内。",
    "samples": [
      {
        "input": "1200\n",
        "output": "21\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "每取得一个个位，就把它接到结果末尾。",
      "接入一位时先把结果乘 10。"
    ],
    "explanation": "循环执行 r=r×10+n%10 和 n/=10。n 为零时初值 r=0 即为答案。时间 O(位数)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n,r=0; cin>>n; while(n){ r=r*10+n%10; n/=10; } cout<<r<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "1200\n",
        "output": "21\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "7\n",
        "output": "7\n"
      },
      {
        "input": "123456789\n",
        "output": "987654321\n"
      },
      {
        "input": "1000000000000000000\n",
        "output": "1\n"
      },
      {
        "input": "900009\n",
        "output": "900009\n"
      }
    ]
  },
  {
    "id": "P012",
    "title": "整点巡检",
    "difficulty": "基础",
    "topic": "整数运算",
    "tags": [
      "倍数",
      "整数除法"
    ],
    "statement": "编号从 1 到 n 的设备中，编号能被 k 整除的设备需要巡检。求需要巡检的设备数量。",
    "inputFormat": "一行两个正整数 n、k。",
    "outputFormat": "输出符合要求的设备数量。",
    "constraints": "1 ≤ n,k ≤ 10^12。",
    "samples": [
      {
        "input": "20 3\n",
        "output": "6\n"
      },
      {
        "input": "3 9\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "符合要求的编号为 k、2k、3k……。",
      "最后一个倍数不超过 n。"
    ],
    "explanation": "满足 m×k≤n 的正整数 m 共有 floor(n/k) 个。时间 O(1)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n,k; cin>>n>>k; cout<<n/k<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "20 3\n",
        "output": "6\n"
      },
      {
        "input": "3 9\n",
        "output": "0\n"
      },
      {
        "input": "1 1\n",
        "output": "1\n"
      },
      {
        "input": "1000000000000 1\n",
        "output": "1000000000000\n"
      },
      {
        "input": "1000000000000 1000000000000\n",
        "output": "1\n"
      },
      {
        "input": "100 7\n",
        "output": "14\n"
      }
    ]
  },
  {
    "id": "P013",
    "title": "排列计数",
    "difficulty": "基础",
    "topic": "循环",
    "tags": [
      "循环",
      "阶乘"
    ],
    "statement": "n 个不同的徽章排成一行，共有 n! 种顺序。计算 n!；按约定 0!=1。",
    "inputFormat": "一行一个整数 n。",
    "outputFormat": "输出 n! 的精确整数值。",
    "constraints": "0 ≤ n ≤ 20。",
    "samples": [
      {
        "input": "5\n",
        "output": "120\n"
      },
      {
        "input": "0\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "把乘积初值设成 1。",
      "20! 需要 long long。"
    ],
    "explanation": "从 2 到 n 依次相乘。0 和 1 都不会进入循环，答案为 1。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long ans=1; for(int i=2;i<=n;i++) ans*=i; cout<<ans<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n",
        "output": "120\n"
      },
      {
        "input": "0\n",
        "output": "1\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "2\n",
        "output": "2\n"
      },
      {
        "input": "10\n",
        "output": "3628800\n"
      },
      {
        "input": "20\n",
        "output": "2432902008176640000\n"
      }
    ]
  },
  {
    "id": "P014",
    "title": "生长序列",
    "difficulty": "基础",
    "topic": "循环",
    "tags": [
      "递推",
      "斐波那契"
    ],
    "statement": "定义 F0=0、F1=1，且 n≥2 时 Fn=F(n−1)+F(n−2)。输入 n，求 Fn。",
    "inputFormat": "一行一个整数 n。",
    "outputFormat": "输出 Fn。",
    "constraints": "0 ≤ n ≤ 90。",
    "samples": [
      {
        "input": "6\n",
        "output": "8\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "只需保存相邻的两项。",
      "n=0 应输出 0。"
    ],
    "explanation": "使用 a、b 保存相邻项，进行 n 次迭代后 a 为 Fn。n≤90，计算中间的 F91 也未超出 long long。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long a=0,b=1; for(int i=0;i<n;i++){ long long c=a+b; a=b; b=c; } cout<<a<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "6\n",
        "output": "8\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "2\n",
        "output": "1\n"
      },
      {
        "input": "45\n",
        "output": "1134903170\n"
      },
      {
        "input": "90\n",
        "output": "2880067194370816120\n"
      }
    ]
  },
  {
    "id": "P015",
    "title": "编号中的数字",
    "difficulty": "基础",
    "topic": "字符串",
    "tags": [
      "字符统计",
      "前导零"
    ],
    "statement": "给定一个十进制编号 s 和一个数字字符 d，统计 d 在 s 中出现了多少次。编号允许有前导零。",
    "inputFormat": "第一行是字符串 s；第二行是一个数字 d。",
    "outputFormat": "输出出现次数。",
    "constraints": "1 ≤ |s| ≤ 100000；s 和 d 仅含 0～9。",
    "samples": [
      {
        "input": "10020\n0\n",
        "output": "3\n"
      },
      {
        "input": "000\n0\n",
        "output": "3\n"
      }
    ],
    "hints": [
      "用字符串保留前导零。",
      "逐个比较字符即可。"
    ],
    "explanation": "遍历 s 并累加与 d 相等的位置数量。时间 O(|s|)，空间 O(|s|)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s; char d; cin>>s>>d; int cnt=0; for(char c:s) if(c==d) cnt++; cout<<cnt<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "10020\n0\n",
        "output": "3\n"
      },
      {
        "input": "000\n0\n",
        "output": "3\n"
      },
      {
        "input": "12345\n9\n",
        "output": "0\n"
      },
      {
        "input": "7\n7\n",
        "output": "1\n"
      },
      {
        "input": "9876543210\n0\n",
        "output": "1\n"
      },
      {
        "input": "111212111\n1\n",
        "output": "7\n"
      }
    ]
  },
  {
    "id": "P016",
    "title": "素数门牌",
    "difficulty": "基础",
    "topic": "数论",
    "tags": [
      "试除法",
      "素数"
    ],
    "statement": "门牌号 n 若大于 1 且只有 1 和自身两个正因数，就被称为素数门牌。判断 n 是否为素数。",
    "inputFormat": "一行一个整数 n。",
    "outputFormat": "是素数输出 YES，否则输出 NO。",
    "constraints": "0 ≤ n ≤ 10^9。",
    "samples": [
      {
        "input": "17\n",
        "output": "YES\n"
      },
      {
        "input": "1\n",
        "output": "NO\n"
      }
    ],
    "hints": [
      "合数至少有一个因数不超过它的平方根。",
      "0 和 1 都不是素数。"
    ],
    "explanation": "排除小于 2 的整数，再试除 2 到 sqrt(n)。若找到因数就是合数。时间 O(√n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long n; cin>>n; bool ok=n>=2; for(long long d=2;d*d<=n&&ok;d++) if(n%d==0) ok=false; cout<<(ok?\"YES\":\"NO\")<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "17\n",
        "output": "YES\n"
      },
      {
        "input": "1\n",
        "output": "NO\n"
      },
      {
        "input": "0\n",
        "output": "NO\n"
      },
      {
        "input": "2\n",
        "output": "YES\n"
      },
      {
        "input": "999950884\n",
        "output": "NO\n"
      },
      {
        "input": "999999937\n",
        "output": "YES\n"
      }
    ]
  },
  {
    "id": "P017",
    "title": "绳子的分段",
    "difficulty": "基础",
    "topic": "数论",
    "tags": [
      "最大公约数",
      "欧几里得算法"
    ],
    "statement": "两根绳子长度为 a 和 b，需要切成长度相同的整米小段，且两根绳子都不能剩余。求每段的最大长度。",
    "inputFormat": "一行两个正整数 a、b。",
    "outputFormat": "输出最大公约数。",
    "constraints": "1 ≤ a,b ≤ 10^12。",
    "samples": [
      {
        "input": "18 24\n",
        "output": "6\n"
      },
      {
        "input": "1 999\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "答案是 a 和 b 的最大公约数。",
      "利用 gcd(a,b)=gcd(b,a%b)。"
    ],
    "explanation": "辗转相除直到第二个数变为零，第一个数就是答案。时间 O(log min(a,b))，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a,b; cin>>a>>b; while(b){ long long r=a%b; a=b; b=r; } cout<<a<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "18 24\n",
        "output": "6\n"
      },
      {
        "input": "1 999\n",
        "output": "1\n"
      },
      {
        "input": "37 37\n",
        "output": "37\n"
      },
      {
        "input": "1000000000000 999999999999\n",
        "output": "1\n"
      },
      {
        "input": "84 30\n",
        "output": "6\n"
      },
      {
        "input": "9999999967 123456789\n",
        "output": "1\n"
      }
    ]
  },
  {
    "id": "P018",
    "title": "同步闪灯",
    "difficulty": "基础",
    "topic": "数论",
    "tags": [
      "最小公倍数",
      "最大公约数"
    ],
    "statement": "两盏灯在时刻 0 同时闪烁，之后分别每 a 秒、每 b 秒闪烁一次。求它们下一次同时闪烁的时刻。",
    "inputFormat": "一行两个正整数 a、b。",
    "outputFormat": "输出最小的正整数时刻。",
    "constraints": "1 ≤ a,b ≤ 10^9。",
    "samples": [
      {
        "input": "6 8\n",
        "output": "24\n"
      },
      {
        "input": "1 1\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "答案是 a 和 b 的最小公倍数。",
      "先除以最大公约数，再相乘。"
    ],
    "explanation": "lcm(a,b)=a/gcd(a,b)×b。最大结果不超过 10^18。时间 O(log min(a,b))，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a,b; cin>>a>>b; cout<<a/gcd(a,b)*b<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "6 8\n",
        "output": "24\n"
      },
      {
        "input": "1 1\n",
        "output": "1\n"
      },
      {
        "input": "12 18\n",
        "output": "36\n"
      },
      {
        "input": "1000000000 999999999\n",
        "output": "999999999000000000\n"
      },
      {
        "input": "7 49\n",
        "output": "49\n"
      },
      {
        "input": "99991 99989\n",
        "output": "9998000099\n"
      }
    ]
  },
  {
    "id": "P019",
    "title": "每日净收入",
    "difficulty": "基础",
    "topic": "数组",
    "tags": [
      "数组遍历",
      "累加"
    ],
    "statement": "商店记录了 n 天的净收入，负数表示亏损。求这 n 天的净收入总和。",
    "inputFormat": "第一行一个整数 n；第二行 n 个整数 ai。",
    "outputFormat": "输出所有 ai 的总和。",
    "constraints": "1 ≤ n ≤ 100000；−10^9 ≤ ai ≤ 10^9。",
    "samples": [
      {
        "input": "3\n3 -1 5\n",
        "output": "7\n"
      },
      {
        "input": "1\n-9\n",
        "output": "-9\n"
      }
    ],
    "hints": [
      "用 long long 累加。",
      "不必保存整个数组。"
    ],
    "explanation": "输入一个数就加入总和。时间 O(n)，额外空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long sum=0,x; for(int i=0;i<n;i++){ cin>>x; sum+=x; } cout<<sum<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3\n3 -1 5\n",
        "output": "7\n"
      },
      {
        "input": "1\n-9\n",
        "output": "-9\n"
      },
      {
        "input": "3\n0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "6\n1000000000 1000000000 1000000000 1000000000 1000000000 1000000000\n",
        "output": "6000000000\n"
      },
      {
        "input": "5\n-1000000000 -1000000000 -1000000000 -1000000000 -1000000000\n",
        "output": "-5000000000\n"
      },
      {
        "input": "6\n1 -1 2 -2 3 -3\n",
        "output": "0\n"
      }
    ]
  },
  {
    "id": "P020",
    "title": "温差记录",
    "difficulty": "基础",
    "topic": "数组",
    "tags": [
      "最值",
      "数组遍历"
    ],
    "statement": "给出 n 次整数温度记录。找到最低温、最高温和它们的差。",
    "inputFormat": "第一行 n；第二行 n 个整数 ai。",
    "outputFormat": "依次输出最小值、最大值和最大值减最小值。",
    "constraints": "1 ≤ n ≤ 100000；−10^9 ≤ ai ≤ 10^9。",
    "samples": [
      {
        "input": "3\n5 -2 9\n",
        "output": "-2 9 11\n"
      },
      {
        "input": "1\n7\n",
        "output": "7 7 0\n"
      }
    ],
    "hints": [
      "最小值和最大值应正确初始化。",
      "只含负数时最大值仍是负数。"
    ],
    "explanation": "遍历更新最小值与最大值，再求差。使用 64 位整数可安全存储差值。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long x,lo=LLONG_MAX,hi=LLONG_MIN; while(n--){ cin>>x; lo=min(lo,x); hi=max(hi,x); } cout<<lo<<\" \"<<hi<<\" \"<<hi-lo<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3\n5 -2 9\n",
        "output": "-2 9 11\n"
      },
      {
        "input": "1\n7\n",
        "output": "7 7 0\n"
      },
      {
        "input": "3\n-9 -3 -8\n",
        "output": "-9 -3 6\n"
      },
      {
        "input": "2\n0 0\n",
        "output": "0 0 0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "-1000000000 1000000000 2000000000\n"
      },
      {
        "input": "4\n100 30 20 80\n",
        "output": "20 100 80\n"
      }
    ]
  },
  {
    "id": "P021",
    "title": "寻找目标卡片",
    "difficulty": "基础",
    "topic": "数组",
    "tags": [
      "计数",
      "数组遍历"
    ],
    "statement": "桌上按顺序摆放 n 张卡片，卡片上写有整数。统计写着目标数字 x 的卡片数。",
    "inputFormat": "第一行 n 和 x；第二行 n 个整数。",
    "outputFormat": "输出目标数字出现次数。",
    "constraints": "1 ≤ n ≤ 100000；所有整数绝对值不超过 10^9。",
    "samples": [
      {
        "input": "5 1\n1 3 1 2 1\n",
        "output": "3\n"
      },
      {
        "input": "1 8\n8\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "每读到一个元素就与 x 比较。",
      "重复元素要分别计数。"
    ],
    "explanation": "逐项判断并累加计数器。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; long long x,a; cin>>n>>x; int count=0; while(n--){ cin>>a; if(a==x) count++; } cout<<count<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 1\n1 3 1 2 1\n",
        "output": "3\n"
      },
      {
        "input": "1 8\n8\n",
        "output": "1\n"
      },
      {
        "input": "3 9\n1 2 3\n",
        "output": "0\n"
      },
      {
        "input": "3 0\n0 0 0\n",
        "output": "3\n"
      },
      {
        "input": "3 -1\n-1 0 -1\n",
        "output": "2\n"
      },
      {
        "input": "5 3\n5 4 3 2 1\n",
        "output": "1\n"
      }
    ]
  },
  {
    "id": "P022",
    "title": "倒序看板",
    "difficulty": "基础",
    "topic": "数组",
    "tags": [
      "数组下标",
      "逆序"
    ],
    "statement": "看板有 n 个整数。请按与输入相反的顺序输出。",
    "inputFormat": "第一行 n；第二行 n 个整数。",
    "outputFormat": "输出倒序后的 n 个整数，以空格分隔。",
    "constraints": "1 ≤ n ≤ 100000；整数绝对值不超过 10^9。",
    "samples": [
      {
        "input": "3\n1 2 3\n",
        "output": "3 2 1\n"
      },
      {
        "input": "1\n8\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "倒序访问下标 n−1 到 0。",
      "注意不要访问下标 n。"
    ],
    "explanation": "保存数组并从最后一个元素向前输出。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; vector<long long>a(n); for(auto &x:a) cin>>x; for(int i=n-1;i>=0;i--) cout<<a[i]<<(i==0?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3\n1 2 3\n",
        "output": "3 2 1\n"
      },
      {
        "input": "1\n8\n",
        "output": "8\n"
      },
      {
        "input": "2\n0 0\n",
        "output": "0 0\n"
      },
      {
        "input": "4\n-1 -2 -3 4\n",
        "output": "4 -3 -2 -1\n"
      },
      {
        "input": "5\n9 8 7 6 5\n",
        "output": "5 6 7 8 9\n"
      },
      {
        "input": "2\n1000000000 -1000000000\n",
        "output": "-1000000000 1000000000\n"
      }
    ]
  },
  {
    "id": "P023",
    "title": "循环换座",
    "difficulty": "基础",
    "topic": "数组",
    "tags": [
      "循环数组",
      "取模"
    ],
    "statement": "n 个编号排成一行。将整个序列向右循环移动 k 位：移出右端的元素依次回到左端。",
    "inputFormat": "第一行 n 和 k；第二行 n 个整数。",
    "outputFormat": "输出移动后的序列。",
    "constraints": "1 ≤ n ≤ 100000；0 ≤ k ≤ 10^12；元素绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5 2\n1 2 3 4 5\n",
        "output": "4 5 1 2 3\n"
      },
      {
        "input": "1 10\n8\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "移动 n 位后序列不变。",
      "先令 k 对 n 取模。"
    ],
    "explanation": "输出位置 i 对应原数组下标 (i−k+n)%n。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; long long k; cin>>n>>k; vector<long long>a(n); for(auto &x:a) cin>>x; k%=n; for(int i=0;i<n;i++) cout<<a[(i-k+n)%n]<<(i+1==n?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 2\n1 2 3 4 5\n",
        "output": "4 5 1 2 3\n"
      },
      {
        "input": "1 10\n8\n",
        "output": "8\n"
      },
      {
        "input": "3 0\n1 2 3\n",
        "output": "1 2 3\n"
      },
      {
        "input": "3 3\n1 2 3\n",
        "output": "1 2 3\n"
      },
      {
        "input": "3 8\n-2 0 4\n",
        "output": "0 4 -2\n"
      },
      {
        "input": "4 1000000000000\n9 8 7 6\n",
        "output": "9 8 7 6\n"
      }
    ]
  },
  {
    "id": "P024",
    "title": "保留首次到访",
    "difficulty": "基础",
    "topic": "集合",
    "tags": [
      "set",
      "去重",
      "顺序保留"
    ],
    "statement": "给出一串整数访客编号。每个编号只保留第一次出现的位置，并按首次出现的顺序输出。",
    "inputFormat": "第一行 n；第二行 n 个整数。",
    "outputFormat": "第一行输出保留数量；第二行输出保留的编号。",
    "constraints": "1 ≤ n ≤ 100000；编号绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5\n3 1 3 2 1\n",
        "output": "3\n3 1 2\n"
      },
      {
        "input": "1\n7\n",
        "output": "1\n7\n"
      }
    ],
    "hints": [
      "用集合记录已经出现过的编号。",
      "结果顺序来自原数组，不能直接输出有序集合。"
    ],
    "explanation": "遍历时首次插入集合成功就加入答案数组。使用 set 的时间复杂度 O(n log n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; set<long long>seen; vector<long long>ans; while(n--){ long long x; cin>>x; if(seen.insert(x).second) ans.push_back(x); } cout<<ans.size()<<\"\\n\"; for(size_t i=0;i<ans.size();i++) cout<<ans[i]<<(i+1==ans.size()?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n3 1 3 2 1\n",
        "output": "3\n3 1 2\n"
      },
      {
        "input": "1\n7\n",
        "output": "1\n7\n"
      },
      {
        "input": "3\n1 1 1\n",
        "output": "1\n1\n"
      },
      {
        "input": "5\n-2 0 -2 5 0\n",
        "output": "3\n-2 0 5\n"
      },
      {
        "input": "4\n1 2 3 4\n",
        "output": "4\n1 2 3 4\n"
      },
      {
        "input": "5\n0 0 -1 -1 1\n",
        "output": "3\n0 -1 1\n"
      }
    ]
  },
  {
    "id": "P025",
    "title": "镜面对称词",
    "difficulty": "基础",
    "topic": "字符串",
    "tags": [
      "回文",
      "双指针"
    ],
    "statement": "若一个字符串从左到右和从右到左完全相同，就称为镜面对称词。判断给定字符串是否符合要求，区分大小写。",
    "inputFormat": "一行一个不含空白的字符串 s。",
    "outputFormat": "符合输出 YES，否则输出 NO。",
    "constraints": "1 ≤ |s| ≤ 100000；只含英文字母和数字。",
    "samples": [
      {
        "input": "abccba\n",
        "output": "YES\n"
      },
      {
        "input": "abc\n",
        "output": "NO\n"
      }
    ],
    "hints": [
      "比较两端字符。",
      "只需要检查前一半的位置。"
    ],
    "explanation": "逐对比较 s[i] 与 s[n−1−i]，有一对不同即非回文。时间 O(n)，空间 O(n) 用于输入。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s; cin>>s; bool ok=true; for(size_t i=0;i<s.size()/2;i++) if(s[i]!=s[s.size()-1-i]) ok=false; cout<<(ok?\"YES\":\"NO\")<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "abccba\n",
        "output": "YES\n"
      },
      {
        "input": "abc\n",
        "output": "NO\n"
      },
      {
        "input": "x\n",
        "output": "YES\n"
      },
      {
        "input": "Aa\n",
        "output": "NO\n"
      },
      {
        "input": "1221\n",
        "output": "YES\n"
      },
      {
        "input": "abcddcba\n",
        "output": "YES\n"
      }
    ]
  },
  {
    "id": "P026",
    "title": "最常用字母",
    "difficulty": "基础",
    "topic": "字符串",
    "tags": [
      "字符统计",
      "字典序"
    ],
    "statement": "给定只含小写英文字母的字符串，找出出现次数最多的字母。若多个字母并列，输出字典序最小的那个。",
    "inputFormat": "一行一个小写字符串 s。",
    "outputFormat": "输出获选字母及其出现次数，以空格分隔。",
    "constraints": "1 ≤ |s| ≤ 100000。",
    "samples": [
      {
        "input": "banana\n",
        "output": "a 3\n"
      },
      {
        "input": "abc\n",
        "output": "a 1\n"
      }
    ],
    "hints": [
      "用长度 26 的数组计数。",
      "从 a 到 z 扫描，只有次数严格更大才更新。"
    ],
    "explanation": "先统计频次，再按字母顺序选择最大频次。严格大于时更新可以保留并列中最小的字母。时间 O(n+26)，空间 O(26)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s; cin>>s; int cnt[26]={}; for(char c:s) cnt[c-'a']++; int best=0; for(int i=1;i<26;i++) if(cnt[i]>cnt[best]) best=i; cout<<char('a'+best)<<\" \"<<cnt[best]<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "banana\n",
        "output": "a 3\n"
      },
      {
        "input": "abc\n",
        "output": "a 1\n"
      },
      {
        "input": "zzzz\n",
        "output": "z 4\n"
      },
      {
        "input": "a\n",
        "output": "a 1\n"
      },
      {
        "input": "bbaacc\n",
        "output": "a 2\n"
      },
      {
        "input": "qwertyq\n",
        "output": "q 2\n"
      }
    ]
  },
  {
    "id": "P027",
    "title": "字母翻面",
    "difficulty": "基础",
    "topic": "字符串",
    "tags": [
      "字符处理",
      "ASCII"
    ],
    "statement": "把字符串中的小写英文字母改成大写，大写改成小写，数字保持不变。",
    "inputFormat": "一行一个只含英文字母与数字的字符串 s。",
    "outputFormat": "输出转换后的字符串。",
    "constraints": "1 ≤ |s| ≤ 100000。",
    "samples": [
      {
        "input": "Code2026\n",
        "output": "cODE2026\n"
      },
      {
        "input": "a\n",
        "output": "A\n"
      }
    ],
    "hints": [
      "先判断字符所在区间。",
      "数字不进入字母分支。"
    ],
    "explanation": "利用字母在各自大小写区间内的相对位置进行转换。时间 O(n)，空间 O(n) 用于输入。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s; cin>>s; for(char &c:s){ if(c>='a'&&c<='z') c=c-'a'+'A'; else if(c>='A'&&c<='Z') c=c-'A'+'a'; } cout<<s<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "Code2026\n",
        "output": "cODE2026\n"
      },
      {
        "input": "a\n",
        "output": "A\n"
      },
      {
        "input": "Z\n",
        "output": "z\n"
      },
      {
        "input": "123456\n",
        "output": "123456\n"
      },
      {
        "input": "aAzZ09\n",
        "output": "AaZz09\n"
      },
      {
        "input": "CppPRACTICE\n",
        "output": "cPPpractice\n"
      }
    ]
  },
  {
    "id": "P028",
    "title": "单词装箱",
    "difficulty": "基础",
    "topic": "字符串",
    "tags": [
      "字符串长度",
      "累加"
    ],
    "statement": "一只箱子要存放 n 个单词。每个字母或数字占一个位置，单词之间不计分隔符。求总共需要多少个位置。",
    "inputFormat": "第一行 n；接着输入 n 个不含空白的单词。",
    "outputFormat": "输出所有单词长度之和。",
    "constraints": "1 ≤ n ≤ 10000；每个单词长 1～100，且仅含英文字母、数字。",
    "samples": [
      {
        "input": "2\nhello\ncpp\n",
        "output": "8\n"
      },
      {
        "input": "1\na\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "cin 读取一个不含空白的单词。",
      "string 的 size() 给出长度。"
    ],
    "explanation": "逐个读入字符串并累加长度。时间 O(所有单词总长度)，额外空间 O(最长单词长度)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long ans=0; string s; while(n--){ cin>>s; ans+=s.size(); } cout<<ans<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "2\nhello\ncpp\n",
        "output": "8\n"
      },
      {
        "input": "1\na\n",
        "output": "1\n"
      },
      {
        "input": "3\nabc\ndef\nghi\n",
        "output": "9\n"
      },
      {
        "input": "3\nA1\nz\nlongword\n",
        "output": "11\n"
      },
      {
        "input": "4\nx\nx\nx\nx\n",
        "output": "4\n"
      },
      {
        "input": "3\npractice\nmakes\nprogress\n",
        "output": "21\n"
      }
    ]
  },
  {
    "id": "P029",
    "title": "整理书架编号",
    "difficulty": "基础",
    "topic": "排序",
    "tags": [
      "sort",
      "排序"
    ],
    "statement": "将 n 个整数编号从小到大排列，重复编号需要全部保留。",
    "inputFormat": "第一行 n；第二行 n 个整数。",
    "outputFormat": "输出排序后的全部整数。",
    "constraints": "1 ≤ n ≤ 100000；元素绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5\n5 2 4 1 3\n",
        "output": "1 2 3 4 5\n"
      },
      {
        "input": "1\n8\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "使用标准库 sort。",
      "默认比较方式就是从小到大。"
    ],
    "explanation": "读入数组后调用 sort，再依次输出。时间 O(n log n)，空间 O(n) 用于数组。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; vector<long long>a(n); for(auto &x:a) cin>>x; sort(a.begin(),a.end()); for(int i=0;i<n;i++) cout<<a[i]<<(i+1==n?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n5 2 4 1 3\n",
        "output": "1 2 3 4 5\n"
      },
      {
        "input": "1\n8\n",
        "output": "8\n"
      },
      {
        "input": "4\n2 2 1 1\n",
        "output": "1 1 2 2\n"
      },
      {
        "input": "4\n-5 0 -1 9\n",
        "output": "-5 -1 0 9\n"
      },
      {
        "input": "5\n5 4 3 2 1\n",
        "output": "1 2 3 4 5\n"
      },
      {
        "input": "3\n1000000000 0 -1000000000\n",
        "output": "-1000000000 0 1000000000\n"
      }
    ]
  },
  {
    "id": "P030",
    "title": "第 k 小的徽章",
    "difficulty": "基础",
    "topic": "排序",
    "tags": [
      "排序",
      "顺序统计"
    ],
    "statement": "把 n 个徽章的数字按非降序排列后，求第 k 个数字。重复数字分别占据位置。",
    "inputFormat": "第一行 n 和 k；第二行 n 个整数。",
    "outputFormat": "输出第 k 小的数字。",
    "constraints": "1 ≤ k ≤ n ≤ 100000；元素绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5 2\n9 2 7 2 5\n",
        "output": "2\n"
      },
      {
        "input": "1 1\n8\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "第 k 个元素对应下标 k−1。",
      "相同数值不需要去重。"
    ],
    "explanation": "排序后访问下标 k−1。时间 O(n log n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,k; cin>>n>>k; vector<long long>a(n); for(auto &x:a) cin>>x; sort(a.begin(),a.end()); cout<<a[k-1]<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 2\n9 2 7 2 5\n",
        "output": "2\n"
      },
      {
        "input": "1 1\n8\n",
        "output": "8\n"
      },
      {
        "input": "3 3\n1 1 1\n",
        "output": "1\n"
      },
      {
        "input": "3 1\n-9 -1 -5\n",
        "output": "-9\n"
      },
      {
        "input": "5 5\n5 4 3 2 1\n",
        "output": "5\n"
      },
      {
        "input": "4 3\n1000000000 -1000000000 0 0\n",
        "output": "0\n"
      }
    ]
  },
  {
    "id": "P031",
    "title": "不同颜色数",
    "difficulty": "基础",
    "topic": "集合",
    "tags": [
      "set",
      "去重"
    ],
    "statement": "n 颗珠子各有一个整数颜色编号。求一共出现了多少种不同颜色。",
    "inputFormat": "第一行 n；第二行 n 个整数颜色编号。",
    "outputFormat": "输出不同编号的数量。",
    "constraints": "1 ≤ n ≤ 100000；颜色编号绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5\n2 3 2 8 3\n",
        "output": "3\n"
      },
      {
        "input": "1\n1\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "集合会自动去重。",
      "也可以排序后统计相邻不同的值。"
    ],
    "explanation": "把全部编号插入 set，集合大小即答案。时间 O(n log n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; set<long long>s; while(n--){ long long x; cin>>x; s.insert(x); } cout<<s.size()<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n2 3 2 8 3\n",
        "output": "3\n"
      },
      {
        "input": "1\n1\n",
        "output": "1\n"
      },
      {
        "input": "3\n0 0 0\n",
        "output": "1\n"
      },
      {
        "input": "5\n-2 -1 0 1 2\n",
        "output": "5\n"
      },
      {
        "input": "5\n5 4 3 2 1\n",
        "output": "5\n"
      },
      {
        "input": "3\n1000000000 -1000000000 1000000000\n",
        "output": "2\n"
      }
    ]
  },
  {
    "id": "P032",
    "title": "首次匹配位置",
    "difficulty": "基础",
    "topic": "二分查找",
    "tags": [
      "lower_bound",
      "重复元素"
    ],
    "statement": "一个数组已按非降序排列。查找数字 x 第一次出现的位置，位置从 1 开始；不存在则输出 −1。",
    "inputFormat": "第一行 n 和 x；第二行 n 个有序整数。",
    "outputFormat": "输出首次出现位置或 −1。",
    "constraints": "1 ≤ n ≤ 200000；所有整数绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "5 2\n1 2 2 4 7\n",
        "output": "2\n"
      },
      {
        "input": "1 5\n5\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "找到第一个大于等于 x 的位置。",
      "找到后还需判断该位置的值是否等于 x。"
    ],
    "explanation": "lower_bound 返回第一个不小于 x 的位置，再检查是否匹配。时间 O(log n) 查询，输入与存储 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; long long x; cin>>n>>x; vector<long long>a(n); for(auto &v:a) cin>>v; auto it=lower_bound(a.begin(),a.end(),x); cout<<(it!=a.end()&&*it==x?int(it-a.begin())+1:-1)<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 2\n1 2 2 4 7\n",
        "output": "2\n"
      },
      {
        "input": "1 5\n5\n",
        "output": "1\n"
      },
      {
        "input": "3 2\n1 3 5\n",
        "output": "-1\n"
      },
      {
        "input": "4 -3\n-8 -3 -3 0\n",
        "output": "2\n"
      },
      {
        "input": "3 2\n2 2 2\n",
        "output": "1\n"
      },
      {
        "input": "3 9\n1 2 3\n",
        "output": "-1\n"
      }
    ]
  },
  {
    "id": "P033",
    "title": "插入位置咨询",
    "difficulty": "基础",
    "topic": "二分查找",
    "tags": [
      "lower_bound",
      "多次查询"
    ],
    "statement": "给定非降序数组。对于每个查询 x，求将 x 插到所有小于 x 的元素之后、所有大于等于 x 的元素之前时的位置，位置从 1 开始；可插到末尾的 n+1 位置。",
    "inputFormat": "第一行 n、q；第二行 n 个有序整数；第三行 q 个查询值。",
    "outputFormat": "每个查询输出一行插入位置。",
    "constraints": "1 ≤ n,q ≤ 200000；整数绝对值 ≤ 10^9。",
    "samples": [
      {
        "input": "4 3\n2 4 4 9\n1 4 10\n",
        "output": "1\n2\n5\n"
      },
      {
        "input": "1 3\n5\n5 6 0\n",
        "output": "1\n2\n1\n"
      }
    ],
    "hints": [
      "查询的定义就是 lower_bound。",
      "x 比所有数都大时，答案是 n+1。"
    ],
    "explanation": "对每个查询二分求首个不小于 x 的下标，转成从 1 开始的位置。总时间 O(n+q log n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,q; cin>>n>>q; vector<long long>a(n); for(auto &x:a) cin>>x; while(q--){ long long x; cin>>x; cout<<lower_bound(a.begin(),a.end(),x)-a.begin()+1<<\"\\n\"; }\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4 3\n2 4 4 9\n1 4 10\n",
        "output": "1\n2\n5\n"
      },
      {
        "input": "1 3\n5\n5 6 0\n",
        "output": "1\n2\n1\n"
      },
      {
        "input": "3 3\n-5 -1 0\n-9 -1 1\n",
        "output": "1\n2\n4\n"
      },
      {
        "input": "3 2\n1 1 1\n1 2\n",
        "output": "1\n4\n"
      },
      {
        "input": "3 3\n0 10 20\n0 11 20\n",
        "output": "1\n3\n3\n"
      },
      {
        "input": "2 3\n-1000000000 1000000000\n-1000000000 0 1000000000\n",
        "output": "1\n2\n2\n"
      }
    ]
  },
  {
    "id": "P034",
    "title": "连续日期账单",
    "difficulty": "基础",
    "topic": "前缀和",
    "tags": [
      "前缀和",
      "区间查询"
    ],
    "statement": "有 n 天的收支数据和 q 次查询。每次给定起止日期 l、r，求第 l 天到第 r 天的收支总和，包含两端。",
    "inputFormat": "第一行 n、q；第二行 n 个整数 ai；接下来 q 行各有 l、r。",
    "outputFormat": "每个查询输出一行区间和。",
    "constraints": "1 ≤ n,q ≤ 200000；1 ≤ l ≤ r ≤ n；|ai| ≤ 10^9。",
    "samples": [
      {
        "input": "4 2\n2 -1 4 3\n1 4\n2 3\n",
        "output": "8\n3\n"
      },
      {
        "input": "1 1\n8\n1 1\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "p[i] 表示前 i 天的总和。",
      "区间和是 p[r]−p[l−1]。"
    ],
    "explanation": "预处理 64 位前缀和，每次查询用两次访问和一次减法回答。总时间 O(n+q)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,q; cin>>n>>q; vector<long long>p(n+1); for(int i=1;i<=n;i++){ long long x; cin>>x; p[i]=p[i-1]+x; } while(q--){ int l,r; cin>>l>>r; cout<<p[r]-p[l-1]<<\"\\n\"; }\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4 2\n2 -1 4 3\n1 4\n2 3\n",
        "output": "8\n3\n"
      },
      {
        "input": "1 1\n8\n1 1\n",
        "output": "8\n"
      },
      {
        "input": "3 2\n0 0 0\n1 3\n2 2\n",
        "output": "0\n0\n"
      },
      {
        "input": "4 3\n-4 -3 -2 -1\n1 2\n3 4\n2 3\n",
        "output": "-7\n-3\n-5\n"
      },
      {
        "input": "5 2\n1000000000 1000000000 1000000000 1000000000 1000000000\n1 5\n2 4\n",
        "output": "5000000000\n3000000000\n"
      },
      {
        "input": "5 3\n1 -1 1 -1 1\n1 5\n2 4\n3 3\n",
        "output": "1\n-1\n1\n"
      }
    ]
  },
  {
    "id": "P035",
    "title": "最佳连续时段",
    "difficulty": "进阶",
    "topic": "动态规划",
    "tags": [
      "Kadane",
      "非空子数组"
    ],
    "statement": "从 n 天的收益中，选择一段非空的连续日期，使收益总和最大。收益可能为负数。",
    "inputFormat": "第一行 n；第二行 n 个整数收益。",
    "outputFormat": "输出非空连续子数组的最大和。",
    "constraints": "1 ≤ n ≤ 200000；|ai| ≤ 10^9。",
    "samples": [
      {
        "input": "5\n-2 3 -1 4 -6\n",
        "output": "6\n"
      },
      {
        "input": "3\n-8 -3 -9\n",
        "output": "-3\n"
      }
    ],
    "hints": [
      "考虑以当前位置结尾的最佳区间。",
      "要么从当前位置重新开始，要么接在前一段后面。"
    ],
    "explanation": "令 cur 为以当前元素结尾的最大非空区间和，则 cur=max(ai,cur+ai)，同时更新全局答案。用首元素初始化可处理全负数组。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; long long x,cur,best; cin>>x; cur=best=x; for(int i=1;i<n;i++){ cin>>x; cur=max(x,cur+x); best=max(best,cur); } cout<<best<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n-2 3 -1 4 -6\n",
        "output": "6\n"
      },
      {
        "input": "3\n-8 -3 -9\n",
        "output": "-3\n"
      },
      {
        "input": "1\n5\n",
        "output": "5\n"
      },
      {
        "input": "3\n0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "4\n1000000000 1000000000 -1 1000000000\n",
        "output": "2999999999\n"
      },
      {
        "input": "7\n4 -10 2 3 -1 6 -20\n",
        "output": "10\n"
      }
    ]
  },
  {
    "id": "P036",
    "title": "凑齐目标重量",
    "difficulty": "进阶",
    "topic": "双指针",
    "tags": [
      "有序数组",
      "双指针"
    ],
    "statement": "一个非降序数组记录物品重量。判断能否选出两个不同位置的元素，使它们的和为目标值 t。数字允许为负，两个位置上的数可以相同。",
    "inputFormat": "第一行 n 和 t；第二行 n 个非降序整数。",
    "outputFormat": "存在这样的两个位置输出 YES，否则输出 NO。",
    "constraints": "1 ≤ n ≤ 200000；|ai| ≤ 10^9；|t| ≤ 2×10^9。",
    "samples": [
      {
        "input": "4 6\n1 2 4 7\n",
        "output": "YES\n"
      },
      {
        "input": "1 6\n3\n",
        "output": "NO\n"
      }
    ],
    "hints": [
      "从最左和最右的元素开始。",
      "和过小时左端右移，和过大时右端左移。"
    ],
    "explanation": "有序性保证每次移动都能排除一批不可能的组合。使用 l<r 保证选择两个不同位置。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; long long t; cin>>n>>t; vector<long long>a(n); for(auto &x:a) cin>>x; int l=0,r=n-1; bool ok=false; while(l<r){ long long s=a[l]+a[r]; if(s==t){ ok=true; break; } if(s<t) l++; else r--; } cout<<(ok?\"YES\":\"NO\")<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4 6\n1 2 4 7\n",
        "output": "YES\n"
      },
      {
        "input": "1 6\n3\n",
        "output": "NO\n"
      },
      {
        "input": "2 2\n1 1\n",
        "output": "YES\n"
      },
      {
        "input": "4 -7\n-5 -2 0 4\n",
        "output": "YES\n"
      },
      {
        "input": "4 20\n1 3 5 9\n",
        "output": "NO\n"
      },
      {
        "input": "3 0\n-1000000000 0 1000000000\n",
        "output": "YES\n"
      }
    ]
  },
  {
    "id": "P037",
    "title": "括号检查员",
    "difficulty": "基础",
    "topic": "栈",
    "tags": [
      "栈思想",
      "前缀合法性"
    ],
    "statement": "字符串只含左圆括号和右圆括号。若每个右括号都能与前面一个尚未匹配的左括号配对，且最后没有剩余括号，则称字符串合法。",
    "inputFormat": "一行一个非空括号字符串 s。",
    "outputFormat": "合法输出 YES，否则输出 NO。",
    "constraints": "1 ≤ |s| ≤ 200000。",
    "samples": [
      {
        "input": "(()())\n",
        "output": "YES\n"
      },
      {
        "input": "())(\n",
        "output": "NO\n"
      }
    ],
    "hints": [
      "右括号不能在缺少左括号时出现。",
      "扫描结束时未配对数量必须为零。"
    ],
    "explanation": "对一种括号可用计数器模拟栈深度：遇左括号加一、右括号减一。任何前缀为负或最终不为零都不合法。时间 O(n)，空间 O(n) 用于输入。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s; cin>>s; int balance=0; bool ok=true; for(char c:s){ balance+=c=='('?1:-1; if(balance<0) ok=false; } cout<<(ok&&balance==0?\"YES\":\"NO\")<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "(()())\n",
        "output": "YES\n"
      },
      {
        "input": "())(\n",
        "output": "NO\n"
      },
      {
        "input": "(\n",
        "output": "NO\n"
      },
      {
        "input": ")(\n",
        "output": "NO\n"
      },
      {
        "input": "()()()\n",
        "output": "YES\n"
      },
      {
        "input": "(((())))\n",
        "output": "YES\n"
      }
    ]
  },
  {
    "id": "P038",
    "title": "相邻消消乐",
    "difficulty": "基础",
    "topic": "栈",
    "tags": [
      "栈",
      "字符串消除"
    ],
    "statement": "从左到右读取小写字符串。每读入一个字符，若它与当前结果最后一个字符相同，就删除结果末尾字符并丢弃新字符；否则把新字符加入末尾。输出最终结果。",
    "inputFormat": "一行一个非空小写字符串 s。",
    "outputFormat": "输出最终字符串；结果为空时输出 EMPTY。",
    "constraints": "1 ≤ |s| ≤ 200000。",
    "samples": [
      {
        "input": "abbaca\n",
        "output": "ca\n"
      },
      {
        "input": "abba\n",
        "output": "EMPTY\n"
      }
    ],
    "hints": [
      "用字符串作为栈保存当前结果。",
      "删除一对后可能产生新的可消除相邻字符。"
    ],
    "explanation": "用 back、pop_back、push_back 模拟规则。每个字符最多入栈和出栈一次。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s,st; cin>>s; for(char c:s){ if(!st.empty()&&st.back()==c) st.pop_back(); else st.push_back(c); } cout<<(st.empty()?\"EMPTY\":st)<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "abbaca\n",
        "output": "ca\n"
      },
      {
        "input": "abba\n",
        "output": "EMPTY\n"
      },
      {
        "input": "a\n",
        "output": "a\n"
      },
      {
        "input": "aaaaa\n",
        "output": "a\n"
      },
      {
        "input": "abc\n",
        "output": "abc\n"
      },
      {
        "input": "abccba\n",
        "output": "EMPTY\n"
      }
    ]
  },
  {
    "id": "P039",
    "title": "排队窗口",
    "difficulty": "基础",
    "topic": "队列",
    "tags": [
      "queue",
      "模拟"
    ],
    "statement": "维护一个初始为空的队列。push x 把 x 加入队尾；pop 删除并输出队首；front 输出队首但不删除；size 输出当前人数。对空队列执行 pop 或 front 时输出 EMPTY。push 不输出内容。",
    "inputFormat": "第一行操作数 q；随后 q 行各有一条操作。",
    "outputFormat": "按操作顺序输出每次 pop、front、size 的结果，每个占一行。",
    "constraints": "1 ≤ q ≤ 200000；|x| ≤ 10^9；至少有一条需要输出的操作。",
    "samples": [
      {
        "input": "6\npush 3\npush 7\nfront\npop\nfront\nsize\n",
        "output": "3\n3\n7\n1\n"
      },
      {
        "input": "3\nfront\npop\nsize\n",
        "output": "EMPTY\nEMPTY\n0\n"
      }
    ],
    "hints": [
      "先判断队列是否为空，再读取队首。",
      "pop 与 front 的区别是是否删除元素。"
    ],
    "explanation": "使用标准库 queue 按规则处理每条操作。总时间 O(q)，空间 O(q)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int q; cin>>q; queue<long long>a; while(q--){ string op; cin>>op; if(op==\"push\"){ long long x; cin>>x; a.push(x); } else if(op==\"size\") cout<<a.size()<<\"\\n\"; else if(a.empty()) cout<<\"EMPTY\\n\"; else { cout<<a.front()<<\"\\n\"; if(op==\"pop\") a.pop(); } }\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "6\npush 3\npush 7\nfront\npop\nfront\nsize\n",
        "output": "3\n3\n7\n1\n"
      },
      {
        "input": "3\nfront\npop\nsize\n",
        "output": "EMPTY\nEMPTY\n0\n"
      },
      {
        "input": "5\npush -5\nfront\npop\nsize\nfront\n",
        "output": "-5\n-5\n0\nEMPTY\n"
      },
      {
        "input": "6\npush 0\npush 0\nsize\npop\npop\npop\n",
        "output": "2\n0\n0\nEMPTY\n"
      },
      {
        "input": "6\npush 1\npush 2\npush 3\npop\nfront\nsize\n",
        "output": "1\n2\n2\n"
      },
      {
        "input": "5\npush 1000000000\nfront\npush -1000000000\npop\nfront\n",
        "output": "1000000000\n1000000000\n-1000000000\n"
      }
    ]
  },
  {
    "id": "P040",
    "title": "右侧更高的站点",
    "difficulty": "进阶",
    "topic": "单调栈",
    "tags": [
      "单调栈",
      "下一个更大元素"
    ],
    "statement": "给出各站点高度。对每个站点，找到右侧第一个严格高于它的站点，输出那个站点的高度；不存在时输出 −1。",
    "inputFormat": "第一行 n；第二行 n 个整数高度。",
    "outputFormat": "输出 n 个答案，以空格分隔。",
    "constraints": "1 ≤ n ≤ 200000；|ai| ≤ 10^9。",
    "samples": [
      {
        "input": "5\n2 1 2 4 3\n",
        "output": "4 2 4 -1 -1\n"
      },
      {
        "input": "1\n7\n",
        "output": "-1\n"
      }
    ],
    "hints": [
      "栈里放还没有找到答案的位置。",
      "新高度可以解决栈顶所有比它矮的站点。"
    ],
    "explanation": "维护高度非递增的位置栈。新元素严格更高时，依次弹出并填答案。相等高度不能成为答案。每个位置进出栈至多一次，时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; vector<long long>a(n),ans(n,-1); for(auto &x:a) cin>>x; stack<int>st; for(int i=0;i<n;i++){ while(!st.empty()&&a[i]>a[st.top()]){ ans[st.top()]=a[i]; st.pop(); } st.push(i); } for(int i=0;i<n;i++) cout<<ans[i]<<(i+1==n?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n2 1 2 4 3\n",
        "output": "4 2 4 -1 -1\n"
      },
      {
        "input": "1\n7\n",
        "output": "-1\n"
      },
      {
        "input": "3\n3 3 3\n",
        "output": "-1 -1 -1\n"
      },
      {
        "input": "5\n5 4 3 2 1\n",
        "output": "-1 -1 -1 -1 -1\n"
      },
      {
        "input": "5\n-3 -2 0 -1 4\n",
        "output": "-2 0 4 4 -1\n"
      },
      {
        "input": "5\n1 2 3 4 5\n",
        "output": "2 3 4 5 -1\n"
      }
    ]
  },
  {
    "id": "P041",
    "title": "固定窗口收益",
    "difficulty": "进阶",
    "topic": "滑动窗口",
    "tags": [
      "滑动窗口",
      "定长子数组"
    ],
    "statement": "从 n 天收益里选恰好 k 个连续日期，求最大收益总和。必须选择完整的 k 天，即使所有收益为负。",
    "inputFormat": "第一行 n、k；第二行 n 个整数收益。",
    "outputFormat": "输出长度恰好为 k 的连续区间最大和。",
    "constraints": "1 ≤ k ≤ n ≤ 200000；|ai| ≤ 10^9。",
    "samples": [
      {
        "input": "5 3\n1 3 -2 5 4\n",
        "output": "7\n"
      },
      {
        "input": "1 1\n8\n",
        "output": "8\n"
      }
    ],
    "hints": [
      "先求第一个 k 天窗口的总和。",
      "右移一步时加入新元素、减去离开的元素。"
    ],
    "explanation": "维护定长窗口的和，每次右移以 O(1) 更新。用首窗口初始化答案可处理全负情况。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,k; cin>>n>>k; vector<long long>a(n); for(auto &x:a) cin>>x; long long sum=0; for(int i=0;i<k;i++) sum+=a[i]; long long best=sum; for(int i=k;i<n;i++){ sum+=a[i]-a[i-k]; best=max(best,sum); } cout<<best<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 3\n1 3 -2 5 4\n",
        "output": "7\n"
      },
      {
        "input": "1 1\n8\n",
        "output": "8\n"
      },
      {
        "input": "3 2\n-5 -2 -8\n",
        "output": "-7\n"
      },
      {
        "input": "4 4\n1 2 3 4\n",
        "output": "10\n"
      },
      {
        "input": "3 2\n0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "4 2\n1000000000 -1 1000000000 -1000000000\n",
        "output": "999999999\n"
      }
    ]
  },
  {
    "id": "P042",
    "title": "仓库最短路线",
    "difficulty": "进阶",
    "topic": "广度优先搜索",
    "tags": [
      "BFS",
      "网格最短路"
    ],
    "statement": "仓库是 n 行 m 列网格，. 可以通行，# 为货架。机器人从左上角出发，只能向上下左右相邻的可通行格移动。求到右下角最少移动次数。起点与终点保证可以通行。",
    "inputFormat": "第一行 n、m；随后 n 行各有 m 个字符。",
    "outputFormat": "输出最少移动次数；无法到达输出 −1。",
    "constraints": "1 ≤ n,m ≤ 300；字符仅为 . 或 #。",
    "samples": [
      {
        "input": "3 3\n...\n.#.\n...\n",
        "output": "4\n"
      },
      {
        "input": "1 1\n.\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "每条移动边的代价相同。",
      "BFS 按距离逐层扩展，入队时标记访问。"
    ],
    "explanation": "以起点进行 BFS，距离初值为 −1。首次访问邻格时记录当前距离加一。起终点相同时答案为 0。时间 O(nm)，空间 O(nm)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,m; cin>>n>>m; vector<string>g(n); for(auto &s:g) cin>>s; vector<vector<int>>d(n,vector<int>(m,-1)); queue<pair<int,int>>q; d[0][0]=0; q.push({0,0}); int dx[]={1,-1,0,0},dy[]={0,0,1,-1}; while(!q.empty()){ auto [x,y]=q.front(); q.pop(); for(int k=0;k<4;k++){ int a=x+dx[k],b=y+dy[k]; if(a>=0&&a<n&&b>=0&&b<m&&g[a][b]=='.'&&d[a][b]==-1){ d[a][b]=d[x][y]+1; q.push({a,b}); } } } cout<<d[n-1][m-1]<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 3\n...\n.#.\n...\n",
        "output": "4\n"
      },
      {
        "input": "1 1\n.\n",
        "output": "0\n"
      },
      {
        "input": "2 2\n.#\n#.\n",
        "output": "-1\n"
      },
      {
        "input": "1 4\n....\n",
        "output": "3\n"
      },
      {
        "input": "3 3\n..#\n...\n#..\n",
        "output": "4\n"
      },
      {
        "input": "5 5\n.....\n####.\n.....\n.####\n.....\n",
        "output": "16\n"
      }
    ]
  },
  {
    "id": "P043",
    "title": "独立通信组",
    "difficulty": "进阶",
    "topic": "图遍历",
    "tags": [
      "连通分量",
      "邻接表",
      "BFS"
    ],
    "statement": "有 n 台设备和 m 条双向连接。能通过若干连接互相到达的设备属于同一个通信组。求通信组数量，孤立设备也算一组。",
    "inputFormat": "第一行 n、m；随后 m 行各有一条连接的端点 u、v。",
    "outputFormat": "输出连通分量数量。",
    "constraints": "1 ≤ n ≤ 100000；0 ≤ m ≤ 200000；1 ≤ u,v ≤ n；无自环和重复边。",
    "samples": [
      {
        "input": "5 3\n1 2\n2 3\n4 5\n",
        "output": "2\n"
      },
      {
        "input": "1 0\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "一次遍历只能覆盖所在的一个通信组。",
      "每发现一个未访问点，就从它开始新一轮 BFS。"
    ],
    "explanation": "遍历全部设备，对未访问点启动 BFS 并增加组数。邻接表存图避免 n×n 空间。时间 O(n+m)，空间 O(n+m)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,m; cin>>n>>m; vector<vector<int>>g(n); while(m--){ int u,v; cin>>u>>v; --u;--v; g[u].push_back(v); g[v].push_back(u); } vector<int>seen(n); int ans=0; for(int s=0;s<n;s++) if(!seen[s]){ ans++; queue<int>q; q.push(s); seen[s]=1; while(!q.empty()){ int u=q.front();q.pop(); for(int v:g[u]) if(!seen[v]){ seen[v]=1;q.push(v); } } } cout<<ans<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 3\n1 2\n2 3\n4 5\n",
        "output": "2\n"
      },
      {
        "input": "1 0\n",
        "output": "1\n"
      },
      {
        "input": "4 0\n",
        "output": "4\n"
      },
      {
        "input": "4 4\n1 2\n2 3\n3 4\n4 1\n",
        "output": "1\n"
      },
      {
        "input": "6 4\n1 2\n2 3\n1 3\n4 5\n",
        "output": "3\n"
      },
      {
        "input": "5 4\n1 2\n2 3\n3 4\n4 5\n",
        "output": "1\n"
      }
    ]
  },
  {
    "id": "P044",
    "title": "树上的快递距离",
    "difficulty": "进阶",
    "topic": "树",
    "tags": [
      "树遍历",
      "BFS",
      "距离"
    ],
    "statement": "n 个站点由 n−1 条双向道路连接成一棵树，每条道路长 1。快递从站点 s 出发，求它到每个站点的距离。",
    "inputFormat": "第一行 n、s；随后 n−1 行各有道路端点 u、v。",
    "outputFormat": "按站点 1 到 n 的顺序输出距离。",
    "constraints": "1 ≤ n ≤ 100000；输入保证为树；1 ≤ s,u,v ≤ n。",
    "samples": [
      {
        "input": "5 1\n1 2\n1 3\n3 4\n3 5\n",
        "output": "0 1 1 2 2\n"
      },
      {
        "input": "1 1\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "树中两点间只有一条简单路径。",
      "从 s 做一次 BFS 可同时得到全部距离。"
    ],
    "explanation": "邻接表建树，从 s 出发按层遍历。避免递归可防止长链导致调用栈过深。时间 O(n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,s; cin>>n>>s; --s; vector<vector<int>>g(n); for(int i=1;i<n;i++){ int u,v; cin>>u>>v; --u;--v;g[u].push_back(v);g[v].push_back(u); } vector<int>d(n,-1); queue<int>q; d[s]=0;q.push(s); while(!q.empty()){ int u=q.front();q.pop(); for(int v:g[u]) if(d[v]==-1){d[v]=d[u]+1;q.push(v);} } for(int i=0;i<n;i++) cout<<d[i]<<(i+1==n?\"\\n\":\" \");\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5 1\n1 2\n1 3\n3 4\n3 5\n",
        "output": "0 1 1 2 2\n"
      },
      {
        "input": "1 1\n",
        "output": "0\n"
      },
      {
        "input": "4 4\n1 2\n2 3\n3 4\n",
        "output": "3 2 1 0\n"
      },
      {
        "input": "5 3\n1 2\n2 3\n3 4\n4 5\n",
        "output": "2 1 0 1 2\n"
      },
      {
        "input": "6 2\n2 1\n2 3\n2 4\n2 5\n2 6\n",
        "output": "1 0 1 1 1 1\n"
      },
      {
        "input": "7 5\n1 2\n1 3\n2 4\n2 5\n3 6\n6 7\n",
        "output": "2 1 3 2 0 4 5\n"
      }
    ]
  },
  {
    "id": "P045",
    "title": "台阶方案",
    "difficulty": "进阶",
    "topic": "动态规划",
    "tags": [
      "递推",
      "滚动数组",
      "取模"
    ],
    "statement": "共有 n 级台阶，每次可以上 1 级或 2 级。不同的步长顺序视为不同方案。求走到第 n 级的方案数。n=0 时，原地不动算一种方案。",
    "inputFormat": "一行整数 n。",
    "outputFormat": "输出方案数对 1000000007 取模的结果。",
    "constraints": "0 ≤ n ≤ 1000000。",
    "samples": [
      {
        "input": "4\n",
        "output": "5\n"
      },
      {
        "input": "0\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "最后一步可能来自 n−1 或 n−2。",
      "每次相加后取模，只保留相邻状态。"
    ],
    "explanation": "定义 dp[0]=1、dp[1]=1，递推 dp[i]=dp[i−1]+dp[i−2] 并取模。用两个变量滚动存储。时间 O(n)，空间 O(1)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n; cin>>n; const long long MOD=1000000007; long long a=1,b=1; for(int i=0;i<n;i++){ long long c=(a+b)%MOD; a=b;b=c; } cout<<a<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4\n",
        "output": "5\n"
      },
      {
        "input": "0\n",
        "output": "1\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "2\n",
        "output": "2\n"
      },
      {
        "input": "50\n",
        "output": "365010934\n"
      },
      {
        "input": "1000000\n",
        "output": "534400663\n"
      }
    ]
  },
  {
    "id": "P046",
    "title": "最少兑换枚数",
    "difficulty": "进阶",
    "topic": "动态规划",
    "tags": [
      "完全背包",
      "最少枚数"
    ],
    "statement": "给定 n 种硬币面值，每种硬币都可使用无限次。凑出总额 t 最少需要几枚硬币？不能恰好凑出时返回 −1。",
    "inputFormat": "第一行 n、t；第二行 n 个不同的正整数面值。",
    "outputFormat": "输出最少硬币数；无法凑出输出 −1。",
    "constraints": "1 ≤ n ≤ 100；0 ≤ t ≤ 10000；1 ≤ 面值 ≤ 10000。",
    "samples": [
      {
        "input": "3 6\n1 3 4\n",
        "output": "2\n"
      },
      {
        "input": "1 3\n2\n",
        "output": "-1\n"
      }
    ],
    "hints": [
      "dp[v] 表示凑出金额 v 的最少枚数。",
      "枚举最后放入的一枚硬币。"
    ],
    "explanation": "令 dp[0]=0，其余状态为不可达。对每个金额尝试每种面值，从较小金额转移。时间 O(nt)，空间 O(t)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,t; cin>>n>>t; vector<int>c(n); for(int &x:c) cin>>x; const int INF=1000000000; vector<int>dp(t+1,INF); dp[0]=0; for(int i=1;i<=t;i++) for(int x:c) if(x<=i&&dp[i-x]!=INF) dp[i]=min(dp[i],dp[i-x]+1); cout<<(dp[t]==INF?-1:dp[t])<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 6\n1 3 4\n",
        "output": "2\n"
      },
      {
        "input": "1 3\n2\n",
        "output": "-1\n"
      },
      {
        "input": "2 0\n5 7\n",
        "output": "0\n"
      },
      {
        "input": "3 27\n2 5 10\n",
        "output": "4\n"
      },
      {
        "input": "3 11\n9 6 5\n",
        "output": "2\n"
      },
      {
        "input": "2 8\n4 6\n",
        "output": "2\n"
      }
    ]
  },
  {
    "id": "P047",
    "title": "一次性补给包",
    "difficulty": "进阶",
    "topic": "动态规划",
    "tags": [
      "0/1背包",
      "倒序转移"
    ],
    "statement": "背包最多承重 W。共有 n 件不同补给，每件有重量 wi 和价值 vi，每件至多选择一次。可以不装满，也可以一件不选。求最大总价值。",
    "inputFormat": "第一行 n、W；随后 n 行各有 wi、vi。",
    "outputFormat": "输出不超过承重时可获得的最大价值。",
    "constraints": "1 ≤ n ≤ 200；0 ≤ W ≤ 10000；1 ≤ wi ≤ 10000；0 ≤ vi ≤ 10^9。",
    "samples": [
      {
        "input": "3 5\n2 3\n3 4\n4 5\n",
        "output": "7\n"
      },
      {
        "input": "1 0\n1 9\n",
        "output": "0\n"
      }
    ],
    "hints": [
      "dp[j] 表示容量上限为 j 时的最大价值。",
      "处理一件物品时，容量必须倒序枚举。"
    ],
    "explanation": "倒序更新保证 dp[j−wi] 尚未使用当前物品，避免重复选择。价值总和用 long long。时间 O(nW)，空间 O(W)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n,W; cin>>n>>W; vector<long long>dp(W+1); for(int i=0;i<n;i++){ int w;long long v;cin>>w>>v;for(int j=W;j>=w;j--) dp[j]=max(dp[j],dp[j-w]+v); } cout<<dp[W]<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 5\n2 3\n3 4\n4 5\n",
        "output": "7\n"
      },
      {
        "input": "1 0\n1 9\n",
        "output": "0\n"
      },
      {
        "input": "2 5\n6 100\n7 200\n",
        "output": "0\n"
      },
      {
        "input": "3 4\n2 3\n2 5\n1 1\n",
        "output": "8\n"
      },
      {
        "input": "4 10\n3 8\n4 9\n5 12\n9 20\n",
        "output": "21\n"
      },
      {
        "input": "3 3\n1 0\n2 0\n3 7\n",
        "output": "7\n"
      }
    ]
  },
  {
    "id": "P048",
    "title": "上升的训练记录",
    "difficulty": "进阶",
    "topic": "动态规划",
    "tags": [
      "LIS",
      "二分优化",
      "严格递增"
    ],
    "statement": "从序列中删除任意多个元素，其余元素保持原有相对顺序，形成一个子序列。求严格递增子序列的最大长度。相邻选中值必须严格变大，相等不算上升。",
    "inputFormat": "第一行 n；第二行 n 个整数。",
    "outputFormat": "输出最长严格递增子序列长度。",
    "constraints": "1 ≤ n ≤ 200000；|ai| ≤ 10^9。",
    "samples": [
      {
        "input": "5\n3 1 2 5 4\n",
        "output": "3\n"
      },
      {
        "input": "1\n8\n",
        "output": "1\n"
      }
    ],
    "hints": [
      "长度相同的递增子序列，结尾更小的更容易延长。",
      "维护各长度的最小结尾，用 lower_bound 更新。"
    ],
    "explanation": "tail[k] 表示长度 k+1 的递增子序列可达到的最小结尾。对 x 找首个不小于 x 的位置并替换，否则追加。使用 lower_bound 保证相等值不增加长度。时间 O(n log n)，空间 O(n)。",
    "solution": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;cin>>n;vector<long long>tail;while(n--){long long x;cin>>x;auto it=lower_bound(tail.begin(),tail.end(),x);if(it==tail.end())tail.push_back(x);else *it=x;}cout<<tail.size()<<\"\\n\";\n    return 0;\n}\n",
    "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的代码\n\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n3 1 2 5 4\n",
        "output": "3\n"
      },
      {
        "input": "1\n8\n",
        "output": "1\n"
      },
      {
        "input": "3\n2 2 2\n",
        "output": "1\n"
      },
      {
        "input": "5\n5 4 3 2 1\n",
        "output": "1\n"
      },
      {
        "input": "6\n-3 -1 -2 0 4 3\n",
        "output": "4\n"
      },
      {
        "input": "6\n1 2 3 4 5 6\n",
        "output": "6\n"
      }
    ]
  }
];

// 在服务端生成边界测试，保持题库源文件紧凑。每题仍为 6 组，展示样例保持短小。
const replaceBoundary = (id, index, input, output) => {
  problems.find(problem => problem.id === id).tests[index] = {
    input, output: String(output).trimEnd() + '\n',
  };
};
const sequence = (length, value) => Array.from({ length }, (_, i) => value(i));
const serialArray = values => `${values.length}\n${values.join(' ')}\n`;
const chain = length => sequence(length - 1, i => `${i + 1} ${i + 2}`).join('\n') + '\n';
replaceBoundary('P025', 5, `${'a'.repeat(49999)}b${'a'.repeat(49999)}\n`, 'YES');
replaceBoundary('P029', 4, serialArray(sequence(100000, i => 100000 - i)), sequence(100000, i => i + 1).join(' '));
replaceBoundary('P033', 5, `200000 50000\n${sequence(200000, i => i).join(' ')}\n${Array(50000).fill(200000).join(' ')}\n`, Array(50000).fill(200001).join('\n'));
replaceBoundary('P040', 3, serialArray(sequence(200000, i => 200000 - i)), Array(200000).fill(-1).join(' '));
replaceBoundary('P041', 5, `200000 100000\n${Array(200000).fill(1000000000).join(' ')}\n`, '100000000000000');
replaceBoundary('P042', 4, `300 300\n${Array(300).fill('.'.repeat(300)).join('\n')}\n`, '598');
replaceBoundary('P043', 5, `100000 99999\n${chain(100000)}`, '1');
replaceBoundary('P044', 2, `100000 50000\n${chain(100000)}`, sequence(100000, i => Math.abs(i + 1 - 50000)).join(' '));
replaceBoundary('P046', 5, `100 9999\n${sequence(100, i => i + 101).join(' ')}\n`, '50');
replaceBoundary('P047', 5, `200 10000\n${sequence(200, i => `50 ${i < 198 ? 1000000000 : 0}`).join('\n')}\n`, '198000000000');
replaceBoundary('P048', 5, serialArray(sequence(200000, i => i + 1)), '200000');
