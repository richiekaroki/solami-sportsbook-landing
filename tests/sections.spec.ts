import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
}

test.describe('ReferAFriend Section', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('shows "Refer a Friend" heading', async ({ page }) => {
		await expect(page.getByText('Refer a Friend')).toBeVisible();
	});

	test('shows bonus amount "KSh 250"', async ({ page }) => {
		await expect(page.getByText('KSh 250')).toBeVisible();
	});

	test('shows "Both get" text', async ({ page }) => {
		await expect(page.getByText('Both get')).toBeVisible();
	});

	test('shows referral code "WAM500"', async ({ page }) => {
		await expect(page.getByText('WAM500')).toBeVisible();
	});

	test('copy button exists with aria-label', async ({ page }) => {
		const copyBtn = page.getByRole('button', { name: 'Copy referral code' });
		await expect(copyBtn).toBeVisible();
	});

	test('copy button has min 44px touch target', async ({ page }) => {
		const copyBtn = page.getByRole('button', { name: 'Copy referral code' });
		const box = await copyBtn.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.width).toBeGreaterThanOrEqual(44);
		expect(box!.height).toBeGreaterThanOrEqual(44);
	});
});

test.describe('ResponsibleGambling Section', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('shows "Responsible Gambling" heading', async ({ page }) => {
		await expect(page.getByText('Responsible Gambling')).toBeVisible();
	});

	test('shows responsible gambling advice text', async ({ page }) => {
		await expect(page.getByText('Gambling should be fun, not a problem')).toBeVisible();
	});

	test('shows "Set limits" text', async ({ page }) => {
		await expect(page.getByText('Set limits')).toBeVisible();
	});

	test('shows helpline number "0800 723 456"', async ({ page }) => {
		await expect(page.getByText('0800 723 456')).toBeVisible();
	});

	test('shows "toll-free" label', async ({ page }) => {
		await expect(page.getByText('toll-free')).toBeVisible();
	});

	test('shows "Need help?" text', async ({ page }) => {
		await expect(page.getByText('Need help?')).toBeVisible();
	});
});
