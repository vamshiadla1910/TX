// Initial mock dataset for TX-Pathwing Platform Super Admin Console
// All data structures represent realistic platform entities with cross-module links.

export const initialTenants = [
  {
    id: "tnt-1",
    name: "KITS Warangal",
    type: "Institution",
    domain: "kitsw.pathwing.in",
    seats: 2500,
    used: 2140,
    contract: "Jun 26 – May 27",
    status: "Active",
    plan: "Enterprise LMS",
    contactName: "Dr. K. Srinivas Rao",
    contactEmail: "ksrinivas@kitsw.ac.in",
    phone: "+91 870 2564888",
    city: "Warangal, Telangana",
    onboardingProgress: 100,
    documentsSubmitted: ["Accreditation Certificate (NAAC A+)", "MOU Agreement signed", "DNS Verification TXT"],
    coursesOffered: 18,
    activeBatches: 12,
    createdAt: "2026-05-15"
  },
  {
    id: "tnt-2",
    name: "Deloitte USI",
    type: "Corporate",
    domain: "learn.deloitte-usi.in",
    seats: 4000,
    used: 3612,
    contract: "Jan 26 – Dec 26",
    status: "Active",
    plan: "Enterprise LMS",
    contactName: "Pooja Malhotra",
    contactEmail: "pmalhotra@deloitte.com",
    phone: "+91 40 67621000",
    city: "Hyderabad, Telangana",
    onboardingProgress: 100,
    documentsSubmitted: ["Corporate Master Service Agreement", "Single Sign-On (SAML) Config", "Security Clearance"],
    coursesOffered: 24,
    activeBatches: 20,
    createdAt: "2026-01-10"
  },
  {
    id: "tnt-3",
    name: "ValueLabs",
    type: "Corporate",
    domain: "skills.valuelabs.com",
    seats: 1800,
    used: 1204,
    contract: "Apr 26 – Mar 27",
    status: "Active",
    plan: "Professional",
    contactName: "Rajesh Kulkarni",
    contactEmail: "rajesh.k@valuelabs.com",
    phone: "+91 40 66239000",
    city: "Hyderabad, Telangana",
    onboardingProgress: 100,
    documentsSubmitted: ["Vendor Agreement", "Data Processing Addendum"],
    coursesOffered: 14,
    activeBatches: 8,
    createdAt: "2026-03-22"
  },
  {
    id: "tnt-4",
    name: "Tanvox Technologies",
    type: "Corporate",
    domain: "academy.tanvox.in",
    seats: 400,
    used: 318,
    contract: "Feb 26 – Jan 27",
    status: "Active",
    plan: "Basic",
    contactName: "Arun Varma",
    contactEmail: "arun@tanvox.in",
    phone: "+91 80 41129930",
    city: "Bengaluru, Karnataka",
    onboardingProgress: 100,
    documentsSubmitted: ["Service Agreement"],
    coursesOffered: 6,
    activeBatches: 4,
    createdAt: "2026-02-05"
  },
  {
    id: "tnt-5",
    name: "TX Hub Academy",
    type: "Training provider",
    domain: "txhub.pathwing.in",
    seats: 1200,
    used: 1190,
    contract: "Mar 26 – Feb 27",
    status: "Seats near cap",
    plan: "Professional",
    contactName: "Kavita Reddy",
    contactEmail: "kavita@txhub.org",
    phone: "+91 40 48590123",
    city: "Hyderabad, Telangana",
    onboardingProgress: 100,
    documentsSubmitted: ["Training Provider License", "GST Certificate"],
    coursesOffered: 32,
    activeBatches: 18,
    createdAt: "2026-03-01"
  },
  {
    id: "tnt-6",
    name: "Anurag University",
    type: "Institution",
    domain: "Provisioning",
    seats: 1500,
    used: 0,
    contract: "Oct 26 – Sep 27",
    status: "Onboarding",
    plan: "Enterprise LMS",
    contactName: "Prof. S. N. Murthy",
    contactEmail: "dean.engg@anurag.edu.in",
    phone: "+91 84 99963666",
    city: "Ghatkesar, Hyderabad",
    onboardingProgress: 65,
    documentsSubmitted: ["Institution Registration", "Board Approval Letter"],
    coursesOffered: 0,
    activeBatches: 0,
    createdAt: "2026-10-01"
  },
  {
    id: "tnt-7",
    name: "Mahindra University",
    type: "Institution",
    domain: "learn.mahindrauniversity.edu.in",
    seats: 2000,
    used: 1420,
    contract: "Aug 26 – Jul 27",
    status: "Active",
    plan: "Enterprise LMS",
    contactName: "Dr. Sandeep Deshmukh",
    contactEmail: "sandeep.d@mahindra.edu.in",
    phone: "+91 40 67135100",
    city: "Bahadurpally, Hyderabad",
    onboardingProgress: 100,
    documentsSubmitted: ["University Charter", "NDA & SLA Agreement"],
    coursesOffered: 16,
    activeBatches: 10,
    createdAt: "2026-07-28"
  }
];

