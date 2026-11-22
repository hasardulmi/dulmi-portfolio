import { test, expect, type Page } from "@playwright/test";
import { profile } from "../src/data/profile";

/** Hero stacks below this width: keep in sync with src/components/Hero.astro. */
const STACK_BREAKPOINT = 860;
/** Animation budget from CLAUDE.md §4. */
const RUN_BUDGET_MS = 2500;

const total = profile.hero.testRun.length;
const hero = (page: Page) => page.locator("section.hero");
const panel = (page: Page) => page.locator("[data-test-run]");
const badges = (page: Page) => panel(page).locator("[data-badge]");

test.describe("Hero content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows tag, name, role line, intro and location/degree", async ({
    page,
  }) => {
    await expect(hero(page).getByText(profile.hero.tag)).toBeVisible();
    await expect(
      hero(page).getByRole("heading", { level: 1, name: profile.name }),
    ).toBeVisible();
    await expect(hero(page).getByText(profile.hero.roleLine)).toBeVisible();
    await expect(hero(page).getByText(profile.hero.intro)).toBeVisible();
    await expect(hero(page).getByText(profile.location)).toBeVisible();
    await expect(hero(page).getByText(profile.hero.degreeLine)).toBeVisible();
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

  test("lists every test case as real text", async ({ page }) => {
    const rows = panel(page).locator("[data-tc]");
    await expect(rows).toHaveCount(total);
    for (const [i, tc] of profile.hero.testRun.entries()) {
      await expect(rows.nth(i)).toContainText(tc.id);
      await expect(rows.nth(i)).toContainText(tc.title);
    }
  });
});

test("CV link returns a PDF with status 200", async ({ request }) => {
  const response = await request.get(profile.cvUrl);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test.describe("Test-run animation", () => {
  test("starts Queued and reaches all Passed within the time budget", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // The run has been reset before first paint.
    await expect(panel(page).locator('[data-state="queued"]')).not.toHaveCount(
      0,
    );

    await page.waitForFunction(
      (n) => document.querySelector("[data-count]")?.textContent === String(n),
      total,
      { timeout: RUN_BUDGET_MS },
    );
    const doneAt = await page.evaluate(() => performance.now());
    expect(doneAt).toBeLessThan(RUN_BUDGET_MS);

    await expect(badges(page)).toHaveText(Array(total).fill("Passed"));
    await expect(panel(page).locator("[data-run-summary]")).toHaveText(
      `${total}/${total} passed`,
    );
    // The bar's last 0.2s transition settles at full width.
    await expect
      .poll(() =>
        panel(page)
          .locator("[data-bar]")
          .evaluate((el) => getComputedStyle(el).transform),
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test("reduced motion: everything is Passed from the start", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    // Record any Queued state ever being set.
    await page.addInitScript(() => {
      const w = window as unknown as { sawQueued: boolean };
      w.sawQueued = false;
      new MutationObserver((records) => {
        for (const r of records) {
          if (
            r.target instanceof Element &&
            r.target.getAttribute("data-state") === "queued"
          ) {
            w.sawQueued = true;
          }
        }
      }).observe(document, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-state"],
      });
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(badges(page)).toHaveText(Array(total).fill("Passed"));
    await expect(panel(page).locator("[data-run-summary]")).toHaveText(
      `${total}/${total} passed`,
    );
    await page.waitForTimeout(800);
    const sawQueued = await page.evaluate(
      () => (window as unknown as { sawQueued: boolean }).sawQueued,
    );
    expect(sawQueued).toBe(false);
  });

  test("without JavaScript: everything is Passed", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(badges(page)).toHaveText(Array(total).fill("Passed"));
    await expect(panel(page).locator("[data-run-summary]")).toHaveText(
      `${total}/${total} passed`,
    );
    await context.close();
  });

  test("causes no layout shift", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
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
    await page.waitForFunction(
      (n) => document.querySelector("[data-count]")?.textContent === String(n),
      total,
    );
    await page.waitForTimeout(300);
    const cls = await page.evaluate(
      () => (window as unknown as { cls: number }).cls,
    );
    expect(cls).toBeLessThan(0.05);
  });
});

test.describe("Hero layout", () => {
  test("panel sits beside the text from 860px, below it on narrower screens", async ({
    page,
  }) => {
    await page.goto("/");
    const text = await hero(page).locator(".hero-text").boundingBox();
    const run = await panel(page).boundingBox();
    expect(text && run).toBeTruthy();
    const width = page.viewportSize()?.width ?? 0;
    if (width < STACK_BREAKPOINT) {
      expect(run!.y).toBeGreaterThanOrEqual(text!.y + text!.height);
    } else {
      expect(run!.x).toBeGreaterThanOrEqual(text!.x + text!.width);
    }
  });
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
  test(`Passed badge text meets 4.5:1 contrast (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("/");
    const colors = await badges(page)
      .first()
      .evaluate((el) => {
        const s = getComputedStyle(el);
        return { fg: s.color, bg: s.backgroundColor };
      });
    expect(contrast(colors.fg, colors.bg)).toBeGreaterThanOrEqual(4.5);
  });
}
