/**
 * Canonical Data Source for Instructor Dashboard
 * Guaranteed unique, stable record IDs to prevent duplicate data rendering.
 */

export const instructorProfile = {
  id: "inst-ramana-1",
  name: "Dr. R. Ramana",
  title: "Professor & Lead Technical Instructor",
  department: "Computer Science & Engineering",
  organization: "KITS Warangal · Pathwing Partner",
  email: "ramana.r@kitsw.ac.in",
  avatarInitials: "RR",
  publishedCoursesCount: 4,
  activeLearners: 1428,
  completionRate: 87.6,
  averageRating: 4.92,
  totalReviews: 342,
  netEarningsMonth: 284500,
  netEarningsYTD: 1492000,
  platformCommissionRate: 15,
  openQuestionsCount: 7,
  responseRate: 98.4
};

export const initialEarningsData = [
  { id: "earn-may-26", month: "May", gross: 210000, commission: 31500, net: 178500, learners: 184 },
  { id: "earn-jun-26", month: "Jun", gross: 245000, commission: 36750, net: 208250, learners: 216 },
  { id: "earn-jul-26", month: "Jul", gross: 270000, commission: 40500, net: 229500, learners: 242 },
  { id: "earn-aug-26", month: "Aug", gross: 295000, commission: 44250, net: 250750, learners: 268 },
  { id: "earn-sep-26", month: "Sep", gross: 318000, commission: 47700, net: 270300, learners: 290 },
  { id: "earn-oct-26", month: "Oct", gross: 334706, commission: 50206, net: 284500, learners: 312 }
];

export const initialAttentionItems = [
  {
    id: "att-q-1",
    type: "question",
    priority: "urgent",
    title: "React 19 Server Components hydration mismatch in Lab 4",
    course: "React Full Stack Development",
    submittedBy: "Aarav Sharma",
    timestamp: "14h ago",
    details: "Learner encountering SSR hydration mismatch in Lab 4 test suite.",
    status: "Urgent",
    actionLabel: "Reply"
  },
  {
    id: "att-q-2",
    type: "question",
    priority: "urgent",
    title: "AWS ECS Fargate Task Definition memory allocation query",
    course: "AWS DevOps Engineer",
    submittedBy: "Sneha Reddy",
    timestamp: "18h ago",
    details: "Fargate container exiting with OOMKilled code 137.",
    status: "Urgent",
    actionLabel: "Reply"
  },
  {
    id: "att-q-3",
    type: "question",
    priority: "warning",
    title: "Spring Security 6 JWT filter chain deprecation in Module 3",
    course: "Java Full Stack Development",
    submittedBy: "Vikram Patel",
    timestamp: "1d ago",
    details: "Need migration snippet for authorizeHttpRequests() configuration.",
    status: "Action Needed",
    actionLabel: "Reply"
  },
  {
    id: "att-grade-1",
    type: "grading",
    priority: "warning",
    title: "Microservices Architecture Capstone: 6 submissions waiting",
    course: "Distributed Systems & Cloud Architecture",
    submittedBy: "Batch 2026-Alpha",
    timestamp: "Yesterday",
    details: "6 student capstone projects awaiting final instructor review.",
    status: "Action Needed",
    actionLabel: "Grade"
  },
  {
    id: "att-review-1",
    type: "review",
    priority: "warning",
    title: "Advanced Spring Boot 3 - Syllabus update awaiting platform review",
    course: "Java Full Stack Development",
    submittedBy: "Academic Audit Board",
    timestamp: "2d ago",
    details: "Module 8 AI Agents syllabus awaiting platform compliance review.",
    status: "Under Review",
    actionLabel: "View"
  },
  {
    id: "att-session-1",
    type: "session",
    priority: "info",
    title: "Live Q&A: Cloud Deployment Strategies & System Design",
    course: "AWS DevOps Engineer",
    submittedBy: "Batch 2026-B & 2026-C",
    timestamp: "Tomorrow 6:00 PM",
    details: "Live interactive mentoring session with 142 registered learners.",
    status: "Scheduled",
    actionLabel: "Join"
  }
];

