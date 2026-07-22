import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
}

test.describe('Responsive Layout – Desktop (1440px)', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await goToHome(page);
	});

	test('desktop header with "Join Now" button is visible', async ({ page }) => {
		await expect(
			page.getByRole('button', { name: 'Join now and claim KSh 500 bonus' }).first()
		).toBeVisible();
	});

	test('header "Log In" button is visible', async ({ page }) => {
		await expect(
			page.getByRole('button', { name: 'Log in to your account' }).first()
		).toBeVisible();
	});

	test('sidebar search is visible', async ({ page }) => {
		await expect(page.getByRole('textbox', { name: 'Search teams' }).first()).toBeVisible();
	});

	test('mobile menu button is hidden', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Open menu' })).not.toBeVisible();
	});

	test('mobile search button is hidden', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Search teams' })).not.toBeVisible();
	});

	test('footer mobile sticky CTA is hidden', async ({ page }) => {
		await expect(page.getByText('Ready to bet?')).not.toBeVisible();
	});

	test('match rows are visible', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const count = await rows.count();
		expect(count).toBeGreaterThan(0);
	});

	test('featured match is visible', async ({ page }) => {
		await expect(page.locator('#featured')).toBeVisible();
	});
});

test.describe('Responsive Layout – Tablet (768px)', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await goToHome(page);
	});

	test('match feed is visible', async ({ page }) => {
		const main = page.locator('#main-content');
		await expect(main).toBeVisible();
	});

	test('featured match is visible', async ({ page }) => {
		await expect(page.locator('#featured')).toBeVisible();
	});

	test('footer is visible', async ({ page }) => {
		await expect(page.locator('footer')).toBeVisible();
	});
});

test.describe('Responsive Layout – Mobile (375px)', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await goToHome(page);
	});

	test('mobile header with hamburger is visible', async ({ page }) => {
		await expect(page.getByRole('button', { name: /menu/ })).toBeVisible();
	});

	test('WAM logo is visible in mobile header', async ({ page }) => {
		const mobileWam = page.locator('.xl\\:hidden a').filter({ hasText: 'WAM' });
		await expect(mobileWam).toBeVisible();
	});

	test('mobile hamburger menu opens', async ({ page }) => {
		await page.getByRole('button', { name: 'Open menu' }).click();
		await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
		const menuPanel = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
		await expect(menuPanel.getByRole('button', { name: /Join now/ })).toBeVisible();
	});

	test('mobile hamburger menu closes', async ({ page }) => {
		await page.getByRole('button', { name: 'Open menu' }).click();
		await page.getByRole('button', { name: 'Close menu' }).click();
		await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
	});

	test('mobile search toggle works', async ({ page }) => {
		await page.getByRole('button', { name: 'Search teams' }).click();
		const mobileSearch = page.locator('.xl\\:hidden.fixed.top-\\[56px\\]').first();
		await expect(mobileSearch.getByPlaceholder('Search teams...')).toBeVisible();
	});

	test('hero CTA is visible on mobile', async ({ page }) => {
		await expect(page.getByRole('button', { name: /Join Free/ })).toBeVisible();
	});

	test('footer mobile sticky CTA is visible', async ({ page }) => {
		await expect(page.getByText('Ready to bet?')).toBeVisible();
	});

	test('matches section is visible', async ({ page }) => {
		await expect(page.locator('#matches')).toBeVisible();
	});

	test('odds buttons are tap-friendly', async ({ page }) => {
		const oddsBtn = page.locator('[role="row"] button[aria-pressed]').first();
		const box = await oddsBtn.boundingBox();
		expect(box).toBeTruthy();
		expect(box!.width).toBeGreaterThanOrEqual(36);
		expect(box!.height).toBeGreaterThanOrEqual(36);
	});
});

test.describe('Responsive Layout – Large Desktop (1920px)', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });
		await goToHome(page);
	});

	test('content is visible', async ({ page }) => {
		await expect(page.locator('#main-content')).toBeVisible();
	});

	test('match rows are visible', async ({ page }) => {
		const rows = page.locator('[role="row"]');
		const count = await rows.count();
		expect(count).toBeGreaterThan(0);
	});
});

test.describe('SEO & Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('page has correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/WAM/);
	});

	test('page has meta description', async ({ page }) => {
		const desc = await page.locator('meta[name="description"]').first().getAttribute('content');
		expect(desc).toBeTruthy();
	});

	test('main content has proper heading hierarchy', async ({ page }) => {
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
	});

	test('interactive elements have aria labels', async ({ page }) => {
		await expect(page.getByRole('button', { name: /Join now/i }).first()).toBeVisible();
		await expect(page.getByRole('button', { name: /Log in/i }).first()).toBeVisible();
	});

	test('auth modal has proper aria attributes', async ({ page }) => {
		await page.getByRole('button', { name: 'Join now and claim KSh 500 bonus' }).first().click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toHaveAttribute('aria-modal', 'true');
		await expect(dialog).toHaveAttribute('role', 'dialog');
	});
});
