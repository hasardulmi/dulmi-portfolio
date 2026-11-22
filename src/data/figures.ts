/**
 * Key figures for the hero "Profile at a glance" card. Derived from the
 * profile data (CLAUDE.md §9) so they can never drift from the facts.
 */
import type { Profile } from "./profile";

export interface Figure {
  value: number;
  unit: string;
  label: string;
}

/** Whole months from "YYYY-MM" start to end, counting both ends. */
export function monthsInclusive(start: string, end: string): number {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function glanceFigures(profile: Profile): Figure[] {
  const internship = profile.experience[0];
  const platforms = profile.projects.length;
  // Roles per platform, summed: Super Admin exists on both platforms, so the
  // label says "across N platforms" rather than claiming distinct roles.
  const roles = profile.projects.reduce((n, p) => n + p.roles.length, 0);

  return [
    {
      value: monthsInclusive(internship.start, internship.end),
      unit: "months",
      label: `${internship.title.replace("Quality Assurance", "QA")} at ${internship.company.replace(" Private Limited", "")}`,
    },
    { value: platforms, unit: "platforms", label: "tested end to end" },
    {
      value: roles,
      unit: "user roles",
      label: `validated across ${platforms} platforms (RBAC)`,
    },
  ];
}
