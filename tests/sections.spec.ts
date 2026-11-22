import fs from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import { profile } from "../src/data/profile";
import { keyFigures, monthsInclusive } from "../src/data/figures";
import { sectionIds } from "../src/data/site";

const section = (page: Page, id: string) => page.locator(`section#${id}`);
const bodyText = async (page: Page) =>
  (await page.locator("body").innerText()).replace(/\s+/g, " ");

test.describe("Page structure and content rules", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("sections appear in the agreed order", async ({ page }) => {
    const ids = await page
      .locator("main > section, main > .marq")
      .evaluateAll((els) => els.map((el) => el.id).filter(Boolean));
    expect(ids).toEqual([...sectionIds]);
  });

  test("one H1, and every section has a heading", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Hi, I'm Dulmi Hettiarachchi");
    for (const id of sectionIds.filter((id) => id !== "top")) {
      await expect(section(page, id).locator("h2")).toHaveCount(1);
    }
  });

  test("location is Sri Lanka only, never Gampaha", async ({ page }) => {
    const html = await page.content();
    expect(html).not.toMatch(/gampaha/i);
    expect(profile.location).toBe("Sri Lanka");
  });

  test('the company is always "MobiOS Private Limited"', async ({ page }) => {
    const text = await bodyText(page);
    expect(text).toContain("MobiOS Private Limited");
    expect(text).not.toMatch(/MobiOS(?! Private Limited)/);
    // Accessible names too.
    const html = await page.content();
    expect(html).not.toMatch(/MobiOS(?! Private Limited)/);
  });

  test("build tools are not presented as her skills", async ({ page }) => {
    const text = await bodyText(page);
    for (const tool of ["Astro", "TypeScript", "Tailwind", "Playwright"]) {
      expect(text).not.toContain(tool);
    }
    await expect(section(page, "projects")).toContainText(
      "Built with Claude Code",
    );
  });

  test("leadership: clubs card and no prefect line", async ({ page }) => {
    const clubs = section(page, "leadership").locator("li", {
      hasText: "University clubs",
    });
    await expect(clubs.locator("small")).toHaveText("University clubs");
    await expect(clubs.locator("h3")).toHaveText("LEO Club & LED Club");
    await expect(clubs.locator("p")).toHaveText(
      "Member of both clubs at the University of Kelaniya.",
    );
    await expect(section(page, "leadership").locator("li")).toHaveCount(4);
    expect(await bodyText(page)).not.toMatch(/prefect/i);
  });

  test("every Download CV link opens the PDF in a new tab", async ({
    page,
  }) => {
    const cv = page.locator('a[href$=".pdf"]');
    await expect(cv).toHaveCount(2);
    for (const link of await cv.all()) {
      await expect(link).toHaveAttribute("href", "/Dulmi-Hettiarachchi-CV.pdf");
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAccessibleName(
        "Download CV (PDF, opens in a new tab)",
      );
    }
  });

  test('every target="_blank" link has rel="noopener noreferrer"', async ({
    page,
  }) => {
    for (const link of await page.locator('a[target="_blank"]').all()) {
      const rel = (await link.getAttribute("rel")) ?? "";
      expect(rel.split(" ")).toEqual(
        expect.arrayContaining(["noopener", "noreferrer"]),
      );
    }
  });

  test("all external links point at the CV facts", async ({ page }) => {
    const hrefs = await page
      .locator('a[href^="http"], a[href^="mailto:"]')
      .evaluateAll((els) => els.map((a) => a.getAttribute("href")!));
    const allowed = new Set<string>([
      profile.contact.linkedin,
      profile.contact.github,
      profile.contact.medium,
      `mailto:${profile.contact.email}`,
      profile.contact.gmail,
      ...profile.articles.map((a) => a.url),
      ...profile.certifications.map((c) => c.url),
      ...profile.caseStudy.links.map((l) => l.href),
    ]);
    for (const href of hrefs) expect(allowed).toContain(href);
  });

  test("every in-page link has a target", async ({ page }) => {
    const ids = await page
      .locator('a[href^="#"]')
      .evaluateAll((els) => els.map((a) => a.getAttribute("href")!.slice(1)));
    for (const id of new Set(ids)) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }
  });
});

