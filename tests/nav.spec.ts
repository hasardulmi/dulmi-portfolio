import { test, expect, type Page } from "@playwright/test";
import { navLinks } from "../src/data/site";

/** Tabs share the first row from this width; below it they get a second, scrollable row (Nav.astro). */
const ONE_ROW_MIN = 1440;

const mainNav = (page: Page) => page.getByRole("navigation", { name: "Main" });
const header = (page: Page) => page.locator("[data-site-header]");
const tabBar = (page: Page) => page.locator("[data-nav-links]");

// Instant scrolling, so positions can be measured straight after a click.
test.use({ reducedMotion: "reduce" });

test.describe("Nav", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the 8 tabs with icons and a Contact me button", async ({
    page,
  }) => {
    const tabs = tabBar(page).getByRole("link");
    await expect(tabs).toHaveText(navLinks.map((l) => l.label));
    for (const tab of await tabs.all()) {
      await expect(tab.locator("svg")).toHaveCount(1);
    }
    await expect(
      mainNav(page).getByRole("link", { name: "Contact me" }),
    ).toHaveAttribute("href", "#contact");
  });

  test("each tab scrolls to its section, clear of the sticky header, and becomes active", async ({
    page,
  }) => {
    for (const link of navLinks) {
      const tab = mainNav(page).getByRole("link", { name: link.label });
      await tab.click();
      await expect(page).toHaveURL(new RegExp(`${link.href}$`));

      const heading = page.locator(`${link.href} :is(h1, h2)`).first();
      await expect(heading).toBeInViewport();
      const bar = await header(page).boundingBox();
      const target = await heading.boundingBox();
      expect(target!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height);

      await expect(tab).toHaveAttribute("aria-current", "true");
      await expect(tab).toHaveClass(/\bon\b/);
      await expect(tabBar(page).locator('[aria-current="true"]')).toHaveCount(
        1,
      );
    }
  });

  test("Contact me scrolls to the contact section", async ({ page }) => {
    await mainNav(page).getByRole("link", { name: "Contact me" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact h2")).toBeInViewport();
  });

  test("header stays at the top while scrolling", async ({ page }) => {
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const box = await header(page).boundingBox();
    expect(box?.y).toBe(0);
  });

  test("progress bar grows with the scroll position", async ({ page }) => {
    const scale = () =>
      page
        .locator("[data-progress]")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await scale()).toBe(0);
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect.poll(scale).toBeCloseTo(1, 2);
  });

  test("interactive targets are at least 44px tall", async ({ page }) => {
    const targets = mainNav(page).locator("a, button");
    const count = await targets.count();
    expect(count).toBe(navLinks.length + 3);
    for (let i = 0; i < count; i++) {
      const box = await targets.nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("keyboard reaches the name, every tab, the theme toggle and Contact me", async ({
    page,
  }) => {
    const order = [
      page.getByRole("link", { name: "Skip to content" }),
      mainNav(page).getByRole("link", { name: "Dulmi Hettiarachchi" }),
      ...navLinks.map((l) =>
        mainNav(page).getByRole("link", { name: l.label }),
      ),
      page.getByRole("button", { name: "Dark theme" }),
      mainNav(page).getByRole("link", { name: "Contact me" }),
    ];
    for (const target of order) {
      await page.keyboard.press("Tab");
      await expect(target).toBeFocused();
    }
  });

  test("tabs sit on a second, sideways-scrolling row on smaller screens", async ({
    page,
  }) => {
    const width = page.viewportSize()!.width;
    const logo = await mainNav(page)
      .getByRole("link", { name: "Dulmi Hettiarachchi" })
      .boundingBox();
    const bar = await tabBar(page).boundingBox();
    if (width < ONE_ROW_MIN) {
      expect(bar!.y).toBeGreaterThanOrEqual(logo!.y + logo!.height);
    }
    // The row may scroll, but the page never does.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(bar!.x + bar!.width).toBeLessThanOrEqual(width);
  });

  test("the active tab is scrolled into view in the second row", async ({
    page,
  }) => {
    test.skip(
      page.viewportSize()!.width > 700,
      "Only narrow screens hide tabs off to the side",
    );
    await page.locator("#writing").scrollIntoViewIfNeeded();
    const tab = mainNav(page).getByRole("link", { name: "Writing" });
    await expect(tab).toHaveAttribute("aria-current", "true");
    await expect(tab).toBeInViewport({ ratio: 1 });
  });
});

test(`all tabs fit on the first row from ${ONE_ROW_MIN}px`, async ({
  page,
}) => {
  await page.setViewportSize({ width: ONE_ROW_MIN, height: 900 });
  await page.goto("/");
  const box = await header(page).boundingBox();
  expect(box!.height).toBeLessThanOrEqual(80);
});

test("tabs stay visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("/");
  for (const link of navLinks) {
    await expect(
      mainNav(page).getByRole("link", { name: link.label }),
    ).toBeAttached();
  }
  await expect(page.getByRole("button", { name: "Dark theme" })).toBeHidden();
  await context.close();
});
