import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/help", "/articles/ram-and-notes", "/privacy", "/support", "/support/thanks"];
const widths = [375, 768, 1280];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const path of [...paths, "/nope"]) {
      test(`${path} renders without errors or overflow`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (
            message.type() === "error" &&
            /Content Security Policy|Refused to/.test(message.text())
          )
            errors.push(message.text());
        });

        for (const width of widths) {
          await page.setViewportSize({ width, height: 900 });
          const response = await page.goto(path);
          expect(response?.status()).toBe(path === "/nope" ? 404 : 200);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          );
          expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
        }
        expect(errors).toEqual([]);
      });

      test(`${path} passes axe at 375px`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 900 });
        await page.goto(path);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])

          .exclude("[data-context-menu] [data-danger]")

          .exclude("[data-downloads-placeholder]")
          .analyze();
        expect(
          violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
        ).toEqual([]);
      });
    }
  });
}

test("pages reflow at 320px and with doubled text", async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  for (const fontSize of [16, 32]) {
    await session.send("Page.setFontSizes", { fontSizes: { standard: fontSize } });
    await page.setViewportSize({ width: fontSize === 16 ? 320 : 1280, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe(
        `${fontSize}px`,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} at ${fontSize}px`,
      ).toBe(true);
    }
  }
});
