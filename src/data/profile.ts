/**
 * Profile content: CLAUDE.md §9 (her CV) plus the copy Dulmi approved in
 * design-reference.html. This is the only allowed source of facts.
 *
 * Rules: location is "Sri Lanka" only; the company is always
 * "MobiOS Private Limited". Deliberately NOT included: phone number, referees.
 */
import type { IconName } from "./icons";

export interface Contact {
  email: string;
  linkedin: string;
  /** Short display form of the LinkedIn handle. */
  linkedinHandle: string;
  github: string;
  githubHandle: string;
  medium: string;
  mediumHandle: string;
}

export interface Experience {
  title: string;
  company: string;
  /** ISO year-month, for <time datetime> and derived figures. */
  start: string;
  end: string;
  /** Display form, e.g. "Sep 2025 – Feb 2026" */
  dates: string;
  points: string[];
}

export interface Project {
  slug: string;
  name: string;
  kind: string;
  company: string;
  roles: string[];
  points: string[];
  chips: string[];
  note: string;
}

export interface CaseStudy {
  badge: string;
  kind: string;
  name: string;
  intro: string;
  points: string[];
  chips: string[];
  links: { label: string; href: string; icon: IconName; primary?: boolean }[];
  note: string;
  /** Illustration rows. Every case shows "Pass". */
  testCases: { id: string; title: string; priority: string }[];
}

export interface SkillGroup {
  icon: IconName;
  tab: string;
  title: string;
  description: string;
  items: string[];
}

export interface IconItem {
  icon: IconName;
  label: string;
}

export interface SoftSkill {
  icon: IconName;
  title: string;
  evidence: string;
}

