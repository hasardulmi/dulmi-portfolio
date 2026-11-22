# CLAUDE.md — Dulmi Hettiarachchi · QA Portfolio

This file is the design brief and working rules for this project. Read it fully before every task.

## 1. What we are building

A personal portfolio website for **Dulmi Hettiarachchi**, Junior QA Engineer (Sri Lanka).

- **Primary audience:** recruiters and QA leads hiring for **Junior / Associate QA Engineer** roles. They spend 30–60 seconds on the site. In the first screen they must see: who she is, that she does QA (manual, API, Agile), real experience at MobiOS Private Limited, and how to contact her.
- **Secondary audience:** university contacts and the wider testing community (Medium readers).
- **One page** with anchored sections, plus room for future pages (`/projects/[slug]`, `/research`).

### Success criteria
- Recruiter understands her profile within 5 seconds of the first screen.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- Works perfectly at 360px wide and up. No horizontal scroll, ever.
- Zero bugs: no broken links, no typos, no console errors. **This is a QA engineer's portfolio — the site itself is proof of her attention to detail.**

## 2. Content rules (very important)

- **The source of truth is Section 9 (Content facts) of this file.** It comes from her CV and the copy she approved in `design-reference.html`. All page text lives in `src/data/profile.ts`.
- **Never invent anything:** no fake metrics, no percentages, no bug counts, no testimonials, no company logos, no clients, no extra skills or tools, no certifications she doesn't have.
- If content is missing, add a clearly marked `TODO:` comment in code and tell me. Do not fill the gap with made-up text.
- MobiOS Private Limited projects are company work: describe her **testing approach and responsibilities** only. No screenshots, no real data, no internal URLs. Project pictures are illustrations and say so.
- **Location is "Sri Lanka" only.** Never mention her town.
- **The company is always written "MobiOS Private Limited"**, never "MobiOS" alone.
- **Do not list Astro, TypeScript, Tailwind or Playwright as her skills.** The portfolio case study says it was built with Claude Code.
- **Do not publish** her phone number or her referees' names/emails. Email, LinkedIn, GitHub and Medium only.
- Writing style: clear, plain English, first person ("I test…"), confident but modest. No buzzwords ("passionate", "ninja", "rockstar"), no slogans.

## 3. Tech stack

| Area | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (installed: 7.4.x) + TypeScript (strict) | Static output, small JS only |
| Styling | **Tailwind CSS v4** + component-scoped `<style>` | Design tokens as CSS variables (Section 5) |
| Interactivity | Small vanilla TS `<script>` per component | No UI libraries. All content is in the HTML at build time; JS only adds behaviour |
| Content | Typed data in `src/data/*.ts` | All page text lives here, not hard-coded in components |
| Fonts | Self-hosted via `@fontsource-variable` (Outfit, Inter) and `@fontsource/playfair-display` (500 italic, latin only) | No layout shift: `font-display: swap` + fallback metrics |
| Icons | Inline SVG sprite (`src/data/icons.ts`, `IconSprite.astro`, `Icon.astro`) | No emoji icons |
| Testing | Playwright (smoke + accessibility with `@axe-core/playwright`), `astro check`, Prettier, ESLint | She is a QA engineer — tests are part of the showcase |
| CI | GitHub Actions: build + lint + Playwright on every push | Show the green badge in the README |
| Hosting | Vercel, live at https://dulmi-portfolio.vercel.app (`site` in `astro.config.mjs`; custom domain later) | GitHub Pages is the fallback |

Do not add new dependencies without asking first and explaining why.

## 4. Design concept

**Idea: the page behaves like a quality inspection.** The hero shows this portfolio "tested on desktop" and "tested on mobile", sections "pass" into view as you scroll, the STLC rail fills stage by stage, and a progress bar tracks the read. Modern and warm, with a tester's eye for detail. The source design is `design-reference.html` (v6) in the project root.

**Look (v6):** navy background with soft emerald glows, an emerald accent and a gold accent (gold gradient words in h2 headings, gold eyebrows). Cards are glass: translucent `--card`, 1px `--line` border, `backdrop-filter: blur(14px)`, generous radius. Outfit for headings, Inter for body, Playfair Display italic only for the "Hello, I'm" line. Pill-shaped chips and buttons; solid buttons are an emerald gradient.

