# E2E Testing Pitfalls & Lessons Learned

Common Playwright/SvelteKit pitfalls encountered while building this test suite, and how to avoid them.

---

## 1. Strict Mode Violations (Multiple Matches)

**Symptom:**

```
strict mode violation: locator(...) resolved to 2 elements
```

Playwright's strict mode requires locators to match exactly one element. Common causes:

### 1a. Text matches in multiple elements

```ts
// BAD — "Sports" matches both the <h4> heading AND the <p> description
await expect(footer.getByText('Sports')).toBeVisible();

// GOOD — scope to the heading
await expect(footer.getByRole('heading', { name: 'Sports' })).toBeVisible();
```

### 1b. Placeholder/label matches hidden + visible elements

```ts
// BAD — matches sidebar search (hidden on mobile) AND mobile search (visible)
await expect(page.getByPlaceholder('Search teams...')).toBeVisible();

// GOOD — scope to the visible container
const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
await expect(mobileSearch.getByPlaceholder('Search teams...')).toBeVisible();
```

### 1c. Button name matches multiple buttons

```ts
// BAD — matches header button, mobile menu button, AND footer button
await expect(page.getByRole('button', { name: /Join now/ })).toBeVisible();

// GOOD — scope to the specific container
const menuPanel = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
await expect(menuPanel.getByRole('button', { name: /Join now/ })).toBeVisible();
```

### 1d. Meta tags with same name

```ts
// BAD — two <meta name="description"> tags (SvelteKit + page-level)
const desc = await page.locator('meta[name="description"]').getAttribute('content');

// GOOD — pick the first one
const desc = await page.locator('meta[name="description"]').first().getAttribute('content');
```

---

## 2. Locator Re-evaluation After Click

**Symptom:** Test clicks a button, then assertion checks the same locator — but the locator now resolves to a _different_ element.

```ts
// BAD — after click, this button becomes aria-pressed="true",
// so .first() picks a DIFFERENT button that's still "false"
const oddsBtn = page.locator('#featured button[aria-pressed="false"]').first();
await oddsBtn.click();
await expect(oddsBtn).toHaveAttribute('aria-pressed', 'true'); // FAILS
```

**Fix:** Use a locator that matches the element regardless of the attribute changing:

```ts
// GOOD — button[aria-pressed] matches the same element before AND after click
const oddsBtn = page.locator('#featured button[aria-pressed]').first();
await expect(oddsBtn).toHaveAttribute('aria-pressed', 'false');
await oddsBtn.click();
await expect(oddsBtn).toHaveAttribute('aria-pressed', 'true');
```

**Why this works:** `.first()` picks the first `button[aria-pressed]` in DOM order. After click, it's still the first match — the element just changed its attribute value. The locator resolves to the same DOM node.

---

## 3. `.first()` Picking Hidden Elements

**Symptom:** `getByText('WAM').first()` finds a hidden desktop element instead of the visible mobile one.

```ts
// BAD — at 375px, .first() picks the desktop WAM (hidden via CSS class)
await expect(page.getByText('WAM').first()).toBeVisible();

// GOOD — scope to the visible container using CSS class
const mobileWam = page.locator('.xl\\:hidden a').filter({ hasText: 'WAM' });
await expect(mobileWam).toBeVisible();
```

**Rule:** `.first()` picks by DOM order, not visibility. If the first matching element is hidden, the assertion fails. Always scope to the correct container when elements are duplicated across responsive breakpoints.

---

## 4. Hidden Elements Still in DOM

Svelte/CSS responsive classes like `hidden`, `xl:flex`, `xl:hidden` control visibility via CSS — the elements are always in the DOM. Playwright's `getByRole`, `getByText`, `getByPlaceholder` search **all DOM elements** (including hidden ones) unless you scope properly.

**Key pattern:** At mobile viewport (375px), elements with `xl:flex` are hidden. Elements with `xl:hidden` are visible. At desktop (1440px), the reverse applies.