export const initialInstructorCourses = [
  {
    id: "crs-inst-1",
    code: "JAVA-FS",
    title: "Java Full Stack Development",
    category: "Software Development",
    level: "Intermediate to Advanced",
    enrolledLearners: 542,
    completionRate: 89.2,
    rating: 4.95,
    reviewsCount: 168,
    status: "Published",
    modulesCount: 16,
    totalHours: 72,
    price: 18999,
    revenue: 10297458,
    lastUpdated: "18 Oct 2026",
    thumbnailTone: "blue"
  },
  {
    id: "crs-inst-2",
    code: "AWS-DOP",
    title: "AWS DevOps Engineer Professional",
    category: "Cloud & DevOps",
    level: "Advanced",
    enrolledLearners: 428,
    completionRate: 86.4,
    rating: 4.91,
    reviewsCount: 112,
    status: "Published",
    modulesCount: 14,
    totalHours: 64,
    price: 21999,
    revenue: 9415572,
    lastUpdated: "12 Oct 2026",
    thumbnailTone: "amber"
  },
  {
    id: "crs-inst-3",
    code: "REACT-FS",
    title: "React 19 & Next.js Full Stack Engineering",
    category: "Web Development",
    level: "All Levels",
    enrolledLearners: 348,
    completionRate: 88.0,
    rating: 4.89,
    reviewsCount: 84,
    status: "Published",
    modulesCount: 12,
    totalHours: 56,
    price: 15999,
    revenue: 5567652,
    lastUpdated: "04 Oct 2026",
    thumbnailTone: "emerald"
  },
  {
    id: "crs-inst-4",
    code: "MICRO-ARCH",
    title: "Distributed Microservices & Kubernetes Architecture",
    category: "System Design",
    level: "Advanced",
    enrolledLearners: 110,
    completionRate: 82.5,
    rating: 4.94,
    reviewsCount: 28,
    status: "Published",
    modulesCount: 10,
    totalHours: 48,
    price: 24999,
    revenue: 2749890,
    lastUpdated: "20 Sep 2026",
    thumbnailTone: "purple"
  }
];

export const initialLearners = [
  {
    id: "lrn-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@kitsw.pathwing.in",
    courseId: "crs-inst-3",
    courseName: "React 19 & Next.js Full Stack",
    progress: 74,
    quizScore: 92,
    lastActive: "2 hours ago",
    status: "Active",
    cohort: "Batch 2026-A"
  },
  {
    id: "lrn-2",
    name: "Sneha Reddy",
    email: "sneha.reddy@student.valuelabs.com",
    courseId: "crs-inst-2",
    courseName: "AWS DevOps Engineer",
    progress: 88,
    quizScore: 95,
    lastActive: "45 mins ago",
    status: "Active",
    cohort: "Batch 2026-B"
  },
  {
    id: "lrn-3",
    name: "Vikram Patel",
    email: "vpatel@txhub.org",
    courseId: "crs-inst-1",
    courseName: "Java Full Stack Development",
    progress: 65,
    quizScore: 84,
    lastActive: "Yesterday",
    status: "Active",
    cohort: "Batch 2026-A"
  },
  {
    id: "lrn-4",
    name: "Pooja Varma",
    email: "p.varma@deloitte.com",
    courseId: "crs-inst-4",
    courseName: "Distributed Microservices",
    progress: 91,
    quizScore: 98,
    lastActive: "30 mins ago",
    status: "Active",
    cohort: "Corporate Cohort"
  },
  {
    id: "lrn-5",
    name: "Karan Johar",
    email: "karan.j@anurag.edu.in",
    courseId: "crs-inst-1",
    courseName: "Java Full Stack Development",
    progress: 52,
    quizScore: 78,
    lastActive: "3 days ago",
    status: "Needs Support",
    cohort: "Batch 2026-C"
  },
  {
    id: "lrn-6",
    name: "Meera Krishnan",
    email: "meera.k@pathwing.in",
    courseId: "crs-inst-2",
    courseName: "AWS DevOps Engineer",
    progress: 100,
    quizScore: 97,
    lastActive: "Just now",
    status: "Completed",
    cohort: "Batch 2026-A"
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    learner: "Aarav Sharma",
    avatarInitials: "AS",
    course: "React 19 & Next.js Full Stack",
    rating: 5,
    date: "20 Oct 2026",
    comment: "Deep dive into Server Actions made complex concepts clear. Great labs!"
  },
  {
    id: "rev-2",
    learner: "Sneha Reddy",
    avatarInitials: "SR",
    course: "AWS DevOps Engineer Professional",
    rating: 5,
    date: "17 Oct 2026",
    comment: "Best cloud engineering curriculum. Live sessions helped pass certification."
  },
  {
    id: "rev-3",
    learner: "Vikram Patel",
    avatarInitials: "VP",
    course: "Java Full Stack Development",
    rating: 4.8,
    date: "14 Oct 2026",
    comment: "Excellent real-world architectures and Spring Cloud microservices."
  },
  {
    id: "rev-4",
    learner: "Pooja Varma",
    avatarInitials: "PV",
    course: "Distributed Microservices & Kubernetes Architecture",
    rating: 5,
    date: "11 Oct 2026",
    comment: "Kubernetes orchestration labs gave me confidence for enterprise deployment."
  },
  {
    id: "rev-5",
    learner: "Karan Johar",
    avatarInitials: "KJ",
    course: "Autonomous AI Agents & Multi-Agent Orchestration",
    rating: 4.9,
    date: "08 Oct 2026",
    comment: "Cyclic agent workflows and tool-calling exercises are unmatched."
  },
  {
    id: "rev-6",
    learner: "Meera Krishnan",
    avatarInitials: "MK",
    course: "Java Full Stack Development",
    rating: 5,
    date: "05 Oct 2026",
    comment: "Modern and practical curriculum for Java backend engineers."
  }
];

