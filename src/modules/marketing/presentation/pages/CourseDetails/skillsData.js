import softwareDevelopment from "../../../../../assets/software-development.png";
import cloudDevOps from "../../../../../assets/cloud-devops.png";
import aiData from "../../../../../assets/ai-data.png";
import testing from "../../../../../assets/testing.png";
import career from "../../../../../assets/career.png";
import java from "../../../../../assets/cardImages/javaFullStack.png"
import python from "../../../../../assets/cardImages/pythonFullStack3.png"
import MERN from "../../../../../assets/cardImages/MERNstack1.png"

/* =========================================================
   MARKETPLACE BANNER IMAGES
========================================================= */

export const bannerImages = [
  { id: 1, image: softwareDevelopment, title: "Software Development" },
  { id: 2, image: cloudDevOps, title: "Cloud & DevOps" },
  { id: 3, image: aiData, title: "AI & Data" },
  { id: 4, image: testing, title: "Software Testing" },
  { id: 5, image: career, title: "Career" },
];

/* =========================================================
   MARKETPLACE CATEGORIES
========================================================= */

export const categories = [
  "All",
  "Software Development",
  "Cloud & DevOps",
  "AI & Data",
  "Testing",
  "Career",
];

/* =========================================================
   MARKETPLACE COURSES
========================================================= */

export const courses = [
  {
    id: 1,
    title: "Java Full Stack Development",
    image: java,
    instructor: "Naveen Kulkarni",
    duration: "18 weeks",
    lessons: "128 lessons",
    tags: ["Live cohort", "Projects"],
    price: "₹6,999",
    oldPrice: "₹11,999",
    category: "Software Development",
  },
  {
    id: 2,
    title: "Python Full Stack",
    image: python,
    instructor: "Sowmya Iyer",
    duration: "16 weeks",
    lessons: "112 lessons",
    tags: ["Hybrid", "Placement-linked"],
    price: "₹6,499",
    oldPrice: "₹9,999",
    category: "Software Development",
  },
  {
    id: 4,
    title: "MERN Stack Development",
    image: MERN,
    instructor: "Priya Sharma",
    duration: "20 weeks",
    lessons: "150 lessons",
    tags: ["Projects", "Career support"],
    price: "₹7,999",
    oldPrice: "₹14,999",
    category: "Software Development",
  },
  {
    id: 5,
    title: "AWS Cloud & DevOps",
    image: MERN,
    instructor: "Rahul Kumar",
    duration: "12 weeks",
    lessons: "90 lessons",
    tags: ["Hands-on", "Projects"],
    price: "₹5,999",
    oldPrice: "₹9,999",
    category: "Cloud & DevOps",
  },
  {
    id: 6,
    title: "Azure DevOps Engineer",
    instructor: "Kiran Reddy",
    duration: "14 weeks",
    lessons: "105 lessons",
    tags: ["Live cohort", "Labs"],
    price: "₹6,499",
    oldPrice: "₹10,999",
    category: "Cloud & DevOps",
  },
  {
    id: 7,
    title: "Google Cloud Engineering",
    instructor: "Ravi Kumar",
    duration: "13 weeks",
    lessons: "98 lessons",
    tags: ["Cloud labs", "Projects"],
    price: "₹5,999",
    oldPrice: "₹10,999",
    category: "Cloud & DevOps",
  },
  {
    id: 8,
    title: "Data Science & Machine Learning",
    instructor: "Ananya Sharma",
    duration: "20 weeks",
    lessons: "140 lessons",
    tags: ["Projects", "Python"],
    price: "₹7,499",
    oldPrice: "₹12,999",
    category: "AI & Data",
  },
  {
    id: 9,
    title: "Artificial Intelligence with Python",
    instructor: "Rahul Sharma",
    duration: "18 weeks",
    lessons: "125 lessons",
    tags: ["AI Projects", "Python"],
    price: "₹7,999",
    oldPrice: "₹13,999",
    category: "AI & Data",
  },
  {
    id: 10,
    title: "Generative AI & LLM Engineering",
    instructor: "Arjun Rao",
    duration: "16 weeks",
    lessons: "110 lessons",
    tags: ["GenAI", "Projects"],
    price: "₹8,499",
    oldPrice: "₹14,999",
    category: "AI & Data",
  },
  {
    id: 11,
    title: "Software Testing Automation",
    instructor: "Vikram Rao",
    duration: "12 weeks",
    lessons: "95 lessons",
    tags: ["Selenium", "Automation"],
    price: "₹4,999",
    oldPrice: "₹8,999",
    category: "Testing",
  },
  {
    id: 12,
    title: "Java Selenium Automation",
    instructor: "Karthik Reddy",
    duration: "14 weeks",
    lessons: "110 lessons",
    tags: ["Selenium", "Java"],
    price: "₹5,499",
    oldPrice: "₹9,999",
    category: "Testing",
  },
  {
    id: 13,
    title: "API Testing with Postman",
    instructor: "Meghana Rao",
    duration: "8 weeks",
    lessons: "65 lessons",
    tags: ["Postman", "API Testing"],
    price: "₹3,999",
    oldPrice: "₹6,999",
    category: "Testing",
  },
  {
    id: 14,
    title: "Full Stack Developer Career Program",
    instructor: "Pathway Experts",
    duration: "24 weeks",
    lessons: "180 lessons",
    tags: ["Projects", "Career support"],
    price: "₹9,999",
    oldPrice: "₹17,999",
    category: "Career",
  },
  {
    id: 15,
    title: "Software Developer Interview Preparation",
    instructor: "Career Team",
    duration: "8 weeks",
    lessons: "70 lessons",
    tags: ["DSA", "Mock interviews"],
    price: "₹3,499",
    oldPrice: "₹5,999",
    category: "Career",
  },
];

