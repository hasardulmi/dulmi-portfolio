import { test, expect } from "@playwright/test";
import { profile } from "../src/data/profile";

const SITE = "https://dulmi-portfolio.vercel.app";

test.describe("SEO", () => {
  test("canonical URL, Open Graph and Twitter card use the live site", async ({
    page,
  }) => {
    await page.goto("/");
    const head = page.locator("head");
    const meta = (attr: string, name: string) =>
      head.locator(`meta[${attr}="${name}"]`);

    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE}/`,
    );
    await expect(meta("property", "og:url")).toHaveAttribute(
      "content",
      `${SITE}/`,
    );
    await expect(meta("property", "og:title")).toHaveAttribute(
      "content",
      await page.title(),
    );
    await expect(meta("property", "og:description")).toHaveAttribute(
      "content",
      /\S/,
    );
    for (const [attr, name] of [
      ["property", "og:image"],
      ["name", "twitter:image"],
    ]) {
      await expect(meta(attr, name)).toHaveAttribute(
        "content",
        `${SITE}/og-image.png`,
      );
    }
    await expect(meta("property", "og:image:width")).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(meta("property", "og:image:height")).toHaveAttribute(
      "content",
      "630",
    );
    await expect(meta("name", "twitter:card")).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("the share image is a 1200×630 PNG", async ({ page, request }) => {
    const response = await request.get("/og-image.png");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    await page.goto("/og-image.png");
    const size = await page
      .locator("img")
      .evaluate((img: HTMLImageElement) => [
        img.naturalWidth,
        img.naturalHeight,
      ]);
    expect(size).toEqual([1200, 630]);
  });

  test("JSON-LD Person schema matches the profile", async ({ page }) => {
    await page.goto("/");
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const person = JSON.parse(json!);
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(profile.name);
    expect(person.jobTitle).toBe("Junior QA Engineer");
    expect(person.url).toBe(`${SITE}/`);
    expect(person.alumniOf.name).toBe("University of Kelaniya");
    expect(person.address.addressCountry).toBe("Sri Lanka");
    expect(person.sameAs).toEqual([
      profile.contact.linkedin,
      profile.contact.github,
      profile.contact.medium,
    ]);
    // No private details in the schema.
    expect(json).not.toMatch(/gampaha|telephone|@gmail/i);
  });

  test("sitemap.xml lists the live home page", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    expect(await response.text()).toContain(`<loc>${SITE}/</loc>`);
  });

  test("robots.txt allows crawling and points at the sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Allow: /");
    expect(text).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