export const initialUsers = [
  {
    id: "usr-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@kitsw.pathwing.in",
    role: "Student",
    tenant: "KITS Warangal",
    status: "Active",
    joinedDate: "12 Jul 2026",
    lastActive: "2 hours ago",
    coursesEnrolled: 4,
    coursesCompleted: 2,
    phone: "+91 98765 43210",
    city: "Warangal"
  },
  {
    id: "usr-2",
    name: "Dr. R. Ramana",
    email: "ramana.r@kitsw.ac.in",
    role: "Mentor",
    tenant: "KITS Warangal",
    status: "Active",
    joinedDate: "01 Jun 2026",
    lastActive: "15 mins ago",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    coursesMentored: 3,
    phone: "+91 94401 23456",
    city: "Warangal"
  },
  {
    id: "usr-3",
    name: "Priya Varma",
    email: "p.varma@deloitte.com",
    role: "Org Admin",
    tenant: "Deloitte USI",
    status: "Active",
    joinedDate: "15 Jan 2026",
    lastActive: "1 hour ago",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    phone: "+91 99887 76655",
    city: "Hyderabad"
  },
  {
    id: "usr-4",
    name: "Vikram Patel",
    email: "vpatel@txhub.org",
    role: "Mentor",
    tenant: "TX Hub Academy",
    status: "Active",
    joinedDate: "10 Mar 2026",
    lastActive: "35 mins ago",
    coursesMentored: 5,
    phone: "+91 91234 56789",
    city: "Hyderabad"
  },
  {
    id: "usr-5",
    name: "Sneha Reddy",
    email: "sneha.reddy@student.valuelabs.com",
    role: "Student",
    tenant: "ValueLabs",
    status: "Active",
    joinedDate: "18 Apr 2026",
    lastActive: "Yesterday",
    coursesEnrolled: 3,
    coursesCompleted: 1,
    phone: "+91 97000 11223",
    city: "Secunderabad"
  },
  {
    id: "usr-6",
    name: "Karan Johar",
    email: "karan.j@anurag.edu.in",
    role: "Org Admin",
    tenant: "Anurag University",
    status: "Pending",
    joinedDate: "05 Oct 2026",
    lastActive: "3 days ago",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    phone: "+91 98888 22334",
    city: "Hyderabad"
  },
  {
    id: "usr-7",
    name: "Sunil Nambiar",
    email: "sunil.n@pathwing.in",
    role: "Super Admin",
    tenant: "Platform Operations",
    status: "Active",
    joinedDate: "01 Jan 2025",
    lastActive: "Just now",
    phone: "+91 99001 88221",
    city: "Hyderabad"
  }
];

