# WAM Sportsbook Landing Page

A production-grade sports betting landing page built as a frontend technical assessment for **WAM** — Kenya's emerging sportsbook platform.

**Live demo:** https://wam-sportsbook-landing.vercel.app

---

## Screenshots

| Desktop (1440×900)                | Mobile (390×844)                |
| --------------------------------- | ------------------------------- |
| ![Desktop](test-desktop-full.png) | ![Mobile](test-mobile-full.png) |

---

## Tech Stack

| Layer         | Choice                                          |
| ------------- | ----------------------------------------------- |
| Framework     | SvelteKit 2 + Svelte 5 (Runes mode)             |
| Language      | TypeScript                                      |
| Styling       | Tailwind CSS v4 + CSS custom properties         |
| Build tool    | Vite 8 (Rolldown)                               |
| Icons         | Lucide Svelte                                   |
| Date handling | date-fns                                        |
| Fonts         | Satoshi (Fontshare), Bebas Neue, JetBrains Mono |
| Deployment    | Vercel (adapter-auto) / Static (adapter-static) |

---

## Features

### Sportsbook Core

- **3-column layout** — left sidebar, scrollable match feed, sticky betslip panel
- **Inline match rows** — 1X2 (wide 52px buttons) · Double Chance · GG/NG, all on one row
- **Real team badges** — CDN crests for all teams with graceful fallback to coloured initials
- **Live odds simulation** — random drift every 6s with ▲▼ direction indicators
- **Market deduplication** — selecting a new 1X2 outcome replaces the previous pick
- **Loading skeleton** — pulse animation placeholders with "Loading matches..." indicator
- **Search filtering** — real-time search across team names and competitions

### Betslip & Math

- **Kenya tax breakdown** — 7.5% excise duty + 20% withholding tax (KRA-compliant), expandable payout breakdown
- **Quick-stake buttons** — KSh 50 / 100 / 200 / 500 one-tap shortcuts
- **Quick-stake keyboard shortcuts** — Keys 1-4 set stake instantly
- **Stake validation** — min KSh 10 · max KSh 500,000 with inline error state
- **Max 20 selections** guard with explanatory toast ("remove one to add another")
- **Pay via M-PESA** — primary CTA using M-PESA brand green
- **Undo on removal** — 5-second undo window when removing selections
- **Bet confirmation dialog** — review before placing with animated scale-in
- **Popular picks** — empty bet slip shows popular bet suggestions

### Conversion & UX

- **Hero section** — headline, live badge, M-PESA callout, asymmetric trust stat (dominant 100+ stat + secondary chips)
- **"How to bet" guide** — 3-step guide with keyboard shortcut hints and odds movement legend
- **Auth modal** — phone number validation (07/01 prefix), auto-formatting (`0712 345 678`), M-PESA field, password show/hide, loading state, animated success screen. Shared via `authModalOpen` store.
- **Trust section** — asymmetric layout: dominant 4 MIN stat card + 3 compact stat strips, testimonials, platform stats
- **Mobile betslip** — floating cart button → slide-up bottom sheet (92dvh)
- **Mobile search** — search icon toggles search input panel
- **Mobile sticky CTA** — persistent Join Now strip in footer
- **/waitlist route** — phone capture page with WhatsApp launch promise
- **/aviator route** — Aviator game "Coming Soon" page with feature preview
- **Consolidated CTAs** — unified "Join Free — Claim KSh 500" across all surfaces
- **2 promo banners** — Welcome Bonus + Weekly Free Bet (consolidated from 3)

### Accessibility (WCAG 2.1 AA)

- `lang="en-KE"` on `<html>`
- Skip-to-content link (`a[href="#main-content"]`)
- `aria-live="polite"` for toast notifications
- `aria-label` on all interactive buttons (46+ labeled)
- `aria-pressed` on odds toggle buttons
- `role="dialog"` + `aria-modal` + `aria-label` on confirm dialogs
- Min 44×44px touch targets on all buttons (WCAG 2.5.8)
- Keyboard navigation: Arrow keys within match rows, Enter to select, 1-4 for quick stake
- `prefers-reduced-motion` disables all animations
- Betting term tooltips with `aria-describedby` and improved visibility (11px text, shadow)

### Analytics Readiness

- `tracking.ts` stub layer — `trackCTA`, `trackOddsClick`, `trackBetPlaced`, `trackSignupIntent`, `trackAuthModalOpen`
- Emits to GA4 / PostHog / Meta Pixel when connected; logs to console in dev

