import { test, expect, type Page } from "@playwright/test";
import { profile } from "../src/data/profile";
import { glanceFigures, monthsInclusive } from "../src/data/figures";

/** Hero stacks below this width: keep in sync with src/components/Hero.astro. */
const STACK_BREAKPOINT = 860;

const { glance } = profile.hero;
const hero = (page: Page) => page.locator("section.hero");
const card = (page: Page) =>
  page.getByRole("group", { name: "Profile at a glance" });
const tag = (page: Page) => hero(page).locator(".tag");

test.describe("Hero content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows tag, name, role line, intro and location", async ({ page }) => {
    await expect(tag(page)).toHaveText(profile.hero.tag);
    await expect(
      hero(page).getByRole("heading", { level: 1, name: profile.name }),
    ).toBeVisible();
    await expect(hero(page).getByText(profile.hero.roleLine)).toBeVisible();
    await expect(hero(page).getByText(profile.hero.intro)).toBeVisible();
    await expect(hero(page).locator(".meta")).toHaveText(profile.location);
  });

  test("buttons link to the right places", async ({ page }) => {
    const h = hero(page);
    await expect(h.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "#contact",
    );
    await expect(
      h.getByRole("link", { name: "Download CV (PDF)" }),
    ).toHaveAttribute("href", "/Dulmi-Hettiarachchi-CV.pdf");
    await expect(
      h.getByRole("link", { name: "LinkedIn profile" }),
    ).toHaveAttribute("href", profile.contact.linkedin);
    await expect(
      h.getByRole("link", { name: "GitHub profile" }),
    ).toHaveAttribute("href", profile.contact.github);
  });

  test("buttons meet the 44px minimum target size", async ({ page }) => {
    const links = hero(page).locator(".actions a");
    await expect(links).toHaveCount(4);
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Get in touch scrolls to the contact section", async ({ page }) => {
    await hero(page).getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("section#contact")).toBeInViewport();
  });
});

test("CV link returns a PDF with status 200", async ({ request }) => {
  const response = await request.get(profile.cvUrl);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test.describe("Key figures are true to the CV data", () => {
  test("internship is 6 months (Sep 2025 – Feb 2026, inclusive)", () => {
    const { start, end } = profile.experience[0];
    expect(monthsInclusive(start, end)).toBe(6);
  });

  test("figures are 6 months, 2 platforms, 8 user roles", () => {
    const figures = glanceFigures(profile);
    expect(figures.map((f) => `${f.value} ${f.unit}`)).toEqual([
      "6 months",
      "2 platforms",
      "8 user roles",
    ]);
    // 8 counts roles per platform (Super Admin is on both): the label must say so.
    expect(figures[2].label).toBe("validated across 2 platforms (RBAC)");
  });
});

test.describe("Profile at a glance card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the three key figures with their labels", async ({ page }) => {
    const figures = card(page).locator(".figure");
    await expect(figures).toHaveCount(3);
    for (const [i, f] of glanceFigures(profile).entries()) {
      await expect(figures.nth(i).locator(".figure-number")).toHaveText(
        String(f.value),
      );
      await expect(figures.nth(i).locator(".figure-unit")).toHaveText(f.unit);
      await expect(figures.nth(i).locator("dt")).toHaveText(f.label);
    }
    await expect(figures.nth(0).locator("dt")).toHaveText(
      "QA Engineer Intern at MobiOS",
    );
  });

  test("lists the core strengths as a tick list", async ({ page }) => {
    const list = card(page).getByRole("list", { name: "Core strengths" });
    await expect(list.getByRole("listitem")).toHaveText(glance.strengths);
  });

  test("shows only the CV tools", async ({ page }) => {
    const tools = card(page).locator("[data-tools]");
    // innerText = what is actually rendered, so missing spaces are caught.
    expect(await tools.innerText()).toBe(
      "Tools: Postman · Git · GitHub · Java",
    );
  });

  test("ends with the degree line, abbreviation expanded", async ({ page }) => {
    const degree = card(page).locator("[data-degree]");
    await expect(degree).toHaveText(
      "Final-year BSc (Hons) MIT, University of Kelaniya",
    );
    await expect(degree.locator("abbr")).toHaveAttribute(
      "title",
      "Management and Information Technology",
    );
  });

  test("is static: no script, no test-run animation", async ({ page }) => {
    await expect(card(page).locator("script")).toHaveCount(0);
    await expect(page.locator("[data-test-run]")).toHaveCount(0);
    await expect(hero(page).locator("script")).toHaveCount(0);
  });

  test("content fits inside the card (no horizontal overflow)", async ({
    page,
  }) => {
    const overflow = await card(page).evaluate(
      (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test("hero causes no layout shift", async ({ page }) => {
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
  await page.waitForTimeout(500);
  const cls = await page.evaluate(
    () => (window as unknown as { cls: number }).cls,
  );
  expect(cls).toBeLessThan(0.05);
});

test("card sits beside the text from 860px, below it on narrower screens", async ({
  page,
}) => {
  await page.goto("/");
  const text = await hero(page).locator(".hero-text").boundingBox();
  const box = await card(page).boundingBox();
  expect(text && box).toBeTruthy();
  const width = page.viewportSize()?.width ?? 0;
  if (width < STACK_BREAKPOINT) {
    expect(box!.y).toBeGreaterThanOrEqual(text!.y + text!.height);
  } else {
    expect(box!.x).toBeGreaterThanOrEqual(text!.x + text!.width);
  }
});

/** WCAG relative luminance from a computed "rgb(r, g, b)" string. */
function luminance(rgb: string): number {
  const [r, g, b] = (rgb.match(/\d+(\.\d+)?/g) ?? []).map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`"Open to QA roles" tag is green and meets AA contrast (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    const c = await tag(page).evaluate((el) => {
      const s = getComputedStyle(el);
      const band = getComputedStyle(el.closest("section")!);
      const root = getComputedStyle(document.documentElement);
      const probe = (v: string) => {
        const d = document.createElement("div");
        d.style.color = `var(${v})`;
        document.body.append(d);
        const out = getComputedStyle(d).color;
        d.remove();
        return out;
      };
      return {
        fg: s.color,
        bg: s.backgroundColor,
        band: band.backgroundColor,
        border: s.borderTopColor,
        green: probe("--green"),
        red: probe("--red"),
        rootGreen: root.getPropertyValue("--green").trim(),
      };
    });
    expect(c.rootGreen).not.toBe("");
    expect(c.fg).toBe(c.green);
    expect(c.border).toBe(c.green);
    expect(c.border).not.toBe(c.red);
    // Text on the tag's own background, and the outline against the hero band.
    expect(contrast(c.fg, c.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.border, c.band)).toBeGreaterThanOrEqual(3);
  });
}
