import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle' });
}

/** Click first odds button in the featured match grid */
async function addFeaturedOdds(page: Page) {
	const oddsBtn = page.locator('#featured button[aria-pressed="false"]').first();
	await oddsBtn.click();
	return oddsBtn;
}

/** Add selections from different match rows (different markets) */
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

test.describe('Bet Slip – Desktop Panel', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	// ── EMPTY STATE ──

	test('desktop panel shows "No selections yet" when empty', async ({ page }) => {
		await expect(page.getByText('No selections yet')).toBeVisible();
		await expect(page.getByText('Click any odds button')).toBeVisible();
	});

	test('desktop panel shows empty potential win "KSh 0.00"', async ({ page }) => {
		await expect(page.getByText('KSh 0.00')).toBeVisible();
	});

	test('desktop panel "Select Odds to Bet" button is disabled initially', async ({ page }) => {
		const btn = page.getByRole('button', { name: /Select Odds to Bet/ });
		await expect(btn).toBeDisabled();
	});

	// ── ADDING SELECTIONS ──

	test('clicking odds adds selection to bet slip', async ({ page }) => {
		await addFeaturedOdds(page);
		await expect(page.getByText('No selections yet')).not.toBeVisible();
	});

	test('multiple selections from different rows show correct count', async ({ page }) => {
		await addMultipleRowSelections(page, 3);
		await expect(page.getByRole('button', { name: /Place Bet — 3 bets/ })).toBeVisible();
	});

	// ── REMOVE SELECTION ──

	test('removing a selection updates the slip', async ({ page }) => {
		await addMultipleRowSelections(page, 2);
		// Click first remove button in the desktop panel
		await page.locator('[aria-label^="Remove"]').first().click();
		await page.waitForTimeout(300);
		await expect(page.getByRole('button', { name: /Place Bet — 1 bet/ })).toBeVisible();
	});

	// ── STAKE INPUT ──

	test('stake input has default value of 100', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		await expect(stakeInput).toHaveValue('100');
	});

	test('quick stake buttons set the stake value', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		// Click the quick stake button (they are in the panel footer area)
		await page.locator('button', { hasText: /^200$/ }).last().click();
		await expect(stakeInput).toHaveValue('200');
	});

	test('quick stake 500 sets value to 500', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		await page.locator('button', { hasText: /^500$/ }).last().click();
		await expect(stakeInput).toHaveValue('500');
	});

	test('custom stake can be typed into input', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		await stakeInput.fill('250');
		await expect(stakeInput).toHaveValue('250');
	});

	// ── STAKE VALIDATION ──

	test('stake below MIN_STAKE shows error', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		await stakeInput.fill('5');
		await expect(page.getByText('Min KSh 10')).toBeVisible();
	});

	test('stake above MAX_STAKE shows error', async ({ page }) => {
		const stakeInput = page.locator('input[aria-label="Stake amount in Kenyan shillings"]').last();
		await stakeInput.fill('600000');
		await expect(page.getByText('Max KSh 500,000')).toBeVisible();
	});

	// ── SINGLE / ACCA TABS ──

	test('single tab is active by default', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Single bets' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	test('switching to accumulator tab', async ({ page }) => {
		await page.getByRole('button', { name: 'Accumulator bets' }).click();
		await expect(page.getByRole('button', { name: 'Accumulator bets' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	test('accumulator shows total odds with multiple selections', async ({ page }) => {
		await addMultipleRowSelections(page, 2);
		await page.getByRole('button', { name: 'Accumulator bets' }).click();
		await expect(page.getByText('Total odds')).toBeVisible();
	});

	// ── PLACE BET ──

	test('place bet button enables with selection and valid stake', async ({ page }) => {
		await addFeaturedOdds(page);
		const btn = page.getByRole('button', { name: /Place Bet/ });
		await expect(btn).toBeEnabled();
	});

	test('place bet button shows bet count', async ({ page }) => {
		await addMultipleRowSelections(page, 2);
		await expect(page.getByRole('button', { name: /Place Bet — 2 bets/ })).toBeVisible();
	});

	test('clicking place bet opens confirm dialog', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.getByRole('button', { name: /Place Bet/ }).click();
		await expect(page.getByRole('dialog', { name: 'Confirm bet' })).toBeVisible();
	});

	test('confirm dialog shows selections and stake', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.getByRole('button', { name: /Place Bet/ }).click();
		const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
		await expect(dialog.getByText('Confirm Bet')).toBeVisible();
		await expect(dialog.getByText('Stake')).toBeVisible();
	});

	test('confirm dialog cancel closes it', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.getByRole('button', { name: /Place Bet/ }).click();
		const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
		await dialog.getByRole('button', { name: /Cancel/ }).click();
		await expect(dialog).not.toBeVisible();
	});

	test('confirm dialog Escape closes it', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.getByRole('button', { name: /Place Bet/ }).click();
		const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
		await expect(dialog).toBeVisible();
		// Focus the dialog so its keydown handler fires
		await dialog.click();
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
	});

	test('confirming bet clears the slip', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.getByRole('button', { name: /Place Bet/ }).click();
		const dialog = page.getByRole('dialog', { name: 'Confirm bet' });
		await dialog.getByRole('button', { name: /Confirm/ }).click();
		await expect(dialog).not.toBeVisible();
		await expect(page.getByText('No selections yet')).toBeVisible();
	});

	// ── TOASTS ──

	test('adding odds shows toast notification', async ({ page }) => {
		await addFeaturedOdds(page);
		await expect(page.getByRole('status')).toBeVisible();
	});

	test('removing odds shows undo toast', async ({ page }) => {
		await addFeaturedOdds(page);
		// Find the remove button in the bet slip area (not the featured match)
		await page.locator('[aria-label^="Remove"]').first().click();
		await expect(page.getByText(/removed/)).toBeVisible();
		await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible();
	});

	test('undo button restores the selection', async ({ page }) => {
		await addFeaturedOdds(page);
		await page.locator('[aria-label^="Remove"]').first().click();
		await page.getByRole('button', { name: 'Undo' }).click();
		await page.waitForTimeout(300);
		await expect(page.getByText('No selections yet')).not.toBeVisible();
	});
});