export const initialPayoutHistory = [
  { id: "pay-oct-26", month: "October 2026", gross: "₹3,34,706", commission: "₹50,206 (15%)", net: "₹2,84,500", status: "Processing", date: "Est. 02 Nov 2026" },
  { id: "pay-sep-26", month: "September 2026", gross: "₹3,18,000", commission: "₹47,700 (15%)", net: "₹2,70,300", status: "Settled", date: "02 Oct 2026" },
  { id: "pay-aug-26", month: "August 2026", gross: "₹2,95,000", commission: "₹44,250 (15%)", net: "₹2,50,750", status: "Settled", date: "02 Sep 2026" },
  { id: "pay-jul-26", month: "July 2026", gross: "₹2,70,000", commission: "₹40,500 (15%)", net: "₹2,29,500", status: "Settled", date: "02 Aug 2026" }
];

export const initialBatches = [
  {
    id: "batch-1",
    name: "Java Full Stack - Cohort 2026-Alpha",
    code: "JFS-26A",
    courseId: "crs-inst-1",
    courseName: "Java Full Stack Development",
    schedule: "Mon, Wed, Fri · 6:00 PM - 8:00 PM",
    enrolled: 128,
    capacity: 150,
    startDate: "01 Oct 2026",
    endDate: "20 Dec 2026",
    status: "Active",
    completion: 68
  },
  {
    id: "batch-2",
    name: "AWS DevOps Masterclass - Cohort 2026-B",
    code: "AWS-26B",
    courseId: "crs-inst-2",
    courseName: "AWS DevOps Engineer Professional",
    schedule: "Tue, Thu, Sat · 7:00 PM - 9:00 PM",
    enrolled: 114,
    capacity: 120,
    startDate: "05 Oct 2026",
    endDate: "15 Dec 2026",
    status: "Active",
    completion: 74
  },
  {
    id: "batch-3",
    name: "React 19 Next.js Weekend Accelerator",
    code: "RCT-26W",
    courseId: "crs-inst-3",
    courseName: "React 19 & Next.js Full Stack Engineering",
    schedule: "Sat, Sun · 10:00 AM - 1:00 PM",
    enrolled: 96,
    capacity: 100,
    startDate: "15 Sep 2026",
    endDate: "30 Nov 2026",
    status: "Active",
    completion: 86
  },
  {
    id: "batch-4",
    name: "Distributed Microservices Winter Cohort",
    code: "MIC-26W",
    courseId: "crs-inst-4",
    courseName: "Distributed Microservices & Kubernetes Architecture",
    schedule: "Mon, Thu · 8:00 PM - 10:00 PM",
    enrolled: 42,
    capacity: 60,
    startDate: "10 Nov 2026",
    endDate: "25 Jan 2027",
    status: "Upcoming",
    completion: 0
  }
];