```ts
// Mobile viewport — desktop header is hidden
// The hidden desktop button still matches getByRole
const desktopBtn = page.getByRole('button', { name: 'Join now...' }); // matches hidden
```

**Fix:** Always scope selectors to the correct responsive container:

```ts
// Desktop (1440px)
const desktopHeader = page.locator('.xl\\:flex'); // or just use the visible button

// Mobile (375px)
const mobileMenu = page.locator('.xl\\:hidden.fixed');
```

---

## 5. Bet Slip Store Deduplication

The bet slip store deduplicates by `event_odd_id`. If you click two odds buttons from the **same match + same market**, the store replaces the first with the second.

```ts
// BAD — both buttons might be from the same market, second replaces first
await page.locator('#featured button[aria-pressed="false"]').nth(0).click();
await page.locator('#featured button[aria-pressed="false"]').nth(0).click(); // replaces!
```

**Fix:** Add selections from **different match rows** (different matches):

```ts
// GOOD — helper function adds from different rows/markets
async function addMultipleRowSelections(page: Page, count: number) {
	const rows = page.locator('[role="row"]');
	for (let i = 0; i < count; i++) {
		const btn = rows.nth(i).locator('button[aria-pressed="false"]').first();
		if (await btn.isVisible()) {
			await btn.click();
			await page.waitForTimeout(200);
		}
	}
}
```

---

## 6. `formatKEPhone` Formats with Spaces

Phone numbers are formatted with spaces: `0712345678` → `0712 345 678`.

When asserting input values after filling a phone number, account for the formatting:

```ts
// The input value will be "0712 345 678" not "0712345678"
await phoneInput.fill('0712345678');
await expect(phoneInput).toHaveValue('0712 345 678');
```

---

## 7. Header "Log In" Button Opens Signup Mode

The header "Log In" button calls `handleJoin('header_login')` which opens the auth modal in **signup mode** (the default `mode` prop is `'signup'`). To test actual login flow, you must click the "Already have an account? Log In" tab switch inside the modal.

```ts
// This opens the modal in SIGNUP mode, not login
await page.getByRole('button', { name: 'Log in to your account' }).click();

// Must click the login tab to switch to login mode
await page.getByRole('button', { name: 'Log In' }).click(); // tab switch
```

---

## 8. Mobile Search vs Desktop Search

The Header component has a mobile search toggle that renders a search input in a fixed overlay. The Sidebar component has a desktop search input. Both have the same `aria-label` and `placeholder`.

**At 375px viewport:**

- Sidebar search: in DOM but hidden via `hidden xl:flex` on parent
- Mobile search: conditionally rendered, visible

**Fix:** Scope to the mobile search overlay:

```ts
const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
await mobileSearch.getByPlaceholder('Search teams...').fill('Barcelona');
```

---

## 9. Confirm Dialog Escape Key

The confirm dialog's Escape handler is on the dialog `<div>` itself (not `svelte:window`). For the handler to fire, the dialog must be focused:

```ts
// BAD — Escape fires on window, but dialog has its own handler
await page.keyboard.press('Escape');

// GOOD — focus the dialog first so its keydown handler catches the event
const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
await dialog.click(); // focus the dialog
await page.keyboard.press('Escape');
```

---

## 10. OOM Crashes with V8

**Symptom:**

```
Fatal process out of memory: Zone
```

Running 160+ tests sequentially in a single Chromium process exhausts V8 memory. This causes:

- Random test failures (cascading from corrupted state)
- Fatal crashes mid-test
- Tests that pass individually but fail in the full suite

**Mitigations:**

1. **Add retries:** `retries: 2` in `playwright.config.ts` — OOM crashes are transient, the retry gets a fresh browser process
2. **Run with workers: 1:** Multiple workers multiply memory usage
3. **Run files individually:** `npx playwright test tests/auth.spec.ts` for faster feedback
4. **Close unused pages:** Don't accumulate page instances
5. **Increase Node.js memory (if needed):** `NODE_OPTIONS=--max-old-space-size=4096`

