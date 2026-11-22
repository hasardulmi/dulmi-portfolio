/**
 * Key figures for the hero stats bar. Derived from the profile data so they can
 * never drift from the facts — never type these numbers in by hand.
 */
import type { Profile } from "./profile";

export interface Figure {
  value: number;
  /** Full label, read by screen readers. */
  label: string;
  /** Short label for the hero stats bar, split into two lines. */
  short: [string, string];
}

/** Whole months from "YYYY-MM" start to end, counting both ends. */
export function monthsInclusive(start: string, end: string): number {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function keyFigures(profile: Profile): Figure[] {
  const internship = profile.experience[0];
  const platforms = profile.projects.length;
  // Roles per platform, summed: Super Admin exists on both platforms, so the
  // label says "across N platforms" rather than claiming distinct roles.
  const roles = profile.projects.reduce((n, p) => n + p.roles.length, 0);

  return [
    {
      value: monthsInclusive(internship.start, internship.end),
      label: `months as a ${internship.title.replace("Quality Assurance", "QA")} at ${internship.company}`,
      short: ["months QA", "experience"],
    },
    {
      value: platforms,
      label: "multi-role platforms tested end to end",
      short: ["platforms", "tested"],
    },
    {
      value: roles,
      label: `user roles validated across ${platforms} platforms`,
      short: ["user roles", `across ${platforms} platforms`],
    },
    {
      value: profile.articles.length,
      label: "technical articles published on Medium",
      short: ["Medium", "articles"],
    },
  ];
}
