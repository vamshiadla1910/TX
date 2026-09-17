import {
  Briefcase,
  Code2,
  BookOpen,
  Award,
  Calendar,
  GraduationCap,
  Layers,
  Terminal,
  Cpu,
  Compass,
  CheckSquare,
  ShieldCheck,
  Building2,
  PlayCircle,
  Users,
} from "lucide-react";

// ==========================================
// 1. BLOG CATEGORIES (Strictly supported by PDF)
// ==========================================
export const BLOG_CATEGORIES = [
  { id: "All", name: "All Topics", icon: Layers, count: 9 },
  { id: "Career & Industry", name: "Career & Industry", icon: Briefcase, count: 2 },
  { id: "Technology & Coding", name: "Technology & Coding", icon: Code2, count: 2 },
  { id: "Learning & Skills", name: "Learning & Skills", icon: BookOpen, count: 1 },
  { id: "Internships", name: "Internships", icon: Compass, count: 1 },
  { id: "Training", name: "Training Modes", icon: PlayCircle, count: 1 },
  { id: "Certifications", name: "Certifications", icon: Award, count: 1 },
  { id: "Events & Hackathons", name: "Events & Hackathons", icon: Calendar, count: 1 },
];

// ==========================================
// 2. FEATURED ARTICLE (Large Lead Story)
// ==========================================
export const FEATURED_ARTICLE = {
  id: "featured-1",
  category: "Career & Industry",
  title: "Bridging the Campus-to-Corporate Gap: Why Practical Engineering Beats Rote Memorization",
  readTime: "6 min read",
  date: "September 14, 2026",
  views: "4.8k views",
  claps: 248,
  author: "TX-Path-Wing Academic & Industry Advisory Desk",
  authorRole: "Industry & Academic Council",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
  shortDescription:
    "For B.Tech and degree students, college exams test what you can memorize, but tech recruiters hire what you can build. Learn how moving through hands-on virtual labs, live code execution, and mentor evaluations turns textbook theory into hiring-ready confidence.",
  tags: ["Industry Readiness", "Hands-on Learning", "B.Tech Students", "Career Roadmap"],
  keyTakeaways: [
    "Recruiters evaluate problem-solving process, clean architecture, and debugging resilience over GPA numbers.",
    "Integrated virtual labs eliminate broken local setups and let students build directly in realistic cloud and database environments.",
    "Structured mentor feedback highlights blind spots in logic that self-study alone cannot catch.",
    "Completing end-to-end projects with verified assessment benchmarks creates portfolio proof that hiring teams respect.",
  ],
  content: `### The Reality of Modern Technical Recruitment
Every year, hundreds of thousands of engineering and degree students graduate with solid report cards, yet struggle to clear initial technical rounds. Why does this gap exist? Traditional college curricula excel at delivering theoretical principles—like memory allocation models, relational algebra, and time complexity classifications. However, actual development teams build software under very different constraints: collaborative version control, automated unit test suites, asynchronous APIs, and cloud-hosted data pipelines.

When interviewers present candidates with an unexpected edge case or ask them to debug a failing service, candidates who only memorized syntax often freeze. The solution is not studying more textbooks—it is fundamentally transforming how you learn by pairing every concept with immediate practical execution.

---

### Moving From Passive Reading to Active Code Execution
Passive learning (watching lectures or copying code snippets without testing them) creates a false sense of mastery. True competence happens when you:
1. **Engage with Automated Test Cases:** When your code must pass 10 unseen edge cases in an interactive environment, you learn how to handle null pointers, memory limits, and boundary conditions.
2. **Experiment in Virtual Labs:** Instead of spending hours struggling with operating system incompatibilities or missing database drivers, cloud virtual labs let you spin up clean PostgreSQL, Linux, and backend sandboxes instantly.
3. **Submit for Mentor Evaluation:** Working under the guidance of an active industry mentor introduces you to enterprise code reviews. Mentors teach you variable readability, modular decomposition, and defensive programming.

---

### The Integrated Learning-to-Employment Cycle
At TX-Path-Wing, we designed the student journey around an unbroken 6-step lifecycle:
- **Learn:** Absorb modular concepts via online live interactive batches or curated recorded tracks.
- **Practice:** Solve graded algorithmic challenges across Python, Java, JavaScript, C++, and SQL.
- **Build:** Implement capstone applications addressing actual industry problems.
- **Get Assessed:** Undergo comprehensive quizzes, assignments, and practical exams.
- **Get Certified:** Earn tamper-evident, verifiable digital credentials with unique IDs and QR verification.
- **Become Industry Ready:** Transition into official internships and corporate opportunities with proven skills.

By investing your college semesters in deliberate, project-focused practice, you step into placement season not as an anxious candidate hoping for a chance, but as a skilled problem-solver ready to contribute from day one.`,
};

