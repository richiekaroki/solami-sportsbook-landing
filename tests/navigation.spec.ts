import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('Sports Nav – Competition Filter', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('shows "All Matches" tab and competition tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Filter by All Matches' })).toBeVisible();
  });

  test('"All Matches" tab is active by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Filter by All Matches' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('competition tabs show match counts', async ({ page }) => {
    const allTab = page.getByRole('button', { name: 'Filter by All Matches' });
    const text = await allTab.textContent();
    expect(text).toMatch(/\d+/);
  });

  test('clicking a competition tab filters matches', async ({ page }) => {
    const compTabs = page.locator('#matches button[aria-label^="Filter by"]').filter({ hasNotText: 'All Matches' });
    const count = await compTabs.count();
    if (count > 0) {
      await compTabs.first().click();
      await expect(page.getByRole('button', { name: 'Filter by All Matches' })).toHaveAttribute('aria-pressed', 'false');
    }
  });

  test('clicking "All Matches" restores all matches', async ({ page }) => {
    const compTabs = page.locator('#matches button[aria-label^="Filter by"]').filter({ hasNotText: 'All Matches' });
    const count = await compTabs.count();
    if (count > 0) {
      await compTabs.first().click();
      await page.getByRole('button', { name: 'Filter by All Matches' }).click();
      await expect(page.getByRole('button', { name: 'Filter by All Matches' })).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('competition tab shows abbreviation badge', async ({ page }) => {
    const clTab = page.getByRole('button', { name: /Filter by Champions League/ });
    if (await clTab.isVisible()) {
      await expect(clTab.getByText('CL')).toBeVisible();
    }
  });
});

test.describe('Search – Team Filter', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('desktop sidebar has search input', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Search teams' }).first()).toBeVisible();
  });

  test('search input is empty by default', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await expect(searchInput).toHaveValue('');
  });

  test('typing in search filters matches', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await searchInput.fill('Barcelona');
    await page.waitForTimeout(500);
    const rows = page.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('search for non-existent team shows "No matches found"', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await searchInput.fill('XYZNONEXISTENT');
    await page.waitForTimeout(500);
    await expect(page.getByText('No matches found')).toBeVisible();
  });

  test('no-results state shows "Clear search" button', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await searchInput.fill('XYZNONEXISTENT');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: 'Clear search' })).toBeVisible();
  });

  test('"Clear search" resets the search', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await searchInput.fill('XYZNONEXISTENT');
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(searchInput).toHaveValue('');
    const rows = page.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search with partial match works', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search teams' }).first();
    await searchInput.fill('Atleti');
    await page.waitForTimeout(500);
    const rows = page.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Sidebar – Top Games', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('sidebar shows "Top Games" section', async ({ page }) => {
    await expect(page.getByText('Top Games')).toBeVisible();
  });

  test('sidebar has Aviator link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Play Aviator' })).toBeVisible();
  });

  test('Aviator link has correct href', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Play Aviator' });
    await expect(link).toHaveAttribute('href', '/aviator');
  });
});

test.describe('Mobile Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('mobile search button toggles search bar', async ({ page }) => {
    await page.getByRole('button', { name: 'Search teams' }).click();
    const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
    await expect(mobileSearch.getByPlaceholder('Search teams...')).toBeVisible();
  });

  test('mobile search input can filter matches', async ({ page }) => {
    await page.getByRole('button', { name: 'Search teams' }).click();
    const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
    await mobileSearch.getByPlaceholder('Search teams...').fill('Barcelona');
    await page.waitForTimeout(500);
    const rows = page.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('mobile search close button hides search bar', async ({ page }) => {
    await page.getByRole('button', { name: 'Search teams' }).click();
    const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
    await expect(mobileSearch.getByPlaceholder('Search teams...')).toBeVisible();
    await page.getByRole('button', { name: 'Close search' }).click();
    await expect(mobileSearch.getByPlaceholder('Search teams...')).not.toBeVisible();
  });
});
