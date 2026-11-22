/** Site structure: page sections and main navigation (CLAUDE.md §6). */

export interface Section {
  id: string;
  title: string;
}

export interface NavLink {
  label: string;
  href: `#${string}`;
}

/** Page sections in order. Research is deliberately absent until its details exist. */
export const sections: Section[] = [
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
  { id: "writing", title: "Writing" },
  { id: "education", title: "Education & certifications" },
  { id: "contact", title: "Contact" },
];

export const navLinks: NavLink[] = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];
