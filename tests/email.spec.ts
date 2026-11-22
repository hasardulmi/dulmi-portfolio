import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { profile } from "../src/data/profile";

const { email, gmail } = profile.contact;

/** Every email trigger on the page: hero icon and contact card. */
const triggers = (page: Page) => [
  {
    where: "hero",
    button: page.locator("#top").getByRole("button", {
      name: "Email",
      exact: true,
    }),
  },
  {
    where: "contact",
    button: page
      .locator("#contact")
      .getByRole("button", { name: `Email ${email}` }),
  },
];

test.use({ reducedMotion: "reduce" });

test.describe("Email menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("no plain mailto: triggers remain outside the menus", async ({
    page,
  }) => {
    // The only mailto: links are the "Open email app" items inside the menus.
    const mailto = page.locator('a[href^="mailto:"]:not([role="menuitem"])');
    for (const link of await mailto.all()) {
      await expect(link).toHaveAttribute("role", "button");
      await expect(link).toHaveAttribute("aria-haspopup", "menu");
    }
  });

  for (const where of ["hero", "contact"]) {
    test(`${where}: opens a menu with the 3 options, inside the screen`, async ({
      page,
    }) => {
      const { button } = triggers(page).find((t) => t.where === where)!;
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");

      const menu = page.getByRole("menu", { name: "Email options" });
      await expect(menu).toBeVisible();
      await expect(button).toHaveAttribute(
        "aria-controls",
        (await menu.getAttribute("id"))!,
      );
      const items = menu.getByRole("menuitem");
      await expect(items).toHaveText([
        "Open in Gmail (opens in a new tab)",
        "Open email app",
        "Copy email address",
      ]);

      const gmailItem = items.nth(0);
      await expect(gmailItem).toHaveAttribute("href", gmail);
      await expect(gmailItem).toHaveAttribute("target", "_blank");
      await expect(gmailItem).toHaveAttribute("rel", "noopener noreferrer");
      expect(gmail).toBe(
        "https://mail.google.com/mail/?view=cm&fs=1&to=hasardulmi@gmail.com",
      );
      await expect(items.nth(1)).toHaveAttribute("href", `mailto:${email}`);

      // Focus moves to the first option, and the menu fits on screen.
      await expect(gmailItem).toBeFocused();
      const box = (await menu.boundingBox())!;
      const width = page.viewportSize()!.width;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await expect(menu).toBeInViewport({ ratio: 1 });
      for (const item of await items.all()) {
        expect((await item.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    });
  }

  test("the email address is visible as text next to each trigger", async ({
    page,
  }) => {
    await expect(page.locator("#top .email")).toContainText(email);
    await expect(page.locator("#contact .email")).toContainText(email);
  });

  test("works with the keyboard and Escape returns focus", async ({ page }) => {
    const { button } = triggers(page)[0];
    await button.focus();
    await page.keyboard.press("Enter");
    const items = page.getByRole("menu").getByRole("menuitem");
    await expect(items.nth(0)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(items.nth(2)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(0)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(items.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(items.nth(0)).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();

    // Space opens it too (the trigger is a link acting as a button).
    await page.keyboard.press("Space");
    await expect(items.nth(0)).toBeFocused();
    // Tab closes the menu.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("menu")).toBeHidden();
  });

  test("closes on an outside click", async ({ page }) => {
    const { button } = triggers(page)[1];
    await button.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.locator("#contact h2").click();
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("closes after choosing Open in Gmail, which opens a new tab", async ({
    page,
    context,
  }) => {
    // Don't actually hit Gmail: answer the new tab locally.
    await context.route("https://mail.google.com/**", (route) =>
      route.fulfill({ status: 200, body: "gmail" }),
    );
    const { button } = triggers(page)[0];
    await button.click();
    const [tab] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("menuitem", { name: /Open in Gmail/ }).click(),
    ]);
    expect(tab.url()).toBe(gmail);
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("has no serious axe violations with the menu open, in both themes", async ({
    page,
  }) => {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto("/");
      await triggers(page)[1].button.click();
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    }
  });
});

test.describe("Copy email address", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("copies the address and shows Copied! for 2 seconds", async ({
    page,
  }) => {
    await page.goto("/");
    const { button } = triggers(page)[1];
    await button.click();
    await page.getByRole("menuitem", { name: "Copy email address" }).click();

    // Menu closes, focus goes back to the trigger.
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toBeFocused();

    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      email,
    );

    const status = page.locator("#contact [data-copied]");
    await expect(status).toHaveText("Copied!");
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute("role", "status");
    // Gone after about 2 seconds.
    await page.waitForTimeout(1500);
    await expect(status).toHaveText("Copied!");
    await expect(status).toHaveText("", { timeout: 1500 });
    await expect(status).toBeHidden();
  });

  test("still copies when the clipboard API is unavailable", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        get() {
          return {
            writeText: () => Promise.reject(new Error("blocked")),
          };
        },
      });
      (window as unknown as { copied: string }).copied = "";
      document.addEventListener("copy", () => {
        const sel = document.getSelection()?.toString() ?? "";
        const active = document.activeElement as HTMLTextAreaElement | null;
        (window as unknown as { copied: string }).copied =
          sel ||
          active?.value?.slice(active.selectionStart, active.selectionEnd) ||
          "";
      });
    });
    await page.goto("/");
    await triggers(page)[0].button.click();
    await page.getByRole("menuitem", { name: "Copy email address" }).click();
    await expect(page.locator("#top [data-copied]")).toHaveText("Copied!");
    expect(
      await page.evaluate(
        () => (window as unknown as { copied: string }).copied,
      ),
    ).toBe(email);
  });
});

test("without JavaScript the email links are plain mailto: links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const id of ["top", "contact"]) {
    const link = page.locator(`#${id} [data-email-trigger]`);
    await expect(link).toHaveAttribute("href", `mailto:${email}`);
    await expect(link).not.toHaveAttribute("role", "button");
  }
  await expect(page.locator("[data-email-menu]").first()).toBeHidden();
  await context.close();
});
