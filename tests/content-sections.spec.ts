import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('Hero Section', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('hero heading is visible', async ({ page }) => {
		await expect(page.getByText('BET ON EVERY')).toBeVisible();
		await expect(page.getByText('MATCH DAY.')).toBeVisible();
	});

	test('hero has CTA button', async ({ page }) => {
		await expect(page.getByRole('button', { name: /Join Free/ })).toBeVisible();
	});

	test('hero has "See live odds" link', async ({ page }) => {
		await expect(page.getByRole('link', { name: /See live odds/ })).toBeVisible();
	});

	test('"See live odds" links to #matches', async ({ page }) => {
		const link = page.getByRole('link', { name: /See live odds/ });
		await expect(link).toHaveAttribute('href', '#matches');
	});

	test('hero shows "100+" stat', async ({ page }) => {
		await expect(page.getByText('100+')).toBeVisible();
	});

	test('hero shows Markets per match', async ({ page }) => {
		await expect(page.getByText('Markets per match')).toBeVisible();
	});

	test('hero shows trust chips text', async ({ page }) => {
		await expect(page.getByText('M-PESA Instant')).toBeVisible();
		await expect(page.getByText('BCLB Licensed')).toBeVisible();
	});

	test('hero shows "Deposits & withdrawals" subtitle', async ({ page }) => {
		await expect(page.getByText('Deposits & withdrawals')).toBeVisible();
	});

	test('hero shows "Kenya Gaming Board" subtitle', async ({ page }) => {
		await expect(page.getByText('Kenya Gaming Board')).toBeVisible();
	});
});

test.describe('Trust Section', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('shows withdrawal speed stat', async ({ page }) => {
		await expect(page.getByText('avg. withdrawal')).toBeVisible();
	});

	test('shows "50K+ bettors" stat', async ({ page }) => {
		await expect(page.getByText('50K+')).toBeVisible();
		await expect(page.getByText('bettors')).toBeVisible();
	});

	test('shows "KSh 2M+ paid daily" stat', async ({ page }) => {
		await expect(page.getByText('KSh 2M+')).toBeVisible();
		await expect(page.getByText('paid daily')).toBeVisible();
	});

	test('shows "99.8% uptime" stat', async ({ page }) => {
		await expect(page.getByText('99.8%')).toBeVisible();
		await expect(page.getByText('uptime')).toBeVisible();
	});

	test('shows testimonials', async ({ page }) => {
		await expect(page.getByText('James M.')).toBeVisible();
		await expect(page.getByText('Peter K.')).toBeVisible();
		await expect(page.getByText('Faith W.')).toBeVisible();
	});

	test('testimonials show city names', async ({ page }) => {
		await expect(page.getByText('Nairobi')).toBeVisible();
		await expect(page.getByText('Mombasa')).toBeVisible();
		await expect(page.getByText('Kisumu')).toBeVisible();
	});

	test('testimonials show star ratings', async ({ page }) => {
		await expect(page.getByText('Withdrew KSh 12,500')).toBeVisible();
	});

	test('trust badges are visible', async ({ page }) => {
		await expect(page.getByText('M-PESA Partner')).toBeVisible();
		await expect(page.getByText('SSL Secured')).toBeVisible();
	});
});

test.describe('Promo Banners', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('shows promo banners', async ({ page }) => {
		await expect(page.getByText('SPORTS WELCOME BONUS')).toBeVisible();
		await expect(page.getByText('EARLY PAYOUT OFFER')).toBeVisible();
		await expect(page.getByText('WEEKLY FREE BET')).toBeVisible();
	});

	test('first banner is active by default', async ({ page }) => {
		const banner = page.getByRole('button', { name: /SPORTS WELCOME BONUS/ });
		await expect(banner).toHaveAttribute('aria-pressed', 'true');
	});

	test('clicking a banner activates it', async ({ page }) => {
		const banner2 = page.getByRole('button', { name: /EARLY PAYOUT OFFER/ });
		await banner2.click();
		await expect(banner2).toHaveAttribute('aria-pressed', 'true');
	});

	test('banner shows deposit text', async ({ page }) => {
		await expect(page.getByText('on your first deposit')).toBeVisible();
	});
});

test.describe('Footer', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('footer shows copyright', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('© 2026 WAM Ltd')).toBeVisible();
	});

	test('footer shows license info', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Licensed by BCLB Kenya')).toBeVisible();
	});

	test('footer shows "Gamble responsibly"', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Please gamble responsibly')).toBeVisible();
	});

	test('footer has Sports column', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByRole('heading', { name: 'Sports' })).toBeVisible();
	});

	test('footer has Company column', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Company')).toBeVisible();
	});

	test('footer has Support column', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Support')).toBeVisible();
	});

	test('footer shows sports links', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Football')).toBeVisible();
		await expect(footer.getByText('Basketball')).toBeVisible();
	});

	test('footer shows support links', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer.getByText('Help Centre')).toBeVisible();
		await expect(footer.getByText('Live Chat')).toBeVisible();
	});

	test('footer mobile sticky CTA is hidden on desktop', async ({ page }) => {
		await expect(page.getByText('Ready to bet?')).not.toBeVisible();
	});
});

test.describe('How to Bet Section', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('shows "How to bet" heading', async ({ page }) => {
		await expect(page.getByText('How to bet')).toBeVisible();
	});

	test('shows 3 steps', async ({ page }) => {
		await expect(page.getByText('Pick your odds')).toBeVisible();
		await expect(page.getByText('Set your stake')).toBeVisible();
		await expect(page.getByText('Place & win')).toBeVisible();
	});

	test('shows keyboard shortcuts info', async ({ page }) => {
		await expect(page.getByText('Keyboard:')).toBeVisible();
	});

	test('shows odds direction legend', async ({ page }) => {
		await expect(page.getByText('rising')).toBeVisible();
		await expect(page.getByText('falling')).toBeVisible();
	});
});