**Current config:**

```ts
{
  workers: 1,
  retries: 2,  // handles OOM flakes
}
```

---

## 11. `toBeDetached()` Not Available

`toBeDetached()` is not available in Playwright 1.61. Use `not.toBeVisible()` instead:

```ts
// BAD — toBeDetached is not a function
await expect(element).toBeDetached();

// GOOD
await expect(element).not.toBeVisible();
```

---

## 12. Tailwind Responsive Classes as Selectors

CSS class selectors like `.hidden.xl\\:flex` work unreliably in Playwright because Tailwind compiles responsive variants into media queries. Use more robust selectors:

```ts
// Fragile — CSS selector for Tailwind responsive class
page.locator('.hidden.xl\\:flex');

// Better — use semantic selectors
page.getByRole('button', { name: '...' });
page.locator('.xl\\:hidden'); // when you need the mobile container
```

---

## 13. Svelte 5 `aria-pressed` Rendering

In Svelte 5, `aria-pressed={selected}` where `selected` is a boolean renders as `aria-pressed="true"` or `aria-pressed="false"` (string). The attribute is always present, not a boolean HTML attribute.

```svelte
<!-- Svelte 5 renders this as: aria-pressed="false" (string) -->
<button aria-pressed={selected}>...</button>
```

So CSS selectors like `button[aria-pressed="false"]` work correctly.

---

## 14. Test Isolation with `beforeEach`

Every `describe` block uses `beforeEach` to reload the page:

```ts
test.describe('My Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
  });

  test('test 1', async ({ page }) => { ... });
  test('test 2', async ({ page }) => { ... }); // fresh page
});
```

**Important:** For mobile tests, set viewport in `beforeEach` AFTER navigating:

```ts
test.beforeEach(async ({ page }) => {
	await page.goto(BASE, { waitUntil: 'networkidle' });
	await page.setViewportSize({ width: 375, height: 812 });
});
```

---

## 15. `networkidle` vs `load`

`waitUntil: 'networkidle'` waits for no network activity for 500ms. This is important for the WAM app because:

- Live odds simulation starts via `setInterval` on mount
- JSON data is loaded statically but components hydrate asynchronously
- Toast/notification stores initialize after mount

Using `load` instead may cause flaky tests where elements aren't yet rendered.

---

## 16. Bet Slip Confirm Dialog ARIA

The confirm dialog has `role="dialog"` and `aria-modal="true"`. When testing dialog interactions:

```ts
const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
await expect(dialog).toBeVisible();
await expect(dialog).toHaveAttribute('aria-modal', 'true');

// Buttons inside the dialog
await dialog.getByRole('button', { name: /Cancel/ }).click();
await dialog.getByRole('button', { name: /Confirm/ }).click();
```

---

## Quick Reference: Selector Strategy

| Scenario                 | Selector                                            |
| ------------------------ | --------------------------------------------------- |
| Button by visible name   | `getByRole('button', { name: 'Submit' })`           |
| Button by partial name   | `getByRole('button', { name: /Join/ })`             |
| Text content             | `getByText('some text')`                            |
| Exact text               | `getByText('Sports', { exact: true })`              |
| Heading                  | `getByRole('heading', { name: 'Sports' })`          |
| Input by placeholder     | `getByPlaceholder('Search teams...')`               |
| Input by aria-label      | `getByRole('textbox', { name: 'Search teams' })`    |
| Link                     | `getByRole('link', { name: 'Aviator' })`            |
| Scoped to section        | `page.locator('footer').getByText('...')`           |
| Scoped to visible mobile | `page.locator('.xl\\:hidden.fixed.top-\\[56px\\]')` |
| Odds button (stable)     | `page.locator('#featured button[aria-pressed]')`    |
| Match row                | `page.locator('[role="row"]')`                      |
| First of many            | `.first()` / `.nth(0)`                              |
| Last of many             | `.last()`                                           |
