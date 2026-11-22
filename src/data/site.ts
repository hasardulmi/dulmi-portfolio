/** Site structure: nav tabs (CLAUDE.md §6). */
import type { IconName } from "./icons";

export interface NavLink {
  label: string;
  href: `#${string}`;
  icon: IconName;
}

/** The 8 nav tabs, in page order. Contact has its own button. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "#top", icon: "home" },
  { label: "About", href: "#about", icon: "user" },
  { label: "Skills", href: "#skills", icon: "list" },
  { label: "Experience", href: "#experience", icon: "team" },
  { label: "Projects", href: "#projects", icon: "code" },
  { label: "Process", href: "#process", icon: "flow" },
  { label: "Education", href: "#education", icon: "cap" },
  { label: "Writing", href: "#writing", icon: "pen" },
];

/** Every section id on the page, in order (Research is absent until its details exist). */
export const sectionIds = [
  "top",
  "about",
  "skills",
  "experience",
  "projects",
  "process",
  "education",
  "writing",
  "leadership",
  "contact",
] as const;
