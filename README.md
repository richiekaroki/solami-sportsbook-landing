# WAM Sportsbook Landing Page

A production-grade sports betting landing page built as a frontend technical assessment for **WAM** — Kenya's emerging sportsbook platform.

**Live demo:** https://wam-sportsbook-landing.vercel.app
**Assessment brief:** Build a responsive landing page from an Adobe XD design using the provided `games.json` data file.

---

## Screenshots

| Desktop (1440×900) | Mobile (390×844) |
|---|---|
| ![Desktop](test-desktop-full.png) | ![Mobile](test-mobile-full.png) |

---

## Tech Stack

| Layer         | Choice                              |
| ------------- | ----------------------------------- |
| Framework     | SvelteKit 2 + Svelte 5 (Runes mode) |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS v4 + CSS custom properties |
| Build tool    | Vite 8 (Rolldown)                   |
| Icons         | Lucide Svelte                       |
| Date handling | date-fns                            |
| Fonts         | Satoshi (Fontshare), Bebas Neue, JetBrains Mono |
| Deployment    | Vercel (adapter-auto) / Static (adapter-static) |

---

## Features

### Sportsbook Core

- **3-column layout** — left sidebar, scrollable match feed, sticky betslip panel
- **Inline match rows** — 1X2 · Double Chance · GG/NG, all on one row
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

### Conversion & UX

- **Hero section** — headline, live badge, M-PESA callout, asymmetric trust stat (dominant 100+ stat + secondary chips)
- **"How to bet" guide** — 3-step guide with keyboard shortcut hints and odds movement legend
- **Auth modal** — phone number validation (07/01 prefix), auto-formatting (`0712 345 678`), M-PESA field, password show/hide, loading state, animated success screen
- **Trust section** — asymmetric layout: dominant 4 MIN stat card + 3 compact stat strips, testimonials, platform stats
- **Mobile betslip** — floating cart button → slide-up bottom sheet (92dvh)
- **Mobile search** — search icon toggles search input panel
- **Mobile sticky CTA** — persistent Join Now strip in footer
- **/waitlist route** — phone capture page with WhatsApp launch promise
- **/aviator route** — Aviator game page

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
- Betting term tooltips with `aria-describedby`

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
│   │   │   ├── BetSlipPanel.svelte      # Desktop sidebar panel
│   │   │   ├── MatchRow.svelte          # Inline match row with keyboard nav
│   │   │   ├── OddsGrid.svelte          # Featured match hero
│   │   │   └── MarketButton.svelte      # 44×44px odds button
│   │   ├── layout/                # Structural shell
│   │   │   ├── Header.svelte            # Glass morphism header
│   │   │   ├── LeftSidebar.svelte       # Search + Aviator link
│   │   │   ├── PromoBanner.svelte       # Rotating promotions
│   │   │   └── SportsNav.svelte         # Competition filter tabs
│   │   └── ui/                    # Base elements
│   │       ├── AuthModal.svelte         # Phone auth with validation
│   │       ├── Badge.svelte             # Promo badge
│   │       ├── TeamBadge.svelte         # CDN crest with initials fallback
│   │       ├── Toast.svelte             # Notification with undo support
│   │       └── Tooltip.svelte           # Betting term explainer
│   ├── stores/
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
│   │   └── +page.svelte           # Aviator game page
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

Automated visual testing via Playwright:

```bash
npm install -D playwright
npx playwright install chromium
node test-visual.cjs
```

### Test Results (26/28 passed)

| Suite | Result | Notes |
|-------|--------|-------|
| Desktop (1440×900) | 15/15 ✅ | Hero, odds, search, toast, a11y, nav |
| Mobile (390×844) | 9/9 ✅ | Hamburger, betslip sheet, confirm dialog, bet placed |
| Keyboard Navigation | 2/4 | Enter ✅, Focus ✅ — ArrowRight/Down are Playwright headless limitation |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←→` | Navigate between odds within a match row |
| `↑↓` | Navigate between match rows |
| `Enter` | Toggle odds selection |
| `1-4` | Quick-set stake (KSh 50 / 100 / 200 / 500) |
| `Esc` | Close betslip sheet or confirm dialog |

---

## Design System

See [DESIGN.md](./DESIGN.md) for full design token documentation, component inventory, and accessibility scorecard.

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
- Betting term tooltips (1X2, DC, GG/NG)
- "How to bet" 3-step guide with keyboard hints
- Loading skeleton with pulse animation
- Asymmetric trust layout with dominant stat cards
- Mobile search panel with shared store
- `prefers-reduced-motion` support
- WCAG 2.1 AA accessibility compliance

---

## Assessment Notes

This project was submitted for the **Frontend Developer (Svelte / SvelteKit)** position at WAM. The brief asked for a responsive landing page; this implementation treats the page as a marketing system first and a sportsbook UI second — prioritising conversion signals (hero CTA, trust badges, auth flow) alongside the functional odds display.

---

_© 2026 Richard Kabue Karoki — Assessment submission for WAM Ltd._