export const initialAssignments = [
  {
    id: "asg-1",
    title: "Capstone: Distributed E-Commerce Saga Orchestrator",
    course: "Distributed Microservices & Kubernetes Architecture",
    student: "Aarav Sharma",
    submittedAt: "Yesterday, 11:45 PM",
    dueDate: "25 Oct 2026",
    status: "Pending Review",
    score: null,
    maxScore: 100,
    repoUrl: "https://github.com/aarav-sharma/saga-orchestrator-capstone",
    feedback: ""
  },
  {
    id: "asg-2",
    title: "Lab 4: Spring Cloud Gateway & JWT Rate Limiting",
    course: "Java Full Stack Development",
    student: "Sneha Reddy",
    submittedAt: "22 Oct 2026",
    dueDate: "23 Oct 2026",
    status: "Graded",
    score: 96,
    maxScore: 100,
    repoUrl: "https://github.com/sneha-reddy/spring-cloud-gateway-lab",
    feedback: "Outstanding rate limiter implementation using Redis token bucket algorithm."
  },
  {
    id: "asg-3",
    title: "Lab 5: Helm Chart & Canary Deployment in EKS",
    course: "AWS DevOps Engineer Professional",
    student: "Vikram Patel",
    submittedAt: "24 Oct 2026",
    dueDate: "25 Oct 2026",
    status: "Pending Review",
    score: null,
    maxScore: 100,
    repoUrl: "https://github.com/vikram-patel/eks-helm-canary",
    feedback: ""
  },
  {
    id: "asg-4",
    title: "Project 2: Next.js 15 Server Actions & Optimistic Cart",
    course: "React 19 & Next.js Full Stack Engineering",
    student: "Pooja Varma",
    submittedAt: "20 Oct 2026",
    dueDate: "21 Oct 2026",
    status: "Graded",
    score: 98,
    maxScore: 100,
    repoUrl: "https://github.com/pooja-varma/next15-optimistic-cart",
    feedback: "Flawless optimistic rollback state handling and type-safe server validation."
  },
  {
    id: "asg-5",
    title: "Lab 3: Docker Multi-Stage Optimization & Trivy Vulnerability Scan",
    course: "AWS DevOps Engineer Professional",
    student: "Karan Johar",
    submittedAt: "18 Oct 2026",
    dueDate: "19 Oct 2026",
    status: "Needs Resubmission",
    score: 62,
    maxScore: 100,
    repoUrl: "https://github.com/karan-j/docker-trivy-scan",
    feedback: "Base image must use distroless or alpine. Vulnerability report still has 2 CRITICAL CVEs."
  }
];

export const initialLiveSessions = [
  {
    id: "sess-1",
    title: "Mastering Distributed Transactions & Event-Driven Sagas",
    course: "Distributed Microservices & Kubernetes Architecture",
    dateTime: "Today, 6:00 PM IST",
    duration: "90 Mins",
    platform: "Pathwing Live Classroom",
    attendees: 124,
    status: "Upcoming",
    meetingUrl: "https://meet.pathwing.in/class/live-micro-arch",
    agenda: "Saga choreography vs orchestration, Outbox pattern, and failure compensation."
  },
  {
    id: "sess-2",
    title: "AWS EKS Cluster Zero-Downtime Migration Workshop",
    course: "AWS DevOps Engineer Professional",
    dateTime: "28 Oct 2026, 7:00 PM IST",
    duration: "120 Mins",
    platform: "Pathwing Live Classroom",
    attendees: 156,
    status: "Scheduled",
    meetingUrl: "https://meet.pathwing.in/class/live-aws-eks",
    agenda: "Blue/green worker node group upgrades, CoreDNS tuning, and Karpenter autoscaling."
  },
  {
    id: "sess-3",
    title: "React 19 Concurrent Features & Server Actions Deep Dive",
    course: "React 19 & Next.js Full Stack Engineering",
    dateTime: "24 Oct 2026 (Past)",
    duration: "75 Mins",
    platform: "Pathwing Archive",
    attendees: 142,
    status: "Completed",
    meetingUrl: "https://pathwing.in/recordings/rec-react19-ama",
    agenda: "useActionState, useOptimistic, and Server Functions serialization rules."
  },
  {
    id: "sess-4",
    title: "System Design Mock Interview & Architectural Critique",
    course: "Java Full Stack Development",
    dateTime: "21 Oct 2026 (Past)",
    duration: "105 Mins",
    platform: "Pathwing Archive",
    attendees: 198,
    status: "Completed",
    meetingUrl: "https://pathwing.in/recordings/rec-sysdesign-mock",
    agenda: "Designing a high-throughput URL shortener and real-time chat with WebSockets."
  }
];