---

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── sections/              # Landing conversion blocks
│   │   │   ├── HeroSection.svelte       # Hero with asymmetric trust layout
│   │   │   ├── TrustSection.svelte      # Stats + testimonials
│   │   │   ├── ReferAFriend.svelte      # Referral code display
│   │   │   └── ResponsibleGambling.svelte
│   │   ├── features/              # Sportsbook realism engine
│   │   │   ├── BetSlip.svelte           # Mobile bottom-sheet
│   │   │   ├── BetSlipPanel.svelte      # Desktop sidebar panel (popular picks empty state)
│   │   │   ├── MatchRow.svelte          # Inline match row with keyboard nav
│   │   │   ├── OddsGrid.svelte          # Featured match hero
│   │   │   └── MarketButton.svelte      # 44×44px (or 52px wide) odds button
│   │   ├── layout/                # Structural shell
│   │   │   ├── Header.svelte            # Glass morphism header
│   │   │   ├── Sidebar.svelte           # Search + Aviator link
│   │   │   ├── PromoBanner.svelte       # 2-column promo banners
│   │   │   └── SportsNav.svelte         # Competition filter tabs
│   │   └── ui/                    # Base elements
│   │       ├── AuthModal.svelte         # Phone auth with validation
│   │       ├── Badge.svelte             # Promo badge
│   │       ├── TeamBadge.svelte         # CDN crest with initials fallback
│   │       ├── Toast.svelte             # Notification with undo support
│   │       └── Tooltip.svelte           # Betting term explainer (improved visibility)
│   ├── stores/
│   │   ├── auth.ts                # Shared auth modal state
│   │   ├── betslip.ts             # Selections, tax breakdown, stake, payout
│   │   ├── toast.ts               # Notification store with action callbacks
│   │   └── search.ts              # Global search query
│   ├── utils/
│   │   ├── formatters.ts          # Date, currency, phone, countdown
│   │   ├── odds-logic.ts          # Direction, acca math, Kenya tax (KRA)
│   │   ├── teams.ts               # Badge CDN URLs, colours, initials
│   │   └── tracking.ts            # Analytics stub (GA4 / PostHog / Meta Pixel)
│   ├── data/
│   │   └── games.json             # Match and odds data (provided by WAM)
│   └── types.ts                   # Game, Market, OddsItem, BetSelection
├── routes/
│   ├── +layout.svelte             # Header + AuthModal + Toast
│   ├── +layout.ts                 # Static prerender config
│   ├── +page.svelte               # Main landing page
│   ├── aviator/
│   │   └── +page.svelte           # Aviator Coming Soon page
│   └── waitlist/
│       └── +page.svelte           # Phone capture / waitlist page
└── app.html                       # Shell with lang="en-KE"
```

---

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

```bash
npm run build      # Production build (static)
npm run preview    # Preview production build locally
npm run check      # TypeScript + Svelte type checking
```

---

## Testing

### E2E Tests (Playwright)

```bash
npx playwright install chromium
npx playwright test
```

241 tests across 13 spec files:

| Suite                         | Tests | Notes                                       |
| ----------------------------- | ----- | ------------------------------------------- |
| auth.spec.ts                  | 33    | Auth modal flows, validation, accessibility |
| betslip.spec.ts               | 25    | Selections, stake, tax, confirm             |
| odds-match.spec.ts            | 26    | Odds grid, match rows, keyboard nav         |
| navigation.spec.ts            | 19    | Sports nav, search, sidebar                 |
| content-sections.spec.ts      | 34    | Hero, trust, promo, footer, how-to-bet      |
| responsive.spec.ts            | 27    | Responsive layout, SEO, accessibility       |
| routes.spec.ts                | 23    | /aviator + /waitlist route tests            |
| keyboard-interactions.spec.ts | 5     | Quick-stake buttons on mobile               |
| live-odds.spec.ts             | 8     | Live odds simulation toggle/deselect        |
| tooltip.spec.ts               | 9     | Tooltip hover/focus/escape/aria             |
| mobile-betslip.spec.ts        | 12    | Mobile bet slip sheet interactions          |
| sections.spec.ts              | 13    | ReferAFriend + ResponsibleGambling          |
| accessibility.spec.ts         | 8     | prefers-reduced-motion + TeamBadge fallback |

### Visual Verification

```bash
node test-visual-verify.mjs
```

Takes screenshots of all pages (desktop + mobile) for visual review.

---

## Keyboard Shortcuts

| Key     | Action                                     |
| ------- | ------------------------------------------ |
| `←→`    | Navigate between odds within a match row   |
| `↑↓`    | Navigate between match rows                |
| `Enter` | Toggle odds selection                      |
| `1-4`   | Quick-set stake (KSh 50 / 100 / 200 / 500) |
| `Esc`   | Close betslip sheet or confirm dialog      |

---

## Design System

See [DESIGN.md](./DESIGN.md) for full design token documentation, component inventory, accessibility scorecard, and animation easing reference.

---

## Design Reference

Built against the Adobe XD design provided by WAM, implementing the specified 3-column shell (left sidebar · match feed · betslip panel) with inline match rows showing all market columns simultaneously.

Original enhancements added beyond the brief:

- Live odds simulation with realistic price drift
- Kenya-specific tax breakdown (KRA excise + WHT)
- M-PESA phone formatting and brand integration throughout
- Auth modal with full validation and animated success flow
- Analytics tracking layer ready for production connection
- `/waitlist` route for pre-launch lead capture
- Undo-on-remove with 5-second timeout
- Quick-stake keyboard shortcuts (1-4)
- Betting term tooltips (1X2, DC, GG/NG) with improved visibility
- "How to bet" 3-step guide with keyboard hints
- Loading skeleton with pulse animation
- Asymmetric trust layout with dominant stat cards
- Mobile search panel with shared store
- `prefers-reduced-motion` support
- WCAG 2.1 AA accessibility compliance
- Shared auth modal state via Svelte store
- Consolidated CTA copy ("Join Free — Claim KSh 500")
- Popular bets empty state in bet slip
- Enlarged 1X2 odds buttons (52px wide)
- Refined typography and easing curves

---

## Assessment Notes

This project was submitted for the **Frontend Developer (Svelte / SvelteKit)** position at WAM. The brief asked for a responsive landing page; this implementation treats the page as a marketing system first and a sportsbook UI second — prioritising conversion signals (hero CTA, trust badges, auth flow) alongside the functional odds display.

---

_© 2026 Richard Kabue Karoki — Assessment submission for WAM Ltd._
