import { test, expect, type Page } from "@playwright/test";

const toggle = (page: Page) => page.getByRole("button", { name: "Dark theme" });
const theme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.theme);
const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const LIGHT_BG = "rgb(243, 246, 248)";
const DARK_BG = "rgb(7, 20, 35)";

test.describe("Theme toggle", () => {
  test("defaults to a light system setting", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await theme(page)).toBe("light");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
    expect(await background(page)).toBe(LIGHT_BG);
  });

  test("defaults to a dark system setting", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expect(await theme(page)).toBe("dark");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => background(page)).toBe(DARK_BG);
  });

  test("switches theme and the choice survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await toggle(page).click();
    expect(await theme(page)).toBe("dark");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => background(page)).toBe(DARK_BG);

    await page.reload();
    expect(await theme(page)).toBe("dark");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");

    await toggle(page).click();
    await page.reload();
    expect(await theme(page)).toBe("light");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  });

  test("a saved choice overrides the system setting", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await toggle(page).click(); // dark -> light
    await page.reload();
    expect(await theme(page)).toBe("light");
    await expect.poll(() => background(page)).toBe(LIGHT_BG);
  });

  test("works with the keyboard", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    expect(await theme(page)).toBe("dark");
    await page.keyboard.press("Space");
    expect(await theme(page)).toBe("light");
  });

  test("theme is applied before CSS (no flash)", async ({ page }) => {
    await page.goto("/");
    const scriptFirst = await page.evaluate(() => {
      const script = document.head.querySelector("script:not([src])");
      const style = document.head.querySelector(
        'link[rel="stylesheet"], style',
      );
      if (!script) return false;
      if (!style) return true;
      return Boolean(
        script.compareDocumentPosition(style) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(scriptFirst).toBe(true);
  });

  test("still works when localStorage is blocked", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Storage blocked");
        },
      });
    });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await theme(page)).toBe("light");
    await toggle(page).click();
    expect(await theme(page)).toBe("dark");
    expect(errors).toEqual([]);
  });
});
