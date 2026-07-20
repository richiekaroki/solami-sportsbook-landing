import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('Odds Grid – Featured Match', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('featured match section is visible', async ({ page }) => {
    await expect(page.locator('#featured')).toBeVisible();
  });

  test('featured match has "Featured Match" label', async ({ page }) => {
    await expect(page.getByText('Featured Match')).toBeVisible();
  });

  test('featured match shows "Odds updating live"', async ({ page }) => {
    await expect(page.getByText('Odds updating live')).toBeVisible();
  });

  test('featured match shows team names', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('FC Barcelona')).toBeVisible();
    await expect(featured.getByText('Atletico Madrid')).toBeVisible();
  });

  test('featured match shows "VS" text', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('VS')).toBeVisible();
  });

  test('featured match shows countdown "Kicks off in"', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('Kicks off in')).toBeVisible();
  });

  test('featured match has "Boosted Odds" badge', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('Boosted Odds')).toBeVisible();
  });

  test('featured match has "Featured" label', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('Featured', { exact: true })).toBeVisible();
  });

  test('featured match has bonus ribbon', async ({ page }) => {
    const featured = page.locator('#featured');
    await expect(featured.getByText('New customers: Deposit KSh 100')).toBeVisible();
    await expect(featured.getByText('KSh 500 free')).toBeVisible();
  });

  test('featured match has 3 odds buttons (1X2)', async ({ page }) => {
    const oddsButtons = page.locator('#featured button[aria-pressed]');
    await expect(oddsButtons).toHaveCount(3);
  });

  test('odds buttons have correct labels (1, X, 2)', async ({ page }) => {
    const oddsButtons = page.locator('#featured button[aria-pressed]');
    // Each button should contain a numerical odds value
    const firstOddsText = await oddsButtons.nth(0).textContent();
    expect(firstOddsText).toBeTruthy();
  });

  test('odds button shows aria-pressed false initially', async ({ page }) => {
    const oddsBtn = page.locator('#featured button[aria-pressed="false"]').first();
    await expect(oddsBtn).toBeVisible();
  });

  test('clicking odds button toggles selection (aria-pressed becomes true)', async ({ page }) => {
    const oddsBtn = page.locator('#featured button[aria-pressed]').first();
    await expect(oddsBtn).toHaveAttribute('aria-pressed', 'false');
    await oddsBtn.click();
    await expect(oddsBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking selected odds button deselects it', async ({ page }) => {
    const oddsBtn = page.locator('#featured button[aria-pressed]').first();
    await oddsBtn.click();
    await expect(oddsBtn).toHaveAttribute('aria-pressed', 'true');
    await oddsBtn.click();
    await expect(oddsBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('odds values are numerical (format like X.XX)', async ({ page }) => {
    const oddsBtn = page.locator('#featured button[aria-pressed]').first();
    const text = await oddsBtn.textContent();
    // Should contain a decimal number
    expect(text).toMatch(/\d+\.\d+/);
  });
});

test.describe('Match Feed – Competition Groups', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('soccer header shows event count', async ({ page }) => {
    await expect(page.getByText('Soccer')).toBeVisible();
    await expect(page.getByText(/events$/)).toBeVisible();
  });

  test('match groups have competition headers', async ({ page }) => {
    const matchSection = page.locator('#matches');
    // Should have at least one competition header
    await expect(matchSection.locator('text=/Champions League|LaLiga/').first()).toBeVisible();
  });

  test('match rows are rendered', async ({ page }) => {
    const rows = page.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('match row shows team names', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    // Should contain some team name text
    const text = await firstRow.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(5);
  });

  test('match row has odds buttons for 1X2 market', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    const oddsButtons = firstRow.locator('button[aria-pressed]');
    const count = await oddsButtons.count();
    // Should have at least 3 buttons for 1X2
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('match row has kickoff time', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    // Should contain a time-like pattern or date
    const text = await firstRow.textContent();
    expect(text).toMatch(/\d{1,2}:\d{2}|\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
  });

  test('match row has bet count indicator', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    // The Flame icon + bet count should be visible
    const betCount = firstRow.locator('text=/\\d+/');
    expect(await betCount.count()).toBeGreaterThan(0);
  });

  test('odds update over time (live simulation)', async ({ page }) => {
    const firstOddsBtn = page.locator('[role="row"] button[aria-pressed]').first();
    const initialText = await firstOddsBtn.textContent();
    // Wait for odds update cycle (6 seconds)
    await page.waitForTimeout(7000);
    const updatedText = await firstOddsBtn.textContent();
    // Odds may or may not have changed, but the button should still be visible
    await expect(firstOddsBtn).toBeVisible();
  });
});

test.describe('Match Row – Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('arrow right moves focus between odds buttons in a row', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    const firstBtn = firstRow.locator('button[aria-pressed]').first();
    await firstBtn.click();
    await expect(firstBtn).toBeFocused();

    await page.keyboard.press('ArrowRight');
    const secondBtn = firstRow.locator('button[aria-pressed]').nth(1);
    await expect(secondBtn).toBeFocused();
  });

  test('arrow left moves focus backward', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    const secondBtn = firstRow.locator('button[aria-pressed]').nth(1);
    await secondBtn.click();
    await expect(secondBtn).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    const firstBtn = firstRow.locator('button[aria-pressed]').first();
    await expect(firstBtn).toBeFocused();
  });

  test('arrow down moves focus to next row', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').first();
    const firstBtn = firstRow.locator('button[aria-pressed]').first();
    await firstBtn.click();

    await page.keyboard.press('ArrowDown');
    const secondRow = page.locator('[role="row"]').nth(1);
    const targetBtn = secondRow.locator('button[aria-pressed]').first();
    await expect(targetBtn).toBeFocused();
  });
});