export const initialQnA = [
  {
    id: "qna-1",
    title: "How to configure idempotency keys with Stripe and Spring Boot 3?",
    course: "Java Full Stack Development",
    student: "Aarav Sharma",
    upvotes: 14,
    repliesCount: 2,
    status: "Answered",
    timestamp: "3 hours ago",
    content: "When processing webhook events, duplicate charges occur during network retries. What is the recommended idempotency pattern?",
    answer: "Store idempotency keys in Redis with an atomic SETNX and a 24-hour TTL before processing transaction mutations. Return cached responses on replay."
  },
  {
    id: "qna-2",
    title: "OOMKilled Error code 137 in AWS ECS Fargate container startup",
    course: "AWS DevOps Engineer Professional",
    student: "Sneha Reddy",
    upvotes: 21,
    repliesCount: 0,
    status: "Pending",
    timestamp: "5 hours ago",
    content: "My JVM app exits with code 137 on ECS Fargate. The task memory is 2GB, but JVM still crashes during heap initialization.",
    answer: null
  },
  {
    id: "qna-3",
    title: "Next.js 15 cookies() in Server Actions async await requirement",
    course: "React 19 & Next.js Full Stack Engineering",
    student: "Vikram Patel",
    upvotes: 9,
    repliesCount: 1,
    status: "Answered",
    timestamp: "1 day ago",
    content: "Getting warning that cookies() is now an asynchronous Promise in Next.js 15. How do I adapt my auth middleware?",
    answer: "In Next.js 15, cookies() is async. Simply `const cookieStore = await cookies();` then invoke `.get('token')`."
  },
  {
    id: "qna-4",
    title: "Kafka Consumer rebalance storm when processing heavy payloads",
    course: "Distributed Microservices & Kubernetes Architecture",
    student: "Pooja Varma",
    upvotes: 18,
    repliesCount: 0,
    status: "Pending",
    timestamp: "1 day ago",
    content: "When batch size is 500 records, heartbeat thread fails and triggers constant group rebalancing. What tuning parameters fix this?",
    answer: null
  }
];

export const initialCertificates = [
  {
    id: "cert-1",
    certCode: "CERT-PW-89211",
    student: "Meera Krishnan",
    course: "AWS DevOps Engineer Professional",
    issuedDate: "22 Oct 2026",
    grade: "Distinction (97%)",
    status: "Verified",
    verificationUrl: "https://pathwing.in/verify/CERT-PW-89211"
  },
  {
    id: "cert-2",
    certCode: "CERT-PW-89212",
    student: "Rahul Verma",
    course: "Java Full Stack Development",
    issuedDate: "18 Oct 2026",
    grade: "First Class (91%)",
    status: "Verified",
    verificationUrl: "https://pathwing.in/verify/CERT-PW-89212"
  },
  {
    id: "cert-3",
    certCode: "CERT-PW-89213",
    student: "Ananya Deshmukh",
    course: "React 19 & Next.js Full Stack Engineering",
    issuedDate: "12 Oct 2026",
    grade: "Distinction (98%)",
    status: "Verified",
    verificationUrl: "https://pathwing.in/verify/CERT-PW-89213"
  },
  {
    id: "cert-4",
    certCode: "CERT-PW-89214",
    student: "Pooja Varma",
    course: "Distributed Microservices & Kubernetes Architecture",
    issuedDate: "05 Oct 2026",
    grade: "First Class (94%)",
    status: "Verified",
    verificationUrl: "https://pathwing.in/verify/CERT-PW-89214"
  }
];

export const initialCourseAnalytics = {
  totalEnrollments: 1428,
  activeLearnersCount: 1280,
  completionRate: 87.6,
  avgWatchTimeHours: 4.8,
  assignmentPassRate: 93.4,
  weeklyActivity: [
    { day: "Mon", active: 840, submissions: 42, watchHours: 320 },
    { day: "Tue", active: 920, submissions: 68, watchHours: 390 },
    { day: "Wed", active: 1150, submissions: 95, watchHours: 460 },
    { day: "Thu", active: 1080, submissions: 88, watchHours: 440 },
    { day: "Fri", active: 990, submissions: 54, watchHours: 380 },
    { day: "Sat", active: 1320, submissions: 140, watchHours: 580 },
    { day: "Sun", active: 1410, submissions: 185, watchHours: 640 }
  ]
};

