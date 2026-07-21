import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('Route: /aviator', () => {
	test('aviator page loads with correct title', async ({ page }) => {
		await page.goto(`${BASE}/aviator`, { waitUntil: 'networkidle' });
		await expect(page).toHaveTitle(/Aviator.*WAM/);
	});

	test('aviator page shows sidebar', async ({ page }) => {
		await page.goto(`${BASE}/aviator`, { waitUntil: 'networkidle' });
		const sidebar = page.locator('.hidden.xl\\:flex').first();
		await expect(sidebar).toBeVisible();
	});

	test('aviator page has iframe for game', async ({ page }) => {
		await page.goto(`${BASE}/aviator`, { waitUntil: 'networkidle' });
		const iframe = page.locator('iframe[title="Aviator"]');
		await expect(iframe).toBeVisible();
	});

	test('aviator iframe has fullscreen allow attribute', async ({ page }) => {
		await page.goto(`${BASE}/aviator`, { waitUntil: 'networkidle' });
		const iframe = page.locator('iframe[title="Aviator"]');
		await expect(iframe).toHaveAttribute('allow', /fullscreen/);
	});

	test('aviator page has main content area', async ({ page }) => {
		await page.goto(`${BASE}/aviator`, { waitUntil: 'networkidle' });
		const main = page.locator('#main-content');
		await expect(main).toBeVisible();
	});
});

test.describe('Route: /waitlist', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(`${BASE}/waitlist`, { waitUntil: 'networkidle' });
	});

	test('waitlist page loads with correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/WAM.*Waitlist/);
	});

	test('waitlist shows WAM logo linking home', async ({ page }) => {
		const logo = page.locator('a[href="/"]').first();
		await expect(logo).toBeVisible();
		await expect(logo).toContainText('WAM');
	});

	test('waitlist shows "Early Access" badge', async ({ page }) => {
		await expect(page.getByText('Early Access')).toBeVisible();
	});

	test('waitlist shows heading "GET IN EARLY"', async ({ page }) => {
		await expect(page.getByText('GET IN EARLY')).toBeVisible();
	});

	test('waitlist shows "+ KSH 500 FREE" text', async ({ page }) => {
		await expect(page.getByText('KSH 500 FREE')).toBeVisible();
	});

	test('waitlist shows phone input with +254 prefix', async ({ page }) => {
		await expect(page.getByText('+254')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Phone number' })).toBeVisible();
	});

	test('waitlist submit button is disabled with empty phone', async ({ page }) => {
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await expect(btn).toBeDisabled();
	});

	test('waitlist submit enables with valid 07xx phone', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await expect(btn).toBeEnabled();
	});

	test('waitlist submit enables with valid 01xx phone', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0112345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await expect(btn).toBeEnabled();
	});

	test('waitlist submit disabled with invalid phone (05 prefix)', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0512345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await expect(btn).toBeDisabled();
	});

	test('waitlist shows green checkmark when phone is valid', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		await expect(page.getByText('✓')).toBeVisible();
	});

	test('waitlist shows "No spam" disclaimer', async ({ page }) => {
		await expect(page.getByText('No spam')).toBeVisible();
	});

	test('waitlist shows "18+ only" text', async ({ page }) => {
		await expect(page.getByText('18+ only')).toBeVisible();
	});

	test('waitlist submit shows loading then success screen', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await btn.click();
		await expect(page.getByText('Joining...')).toBeVisible();
		await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 3000 });
	});

	test('waitlist success screen shows formatted phone', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await btn.click();
		await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 3000 });
		await expect(page.getByText('0712 345 678')).toBeVisible();
	});

	test('waitlist success shows "KSh 500 Bonus Reserved"', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await btn.click();
		await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 3000 });
		await expect(page.getByText('KSh 500 Bonus Reserved')).toBeVisible();
	});

	test('waitlist success has "Back to live odds" link', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await btn.click();
		await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 3000 });
		const backLink = page.getByText('Back to live odds');
		await expect(backLink).toBeVisible();
		await expect(backLink).toHaveAttribute('href', '/');
	});

	test('waitlist success screen shows formatted phone with spaces', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('0712345678');
		const btn = page.getByRole('button', { name: /Join Waitlist/ });
		await btn.click();
		await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 3000 });
		await expect(page.getByText('0712 345 678')).toBeVisible();
	});
});