test("CV link returns a PDF with status 200", async ({ request }) => {
  const response = await request.get(profile.cvUrl);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test.describe("Hero", () => {
  test("shows the tag, role line, intro and buttons", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = section(page, "top");
    await expect(hero.locator(".open")).toHaveText(profile.hero.tag);
    await expect(hero.locator("[data-type]")).toHaveText(
      profile.hero.typewriter[0],
    );
    await expect(hero.getByText(profile.hero.intro)).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "View my work" }),
    ).toHaveAttribute("href", "#projects");
    for (const [name, href] of [
      ["LinkedIn profile", profile.contact.linkedin],
      ["GitHub profile", profile.contact.github],
      ["Medium articles", profile.contact.medium],
    ]) {
      await expect(
        hero.getByRole("link", { name, exact: true }),
      ).toHaveAttribute("href", href);
    }
  });

  test("photo frame shows the photo if it exists, otherwise DH", async ({
    page,
  }) => {
    await page.goto("/");
    const frame = page.locator("[data-photo]");
    if (fs.existsSync("public/dulmi.jpg")) {
      await expect(frame.locator("img")).toHaveAttribute("src", "/dulmi.jpg");
    } else {
      await expect(frame.locator("img")).toHaveCount(0);
      await expect(frame.locator(".face strong")).toHaveText("DH");
    }
  });

  test("the 9 skills sit around the photo, inside the screen", async ({
    page,
  }) => {
    await page.goto("/");
    const skills = page.locator("[data-photo] .sk");
    await expect(skills).toHaveText(profile.hero.orbit.map((s) => s.label));
    const width = page.viewportSize()!.width;
    for (const skill of await skills.all()) {
      const box = (await skill.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  });

  test("typing never changes the height of the role line", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const heights = await page.evaluate((words) => {
      const type = document.querySelector<HTMLElement>("[data-type]")!;
      const role = type.closest("p")!;
      const out = [];
      for (const w of ["", ...words]) {
        type.textContent = w;
        out.push(role.getBoundingClientRect().height);
      }
      return out;
    }, profile.hero.typewriter);
    expect(new Set(heights).size).toBe(1);
  });

  test("the typewriter types the next phrase", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-type]")).toHaveText(
      profile.hero.typewriter[1],
      { timeout: 8000 },
    );
  });
});

test("no layout shift while the page animates", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { cls: number };
    w.cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
      }[]) {
        if (!entry.hadRecentInput) w.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Long enough for the typewriter to delete and retype a phrase.
  await page.waitForTimeout(5000);
  const cls = await page.evaluate(
    () => (window as unknown as { cls: number }).cls,
  );
  expect(cls).toBeLessThan(0.05);
});

test.describe("About", () => {
  test("stats are derived from the data and count up to the right value", async ({
    page,
  }) => {
    const { start, end } = profile.experience[0];
    expect(monthsInclusive(start, end)).toBe(6);
    const figures = keyFigures(profile);
    expect(figures.map((f) => f.value)).toEqual([6, 2, 8, 4]);
    expect(figures[0].label).toBe(
      "months as a QA Engineer Intern at MobiOS Private Limited",
    );
    expect(figures[2].label).toBe("user roles validated across 2 platforms");

    await page.goto("/");
    const stats = page.locator("[data-stats] li");
    await stats.last().scrollIntoViewIfNeeded();
    for (const [i, f] of figures.entries()) {
      await expect(stats.nth(i).locator("b")).toHaveText(String(f.value));
      await expect(stats.nth(i).locator("span")).toHaveText(f.label);
    }
  });

  test("story card and the 6 facts", async ({ page }) => {
    await page.goto("/");
    const about = section(page, "about");
    await expect(about.getByText(profile.about.lead)).toBeAttached();
    await expect(about.locator(".fact")).toHaveCount(6);
    await expect(about.locator(".fact.on")).toContainText(
      "Open to QA roles, available now",
    );
  });
});

test.describe("Skills tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const tabs = (page: Page) =>
    page
      .getByRole("tablist", { name: "Technical skill groups" })
      .getByRole("tab");

  test("show one group at a time, by click", async ({ page }) => {
    await expect(tabs(page)).toHaveText(profile.skills.map((g) => g.tab));
    for (const [i, group] of profile.skills.entries()) {
      await tabs(page).nth(i).click();
      await expect(tabs(page).nth(i)).toHaveAttribute("aria-selected", "true");
      const panel = page.getByRole("tabpanel");
      await expect(panel).toHaveCount(1);
      await expect(panel).toHaveAccessibleName(group.tab);
      await expect(panel.locator("li")).toHaveText(group.items);
    }
  });

  test("work with the arrow, Home and End keys", async ({ page }) => {
    const last = profile.skills.length - 1;
    await tabs(page).first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs(page).nth(1)).toBeFocused();
    await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs(page).nth(last)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabs(page).first()).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs(page).nth(last)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs(page).first()).toHaveAttribute("aria-selected", "true");
    // Only the selected tab is in the Tab order; Tab moves on to the panel.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();
  });

  test("soft skills: 5 cards", async ({ page }) => {
    await expect(section(page, "skills").locator(".sc h4")).toHaveText(
      profile.softSkills.map((s) => s.title),
    );
  });
});

