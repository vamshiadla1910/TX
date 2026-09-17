import { useState } from "react";
import { ArrowRight, X, Search, Clock, Calendar, BookOpen } from "lucide-react";
import { LATEST_ARTICLES, FEATURED_ARTICLE } from "./txBlogData.js";
import "./BlogArticles.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop";

const LATEST_CURATED_ARTICLES = [
  {
    id: "art-1",
    tag: "Career",
    category: "Career",
    tagTheme: "tag-blue",
    title: "A Complete Guide to Career Planning for Students",
    description:
      "Learn how to set goals, build skills, and create a roadmap for a successful career.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&auto=format&fit=crop",
    author: "TX Career Advisory",
    authorRole: "Senior Career Mentor",
    readTime: "5 min read",
    date: "Sep 15, 2026",
    views: "2.8k",
    tags: ["CareerPlanning", "GoalSetting", "Roadmaps", "TechCareers"],
    keyTakeaways: [
      "Define your engineering specialization early to build deep portfolio depth.",
      "Pair college theoretical coursework with continuous coding practice.",
      "Engage with mentors and industry professionals through technical webinars.",
    ],
    content: `### Building a Future-Proof Roadmap
Career planning is not something you do the month before campus placement season. It is a systematic process of self-assessment, skill accumulation, and verifiable portfolio building.

#### 1. Identify Your Core Engineering Pillar
Whether your interest lies in Full-Stack Web Architecture, Cloud DevOps, AI/ML, or Cybersecurity, commit to one primary domain for at least two semesters before branching out.

#### 2. Pair Theory with In-Browser Execution
Textbook knowledge is quickly forgotten unless reinforced by live test-case execution and hands-on lab experiments. Make it a rule to write code every single day.`,
  },
  {
    id: "art-2",
    tag: "Internships",
    category: "Internships",
    tagTheme: "tag-green",
    title: "Top Benefits of Doing an Internship in College",
    description:
      "Discover how internships help you gain real-world experience and grow your career.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    author: "TX Internships Desk",
    authorRole: "Placement Partner Lead",
    readTime: "4 min read",
    date: "Sep 12, 2026",
    views: "3.4k",
    tags: ["Internships", "IndustryExperience", "Placements", "ResumeBoost"],
    keyTakeaways: [
      "Gain authentic agile sprint exposure and experience live pull-request reviews.",
      "Build tangible deliverables that prove technical ability beyond college grades.",
      "Cultivate professional networks that frequently convert to pre-placement offers.",
    ],
    content: `### Transforming Theory Into Workplace Competence
Internships are the ultimate bridge connecting undergraduate coursework with production engineering environments.

#### 1. Real Sprint Cycles & Code Reviews
Experiencing true agile sprints, pull request reviews, and peer critiques teaches professional collaboration that classrooms simply cannot replicate.

#### 2. Tangible Proof for Your Resume
Recruiters prioritize demonstrable milestones over GPA marks. An internship with documented deliverables and mentor verification stands out instantly.`,
  },
  {
    id: "art-3",
    tag: "Skills",
    category: "Skills",
    tagTheme: "tag-purple",
    title: "Essential Skills for a Tech Career in 2025",
    description:
      "Key technical and soft skills to stay ahead in the rapidly evolving tech industry.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    author: "TX Tech Advisory",
    authorRole: "Technical Curriculum Architect",
    readTime: "6 min read",
    date: "Sep 10, 2026",
    views: "4.1k",
    tags: ["TechSkills", "SystemDesign", "CloudSandboxes", "FullStack"],
    keyTakeaways: [
      "Master fundamentals like system design, data modeling, and RESTful APIs.",
      "Familiarize yourself with automated testing and containerized developer toolchains.",
      "Hone communication and problem-decomposition skills for team engineering.",
    ],
    content: `### Navigating the Modern Developer Toolchain
As engineering frameworks evolve, certain core fundamentals remain timeless.

#### 1. System Design & Algorithmic Problem Solving
Mastering clean data modeling, RESTful API design, and defensive error handling creates developers who can scale complex systems.

#### 2. Cloud Sandboxes & Virtual Environments
Familiarity with containerized workflows and automated deployment pipelines ensures you graduate ready for production environments.`,
  },
  {
    id: "art-4",
    tag: "Industry",
    category: "Industry",
    tagTheme: "tag-amber",
    title: "Top Tech Trends to Watch in 2025",
    description:
      "Explore the latest trends shaping the future of the tech industry.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop",
    author: "TX Industry Research",
    authorRole: "Chief Industry Liaison",
    readTime: "5 min read",
    date: "Sep 08, 2026",
    views: "3.9k",
    tags: ["TechTrends", "AgenticAI", "CloudComputing", "FutureOfWork"],
    keyTakeaways: [
      "Agentic AI is augmenting developer productivity while elevating the importance of architectural governance.",
      "Zero-trust cloud models and edge computation are redefining distributed applications.",
      "Verifiable digital credentials and portfolio proofs are overtaking traditional degrees.",
    ],
    content: `### Next-Generation Computing Paradigms
From agentic AI workflows to edge compute distribution, the technology landscape is experiencing rapid paradigm shifts.

#### 1. Agentic AI & Developer Pair Programming
Modern engineers leverage autonomous coding copilots to accelerate prototyping while maintaining strict architectural ownership.

#### 2. Decentralized & Verifiable Credentials
Industry hiring standards are rapidly shifting toward cryptographic credentials with instant verification QR codes.`,
  },
  {
    id: "art-5",
    tag: "Technology",
    category: "Technology",
    tagTheme: "tag-blue",
    title: "Mastering Problem Solving & In-Browser Code Execution",
    description:
      "Why practicing in an interactive code editor with real-time test cases builds real algorithmic confidence.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    author: "TX Tech Advisory",
    authorRole: "Platform Engineering Lead",
    readTime: "5 min read",
    date: "Sep 06, 2026",
    views: "3.7k",
    tags: ["Algorithms", "CodingPractice", "TestCases", "ProblemSolving"],
    keyTakeaways: [
      "Running code against hidden and public test cases uncovers critical edge conditions.",
      "Instant feedback eliminates guesswork and accelerates algorithmic thinking.",
      "Multi-language practice ensures you excel in any corporate technical screen.",
    ],
    content: `### Why Local Scripting Is Not Enough for Technical Interviews
Writing code on a local text editor without test suites often breeds false confidence. In campus hiring drives and technical screens, candidates must write code that satisfies both visible sample inputs and rigorous hidden test cases under time pressure.

#### The Power of In-Browser Coding Practice
The TX-Path-Wing coding platform directly integrates interactive editors into your student dashboard:
1. **Choose Your Language:** Seamlessly switch between Python, Java, JavaScript, C, C++, and SQL.
2. **Read Problem Constraints:** Understand input/output boundaries, expected time complexities, and corner scenarios.
3. **Execute & Debug Instantly:** Run against sample cases to inspect stdout/stderr in real time.
4. **Automated Test Suite Verification:** Submit your solution against hidden test cases that evaluate edge conditions.`,
  },
  {
    id: "art-6",
    tag: "Internships",
    category: "Internships",
    tagTheme: "tag-green",
    title: "Official vs. Occasional Internships: Choosing Your Track",
    description:
      "Understand the key differences between structured official internships and sprint-based project tracks.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    author: "TX Careers & Internships Team",
    authorRole: "Internship Coordinator",
    readTime: "5 min read",
    date: "Sep 04, 2026",
    views: "4.3k",
    tags: ["Internships", "CareerTrack", "ProjectDeliverables", "MentorReviews"],
    keyTakeaways: [
      "Official internships offer structured training, sprint reviews, and verified certificates.",
      "Occasional internships allow flexible, high-impact immersion during semester breaks.",
      "Both tracks culminate in authentic project deliverables recruiters value.",
    ],
    content: `### Demystifying Student Internships
Internships are often treated as simple resume checkboxes, but there is a major difference between passively observing a company and actively completing production tasks. The TX-Path-Wing platform structures internships into two distinct, high-impact pathways tailored for B.Tech and degree students:

#### 1. Official Structured Internships
An Official Internship follows a rigorous corporate pipeline:
- **Registration & Eligibility Screening:** Ensures candidates have foundational prerequisites for the target stack.
- **Structured Training Phase:** Refreshing required frameworks, API patterns, and design best practices.
- **Real-World Project Tasks:** You are assigned actual milestone tasks with sprint deadlines rather than toy tutorials.
- **Mentor Evaluation:** Regular code audits and feedback sessions with experienced software professionals.
- **Final Assessment & Verifiable Certificate:** Comprehensive practical evaluation leading to authenticated credentialing.`,
  },
  {
    id: "art-7",
    tag: "Virtual Labs",
    category: "Skills",
    tagTheme: "tag-purple",
    title: "Zero Setup, Total Focus: How Cloud Virtual Labs Work",
    description:
      "Eliminate environment bugs and practice directly in browser-based Linux, Python, and SQL sandboxes.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    author: "TX Cloud Infrastructure Desk",
    authorRole: "Cloud Systems Lead",
    readTime: "4 min read",
    date: "Sep 02, 2026",
    views: "3.5k",
    tags: ["VirtualLabs", "CloudSandboxes", "ZeroSetup", "HandsOn"],
    keyTakeaways: [
      "No broken local environments or OS driver conflicts.",
      "Clean sandboxes spin up instantly for databases, backend servers, and frontends.",
      "Consistent environments guarantee code runs identically for mentors and students.",
    ],
    content: `### Moving Past Broken Local Environments
Students often waste days troubleshooting dependency installations, version mismatches, and operating system incompatibilities before writing a single line of code. Cloud virtual labs provide instant pre-configured sandboxes in your browser.

#### The Advantages of Cloud Virtual Sandboxes
1. **Instant Environment Provisioning:** Jump straight into writing code without spending hours configuring local paths or database connections.
2. **Enterprise-Grade Consistency:** Work inside Linux and containerized setups identical to what top tech companies deploy in production.
3. **Seamless Mentor Collaboration:** Mentors can inspect runtime logs and evaluate code output directly without remote access friction.`,
  },
  {
    id: "art-8",
    tag: "Placements",
    category: "Career",
    tagTheme: "tag-amber",
    title: "Bridging the Campus-to-Corporate Placement Gap",
    description:
      "How moving from passive learning to verified portfolio projects turns textbook theory into job readiness.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    author: "TX Placement Advisory Desk",
    authorRole: "Placement Partner Director",
    readTime: "6 min read",
    date: "Aug 28, 2026",
    views: "5.2k",
    tags: ["Placements", "JobReadiness", "IndustryGap", "EngineeringCareers"],
    keyTakeaways: [
      "Hiring managers evaluate verifiable project deliverables over raw GPA marks.",
      "Pairing conceptual theory with daily hands-on implementation builds genuine interview fluency.",
      "Mentor code reviews mirror workplace engineering standards and elevate code quality.",
    ],
    content: `### The Reality of Modern Technical Recruitment
Every year, thousands of engineering and degree students graduate with solid report cards, yet struggle to clear initial technical rounds. Why does this gap exist? Traditional college curricula excel at delivering theoretical principles, but modern engineering teams build software under very different constraints: collaborative version control, automated unit tests, and production deployments.

#### Moving From Textbook Theory to Real Job Readiness
1. **Verifiable Proof Over Pure GPA:** Employers look for live Github repositories, deployed applications, and mentor code review history.
2. **Continuous Daily Practice:** Regular problem-solving inside timed sandboxes develops algorithmic instinct.
3. **Holistic Assessment:** Passing structured end-of-track evaluations proves workplace readiness from day one.`,
  },
];