export interface Fact {
  icon: IconName;
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Stage {
  title: string;
  description: string;
  output: string;
}

export interface Education {
  qualification: string;
  institution: string;
  detail?: string;
  dates: string;
  badge?: string;
  current?: boolean;
}

export interface Certification {
  name: string;
  provider: string;
  description: string;
  url: string;
}

export interface Article {
  category: string;
  title: string;
  summary: string;
  url: string;
}

export interface Activity {
  context: string;
  role: string;
  description: string;
}

export interface Language {
  name: string;
  level: string;
}

export const profile = {
  name: "Dulmi Hettiarachchi",
  shortName: "Dulmi",
  initials: "DH",
  headline: "Junior QA Engineer | Manual Testing | API Testing | Agile",
  location: "Sri Lanka",
  cvUrl: "/Dulmi-Hettiarachchi-CV.pdf",
  /** Used in the hero frame only when this file exists in public/. */
  photo: "/dulmi.jpg",

  contact: {
    email: "hasardulmi@gmail.com",
    linkedin: "https://www.linkedin.com/in/dulmi-hasarangi-21333b280",
    linkedinHandle: "dulmi-hasarangi",
    github: "https://github.com/hasardulmi",
    githubHandle: "hasardulmi",
    medium: "https://medium.com/@hasardulmi",
    mediumHandle: "@hasardulmi",
  } satisfies Contact,

  summary:
    "QA Engineer with 6 months of hands-on experience in manual and functional testing of web-based applications; BSc (Hons) Management and Information Technology undergraduate at the University of Kelaniya, final-year exams completed. Skilled in test case design, regression testing, defect tracking, RBAC validation and REST API testing with Postman. Strong understanding of STLC, bug life cycle and Agile collaboration, with a Java (OOP) foundation.",

  hero: {
    tag: "Open to QA roles",
    rolePrefix: "Junior QA Engineer",
    roleLabel:
      "Junior QA Engineer specialising in manual testing, API testing, RBAC validation and regression testing",
    typewriter: [
      "Manual testing",
      "API testing with Postman",
      "RBAC validation",
      "Regression testing",
    ],
    intro:
      "I make sure web apps work the way users expect, and that every user sees only what they should. At MobiOS Private Limited I tested two multi-role platforms end to end, from test cases to regression before release. I have just completed my final-year exams and I'm ready to start full time.",
    /** The 9 skills around the photo, in clockwise order from the top. */
    orbit: [
      { icon: "list", label: "Manual testing" },
      { icon: "api", label: "Postman" },
      { icon: "code", label: "REST APIs" },
      { icon: "shield", label: "RBAC" },
      { icon: "loop", label: "Regression" },
      { icon: "verified", label: "JWT" },
      { icon: "flow", label: "STLC" },
      { icon: "team", label: "Agile" },
      { icon: "book", label: "Java" },
    ] satisfies IconItem[],
  },

  about: {
    lead: "I'm a Quality Assurance Engineer from Sri Lanka with 6 months of hands-on experience testing web applications at MobiOS Private Limited.",
    paragraphs: [
      "I enjoy finding the places where software breaks before users do: a role that can see data it shouldn't, a workflow that skips a step, an API that accepts the wrong request. I design test cases, run regression before releases and write clear bug reports that developers can act on.",
      "I've just completed my final-year exams for a BSc (Hons) in Management and Information Technology at the University of Kelaniya. Next, I want to grow into API and test automation, and I share what I learn on Medium.",
    ],
    facts: [
      { icon: "pin", label: "Based in", value: "Sri Lanka" },
      {
        icon: "cap",
        label: "Degree",
        value: "BSc (Hons) MIT · final exams completed",
      },
      {
        icon: "team",
        label: "Experience",
        value: "QA Engineer Intern, MobiOS Private Limited",
      },
      { icon: "eye", label: "Focus", value: "Manual, API and RBAC testing" },
      { icon: "globe", label: "Languages", value: "Sinhala, English" },
      {
        icon: "check",
        label: "Status",
        value: "Open to QA roles, available now",
        highlight: true,
      },
    ] satisfies Fact[],
  },

  marquee: [
    "Manual Testing",
    "Postman",
    "REST APIs",
    "RBAC",
    "Regression",
    "Test Case Design",
    "JWT",
    "STLC",
    "Bug Life Cycle",
    "Agile",
    "Java",
    "Git",
    "Docker",
  ],

  experience: [
    {
      title: "Quality Assurance Engineer Intern",
      company: "MobiOS Private Limited",
      start: "2025-09",
      end: "2026-02",
      dates: "Sep 2025 – Feb 2026",
      points: [
        "Manual and functional testing of multi-role web apps before release.",
        "Designed, documented and executed test cases for different workflows and roles.",
        "Logged and tracked defects with clear steps, expected vs actual results and severity.",
        "Ran regression testing before feature releases.",
        "Validated permissions (RBAC), workflows and data accuracy across user roles.",
        "Worked with developers in an Agile team to reproduce issues and verify fixes.",
      ],
    },
  ] satisfies Experience[],

  caseStudy: {
    badge: "Solo project · QA case study",
    kind: "Personal website · 2026",
    name: "Testing my own portfolio",
    intro:
      "I treated this website like a real product: I wrote the requirements, built it with Claude Code (an AI coding assistant), and then tested it as a QA engineer.",
    points: [
      "Wrote a test plan and test cases for every section, on desktop and phone, in light and dark mode.",
      "Logged every bug I found with steps, expected vs actual result and severity, then re-tested the fixes.",
      "Reviewed every change before accepting it and managed the work in Git, one commit per section.",
    ],
    chips: [
      "Test plan",
      "Test cases",
      "Bug reports",
      "Manual testing",
      "AI-assisted development",
      "Git & GitHub",
    ],
    links: [
      {
        label: "Test cases",
        href: "https://github.com/hasardulmi/dulmi-portfolio/blob/main/docs/qa/test-cases.md",
        icon: "list",
        primary: true,
      },
      {
        label: "Bug reports",
        href: "https://github.com/hasardulmi/dulmi-portfolio/blob/main/docs/qa/bug-reports.md",
        icon: "bug",
      },
      {
        label: "Code",
        href: "https://github.com/hasardulmi/dulmi-portfolio",
        icon: "gh",
      },
    ],
    note: "Built with Claude Code, an AI coding assistant. The table above is an illustration; the real test cases are in the repository.",
    testCases: [
      {
        id: "TC-01",
        title: "Nav tab scrolls to its section",
        priority: "High",
      },
      { id: "TC-02", title: "Theme toggle remembers choice", priority: "High" },
      { id: "TC-03", title: "Download CV opens the PDF", priority: "High" },
      {
        id: "TC-04",
        title: "Layout has no sideways scroll at 360px",
        priority: "Medium",
      },
      {
        id: "TC-05",
        title: "Bug hunt dialog closes with Esc",
        priority: "Medium",
      },
      { id: "TC-06", title: "All links open the right page", priority: "Low" },
    ],
  } satisfies CaseStudy,

  projects: [
    {
      slug: "coupon-management",
      name: "Coupon Management System",
      kind: "Multi-tenant platform",
      company: "MobiOS Private Limited",
      roles: ["Super Admin", "Company Owner", "Outlet Manager", "Cashier"],
      points: [
        "Verified role-based access so each role had the right permissions and tenant data stayed private.",
        "Ran end-to-end flows for onboarding, coupon creation, redemption and reporting.",
        "Validated redemption logic across outlets to prevent misuse; reported and tracked defects.",
      ],
      chips: ["RBAC", "End-to-end", "Functional", "Defect tracking"],
      note: "Illustration of the testing approach, not real permissions or client data.",
    },
    {
      slug: "marketplace-platform",
      name: "Marketplace Platform",
      kind: "E-commerce system",
      company: "MobiOS Private Limited",
      roles: [
        "Super Admin",
        "Vendor",
        "Business Customer",
        "Non-Business Customer",
      ],
      points: [
        "Tested four roles: Super Admin, Vendor, Business and Non-Business Customer.",
        "Verified vendor registration, customer creation and vendor product management.",
        "Validated order placement, quotations and payment workflows; wrote test cases and reported defects.",
      ],
      chips: ["Workflow testing", "Functional", "Test cases", "Regression"],
      note: "Illustration of the testing approach, not real client screens.",
    },
  ] satisfies Project[],

  /** Illustration data for the project cards (not real permissions). */
  illustrations: {
    matrix: {
      roles: ["Super Admin", "Owner", "Manager", "Cashier"],
      rows: [
        { action: "Create coupon", allowed: [true, true, false, false] },
        { action: "View tenant reports", allowed: [true, true, true, false] },
        { action: "Redeem coupon", allowed: [false, false, true, true] },
        { action: "Manage outlets", allowed: [true, true, false, false] },
      ],
    },
    orderFlow: [
      "Add product",
      "Place order",
      "Quotation",
      "Payment",
      "Confirmed",
    ],
  },

  // TODO: public QA project(s): add when built (e.g. a Postman + Newman API test suite).
  // TODO: GitHub repos to feature: pending from Dulmi.

  skills: [
    {
      icon: "list",
      tab: "Testing",
      title: "Testing",
      description:
        "How I check that software works: from designing tests to confirming fixes.",
      items: [
        "Manual Testing",
        "Functional Testing",
        "Regression Testing",
        "End-to-End Testing",
        "Test Case Design",
        "Test Execution",
        "Defect Reporting & Tracking",
        "Black Box Testing",
        "White Box Testing",
      ],
    },
    {
      icon: "api",
      tab: "API & security",
      title: "API & Security",
      description:
        "How I test the parts users don't see: endpoints, tokens and permissions.",
      items: [
        "REST API Testing",
        "GET / POST / PUT / DELETE",
        "Postman",
        "JWT Authentication & Authorization",
        "Role-Based Access Control (RBAC)",
      ],
    },
    {
      icon: "code",
      tab: "Programming & tools",
      title: "Programming & Tools",
      description:
        "The tools I use to read code, manage versions and set up environments.",
      items: [
        "Java",
        "Object-Oriented Programming",
        "Git",
        "GitHub",
        "Docker (Basic)",
      ],
    },
    {
      icon: "flow",
      tab: "Process",
      title: "Process & Methodologies",
      description:
        "The frameworks that guide how I plan and track testing in a team.",
      items: [
        "STLC",
        "SDLC",
        "Bug Life Cycle",
        "Agile",
        "Cross-functional Collaboration",
      ],
    },
  ] satisfies SkillGroup[],

  softSkills: [
    {
      icon: "eye",
      title: "Attention to detail",
      evidence:
        "Bug reports with clear steps, expected vs actual results and severity.",
    },
    {
      icon: "puzzle",
      title: "Problem solving",
      evidence: "Reproducing issues with developers until the cause is clear.",
    },
    {
      icon: "book",
      title: "Self-learning",
      evidence: "Writing Medium articles on testing, JWT and Docker.",
    },
    {
      icon: "team",
      title: "Teamwork",
      evidence: "Working in an Agile team and on university event committees.",
    },
    {
      icon: "clock",
      title: "Time management",
      evidence: "Regression testing finished before each feature release.",
    },
  ] satisfies SoftSkill[],

  process: [
    {
      title: "Requirement analysis",
      description:
        "I read the feature and list what must work and for which roles.",
      output: "Output: testable requirements",
    },
    {
      title: "Test planning",
      description:
        "I decide what to test, how, and what is in or out of scope.",
      output: "Output: test plan",
    },
    {
      title: "Test case design",
      description: "I write clear cases with steps, data and expected results.",
      output: "Output: test cases",
    },
    {
      title: "Test execution",
      description: "I run the cases across workflows and user roles.",
      output: "Output: pass / fail results",
    },
    {
      title: "Defect reporting",
      description:
        "I log bugs with steps, expected vs actual and severity, then retest fixes.",
      output: "Output: tracked defects",
    },
    {
      title: "Regression & closure",
      description:
        "I re-check existing features before release and sum up the results.",
      output: "Output: release sign-off",
    },
  ] satisfies Stage[],

  education: [
    {
      qualification: "BSc (Hons) in Management and Information Technology",
      institution: "University of Kelaniya, Sri Lanka",
      detail: "IT specialisation",
      dates: "2023 – Present",
      badge: "Final-year exams completed · 2026",
      current: true,
    },
    {
      qualification: "Diploma in English",
      institution: "Esoft Metro Campus",
      dates: "2021",
    },
    {
      qualification: "G.C.E. Advanced Level",
      institution: "Tangalle Girls' School",
      detail: "Biology stream",
      dates: "2021",
      badge: "Z-score 1.299",
    },
    {
      qualification: "G.C.E. Ordinary Level",
      institution: "Debarawewa National College",
      dates: "2017",
      badge: "9 A passes",
    },
  ] satisfies Education[],

  certifications: [
    {
      name: "API Testing",
      provider: "LinkedIn Learning",
      description:
        "GET, POST, PUT and DELETE requests, with an introduction to performance and security testing.",
      url: "https://www.linkedin.com/learning/certificates/de46f512851e3adc028efad75950dc0e2922a8fdb87cc49cd6d6272e1e9821d7?trk=share_certificate",
    },
    {
      name: "Object-Oriented Programming in Java",
      provider: "LinkedIn Learning",
      description: "Classes, objects, constructors and Java OOP mechanisms.",
      url: "https://www.linkedin.com/learning/certificates/48713e270ce7e4d234a505520fa848da0596ecf1dc00256df3a2311846790dcd?trk=share_certificate",
    },
  ] satisfies Certification[],

  languages: [
    { name: "Sinhala", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ] satisfies Language[],

  articles: [
    {
      category: "Testing basics",
      title:
        "A Beginner's Guide to Black Box, White Box, and Experience-Based Testing",
      summary: "Testing techniques explained for newcomers.",
      url: "https://medium.com/@hasardulmi/a-beginners-guide-to-black-box-white-box-and-experience-based-testing-9af436506600",
    },
    {
      category: "QA foundations",
      title: "Foundations of Software Testing",
      summary:
        "STLC, test cases, bug reporting, functional and non-functional testing.",
      url: "https://medium.com/@hasardulmi/foundations-of-software-testing-8b6a873fb53d",
    },
    {
      category: "Security",
      title: "Understanding JWT (JSON Web Token)",
      summary: "Secure authentication and authorization in web apps.",
      url: "https://medium.com/@hasardulmi/understanding-jwt-json-web-token-86f7b886b57f",
    },
    {
      category: "DevOps",
      title: "Docker for Beginners",
      summary: "Containers, images and Dockerfiles for consistent deployment.",
      url: "https://medium.com/@hasardulmi/docker-for-beginners-9152ef6c6adc",
    },
  ] satisfies Article[],

  activities: [
    {
      context: "HackX 9.0",
      role: "Organizing Committee Member",
      description:
        "Startup ideas platform for undergraduates and industry experts, University of Kelaniya.",
    },
    {
      context: "hackxJR",
      role: "Organizing Committee Member",
      description:
        "Department of Industrial Management, University of Kelaniya.",
    },
    {
      context: "Exposition Issue 20",
      role: "Organizing Committee Member",
      description: "Celebrating 20 years of Management and IT.",
    },
    {
      context: "University clubs",
      role: "LEO Club & LED Club",
      description: "Member of both clubs at the University of Kelaniya.",
    },
  ] satisfies Activity[],

  contactLine:
    "I'm looking for a Junior QA Engineer role where I can keep growing in API testing and test automation.",

  /** Bug hunt: one message per hidden bug, keyed by the section it hides in. */
  bugs: {
    top: "Found one in the hero! I check every screen, not just the obvious parts.",
    skills: "Bug in the skills section. Good testers look in the details.",
    process:
      "Caught it during the process! Following the STLC means fewer bugs reach users.",
    education: "One in education! Learning never stops in QA.",
    writing: "Last place you looked? Testers check the edges too.",
  },

  // TODO: Research ("Dark patterns"): add only after Dulmi provides the details.
  // TODO: custom domain: pending.
};

export type Profile = typeof profile;
export type BugSection = keyof Profile["bugs"];