export const initialCourses = [
  {
    id: "crs-1",
    title: "Advanced Java Bootcamp",
    organization: "KITS Warangal",
    instructor: "Dr. R. Ramana",
    category: "Software Development",
    level: "Advanced",
    duration: "12 Weeks",
    enrollments: 420,
    rating: 4.8,
    status: "Overdue",
    submittedDate: "05 Sep 2026",
    slaWindow: "48 Hours",
    slaStatus: "SLA Breached (+4 days)",
    modulesCount: 14,
    description: "Enterprise backend development featuring Spring Boot 3, Microservices, JPA Hibernate, Docker containerization, and Kafka event streaming.",
    assignedReviewer: "Unassigned",
    price: "₹4,999",
    prerequisites: "Core Java, OOP principles, Basic SQL",
    syllabus: ["1. Spring Core & IoC", "2. Spring Data JPA", "3. REST APIs & Validation", "4. Microservices with Spring Cloud", "5. Docker & CI/CD Pipelines"]
  },
  {
    id: "crs-2",
    title: "Full Stack Development (MERN)",
    organization: "TX Hub Academy",
    instructor: "Vikram Patel",
    category: "Web Development",
    level: "Intermediate",
    duration: "16 Weeks",
    enrollments: 760,
    rating: 4.7,
    status: "Pending Review",
    submittedDate: "12 Oct 2026",
    slaWindow: "48 Hours",
    slaStatus: "Within SLA (18h left)",
    modulesCount: 18,
    description: "Industry-grade Full Stack development covering modern React 19, Node.js, Express, MongoDB, TypeScript, and AWS cloud deployment.",
    assignedReviewer: "Sunil Nambiar",
    price: "₹6,499",
    prerequisites: "HTML5, CSS3, Modern JavaScript (ES6+)",
    syllabus: ["1. Modern TypeScript", "2. React State & Hooks", "3. Node Backend Architecture", "4. MongoDB & Prisma", "5. Production AWS Deployment"]
  },
  {
    id: "crs-3",
    title: "Cloud Fundamentals & AWS Architecture",
    organization: "Deloitte USI",
    instructor: "Pooja Malhotra",
    category: "Cloud & DevOps",
    level: "Beginner to Intermediate",
    duration: "8 Weeks",
    enrollments: 1150,
    rating: 4.9,
    status: "Pending Review",
    submittedDate: "14 Oct 2026",
    slaWindow: "48 Hours",
    slaStatus: "Within SLA (36h left)",
    modulesCount: 10,
    description: "Official corporate foundational track for Solutions Architects covering AWS compute, storage, VPC networking, IAM security, and cost optimization.",
    assignedReviewer: "Unassigned",
    price: "₹8,999",
    prerequisites: "Basic Linux commands, computer networking fundamentals",
    syllabus: ["1. AWS Global Infrastructure", "2. EC2 & Auto Scaling", "3. S3 & Storage Tiers", "4. VPC, Subnets & Routing", "5. CloudWatch & IAM Policies"]
  },
  {
    id: "crs-4",
    title: "Data Science & ML Pipeline Engineering",
    organization: "Mahindra University",
    instructor: "Dr. Sandeep Deshmukh",
    category: "AI & Data Science",
    level: "Advanced",
    duration: "14 Weeks",
    enrollments: 310,
    rating: 4.85,
    status: "Published",
    submittedDate: "18 Aug 2026",
    slaWindow: "48 Hours",
    slaStatus: "Approved",
    modulesCount: 16,
    description: "End-to-end Machine Learning workflows with Python, Pandas, Scikit-learn, TensorFlow, MLflow experiment tracking, and model serving.",
    assignedReviewer: "Sunil Nambiar",
    price: "₹7,500",
    prerequisites: "Python programming, linear algebra, statistics",
    syllabus: ["1. Exploratory Data Analysis", "2. Feature Engineering", "3. Supervised & Unsupervised ML", "4. Deep Learning Basics", "5. MLOps & Deployment"]
  },
  {
    id: "crs-5",
    title: "Cybersecurity Analyst & Threat Hunting",
    organization: "Tanvox Technologies",
    instructor: "Arun Varma",
    category: "Cybersecurity",
    level: "Intermediate",
    duration: "10 Weeks",
    enrollments: 190,
    rating: 4.6,
    status: "Published",
    submittedDate: "20 Jul 2026",
    slaWindow: "48 Hours",
    slaStatus: "Approved",
    modulesCount: 12,
    description: "Defensive security operations, SIEM tool management, vulnerability assessment, threat intelligence analysis, and incident response drill.",
    assignedReviewer: "Platform Review Team",
    price: "₹5,200",
    prerequisites: "Networking (TCP/IP), OS internals",
    syllabus: ["1. Network Security Protocols", "2. Vulnerability Scanning", "3. SIEM with Splunk", "4. Threat Intel & MITRE ATT&CK", "5. Incident Handling"]
  }
];

export const initialApprovals = [
  {
    id: "appr-1",
    type: "Course publication",
    title: "Advanced Java Bootcamp",
    submittedBy: "Dr. R. Ramana (KITS Warangal)",
    category: "Curriculum Content",
    submittedDate: "05 Sep 2026",
    status: "Overdue",
    sla: "Past SLA by 96h",
    details: "Course syllabus, 14 module videos, 28 auto-graded coding assignments, and quiz bank submitted for platform catalogue publication.",
    documents: ["Syllabus_SLA.pdf", "Lab_Environment_Spec.json"],
    reviewer: "Unassigned"
  },
  {
    id: "appr-2",
    type: "Organization onboarding",
    title: "Anurag University Campus License",
    submittedBy: "Prof. S. N. Murthy (Dean)",
    category: "Tenant Onboarding",
    submittedDate: "01 Oct 2026",
    status: "Pending",
    sla: "Due in 2 days",
    details: "1,500 learner seats request, custom subdomain anurag.pathwing.in, LMS SSO integration, and bulk faculty account provisioning.",
    documents: ["MOU_Signed_Copy.pdf", "Domain_Delegation.txt", "Authorized_Signatory.pdf"],
    reviewer: "Sunil Nambiar"
  },
  {
    id: "appr-3",
    type: "Mentor verification",
    title: "Dr. Sunita Deshmukh — Senior AI Mentor",
    submittedBy: "Dr. Sunita Deshmukh",
    category: "Faculty Credential",
    submittedDate: "10 Oct 2026",
    status: "Pending",
    sla: "Due in 3 days",
    details: "Application for platform-wide mentor empanelment in Deep Learning and Generative AI. 12 years research experience at IIT Madras.",
    documents: ["PhD_Degree_Certificate.pdf", "IEEE_Publications_List.pdf", "Govt_ID_Proof.pdf"],
    reviewer: "Sunil Nambiar"
  },
  {
    id: "appr-4",
    type: "Training program launch",
    title: "Corporate Cloud Upskilling Cohort 4",
    submittedBy: "Pooja Malhotra (Deloitte USI)",
    category: "Enterprise Cohort",
    submittedDate: "13 Oct 2026",
    status: "Pending",
    sla: "Due in 4 days",
    details: "400 cohort seats across Bangalore and Hyderabad campuses with private repo access and dedicated lab sandboxes.",
    documents: ["Corporate_Work_Order.pdf", "Curriculum_Mapping.xlsx"],
    reviewer: "Platform Operations"
  }
];

