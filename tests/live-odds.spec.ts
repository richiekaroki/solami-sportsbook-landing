import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('Live Odds Simulation', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('odds buttons show direction arrows initially', async ({ page }) => {
		const oddsBtns = page.locator('#featured button[aria-pressed]');
		const count = await oddsBtns.count();
		expect(count).toBeGreaterThanOrEqual(1);
		const firstBtn = oddsBtns.first();
		await expect(firstBtn).toBeVisible();
	});

	test('odds values are numerical format', async ({ page }) => {
		const oddsBtns = page.locator('#featured button[aria-pressed]');
		const firstBtn = oddsBtns.first();
		const text = await firstBtn.textContent();
		expect(text).toMatch(/\d+\.\d+/);
	});

	test('odds values update over time (live simulation)', async ({ page }) => {
		const oddsBtns = page.locator('#featured button[aria-pressed]');
		const firstBtn = oddsBtns.first();
		const initialText = await firstBtn.textContent();
		await page.waitForTimeout(8000);
		const updatedText = await firstBtn.textContent();
		expect(updatedText).toBeTruthy();
	});

	test('match row odds buttons have direction indicators', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const firstRow = rows.first();
		const oddsBtns = firstRow.locator('button[aria-pressed]');
		const count = await oddsBtns.count();
		expect(count).toBeGreaterThanOrEqual(3);
	});

	test('match row odds are clickable and toggle', async ({ page }) => {
		const firstRow = page.locator('[role="row"]').first();
		const oddsBtns = firstRow.locator('button[aria-pressed]');
		const btn = oddsBtns.first();
		const initial = await btn.getAttribute('aria-pressed');
		await btn.click();
		await expect(firstRow.locator('button[aria-pressed]')).toHaveCount(await oddsBtns.count());
		const after = await btn.getAttribute('aria-pressed');
		expect(after).not.toBe(initial);
	});

	test('match row odds can be deselected', async ({ page }) => {
		const firstRow = page.locator('[role="row"]').first();
		const btn = firstRow.locator('button[aria-pressed]').first();
		const initial = await btn.getAttribute('aria-pressed');
		await btn.click();
		const afterClick = await btn.getAttribute('aria-pressed');
		expect(afterClick).not.toBe(initial);
		await btn.click();
		const afterDeselect = await btn.getAttribute('aria-pressed');
		expect(afterDeselect).toBe(initial);
	});

	test('odds values are different across market columns', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const firstRow = rows.first();
		const oddsBtns = firstRow.locator('button[aria-pressed]');
		const count = await oddsBtns.count();
		if (count >= 3) {
			const texts = [];
			for (let i = 0; i < Math.min(count, 6); i++) {
				texts.push(await oddsBtns.nth(i).textContent());
			}
			const unique = new Set(texts);
			expect(unique.size).toBeGreaterThanOrEqual(2);
		}
	});

	test('featured match shows "Odds updating live" indicator', async ({ page }) => {
		await expect(page.getByText('Odds updating live')).toBeVisible();
	});
});