// ==========================================
// 3. LATEST BLOG ARTICLES (8 Realistic Articles strictly from PDF)
// ==========================================
export const LATEST_ARTICLES = [
  {
    id: "post-1",
    category: "Internships",
    title: "Official vs. Occasional Internships: Choosing the Right Experience for Your Degree",
    readTime: "5 min read",
    date: "September 12, 2026",
    views: "3.2k views",
    claps: 184,
    author: "TX Careers & Internships Team",
    authorRole: "Internship Coordinator",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Understand the key differences between structured official internships and project-based occasional internships, and how mentor evaluations and final assessments turn your internship certificate into credible portfolio proof.",
    tags: ["Internships", "Project Tasks", "Mentor Review", "Industry Exposure"],
    keyTakeaways: [
      "Official internships offer formal eligibility screening, training phases, project sprints, mentor reviews, and a final assessment.",
      "Occasional internships provide agile, high-intensity exposure through summer bootcamps, project sprints, and event-driven challenges.",
      "Both tracks culminate in verifiable digital certificates with mentor sign-offs that validate your hands-on contribution.",
    ],
    content: `### Demystifying Student Internships
Internships are often treated as simple resume checkboxes, but there is a major difference between passively observing a company and actively completing production tasks. The TX-Path-Wing platform structures internships into two distinct, high-impact pathways tailored for B.Tech and degree students:

#### 1. Official Structured Internships
An Official Internship follows a rigorous corporate pipeline:
- **Registration & Eligibility Screening:** Ensures candidates have foundational prerequisites for the target stack.
- **Structured Training Phase:** Refreshing required frameworks, API patterns, and design best practices.
- **Real-World Project Tasks:** You are assigned actual milestone tasks with sprint deadlines rather than toy tutorials.
- **Mentor Evaluation:** Regular code audits and feedback sessions with experienced software professionals.
- **Final Assessment & Verifiable Certificate:** Comprehensive practical evaluation leading to authenticated credentialing.

#### 2. Occasional & Project-Based Internships
For students balancing demanding semester exams or seeking rapid domain exploration:
- **Summer Internships:** Intensive 4–8 week immersions focusing on high-demand stacks.
- **Project-Based Opportunities:** Deep dives into building specific applications (e.g., full-stack dashboard or data pipeline).
- **Event-Driven Internships:** Fast-tracked tracks earned through hackathons and competitive bootcamps.

Whichever path fits your semester calendar, ensure your internship requires deliverables, code reviews, and structured assessment. That is what hiring managers look for on your resume.`,
  },
  {
    id: "post-2",
    category: "Technology & Coding",
    title: "Mastering Problem Solving: How Instant Test Cases & Execution Build Real Coding Fluency",
    readTime: "5 min read",
    date: "September 10, 2026",
    views: "5.1k views",
    claps: 312,
    author: "Coding Platform Engineering Group",
    authorRole: "Platform Architect",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Why practicing in an integrated code editor with real-time test cases across Python, Java, JavaScript, C++, and SQL trains your mind to write clean, edge-case-resilient code faster.",
    tags: ["Coding Practice", "Algorithms", "Code Execution", "Test Cases"],
    keyTakeaways: [
      "Running code against hidden and public test cases uncovers edge cases like integer overflow, empty collections, and recursion limits.",
      "Multi-language support (Python, Java, JS, C, C++, SQL) lets students practice for campus recruitment tests in their language of choice.",
      "Automated scoring and execution time metrics instill disciplined time and space complexity habits early.",
    ],
    content: `### Why Local Scripting Is Not Enough for Technical Interviews
Writing code on a local text editor without test suites often breeds false confidence. In campus hiring drives and technical screens, candidates must write code that satisfies both visible sample inputs and rigorous hidden test cases under time pressure.

#### The Power of In-Browser Coding Practice
The TX-Path-Wing coding platform directly integrates interactive editors into your student dashboard:
1. **Choose Your Language:** Seamlessly switch between Python, Java, JavaScript, C, C++, and SQL.
2. **Read Problem Constraints:** Understand input/output boundaries, expected time complexities, and corner scenarios.
3. **Execute & Debug Instantly:** Run against sample cases to inspect stdout/stderr in real time.
4. **Automated Test Suite Verification:** Submit your solution against hidden test cases that evaluate edge conditions (e.g., negative integers, empty strings, massive arrays).
5. **Track Your Performance Score:** Monitor your completion percentage, execution efficiency, and personal progress graph over time.

By solving 2–3 problems daily inside a structured testing environment, coding becomes second nature, leaving you calm and prepared when campus placement season arrives.`,
  },
  {
    id: "post-3",
    category: "Learning & Skills",
    title: "The Power of Training + Internship Programs: Seamlessly Moving from Concepts to Projects",
    readTime: "4 min read",
    date: "September 08, 2026",
    views: "2.8k views",
    claps: 156,
    author: "TX Learning Experience Team",
    authorRole: "Curriculum Designer",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Discover why hybrid programs combining mentor-led classroom instruction with immediate practical internship tasks eliminate knowledge decay and fast-track student employability.",
    tags: ["Training + Internship", "Dual Pathway", "Project-Based", "Skill Acceleration"],
    keyTakeaways: [
      "Eliminates the lag between learning a technical concept and putting it into production code.",
      "Dual evaluation: mentors assess both conceptual understanding through quizzes and execution through project milestones.",
      "Creates an end-to-end portfolio artifact that candidates can speak about in depth during interviews.",
    ],
    content: `### The Flaw of Standalone Training
Traditional courses teach theory in isolation. You complete a two-month course on web development, but by the time you start an internship three months later, you have already forgotten key syntax, architectural patterns, and debugging strategies.

#### The Combined Advantage
The **Training + Internship** program supported by TX-Path-Wing solves this disconnection through a single continuous track:
- **Phase 1: Foundation Training:** Expert mentors guide you through modern architecture, syntax, and tooling in live or hybrid sessions.
- **Phase 2: Immediate Hands-on Practice:** Daily coding exercises and virtual lab experiments solidify each lesson.
- **Phase 3: Production Project Tasks:** Immediately apply what you learned into a real application sprint.
- **Phase 4: Mentor Evaluation:** Technical leads review your pull requests, assess your database schemas, and suggest optimizations.
- **Phase 5: Comprehensive Assessment & Certification:** Formal verification of both your technical depth and project output.

This unified model compresses months of fragmented effort into an efficient, results-oriented sprint that gives you both knowledge and tangible proof of ability.`,
  },
  {
    id: "post-4",
    category: "Technology & Coding",
    title: "Zero Setup, Total Focus: How Cloud Virtual Labs Revolutionize Hands-on Practice",
    readTime: "4 min read",
    date: "September 05, 2026",
    views: "3.9k views",
    claps: 220,
    author: "TX Cloud Infrastructure Desk",
    authorRole: "Cloud Engineer",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Say goodbye to local installation headaches, dependency conflicts, and low-spec laptop limitations. Learn how browser-based virtual labs let students run databases, cloud tasks, and DevOps workflows effortlessly.",
    tags: ["Virtual Labs", "Cloud Sandboxes", "Database Practice", "DevOps"],
    keyTakeaways: [
      "Instant browser-based access without requiring expensive hardware or complex local configurations.",
      "Pre-configured sandbox environments for database management, cloud workflows, testing suites, and AI/ML experiments.",
      "Objective tracking of lab attempts, time spent, completion rates, and practical assessment scores.",
    ],
    content: `### The Frustration of Local Setup
Every computer science student has experienced it: spend three days trying to configure a local MySQL server, Docker container, or specific compiler version, only to encounter endless permission errors and operating system conflicts. By the time the environment is ready, energy and motivation are depleted.

#### The Virtual Lab Breakthrough
TX-Path-Wing introduces **Virtual Labs** accessible directly within your browser:
- **Pre-Configured Environments:** Spin up clean programming runtimes, relational databases, and cloud sandboxes with a single click.
- **Hardware Agnostic:** Whether you are on a modest college library desktop or a budget laptop, complex tasks run smoothly in high-performance cloud clusters.
- **Safe Experimentation:** Break, reset, and reconfigure databases and configurations without fear of ruining your personal machine.
- **Tracked Competency:** The platform logs your time-on-task, attempted scenarios, error-recovery steps, and overall completion score.

Virtual labs democratize access to advanced technology, ensuring every passionate student has the tools needed to build enterprise-grade software.`,
  },
  {
    id: "post-5",
    category: "Events & Hackathons",
    title: "48 Hours That Transform Your Resume: What You Truly Learn from Hackathons & Bootcamps",
    readTime: "5 min read",
    date: "September 02, 2026",
    views: "2.4k views",
    claps: 168,
    author: "Student Community & Events Lead",
    authorRole: "Community Manager",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Beyond winning prizes, hackathons teach team collaboration, rapid prototyping, and presentation skills under real deadlines—essential industry skills that college exams never measure.",
    tags: ["Hackathons", "Bootcamps", "Teamwork", "Rapid Prototyping"],
    keyTakeaways: [
      "Hackathons build rapid problem-solving, architectural decision-making, and high-pressure teamwork skills.",
      "Intensive workshops and bootcamps bridge specific skill gaps in 1–3 focused days.",
      "Event participation and finalist certificates provide standout conversation points during job interviews.",
    ],
    content: `### The Unmatched Value of Event-Based Learning
In the software industry, developers rarely write code in isolation. Products are built in fast-moving cross-functional teams with tight sprint deadlines and shifting client requirements. Standard classroom assignments provide weeks to finish a single feature, but hackathons compress the entire product development lifecycle into 48 exhilarating hours.

#### What Hackathons Teach You That Classes Cannot
- **Rapid Architectural Prioritization:** Deciding what MVP features matter most and what fluff can be cut to ship on time.
- **Git Collaboration & Merge Conflict Resolution:** Working on shared repositories with teammates in real time.
- **Pitching to Technical Judges:** Explaining your architectural choices, database models, and commercial viability clearly in 3 minutes.
- **Resilience Under Pressure:** Debugging unexpected deployment failures minutes before the submission deadline.

TX-Path-Wing hosts and coordinates online and onsite hackathons, intensive skill bootcamps, and industry workshops. Participating in these events creates lasting memories, deep peer networks, and undeniable proof of initiative.`,
  },
  {
    id: "post-6",
    category: "Career & Industry",
    title: "Why Mentorship Accelerates Growth: Real Code Reviews vs. Solo Self-Study",
    readTime: "4 min read",
    date: "August 28, 2026",
    views: "3.7k views",
    claps: 275,
    author: "Senior Technical Mentorship Council",
    authorRole: "Lead Mentor",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Having an experienced industry mentor review your code, point out structural antipatterns, and offer constructive feedback transforms college code into production-grade engineering.",
    tags: ["Mentorship", "Code Reviews", "Best Practices", "Career Coaching"],
    keyTakeaways: [
      "Mentors catch antipatterns, security vulnerabilities, and bad architecture that automated tutorials gloss over.",
      "Personalized feedback builds confidence and provides insight into corporate engineering expectations.",
      "Direct guidance helps students navigate career paths, choose high-leverage specializations, and prepare for interviews.",
    ],
    content: `### You Don't Know What You Don't Know
When learning alone through YouTube videos and documentation, it is easy to write code that works on the surface but contains critical flaws underneath: SQL injection vulnerabilities, memory leaks, unhandled API promises, and spaghetti architecture. Because nobody is auditing your work, these bad habits harden over time.

#### The Mentor Difference at TX-Path-Wing
Our mentor ecosystem connects students directly with working technology practitioners:
- **Actionable Pull Request Reviews:** Mentors don't just tell you that your code failed; they explain *why* a particular data structure is inefficient and show you cleaner ways to refactor.
- **Live Interactive Problem-Solving:** Ask questions in real time during live training batches, clarifying ambiguous concepts immediately.
- **Holistic Evaluation:** Mentors assess your assignments, practical tasks, and capstone submissions according to industry standards.
- **Industry Insight:** Learn what technologies real engineering teams are adopting and which legacy patterns are being phased out.

Having a mentor is like having a compass in a vast forest—it prevents you from wandering into dead ends and ensures every hour of study moves you toward career success.`,
  },
  {
    id: "post-7",
    category: "Certifications",
    title: "What Makes a Digital Certificate Valuable? Verifiable IDs, Mentor Sign-Offs, & Demonstrated Skills",
    readTime: "4 min read",
    date: "August 24, 2026",
    views: "4.1k views",
    claps: 290,
    author: "Standards & Credentialing Council",
    authorRole: "Certification Officer",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "In a sea of generic PDF certificates, hiring managers value verifiable credentials backed by completed assessments, mentor sign-offs, and unique tamper-evident verification URLs.",
    tags: ["Certificates", "Credentialing", "QR Verification", "LinkedIn Proof"],
    keyTakeaways: [
      "Every TX-Path-Wing certificate comes with a unique Certificate ID, QR verification, and digital signature.",
      "Credentials require passing formal quizzes, assignments, exams, or practical tasks—no free participation passes.",
      "Employers and institutions can instantly verify authenticity online, eliminating credential fraud.",
    ],
    content: `### The Certificate Inflation Crisis
In recent years, the internet has become flooded with completion certificates that require nothing more than clicking 'Next' on a video player. Hiring managers and recruiters have caught on—generic PDF certificates without verification carry virtually zero weight during resume screening.

#### The TX-Path-Wing Credentialing Standard
A certificate should represent demonstrated competency, not passive attendance. Every certificate issued on our platform adheres to strict verification standards:
1. **Prerequisite Completion:** A student must complete required lessons, practical assignments, and benchmark assessments.
2. **Automated & Mentor Evaluation:** Scores are verified across quizzes, code submissions, and mentor sign-offs.
3. **Unique Cryptographic ID:** Each issued certificate contains an immutable Certificate ID registered on our platform database.
4. **Instant Online Verification:** Recruiters can scan the embedded QR code or visit our verification portal to confirm the student's name, course, completion date, and issuing authority.
5. **Direct LinkedIn & Portfolio Sharing:** Showcase authentic badges that prove real-world effort to potential employers.

When you present a TX-Path-Wing credential, employers know it was earned through rigorous practice and objective evaluation.`,
  },
  {
    id: "post-8",
    category: "Training",
    title: "Flexible Learning for Busy Students: Comparing Live, Hybrid, Offline, & Self-Paced Modes",
    readTime: "5 min read",
    date: "August 20, 2026",
    views: "2.9k views",
    claps: 172,
    author: "TX Academic Operations Group",
    authorRole: "Academic Dean",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
    shortDescription:
      "Balancing university semesters, mid-terms, and skill acquisition requires flexible options. Explore which training delivery mode best suits your personal schedule and learning style.",
    tags: ["Live Training", "Hybrid Mode", "Offline Classes", "Recorded Courses"],
    keyTakeaways: [
      "Online Live: Real-time instructor lectures, live Q&A, and scheduled accountability.",
      "Hybrid Training: Combines flexible online study with high-impact in-person lab sessions.",
      "Offline / Onsite: Direct classroom immersion on campus or regional training centers.",
      "Recorded Courses: Self-paced freedom with 24/7 video access, downloadable notes, and progress saving.",
    ],
    content: `### One Size Does Not Fit All in Education
Between college semester timetables, laboratory exams, commute times, and personal commitments, no two students learn under identical circumstances. A learning platform must adapt to the student—not the other way around.

#### Exploring the 4 Delivery Modes on TX-Path-Wing
1. **Online Live Training:**
   - Perfect for students who thrive on live interaction, real-time mentor Q&A, and structured schedules.
   - Join live interactive video classrooms, participate in live coding sessions, and ask clarifying questions on the spot.

2. **Hybrid Training:**
   - The best of both worlds: review theoretical foundations online during weekdays, then attend hands-on offline workshops and project reviews over weekends.
   - High retention and strong peer collaboration.

3. **Offline / Onsite Training:**
   - Conducted directly on college partner campuses or dedicated training centers.
   - Face-to-face mentorship, structured cohort discipline, and immersive lab setups.

4. **Self-Paced Recorded Courses:**
   - Full control over your study timeline. Watch HD video modules at 1.5x speed, pause to take notes, and complete assignments when your schedule allows.
   - Automatic progress tracking and bookmarking ensure you can pick up exactly where you left off.

Choose the mode that aligns with your semester commitments and build momentum towards your career goals without burning out.`,
  },
];