export const initialInternships = [
  {
    id: "int-1",
    title: "Full-Stack Software Engineering Internship",
    organization: "ValueLabs",
    type: "Official Internship",
    duration: "6 Months",
    stipend: "₹25,000 / month",
    seats: 35,
    applicants: 284,
    shortlisted: 42,
    status: "Active",
    deadline: "30 Nov 2026",
    mentor: "Kiran Nadar",
    location: "Hybrid (Hyderabad / Remote)",
    requirements: "Proficiency in JavaScript/TypeScript, React, Node.js, and relational databases. Final year B.Tech or MCA students.",
    responsibilities: "Build enterprise web apps, write unit tests, participate in daily agile standups and code reviews."
  },
  {
    id: "int-2",
    title: "Cloud Infrastructure & DevOps Intern",
    organization: "Deloitte USI",
    type: "Official Internship",
    duration: "6 Months",
    stipend: "₹30,000 / month",
    seats: 25,
    applicants: 410,
    shortlisted: 30,
    status: "Active",
    deadline: "15 Dec 2026",
    mentor: "Vikram Malhotra",
    location: "Onsite (Hyderabad / Bengaluru)",
    requirements: "Understanding of Linux, Docker, AWS fundamentals, and Python or Bash scripting.",
    responsibilities: "Assist in automating CI/CD pipelines, monitor cloud infrastructure, and document security baselines."
  },
  {
    id: "int-3",
    title: "AI & Computer Vision Research Intern",
    organization: "Mahindra University",
    type: "Research Internship",
    duration: "3 Months",
    stipend: "₹18,000 / month",
    seats: 12,
    applicants: 156,
    shortlisted: 18,
    status: "Review",
    deadline: "20 Nov 2026",
    mentor: "Dr. Sandeep Deshmukh",
    location: "Campus Labs (Hyderabad)",
    requirements: "PyTorch/TensorFlow, OpenCV, linear algebra, and prior project experience in object detection or segmentation.",
    responsibilities: "Implement state-of-the-art vision models, annotate benchmark datasets, and publish technical reports."
  },
  {
    id: "int-4",
    title: "Junior Cyber Incident Response Intern",
    organization: "Tanvox Technologies",
    type: "Occasional Internship",
    duration: "4 Months",
    stipend: "₹15,000 / month",
    seats: 10,
    applicants: 92,
    shortlisted: 12,
    status: "Draft",
    deadline: "10 Jan 2027",
    mentor: "Arun Varma",
    location: "Remote",
    requirements: "Network fundamentals, packet analysis with Wireshark, familiarity with common OWASP vulnerabilities.",
    responsibilities: "Review security logs, report anomalies to senior analysts, and draft vulnerability summaries."
  }
];

export const initialEvents = [
  {
    id: "evt-1",
    title: "TX Buildathon 2026: AI for India",
    type: "Hackathon",
    mode: "Online",
    date: "24 – 26 Nov 2026",
    registrations: 980,
    capacity: 1200,
    organization: "TX Hub Academy",
    status: "Upcoming",
    ticketPrice: "Free",
    prizes: "₹3,00,000 Prize Pool + Mentorship",
    speakers: "3 Industry CTOs & Venture Partners",
    description: "48-hour national hackathon challenging student developers to build AI solutions for healthcare, agriculture, and localized education.",
    venue: "Discord + Pathwing Live Coding Sandbox"
  },
  {
    id: "evt-2",
    title: "AWS Cloud Skills Immersion Day",
    type: "Workshop",
    mode: "Hybrid",
    date: "18 Nov 2026",
    registrations: 420,
    capacity: 500,
    organization: "Deloitte USI",
    status: "Registration open",
    ticketPrice: "Free",
    speakers: "AWS Principal Solution Architects",
    description: "Hands-on guided lab exploring serverless architectures with AWS Lambda, DynamoDB, and API Gateway with zero server setup.",
    venue: "Deloitte Learning Auditorium & Zoom"
  },
  {
    id: "evt-3",
    title: "Campus to Corporate Career Bootcamp",
    type: "Bootcamp",
    mode: "Onsite",
    date: "05 – 08 Dec 2026",
    registrations: 340,
    capacity: 400,
    organization: "KITS Warangal",
    status: "Upcoming",
    ticketPrice: "₹499 (Subsidized)",
    speakers: "HR Leaders from Top MNCs",
    description: "Four days of intensive resume workshops, technical mock interviews, behavioral coding questions, and direct recruiter networking.",
    venue: "KITS Silver Jubilee Seminar Hall"
  },
  {
    id: "evt-4",
    title: "Open Source AI & LLM Fine-Tuning Summit",
    type: "Webinar",
    mode: "Online",
    date: "15 Jan 2027",
    registrations: 670,
    capacity: 1000,
    organization: "Mahindra University",
    status: "Draft",
    ticketPrice: "Free",
    speakers: "Hugging Face & Open-Source Researchers",
    description: "Live walkthrough of parameter-efficient fine-tuning (LoRA / QLoRA) on open models for domain-specific conversational tasks.",
    venue: "Pathwing Live Stream"
  }
];

