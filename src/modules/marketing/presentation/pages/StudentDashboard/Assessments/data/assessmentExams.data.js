// 6 Topic-wise Proctored Assessments configurations
export const ASSESSMENT_EXAMS = [
  {
    id: "java",
    category: "Java",
    moduleTag: "PROCTORED ASSESSMENT • JAVA",
    title: "Java",
    examTitle: "Java — Core OOPs, Collections & Multithreading Assessment",
    course: "Core Java & Object-Oriented Programming",
    examsBadge: "12 Exams",
    description:
      "Learn core Java concepts including OOPs, Collections, Exception Handling, Multithreading and more.",
    topicsCount: "12 Topics",
    examsCount: "12 Exams",
    difficulty: "Medium",
    difficultyType: "medium",
    iconBg: "#fff1f2",
    durationLabel: "05:52",
    durationSeconds: 352,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "Object-Oriented Programming (OOP) & Encapsulation",
      "Java Collections Framework (LinkedHashSet vs ArrayList)",
      "Multithreading, Concurrency & Synchronized Locks",
      "Exception Handling Architecture & finally Blocks",
      "String Constant Pool & Reference Comparison (== vs equals)"
    ]
  },
  {
    id: "python",
    category: "Python",
    moduleTag: "PROCTORED ASSESSMENT • PYTHON",
    title: "Python",
    examTitle: "Python — Data Structures, Functions & Modules Assessment",
    course: "Python Programming & Data Structures",
    examsBadge: "10 Exams",
    description:
      "Explore Python basics, data structures, functions, modules and advanced concepts.",
    topicsCount: "10 Topics",
    examsCount: "10 Exams",
    difficulty: "Easy",
    difficultyType: "easy",
    iconBg: "#eff6ff",
    durationLabel: "06:00",
    durationSeconds: 360,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "Immutable vs Mutable Data Structures (Tuples vs Lists/Dicts)",
      "Dynamic Function Arguments (*args and **kwargs unpacking)",
      "Lazy Evaluation & Python Generators (yield expression)",
      "List Comprehensions & High-Performance Iteration",
      "Object-Oriented Classes & Dunder Lifecycle Methods (__init__)"
    ]
  },
  {
    id: "javascript",
    category: "JavaScript",
    moduleTag: "PROCTORED ASSESSMENT • JAVASCRIPT",
    title: "JavaScript",
    examTitle: "JavaScript — DOM, Events & ES6+ Fundamentals Assessment",
    course: "Modern JavaScript & Frontend Engineering",
    examsBadge: "8 Exams",
    description:
      "Understand JS fundamentals, DOM, events, ES6+ features and more.",
    topicsCount: "8 Topics",
    examsCount: "8 Exams",
    difficulty: "Medium",
    difficultyType: "medium",
    iconBg: "#fef9c3",
    durationLabel: "06:00",
    durationSeconds: 360,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "ES6+ Block Scoping & Hoisting (let, const vs legacy var)",
      "Array Functional Transformations (map, filter, reduce)",
      "DOM Event Propagation & event.preventDefault()",
      "Asynchronous Concurrency & Promise.all() Orchestration",
      "Closures, Higher-Order Functions & Lexical Scope Preservation"
    ]
  },
  {
    id: "database",
    category: "Database",
    moduleTag: "PROCTORED ASSESSMENT • DATABASE",
    title: "Database",
    examTitle: "Database — SQL Queries, Joins & Normalization Assessment",
    course: "Relational Databases & SQL Architecture",
    examsBadge: "6 Exams",
    description:
      "Learn SQL, joins, normalization, indexing and database design.",
    topicsCount: "6 Topics",
    examsCount: "6 Exams",
    difficulty: "Easy",
    difficultyType: "easy",
    iconBg: "#eef2ff",
    durationLabel: "06:00",
    durationSeconds: 360,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "Relational Joins (INNER, LEFT, RIGHT, FULL OUTER JOINS)",
      "Database Normalization Standards (1NF, 2NF, 3NF & BCNF)",
      "Aggregate Grouping & Post-Aggregation Filters (GROUP BY vs HAVING)",
      "ACID Transaction Properties (Atomicity, Consistency, Isolation)",
      "B-Tree Indexing Trees & O(log n) Query Cost Reduction"
    ]
  },
  {
    id: "web-dev",
    category: "Web Development",
    moduleTag: "PROCTORED ASSESSMENT • WEB DEVELOPMENT",
    title: "Web Development",
    examTitle: "Web Development — HTML, CSS, React & Node.js Assessment",
    course: "Full Stack Web Development Track",
    examsBadge: "9 Exams",
    description:
      "HTML, CSS, React, Node.js and modern web technologies.",
    topicsCount: "9 Topics",
    examsCount: "9 Exams",
    difficulty: "Medium",
    difficultyType: "medium",
    iconBg: "#ecfdf5",
    durationLabel: "06:00",
    durationSeconds: 360,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "React Component Life Cycle & useEffect Side-Effects",
      "Modern CSS Grid & Two-Dimensional Page Layouts",
      "RESTful HTTP Specifications & Status Codes (201 Created)",
      "Virtual DOM Reconciliation & Stable Key Identifiers",
      "Node.js Express Middleware Pipeline & Next Function Dispatch"
    ]
  },
  {
    id: "system-design",
    category: "System Design",
    moduleTag: "PROCTORED ASSESSMENT • SYSTEM DESIGN",
    title: "System Design",
    examTitle: "System Design — Distributed Systems & Scalability Assessment",
    course: "High-Scale System Architecture",
    examsBadge: "7 Exams",
    description:
      "Design scalable microservices, load balancers, caching layers and distributed databases.",
    topicsCount: "7 Topics",
    examsCount: "7 Exams",
    difficulty: "Medium",
    difficultyType: "medium",
    iconBg: "#f0f9ff",
    durationLabel: "06:00",
    durationSeconds: 360,
    proctoringMode: "Live Camera Face Detection + Audio Monitor",
    syllabusTopics: [
      "Load Balancing & Horizontal Scalability (Nginx, Round Robin)",
      "In-Memory Caching Strategies (Redis / Memcached, Cache-Aside)",
      "CAP Theorem Tradeoffs (Consistency vs Availability vs Partitioning)",
      "Database Horizontal Sharding & Consistent Hashing",
      "Asynchronous Message Queues (Kafka, RabbitMQ Decoupling)"
    ]
  }
];
