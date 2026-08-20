// Mock user data — will be replaced by real backend calls
export const mockUser = {
  id: 1,
  name: 'Raj Chaudhary',
  firstName: 'Raj',
  email: 'raj@careermind.ai',
  avatar: null,
  targetRole: 'Backend Developer',
  currentRole: 'College Student',
  readinessScore: 78,
  careerXP: 2840,
  streak: 7,
  joinedDate: '2024-01-15',
};

export const mockSkills = [
  { id: 1, name: 'Python', level: 8, maxLevel: 10, category: 'Backend' },
  { id: 2, name: 'Django', level: 7, maxLevel: 10, category: 'Backend' },
  { id: 3, name: 'SQL', level: 8, maxLevel: 10, category: 'Database' },
  { id: 4, name: 'React', level: 6, maxLevel: 10, category: 'Frontend' },
  { id: 5, name: 'Docker', level: 3, maxLevel: 10, category: 'DevOps' },
  { id: 6, name: 'System Design', level: 4, maxLevel: 10, category: 'Architecture' },
  { id: 7, name: 'Git', level: 7, maxLevel: 10, category: 'Tools' },
  { id: 8, name: 'REST API', level: 8, maxLevel: 10, category: 'Backend' },
  { id: 9, name: 'PostgreSQL', level: 6, maxLevel: 10, category: 'Database' },
  { id: 10, name: 'JavaScript', level: 6, maxLevel: 10, category: 'Frontend' },
];

export const mockSkillGaps = [
  { id: 1, name: 'Docker', required: 8, current: 3, gap: 5, priority: 'high', category: 'DevOps', reason: 'Docker is required in 87% of Backend Developer job postings. It\'s essential for deployment workflows.' },
  { id: 2, name: 'System Design', required: 8, current: 4, gap: 4, priority: 'high', category: 'Architecture', reason: 'System Design is evaluated in almost every senior backend engineering interview.' },
  { id: 3, name: 'Redis', required: 6, current: 1, gap: 5, priority: 'high', category: 'Database', reason: 'Redis is widely used for caching and session management in production backend systems.' },
  { id: 4, name: 'AWS', required: 7, current: 2, gap: 5, priority: 'medium', category: 'Cloud', reason: 'Cloud infrastructure knowledge is increasingly expected in backend roles.' },
  { id: 5, name: 'Testing', required: 7, current: 3, gap: 4, priority: 'medium', category: 'Quality', reason: 'Writing tests demonstrates professional software development discipline.' },
  { id: 6, name: 'CI/CD', required: 6, current: 2, gap: 4, priority: 'medium', category: 'DevOps', reason: 'Automation pipelines are standard in modern engineering teams.' },
  { id: 7, name: 'Kubernetes', required: 5, current: 1, gap: 4, priority: 'low', category: 'DevOps', reason: 'Container orchestration is valuable for senior backend engineers.' },
  { id: 8, name: 'GraphQL', required: 5, current: 2, gap: 3, priority: 'low', category: 'API', reason: 'GraphQL is growing in adoption for flexible API design.' },
];

export const mockRoadmap = {
  weeks: [
    {
      week: 1,
      focus: 'Docker Fundamentals',
      tasks: [
        { id: 1, type: 'course', title: 'Docker for Python Developers', platform: 'YouTube', duration: '4h', status: 'in-progress', skillsGained: ['Docker', 'Containers'] },
        { id: 2, type: 'build', title: 'Dockerize your Django API', duration: '3h', status: 'pending', skillsGained: ['Docker', 'Django'] },
        { id: 3, type: 'prove', title: 'Push Docker project to GitHub', duration: '1h', status: 'pending', skillsGained: ['Git', 'Docker'] },
      ]
    },
    {
      week: 2,
      focus: 'Redis & Caching',
      tasks: [
        { id: 4, type: 'course', title: 'Redis Crash Course', platform: 'YouTube', duration: '3h', status: 'pending', skillsGained: ['Redis', 'Caching'] },
        { id: 5, type: 'build', title: 'Add Redis caching to Django views', duration: '4h', status: 'pending', skillsGained: ['Redis', 'Django', 'Performance'] },
      ]
    },
    {
      week: 3,
      focus: 'Testing & Quality',
      tasks: [
        { id: 6, type: 'course', title: 'Django Testing Best Practices', platform: 'TestDriven.io', duration: '6h', status: 'pending', skillsGained: ['Testing', 'Django'] },
        { id: 7, type: 'build', title: 'Write tests for your API endpoints', duration: '5h', status: 'pending', skillsGained: ['Testing', 'Django'] },
      ]
    },
    {
      week: 4,
      focus: 'System Design Basics',
      tasks: [
        { id: 8, type: 'course', title: 'System Design Interview Prep', platform: 'Educative.io', duration: '8h', status: 'pending', skillsGained: ['System Design', 'Architecture'] },
        { id: 9, type: 'build', title: 'Design a URL shortener system', duration: '3h', status: 'pending', skillsGained: ['System Design'] },
      ]
    },
  ]
};

