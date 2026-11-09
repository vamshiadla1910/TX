// CodingLabTab.jsx - ONE FILE: component + styles + problems data.
// Setup:  npm i @monaco-editor/react   then   import CodingLabTab from "./CodingLabTab";
import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

/* ================= PROBLEMS DATA (replace with your API data later) ================= */

const JAVA=[
{id:"j1",lv:"Easy",t:"Palindrome Check",topic:"Strings",d:"Read one line of text. Print true if it reads the same forwards and backwards, ignoring case, spaces and punctuation. Otherwise print false.",c:["1 ≤ length ≤ 10⁵","Letters, digits, spaces and punctuation"],dflt:"false",
 code:`import java.util.*;

public class Main {
    static boolean isPalindrome(String s) {
        // write your solution here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isPalindrome(sc.nextLine()));
    }
}`,
 stub:"        // write your solution here\n        return false;",
 sol:`        String t = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return new StringBuilder(t).reverse().toString().equals(t);`,
 tests:[["racecar","true"],["hello","false"],["A man, a plan, a canal: Panama","true"]]},
{id:"j2",lv:"Medium",t:"Maximum Subarray",topic:"Dynamic programming",d:"Find the contiguous subarray with the largest sum and print that sum.",c:["1 ≤ n ≤ 10⁵","Values may be negative"],dflt:"0",
 code:`import java.util.*;

public class Main {
    static long maxSum(int[] a) {
        // write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(maxSum(a));
    }
}`,
 stub:"        // write your solution here\n        return 0;",
 sol:`        long best = a[0], cur = a[0];
        for (int i = 1; i < a.length; i++) {
            cur = Math.max(a[i], cur + a[i]);
            best = Math.max(best, cur);
        }
        return best;`,
 tests:[["9\n-2 1 -3 4 -1 2 1 -5 4","6"],["1\n5","5"],["3\n-3 -1 -2","-1"]]},
{id:"j3",lv:"Hard",t:"Trapping Rain Water",topic:"Two pointers",d:"Each number is the height of a bar of width 1. Print how many units of water are trapped between the bars after rain.",c:["1 ≤ n ≤ 2·10⁴","Target O(n) time, O(1) space"],dflt:"0",
 code:`import java.util.*;

public class Main {
    static int trap(int[] h) {
        // write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        System.out.println(trap(h));
    }
}`,
 stub:"        // write your solution here\n        return 0;",
 sol:`        int l = 0, r = h.length - 1, lm = 0, rm = 0, w = 0;
        while (l < r) {
            if (h[l] < h[r]) { lm = Math.max(lm, h[l]); w += lm - h[l++]; }
            else { rm = Math.max(rm, h[r]); w += rm - h[r--]; }
        }
        return w;`,
 tests:[["12\n0 1 0 2 1 0 1 3 2 1 2 1","6"],["6\n4 2 0 3 2 5","9"],["3\n1 2 3","0"]]}
];
const PY=[
{id:"p1",lv:"Easy",t:"Sum of Even Numbers",topic:"Lists",d:"Read n and then n integers. Print the sum of the even numbers.",c:["1 ≤ n ≤ 10⁵","Integers fit in 32 bits"],dflt:"0",
 code:`def even_sum(nums):
    # write your solution here
    return 0


n = int(input())
nums = list(map(int, input().split()))
print(even_sum(nums))`,
 stub:"    # write your solution here\n    return 0",
 sol:"    return sum(x for x in nums if x % 2 == 0)",
 tests:[["5\n1 2 3 4 6","12"],["3\n1 3 5","0"],["4\n10 20 30 40","100"]]},
{id:"p2",lv:"Medium",t:"Valid Parentheses",topic:"Stacks",d:"A string contains only the brackets ( ) [ ] { }. Print true if every bracket is closed in the correct order, otherwise false.",c:["1 ≤ length ≤ 10⁴","Use a stack"],dflt:"false",
 code:`def is_valid(s):
    # write your solution here
    return False


print(str(is_valid(input().strip())).lower())`,
 stub:"    # write your solution here\n    return False",
 sol:`    pairs = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pairs:
            if not st or st.pop() != pairs[ch]:
                return False
        else:
            st.append(ch)
    return not st`,
 tests:[["()[]{}","true"],["(]","false"],["{[()]}","true"]]},
{id:"p3",lv:"Hard",t:"Longest Increasing Subsequence",topic:"Binary search + DP",d:"Read n and then n integers. Print the length of the longest strictly increasing subsequence.",c:["1 ≤ n ≤ 10⁵","Target O(n log n)"],dflt:"0",
 code:`import bisect


def lis(nums):
    # write your solution here
    return 0


n = int(input())
print(lis(list(map(int, input().split()))))`,
 stub:"    # write your solution here\n    return 0",
 sol:`    tails = []
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
 tests:[["8\n10 9 2 5 3 7 101 18","4"],["6\n0 1 0 3 2 3","4"],["4\n7 7 7 7","1"]]}
];
const AWS=[
{id:"a1",lv:"Easy",t:"S3 Bucket Name Validator",topic:"S3 naming rules",d:"Read a bucket name. Print valid if it has 3 to 63 characters, uses only lowercase letters, digits and hyphens, and starts and ends with a letter or digit. Otherwise print invalid.",c:["Length 1 to 100","No uppercase letters or underscores allowed"],dflt:"invalid",
 code:`import re


def is_valid_bucket(name):
    # write your solution here
    return False


print("valid" if is_valid_bucket(input().strip()) else "invalid")`,
 stub:"    # write your solution here\n    return False",
 sol:`    return re.fullmatch(r"[a-z0-9][a-z0-9-]{1,61}[a-z0-9]", name) is not None`,
 tests:[["my-bucket-01","valid"],["My_Bucket","invalid"],["ab","invalid"]]},
{id:"a2",lv:"Medium",t:"EC2 Instances by State",topic:"EC2 monitoring",d:"Read n lines of the form instance-id state. Print each state and how many instances are in it, sorted by state name.",c:["1 ≤ n ≤ 10⁴","States are single words such as running, stopped, pending"],dflt:"(no output)",
 code:`def count_states(lines):
    # write your solution here
    return {}


n = int(input())
lines = [input() for _ in range(n)]
for state, c in sorted(count_states(lines).items()):
    print(state, c)`,
 stub:"    # write your solution here\n    return {}",
 sol:`    res = {}
    for ln in lines:
        s = ln.split()[1]
        res[s] = res.get(s, 0) + 1
    return res`,
 tests:[["5\ni-1 running\ni-2 stopped\ni-3 running\ni-4 running\ni-5 stopped","running 3\nstopped 2"],["3\ni-1 stopped\ni-2 pending\ni-3 stopped","pending 1\nstopped 2"],["1\ni-9 running","running 1"]]},
{id:"a3",lv:"Hard",t:"IAM Policy Evaluator",topic:"IAM security",d:"Read n policy statements, each as Allow or Deny followed by an action pattern (a * matches anything). Then read one action. Print Deny if any Deny statement matches. Otherwise print Allow if any Allow statement matches. If nothing matches, print Deny.",c:["1 ≤ n ≤ 100","An explicit Deny always wins"],dflt:"Deny",
 code:`import fnmatch


def evaluate(stmts, action):
    # write your solution here
    return "Deny"


n = int(input())
stmts = [tuple(input().split()) for _ in range(n)]
print(evaluate(stmts, input().strip()))`,
 stub:"    # write your solution here\n    return \"Deny\"",
 sol:`    allowed = False
    for effect, pat in stmts:
        if fnmatch.fnmatch(action, pat):
            if effect == "Deny":
                return "Deny"
            allowed = True
    return "Allow" if allowed else "Deny"`,
 tests:[["2\nAllow s3:*\nDeny s3:DeleteObject\ns3:GetObject","Allow"],["2\nAllow s3:*\nDeny s3:DeleteObject\ns3:DeleteObject","Deny"],["1\nAllow ec2:Describe*\ns3:GetObject","Deny"]]}
];
const SQL=[
{id:"s1",lv:"Easy",t:"Students from Hyderabad",topic:"SELECT and WHERE",d:"Table students(id, name, city). Return the names of students whose city is Hyderabad, sorted A to Z.",c:["Use WHERE and ORDER BY","Return one column: name"],dflt:"(no rows)",
 code:`-- Table: students(id, name, city)

SELECT
    -- write your solution here
;`,
 stub:"SELECT\n    -- write your solution here\n;",
 sol:`SELECT name
FROM students
WHERE city = 'Hyderabad'
ORDER BY name;`,
 tests:[["1 Asha Hyderabad\n2 Ravi Pune\n3 Kiran Hyderabad","Asha\nKiran"],["1 Meera Chennai\n2 Zoya Hyderabad\n3 Arun Hyderabad","Arun\nZoya"],["1 Dev Pune","(no rows)"]]},
{id:"s2",lv:"Medium",t:"Busy Students",topic:"GROUP BY and HAVING",d:"Table enrollments(student_id, course_id). Return student_id and the number of courses for every student enrolled in 2 or more courses. Sort by count (highest first), then by student_id.",c:["Use GROUP BY with HAVING","Columns: student_id, total"],dflt:"(no rows)",
 code:`-- Table: enrollments(student_id, course_id)

SELECT
    -- write your solution here
;`,
 stub:"SELECT\n    -- write your solution here\n;",
 sol:`SELECT student_id, COUNT(*) AS total
FROM enrollments
GROUP BY student_id
HAVING COUNT(*) >= 2
ORDER BY total DESC, student_id;`,
 tests:[["1 10\n1 11\n2 10\n3 10\n3 11\n3 12","3 3\n1 2"],["5 1\n6 2","(no rows)"],["4 7\n4 8\n9 7\n9 8","4 2\n9 2"]]},
{id:"s3",lv:"Hard",t:"Top Scorer per Course",topic:"Window functions",d:"Table scores(student, course, marks). For every course, return the student or students with the highest marks. Show ties. Sort by course, then student.",c:["Use RANK() OVER (PARTITION BY ...)","Columns: course, student"],dflt:"(no rows)",
 code:`-- Table: scores(student, course, marks)

SELECT
    -- write your solution here
;`,
 stub:"SELECT\n    -- write your solution here\n;",
 sol:`SELECT course, student
FROM (
    SELECT course, student,
           RANK() OVER (PARTITION BY course ORDER BY marks DESC) AS r
    FROM scores
) t
WHERE r = 1
ORDER BY course, student;`,
 tests:[["Asha SQL 90\nRavi SQL 85\nAsha Java 70\nKiran Java 95","Java Kiran\nSQL Asha"],["Meera AWS 80\nZoya AWS 80","AWS Meera\nAWS Zoya"],["Dev React 60","React Dev"]]}
];
const REACT=[
{id:"r1",lv:"Easy",t:"Counter Component",topic:"useState",d:"Build a Counter with a minus button, the current count and a plus button. The count starts at 0 and must never go below 0.",c:["Use the useState hook","Show the count inside an element with data-testid=count"],dflt:"(empty render)",
 code:`import { useState } from "react";

export default function Counter() {
  // write your solution here
  return <div />;
}`,
 stub:"  // write your solution here\n  return <div />;",
 sol:`  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>-</button>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );`,
 tests:[["Click + 3 times","count = 3"],["Click + 2 times, then - 1 time","count = 1"],["Click - 1 time","count = 0"]]},
{id:"r2",lv:"Medium",t:"useToggle Hook",topic:"Custom hooks",d:"Write a custom hook useToggle(initial = false) that returns [value, toggle]. Calling toggle flips the value.",c:["Use useState and useCallback","toggle must keep the same identity between renders"],dflt:"false",
 code:`import { useState, useCallback } from "react";

export function useToggle(initial = false) {
  // write your solution here
  return [false, () => {}];
}`,
 stub:"  // write your solution here\n  return [false, () => {}];",
 sol:`  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle];`,
 tests:[["useToggle(), call toggle() once","true"],["useToggle(), call toggle() twice","false"],["useToggle(true), call toggle() once","false"]]},
{id:"r3",lv:"Hard",t:"useDebounce Hook",topic:"useEffect cleanup",d:"Write useDebounce(value, delay). It returns the latest value only after it has stopped changing for delay milliseconds.",c:["Clear the timer on every change","Clean up when the component unmounts"],dflt:"'ab'",
 code:`import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  // write your solution here
  return value;
}`,
 stub:"  // write your solution here\n  return value;",
 sol:`  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;`,
 tests:[["delay 300. Value changes a to ab. Read after 100 ms","'a'"],["delay 300. Value changes a to ab. Read after 300 ms","'ab'"],["delay 300. Value changes a, ab, abc every 100 ms. Read 300 ms after the last change","'abc'"]]}
];
const DSA=[
{id:"d1",lv:"Easy",t:"Reverse an Array",topic:"Arrays",d:"Read n and then n integers. Print the integers in reverse order, separated by spaces.",c:["1 ≤ n ≤ 10⁵","Do it with one loop"],dflt:"1 2 3",
 code:`import java.util.*;