const BlogArticles = ({ onSelectArticle }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterQuery, setFilterQuery] = useState("");

  // Combine curated articles and catalog articles
  const allArticlesList = [
    ...LATEST_CURATED_ARTICLES,
    {
      id: FEATURED_ARTICLE.id,
      tag: "Career",
      category: "Career",
      tagTheme: "tag-blue",
      title: FEATURED_ARTICLE.title,
      description: FEATURED_ARTICLE.shortDescription,
      image: FEATURED_ARTICLE.image,
      author: FEATURED_ARTICLE.author,
      authorRole: FEATURED_ARTICLE.authorRole,
      readTime: FEATURED_ARTICLE.readTime,
      date: FEATURED_ARTICLE.date,
      views: FEATURED_ARTICLE.views,
      tags: FEATURED_ARTICLE.tags,
      keyTakeaways: FEATURED_ARTICLE.keyTakeaways,
      content: FEATURED_ARTICLE.content,
    },
    ...LATEST_ARTICLES.map((a) => ({
      id: a.id,
      tag: a.category,
      category: a.category,
      tagTheme:
        a.category === "Internships"
          ? "tag-green"
          : a.category === "Technology & Coding"
          ? "tag-purple"
          : "tag-blue",
      title: a.title,
      description: a.shortDescription,
      image: a.image,
      author: a.author,
      authorRole: a.authorRole,
      readTime: a.readTime,
      date: a.date,
      views: a.views,
      tags: a.tags,
      keyTakeaways: a.keyTakeaways,
      content: a.content,
    })),
  ];

  const filteredArticles = allArticlesList.filter((item) => {
    const matchesCat =
      activeCategory === "All" ||
      item.tag.toLowerCase().includes(activeCategory.toLowerCase()) ||
      item.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesQ =
      !filterQuery ||
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <section id="articles" className="tx-blog-articles-section">
      <div className="tx-blog-articles-container">
        <div className="tx-blog-articles-header">
          <div>
            <div className="tx-section-tagline">
              <span className="tx-tagline-bar" />
              <span className="tx-tagline-label">FROM OUR BLOG</span>
            </div>
            <h2 className="tx-blog-articles-title">Latest Articles</h2>
            <p className="tx-blog-articles-subtitle">
              Stay informed with the newest guides, insights, and career tips.
            </p>
          </div>

          <button
            type="button"
            className="tx-view-articles-btn"
            onClick={() => setShowAllModal(true)}
          >
            <span>View All Articles</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Curated Article Cards */}
        <div className="tx-articles-grid-4">
          {LATEST_CURATED_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="tx-curated-card"
              onClick={() => onSelectArticle && onSelectArticle(article)}
            >
              <div className="tx-curated-img-wrap">
                <img
                  src={article.image}
                  alt={article.title}
                  className="tx-curated-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <span className={`tx-curated-tag ${article.tagTheme}`}>
                  {article.tag}
                </span>
              </div>

              <div className="tx-curated-content">
                <h3 className="tx-curated-title">{article.title}</h3>
                <p className="tx-curated-desc">{article.description}</p>
                <button
                  type="button"
                  className="tx-curated-read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectArticle) onSelectArticle(article);
                  }}
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          "VIEW ALL ARTICLES" MODAL DIRECTORY
      ────────────────────────────────────────────────────────── */}
      {showAllModal && (
        <div
          className="tx-modal-backdrop"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="tx-all-articles-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tx-all-articles-modal-head">
              <div>
                <div className="tx-section-tagline">
                  <span className="tx-tagline-bar" />
                  <span className="tx-tagline-label">ALL PUBLICATIONS</span>
                </div>
                <h2 className="tx-all-modal-title">
                  All Articles & Engineering Guides
                </h2>
                <p className="tx-all-modal-subtitle">
                  Explore tutorials, career roadmaps, and industry insights.
                </p>
              </div>
              <button
                type="button"
                className="tx-modal-close-btn"
                onClick={() => setShowAllModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls: Search & Category Chips */}
            <div className="tx-all-articles-controls">
              <div className="tx-all-search-wrap">
                <Search size={16} className="tx-all-search-icon" />
                <input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="tx-all-search-input"
                />
              </div>

              <div className="tx-all-category-chips">
                {["All", "Career", "Internships", "Skills", "Industry"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`tx-all-cat-chip ${
                        activeCategory === cat ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Articles Grid Inside Modal */}
            <div className="tx-all-articles-grid">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="tx-all-article-card"
                  onClick={() => {
                    setShowAllModal(false);
                    if (onSelectArticle) onSelectArticle(article);
                  }}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="tx-all-article-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  <div className="tx-all-article-meta">
                    <span className="tx-all-badge">{article.tag}</span>
                    <span className="tx-all-readtime">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>
                  <h4 className="tx-all-article-title">{article.title}</h4>
                  <p className="tx-all-article-desc">{article.description}</p>
                  <span className="tx-all-read-link">
                    Read Article <ArrowRight size={13} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogArticles;