export const mockCareerPaths = [
  { id: 1, role: 'Backend Developer', match: 86, current: 78, icon: '⚙️', color: '#6366f1', skills: ['Python', 'Django', 'SQL', 'Docker', 'REST API'] },
  { id: 2, role: 'Full Stack Developer', match: 74, current: 65, icon: '🖥️', color: '#8b5cf6', skills: ['React', 'Django', 'JavaScript', 'PostgreSQL'] },
  { id: 3, role: 'AI Engineer', match: 68, current: 55, icon: '🤖', color: '#3b82f6', skills: ['Python', 'ML', 'TensorFlow', 'Data Processing'] },
  { id: 4, role: 'Data Scientist', match: 62, current: 50, icon: '📊', color: '#14b8a6', skills: ['Python', 'ML', 'Statistics', 'Pandas', 'SQL'] },
  { id: 5, role: 'DevOps Engineer', match: 45, current: 38, icon: '🚀', color: '#f59e0b', skills: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Kubernetes'] },
  { id: 6, role: 'Cybersecurity', match: 38, current: 30, icon: '🔐', color: '#ef4444', skills: ['Networking', 'Python', 'Security', 'Linux'] },
];

export const mockCourses = [
  // C / C++ / DSA
  { id: 1, title: 'C++ Placement Course', provider: 'Apna College', type: 'youtube', skill: 'C++ & DSA', duration: '50h', level: 'Beginner', match: 99, why: 'Essential for passing top product-based company coding rounds.', badge: 'Must Watch', url: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6BWCBWcqShw1wK4' },
  { id: 2, title: 'C Language Tutorial for Beginners', provider: 'CodeWithHarry', type: 'youtube', skill: 'C', duration: '15h', level: 'Beginner', match: 95, why: 'Best for absolute beginners to understand memory and pointers.', badge: 'Foundation', url: 'https://www.youtube.com/watch?v=ZSPZob_1TOk' },
  { id: 3, title: 'DSA in C++ / Java (A to Z)', provider: 'Take U Forward (Striver)', type: 'youtube', skill: 'DSA', duration: '100h+', level: 'Intermediate', match: 98, why: 'The most recommended DSA sheet and playlist by Google engineers.', badge: 'Top Priority', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
  { id: 4, title: 'DSA Complete Placement Series', provider: 'Love Babbar', type: 'youtube', skill: 'DSA', duration: '80h', level: 'Intermediate', match: 96, why: 'Highly practical problem-solving approach for interviews.', badge: 'Popular', url: 'https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA' },
  { id: 5, title: 'CS50: Intro to Computer Science', provider: 'Harvard University (edX)', type: 'certificate', skill: 'CS Fundamentals', duration: '12 Weeks', level: 'Beginner', match: 95, why: 'The gold standard for CS fundamentals. Free certificate available.', badge: 'High Impact', url: 'https://pll.harvard.edu/course/cs50-introduction-computer-science' },

  // Web Dev (Frontend + Backend)
  { id: 6, title: 'Web Development in One Video', provider: 'CodeWithHarry', type: 'youtube', skill: 'HTML/CSS/JS', duration: '10h', level: 'Beginner', match: 94, why: 'A complete crash course to start building web pages.', badge: 'Quick Win', url: 'https://www.youtube.com/watch?v=6mbwJ2xhgzM' },
  { id: 7, title: 'React JS Course in Hindi', provider: 'Thapa Technical', type: 'youtube', skill: 'React', duration: '40h', level: 'Intermediate', match: 92, why: 'Deep dive into React with real-world projects.', badge: 'Frontend', url: 'https://www.youtube.com/playlist?list=PLwGdqUZWnOp3aROg4wypcRhZqJG3ajZWJ' },
  { id: 8, title: 'Chai aur React', provider: 'Hitesh Choudhary', type: 'youtube', skill: 'React', duration: '20h', level: 'Intermediate', match: 95, why: 'Industry-standard React development practices.', badge: 'Highly Recommended', url: 'https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige' },
  { id: 9, title: 'JavaScript Mastery (MERN)', provider: 'Sheryians Coding School', type: 'youtube', skill: 'MERN Stack', duration: '30h', level: 'Advanced', match: 90, why: 'Master modern frontend animations and full-stack integration.', badge: 'Trending', url: 'https://www.youtube.com/@SheryiansCodingSchool/playlists' },
  { id: 10, title: 'Backend Development and APIs', provider: 'FreeCodeCamp', type: 'certificate', skill: 'Node.js & APIs', duration: '300h', level: 'Intermediate', match: 88, why: 'Earn a highly respected free certificate by building real projects.', badge: 'Free Certificate', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/' },

  // Python & Data Science & ML
  { id: 11, title: 'Python in 100 Days', provider: 'CodeWithHarry', type: 'youtube', skill: 'Python', duration: '50h', level: 'Beginner', match: 96, why: 'Daily consistency and practical projects for Python mastery.', badge: 'Must Watch', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg' },
  { id: 12, title: 'Machine Learning Crash Course', provider: 'Google', type: 'certificate', skill: 'Machine Learning', duration: '15h', level: 'Advanced', match: 85, why: 'Official Google course to transition into AI Engineering.', badge: 'Google Certified', url: 'https://developers.google.com/machine-learning/crash-course' },
  { id: 13, title: 'Data Science & AI Certification', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Data Science', duration: '20h', level: 'Intermediate', match: 88, why: 'Earn an IBM badge while learning data science fundamentals.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/data-and-ai' },
  { id: 14, title: 'Deep Learning with PyTorch', provider: 'FreeCodeCamp', type: 'youtube', skill: 'PyTorch / AI', duration: '25h', level: 'Advanced', match: 80, why: 'Comprehensive deep learning guide for modern AI.', badge: 'Advanced AI', url: 'https://www.youtube.com/watch?v=GIsg-ZUy0MY' },

  // DevOps & Cloud
  { id: 15, title: 'DevOps Bootcamp', provider: 'Kunal Kushwaha', type: 'youtube', skill: 'DevOps (Docker/CI)', duration: '60h', level: 'Intermediate', match: 95, why: 'The best free resource for DevOps, covering Git, Docker, Kubernetes.', badge: 'Top Rated', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ' },
  { id: 16, title: 'Cloud Computing Fundamentals', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Cloud/AWS', duration: '8h', level: 'Beginner', match: 91, why: 'Earn a recognized IBM badge. Great for adding cloud skills to your resume.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/cloud-computing' },
  { id: 17, title: 'AWS Certified Cloud Practitioner', provider: 'FreeCodeCamp', type: 'youtube', skill: 'AWS', duration: '14h', level: 'Intermediate', match: 85, why: 'Prepare for the official AWS certification exam.', badge: 'AWS Prep', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc' },
  
  // Databases
  { id: 18, title: 'SQL Tutorial for Beginners', provider: 'Programming with Mosh', type: 'youtube', skill: 'SQL', duration: '3h', level: 'Beginner', match: 88, why: 'Quickest way to master relational databases.', badge: 'Quick Win', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA' },
  { id: 19, title: 'MongoDB Crash Course', provider: 'Traversy Media', type: 'youtube', skill: 'NoSQL / MongoDB', duration: '1.5h', level: 'Beginner', match: 82, why: 'Learn the most popular NoSQL database for modern stacks.', badge: 'Popular', url: 'https://www.youtube.com/watch?v=-56x56UppqQ' },

  // System Design & OS & Networks
  { id: 20, title: 'Operating Systems & DBMS', provider: 'Gate Smashers', type: 'youtube', skill: 'Core CS Subjects', duration: '25h', level: 'Intermediate', match: 93, why: 'Extremely crucial for cracking technical interviews.', badge: 'Interview Prep', url: 'https://www.youtube.com/c/GateSmashers' },
  { id: 21, title: 'System Design Interview Prep', provider: 'Gaurav Sen', type: 'youtube', skill: 'System Design', duration: '10h', level: 'Advanced', match: 94, why: 'Learn how massive systems like WhatsApp and Netflix are built.', badge: 'High Impact', url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-G6XIQQO1' },
  { id: 22, title: 'Computer Networks', provider: 'Neso Academy', type: 'youtube', skill: 'Networking', duration: '30h', level: 'Intermediate', match: 89, why: 'Understand TCP/IP, OSI, and internet protocols fundamentally.', badge: 'Core CS', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAGOsZR_M5ZgN2G_P2S' },

  // Version Control
  { id: 23, title: 'Introduction to Git and GitHub', provider: 'Coursera (Google)', type: 'certificate', skill: 'Git', duration: '18h', level: 'Beginner', match: 95, why: 'Learn version control from Google engineers.', badge: 'Google Cert', url: 'https://www.coursera.org/learn/introduction-git-github' },
  { id: 24, title: 'Git & GitHub Tutorial', provider: 'Apna College', type: 'youtube', skill: 'Git', duration: '1h', level: 'Beginner', match: 92, why: 'Quick and practical Git tutorial for freshers.', badge: 'Quick Win', url: 'https://www.youtube.com/watch?v=Ez8F0nW6S-w' },

  // Interactive Coding & Platforms
  { id: 25, title: 'LeetCode Top 100 Liked Questions', provider: 'LeetCode', type: 'interactive', skill: 'DSA Practice', duration: '100+ Probs', level: 'Intermediate', match: 98, why: 'Direct practice for real interview questions.', badge: 'Practice', url: 'https://leetcode.com/problem-list/top-100-liked-questions/' },
  { id: 26, title: 'HackerRank Problem Solving', provider: 'HackerRank', type: 'interactive', skill: 'Logic Building', duration: 'Ongoing', level: 'Beginner', match: 90, why: 'Great platform to build basic logical thinking.', badge: 'Beginner Friendly', url: 'https://www.hackerrank.com/domains/algorithms' },
  { id: 27, title: 'SQL Practice Platform', provider: 'SQLBolt', type: 'interactive', skill: 'SQL', duration: 'Interactive', level: 'Beginner', match: 85, why: 'Learn SQL through interactive browser exercises.', badge: 'Interactive', url: 'https://sqlbolt.com/' },

  // More Specializations
  { id: 28, title: 'Java Placement Course', provider: 'Apna College', type: 'youtube', skill: 'Java', duration: '40h', level: 'Beginner', match: 93, why: 'Enterprise standard language for backend and Android.', badge: 'Essential', url: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop' },
  { id: 29, title: 'Cybersecurity Fundamentals', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Security', duration: '10h', level: 'Beginner', match: 80, why: 'Security is critical. Earn a badge while learning basics.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/cybersecurity' },
  { id: 30, title: 'React Native for Mobile App Dev', provider: 'Programming with Mosh', type: 'youtube', skill: 'Mobile Dev', duration: '2h', level: 'Intermediate', match: 75, why: 'Build mobile apps using React skills.', badge: 'Mobile', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
  { id: 31, title: 'Responsive Web Design', provider: 'FreeCodeCamp', type: 'certificate', skill: 'HTML/CSS', duration: '300h', level: 'Beginner', match: 88, why: 'The most thorough HTML/CSS course with a certificate.', badge: 'Free Certificate', url: 'https://www.freecodecamp.org/learn/responsive-web-design/' },
  { id: 32, title: 'TypeScript Crash Course', provider: 'Traversy Media', type: 'youtube', skill: 'TypeScript', duration: '1.5h', level: 'Intermediate', match: 85, why: 'Industry standard for scaling JavaScript applications.', badge: 'Skill Builder', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs' },
  { id: 33, title: 'Next.js 14 Full Course', provider: 'JavaScript Mastery', type: 'youtube', skill: 'Next.js', duration: '5h', level: 'Advanced', match: 90, why: 'Learn the most popular React framework for production apps.', badge: 'Trending', url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' },
  { id: 34, title: 'Spring Boot Tutorial', provider: 'Telusko', type: 'youtube', skill: 'Java / Spring', duration: '12h', level: 'Intermediate', match: 85, why: 'Best way to learn enterprise Java backend development.', badge: 'Enterprise', url: 'https://www.youtube.com/playlist?list=PLsyeobzWxl7pUIq3F7A2s-l1Znd6s0K4H' },
  { id: 35, title: 'Django REST Framework', provider: 'Dennis Ivy', type: 'youtube', skill: 'Python / DRF', duration: '3h', level: 'Intermediate', match: 87, why: 'Build professional REST APIs in Python.', badge: 'Backend', url: 'https://www.youtube.com/watch?v=c708Nf0qCF4' },
  { id: 36, title: 'Data Structures and Algorithms', provider: 'Coursera (UCSD)', type: 'certificate', skill: 'DSA', duration: '6 Months', level: 'Intermediate', match: 94, why: 'Highly prestigious specialization for mastering DSA.', badge: 'University Cert', url: 'https://www.coursera.org/specializations/data-structures-algorithms' },
  { id: 37, title: 'Go / Golang Crash Course', provider: 'FreeCodeCamp', type: 'youtube', skill: 'Golang', duration: '7h', level: 'Beginner', match: 70, why: 'Learn the language of modern cloud infrastructure.', badge: 'High Paying', url: 'https://www.youtube.com/watch?v=YS4e4q9oBaU' },
  { id: 38, title: 'Rust Tutorial', provider: 'Let\'s Get Rusty', type: 'youtube', skill: 'Rust', duration: '4h', level: 'Intermediate', match: 65, why: 'Learn memory-safe, blazing fast systems programming.', badge: 'Niche', url: 'https://www.youtube.com/watch?v=MsocPEZBd-M' },
  { id: 39, title: 'Blockchain & Web3 Fundamentals', provider: 'FreeCodeCamp', type: 'youtube', skill: 'Web3', duration: '32h', level: 'Advanced', match: 60, why: 'Comprehensive guide to smart contracts and blockchain.', badge: 'Web3', url: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ' },
  { id: 40, title: 'Figma UI/UX Design', provider: 'DesignCourse', type: 'youtube', skill: 'UI/UX', duration: '3h', level: 'Beginner', match: 72, why: 'Every dev should know basic design principles.', badge: 'Design', url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' },
  { id: 41, title: 'Agile & Scrum Methodologies', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Agile', duration: '5h', level: 'Beginner', match: 80, why: 'Learn how modern software teams actually work.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/agile' },
  { id: 42, title: 'Frontend Interview Prep (Namaste JS)', provider: 'Akshay Saini', type: 'youtube', skill: 'JS Internals', duration: '15h', level: 'Advanced', match: 96, why: 'Must-watch for cracking frontend interviews.', badge: 'Top Priority', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP' },
  { id: 43, title: 'Backend Engineering Roadmap', provider: 'Hussein Nasser', type: 'youtube', skill: 'Backend Arch', duration: '20h', level: 'Advanced', match: 95, why: 'Deep insights into networking, proxies, and backend protocols.', badge: 'Architecture', url: 'https://www.youtube.com/c/HusseinNasser-software-engineering' },
  { id: 44, title: 'Complete Linux Course', provider: 'NetworkChuck', type: 'youtube', skill: 'Linux', duration: '8h', level: 'Beginner', match: 88, why: 'Linux is the backbone of servers. Essential for all devs.', badge: 'Essential', url: 'https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13CbqS-hq0_MI' },
  { id: 45, title: 'Prompt Engineering for Developers', provider: 'DeepLearning.AI', type: 'certificate', skill: 'AI/LLM', duration: '2h', level: 'Beginner', match: 90, why: 'Learn how to integrate LLMs effectively into your apps.', badge: 'AI Edge', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' },
  { id: 46, title: 'IBM SkillsBuild Free Courses (For Students)', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'AI, Cloud & Security', duration: 'Self-paced', level: 'Beginner', match: 95, why: 'Access 1000+ free courses and earn professional IBM digital badges.', badge: 'Free Access', url: 'https://skillsbuild.org' },
  { id: 47, title: 'Artificial Intelligence Fundamentals', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'AI/ML', duration: '10h', level: 'Beginner', match: 92, why: 'Learn the basics of AI, NLP, and machine learning from IBM experts.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/artificial-intelligence' },
  { id: 48, title: 'Data Analytics Fundamentals', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Data Analytics', duration: '12h', level: 'Beginner', match: 89, why: 'Understand data analysis, visualization, and big data basics.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/data-and-ai' },
  { id: 49, title: 'Cybersecurity Fundamentals (Advanced)', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Cybersecurity', duration: '15h', level: 'Intermediate', match: 88, why: 'Deepen your knowledge of network security and cyber threats.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/cybersecurity' },
  { id: 50, title: 'Enterprise Design Thinking', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Design Thinking', duration: '5h', level: 'Beginner', match: 85, why: 'Learn IBM\'s framework for solving complex problems creatively.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/professional-skills' },
  { id: 51, title: 'Professional Workplace Skills', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Soft Skills', duration: '8h', level: 'Beginner', match: 90, why: 'Master communication, teamwork, and problem-solving in a corporate environment.', badge: 'Essential', url: 'https://skillsbuild.org/adults/explore-learning/professional-skills' },
  { id: 52, title: 'Blockchain Fundamentals', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Web3/Blockchain', duration: '6h', level: 'Beginner', match: 82, why: 'Understand distributed ledgers and how enterprise blockchain works.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/emerging-tech' },
  { id: 53, title: 'Cloud Computing Architecture', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Cloud', duration: '14h', level: 'Intermediate', match: 91, why: 'Learn how to design scalable and secure cloud infrastructure.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/cloud-computing' },
  { id: 54, title: 'Agile Explorer', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Agile/Scrum', duration: '6h', level: 'Beginner', match: 87, why: 'Understand Agile principles and how modern software teams operate.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/agile' },
  { id: 55, title: 'Python for Data Science', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Python', duration: '20h', level: 'Intermediate', match: 94, why: 'Hands-on Python course specifically focused on data manipulation.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/data-and-ai' },
  { id: 56, title: 'Web Development Explorer', provider: 'IBM SkillsBuild', type: 'certificate', skill: 'Frontend', duration: '10h', level: 'Beginner', match: 86, why: 'Learn basics of HTML, CSS, JavaScript from an enterprise perspective.', badge: 'IBM Badge', url: 'https://skillsbuild.org/adults/explore-learning/web-development' },
];

export const mockJobs = [
  { id: 1, title: 'Backend Developer', company: 'Flipkart', location: 'Bangalore, India', type: 'Full-time', match: 87, salary: '₹12-18 LPA', skillsMatch: ['Python', 'Django', 'SQL', 'REST API'], skillsGap: ['Docker', 'AWS'], posted: '2 days ago' },
  { id: 2, title: 'Python Developer', company: 'Razorpay', location: 'Remote', type: 'Full-time', match: 82, salary: '₹10-16 LPA', skillsMatch: ['Python', 'Django', 'PostgreSQL', 'Git'], skillsGap: ['Redis', 'Testing'], posted: '1 day ago' },
  { id: 3, title: 'Junior Backend Engineer', company: 'Zomato', location: 'Gurgaon, India', type: 'Full-time', match: 79, salary: '₹8-12 LPA', skillsMatch: ['Python', 'SQL', 'REST API'], skillsGap: ['Docker', 'System Design'], posted: '3 days ago' },
  { id: 4, title: 'API Developer', company: 'Atlassian', location: 'Remote', type: 'Contract', match: 74, salary: '₹15-22 LPA', skillsMatch: ['Python', 'Django', 'REST API'], skillsGap: ['Docker', 'AWS', 'CI/CD'], posted: '5 days ago' },
  { id: 5, title: 'Software Engineer - Backend', company: 'Swiggy', location: 'Bangalore, India', type: 'Full-time', match: 71, salary: '₹12-20 LPA', skillsMatch: ['Python', 'SQL'], skillsGap: ['System Design', 'Redis', 'AWS'], posted: '1 week ago' },
];

export const mockProjects = [
  { id: 1, title: 'Dockerized Django REST API', skills: ['Django', 'Docker', 'PostgreSQL', 'REST API'], difficulty: 'Intermediate', impact: 'High', duration: '1 week', description: 'Build and containerize a production-ready Django REST API with Docker Compose, PostgreSQL, and nginx.', milestones: ['Set up Django project', 'Create REST API endpoints', 'Write Docker Compose config', 'Add PostgreSQL service', 'Deploy locally'] },
  { id: 2, title: 'Real-time Chat App with Redis', skills: ['Django', 'Redis', 'WebSockets', 'React'], difficulty: 'Advanced', impact: 'High', duration: '2 weeks', description: 'Build a scalable real-time chat application using Django Channels, Redis as message broker, and React frontend.', milestones: ['Set up Django Channels', 'Configure Redis', 'Build WebSocket consumer', 'Create React chat UI', 'Add message persistence'] },
  { id: 3, title: 'URL Shortener with Analytics', skills: ['Python', 'Django', 'SQL', 'Redis'], difficulty: 'Beginner', impact: 'Medium', duration: '3 days', description: 'Create a URL shortener service with click tracking, analytics dashboard, and Redis caching for performance.', milestones: ['Design database schema', 'Build shortening API', 'Add Redis caching', 'Create analytics endpoints', 'Build simple UI'] },
  { id: 4, title: 'CI/CD Pipeline for Django App', skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Python'], difficulty: 'Intermediate', impact: 'High', duration: '1 week', description: 'Set up a complete CI/CD pipeline with GitHub Actions that tests, builds Docker image, and deploys your app.', milestones: ['Write GitHub Actions workflow', 'Add test automation', 'Configure Docker build', 'Set up deployment', 'Add status badges'] },
];

export const mockGitHub = {
  username: 'rajchaudhary',
  strength: 71,
  repos: 12,
  commits: 187,
  stars: 23,
  languages: [
    { name: 'Python', percentage: 58, color: '#3572A5' },
    { name: 'JavaScript', percentage: 25, color: '#f1e05a' },
    { name: 'HTML', percentage: 10, color: '#e34c26' },
    { name: 'CSS', percentage: 7, color: '#563d7c' },
  ],
  metrics: [
    { label: 'Code Quality', score: 82, description: 'Based on structure, naming conventions and complexity' },
    { label: 'Documentation', score: 63, description: 'README files, comments, and inline docs' },
    { label: 'Testing', score: 55, description: 'Test coverage and test file presence' },
    { label: 'Consistency', score: 78, description: 'Commit frequency and contribution consistency' },
    { label: 'Portfolio Strength', score: 74, description: 'Project diversity and impact' },
  ],
  repos_list: [
    { name: 'careermind-backend', description: 'AI-powered career platform backend with Django', stars: 12, language: 'Python', updated: '2 days ago' },
    { name: 'django-ecommerce-api', description: 'Full-featured e-commerce REST API', stars: 8, language: 'Python', updated: '1 week ago' },
    { name: 'react-portfolio', description: 'Personal portfolio website', stars: 3, language: 'JavaScript', updated: '2 weeks ago' },
  ]
};

export const mockResume = {
  score: 72,
  ats: 68,
  skillRelevance: 81,
  projectStrength: 76,
  impactStatements: 58,
  roleAlignment: 74,
  evidenceConsistency: 82,
};

export const mockInterviewHistory = [
  { id: 1, role: 'Backend Developer', type: 'Technical', score: 74, date: '2024-01-20', technical: 81, communication: 69, problemSolving: 76, clarity: 72, confidence: 68 },
];

export const mockRadarData = [
  { subject: 'Technical', A: 78, fullMark: 100 },
  { subject: 'Projects', A: 72, fullMark: 100 },
  { subject: 'Problem Solving', A: 75, fullMark: 100 },
  { subject: 'Communication', A: 60, fullMark: 100 },
  { subject: 'Interview', A: 65, fullMark: 100 },
  { subject: 'Cloud', A: 30, fullMark: 100 },
  { subject: 'AI/ML', A: 45, fullMark: 100 },
];

export const mockAchievements = [
  { id: 1, title: 'First Career Analysis', icon: '🎯', earned: true, date: '2024-01-15' },
  { id: 2, title: 'First Project Submitted', icon: '🚀', earned: true, date: '2024-01-18' },
  { id: 3, title: 'First Mock Interview', icon: '🎤', earned: true, date: '2024-01-20' },
  { id: 4, title: '7-Day Learning Streak', icon: '🔥', earned: true, date: '2024-01-22' },
  { id: 5, title: 'Skill Master', icon: '⚡', earned: false },
  { id: 6, title: 'Career Ready', icon: '🏆', earned: false },
];

export const mockDashboardStats = {
  careerMatch: 86,
  skillProgress: 64,
  projects: 3,
  interviewScore: 74,
  weeklyGoal: 6,
  weeklyCompleted: 4,
};
