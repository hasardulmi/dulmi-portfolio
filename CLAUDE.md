# CLAUDE.md — Dulmi Hettiarachchi · QA Portfolio

This file is the design brief and working rules for this project. Read it fully before every task.

## 1. What we are building

A personal portfolio website for **Dulmi Hettiarachchi**, Junior QA Engineer (Sri Lanka).

- **Primary audience:** recruiters and QA leads hiring for **Junior / Associate QA Engineer** roles. They spend 30–60 seconds on the site. In the first screen they must see: who she is, that she does QA (manual, API, Agile), real experience at MobiOS, and how to contact her.
- **Secondary audience:** university contacts and the wider testing community (Medium readers).
- **One page** with anchored sections, plus room for future pages (`/projects/[slug]`, `/research`).

### Success criteria
- Recruiter understands her profile within 5 seconds of the first screen.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- Works perfectly at 360px wide and up. No horizontal scroll, ever.
- Zero bugs: no broken links, no typos, no console errors. **This is a QA engineer's portfolio — the site itself is proof of her attention to detail.**

## 2. Content rules (very important)

- **The source of truth is Section 9 (Content facts) of this file.** It comes from her CV.
- **Never invent anything:** no fake metrics, no percentages, no bug counts, no testimonials, no company logos, no clients, no extra skills or tools, no certifications she doesn't have.
- If content is missing, add a clearly marked `TODO:` comment in code and tell me. Do not fill the gap with made-up text.
- MobiOS projects are company work: describe her **testing approach and responsibilities** only. No screenshots, no real data, no internal URLs.
- **Do not publish** her phone number or her referees' names/emails. Email, LinkedIn, GitHub and Medium only.
- Writing style: clear, plain English, first person ("I test…"), confident but modest. No buzzwords ("passionate", "ninja", "rockstar"), no slogans.

## 3. Tech stack

| Area | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (installed: 7.4.x) + TypeScript (strict) | Static output, near-zero JS by default |
| Styling | **Tailwind CSS v4** | Design tokens as CSS variables (Section 5) |
| Interactivity | Astro islands with vanilla TS (or a small Preact island only if really needed) | No heavy UI libraries |
| Content | Typed data in `src/data/*.ts` | All page text lives here, not hard-coded in components |
| Fonts | Self-hosted via `@fontsource` (Source Serif 4, Inter) | No layout shift: `font-display: swap` + fallback metrics |
| Icons | Inline SVG (e.g. `astro-icon` with Lucide) | No emoji icons |
| Testing | Playwright (smoke + accessibility with `@axe-core/playwright`), `astro check`, Prettier, ESLint | She is a QA engineer — tests are part of the showcase |
| CI | GitHub Actions: build + lint + Playwright on every push | Show the green badge in the README |
| Hosting | Vercel (custom domain later) | GitHub Pages is the fallback |

Do not add new dependencies without asking first and explaining why.

## 4. Design concept

**Idea: the site behaves like a clean test execution report.** Calm, precise and well organised, like a good test report: status badges, check marks, tidy tables and clear hierarchy. It is professional, not flashy.

**One signature interactive element (and only one):** the **"Test run" hero panel**. On load, a short list of her verified skills appears as test cases (TC-01…TC-07) and each one switches from "Queued" to "Passed", filling a progress bar to 7/7.
- Respect `prefers-reduced-motion`: show everything already "Passed", with no animation.
- It must be real HTML text (readable by screen readers and search engines), not canvas or an image.
- Total animation time under 2.5s. It must never block reading the page.

A possible v2 element (not now): an interactive RBAC permission matrix for the Coupon Management case study (roles × actions, click to see expected result).

### Do not use
Purple gradients, glassmorphism, neon on black, cream + serif + rust, emoji icons, ALL-CAPS tracked labels, "01/02/03" numbering, stock photos, parallax, 3D, cursor effects, auto-playing anything except the hero test run.

## 5. Design tokens

### Colour (light / dark)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#10191e` | Page background |
| `--ink` | `#121212` | `#e9eef1` | Main text |
| `--mute` | `#56616b` | `#9fb0bb` | Secondary text, dates |
| `--panel` | `#e3ecf0` | `#18252c` | Hero band, alternate sections, chips |
| `--panel-2` | `#f3f7f9` | `#142027` | Cards |
| `--rule` | `#cfdbe1` | `#26363f` | Borders and dividers |
| `--slate` | `#2e6f8e` | `#6fb3d2` | "Passed" status, links, check marks |
| `--red` | `#e3120b` | `#ff5a4f` | Single accent: "Open to QA roles" tag and focus rings only |