export const initialTrainingPrograms = [
  {
    id: "tp-1",
    title: "Enterprise Java Microservices Track",
    deliveryMode: "Online live",
    duration: "16 Weeks",
    batchesCount: 4,
    enrolledLearners: 180,
    organization: "KITS Warangal",
    status: "Active",
    mentor: "Dr. R. Ramana",
    curriculum: "Spring Boot, Docker, Kafka, AWS ECS deployment and real-time capstone project.",
    schedule: "Tue, Thu, Sat · 06:30 PM - 08:30 PM IST"
  },
  {
    id: "tp-2",
    title: "Corporate Cloud DevOps Accelerator",
    deliveryMode: "Hybrid",
    duration: "12 Weeks",
    batchesCount: 6,
    enrolledLearners: 320,
    organization: "Deloitte USI",
    status: "Active",
    mentor: "Vikram Patel",
    curriculum: "Terraform IaC, Kubernetes clusters, Jenkins & GitLab CI, Prometheus observability.",
    schedule: "Mon & Wed online, Sat onsite labs"
  },
  {
    id: "tp-3",
    title: "Full Stack Web Engineering Cohort",
    deliveryMode: "Online live",
    duration: "20 Weeks",
    batchesCount: 5,
    enrolledLearners: 250,
    organization: "TX Hub Academy",
    status: "Active",
    mentor: "Sunil Nambiar",
    curriculum: "TypeScript, React, Next.js, Node.js, GraphQL, PostgreSQL and system design.",
    schedule: "Mon to Fri · 07:00 PM - 09:00 PM IST"
  },
  {
    id: "tp-4",
    title: "Foundations of Cybersecurity & SOC Operations",
    deliveryMode: "Offline / onsite",
    duration: "8 Weeks",
    batchesCount: 2,
    enrolledLearners: 90,
    organization: "Tanvox Technologies",
    status: "Active",
    mentor: "Arun Varma",
    curriculum: "Network defense, SIEM configuration, vulnerability scanning, and red/blue team exercises.",
    schedule: "Weekends · 10:00 AM - 04:00 PM IST"
  }
];

export const initialCertificates = [
  {
    id: "cert-1",
    recipient: "Sai Teja Reddy",
    email: "saiteja.r@kitsw.pathwing.in",
    course: "Advanced Java Bootcamp",
    type: "Course completion",
    issueDate: "08 Oct 2026",
    certNumber: "PW-CERT-2026-8941",
    status: "Verified",
    grade: "Distinction (94%)",
    verifyingOrg: "KITS Warangal",
    hash: "0x8fa3...c912",
    issuedBy: "Dr. R. Ramana"
  },
  {
    id: "cert-2",
    recipient: "Ananya Iyer",
    email: "ananya.iyer@deloitte-usi.in",
    course: "Cloud Fundamentals & AWS Architecture",
    type: "Course completion",
    issueDate: "12 Oct 2026",
    certNumber: "PW-CERT-2026-9022",
    status: "Verified",
    grade: "First Class (88%)",
    verifyingOrg: "Deloitte USI",
    hash: "0x4be1...aa70",
    issuedBy: "Pooja Malhotra"
  },
  {
    id: "cert-3",
    recipient: "Manoj Kumar",
    email: "manoj.k@valuelabs.com",
    course: "Full-Stack Software Engineering Internship",
    type: "Internship completion",
    issueDate: "14 Oct 2026",
    certNumber: "PW-INT-2026-0312",
    status: "Pending Eligibility",
    grade: "Under Evaluation",
    verifyingOrg: "ValueLabs",
    hash: "Pending",
    issuedBy: "Kiran Nadar"
  },
  {
    id: "cert-4",
    recipient: "Deepika Sen",
    email: "deepika@txhub.org",
    course: "TX Buildathon 2026: AI for India",
    type: "Event participation & Winner",
    issueDate: "27 Sep 2026",
    certNumber: "PW-EVT-2026-1184",
    status: "Verified",
    grade: "1st Place Winner",
    verifyingOrg: "TX Hub Academy",
    hash: "0x12fc...3e99",
    issuedBy: "Evaluation Jury"
  }
];

