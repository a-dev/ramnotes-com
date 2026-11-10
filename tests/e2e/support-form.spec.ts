import { expect, test, type Page } from "@playwright/test";

const endpoint = "https://api.web3forms.com/submit";
const message = "A test message that must be preserved.";

async function enableForm(page: Page, { markConfigured }: { markConfigured: boolean }) {
  await page.route("**/support", async (route) => {
    const response = await route.fetch();
    let html = (await response.text()).replace(/ disabled(?:="")?(?=[ >])/g, "");
    if (markConfigured) html = html.replace('data-configured="false"', 'data-configured="true"');
    await route.fulfill({ response, body: html });
  });
}

const outcomes = {
  success: /Message sent/,
  error: /could not be sent/,
  offline: /confirm delivery/,
  honeypot: /could not be sent/,
} as const;

for (const [outcome, expected] of Object.entries(outcomes)) {
  test(`form shows the ${outcome} result and keeps the message`, async ({ page }) => {
    await enableForm(page, { markConfigured: true });
    let calls = 0;
    await page.route(endpoint, async (route) => {
      calls++;
      if (outcome === "offline") return route.abort("internetdisconnected");
      await route.fulfill({
        status: outcome === "error" ? 400 : 200,
        contentType: "application/json",
        body: JSON.stringify({ success: outcome === "success" }),
      });
    });

    await page.goto("/support");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill(message);
    if (outcome === "honeypot")
      await page.locator("#botcheck").evaluate((el: HTMLInputElement) => (el.checked = true));
    await page.getByRole("button", { name: "Send message", exact: true }).click();

    await expect(page.locator("button[type=submit]")).toBeEnabled();
    await expect(page.locator("[data-form-result]")).toHaveText(expected);
    await expect(page.locator("#message")).toHaveValue(message);
    expect(calls).toBe(outcome === "honeypot" ? 0 : 1);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("form posts and redirects to the thanks page", async ({ page, baseURL }) => {
    await enableForm(page, { markConfigured: false });
    await page.route(endpoint, async (route) => {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postData()).toMatch(
        /redirect=https%3A%2F%2Framnotes.com%2Fsupport%2Fthanks/,
      );
      await route.fulfill({ status: 303, headers: { Location: `${baseURL}/support/thanks` } });
    });

    await page.goto("/support");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("No JavaScript test.");
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await page.waitForURL("**/support/thanks");
  });
});
