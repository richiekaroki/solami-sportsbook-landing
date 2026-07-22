import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToMobile(page: Page) {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
}

async function addSelectionAndOpenSheet(page: Page) {
	const oddsBtn = page.locator('#featured button[aria-pressed="false"]').first();
	await oddsBtn.click();
	await page.waitForTimeout(300);
	const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
	await cartBtn.click();
	await page.waitForTimeout(500);
}

test.describe('Quick-Stake Buttons (Mobile)', () => {
	test.beforeEach(async ({ page }) => {
		await goToMobile(page);
		await addSelectionAndOpenSheet(page);
	});

	test('all 4 quick stake buttons exist', async ({ page }) => {
		const buttons = page.getByRole('button', { name: /Set stake to KSh/ });
		await expect(buttons).toHaveCount(4);
	});

	test('KSh 50 button is clickable', async ({ page }) => {
		const btn = page.getByRole('button', { name: 'Set stake to KSh 50', exact: true });
		await expect(btn).toBeEnabled();
		await btn.click();
	});

	test('KSh 200 button is clickable', async ({ page }) => {
		const btn = page.getByRole('button', { name: 'Set stake to KSh 200', exact: true });
		await btn.click();
	});

	test('KSh 500 button is clickable', async ({ page }) => {
		const btn = page.getByRole('button', { name: 'Set stake to KSh 500', exact: true });
		await btn.click();
	});

	test('quick stake buttons have min 44px touch target', async ({ page }) => {
		const btn = page.getByRole('button', { name: 'Set stake to KSh 100', exact: true });
		const box = await btn.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.height).toBeGreaterThanOrEqual(44);
	});
});