public class Main {
    static int[] reverse(int[] a) {
        // write your solution here
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        StringJoiner sj = new StringJoiner(" ");
        for (int x : reverse(a)) sj.add(String.valueOf(x));
        System.out.println(sj);
    }
}`,
 stub:"        // write your solution here\n        return a;",
 sol:`        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[a.length - 1 - i] = a[i];
        return r;`,
 tests:[["5\n1 2 3 4 5","5 4 3 2 1"],["3\n7 7 9","9 7 7"],["1\n4","4"]]},
{id:"d2",lv:"Medium",t:"Number of Islands",topic:"Graphs and DFS",d:"A grid of 0 and 1 is given. An island is a group of 1s connected up, down, left or right. Print how many islands there are.",c:["1 ≤ rows, columns ≤ 300","Diagonals do not connect"],dflt:"0",
 code:`import java.util.*;

public class Main {
    static int islands(char[][] g) {
        // write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt(), c = sc.nextInt();
        char[][] g = new char[r][];
        for (int i = 0; i < r; i++) g[i] = sc.next().toCharArray();
        System.out.println(islands(g));
    }
}`,
 stub:"        // write your solution here\n        return 0;",
 sol:`        int cnt = 0;
        for (int i = 0; i < g.length; i++)
            for (int j = 0; j < g[0].length; j++)
                if (g[i][j] == '1') { cnt++; sink(g, i, j); }
        return cnt;
    }

    static void sink(char[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        sink(g, i + 1, j); sink(g, i - 1, j); sink(g, i, j + 1); sink(g, i, j - 1);`,
 tests:[["3 3\n110\n010\n001","2"],["2 2\n11\n11","1"],["2 3\n101\n010","3"]]},
{id:"d3",lv:"Hard",t:"Shortest Path (Dijkstra)",topic:"Weighted graphs",d:"Read n nodes and m undirected edges, each as u v weight. Then read a source and a target. Print the length of the shortest path, or -1 if the target cannot be reached.",c:["1 ≤ n ≤ 10⁴, 0 ≤ m ≤ 5·10⁴","Weights are positive","Use a priority queue"],dflt:"-1",
 code:`import java.util.*;

public class Main {
    static int shortest(int n, List<int[]> edges, int s, int t) {
        // write your solution here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < m; i++) edges.add(new int[]{sc.nextInt(), sc.nextInt(), sc.nextInt()});
        System.out.println(shortest(n, edges, sc.nextInt(), sc.nextInt()));
    }
}`,
 stub:"        // write your solution here\n        return -1;",
 sol:`        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1], e[2]});
            adj.get(e[1]).add(new int[]{e[0], e[2]});
        }
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[s] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[1] - y[1]);
        pq.add(new int[]{s, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[1] > dist[cur[0]]) continue;
            for (int[] nb : adj.get(cur[0])) {
                int nd = cur[1] + nb[1];
                if (nd < dist[nb[0]]) { dist[nb[0]] = nd; pq.add(new int[]{nb[0], nd}); }
            }
        }
        return dist[t] == Integer.MAX_VALUE ? -1 : dist[t];`,
 tests:[["4 4\n1 2 1\n2 3 2\n1 3 5\n3 4 1\n1 4","4"],["3 1\n1 2 4\n1 3","-1"],["2 1\n1 2 7\n2 1","7"]]}
];
const COURSES=[
{id:"java",name:"Java Programming",ic:"Jv",lang:"Java 17",file:"Main.java",blurb:"Core Java, OOP and collections, with problems from basics to advanced.",P:JAVA},
{id:"python",name:"Python for Developers",ic:"Py",lang:"Python 3",file:"main.py",blurb:"Python fundamentals, data structures and problem solving.",P:PY},
{id:"aws",name:"AWS Cloud Practitioner",ic:"AWS",lang:"Python 3",file:"main.py",blurb:"Cloud basics, EC2, S3, IAM and core AWS services.",P:AWS},
{id:"sql",name:"SQL & Databases",ic:"SQL",lang:"PostgreSQL",file:"query.sql",blurb:"Queries, joins, indexing and window functions.",P:SQL},
{id:"react",name:"React Fundamentals",ic:"Re",lang:"JavaScript / React",file:"App.jsx",blurb:"Components, hooks and state management.",P:REACT},
{id:"dsa",name:"Data Structures",ic:"DS",lang:"Java 17",file:"Main.java",blurb:"Arrays, trees, graphs and complexity analysis.",P:DSA}
];

/* ================= STYLES (light blue and white) ================= */
const CSS = `
.cl {
  --cl-bg: #f4f8ff;
  --cl-line: #cfdcf3;
  --cl-txt: #0b2a5b;
  --cl-mut: #5b73a0;
  --cl-acc: #1d4ed8;
  --cl-soft: #eaf1ff;
  color: var(--cl-txt);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.cl *, .cl *::before, .cl *::after { box-sizing: border-box; }
.cl button { font-family: inherit; cursor: pointer; }

/* ---------- page: courses and problems ---------- */
.cl-wrap { max-width: 1180px; margin: 0 auto; padding: 8px 4px 28px; }
.cl-crumb { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 14px; color: var(--cl-mut); margin-bottom: 14px; }
.cl-crumb button { background: none; border: 0; padding: 0; color: var(--cl-acc); font-size: 14px; font-weight: 600; }
.cl-crumb b { color: var(--cl-txt); }
.cl-h1 { margin: 0; font-size: 27px; }
.cl-sub { margin: 6px 0 22px; font-size: 14.5px; color: var(--cl-mut); }

.cl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 22px; }
.cl-card {
  display: flex; flex-direction: column; gap: 12px; min-height: 220px; padding: 26px;
  text-align: left; color: var(--cl-txt); background: #fff;
  border: 1.5px solid var(--cl-line); border-radius: 16px; box-shadow: 0 2px 10px #1d4ed80f;
  transition: transform .15s, box-shadow .15s, border-color .15s;
}
.cl-card:hover { transform: translateY(-3px); border-color: var(--cl-acc); box-shadow: 0 10px 26px #1d4ed824; }
.cl-card h3 { margin: 0; font-size: 22px; }
.cl-card p { flex: 1; margin: 0; font-size: 15px; line-height: 1.55; color: #4a6396; }
.cl-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 14px; color: var(--cl-mut); }
.cl-ic { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: var(--cl-acc); color: #fff; font-size: 17px; font-weight: 800; }
.cl-reg { padding: 4px 10px; border-radius: 20px; background: var(--cl-soft); color: var(--cl-acc); font-size: 12px; font-weight: 700; }
.cl-bar { height: 7px; border-radius: 7px; background: #dbe8ff; overflow: hidden; }
.cl-bar i { display: block; height: 100%; background: var(--cl-acc); }
.cl-go { padding: 7px 18px; border-radius: 8px; background: var(--cl-acc); color: #fff; font-weight: 700; }
.cl-done { color: var(--cl-acc); font-weight: 700; }

.cl-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.cl-tabs button { padding: 8px 18px; border: 1px solid #b7cdf5; border-radius: 8px; background: #fff; color: #3b5a96; font-size: 13.5px; font-weight: 600; }
.cl-tabs button.on { background: var(--cl-acc); border-color: var(--cl-acc); color: #fff; }

.cl-pill { padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; }
.cl-pill.Easy { background: #dbeafe; color: #1d4ed8; }
.cl-pill.Medium { background: #93c5fd; color: #0b2a5b; }
.cl-pill.Hard { background: #1d4ed8; color: #fff; }

/* ---------- full-screen workspace ---------- */
.cl-ws { position: fixed; inset: 0; z-index: 1000; display: flex; flex-direction: column; background: var(--cl-bg); }
.cl-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; min-height: 54px; padding: 6px 14px; background: #fff; box-shadow: 0 1px 6px #1d4ed814; }
.cl-title { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.cl-mut { color: var(--cl-mut); }
.cl-actions { display: flex; gap: 8px; }
.cl-ghost { padding: 7px 13px; border: 1px solid #b7cdf5; border-radius: 8px; background: #fff; color: var(--cl-acc); font-size: 13px; font-weight: 600; }
.cl-ghost:hover { background: var(--cl-soft); }
.cl-run { padding: 8px 18px; border: 0; border-radius: 8px; background: var(--cl-acc); color: #fff; font-size: 13px; font-weight: 700; }
.cl-run:disabled { opacity: .65; cursor: wait; }

.cl-body { flex: 1; min-height: 0; display: flex; }
.cl-left { width: var(--w, 42%); min-width: 0; overflow: auto; padding: 22px 24px; background: #fff; }
.cl-left h2 { margin: 0 0 12px; font-size: 21px; }
.cl-left p { font-size: 14.5px; line-height: 1.65; color: #1e3a6e; }
.cl-left h4 { margin: 20px 0 8px; font-size: 13px; color: var(--cl-mut); }
.cl-left ul { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.7; color: #1e3a6e; }
.cl-ex { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.cl label { display: block; margin: 10px 0 4px; font-size: 11.5px; font-weight: 600; color: var(--cl-mut); }
.cl-ex label { margin-top: 0; }
.cl pre { margin: 0; padding: 10px 12px; border: 1px solid var(--cl-line); border-radius: 8px; background: var(--cl-bg); color: var(--cl-txt); font: 13px "JetBrains Mono", "Cascadia Code", Consolas, monospace; white-space: pre-wrap; }
.cl pre.pass { background: #dbe8ff; border-color: var(--cl-acc); color: var(--cl-acc); }
.cl pre.fail { background: #0b2a5b; border-color: #0b2a5b; color: #fff; }

/* adjustable dividers */
.cl-vs, .cl-hs { position: relative; flex: none; background: #cfe0ff; touch-action: none; transition: background .15s; }
.cl-vs { width: 12px; cursor: col-resize; }
.cl-hs { height: 12px; cursor: row-resize; }
.cl-vs::after, .cl-hs::after { content: ""; position: absolute; inset: 0; margin: auto; border-radius: 4px; background: var(--cl-acc); opacity: .55; }
.cl-vs::after { width: 4px; height: 48px; }
.cl-hs::after { width: 48px; height: 4px; }
.cl-vs:hover, .cl-hs:hover { background: #93c5fd; }
.cl-vs:hover::after, .cl-hs:hover::after { opacity: 1; }

.cl-right { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cl-tab { height: 36px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; background: var(--cl-soft); font-size: 13px; }
.cl-tab span { padding: 9px 4px; border-top: 2px solid var(--cl-acc); }
.cl-tab em { font-style: normal; font-size: 12px; color: var(--cl-mut); }

.cl-tests { flex: 1; min-height: 0; overflow: auto; padding: 12px 16px; background: #fff; }
.cl-th { display: flex; justify-content: space-between; font-size: 14px; }
.cl-th .ok { color: var(--cl-acc); font-weight: 700; }
.cl-th .bad { color: var(--cl-txt); font-weight: 700; }
.cl-ct { display: flex; gap: 6px; margin: 10px 0 2px; }
.cl-ct button { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid #b7cdf5; border-radius: 7px; background: #fff; color: var(--cl-mut); font-size: 12.5px; }
.cl-ct button.on { background: var(--cl-soft); border-color: var(--cl-acc); color: var(--cl-acc); }
.cl-ct i { width: 8px; height: 8px; border-radius: 50%; background: #b7cdf5; }
.cl-ct i.g { background: var(--cl-acc); }
.cl-ct i.r { background: #fff; border: 2px solid var(--cl-txt); }
.cl-hint { margin: 12px 0 0; font-size: 13px; color: var(--cl-mut); }

/* ---------- small screens ---------- */
@media (max-width: 760px) {
  .cl-body { flex-direction: column; }
  .cl-left { width: 100%; height: var(--w, 38%); }
  .cl-vs { width: 100%; height: 12px; cursor: row-resize; }
  .cl-vs::after { width: 48px; height: 4px; }
  .cl-grid { grid-template-columns: 1fr; }
}
`;

/* ================= COMPONENT ================= */

// true  = simulated runner (works with no backend, good for demos)
// false = sends code to RUN_URL; your backend must return { stdout, stderr }
const DEMO_MODE = true;
const RUN_URL = "http://localhost:5000/api/run";

const MONACO_LANG = { java: "java", python: "python", aws: "python", sql: "sql", react: "javascript", dsa: "java" };
const clean = (s) => (s || "").trim();

async function runTest(courseId, problem, code, input) {
  const t0 = performance.now();
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 250));
    const solved = !code.includes("write your solution here");
    return { out: solved ? null : problem.dflt, pass: solved, ms: solved ? 8 + Math.floor(Math.random() * 30) : 12 };
  }
  try {
    const res = await fetch(RUN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course: courseId, code, stdin: input }),
    });
    const d = await res.json();
    return { out: d.stderr ? d.stderr : clean(d.stdout), err: !!d.stderr, ms: Math.round(performance.now() - t0) };
  } catch {
    return { out: `Cannot reach the code runner at ${RUN_URL}.`, err: true, ms: 0 };
  }
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

/** registeredCourseIds: optional array like ["java","python"]. Omit to show every course. */
export default function CodingLabTab({ registeredCourseIds }) {
  const [course, setCourse] = useState(null);
  const [problem, setProblem] = useState(null);
  const [filter, setFilter] = useState("All");
  const [codes, setCodes] = useState(() => load("cl-codes", {}));
  const [solved, setSolved] = useState(() => load("cl-solved", {}));
  const [results, setResults] = useState({});
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [split, setSplit] = useState(42);   // left pane width, %
  const [editorH, setEditorH] = useState(60); // editor height inside right pane, %
  const bodyRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => { localStorage.setItem("cl-codes", JSON.stringify(codes)); }, [codes]);
  useEffect(() => { localStorage.setItem("cl-solved", JSON.stringify(solved)); }, [solved]);

  const courses = registeredCourseIds ? COURSES.filter((c) => registeredCourseIds.includes(c.id)) : COURSES;
  const code = problem ? codes[problem.id] ?? problem.code : "";
  const res = problem ? results[problem.id] : null;
  const passed = res ? res.filter((r) => r.pass).length : 0;

  const startDrag = useCallback((ref, axis, set, min, max) => (e) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    const move = (ev) => {
      const b = ref.current.getBoundingClientRect();
      const horizontal = axis === "x" && window.innerWidth > 760;
      const v = horizontal ? ((ev.clientX - b.left) / b.width) * 100 : ((ev.clientY - b.top) / b.height) * 100;
      set(Math.min(max, Math.max(min, v)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  const openProblem = (p) => { setProblem(p); setActive(0); };
  const setCode = (v) => setCodes((c) => ({ ...c, [problem.id]: v ?? "" }));
  const reset = () => { setCode(problem.code); setResults((r) => ({ ...r, [problem.id]: null })); };
  const fillSample = () => setCode(problem.code.replace(problem.stub, problem.sol));

  const run = async () => {
    setRunning(true);
    const out = await Promise.all(
      problem.tests.map(async ([input, expected]) => {
        const r = await runTest(course.id, problem, code, input);
        if (DEMO_MODE) return { ...r, out: r.pass ? expected : r.out };
        return { ...r, pass: !r.err && r.out === expected };
      })
    );
    setResults((p) => ({ ...p, [problem.id]: out }));
    if (out.every((o) => o.pass)) setSolved((s) => ({ ...s, [problem.id]: true }));
    const fail = out.findIndex((o) => !o.pass);
    setActive(fail === -1 ? 0 : fail);
    setRunning(false);
  };

  /* ---------- 1. Registered courses ---------- */
  if (!course) {
    return (
      <div className="cl">
        <style>{CSS}</style>
        <div className="cl-wrap">
          <div className="cl-crumb"><b>Coding Lab</b></div>
          <h1 className="cl-h1">Interactive Coding Lab</h1>
          <p className="cl-sub">Practice problems for the courses you have registered for. Choose a course to begin.</p>
          <div className="cl-grid">
            {courses.map((c) => {
              const n = c.P.length, s = c.P.filter((p) => solved[p.id]).length;
              return (
                <button key={c.id} className="cl-card" onClick={() => { setCourse(c); setFilter("All"); }}>
                  <div className="cl-row"><div className="cl-ic">{c.ic}</div><span className="cl-reg">Registered</span></div>
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <div className="cl-bar"><i style={{ width: `${n ? (s / n) * 100 : 0}%` }} /></div>
                  <div className="cl-row"><span>{s}/{n} solved</span><span className="cl-go">Open</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- 2. Problems of the chosen course ---------- */
  const list = course.P.filter((p) => filter === "All" || p.lv === filter);
  const done = course.P.filter((p) => solved[p.id]).length;

  return (
    <div className="cl">
        <style>{CSS}</style>
      <div className="cl-wrap">
        <div className="cl-crumb">
          <button onClick={() => setCourse(null)}>Coding Lab</button>›<b>{course.name}</b>
        </div>
        <h1 className="cl-h1">{course.name}</h1>
        <p className="cl-sub">{done} of {course.P.length} problems solved. Pick a difficulty and start solving.</p>
        <div className="cl-tabs">
          {["All", "Easy", "Medium", "Hard"].map((f) => (
            <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="cl-grid">
          {list.map((p) => (
            <button key={p.id} className="cl-card" onClick={() => openProblem(p)}>
              <div className="cl-row">
                <span className={`cl-pill ${p.lv}`}>{p.lv}</span>
                {solved[p.id] && <span className="cl-done">Solved ✓</span>}
              </div>
              <h3>{p.t}</h3>
              <p>{p.d.slice(0, 100)}…</p>
              <div className="cl-row"><span>{p.topic}</span><span className="cl-go">Solve</span></div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- 3. Full-screen workspace ---------- */}
      {problem && (
        <div className="cl-ws">
          <div className="cl-top">
            <button className="cl-ghost" onClick={() => setProblem(null)}>‹ Back to problems</button>
            <div className="cl-title">
              <span className="cl-mut">{course.name} ›</span>
              <strong>{problem.t}</strong>
              <span className={`cl-pill ${problem.lv}`}>{problem.lv}</span>
            </div>
            <div className="cl-actions">
              <button className="cl-ghost" onClick={fillSample}>Fill sample solution</button>
              <button className="cl-ghost" onClick={reset}>Reset</button>
              <button className="cl-run" disabled={running} onClick={run}>{running ? "Running…" : "Run code"}</button>
            </div>
          </div>

          <div className="cl-body" ref={bodyRef}>
            <section className="cl-left" style={{ "--w": `${split}%` }}>
              <h2>{problem.t}</h2>
              <p>{problem.d}</p>
              <h4>Constraints</h4>
              <ul>{problem.c.map((x) => <li key={x}>{x}</li>)}</ul>
              <h4>Examples</h4>
              {problem.tests.slice(0, 2).map(([i, o], k) => (
                <div className="cl-ex" key={k}>
                  <div><label>Input</label><pre>{i}</pre></div>
                  <div><label>Output</label><pre>{o}</pre></div>
                </div>
              ))}
            </section>

            <div className="cl-vs" onPointerDown={startDrag(bodyRef, "x", setSplit, 22, 70)} />

            <section className="cl-right" ref={rightRef}>
              <div className="cl-tab"><span>{course.file}</span><em>{course.lang}</em></div>
              <div style={{ height: `${editorH}%`, minHeight: 0 }}>
                <Editor
                  language={MONACO_LANG[course.id]}
                  theme="vs"
                  value={code}
                  onChange={setCode}
                  options={{
                    fontSize: 14, minimap: { enabled: false }, automaticLayout: true, tabSize: 4,
                    fontFamily: "'JetBrains Mono','Cascadia Code',Consolas,monospace",
                    scrollBeyondLastLine: false, padding: { top: 12 }, smoothScrolling: true,
                  }}
                />
              </div>

              <div className="cl-hs" onPointerDown={startDrag(rightRef, "y", setEditorH, 25, 80)} />

              <div className="cl-tests">
                <div className="cl-th">
                  <strong>Test cases</strong>
                  {res && <span className={passed === res.length ? "ok" : "bad"}>{passed}/{res.length} passed</span>}
                </div>
                <div className="cl-ct">
                  {problem.tests.map((_, i) => (
                    <button key={i} className={active === i ? "on" : ""} onClick={() => setActive(i)}>
                      <i className={res ? (res[i].pass ? "g" : "r") : ""} /> Case {i + 1}
                    </button>
                  ))}
                </div>
                <label>Input</label><pre>{problem.tests[active][0]}</pre>
                <label>Expected output</label><pre>{problem.tests[active][1]}</pre>
                {res ? (
                  <>
                    <label>Your output {res[active].ms ? `· ${res[active].ms} ms` : ""}</label>
                    <pre className={res[active].pass ? "pass" : "fail"}>{res[active].out || "(no output)"}</pre>
                  </>
                ) : (
                  <p className="cl-hint">Press Run code to check your solution against every case.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}