export const initialBatches = [
  {
    id: "btc-1",
    code: "JAVA-2026-02",
    program: "Advanced Java Bootcamp",
    mentor: "Dr. R. Ramana",
    organization: "KITS Warangal",
    learners: 38,
    capacity: 40,
    startDate: "15 Sep 2026",
    endDate: "15 Dec 2026",
    schedule: "Mon, Wed, Fri · 05:00 PM IST",
    status: "Active",
    completionRate: "92%"
  },
  {
    id: "btc-2",
    code: "PFS-2026-03",
    program: "Full Stack Web Engineering Cohort",
    mentor: "Vikram Patel",
    organization: "TX Hub Academy",
    learners: 45,
    capacity: 50,
    startDate: "01 Oct 2026",
    endDate: "20 Feb 2027",
    schedule: "Tue, Thu, Sat · 07:00 PM IST",
    status: "Active",
    completionRate: "88%"
  },
  {
    id: "btc-3",
    code: "CLOUD-2026-01",
    program: "Corporate Cloud DevOps Accelerator",
    mentor: "Pooja Malhotra",
    organization: "Deloitte USI",
    learners: 50,
    capacity: 50,
    startDate: "20 Aug 2026",
    endDate: "10 Nov 2026",
    schedule: "Daily · 09:30 AM IST",
    status: "Near capacity",
    completionRate: "95%"
  },
  {
    id: "btc-4",
    code: "CYBER-2026-01",
    program: "Foundations of Cybersecurity",
    mentor: "Arun Varma",
    organization: "Tanvox Technologies",
    learners: 22,
    capacity: 30,
    startDate: "05 Nov 2026",
    endDate: "30 Dec 2026",
    schedule: "Weekends · 10:00 AM IST",
    status: "Active",
    completionRate: "Not started"
  }
];

export const initialPayments = [
  {
    id: "pay-1",
    txnId: "TXN_PW_984102948",
    customer: "KITS Warangal",
    type: "Tenant Subscription",
    amount: "₹4,50,000",
    numericAmount: 450000,
    platformFee: "₹1,31,850",
    payoutAmount: "₹3,18,150",
    gateway: "Razorpay Enterprise",
    date: "14 Oct 2026, 14:22",
    status: "Successful",
    settlementStatus: "Settled",
    invoiceId: "INV-2026-1049"
  },
  {
    id: "pay-2",
    txnId: "TXN_PW_884210391",
    customer: "Deloitte USI Learning",
    type: "Course Licensing Batch",
    amount: "₹12,80,000",
    numericAmount: 1280000,
    platformFee: "₹3,75,000",
    payoutAmount: "₹9,05,000",
    gateway: "Stripe Connect",
    date: "12 Oct 2026, 11:05",
    status: "Successful",
    settlementStatus: "Settled",
    invoiceId: "INV-2026-1048"
  },
  {
    id: "pay-3",
    txnId: "TXN_PW_772910482",
    customer: "Aarav Sharma",
    type: "Individual Course Purchase",
    amount: "₹4,999",
    numericAmount: 4999,
    platformFee: "₹1,499",
    payoutAmount: "₹3,500",
    gateway: "Razorpay UPI",
    date: "15 Oct 2026, 09:14",
    status: "Successful",
    settlementStatus: "Pending Settlement",
    invoiceId: "INV-2026-1050"
  },
  {
    id: "pay-4",
    txnId: "TXN_PW_662810394",
    customer: "Tanvox Technologies",
    type: "Seat Add-on Pack",
    amount: "₹75,000",
    numericAmount: 75000,
    platformFee: "₹22,000",
    payoutAmount: "₹53,000",
    gateway: "HDFC NetBanking",
    date: "10 Oct 2026, 16:45",
    status: "Successful",
    settlementStatus: "Settled",
    invoiceId: "INV-2026-1042"
  },
  {
    id: "pay-5",
    txnId: "TXN_PW_551910283",
    customer: "Student Refund - R. Gupta",
    type: "Course Refund",
    amount: "-₹4,999",
    numericAmount: -4999,
    platformFee: "-₹1,499",
    payoutAmount: "-₹3,500",
    gateway: "Razorpay Refund",
    date: "08 Oct 2026, 18:30",
    status: "Refunded",
    settlementStatus: "Reconciled",
    invoiceId: "REF-2026-0031"
  }
];

export const initialSubscriptions = [
  {
    id: "sub-1",
    planName: "Enterprise LMS",
    monthlyPrice: "₹3,99,000",
    annualBilling: true,
    maxSeats: "Unlimited (Custom)",
    activeOrganizations: 4,
    features: ["Dedicated tenant data boundary", "Custom domain & white-label branding", "SSO (SAML 2.0 / Okta / Azure AD)", "DRM Video Protection & CDN", "Direct API & Webhook access", "24/7 dedicated Technical Account Manager"],
    status: "Active"
  },
  {
    id: "sub-2",
    planName: "Professional",
    monthlyPrice: "₹1,49,000",
    annualBilling: true,
    maxSeats: "Up to 2,000 learners",
    activeOrganizations: 16,
    features: ["Multi-tenant isolation", "Custom subdomain", "Integrated payment gateway", "Coding sandbox & auto-grader", "Standard email/SMS notifications", "Business hours support SLA"],
    status: "Active"
  },
  {
    id: "sub-3",
    planName: "Basic",
    monthlyPrice: "₹49,000",
    annualBilling: false,
    maxSeats: "Up to 500 learners",
    activeOrganizations: 12,
    features: ["Pathwing shared domain", "Course catalog access", "Basic student progress reports", "Standard certificate generation", "Community support"],
    status: "Active"
  }
];