// ==========================================
// 4. STUDENT LEARNING JOURNEY (6-Step Lifecycle from PDF matching screenshot_step8.png)
// ==========================================
export const LEARNING_JOURNEY_STEPS = [
  {
    step: "01",
    stageCode: "STAGE 01 → 02",
    title: "Learn",
    subtitle: "Modular Concepts & Fundamentals",
    description: "Master industry-vetted concepts through Online Live, Hybrid, Onsite, or Recorded batches led by senior tech trainers.",
    badge: "PASSED",
    aiLayer: true,
    color: "#6d2be0",
  },
  {
    step: "02",
    stageCode: "STAGE 02 → 03",
    title: "Practice",
    subtitle: "In-Browser Code Execution",
    description: "Solve algorithmic problems directly inside our cloud compiler with instant test cases across Python, Java, JS, C++, and SQL.",
    badge: "PASSED",
    aiLayer: false,
    color: "#2f7cf6",
  },
  {
    step: "03",
    stageCode: "STAGE 03 → 04",
    title: "Build",
    subtitle: "Real-World Projects & Virtual Labs",
    description: "Deploy production-grade microservices and database schemas in browser-based PostgreSQL and DevOps virtual lab sandboxes.",
    badge: "PASSED",
    aiLayer: true,
    color: "#26d6e9",
  },
  {
    step: "04",
    stageCode: "STAGE 04 → 05",
    title: "Get Assessed",
    subtitle: "Quizzes, Tasks & Exams",
    description: "Validate genuine understanding through proctored objective quizzes, practical coding assessments, and senior mentor code reviews.",
    badge: "PASSED",
    aiLayer: true,
    color: "#8b5cf6",
  },
  {
    step: "05",
    stageCode: "STAGE 05 → 06",
    title: "Get Certified",
    subtitle: "Verifiable Digital Credentials",
    description: "Receive cryptographically signed credentials featuring immutable Certificate IDs and QR verification URLs trusted by recruiters.",
    badge: "CURRENT",
    aiLayer: false,
    color: "#059669",
  },
  {
    step: "06",
    stageCode: "STAGE 06 → 07",
    title: "Become Industry Ready",
    subtitle: "Internships & Corporate Placement",
    description: "Transition into official company internships, hackathons, and corporate partner hiring drives with proven portfolio evidence.",
    badge: "GOAL",
    aiLayer: true,
    color: "#f59e0b",
  },
];

