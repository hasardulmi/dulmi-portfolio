/**
 * Profile content — copied from CLAUDE.md §9 (her CV). This is the only
 * allowed source of facts. Do not add anything that is not in §9.
 *
 * Deliberately NOT included: phone number, referees.
 */

export interface Link {
  label: string;
  href: string;
}

export interface Contact {
  email: string;
  linkedin: string;
  github: string;
  medium: string;
}

export interface Experience {
  title: string;
  company: string;
  /** ISO year-month, for <time datetime> */
  start: string;
  end: string;
  /** Display form, e.g. "Sep 2025 – Feb 2026" */
  dates: string;
  points: string[];
}

export interface Project {
  slug: string;
  name: string;
  type: string;
  company: string;
  roles: string[];
  points: string[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Education {
  qualification: string;
  institution: string;
  detail?: string;
  dates: string;
}

export interface Certification {
  name: string;
  detail?: string;
}

export interface Article {
  title: string;
  summary?: string;
  /** TODO: real Medium article URL — null until Dulmi provides it. */
  url: string | null;
}

export interface Activity {
  role: string;
  items: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  contact: Contact;
  summary: string;
  /** TODO: CV PDF not yet provided (public/Dulmi-Hettiarachchi-CV.pdf). */
  cvUrl: string | null;
  /** TODO: optional photo not yet provided. */
  photo: null;
  experience: Experience[];
  projects: Project[];
  /** TODO: public QA project(s) not yet built. */
  publicProjects: Project[];
  /** TODO: GitHub repos to feature not yet chosen. */
  featuredRepos: Link[];
  skills: SkillGroup[];
  education: Education[];
  certifications: Certification[];
  articles: Article[];
  activities: Activity[];
  languages: Language[];
}

export const profile: Profile = {
  name: "Dulmi Hettiarachchi",
  headline: "Junior QA Engineer | Manual Testing | API Testing | Agile",
  location: "Gampaha, Sri Lanka",

  contact: {
    email: "hasardulmi@gmail.com",
    linkedin: "https://linkedin.com/in/dulmi-hasarangi",
    github: "https://github.com/hasardulmi",
    medium: "https://medium.com/@dulmi-hasarangi",
  },

  summary:
    "QA Engineer with 6 months of hands-on experience in manual and functional testing of web-based applications; final-year BSc (Hons) Management and Information Technology undergraduate, University of Kelaniya. Skilled in test case design, regression testing, defect tracking, RBAC validation and REST API testing with Postman. Strong understanding of STLC, bug life cycle and Agile collaboration, with a Java (OOP) foundation.",

  // TODO: add "/Dulmi-Hettiarachchi-CV.pdf" once the file is in public/.
  cvUrl: null,

  // TODO: photo (optional) — pending from Dulmi.
  photo: null,

  experience: [
    {
      title: "Quality Assurance Engineer Intern",
      company: "MobiOS Private Limited",
      start: "2025-09",
      end: "2026-02",
      dates: "Sep 2025 – Feb 2026",
      points: [
        "Manual and functional testing of multi-role web applications before release.",
        "Designed, documented and executed test cases covering different workflows and user roles.",
        "Logged and tracked defects through the bug life cycle (reproduction steps, expected vs actual, severity).",
        "Regression testing before feature releases.",
        "Validated user permissions (RBAC), workflows and data accuracy across multiple user roles.",
        "Worked with developers in an Agile team to reproduce issues and verify fixes.",
      ],
    },
  ],

  projects: [
    {
      slug: "coupon-management",
      name: "Coupon Management System",
      type: "Multi-tenant platform",
      company: "MobiOS",
      roles: ["Super Admin", "Company Owner", "Outlet Manager", "Cashier"],
      points: [
        "Verified RBAC: correct permissions and data privacy between tenants.",
        "End-to-end scenarios: company onboarding, coupon creation, redemption, reporting.",
        "Validated redemption logic across multiple outlets to prevent misuse; reported and tracked defects.",
      ],
    },
    {
      slug: "marketplace-platform",
      name: "Marketplace Platform",
      type: "E-commerce",
      company: "MobiOS",
      roles: [
        "Super Admin",
        "Vendor",
        "Business Customer",
        "Non-Business Customer",
      ],
      points: [
        "Verified vendor registration, customer creation, vendor-side product management.",
        "Validated order placement, quotation process and payment workflows; wrote test cases and reported defects.",
      ],
    },
  ],

  // TODO: public QA project(s) — add when built (e.g. a Postman + Newman API test suite).
  publicProjects: [],

  // TODO: GitHub repos to feature — pending from Dulmi.
  featuredRepos: [],

  skills: [
    {
      name: "Testing",
      items: [
        "Manual",
        "Functional",
        "Regression",
        "End-to-End",
        "Test Case Design",
        "Test Execution",
        "Defect Reporting & Tracking",
        "Bug Life Cycle",
        "STLC",
        "SDLC",
        "Black Box",
        "White Box",
      ],
    },
    {
      name: "Process",
      items: ["Agile", "Cross-functional team collaboration"],
    },
    {
      name: "API & security",
      items: [
        "REST API testing (GET, POST, PUT, DELETE)",
        "Postman",
        "JWT authentication & authorization",
        "RBAC",
      ],
    },
    {
      name: "Programming & tools",
      items: ["Java", "OOP", "Docker (basic)", "Git", "GitHub"],
    },
  ],

  education: [
    {
      qualification: "BSc (Hons) Management and Information Technology",
      institution: "University of Kelaniya",
      detail: "IT specialisation, final year",
      dates: "2023 – present",
    },
    {
      qualification: "Diploma in English",
      institution: "Esoft Metro Campus",
      dates: "2021",
    },
    {
      qualification: "G.C.E. A/L",
      institution: "Tangalle Girls' School",
      detail: "Biology stream",
      dates: "2021",
    },
  ],

  certifications: [
    {
      name: "API Testing",
      detail: "GET/POST/PUT/DELETE; intro to performance and security testing",
    },
    { name: "Object-Oriented Programming in Java" },
  ],

  // TODO: real Medium article URLs — link to the Medium profile until provided.
  articles: [
    {
      title:
        "A Beginner's Guide to Black Box, White Box, and Experience-Based Testing",
      url: null,
    },
    {
      title: "Foundations of Software Testing",
      summary:
        "STLC, test cases, bug reporting, functional and non-functional testing.",
      url: null,
    },
    {
      title: "Understanding JWT (JSON Web Token)",
      summary: "Secure authentication and authorization in web applications.",
      url: null,
    },
    {
      title: "Docker for Beginners",
      summary: "Containers, images and Dockerfiles for consistent deployment.",
      url: null,
    },
  ],

  activities: [
    {
      role: "Organizing Committee",
      items: [
        "HackX 9.0",
        "hackxJR (Dept. of Industrial Management)",
        "Exposition Issue 20 (University of Kelaniya)",
      ],
    },
    {
      role: "Member",
      items: [
        "LEO Club, University of Kelaniya",
        "LED Club, University of Kelaniya",
      ],
    },
  ],

  languages: [
    { name: "Sinhala", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],

  // TODO: Research ("Dark patterns") — add only after Dulmi provides the details.
  // TODO: custom domain — pending.
};