export const initialCoupons = [
  {
    id: "cpn-1",
    code: "WELCOME10",
    discount: "10%",
    discountType: "Percentage",
    validUntil: "31 Dec 2026",
    usageCount: 342,
    maxUsage: 1000,
    status: "Active",
    description: "Introductory 10% discount for all newly registered students across platform courses."
  },
  {
    id: "cpn-2",
    code: "CAMPUS500",
    discount: "₹500 OFF",
    discountType: "Fixed Amount",
    validUntil: "15 Nov 2026",
    usageCount: 180,
    maxUsage: 250,
    status: "Active",
    description: "Exclusive student subsidy for university campus partner enrollments."
  },
  {
    id: "cpn-3",
    code: "SUMMER26",
    discount: "25%",
    discountType: "Percentage",
    validUntil: "31 Aug 2026",
    usageCount: 500,
    maxUsage: 500,
    status: "Expired",
    description: "Seasonal summer discount promotion for full stack tracks."
  },
  {
    id: "cpn-4",
    code: "DIWALI2026",
    discount: "20%",
    discountType: "Percentage",
    validUntil: "10 Nov 2026",
    usageCount: 64,
    maxUsage: 500,
    status: "Active",
    description: "Festival learning promotion applicable to all live bootcamp registrations."
  }
];

export const initialSecurityEvents = [
  {
    id: "sec-1",
    timestamp: "16 Oct 2026, 09:42:18",
    actor: "Super Admin (sunil.n@pathwing.in)",
    action: "TENANT_SEAT_LIMIT_UPDATED",
    target: "TX Hub Academy (1200 -> 1500)",
    ip: "103.21.144.92",
    severity: "Medium",
    details: "Seat cap amendment initiated following contract upgrade request."
  },
  {
    id: "sec-2",
    timestamp: "16 Oct 2026, 08:15:02",
    actor: "System Watchdog",
    action: "SANDBOX_QUEUE_ALERT",
    target: "Code Execution Worker Pool 3",
    ip: "10.0.4.18",
    severity: "High",
    details: "Queue depth exceeded threshold (34 tasks). Auto-scaler spun up 4 additional runner instances."
  },
  {
    id: "sec-3",
    timestamp: "15 Oct 2026, 18:30:11",
    actor: "Org Admin (p.varma@deloitte.com)",
    action: "BATCH_ENROLLMENT_UPLOAD",
    target: "Deloitte USI (Batch CLOUD-2026-01)",
    ip: "165.225.106.45",
    severity: "Low",
    details: "Bulk CSV enrollment completed for 50 trainee accounts."
  },
  {
    id: "sec-4",
    timestamp: "15 Oct 2026, 14:02:44",
    actor: "Super Admin (sunil.n@pathwing.in)",
    action: "ROLE_PERMISSION_MODIFIED",
    target: "Role: Event Manager",
    ip: "103.21.144.92",
    severity: "Medium",
    details: "Added export attendance permission to Event Manager role matrix."
  },
  {
    id: "sec-5",
    timestamp: "14 Oct 2026, 11:20:00",
    actor: "Security Gateway",
    action: "FAILED_LOGIN_SPIKE_BLOCKED",
    target: "IP 185.220.101.5",
    ip: "185.220.101.5",
    severity: "Critical",
    details: "12 failed password attempts within 60s blocked by rate limiter."
  }
];

export const initialHelpdeskTickets = [
  {
    id: "hd-1",
    ticketId: "HD-1092",
    subject: "Course video DRM playback failure on Firefox",
    requester: "Aarav Sharma",
    role: "Student",
    tenant: "KITS Warangal",
    priority: "High",
    status: "Open",
    created: "15 Oct 2026",
    assignedTo: "Tech Support L2",
    description: "Videos in module 3 of Advanced Java Bootcamp show Widevine DRM decrypt error 403 on Firefox 128 under Linux/Ubuntu."
  },
  {
    id: "hd-2",
    ticketId: "HD-1090",
    subject: "Subdomain SSL certificate renewal assistance",
    requester: "Prof. S. N. Murthy",
    role: "Org Admin",
    tenant: "Anurag University",
    priority: "Medium",
    status: "In Progress",
    created: "14 Oct 2026",
    assignedTo: "DevOps Ops Team",
    description: "Requesting Let's Encrypt automated challenge configuration for campus LMS DNS records."
  },
  {
    id: "hd-3",
    ticketId: "HD-1088",
    subject: "Certificate grade rectification for capstone submission",
    requester: "Sai Teja Reddy",
    role: "Student",
    tenant: "KITS Warangal",
    priority: "Low",
    status: "Resolved",
    created: "12 Oct 2026",
    assignedTo: "Academic Verification",
    description: "Updated capstone project resubmitted and verified with mentor Dr. Ramana; grade revised to 94%."
  },
  {
    id: "hd-4",
    ticketId: "HD-1085",
    subject: "Tenant seat expansion request for upcoming semester",
    requester: "Kavita Reddy",
    role: "Org Admin",
    tenant: "TX Hub Academy",
    priority: "High",
    status: "In Progress",
    created: "10 Oct 2026",
    assignedTo: "Sunil Nambiar",
    description: "Current enrollment is at 1,190/1,200 seats. Requesting increase to 1,500 contracted seats."
  }
];

