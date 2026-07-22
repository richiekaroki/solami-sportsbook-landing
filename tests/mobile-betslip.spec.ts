import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToMobile(page: Page) {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
}

async function addSelection(page: Page) {
	const oddsBtn = page.locator('#featured button[aria-pressed="false"]').first();
	await oddsBtn.click();
	await page.waitForTimeout(300);
}

test.describe('Mobile Bet Slip Sheet', () => {
	test.beforeEach(async ({ page }) => {
		await goToMobile(page);
	});

	test('floating cart button appears after adding selection', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await expect(cartBtn).toBeVisible();
	});

	test('floating cart shows selection count', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await expect(cartBtn).toContainText('1');
	});

	test('clicking floating cart opens bottom sheet', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		const sheet = page.getByRole('dialog', { name: 'Bet slip' });
		await expect(sheet).toBeVisible();
	});

	test('bottom sheet shows "BET SLIP" header', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		await expect(page.getByText('BET SLIP')).toBeVisible();
	});

	test('bottom sheet has Single and Accumulator tabs', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		await expect(page.getByRole('button', { name: 'Single bets' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Accumulator bets' })).toBeVisible();
	});

	test('bottom sheet shows stake input', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		await expect(page.getByRole('spinbutton', { name: /Stake amount/ })).toBeVisible();
	});

	test('bottom sheet shows quick stake buttons', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		const buttons = page.getByRole('button', { name: /Set stake to KSh/ });
		await expect(buttons).toHaveCount(4);
	});

	test('bottom sheet close button closes the sheet', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		const sheet = page.getByRole('dialog', { name: 'Bet slip' });
		await expect(sheet).toBeVisible();
		await page.getByRole('button', { name: 'Close bet slip' }).click();
		await expect(sheet).not.toBeVisible();
	});

	test('bottom sheet "Clear all" clears selections', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		await page.getByRole('button', { name: 'Clear all selections' }).click();
		await expect(cartBtn).not.toBeVisible();
	});

	test('bottom sheet backdrop closes the sheet', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		const sheet = page.getByRole('dialog', { name: 'Bet slip' });
		await expect(sheet).toBeVisible();
		const backdrop = page.locator('.xl\\:hidden.fixed.inset-0.z-\\[95\\]');
		await backdrop.click({ position: { x: 10, y: 10 } });
		await expect(sheet).not.toBeVisible();
	});

	test('bottom sheet shows Place Bet button', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		const sheet = page.getByRole('dialog', { name: 'Bet slip' });
		await expect(sheet.getByRole('button', { name: /Place Bet/ })).toBeVisible();
	});

	test('bottom sheet shows potential win', async ({ page }) => {
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await cartBtn.click();
		await expect(page.getByText('Potential Win')).toBeVisible();
	});

	test('floating cart button hidden on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
		await addSelection(page);
		const cartBtn = page.getByRole('button', { name: 'Open bet slip' });
		await expect(cartBtn).not.toBeVisible();
	});
});