- **Theme:** the default follows the system setting (`prefers-color-scheme`). A sun/moon toggle button in the nav (desktop and mobile) switches light/dark and saves the choice in `localStorage` (`theme` key, wrapped in try/catch). A tiny inline script in `<head>` sets `data-theme="light" | "dark"` on `<html>` before first paint, so there is no flash of the wrong theme. Tokens and the Tailwind `dark:` variant respond to `data-theme`, and fall back to the system setting when JS is off (the toggle is then hidden). Until the visitor chooses, live system changes are followed.
- Toggle accessibility: a real `<button>` with a fixed `aria-label="Dark theme"` and `aria-pressed` (true in dark). The colour fade on switch is disabled under `prefers-reduced-motion`.
- All text must pass WCAG AA contrast (4.5:1 body, 3:1 large text). Check both themes.

### Typography
- Headings: **Source Serif 4**, 600–700, line-height 1.05–1.15, `text-wrap: balance`.
- Body and UI: **Inter**, 400/500/600/700.
- Sizes: H1 `clamp(40px, 5.4vw, 60px)` · H2 `clamp(28px, 3.4vw, 38px)` · H3 21px · body 16–17px · small 13–14px. Nothing below 13px.
- Max line length about 70 characters.
- Use `font-variant-numeric: tabular-nums` for dates and test IDs.

### Layout and spacing
- Mobile-first. Content max width 1240px. Section padding `clamp(36px, 5vw, 72px)` vertical, `max(5vw, 16px)` horizontal.
- Section headers: 2px ink rule on top, serif H2, optional muted subtitle on the same baseline.
- Radius: 8px buttons, 12–14px cards, 999px chips.
- Breakpoints: stack to one column below 860px. Hide the nav links below 660px and show a simple accessible menu button (660px is the narrowest width where name, links and theme toggle fit on one row, so the header is always a single row).

### Components
- **Button:** min-height 44px; primary = ink background; secondary = 1.5px ink outline. Visible focus ring (3px `--red`, offset 2px).
- **Chip:** small pill for roles and skills.
- **Status badge:** "Passed" (slate background, white text), "Queued" (panel background, muted text).
- **Tick list:** custom CSS check mark in `--slate` instead of bullets.
- **Card:** `--panel-2` background, 1px `--rule` border, no coloured accent bars.

## 6. Page structure (in this order)

1. **Nav** (sticky): name on the left; links to Experience, Projects, Skills, Writing, Contact.
2. **Hero:** "Open to QA roles" tag · name (H1) · role line "Junior QA Engineer · Manual, API & Agile testing" · 2–3 sentence intro · location + degree line · buttons: Get in touch, Download CV (PDF), LinkedIn, GitHub · the Test-run panel on the right (below the text on mobile).
3. **Experience:** QA Engineer Intern at MobiOS, with dates and tick list.
4. **Projects:**
   - **Featured case study: Coupon Management System.** Context → roles tested → risks (permissions, tenant data privacy, coupon misuse) → my test approach → what I did → skills used. Can grow into its own page `/projects/coupon-management`.
   - **Marketplace Platform** (standard card).
   - **Public QA projects** (empty slot for now; add when built, e.g. a Postman + Newman API test suite).
5. **Skills:** 4 groups (Testing, Process, API & security, Programming & tools) as chips.
6. **Writing:** the 4 Medium articles, each linking to its article. `TODO:` until I give the real article URLs; link to the Medium profile meanwhile.
7. **Education & certifications** (two columns on desktop), plus a short Activities list.
8. **Research** (`TODO:` — "Dark patterns" research; add only after I give the details. Do not create placeholder text for it.)
9. **Contact / footer:** short invitation line, email, LinkedIn, GitHub, Medium, copyright.

## 7. Quality bar (non-negotiable)

- **Accessibility:** semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one H1, logical heading order, skip-to-content link, alt text, labelled links ("LinkedIn profile", not "click here"), keyboard-navigable, visible focus, `lang="en"`.
- **Motion:** only the hero test run and subtle hover states. Everything is off under `prefers-reduced-motion: reduce`.
- **Performance:** no layout shift (CLS < 0.05), LCP < 2.0s on mobile, total JS under 15 KB, images in AVIF/WebP with width/height set.
- **SEO:** unique `<title>` and meta description, Open Graph + Twitter card image (1200×630), canonical URL, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema (name, jobTitle, alumniOf, sameAs links).
- **Links:** every external link opens correctly and uses `rel="noopener noreferrer"` when it has `target="_blank"`.
- **Tests:** Playwright smoke tests (page loads, all nav anchors work, no console errors, CV link returns 200, axe has no serious violations) at 360px, 768px and 1280px.