export const initialRoles = [
  {
    name: "Super Admin",
    description: "Full platform-wide governance, tenant management, and system administration.",
    usersCount: 3,
    permissions: {
      "Platform Tenants": ["View", "Create", "Edit", "Suspend"],
      "User Accounts": ["View", "Create", "Edit", "Delete", "Change Role"],
      "Courses & Moderation": ["View", "Review", "Approve", "Reject", "Publish"],
      "Billing & Revenue": ["View", "Reconcile", "Refund", "Export Reports"],
      "Governance & Security": ["View Audit", "Manage Roles", "System Config"]
    }
  },
  {
    name: "Organization Admin",
    description: "Tenant-scoped administration for users, assigned courses, batches and reports.",
    usersCount: 42,
    permissions: {
      "Platform Tenants": ["View Own Tenant", "Edit Profile"],
      "User Accounts": ["View Tenant Users", "Invite Learners", "Manage Mentors"],
      "Courses & Moderation": ["View Catalog", "Submit Courses", "View Analytics"],
      "Billing & Revenue": ["View Invoices", "Manage Plan"],
      "Governance & Security": ["View Tenant Audit Log"]
    }
  },
  {
    name: "Mentor",
    description: "Assigned course instruction, batch evaluation, and student feedback.",
    usersCount: 184,
    permissions: {
      "Platform Tenants": ["View Tenant Info"],
      "User Accounts": ["View Batch Students"],
      "Courses & Moderation": ["Edit Assigned Course", "Grade Assignments", "Host Classes"],
      "Billing & Revenue": ["View Instructor Payouts"],
      "Governance & Security": ["None"]
    }
  },
  {
    name: "Student",
    description: "Learning access to enrolled courses, batches, events, and certificates.",
    usersCount: 41208,
    permissions: {
      "Platform Tenants": ["View Enrolled Tenant"],
      "User Accounts": ["View Own Profile", "Edit Profile"],
      "Courses & Moderation": ["View Enrolled Courses", "Submit Code", "Take Quizzes"],
      "Billing & Revenue": ["View Own Receipts"],
      "Governance & Security": ["None"]
    }
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    name: "Course Enrollment Confirmation",
    channel: "Email & In-App",
    trigger: "Student enrolls in course",
    deliveryRate: "99.8%",
    status: "Enabled",
    subject: "Welcome to {{course_title}} on Pathwing",
    body: "Hi {{student_name}}, your enrollment in {{course_title}} is confirmed. Click here to open your learning dashboard."
  },
  {
    id: "notif-2",
    name: "Live Class Schedule Alert",
    channel: "SMS & In-App",
    trigger: "30 minutes before live class",
    deliveryRate: "98.4%",
    status: "Enabled",
    subject: "Live Class starting in 30 minutes",
    body: "Reminder: {{class_title}} with {{mentor_name}} starts at {{time}}. Join via Pathwing Live."
  },
  {
    id: "notif-3",
    name: "Moderation SLA Breach Alert",
    channel: "Email & Webhook",
    trigger: "Course in review > 48 hours",
    deliveryRate: "100%",
    status: "Enabled",
    subject: "[URGENT SLA] Course Review Pending Over 48h",
    body: "Attention Platform Admins: Course {{course_name}} has breached SLA and requires immediate reviewer assignment."
  },
  {
    id: "notif-4",
    name: "Certificate Issuance Notice",
    channel: "Email",
    trigger: "Certificate eligibility approved",
    deliveryRate: "99.2%",
    status: "Enabled",
    subject: "Congratulations! Your Verified Certificate is Ready",
    body: "Dear {{recipient_name}}, your completion certificate for {{course_name}} has been cryptographically verified and issued."
  }
];

export const initialPlatformSettings = {
  platformName: "Pathwing Platform Console",
  supportEmail: "ops@pathwing.in",
  supportPhone: "+91 40 6820 9000",
  defaultCurrency: "INR (₹)",
  slaReviewHours: 48,
  seatWarningThreshold: 90,
  twoFactorEnforced: true,
  maintenanceMode: false,
  autoApproveVerifiedMentors: false,
  drmProtectionEnabled: true
};