**Signature elements**
- **Hero (centred):** "Hello, I'm" line, gold "Dulmi" + "Hettiarachchi" rise in; a typewriter role line cycles through her testing focus areas; light streaks, a dotted background and a soft spotlight that follows the mouse; a decorative laptop + phone mock-up of this portfolio (her photo in every photo spot if `src/assets/dulmi.jpg` exists, resized to WebP at build time, otherwise "DH") that floats, with a rotating dashed ring, a mouse tilt and two "Tested on desktop / mobile" chips; 4 glass service cards; a stats bar with count-up; a gold tagline.
- **Skills marquee** between About and Skills (decorative, `aria-hidden`).
- **Technical skills** as 4 tabs (real ARIA tabs), **soft skills** as 5 cards, each backed by evidence from her experience.
- **Projects:** a featured "Testing my own portfolio" QA case study (test case table illustration where every case shows "Pass", animated border, links to `docs/qa/test-cases.md`, `docs/qa/bug-reports.md` and the repository), then the two MobiOS Private Limited projects with SVG illustrations and a gentle 3D tilt.
- **Process:** the 6 STLC stages on a rail that fills as you scroll.
- **Bug hunt game:** 5 hidden bug buttons (one each in Hero, Skills, Process, Education, Writing), a "Bugs found" counter, a toast per bug and a finish dialog with confetti. Hidden without JS.

### Do not use
Purple gradients, glassmorphism, neon on black, cream + serif + rust, emoji icons, ALL-CAPS tracked labels, stock photos, parallax, auto-playing audio or video.

## 5. Design tokens

### Colour (light / dark)
Values come from the `:root` block of `design-reference.html` (v6). They live in `src/styles/global.css`: light on `:root`, dark in both the `prefers-color-scheme: dark` block and `[data-theme="dark"]` (keep those two identical).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f3f6f8` | `#071423` | Page background (under two soft emerald radial glows) |
| `--bg2` | `#ffffff` | `#0a1a2d` | Alternate sections (at 70% opacity), nav tab bar, chrome |
| `--card` | `rgba(255,255,255,.85)` | `rgba(255,255,255,.045)` | Glass cards (with blur) |
| `--surface` | `#ffffff` | `#0c1d31` | Opaque popovers over content: email menu, toast, bug counter, finish dialog |
| `--ink` | `#0d1b2a` | `#eef3f8` | Main text |
| `--mute` | `#4b5b6e` | `#9fb0c3` | Secondary text |
| `--line` | `#dbe3ea` | `rgba(255,255,255,.1)` | Borders and dividers |
| `--g` | `#09714c` | `#2fd39a` | Emerald accent: links, active tab, focus ring, ticks |
| `--g2` | `#e0f3ea` | `rgba(47,211,154,.12)` | Mint panels: pills, badges, icon tiles |
| `--gtxt` | `#ffffff` | `#04241a` | Text on `--g` fills |
| `--gold` | `#815a27` | `#e2bd7f` | Eyebrows, tagline, gold words in light theme |
| `--goldg` | `linear-gradient(100deg,#f3d9a4,#d6a35d 45%,#b07a3c)` | same | Gold gradient text (dark theme only) |
| `--gcard` | `rgba(255,255,255,.75)` | `rgba(255,255,255,.07)` | Hero service cards |
| `--amber` | `#b45309` | `#fbbf24` | Bug hunt only |

- **AA adjustments to the reference (light theme only):** `--g` is darkened from `#0a7f55` (4.35:1 on `--g2`) to `#09714c`, and `--gold` from `#9a6b2f` (4.28:1 on `--bg`) to `#815a27`, so small text passes 4.5:1 on `--bg`, `--g2` and the emerald glow. The gold gradient is too pale on light backgrounds, so in light theme `h2 .hl` and `.goldtext` ("Dulmi", stats numbers) use solid `--gold`. The highlighted hero service card uses a solid navy-emerald fill in light theme so its white text passes.
- **Fixed colours:** `.btn.solid` is `linear-gradient(135deg,#34d9a1,#13a874)` with `#03241a` text (5.5:1) in both themes. The laptop/phone mock-up keeps its dark "screen" colours in both themes; it is decorative (`aria-hidden`).
- **Theme:** the default follows the system setting (`prefers-color-scheme`). A sun/moon toggle button in the nav switches light/dark and saves the choice in `localStorage` (`theme` key, wrapped in try/catch). A tiny inline script in `<head>` sets `data-theme="light" | "dark"` on `<html>` before first paint, so there is no flash of the wrong theme. Tokens and the Tailwind `dark:` variant respond to `data-theme`, and fall back to the system setting when JS is off (the toggle is then hidden). Until the visitor chooses, live system changes are followed.
- Toggle accessibility: a real `<button>` with a fixed `aria-label="Dark theme"` and `aria-pressed` (true in dark).
- All text must pass WCAG AA contrast (4.5:1 body, 3:1 large text). Check both themes.

