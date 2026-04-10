# Solami Sportsbook Landing Page

A production-grade sports betting landing page built as a frontend technical assessment for **Solami** — Kenya's emerging sportsbook platform.

**Live demo:** https://solami-sportsbook-landing.vercel.app
**Assessment brief:** Build a responsive landing page from an Adobe XD design using the provided `games.json` data file.

---

## Screenshot

<!-- ![Preview](./static/screenshot.png) -->

---

## Tech Stack

| Layer         | Choice                              |
| ------------- | ----------------------------------- |
| Framework     | SvelteKit 2 + Svelte 5 (Runes mode) |
| Language      | TypeScript 6                        |
| Styling       | Tailwind CSS v4                     |
| Build tool    | Vite 8                              |
| Icons         | Lucide Svelte                       |
| Date handling | date-fns                            |
| Deployment    | Vercel (adapter-auto)               |

---

## Features

### Sportsbook Core

- **3-column layout** — left sidebar, scrollable match feed, sticky betslip panel
- **Inline match rows** — 1X2 · Double Chance · GG/NG · More markets, all on one row
- **Real team badges** — CDN crests for all 19 teams with graceful fallback to coloured initials
- **Live odds simulation** — random drift every 6s with ▲▼ direction indicators
- **Market deduplication** — selecting a new 1X2 outcome replaces the previous pick rather than stacking selections

### Betslip & Math

- **Kenya tax breakdown** — 7.5% excise duty + 20% withholding tax (KRA-compliant), expandable payout breakdown panel
- **Quick-stake buttons** — KSh 50 / 100 / 200 / 500 one-tap shortcuts
- **Stake validation** — min KSh 10 · max KSh 500,000 with inline error state
- **Max 20 selections** guard on accumulator
- **Pay via M-PESA** — primary CTA using M-PESA brand green

### Conversion & UX

- **Hero section** — headline, live badge, M-PESA callout, KSh 500 bonus CTA
- **Auth modal** — phone number validation (07/01 prefix), auto-formatting (`0712 345 678`), M-PESA field, password show/hide, loading state, animated success screen
- **Trust section** — Kenya testimonials, platform stats, BCLB / M-PESA badges
- **Mobile betslip** — floating cart button → slide-up bottom sheet (92dvh)
- **Mobile sticky CTA** — persistent Join Now strip in footer
- **/waitlist route** — phone capture page with WhatsApp launch promise

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
│   │   │   ├── HeroSection.svelte
│   │   │   └── TrustSection.svelte
│   │   ├── features/              # Sportsbook realism engine
│   │   │   ├── BetSlip.svelte          # Mobile bottom-sheet
│   │   │   ├── BetSlipPanel.svelte     # Desktop panel
│   │   │   ├── MatchRow.svelte         # Inline match row
│   │   │   └── OddsGrid.svelte         # Featured match hero
│   │   ├── layout/                # Structural shell
│   │   │   ├── Header.svelte
│   │   │   ├── LeftSidebar.svelte
│   │   │   ├── PromoBanner.svelte
│   │   │   └── SportsNav.svelte
│   │   └── ui/                    # Base elements
│   │       ├── AuthModal.svelte
│   │       ├── Badge.svelte
│   │       ├── MarketButton.svelte
│   │       ├── TeamBadge.svelte
│   │       └── Toast.svelte
│   ├── stores/
│   │   ├── betslip.ts        # Selections, tax breakdown, stake, payout
│   │   └── toast.ts          # Notification store
│   ├── utils/
│   │   ├── formatters.ts     # Date, currency, phone, countdown
│   │   ├── odds-logic.ts     # Direction, acca math, Kenya tax (KRA)
│   │   ├── teams.ts          # Badge CDN URLs, colours, initials
│   │   └── tracking.ts       # Analytics stub (GA4 / PostHog / Meta Pixel)
│   └── types.ts              # Game, Market, OddsItem, BetSelection
├── data/
│   └── games.json            # Match and odds data (provided by Solami)
└── routes/
    ├── +layout.svelte        # Header + AuthModal + Toast
    ├── +page.svelte          # Main landing page
    └── waitlist/
        └── +page.svelte      # Phone capture / waitlist page
```

---

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

```bash
npm run build      # Production build
npm run preview    # Preview production build locally
```

---

## Design Reference

Built against the Adobe XD design provided by Solami, implementing the specified 3-column shell (left sidebar · match feed · betslip panel) with inline match rows showing all market columns simultaneously.

Original enhancements added beyond the brief:

- Live odds simulation with realistic price drift
- Kenya-specific tax breakdown (KRA excise + WHT)
- M-PESA phone formatting and brand integration throughout
- Auth modal with full validation and animated success flow
- Analytics tracking layer ready for production connection
- `/waitlist` route for pre-launch lead capture

---

## Assessment Notes

This project was submitted for the **Frontend Developer (Svelte / SvelteKit)** position at Solami. The brief asked for a responsive landing page; this implementation treats the page as a marketing system first and a sportsbook UI second — prioritising conversion signals (hero CTA, trust badges, auth flow) alongside the functional odds display.

---

_© 2026 Richard Kabue Karoki — Assessment submission for Solami Ltd._
