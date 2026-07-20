# WAM Sportsbook Landing — E2E Test Suite

Playwright end-to-end tests for the WAM Sportsbook Landing page (`solami-sportsbook-landing`).

## Quick Start

```bash
# Install dependencies (if not already)
npm install
npx playwright install chromium

# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/auth.spec.ts

# Run with UI mode
npx playwright test --ui

# Run headed (visible browser)
npx playwright test --headed
```

## Architecture

| File                       | Tests   | What it covers                                                                           |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `auth.spec.ts`             | 33      | Login/signup modal — open, close, form fields, validation, submission                    |
| `betslip.spec.ts`          | 25      | Bet slip — add/remove, stake input, quick stakes, single/acca tabs, confirm flow, toasts |
| `content-sections.spec.ts` | 34      | Page sections — hero, trust stats, promo banners, footer, "How to bet"                   |
| `navigation.spec.ts`       | 19      | Sports nav, competition filters, sidebar, desktop + mobile search                        |
| `odds-match.spec.ts`       | 26      | Featured match odds grid, match feed, competition groups, keyboard nav, live updates     |
| `responsive.spec.ts`       | 27      | Responsive layouts (375px/768px/1440px/1920px), SEO, accessibility                       |
| **Total**                  | **164** |                                                                                          |

## Configuration

`playwright.config.ts`:

```ts
{
  workers: 1,         // Single worker — multiple workers cause OOM on this machine
  retries: 2,        // Retries handle V8 memory pressure / OOM flakes
  timeout: 30_000,    // Per-test timeout
  viewport: 1440x900, // Default viewport (overridden per test for responsive)
  headless: true,
  reuseExistingServer: true,  // Reuses running dev server on :5173
}
```

## Prerequisites

- Dev server must be running on `http://localhost:5173` (`npm run dev`)
- Chromium browser installed (`npx playwright install chromium`)
- Node.js memory: OOM crashes are common on machines with <16GB RAM — retries compensate

## Test Pattern

Every test file follows this structure:

1. **`beforeEach`** navigates to `http://localhost:5173` with `waitUntil: 'networkidle'`
2. Tests use **Playwright locators** (`getByRole`, `getByText`, `getByPlaceholder`, CSS selectors)
3. Responsive tests override `page.setViewportSize()` in their `beforeEach`
4. Helper functions at the top of each file encapsulate common actions (e.g., `addFeaturedOdds`, `addMultipleRowSelections`)

## Key Source Files

| Source                                            | Component                                        |
| ------------------------------------------------- | ------------------------------------------------ |
| `src/lib/components/ui/AuthModal.svelte`          | Auth modal (signup/login modes)                  |
| `src/lib/components/features/BetSlip.svelte`      | Mobile bet slip sheet                            |
| `src/lib/components/features/BetSlipPanel.svelte` | Desktop bet slip panel                           |
| `src/lib/components/features/OddsGrid.svelte`     | Featured match odds grid                         |
| `src/lib/components/features/MatchRow.svelte`     | Match row (1X2 + DC + GGNG markets)              |
| `src/lib/components/layout/Header.svelte`         | Header (desktop + mobile nav)                    |
| `src/lib/components/layout/Sidebar.svelte`        | Desktop sidebar (search + Aviator)               |
| `src/lib/components/layout/SportsNav.svelte`      | Competition filter tabs                          |
| `src/lib/components/sections/HeroSection.svelte`  | Hero section with CTA                            |
| `src/lib/components/sections/TrustSection.svelte` | Trust stats + testimonials                       |
| `src/lib/components/layout/PromoBanner.svelte`    | Promo banner carousel                            |
| `src/lib/stores/betslip.ts`                       | Bet slip store (toggle, remove, localStorage)    |
| `src/lib/utils/formatters.ts`                     | formatKEPhone, formatOdds, formatKES             |
| `src/routes/+page.svelte`                         | Main page (layout, footer, live odds simulation) |

## Detailed Docs

- [e2e-test-catalog.md](./e2e-test-catalog.md) — Full test catalog with descriptions
- [e2e-pitfalls.md](./e2e-pitfalls.md) — Lessons learned and common Playwright pitfalls
