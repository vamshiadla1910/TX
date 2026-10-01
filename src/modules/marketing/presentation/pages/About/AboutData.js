import {
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Code2,
  HeartHandshake,
  BriefcaseBusiness,
  Radio,
  Video,
  CalendarDays,
  Laptop,
  GraduationCap,
  Building2,
  Trophy,
  BadgeCheck,
  Rocket,
  Globe2,
} from "lucide-react";

export const HERO_STATS = [
  { icon: Users, value: "1000+", label: "Active Learners", bgClass: "stat-blue", iconColor: "#0284C7" },
  { icon: BookOpen, value: "Expert", label: "Mentors & Trainers", bgClass: "stat-teal", iconColor: "#0D9488" },
  { icon: Star, value: "100%", label: "Support & Guidance", bgClass: "stat-amber", iconColor: "#D97706" },
  { icon: TrendingUp, value: "Infinite", label: "Growth Opportunities", bgClass: "stat-purple", iconColor: "#9333EA" },
];

export const ORBIT_NODES = [
  { label: "Start", short: "Start", emoji: "💻", angle: 0 },
  { label: "Learning", short: "Learning", emoji: "🎓", angle: 60 },
  { label: "Practice", short: "Practice", emoji: "💪", angle: 120 },
  { label: "Projects", short: "Projects", emoji: "🚀", angle: 180 },
  { label: "Skills", short: "Skills", emoji: "⚡", angle: 240 },
  { label: "Career", short: "Career", emoji: "📈", angle: 300 },
];

export const PILLARS = [
  { icon: Code2, title: "Practical, Real-Time Learning", desc: "We prioritize building software over memorizing syntax. Our curriculum centers on real-world industry projects, live telemetry, and modern frameworks." },
  { icon: HeartHandshake, title: "Personalized 1-on-1 Mentorship", desc: "Every learner receives hands-on guidance from industry veterans, code reviews, and tailored learning tracks to ensure steady technical progress." },
  { icon: Users, title: "Vibrant Community of Creators", desc: "Surround yourself with passionate peers, join collaborative hackathons, and tap into an active alumni network thriving across top tech enterprises." },
  { icon: BriefcaseBusiness, title: "Dedicated Career Outcomes", desc: "From resume crafting and system design mock interviews to mega offline placement drives, we support your job search every step of the way." },
];

export const JOURNEY_MILESTONES = [
  { num: "01", title: "Foundations First", desc: "Master computational logic, data structures, and core web fundamentals with daily guided practice." },
  { num: "02", title: "Specialized Career Tracks", desc: "Choose MERN, Java Full Stack, Python with GenAI, or Cloud Engineering aligned with hiring demands." },
  { num: "03", title: "Portfolio Production", desc: "Build deployable full-stack apps with authentication, cloud persistence, and third-party APIs." },
  { num: "04", title: "Career Placement", desc: "Up to 16 months of placement support, AI mock rounds, and direct access to 1000+ hiring partners." },
];

export const OFFERING_CATEGORIES = [
  { id: "all", label: "All Offerings" },
  { id: "learning", label: "Learning Tracks" },
  { id: "experience", label: "Hands-on & Labs" },
  { id: "career", label: "Career & Credentials" },
];

export const ABOUT_OFFERINGS = [
  { id: "courses", category: "learning", icon: BookOpen, tag: "Self-Paced", title: "Courses", desc: "Industry-relevant online courses", details: "Structured self-paced modules across Full-Stack, AI, Cloud, and DevOps with hands-on practice quizzes and coding exercises.", theme: "theme-blue" },
  { id: "live-training", category: "learning", icon: Radio, tag: "Interactive", title: "Live Training", desc: "Interactive live classes with experts", details: "Direct instructor-led training with doubt-clearing sessions, live coding walkthroughs, and peer collaboration.", theme: "theme-green" },
  { id: "recorded-courses", category: "learning", icon: Video, tag: "On-Demand", title: "Recorded Courses", desc: "Learn at your own pace", details: "High-definition video lectures available 24/7 on demand with downloadable source codes and reference notes.", theme: "theme-red" },
  { id: "training-programs", category: "experience", icon: Users, tag: "Bootcamps", title: "Training Programs", desc: "Online, Offline, Hybrid modes", details: "Comprehensive multi-month bootcamps with flexible scheduling, continuous mentor reviews, and career assistance.", theme: "theme-purple" },
  { id: "internships", category: "experience", icon: BriefcaseBusiness, tag: "Real Experience", title: "Internships", desc: "Real-world work experience", details: "Work on production sprint cycles, submit pull requests, and earn verified internship credentials for your resume.", theme: "theme-orange" },
  { id: "events", category: "career", icon: CalendarDays, tag: "Community", title: "Events", desc: "Hackathons, webinars & more", details: "National-level hackathons, tech tech-talks from industry leaders, and weekend coding sprint competitions.", theme: "theme-cyan" },
  { id: "certifications", category: "career", icon: BadgeCheck, tag: "Verified", title: "Certifications", desc: "Industry-recognized certificates", details: "Cryptographically verified credentials with tamper-proof QR codes recognized by corporate hiring partners.", theme: "theme-yellow" },
  { id: "virtual-labs", category: "experience", icon: Laptop, tag: "Cloud Sandbox", title: "Virtual Labs", desc: "Hands-on practice environments", details: "Instant browser-based coding sandboxes for Python, Java, Linux, and Cloud—zero local software installation needed.", theme: "theme-indigo" },
];

export const OFFERING_STATS = [
  { icon: GraduationCap, value: "500+", label: "Courses" },
  { icon: Users, value: "50K+", label: "Students" },
  { icon: Building2, value: "100+", label: "Colleges & Institutions" },
  { icon: BadgeCheck, value: "200+", label: "Industry Experts" },
  { icon: BriefcaseBusiness, value: "1K+", label: "Internship Opportunities" },
  { icon: Trophy, value: "50+", label: "Events Conducted" },
];

export const MISSION_PILLARS = [
  { tag: "Outcome Driven", title: "Bridge Academic-Industry Gap", desc: "We replace outdated passive theory with modern full-stack workflows, system design foundations, and production-level code hygiene.", foot: "Real-world tools, CI/CD, and industry standards" },
  { tag: "Experiential Learning", title: "Live, Project-First Environments", desc: "Every learner architects and deploys complex microservices, scalable databases, and responsive web products under direct engineer mentorship.", foot: "1:1 mentor feedback & code quality reviews" },
  { tag: "Career Acceleration", title: "End-to-End Career Transition", desc: "From resume hardening and mock technical interviews to soft skills training and direct introductions to our hiring partner network.", foot: "Dedicated placement support & portfolio vetting" },
];

export const VISION_CARDS = [
  { icon: Users, tag: "Target Horizon", metric: "100,000+", heading: "Engineers Empowered", text: "Democratizing access to high-caliber software engineering careers across Tier-1, Tier-2, and Tier-3 institutions nationwide.", featured: false },
  { icon: Rocket, tag: "Strategic Core", metric: "Tier-1 Ready", heading: "Technological Capability", text: "Cultivating engineering excellence in modern distributed cloud systems, scalable architectures, full-stack craft, and generative AI.", featured: true },
  { icon: Globe2, tag: "Global Impact", metric: "Global Reach", heading: "Partner Credibility", text: "Establishing trusted relationships with premier technology employers, hyper-growth startups, and international enterprise innovators.", featured: false },
];
