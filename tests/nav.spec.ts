import { test, expect, type Page } from "@playwright/test";
import { navLinks, sections } from "../src/data/site";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 600;

const mainNav = (page: Page) => page.getByRole("navigation", { name: "Main" });
const menuButton = (page: Page) =>
  mainNav(page).getByRole("button", { name: "Menu" });

test.describe("Nav", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("every section in site data exists with a heading", async ({ page }) => {
    for (const section of sections) {
      const el = page.locator(`section#${section.id}`);
      await expect(el).toHaveCount(1);
      await expect(el.getByRole("heading", { level: 2 })).toHaveText(
        section.title,
      );
    }
  });

  test("header fits on a single row", async ({ page }) => {
    // 44px targets + 2×10px padding + 1px border; a wrapped header is ~113px.
    const box = await page.locator("[data-site-header]").boundingBox();
    expect(box!.height).toBeLessThanOrEqual(70);
  });

  test("header stays at the top while scrolling", async ({ page }) => {
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const box = await page.locator("[data-site-header]").boundingBox();
    expect(box?.y).toBe(0);
  });

  test("each link scrolls to its section, clear of the sticky header", async ({
    page,
  }) => {
    for (const link of navLinks) {
      if (isMobile(page)) await menuButton(page).click();
      await mainNav(page).getByRole("link", { name: link.label }).click();
      await expect(page).toHaveURL(new RegExp(`${link.href}$`));

      const heading = page.locator(`${link.href} h2`);
      await expect(heading).toBeInViewport();
      const header = await page.locator("[data-site-header]").boundingBox();
      const target = await heading.boundingBox();
      expect(target!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    }
  });

  test("interactive targets are at least 44px tall", async ({ page }) => {
    if (isMobile(page)) await menuButton(page).click();
    const targets = mainNav(page).locator("a:visible, button:visible");
    const count = await targets.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await targets.nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("keyboard reaches the name, every link and the theme toggle", async ({
    page,
  }) => {
    const expected = [
      "Skip to content",
      "Dulmi Hettiarachchi",
      ...(isMobile(page) ? ["Menu"] : navLinks.map((l) => l.label)),
      "Dark theme",
    ];
    const reached: string[] = [];
    for (let i = 0; i < expected.length; i++) {
      await page.keyboard.press("Tab");
      reached.push(
        await page.evaluate(
          () =>
            document.activeElement?.getAttribute("aria-label") ??
            document.activeElement?.textContent?.trim() ??
            "",
        ),
      );
    }
    expect(reached).toEqual(expected);
  });
});

test.describe("Nav · mobile menu", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!isMobile(page), "Mobile menu only exists below 600px");
    await page.goto("/");
  });

  test("links are hidden until the menu is opened", async ({ page }) => {
    const button = menuButton(page);
    const firstLink = mainNav(page).getByRole("link", {
      name: navLinks[0].label,
    });

    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(firstLink).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const link of navLinks) {
      await expect(
        mainNav(page).getByRole("link", { name: link.label }),
      ).toBeVisible();
    }

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(firstLink).toBeHidden();
  });

  test("Escape closes the menu and returns focus to the button", async ({
    page,
  }) => {
    const button = menuButton(page);
    await button.click();
    await mainNav(page).getByRole("link", { name: navLinks[0].label }).focus();
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("opening with the keyboard works", async ({ page }) => {
    const button = menuButton(page);
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // Tab goes from the button through every link, then on to the toggle.
    for (const link of navLinks) {
      await page.keyboard.press("Tab");
      await expect(
        mainNav(page).getByRole("link", { name: link.label }),
      ).toBeFocused();
    }
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Dark theme" }),
    ).toBeFocused();
  });

  test("clicking a link closes the menu", async ({ page }) => {
    const button = menuButton(page);
    await button.click();
    await mainNav(page).getByRole("link", { name: navLinks[1].label }).click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking outside closes the menu", async ({ page }) => {
    const button = menuButton(page);
    await button.click();
    await page.locator("main").click({ position: { x: 10, y: 300 } });
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("links stay visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 360, height: 740 },
    });
    const page = await context.newPage();
    await page.goto("/");
    for (const link of navLinks) {
      await expect(
        mainNav(page).getByRole("link", { name: link.label }),
      ).toBeVisible();
    }
    await expect(menuButton(page)).toBeHidden();
    await expect(page.getByRole("button", { name: "Dark theme" })).toBeHidden();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await context.close();
  });
});

test.describe("Nav · desktop", () => {
  test("menu button is hidden and links are visible", async ({ page }) => {
    test.skip(isMobile(page), "Desktop layout only from 600px");
    await page.goto("/");
    await expect(menuButton(page)).toBeHidden();
    for (const link of navLinks) {
      await expect(
        mainNav(page).getByRole("link", { name: link.label }),
      ).toBeVisible();
    }
  });
});