/* =========================================================
   EXTENDED COURSES DATA - DETAILED PAGE DATA
========================================================= */

export const extendedCoursesData = {
  "react-fs": {
    code: "REACT-FS",
    title: "React Full Stack Development",
    category: "Software Development",
    instructor: "Arjun Mehta",
    role: "Ex-Meta, 8 years React Architect",
    weeks: "14 weeks",
    lessons: "96 lessons",
    level: "Intermediate",
    price: "₹5,499",
    oldPrice: "₹8,999",
    rating: "4.9",
    reviews: "1,240",
    emoji: "⚛",
    about: "Master modern React with Next.js 14, Tailwind CSS, Node.js, and PostgreSQL. Build industry-ready full stack web applications.",
    syllabus: [
      { m: "Module 1", t: "React Fundamentals & Hooks", topics: ["JSX & Components", "Props & State Management", "Custom Hooks", "React Router v6"], d: "2 weeks" },
      { m: "Module 2", t: "Advanced Frontend Architecture", topics: ["Context API & Redux Toolkit", "React Query & Data Fetching", "Performance Optimization", "Jest & React Testing Library"], d: "3 weeks" },
      { m: "Module 3", t: "Next.js 14 & Full Stack API", topics: ["App Router & Server Components", "API Routes & Middleware", "Prisma ORM & PostgreSQL", "Authentication with NextAuth"], d: "4 weeks" },
      { m: "Module 4", t: "Production & Deployment", topics: ["Vercel CI/CD Pipelines", "Payment Gateway Integration", "Realtime WebSockets", "Capstone Project"], d: "5 weeks" }
    ],
    projects: ["E-commerce SaaS Platform", "Real-time Collaborative Workspace", "Analytics Dashboard"],
    skills: ["React", "Next.js", "Tailwind", "Node.js", "PostgreSQL", "TypeScript"]
  },
  "py-fs": {
    code: "PY-FS",
    title: "Python Full Stack with Django & React",
    category: "Software Development",
    instructor: "Sowmya Iyer",
    role: "Ex-Swiggy, Python Lead Architect",
    weeks: "16 weeks",
    lessons: "112 lessons",
    level: "Beginner",
    price: "₹6,499",
    oldPrice: "₹9,999",
    rating: "4.8",
    reviews: "1,876",
    emoji: "🐍",
    about: "Become a complete Python Full Stack Developer. Master Python OOP, Django MVT, REST Framework, React integration, Celery background tasks, and Docker deployment.",
    syllabus: [
      { m: "Module 1", t: "Python Core & Advanced OOP", topics: ["Python Data Structures", "OOP Concepts & Design Patterns", "Asyncio & Multithreading", "File I/O & Generators"], d: "2 weeks" },
      { m: "Module 2", t: "Django Framework & Relational DB", topics: ["Django Architecture", "ORM & Migrations", "PostgreSQL Integration", "Auth & Permissions"], d: "4 weeks" },
      { m: "Module 3", t: "Django REST Framework (DRF)", topics: ["API Serializers & Views", "JWT Authentication", "Celery & Redis Caching", "Unit Testing APIs"], d: "4 weeks" },
      { m: "Module 4", t: "Frontend & DevOps Integration", topics: ["React Integration", "Docker Containerization", "AWS EC2 Deployment", "Capstone Project"], d: "6 weeks" }
    ],
    projects: ["EdTech Marketplace", "REST API Engine", "AI Powered Lead Tracker"],
    skills: ["Python", "Django", "DRF", "PostgreSQL", "React", "Docker", "Redis"]
  },
  "java-fs": {
    code: "JAVA-FS",
    title: "Java Full Stack — Spring Boot & Microservices",
    category: "Software Development",
    instructor: "Naveen Kulkarni",
    role: "Ex-Oracle, Java Champion",
    weeks: "18 weeks",
    lessons: "128 lessons",
    level: "Intermediate",
    price: "₹6,999",
    oldPrice: "₹11,999",
    rating: "4.7",
    reviews: "2,104",
    emoji: "☕",
    about: "Enterprise Java Development track. Master Java 17, Spring Boot 3, Spring Cloud Microservices, Apache Kafka, Kubernetes, and React frontend.",
    syllabus: [
      { m: "Module 1", t: "Java 17 Core & JVM Internals", topics: ["Java 17 Features", "Collections Framework", "Multithreading & Concurrency", "JVM Tuning"], d: "3 weeks" },
      { m: "Module 2", t: "Spring Boot Enterprise Deep-Dive", topics: ["Dependency Injection", "Spring Data JPA & Hibernate", "Spring Security & OAuth2", "RESTful Web Services"], d: "5 weeks" },
      { m: "Module 3", t: "Microservices & Event-Driven Architecture", topics: ["Spring Cloud Gateway & Eureka", "Apache Kafka Messaging", "Distributed Tracing", "Circuit Breakers"], d: "5 weeks" },
      { m: "Module 4", t: "Cloud & Kubernetes Deployment", topics: ["Dockerization", "Kubernetes Manifests", "AWS Cloud Infrastructure", "Capstone Microservices Project"], d: "5 weeks" }
    ],
    projects: ["Banking Core Microservices", "E-Commerce Checkout System", "Notification Hub"],
    skills: ["Java 17", "Spring Boot", "Spring Cloud", "Kafka", "Kubernetes", "PostgreSQL", "React"]
  },
  "aws-dop": {
    code: "AWS-DOP",
    title: "AWS DevOps Engineer — Professional Track",
    category: "Cloud & DevOps",
    instructor: "Meera Krishnan",
    role: "AWS Community Hero, Ex-Amazon DevOps",
    weeks: "12 weeks",
    lessons: "74 lessons",
    level: "Advanced",
    price: "₹6,999",
    oldPrice: "₹10,999",
    rating: "4.9",
    reviews: "1,284",
    emoji: "☁",
    about: "Production-grade Cloud DevOps. Master AWS Core Infrastructure, Infrastructure as Code with Terraform, Amazon EKS, automated CI/CD pipelines, and Prometheus monitoring.",
    syllabus: [
      { m: "Module 1", t: "AWS Core Infrastructure", topics: ["VPC Architecture", "EC2, Auto-scaling, ALB", "IAM Security Policies", "S3 & RDS Storage"], d: "2 weeks" },
      { m: "Module 2", t: "Infrastructure as Code (IaC)", topics: ["Terraform Fundamentals", "Modular State Management", "CloudFormation", "Ansible Configuration"], d: "3 weeks" },
      { m: "Module 3", t: "Containers & Orchestration", topics: ["Docker Deep Dive", "Amazon EKS & ECS", "Helm Package Manager", "Istio Service Mesh"], d: "4 weeks" },
      { m: "Module 4", t: "CI/CD & Observability", topics: ["GitHub Actions Pipelines", "ArgoCD GitOps", "Prometheus & Grafana", "Production Capstone Lab"], d: "3 weeks" }
    ],
    projects: ["Multi-Region Terraform Infra", "EKS Microservices Deployment", "Zero-Downtime CI/CD Pipeline"],
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Prometheus", "ArgoCD"]
  },
  "k8s-prd": {
    code: "K8S-PRD",
    title: "Kubernetes for Production Workloads",
    category: "Cloud & DevOps",
    instructor: "Meera Krishnan",
    role: "AWS Community Hero, Ex-Amazon DevOps",
    weeks: "9 weeks",
    lessons: "52 lessons",
    level: "Advanced",
    price: "₹5,499",
    oldPrice: "₹8,499",
    rating: "4.8",
    reviews: "760",
    emoji: "☸",
    about: "Deep dive into production-grade Kubernetes. Master pod scheduling, ingress control, storage persistence, RBAC, network policies, and cluster upgrades.",
    syllabus: [
      { m: "Module 1", t: "Kubernetes Architecture", topics: ["Control Plane & Worker Nodes", "Pods, ReplicaSets & Deployments", "Services & Ingress Controllers", "ConfigMaps & Secrets"], d: "3 weeks" },
      { m: "Module 2", t: "Storage, Security & RBAC", topics: ["Persistent Volumes & PVCs", "Cluster RBAC & Service Accounts", "Network Policies", "Calico CNI"], d: "3 weeks" },
      { m: "Module 3", t: "Production Operations & Monitoring", topics: ["Cluster Upgrades & Backup (Velero)", "Prometheus Monitoring & Alertmanager", "Logging with Fluent Bit & Loki", "Production Capstone"], d: "3 weeks" }
    ],
    projects: ["High-Availability K8s Cluster", "GitOps Continuous Deployment", "Cluster Observability Stack"],
    skills: ["Kubernetes", "Docker", "Helm", "Prometheus", "Grafana", "GitOps"]
  },
  "devsec": {
    code: "DEVSEC",
    title: "Cloud Security & DevSecOps Essentials",
    category: "Cloud & DevOps",
    instructor: "Tanvox Technologies",
    role: "Industry Security Consultants",
    weeks: "8 weeks",
    lessons: "44 lessons",
    level: "Intermediate",
    price: "₹5,299",
    oldPrice: "₹7,999",
    rating: "4.7",
    reviews: "640",
    emoji: "🛡",
    about: "Embed security into the DevOps pipeline. Learn SAST, DAST, container scanning, secret detection, IAM auditing, and cloud compliance standards.",
    syllabus: [
      { m: "Module 1", t: "DevSecOps Fundamentals & SAST", topics: ["Security in CI/CD", "SonarQube & Semgrep", "Secret Scanning (TruffleHog)", "Dependency Scanning (Snyk)"], d: "3 weeks" },
      { m: "Module 2", t: "Container & Cloud Security", topics: ["Trivy & Clair Container Auditing", "Kubernetes Security Policies", "AWS IAM Security Auditing", "DAST with OWASP ZAP"], d: "5 weeks" }
    ],
    projects: ["Secure CI/CD Pipeline", "Kubernetes Security Benchmark", "Automated Vulnerability Scanner"],
    skills: ["DevSecOps", "Docker Security", "Kubernetes Security", "SonarQube", "Trivy", "OWASP"]
  },
  "ml-py": {
    code: "ML-PY",
    title: "Machine Learning with Python",
    category: "AI & Data",
    instructor: "Dr. Anita Bose",
    role: "Data Science Lead, PhD in AI",
    weeks: "12 weeks",
    lessons: "62 lessons",
    level: "Intermediate",
    price: "₹7,499",
    oldPrice: "₹11,999",
    rating: "4.9",
    reviews: "2,100",
    emoji: "📊",
    about: "Comprehensive Machine Learning program. Master Python data science libraries (NumPy, Pandas, Matplotlib), supervised & unsupervised learning, model tuning, and deployment.",
    syllabus: [
      { m: "Module 1", t: "Data Preprocessing & EDA", topics: ["NumPy & Pandas Deep Dive", "Data Cleaning & Feature Scaling", "Exploratory Data Analysis", "Feature Engineering"], d: "3 weeks" },
      { m: "Module 2", t: "Supervised Learning Algorithms", topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "XGBoost & Gradient Boosting", "SVM & K-Nearest Neighbors"], d: "4 weeks" },
      { m: "Module 3", t: "Unsupervised & Model Deployment", topics: ["K-Means & Hierarchical Clustering", "PCA Dimensionality Reduction", "Model Evaluation & Hyperparameter Tuning", "FastAPI & Docker ML Deployment"], d: "5 weeks" }
    ],
    projects: ["Predictive Analytics Engine", "Customer Churn Prediction", "End-to-End ML API"],
    skills: ["Python", "Scikit-Learn", "Pandas", "NumPy", "XGBoost", "FastAPI", "Docker"]
  },
  "agentic": {
    code: "AGENTIC",
    title: "Agentic AI Platform Engineering",
    category: "AI & Data",
    instructor: "Rohit Sharma",
    role: "Ex-Google, AI Systems Engineer",
    weeks: "8 weeks",
    lessons: "46 lessons",
    level: "Advanced",
    price: "₹8,999",
    oldPrice: "₹13,999",
    rating: "4.9",
    reviews: "520",
    emoji: "🤖",
    about: "Build autonomous AI agents and multi-agent platforms. Master LangChain, LangGraph, AutoGen, vector databases, RAG architecture, and tool-calling models.",
    syllabus: [
      { m: "Module 1", t: "LLM Orchestration & RAG", topics: ["OpenAI & Anthropic APIs", "Vector DBs (ChromaDB, Pinecone)", "Retrieval-Augmented Generation (RAG)", "LangChain Core"], d: "3 weeks" },
      { m: "Module 2", t: "Autonomous Multi-Agent Architectures", topics: ["Agent Memory & Planning", "LangGraph State Machines", "Multi-Agent Collaboration (AutoGen)", "Tool Calling & Code Execution"], d: "5 weeks" }
    ],
    projects: ["Autonomous Coding Agent", "Multi-Agent Research Assistant", "Enterprise RAG Platform"],
    skills: ["GenAI", "LangChain", "LangGraph", "Vector DB", "Python", "OpenAI"]
  },
  "sql-dm": {
    code: "SQL-DM",
    title: "SQL & Data Modelling for Engineers",
    category: "AI & Data",
    instructor: "Dr. Anita Bose",
    role: "Data Science Lead, PhD in AI",
    weeks: "6 weeks",
    lessons: "38 lessons",
    level: "Beginner",
    price: "₹1,999",
    oldPrice: "₹3,499",
    rating: "4.7",
    reviews: "1,430",
    emoji: "🗄",
    about: "SQL from fundamentals to advanced data engineering queries. Master joins, window functions, indexing, CTEs, and relational database schema design.",
    syllabus: [
      { m: "Module 1", t: "SQL Fundamentals & Joins", topics: ["SELECT & Filtering", "INNER, LEFT, RIGHT Joins", "Aggregations & GROUP BY", "Subqueries"], d: "2 weeks" },
      { m: "Module 2", t: "Advanced Querying & Schema Design", topics: ["Window Functions (RANK, LEAD, LAG)", "Common Table Expressions (CTEs)", "Indexing & Query Optimization", "Normalization & ERD"], d: "4 weeks" }
    ],
    projects: ["Analytics Warehouse Schema", "Sales Performance Queries", "Database Tuning Suite"],
    skills: ["SQL", "PostgreSQL", "MySQL", "DB Design", "Data Analytics"]
  },
  "sel-aut": {
    code: "SEL-AUT",
    title: "Selenium Automation Testing",
    category: "Testing",
    instructor: "Kavitha Reddy",
    role: "QA Lead Architect",
    weeks: "8 weeks",
    lessons: "54 lessons",
    level: "Beginner",
    price: "₹3,499",
    oldPrice: "₹5,999",
    rating: "4.8",
    reviews: "1,520",
    emoji: "🧪",
    about: "Master automated web testing with Java and Selenium WebDriver. Learn TestNG framework, Page Object Model (POM), Data-Driven testing, and Jenkins integration.",
    syllabus: [
      { m: "Module 1", t: "Java Basics & Selenium WebDriver", topics: ["Java for Automation", "WebDriver Locators (XPath, CSS)", "Handling Elements & Windows", "Explicit & Implicit Waits"], d: "3 weeks" },
      { m: "Module 2", t: "TestNG Framework & CI/CD", topics: ["TestNG Annotations & Assertions", "Page Object Model (POM) Design", "Apache POI Data Driven Testing", "Jenkins Pipeline Integration"], d: "5 weeks" }
    ],
    projects: ["E-Commerce Test Automation Suite", "Hybrid Test Automation Framework", "Extent Reports Dashboard"],
    skills: ["Selenium", "Java", "TestNG", "Maven", "Jenkins", "POM"]
  },
  "api-perf": {
    code: "API-PERF",
    title: "API & Performance Testing — Postman & JMeter",
    category: "Testing",
    instructor: "Kavitha Reddy",
    role: "QA Lead Architect",
    weeks: "5 weeks",
    lessons: "31 lessons",
    level: "Intermediate",
    price: "₹2,999",
    oldPrice: "₹4,999",
    rating: "4.7",
    reviews: "980",
    emoji: "⚡",
    about: "API testing and performance benchmarking. Master Postman test scripts, Newman CLI, Apache JMeter load testing, response validation, and stress analysis.",
    syllabus: [
      { m: "Module 1", t: "API Automation with Postman", topics: ["REST API Methods", "Postman Collections & Variables", "JavaScript Test Assertion Scripts", "Newman Command Line Execution"], d: "2 weeks" },
      { m: "Module 2", t: "Performance Testing with Apache JMeter", topics: ["JMeter Thread Groups & Samplers", "Parameterization & Correlation", "Load, Stress & Spike Testing", "Performance Bottleneck Analysis"], d: "3 weeks" }
    ],
    projects: ["REST API Test Automation Suite", "E-Commerce Load Benchmark Report", "CI/CD Postman Pipeline"],
    skills: ["Postman", "JMeter", "REST API", "JavaScript", "Newman", "Performance Testing"]
  },
  "career-01": {
    code: "CAREER-01",
    title: "Interview Preparation & Resume Lab",
    category: "Career",
    instructor: "Placement Cell",
    role: "Senior Placement Experts",
    weeks: "4 weeks",
    lessons: "22 lessons",
    level: "Beginner",
    price: "₹0",
    oldPrice: "₹0",
    rating: "4.9",
    reviews: "5,210",
    emoji: "💼",
    about: "Land your dream IT job. Comprehensive resume optimization, ATS formatting, LinkedIn branding, technical mock interviews, HR negotiation strategies.",
    syllabus: [
      { m: "Module 1", t: "ATS Resume & Profile Building", topics: ["ATS-Friendly Resume Templates", "GitHub & Portfolio Showcase", "LinkedIn Optimization", "Cover Letter Strategies"], d: "2 weeks" },
      { m: "Module 2", t: "Mock Interviews & Soft Skills", topics: ["Technical Interview Frameworks", "HR Behavioral Questions", "Salary Negotiation", "Live Mock Interview Rounds"], d: "2 weeks" }
    ],
    projects: ["Industry-Ready ATS Resume", "Professional Developer Portfolio", "3 Live Mock Interview Reviews"],
    skills: ["Resume Optimization", "LinkedIn Branding", "Mock Interviews", "Placement Support"]
  },
  "career-02": {
    code: "CAREER-02",
    title: "Aptitude & Communication for Campus Hiring",
    category: "Career",
    instructor: "Placement Cell",
    role: "Campus Training Division",
    weeks: "6 weeks",
    lessons: "40 lessons",
    level: "Beginner",
    price: "₹0",
    oldPrice: "₹0",
    rating: "4.6",
    reviews: "3,120",
    emoji: "🎯",
    about: "Prepare for campus recruitment drives. Quantitative aptitude, logical reasoning, verbal ability, group discussions, and corporate communication.",
    syllabus: [
      { m: "Module 1", t: "Quantitative & Logical Aptitude", topics: ["Speed Math & Arithmetic", "Logical & Data Interpretation", "Puzzles & Series", "Company Test Patterns"], d: "3 weeks" },
      { m: "Module 2", t: "Verbal & Group Discussion", topics: ["Grammar & Vocabulary", "Group Discussion Techniques", "Email Writing Etiquette", "Public Speaking Practice"], d: "3 weeks" }
    ],
    projects: ["5 Full-Length Aptitude Tests", "Live Group Discussion Simulation", "Corporate Email Portfolio"],
    skills: ["Aptitude", "Logical Reasoning", "Communication", "Campus Hiring"]
  }
};