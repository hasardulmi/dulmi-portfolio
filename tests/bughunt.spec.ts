import { test, expect, type Page } from "@playwright/test";
import { profile } from "../src/data/profile";

const bugs = (page: Page) =>
  page.getByRole("button", { name: "Hidden bug: squash it" });
const counter = (page: Page) => page.locator("[data-count-found]");
const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "All 5 bugs found!" });

/** Squash every remaining bug with the keyboard: focus it, press Enter. */
async function squashAll(page: Page) {
  const total = Object.keys(profile.bugs).length;
  for (let n = 1; n <= total; n++) {
    const bug = page.locator("[data-bug]:not([data-found])").first();
    const msg = await bug.getAttribute("data-msg");
    await bug.focus();
    await page.keyboard.press("Enter");
    await expect(counter(page)).toHaveText(`${n}/${total}`);
    const toast = page.getByRole("status");
    await expect(toast).toContainText(`Bug #${n} squashed`);
    await expect(toast).toContainText(msg!);
  }
}

test.describe("Bug hunt", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("5 hidden bugs, one per section, with a 0/5 counter", async ({
    page,
  }) => {
    await expect(bugs(page)).toHaveCount(5);
    const sections = await page
      .locator("[data-bug]")
      .evaluateAll((els) => els.map((el) => el.closest("section")!.id));
    expect(sections).toEqual(Object.keys(profile.bugs));
    await expect(counter(page)).toHaveText("0/5");
    await expect(dialog(page)).toBeHidden();
  });

  test("finding all 5 by keyboard opens the dialog; Escape closes it", async ({
    page,
  }) => {
    await squashAll(page);
    await expect(bugs(page)).toHaveCount(0);

    await expect(dialog(page)).toBeVisible();
    // Focus moves into the dialog and Tab stays inside it.
    const inside = () =>
      page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog[open]")),
      );
    await expect.poll(inside).toBe(true);
    await page.keyboard.press("Tab");
    expect(await inside()).toBe(true);
    // Confetti falls (motion allowed in this test).
    await expect(page.locator(".conf").first()).toBeAttached();

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
  });

  test("Keep browsing closes the dialog", async ({ page }) => {
    await squashAll(page);
    await dialog(page).getByRole("button", { name: "Keep browsing" }).click();
    await expect(dialog(page)).toBeHidden();
  });

  test("Contact me in the dialog goes to the contact section", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await squashAll(page);
    // Reduced motion: no confetti, dialog opens straight away.
    await expect(dialog(page)).toBeVisible();
    await expect(page.locator(".conf")).toHaveCount(0);
    await dialog(page).getByRole("link", { name: "Contact me" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact h2")).toBeInViewport();
  });
});