### Typography
- Headings: **Outfit** 300–800 (variable), line-height 1.12, `text-wrap: balance`.
- "Hello, I'm" line only: **Playfair Display** italic 500, `clamp(22px, 2.6vw, 30px)`.
- Body and UI: **Inter** 400–700, 16px / 1.6.
- Sizes: H1 name `clamp(40px, 7vw, 84px)` · H2 `clamp(30px, 4vw, 42px)` · H3 17–24px · small 13–14px. Nothing below 13px except text inside the decorative laptop/phone mock-up (`aria-hidden`, it scales with the picture).
- Use `font-variant-numeric: tabular-nums` for stats, dates and counters.

### Layout and spacing
- Mobile-first. Content max width 1180px (`.wrap`, side padding `max(5vw, 16px)`). Section padding `clamp(60px, 8vw, 100px)` vertical.
- Section headers: centred emerald eyebrow (short rule + label), H2 with one emerald phrase, optional muted subtitle.
- Radius: 999px buttons, tabs and chips; 16–26px cards.
- Breakpoints: 1440px (nav on one row from here) · 1020px (grids drop to 2–3 columns) · 860px (one column) · 820px (hero service cards 2×2, stats bar wraps, floating chips hidden) · 560px (phone).

### Components
- **Button:** min-height 46px, pill; solid = emerald fill with `--gtxt` text; outline = 1.5px emerald. Focus ring 3px `--g`, offset 3px.
- **Chip:** small pill with a 1px border.
- **Card:** `--card` background, 1px `--line` border.
- **Tick list:** emerald check icon instead of bullets.
- **Icons:** 24×24 line icons from the sprite, 1.8 stroke.

## 6. Page structure (in this order)

1. **Nav** (sticky): "DH Dulmi" logo; 8 tabs with icons (Home, About, Skills, Experience, Projects, Process, Education, Writing) with the active tab highlighted (`aria-current`); theme toggle; "Contact me" button; 3px scroll progress bar on top. From 1440px everything sits on one row; below that the tabs move to a second row that scrolls sideways and keeps the active tab in view.
2. **Hero** (`#top`, centred): "Open to QA roles · available now" pill · H1 "Hello, I'm Dulmi Hettiarachchi" ("Hello, I'm" in Playfair italic, gold "Dulmi") · role line with typewriter · intro · View my work + Download CV · LinkedIn, GitHub, Medium, Email icon links (no email text) · bug hunt note · laptop + phone scene with "Tested on desktop" and "Tested on mobile" chips · 4 glass service cards (Manual testing, API testing, RBAC & security, Regression) · stats bar with 4 count-up stats derived in `src/data/figures.ts` (6 months, 2 platforms, 8 user roles across 2 platforms, 4 articles) and Contact me · gold tagline "Careful · Curious · Clear · Reliable".
3. **About:** story card with Download CV and Get in touch, 6 fact cards. (The stats live in the hero bar only.)
4. **Skills marquee.**
5. **Skills:** technical skills tabs (Testing, API & security, Programming & tools, Process) and 5 soft skills cards.
6. **Experience:** QA Engineer Intern at MobiOS Private Limited, dates and tick list.
7. **Projects:** "Testing my own portfolio" case study, Coupon Management System, Marketplace Platform. Public QA projects: add when built.
8. **Process:** 6 STLC stages with the scroll-driven rail.
9. **Education & certifications:** education timeline (BSc badge "Final-year exams completed · 2026"), LinkedIn Learning certificates (real links), languages.
10. **Writing:** the 4 Medium articles.
11. **Leadership & activities:** 4 cards.
12. **Contact:** invitation line and Email, LinkedIn, GitHub, Medium.
13. **Footer:** copyright and degree line.
14. **Research** (`TODO:` — "Dark patterns" research; add only after I give the details. Do not create placeholder text for it.)

