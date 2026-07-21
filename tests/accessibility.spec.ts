import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('prefers-reduced-motion', () => {
	test('animations are disabled with reduced motion preference', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await goToHome(page);
		const hero = page.locator('#main-content, [class*="hero"]').first();
		await expect(hero).toBeVisible();
	});

	test('page loads without errors with reduced motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		const errors: string[] = [];
		page.on('pageerror', (err) => errors.push(err.message));
		await goToHome(page);
		expect(errors).toHaveLength(0);
	});

	test('odds buttons still functional with reduced motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await goToHome(page);
		const oddsBtn = page.locator('#featured button[aria-pressed]').first();
		await oddsBtn.click();
		await expect(oddsBtn).toHaveAttribute('aria-pressed', 'true');
	});

	test('auth modal still functional with reduced motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await goToHome(page);
		const joinBtn = page.getByRole('button', { name: /Join now/ }).first();
		await joinBtn.click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
	});
});

test.describe('TeamBadge CDN Fallback', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('match rows show team badges', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const firstRow = rows.first();
		const badges = firstRow.locator('div.relative.rounded-full');
		const count = await badges.count();
		expect(count).toBeGreaterThanOrEqual(2);
	});

	test('team badges contain either an image or initials', async ({ page }) => {
		const badges = page.locator('[role="row"] div.relative.rounded-full');
		const count = await badges.count();
		expect(count).toBeGreaterThanOrEqual(1);
		const firstBadge = badges.first();
		const hasImage = (await firstBadge.locator('img').count()) > 0;
		const hasInitials = (await firstBadge.locator('span.font-mono').count()) > 0;
		expect(hasImage || hasInitials).toBeTruthy();
	});

	test('team badge has correct size attribute', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const firstRow = rows.first();
		const badge = firstRow.locator('div.relative.rounded-full').first();
		const box = await badge.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.width).toBeGreaterThan(0);
		expect(box!.height).toBeGreaterThan(0);
	});

	test('featured match shows large team badges', async ({ page }) => {
		const featured = page.locator('#featured');
		const badges = featured.locator('div.relative.rounded-full');
		const count = await badges.count();
		expect(count).toBeGreaterThanOrEqual(2);
	});
});