test.describe("Experience, projects, process", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("experience card", async ({ page }) => {
    const exp = section(page, "experience");
    await expect(exp.locator("h3")).toHaveText(
      "Quality Assurance Engineer Intern",
    );
    await expect(exp.locator(".org")).toHaveText("MobiOS Private Limited");
    await expect(exp.locator(".pill")).toHaveText("Sep 2025 – Feb 2026");
    await expect(exp.locator(".ticks li")).toHaveCount(6);
  });

  test("the QA case study comes first and every test case passes", async ({
    page,
  }) => {
    const cards = section(page, "projects").locator("article");
    await expect(cards.locator("h3")).toHaveText([
      "Testing my own portfolio",
      "Coupon Management System",
      "Marketplace Platform",
    ]);
    const status = page.locator("[data-testcases] [data-status]");
    await expect(status).toHaveCount(profile.caseStudy.testCases.length);
    await expect(status).toHaveText(
      profile.caseStudy.testCases.map(() => "Pass"),
    );
    const links = cards.first().getByRole("link");
    await expect(links).toHaveText(["Test cases", "Bug reports", "Code"]);
    await expect(links.nth(0)).toHaveAttribute(
      "href",
      /\/blob\/main\/docs\/qa\/test-cases\.md$/,
    );
    await expect(links.nth(1)).toHaveAttribute(
      "href",
      /\/blob\/main\/docs\/qa\/bug-reports\.md$/,
    );
    // The linked files exist in the repository.
    expect(fs.existsSync("docs/qa/test-cases.md")).toBe(true);
    expect(fs.existsSync("docs/qa/bug-reports.md")).toBe(true);
  });

  test("STLC: 6 stages, all passed under reduced motion", async ({ page }) => {
    const stages = section(page, "process").locator("[data-stage]");
    await expect(stages.locator("h3")).toHaveText(
      profile.process.map((s, i) => `Stage ${i + 1}: ${s.title}`),
    );
    for (const stage of await stages.all()) {
      await expect(stage).toHaveClass(/\bon\b/);
    }
  });
});

test.describe("Education, writing, contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("education timeline, certificates and languages", async ({ page }) => {
    const edu = section(page, "education");
    await expect(edu.locator(".ev h4")).toHaveText(
      profile.education.map((e) => e.qualification),
    );
    await expect(edu.locator(".ev.now .badge")).toHaveText(
      "Final-year exams completed · 2026",
    );
    const certs = edu.locator("a.cert");
    for (const [i, c] of profile.certifications.entries()) {
      await expect(certs.nth(i)).toHaveAttribute("href", c.url);
      await expect(certs.nth(i).locator("h4")).toHaveText(c.name);
    }
    expect(
      profile.certifications.every((c) =>
        c.url.includes("linkedin.com/learning/certificates/"),
      ),
    ).toBe(true);
    await expect(edu.locator("dt")).toHaveText(["Sinhala", "English"]);
  });

  test("4 Medium articles link to the right posts", async ({ page }) => {
    const posts = section(page, "writing").locator("a.post");
    await expect(posts).toHaveCount(4);
    for (const [i, a] of profile.articles.entries()) {
      await expect(posts.nth(i)).toHaveAttribute("href", a.url);
      await expect(posts.nth(i).locator("h3")).toHaveText(a.title);
    }
  });

  test("footer text keeps its spaces", async ({ page }) => {
    // Formatting tools can silently drop spaces around inline elements.
    const text = (await page.locator("footer").innerText()).replace(
      /\s+/g,
      " ",
    );
    expect(text).toContain(
      "BSc (Hons) MIT · University of Kelaniya · final exams completed",
    );
    await expect(page.locator("footer abbr")).toHaveAttribute(
      "title",
      "Management and Information Technology",
    );
  });

  test("contact links", async ({ page }) => {
    const contact = section(page, "contact");
    // Email is a menu button (see email.spec.ts); the rest are links.
    await expect(
      contact.getByRole("button", { name: `Email ${profile.contact.email}` }),
    ).toBeVisible();
    const links = contact.getByRole("link");
    await expect(links).toHaveCount(3);
    for (const [i, href] of [
      profile.contact.linkedin,
      profile.contact.github,
      profile.contact.medium,
    ].entries()) {
      await expect(links.nth(i)).toHaveAttribute("href", href);
    }
  });
});

test.describe("Reduced motion and no JavaScript", () => {
  test("under reduced motion everything is visible and nothing moves", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(300);
    const result = await page.evaluate(() => {
      const all = [...document.querySelectorAll<HTMLElement>("body *")];
      return {
        moving: all
          .filter((el) => getComputedStyle(el).animationName !== "none")
          .map((el) => el.className),
        hidden: [...document.querySelectorAll(".rv")]
          .filter((el) => getComputedStyle(el).opacity !== "1")
          .map((el) => el.className),
      };
    });
    expect(result.moving).toEqual([]);
    expect(result.hidden).toEqual([]);
    await expect(page.locator("[data-type]")).toHaveText(
      profile.hero.typewriter[0],
    );
  });

  test("without JavaScript all content shows and the game is hidden", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    // All 4 skill groups are listed, and nothing waits for a reveal.
    for (const g of profile.skills) {
      await expect(
        page.getByRole("heading", { name: g.title, exact: true }),
      ).toBeVisible();
    }
    const hidden = await page
      .locator(".rv")
      .evaluateAll(
        (els) =>
          els.filter((el) => getComputedStyle(el).opacity !== "1").length,
      );
    expect(hidden).toBe(0);
    await expect(page.locator("[data-bug]").first()).toBeHidden();
    await expect(page.locator("[data-hunt]")).toBeHidden();
    await expect(page.getByRole("tablist")).toBeHidden();
    await context.close();
  });
});