Download CV buttons link to `/Dulmi-Hettiarachchi-CV.pdf` and open in a new tab (`rel="noopener noreferrer"`).

**Email links** (hero icon, contact card) use `EmailMenu.astro`, never a bare `mailto:`: a menu button opens an accessible menu with "Open in Gmail" (compose link, new tab), "Open email app" (`mailto:`) and "Copy email address" (shows "Copied!" for 2 seconds). It closes on Escape, outside click and after a choice, and the address stays visible as text next to the button. Without JS the trigger falls back to a plain `mailto:` link.

## 7. Quality bar (non-negotiable)

- **Accessibility:** semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one H1, logical heading order, skip-to-content link, alt text, labelled links ("LinkedIn profile", not "click here"), keyboard-navigable (tabs with arrow/Home/End keys; bug buttons are real buttons; the finish dialog is a native `<dialog>` that traps focus and closes with Esc), visible focus, `lang="en"`.
- **Motion:** animations are allowed (entrance, typewriter, light streaks, floating devices, rotating ring, marquee, scroll reveals, tilt, confetti), but under `prefers-reduced-motion: reduce` everything is visible and still: no animation or transition, final numbers shown, all stages passed, no confetti. Tilt and spotlight only for a fine pointer. Without JS all content is visible (reveal-hidden states only apply once JS runs).
- **Performance:** no layout shift (CLS < 0.05; the typewriter must never change the role line's height), LCP < 2.0s on mobile, total JS under 15 KB, images in AVIF/WebP with width/height set.
- **SEO:** unique `<title>` and meta description, Open Graph + Twitter card image (1200×630), canonical URL, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema (name, jobTitle, alumniOf, sameAs links).
- **Links:** every external link opens correctly and uses `rel="noopener noreferrer"` when it has `target="_blank"`.
- **Tests:** Playwright at 360px, 768px and 1280px: smoke (page loads, no console errors, CV link returns 200, axe has no serious violations in both themes), nav, theme, every section's content against `src/data`, the content rules in Section 2, reduced motion, no-JS, and the bug hunt game. Tests run against the production build on port 4400.

## 8. How we work

- **One section per task.** Start every task in **plan mode**: show me the plan and the files you will touch, then wait for my OK.
- After each section: run `npm run build`, `npx astro check` and the Playwright tests. Fix any failures before saying it's done.
- **Commit after each completed section** with a clear message, e.g. `feat(experience): add internship with tick list`.
- Keep components small: `src/components/<Section>.astro`, data in `src/data/`, tokens in `src/styles/global.css`.
- If anything in this brief conflicts with a request, ask me before choosing.

## 9. Content facts (the only allowed source)

**Name:** Dulmi Hettiarachchi
**Headline:** Junior QA Engineer | Manual Testing | API Testing | Agile
**Location:** Sri Lanka
**Email:** hasardulmi@gmail.com
**LinkedIn:** https://www.linkedin.com/in/dulmi-hasarangi-21333b280 (display text: dulmi-hasarangi)
**GitHub:** https://github.com/hasardulmi
**Medium:** https://medium.com/@hasardulmi

**Summary:** QA Engineer with 6 months of hands-on experience in manual and functional testing of web-based applications; BSc (Hons) Management and Information Technology undergraduate at the University of Kelaniya, final-year exams completed (2026). Skilled in test case design, regression testing, defect tracking, RBAC validation and REST API testing with Postman. Strong understanding of STLC, bug life cycle and Agile collaboration, with a Java (OOP) foundation. Open to QA roles and available now.

**Experience — Quality Assurance Engineer Intern, MobiOS Private Limited (Sep 2025 – Feb 2026)**
- Manual and functional testing of multi-role web applications before release.
- Designed, documented and executed test cases covering different workflows and user roles.
- Logged and tracked defects through the bug life cycle (reproduction steps, expected vs actual, severity).
- Regression testing before feature releases.
- Validated user permissions (RBAC), workflows and data accuracy across multiple user roles.
- Worked with developers in an Agile team to reproduce issues and verify fixes.

**Project — Coupon Management System (multi-tenant platform), MobiOS Private Limited**
- Roles: Super Admin, Company Owner, Outlet Manager, Cashier.
- Verified RBAC: correct permissions and data privacy between tenants.
- End-to-end scenarios: company onboarding, coupon creation, redemption, reporting.
- Validated redemption logic across multiple outlets to prevent misuse; reported and tracked defects.

**Project — Marketplace Platform (e-commerce), MobiOS Private Limited**
- Roles: Super Admin, Vendor, Business Customer, Non-Business Customer.
- Verified vendor registration, customer creation, vendor-side product management.
- Validated order placement, quotation process and payment workflows; wrote test cases and reported defects.

**Project — Testing my own portfolio (solo QA case study, 2026)**
- Wrote the requirements, built the site with Claude Code (an AI coding assistant), then tested it as a QA engineer.
- Test plan and test cases for every section, on desktop and phone, in light and dark mode: `docs/qa/test-cases.md`.
- Bugs logged with steps, expected vs actual and severity, fixes retested: `docs/qa/bug-reports.md`.
- Reviewed every change and managed the work in Git, one commit per section.

**Skills**
- Testing: Manual, Functional, Regression, End-to-End, Test Case Design, Test Execution, Defect Reporting & Tracking, Bug Life Cycle, STLC, SDLC, Black Box, White Box.
- API & security: REST API testing (GET, POST, PUT, DELETE), Postman, JWT authentication & authorization, RBAC.
- Programming & tools: Java, OOP, Docker (basic), Git, GitHub.
- Methodologies: Agile, cross-functional team collaboration.
- Soft skills: attention to detail, problem solving, self-learning, teamwork, time management.

**Education**
- BSc (Hons) Management and Information Technology, University of Kelaniya — IT specialisation (2023 – present). Final-year exams completed · 2026.
- Diploma in English, Esoft Metro Campus (2021).
- G.C.E. A/L, Biology stream, Tangalle Girls' School (2021). Z-score 1.299.
- G.C.E. O/L, Debarawewa National College (2017). 9 A passes.

**Certifications (LinkedIn Learning)**
- API Testing — GET, POST, PUT and DELETE requests, with an introduction to performance and security testing — https://www.linkedin.com/learning/certificates/de46f512851e3adc028efad75950dc0e2922a8fdb87cc49cd6d6272e1e9821d7?trk=share_certificate
- Object-Oriented Programming in Java — classes, objects, constructors and Java OOP mechanisms — https://www.linkedin.com/learning/certificates/48713e270ce7e4d234a505520fa848da0596ecf1dc00256df3a2311846790dcd?trk=share_certificate

**Medium articles**
1. A Beginner's Guide to Black Box, White Box, and Experience-Based Testing — https://medium.com/@hasardulmi/a-beginners-guide-to-black-box-white-box-and-experience-based-testing-9af436506600
2. Foundations of Software Testing — STLC, test cases, bug reporting, functional and non-functional testing — https://medium.com/@hasardulmi/foundations-of-software-testing-8b6a873fb53d
3. Understanding JWT (JSON Web Token) — secure authentication and authorization in web applications — https://medium.com/@hasardulmi/understanding-jwt-json-web-token-86f7b886b57f
4. Docker for Beginners — containers, images and Dockerfiles for consistent deployment — https://medium.com/@hasardulmi/docker-for-beginners-9152ef6c6adc

**Leadership & activities**
- HackX 9.0 — Organizing Committee Member — startup ideas platform for undergraduates and industry experts, University of Kelaniya.
- hackxJR — Organizing Committee Member — Department of Industrial Management, University of Kelaniya.
- Exposition Issue 20 — Organizing Committee Member — celebrating 20 years of Management and IT.
- University clubs – LEO Club & LED Club – Member of both clubs at the University of Kelaniya.

**Languages:** Sinhala (native), English (professional working proficiency).

**CV PDF:** `public/Dulmi-Hettiarachchi-CV.pdf`

**Pending from Dulmi (leave as TODO):** GitHub repos to feature · public QA project(s) · Dark patterns research details · photo (optional, `src/assets/dulmi.jpg`; added, confirm it is the one to use) · custom domain (live on dulmi-portfolio.vercel.app until then; change only `site` in `astro.config.mjs`) · her real test cases and bug reports in `docs/qa/`.
