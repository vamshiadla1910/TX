/**
 * Initial Course Records for Institution Dashboard (KITS Warangal)
 */

export const initialCourses = [
  {
    id: 'CRS-01',
    title: 'Full Stack Engineering',
    category: 'SOFTWARE DEVELOPMENT',
    teacher: 'Meera Krishnan',
    learners: 680,
    progress: 76,
    color: 'blue',
    rating: 4.8,
    description: 'Comprehensive enterprise web development covering React, Node.js, RESTful APIs, relational databases, and modern cloud deployment pipelines.',
    modules: [
      'Modern Frontend Architecture with React',
      'Node.js & Express REST APIs',
      'Relational & NoSQL Database Design',
      'CI/CD & Cloud Deployment Pipelines'
    ],
    duration: '16 weeks',
    schedule: 'Mon & Wed · 10:00 - 12:00 IST',
    departments: ['CSE', 'IT']
  },
  {
    id: 'CRS-02',
    title: 'Cloud & DevOps Foundations',
    category: 'CLOUD COMPUTING',
    teacher: 'Arjun Menon',
    learners: 520,
    progress: 71,
    color: 'green',
    rating: 4.7,
    description: 'Hands-on training in cloud infrastructure, containerization with Docker and Kubernetes, and automated deployment practices.',
    modules: [
      'Cloud Architecture Essentials (AWS/Azure)',
      'Linux & Shell Automation',
      'Docker Containers & Kubernetes Orchestration',
      'Infrastructure as Code (Terraform)'
    ],
    duration: '14 weeks',
    schedule: 'Tue & Thu · 14:00 - 16:00 IST',
    departments: ['CSE', 'IT', 'ECE', 'EEE']
  },
  {
    id: 'CRS-03',
    title: 'Applied Data Engineering',
    category: 'DATA & AI',
    teacher: 'Nisha Rao',
    learners: 410,
    progress: 68,
    color: 'orange',
    rating: 4.6,
    description: 'Scalable data processing systems, ETL pipeline construction, Apache Spark, and enterprise data warehousing architectures.',
    modules: [
      'Python for Data Engineering',
      'SQL & Advanced Data Modeling',
      'Distributed Data Processing with Spark',
      'Data Pipeline Orchestration with Airflow'
    ],
    duration: '14 weeks',
    schedule: 'Mon & Fri · 15:00 - 17:00 IST',
    departments: ['CSE', 'ECE']
  },
  {
    id: 'CRS-04',
    title: 'Cybersecurity Essentials',
    category: 'SECURITY',
    teacher: 'Tanvox Technologies',
    learners: 320,
    progress: 63,
    color: 'red',
    rating: 4.5,
    description: 'Core cybersecurity practices including network security, vulnerability assessment, threat intelligence, and compliance requirements.',
    modules: [
      'Network Fundamentals & Cryptography',
      'Application Security & OWASP Top 10',
      'Vulnerability Assessment & Penetration Testing',
      'Security Compliance & Incident Response'
    ],
    duration: '12 weeks',
    schedule: 'Wed & Fri · 11:00 - 13:00 IST',
    departments: ['CSE', 'IT']
  },
  {
    id: 'CRS-05',
    title: 'AI & Machine Learning Systems',
    category: 'DATA & AI',
    teacher: 'Dr. Priya Venkat',
    learners: 280,
    progress: 74,
    color: 'blue',
    rating: 4.9,
    description: 'End-to-end machine learning pipelines, deep neural networks, LLM integration, and MLOps deployment architectures.',
    modules: [
      'Foundations of Machine Learning & Statistics',
      'Deep Neural Networks with PyTorch',
      'NLP & Large Language Model Workflows',
      'Model Deployment & MLOps Monitoring'
    ],
    duration: '16 weeks',
    schedule: 'Tue & Thu · 10:00 - 12:00 IST',
    departments: ['CSE', 'IT', 'ECE']
  },
  {
    id: 'CRS-06',
    title: 'Enterprise Mobile Engineering',
    category: 'SOFTWARE DEVELOPMENT',
    teacher: 'Rajesh Kannan',
    learners: 210,
    progress: 69,
    color: 'green',
    rating: 4.6,
    description: 'Cross-platform mobile application development with React Native, offline-first architectures, and mobile security patterns.',
    modules: [
      'Mobile UI Patterns with React Native',
      'State Management & Offline Storage',
      'Native Device APIs & Sensors',
      'Store Deployment & Performance Optimization'
    ],
    duration: '12 weeks',
    schedule: 'Mon & Wed · 14:00 - 16:00 IST',
    departments: ['CSE', 'IT']
  }
];