## 8. How we work

- **One section per task.** Start every task in **plan mode**: show me the plan and the files you will touch, then wait for my OK.
- After each section: run `npm run build`, `npx astro check` and the Playwright tests. Fix any failures before saying it's done.
- **Commit after each completed section** with a clear message, e.g. `feat(hero): add test-run panel with reduced-motion fallback`.
- Keep components small: `src/components/<Section>.astro`, data in `src/data/`, tokens in `src/styles/global.css`.
- If anything in this brief conflicts with a request, ask me before choosing.

## 9. Content facts (from CV — the only allowed source)

**Name:** Dulmi Hettiarachchi
**Headline:** Junior QA Engineer | Manual Testing | API Testing | Agile
**Location:** Gampaha, Sri Lanka
**Email:** hasardulmi@gmail.com
**LinkedIn:** https://linkedin.com/in/dulmi-hasarangi
**GitHub:** https://github.com/hasardulmi
**Medium:** https://medium.com/@dulmi-hasarangi

**Summary:** QA Engineer with 6 months of hands-on experience in manual and functional testing of web-based applications; final-year BSc (Hons) Management and Information Technology undergraduate, University of Kelaniya. Skilled in test case design, regression testing, defect tracking, RBAC validation and REST API testing with Postman. Strong understanding of STLC, bug life cycle and Agile collaboration, with a Java (OOP) foundation.

**Experience — Quality Assurance Engineer Intern, MobiOS Private Limited (Sep 2025 – Feb 2026)**
- Manual and functional testing of multi-role web applications before release.
- Designed, documented and executed test cases covering different workflows and user roles.
- Logged and tracked defects through the bug life cycle (reproduction steps, expected vs actual, severity).
- Regression testing before feature releases.
- Validated user permissions (RBAC), workflows and data accuracy across multiple user roles.
- Worked with developers in an Agile team to reproduce issues and verify fixes.

**Project — Coupon Management System (multi-tenant platform), MobiOS**
- Roles: Super Admin, Company Owner, Outlet Manager, Cashier.
- Verified RBAC: correct permissions and data privacy between tenants.
- End-to-end scenarios: company onboarding, coupon creation, redemption, reporting.
- Validated redemption logic across multiple outlets to prevent misuse; reported and tracked defects.

**Project — Marketplace Platform (e-commerce), MobiOS**
- Roles: Super Admin, Vendor, Business Customer, Non-Business Customer.
- Verified vendor registration, customer creation, vendor-side product management.
- Validated order placement, quotation process and payment workflows; wrote test cases and reported defects.

**Skills**
- Testing: Manual, Functional, Regression, End-to-End, Test Case Design, Test Execution, Defect Reporting & Tracking, Bug Life Cycle, STLC, SDLC, Black Box, White Box.
- API & security: REST API testing (GET, POST, PUT, DELETE), Postman, JWT authentication & authorization, RBAC.
- Programming & tools: Java, OOP, Docker (basic), Git, GitHub.
- Methodologies: Agile, cross-functional team collaboration.

**Education**
- BSc (Hons) Management and Information Technology, University of Kelaniya — IT specialisation, final year (2023 – present).
- Diploma in English, Esoft Metro Campus (2021).
- G.C.E. A/L, Biology stream, Tangalle Girls' School (2021).

**Certifications:** API Testing (GET/POST/PUT/DELETE; intro to performance and security testing) · Object-Oriented Programming in Java.

**Medium articles**
1. A Beginner's Guide to Black Box, White Box, and Experience-Based Testing
2. Foundations of Software Testing — STLC, test cases, bug reporting, functional and non-functional testing
3. Understanding JWT (JSON Web Token) — secure authentication and authorization in web applications
4. Docker for Beginners — containers, images and Dockerfiles for consistent deployment

**Activities:** Organizing Committee — HackX 9.0, hackxJR (Dept. of Industrial Management), Exposition Issue 20 (University of Kelaniya) · Member — LEO Club and LED Club, University of Kelaniya.

**Languages:** Sinhala (native), English (professional working proficiency).

**Pending from Dulmi (leave as TODO):** Medium article URLs · CV PDF file (`public/Dulmi-Hettiarachchi-CV.pdf`) · GitHub repos to feature · public QA project(s) · Dark patterns research details · photo (optional) · custom domain.