// ==========================================
// 5. INTERNSHIP JOURNEY WORKFLOW (Directly from PDF section 8 & 9)
// ==========================================
export const INTERNSHIP_WORKFLOW_STEPS = [
  {
    num: "1",
    title: "Registration & Eligibility",
    desc: "Explore verified official or occasional internship openings; filter by technology, duration, and prerequisites.",
    status: "Verified",
  },
  {
    num: "2",
    title: "Structured Training",
    desc: "Refresh foundational frameworks, Git workflows, and modern architecture required for actual project tasks.",
    status: "Active",
  },
  {
    num: "3",
    title: "Production Tasks & Sprints",
    desc: "Work on genuine milestone deliverables with defined deadlines rather than passive observation.",
    status: "Milestone",
  },
  {
    num: "4",
    title: "Mentor Review & Code Audit",
    desc: "Experienced industry trainers inspect your code, evaluate architecture, and provide feedback.",
    status: "Audited",
  },
  {
    num: "5",
    title: "Final Skill Assessment",
    desc: "Complete comprehensive practical examinations demonstrating mastery of the internship stack.",
    status: "Graded",
  },
  {
    num: "6",
    title: "Completion & Verifiable Certificate",
    desc: "Earn an authenticated completion certificate with unique verification URL and QR credentials.",
    status: "Certified",
  },
];

