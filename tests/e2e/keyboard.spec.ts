import { expect, test } from "@playwright/test";

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveText("Skip to content");
  await page.keyboard.press("Enter");
  await expect(page.locator(":focus")).toHaveAttribute("id", "main");
});

test("FAQ item opens with the keyboard", async ({ page }) => {
  await page.goto("/");
  const summary = page.locator("#faq summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq details").first()).toHaveJSProperty("open", true);
});

for (const selector of ["[data-sort-trigger]", "[data-tint]"]) {
  test(`${selector} menu supports arrows, boundaries, Escape and Tab`, async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator(selector);
    const menu = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
    const items = menu.getByRole("menuitemradio");
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(items.last()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(menu).toBeHidden();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(":focus")).not.toHaveCount(0);
    await expect(trigger).not.toBeFocused();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Shift+Tab");
    await expect(menu).toBeHidden();
    await expect(trigger).not.toBeFocused();
  });
}

test("notes can be selected with Enter and Space", async ({ page }) => {
  await page.goto("/");
  const buttons = page.locator("[data-row] button");
  await buttons.first().focus();
  await page.keyboard.press("Enter");
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator('[data-row] button[aria-pressed="true"]')).toHaveCount(1);
});
