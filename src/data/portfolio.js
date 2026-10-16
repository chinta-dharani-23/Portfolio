// YOUR PORTFOLIO CONTENT. This is the only file you need to edit to change what the site says.
// Filled in from your resume (Chinta_Dharani_Frontend_Developer.pdf).
//
// Rules:
//  - Any text that starts with TODO is hidden from visitors until you replace it with the real thing.
//  - Only write things that are true, because recruiters will ask about them.
//  - To add a project, copy one of the { ... } blocks inside `projects` and change the words.

export const PORTFOLIO = {
  name: 'Chinta Dharani',
  role: 'Full-stack & AI developer',
  college: 'G. Pulla Reddy Engineering College · Kurnool',
  intro:
    'CSBS student building full-stack applications with React and Spring Boot, and GenAI solutions with the Gemini API.',

  // The four big numbers under your name. Each is [number, label]. Keep them true.
  stats: [
    ['2', 'Internships'],
    ['2', 'Projects live on Render'],
    ['6', 'User roles built with RBAC'],
    ['8.21', 'CGPA out of 10'],
  ],

  about: {
    paragraphs: [
      'I study Computer Science and Business Systems at G. Pulla Reddy Engineering College, Kurnool, and I am now in my final year.',
      'I build full-stack web applications and GenAI tools, with experience in REST APIs, role-based access control, PostgreSQL and Docker. I am looking for an entry-level Software Developer role.',
    ],
    facts: [
      ['Degree', 'B.Tech, Computer Science and Business Systems'],
      ['College', 'G. Pulla Reddy Engineering College, Kurnool'],
      ['Year', 'IV Year, Semester I (2023 to 2027)'],
      ['CGPA', '8.21 / 10.0'],
      ['Location', 'Kurnool, Andhra Pradesh'],
    ],
  },

  // Internships, newest first. Keep these about your ROLE. The product details live in `projects` below.
  journey: [
    {
      org: 'Infosys Springboard Virtual Internship 7.0',
      role: 'Java Full-Stack Intern',
      period: 'July 2026 to Sep 2026',
      text: 'Selected for the virtual internship and worked in a 3-person team on a lab management platform.',
      highlights: [
        'Contributed to full-stack development with React, Java, Spring Boot and PostgreSQL, including resource management, booking and role-based workflows.',
        'Fixed permission edge cases and containerized the multi-tier application with Docker for live deployment on Render.',
      ],
    },
    {
      org: 'Indian Servers Pvt. Ltd., Vijayawada (Remote)',
      role: 'AI & Cyber Security Intern',
      period: 'May 2026 to Jun 2026',
      text: 'An 8-week internship on building generative AI applications and learning cyber security fundamentals.',
      highlights: [
        'Completed training in GenAI, Computer Vision, workflow automation (n8n, Make.com) and network security.',
        'Applied prompt engineering with fallback safety controls and built a working prototype, deployed live on Render.',
      ],
    },
  ],

  projects: [
    {
      title: 'Lab Resource Utilization Platform',
      text: 'Full-stack platform for managing lab equipment across departments: bookings, maintenance tracking and usage metrics. Six user roles with role-based access, an automated waitlist, issue reporting, real-time utilization heatmaps and no-show analytics. Built with a team of three, deployed with Docker, Render and Neon PostgreSQL.',
      tech: ['React', 'Spring Boot', 'PostgreSQL', 'Neon', 'Docker', 'Render'],
      github: '', // private repo (Infosys rules), so no GitHub button is shown
      demo: 'https://lab-resource-utilization-platform-team4.onrender.com/',
      image: 'lab.jpg', // screenshot in the `public` folder
      video: '', // optional demo video: a file name from the `public` folder (for example 'lab-demo.mp4') or a YouTube link
    },
    {
      title: 'MedGuardian AI',
      text: 'AI healthcare assistant that handles clinical queries, explains medical reports and analyses diagnostic images. Uses prompt engineering with fallback safety controls, privacy notices and medical disclaimers in the interface.',
      tech: ['Gemini API', 'Gradio', 'Python', 'Render'],
      github: 'https://github.com/chinta-dharani-23/medgaurdian-ai',
      demo: 'https://medgaurdian-ai.onrender.com/',
      image: 'medguardian.jpg', // screenshot in the `public` folder
      video: '', // optional demo video, same way as above
    },
  ],

  // Groups whose name starts with "Certifications" are shown as plain labels; the rest become icon tiles.
  skills: [
    ['Languages', ['Java', 'JavaScript', 'SQL', 'C', 'Python (basics)']],
    ['Frameworks and web', ['Spring Boot', 'React', 'REST APIs', 'HTML5', 'CSS3']],
    ['Databases and tools', ['PostgreSQL', 'MySQL', 'Docker', 'Render', 'Git', 'GitHub']],
    ['AI and platforms', ['Gemini API', 'Gradio', 'Prompt engineering', 'VS Code', 'Eclipse']],
    ['Certifications: Infosys Springboard', ['Java Foundation', 'Programming Using Java', 'DSA using Java', 'Database Management System', 'Introduction to AI', 'Basics of Python']],
    ['Certifications: others', ['Google Data Analytics (Foundations), Coursera', 'Java, Python, HTML (Spoken Tutorial)', 'HTML and CSS (ThingQbator)']],
  ],

  contact: {
    message: 'I am looking for an entry-level Software Developer role and I am open to projects and collaboration.',
    email: 'dharanichintha23@gmail.com',
    github: 'github.com/chinta-dharani-23',
    linkedin: 'linkedin.com/in/chinta-dharani-3673962a5',
    leetcode: 'leetcode.com/u/Chinta_Dharani',
    resume: 'https://drive.google.com/file/d/1cdNA2Um0qvrQdUfISDVaAii2VC1sHVPt/view?usp=sharing',
  },

  // The code typed on the laptop screen at the top of the page. Keep each line short.
  screen: {
    degree: 'B.Tech CSBS',
    stack: ['React', 'Spring Boot'],
    ai: ['Gemini API', 'Gradio'],
    status: 'open to entry-level roles',
  },
}
