import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

/** Open the auth modal from the hero CTA (signup mode) */
async function openSignupModal(page: import('@playwright/test').Page) {
  await page.locator('button', { hasText: 'Join Free — Claim KSh 500' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

test.describe('Auth Modal – Login & Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
  });

  // ───────────────────── OPEN MODAL ─────────────────────

  test('opens from header "Join Now" button', async ({ page }) => {
    await page.getByRole('button', { name: 'Join now and claim KSh 500 bonus' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Create your free account')).toBeVisible();
  });

  test('opens from header "Log In" button', async ({ page }) => {
    await page.getByRole('button', { name: 'Log in to your account' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Header "Log In" opens modal (defaults to signup mode, then user can switch tabs)
    await expect(page.getByRole('button', { name: 'Sign Up' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('opens from hero CTA', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByText('Create your free account')).toBeVisible();
  });

  // ───────────────────── CLOSE MODAL ─────────────────────

  test('closes on Escape key', async ({ page }) => {
    await openSignupModal(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes on X button click', async ({ page }) => {
    await openSignupModal(page);
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes on backdrop click', async ({ page }) => {
    await openSignupModal(page);
    await page.mouse.click(10, 10);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  // ───────────────────── SIGNUP TAB (default) ─────────────────────

  test('signup tab active by default', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByRole('button', { name: 'Sign Up' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('signup shows "Create your free account" subtitle', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByText('Create your free account')).toBeVisible();
  });

  test('signup shows welcome bonus banner', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByText('Claim KSh 500 Welcome Bonus')).toBeVisible();
    await expect(page.getByText('Deposit KSh 100 via M-PESA to unlock')).toBeVisible();
  });

  test('signup has Phone, M-PESA, and Password fields', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.locator('#auth-phone')).toBeVisible();
    await expect(page.locator('#auth-mpesa')).toBeVisible();
    await expect(page.locator('#auth-password')).toBeVisible();
  });

  test('signup submit button shows "Create Account & Claim Bonus"', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeVisible();
  });

  test('signup shows terms, privacy, and BCLB text', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Terms')).toBeVisible();
    await expect(dialog.getByText('Privacy Policy')).toBeVisible();
    await expect(dialog.getByText('BCLB Kenya')).toBeVisible();
  });

  // ───────────────────── LOGIN TAB ─────────────────────

  test('switching to login shows "Welcome back"', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('login hides M-PESA field', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Log In' }).click();
    await expect(page.locator('#auth-mpesa')).not.toBeVisible();
    await expect(page.locator('#auth-phone')).toBeVisible();
    await expect(page.locator('#auth-password')).toBeVisible();
  });

  test('login shows "Forgot password?"', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Forgot password?')).toBeVisible();
  });

  test('login does NOT show welcome bonus', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Claim KSh 500 Welcome Bonus')).not.toBeVisible();
  });

  test('login submit button shows "Log In"', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    // Click the Log In tab (aria-label="Log In")
    await dialog.getByRole('button', { name: 'Log In', exact: true }).click();
    // The submit button (inside form) also says "Log In" — use .last() to get the submit
    await expect(dialog.getByRole('button', { name: 'Log In' }).last()).toBeVisible();
  });

  // ───────────────────── FORM VALIDATION ─────────────────────

  test('submit disabled when all fields empty', async ({ page }) => {
    await openSignupModal(page);
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeDisabled();
  });

  test('submit disabled with invalid phone (05 prefix)', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0512345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('password123');
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeDisabled();
  });

  test('submit enabled with valid 07xx phone', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('password123');
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeEnabled();
  });

  test('submit enabled with valid 01xx phone', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0112345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('password123');
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeEnabled();
  });

  test('submit disabled when password < 6 chars', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('12345');
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeDisabled();
  });

  test('submit enabled with exactly 6-char password', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('123456');
    await expect(page.getByRole('button', { name: 'Create Account & Claim Bonus' })).toBeEnabled();
  });

  // ───────────────────── PASSWORD TOGGLE ─────────────────────

  test('password visibility toggle works', async ({ page }) => {
    await openSignupModal(page);
    const passInput = page.locator('#auth-password');
    await passInput.fill('secret123');
    await expect(passInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(passInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(passInput).toHaveAttribute('type', 'password');
  });

  // ───────────────────── M-PESA AUTO-FILL ─────────────────────

  test('M-PESA auto-fills from phone number', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0798765432');
    const mpesaValue = await page.locator('#auth-mpesa').inputValue();
    expect(mpesaValue.replace(/\s/g, '')).toBe('0798765432');
  });

  // ───────────────────── SUBMISSION FLOW ─────────────────────

  test('signup: shows loading spinner then success', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('password123');
    await page.getByRole('button', { name: 'Create Account & Claim Bonus' }).click();

    await expect(page.getByText('Verifying...')).toBeVisible();
    await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('KSh 500 Bonus Activated')).toBeVisible();
  });

  test('login: shows loading spinner then success', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    // Switch to login tab
    await dialog.getByRole('button', { name: 'Log In', exact: true }).click();
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-password').fill('password123');

    // Click the submit button (the last "Log In" button — the form submit)
    await dialog.getByRole('button', { name: 'Log In' }).last().click();

    await expect(page.getByText('Verifying...')).toBeVisible();
    await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 5000 });
  });

  test('"Start Betting" button closes modal', async ({ page }) => {
    await openSignupModal(page);
    await page.locator('#auth-phone').fill('0712345678');
    await page.locator('#auth-mpesa').fill('0712345678');
    await page.locator('#auth-password').fill('password123');
    await page.getByRole('button', { name: 'Create Account & Claim Bonus' }).click();
    await expect(page.getByText("YOU'RE IN!")).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'Start Betting →' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  // ───────────────────── MOBILE AUTH ─────────────────────

  test('mobile: hamburger menu → Join Now opens modal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Join now and claim KSh 500 bonus' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Create your free account')).toBeVisible();
  });

  test('mobile: hamburger menu → Log In opens modal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Log in to your account' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Modal opens in signup mode (default); verify tab buttons are present
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In', exact: true })).toBeVisible();
  });

  // ───────────────────── FOCUS MANAGEMENT ─────────────────────

  test('dialog is interactive on open', async ({ page }) => {
    await openSignupModal(page);
    const dialog = page.getByRole('dialog');
    // Dialog should be visible and have role=dialog with aria-modal
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('role', 'dialog');
  });

  test('tab key moves focus through form fields', async ({ page }) => {
    await openSignupModal(page);

    // Click the phone input to ensure focus starts there
    await page.locator('#auth-phone').click();
    await expect(page.locator('#auth-phone')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#auth-mpesa')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#auth-password')).toBeFocused();
  });
});