// ==========================================
// 6. RICH INTERACTIVE CODING PROBLEMS (For Real Application Screen)
// ==========================================
export const CODING_LANGUAGES = [
  {
    id: "python",
    name: "Python",
    badge: "Python 3.12",
    icon: "🐍",
    fileName: "solution.py",
    problemTitle: "Problem #101: Two-Sum Target Index Finder",
    difficulty: "Easy",
    acceptanceRate: "89.4%",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    tags: ["Array", "Hash Table", "Algorithms"],
    problemDesc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: `# TX-Path-Wing Interactive Code Practice
# Language: Python 3.12 | In-Browser Execution

def two_sum(nums, target):
    # Use a hash map to achieve O(N) linear time complexity
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Driver test harness
if __name__ == "__main__":
    test_nums = [2, 7, 11, 15]
    test_target = 9
    result = two_sum(test_nums, test_target)
    print(f"Indices: {result} -> Values: {test_nums[result[0]]} + {test_nums[result[1]]} = {test_target}")`,
    testCases: [
      {
        id: 1,
        name: "Test Case 1",
        input: "nums = [2, 7, 11, 15], target = 9",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "11 ms",
        memory: "15.8 MB",
      },
      {
        id: 2,
        name: "Test Case 2",
        input: "nums = [3, 2, 4], target = 6",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
        runtime: "9 ms",
        memory: "15.9 MB",
      },
      {
        id: 3,
        name: "Test Case 3",
        input: "nums = [3, 3], target = 6",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "8 ms",
        memory: "15.7 MB",
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    badge: "OpenJDK 21",
    icon: "☕",
    fileName: "Solution.java",
    problemTitle: "Problem #102: Two-Sum Pair Indexer",
    difficulty: "Easy",
    acceptanceRate: "87.1%",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    tags: ["Array", "HashMap", "Core Java"],
    problemDesc: "Implement an efficient hash-lookup solution in Java 21 to find pair indices summing to target value.",
    constraints: [
      "nums.length in range [2, 10^5]",
      "Target within 32-bit signed integer limits",
      "Memory limit: 256 MB",
    ],
    starterCode: `import java.util.HashMap;
import java.util.Arrays;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int[] result = twoSum(nums, 9);
        System.out.println("Pair Indices: " + Arrays.toString(result));
    }
}`,
    testCases: [
      {
        id: 1,
        name: "Test Case 1",
        input: "nums = [2, 7, 11, 15], target = 9",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "1 ms",
        memory: "42.2 MB",
      },
      {
        id: 2,
        name: "Test Case 2",
        input: "nums = [3, 2, 4], target = 6",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
        runtime: "2 ms",
        memory: "42.5 MB",
      },
      {
        id: 3,
        name: "Test Case 3",
        input: "nums = [3, 3], target = 6",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "1 ms",
        memory: "42.1 MB",
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    badge: "Node.js 22",
    icon: "⚡",
    fileName: "solution.js",
    problemTitle: "Problem #103: Pair Match Hash Lookup",
    difficulty: "Easy",
    acceptanceRate: "91.2%",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    tags: ["ES6", "Map", "V8 Engine"],
    problemDesc: "Solve Two-Sum using ES6 Map with constant-time amortized lookups on Node.js 22 V8 engine.",
    constraints: [
      "Array length up to 50,000 integers",
      "Exact match guaranteed",
    ],
    starterCode: `// TX-Path-Wing V8 Browser Compiler
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const res = twoSum([2, 7, 11, 15], 9);
console.log("Returned indices:", res);`,
    testCases: [
      {
        id: 1,
        name: "Test Case 1",
        input: "[2, 7, 11, 15], target = 9",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "4 ms",
        memory: "33.6 MB",
      },
      {
        id: 2,
        name: "Test Case 2",
        input: "[3, 2, 4], target = 6",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
        runtime: "3 ms",
        memory: "33.8 MB",
      },
      {
        id: 3,
        name: "Test Case 3",
        input: "[3, 3], target = 6",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "3 ms",
        memory: "33.5 MB",
      },
    ],
  },
  {
    id: "cpp",
    name: "C++",
    badge: "G++ 14",
    icon: "⚙️",
    fileName: "solution.cpp",
    problemTitle: "Problem #104: Fast Hash Vector Search",
    difficulty: "Medium",
    acceptanceRate: "82.5%",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    tags: ["STL", "unordered_map", "High Performance"],
    problemDesc: "Optimized modern C++ solution using std::unordered_map with pre-reserved bucket capacity for sub-millisecond execution.",
    constraints: [
      "Execution time limit: 50ms",
      "Vector elements: [-10^6, 10^6]",
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    seen.reserve(nums.size());
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        auto it = seen.find(complement);
        if (it != seen.end()) {
            return {it->second, i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    auto ans = twoSum(nums, 9);
    std::cout << "Indices: [" << ans[0] << ", " << ans[1] << "]\n";
    return 0;
}`,
    testCases: [
      {
        id: 1,
        name: "Test Case 1",
        input: "nums = {2, 7, 11, 15}, target = 9",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "0 ms",
        memory: "10.4 MB",
      },
      {
        id: 2,
        name: "Test Case 2",
        input: "nums = {3, 2, 4}, target = 6",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
        runtime: "0 ms",
        memory: "10.5 MB",
      },
      {
        id: 3,
        name: "Test Case 3",
        input: "nums = {3, 3}, target = 6",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
        runtime: "0 ms",
        memory: "10.3 MB",
      },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    badge: "PostgreSQL 16",
    icon: "🗄️",
    fileName: "analytics_query.sql",
    problemTitle: "Problem #105: Student Course Performance Analytics",
    difficulty: "Medium",
    acceptanceRate: "76.4%",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(K)",
    tags: ["SQL", "JOINs", "Aggregation", "GROUP BY"],
    problemDesc: "Write a SQL query to calculate student performance metrics, counting verified certifications and average assessment scores across active course batches.",
    constraints: [
      "Filter for students with avg_score >= 85.0",
      "Sort by avg_score DESC",
    ],
    starterCode: `-- Query: High Performing Students Across Batches
SELECT 
    s.student_id,
    s.full_name,
    s.college_name,
    COUNT(c.certificate_id) AS verified_certs,
    ROUND(AVG(a.score), 2) AS avg_assessment_score
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN assessments a ON e.enrollment_id = a.enrollment_id
LEFT JOIN certificates c ON e.enrollment_id = c.enrollment_id
GROUP BY s.student_id, s.full_name, s.college_name
HAVING AVG(a.score) >= 85.0
ORDER BY avg_assessment_score DESC
LIMIT 5;`,
    testCases: [
      {
        id: 1,
        name: "Query Execution",
        input: "Database: tx_production_lms (PostgreSQL 16)",
        expected: "5 aggregated student records",
        actual: "5 aggregated student records",
        status: "Passed",
        runtime: "0.82 ms",
        memory: "2.1 MB",
      },
      {
        id: 2,
        name: "Schema Index Check",
        input: "Index on enrollments(student_id)",
        expected: "Index Scan Utilized",
        actual: "Index Scan Utilized",
        status: "Passed",
        runtime: "0.14 ms",
        memory: "Shared Buffer",
      },
    ],
  },
];

// ==========================================
// 7. VIRTUAL LABS SUITE (Directly supported by PDF section 18)
// ==========================================
export const VIRTUAL_LAB_ENVIRONMENTS = [
  {
    id: "db-lab",
    name: "PostgreSQL Database Lab",
    badge: "Database Sandbox",
    icon: "🗄️",
    description: "Practice complex relational schema migrations, indexing, and multi-tenant isolation directly in a PostgreSQL 16 cluster.",
    sampleQuery: "SELECT student_id, full_name, college_name, verified_status FROM students WHERE active_batch = 'BTECH-CS-2026' LIMIT 4;",
    tableRows: [
      { id: "STU-8821", name: "Aarav Sharma", college: "JNTU Hyderabad", status: "VERIFIED", certs: "3" },
      { id: "STU-8824", name: "Pooja Reddy", college: "Osmania University", status: "VERIFIED", certs: "4" },
      { id: "STU-8829", name: "Kiran Varma", college: "CBIT Hyderabad", status: "PENDING_AUDIT", certs: "2" },
      { id: "STU-8833", name: "Sneha Patel", college: "VNIT Nagpur", status: "VERIFIED", certs: "5" },
    ],
  },
  {
    id: "devops-lab",
    name: "DevOps & Cloud Docker Lab",
    badge: "Container Terminal",
    icon: "🐳",
    description: "Launch isolated Linux containers, configure reverse proxies, and test containerized Node and Python microservices.",
    terminalPrompt: "tx-engineer@tx-cloud-node-4:~$ docker ps",
    terminalOutput: `CONTAINER ID   IMAGE                 COMMAND                  STATUS          PORTS
7f8a91b2c3d4   tx-postgres:16        "docker-entrypoint.s…"   Up 4 hours      0.0.0.0:5432->5432/tcp
9c8b7a6d5e4f   tx-code-runner:v2.1   "node server.js"         Up 4 hours      0.0.0.0:8080->8080/tcp
1a2b3c4d5e6f   tx-redis:alpine       "docker-entrypoint.s…"   Up 4 hours      0.0.0.0:6379->6379/tcp
[tx-cloud-node-4]: Cloud sandbox healthy. All 3 microservices active.`,
  },
  {
    id: "aiml-lab",
    name: "AI & Machine Learning Sandbox",
    badge: "Jupyter Runtime",
    icon: "🤖",
    description: "Train lightweight PyTorch and Scikit-Learn models, visualize accuracy loss curves, and evaluate inference latency.",
    terminalPrompt: "Epoch 10/10 [==============================] - 2s 15ms/step",
    terminalOutput: `Validation Loss: 0.0412 | Validation Accuracy: 98.74%
F1-Score: 0.985 | Confusion Matrix Evaluated.
Model saved to /artifacts/weights_btech_v1.pt. Ready for API serving.`,
  },
];

// ==========================================
// 8. COLLEGE & INSTITUTION LMS PILLARS (From PDF section 3, 26-33)
// ==========================================
export const COLLEGE_LMS_BENEFITS = [
  {
    title: "Student Roster & Bulk Import",
    desc: "Seamlessly onboard entire departmental cohorts via Excel/CSV import with automated profile and credential creation.",
    icon: Users,
  },
  {
    title: "Mentor Assignment & Workload",
    desc: "Appoint professors and guest industry mentors, assign course modules, and monitor class conduction and review speed.",
    icon: Briefcase,
  },
  {
    title: "Multi-Batch Scheduling",
    desc: "Organize hundreds of students across morning, evening, or weekend batches with individual attendance tracking.",
    icon: Calendar,
  },
  {
    title: "Curriculum & Course Governance",
    desc: "Deploy platform-owned syllabus tracks or create custom university courses with multi-tier approval workflows.",
    icon: BookOpen,
  },
  {
    title: "Real-Time Progress Tracking",
    desc: "Monitor course completion percentages, live class attendance records, and submission timeliness at a glance.",
    icon: Layers,
  },
  {
    title: "Automated & Practical Assessments",
    desc: "Conduct randomized online quizzes, coding examinations, and mentor-evaluated project reviews.",
    icon: CheckSquare,
  },
  {
    title: "Accreditation & NAAC Reports",
    desc: "Generate institutional reports on student outcomes, attendance, and skill gains ready for academic audits.",
    icon: Building2,
  },
  {
    title: "Co-Branded Verifiable Certifications",
    desc: "Issue certificates featuring your institution's crest, mentor signatures, and tamper-evident QR verification.",
    icon: ShieldCheck,
  },
];
