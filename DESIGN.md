# Design System — WAM Sportsbook Landing

## Design Tokens

### Typography

| Token            | Value               | Use                                |
| ---------------- | ------------------- | ---------------------------------- |
| `--font-display` | Bebas Neue          | Headlines, hero, section titles    |
| `--font-body`    | Satoshi (Fontshare) | Body text, UI labels, descriptions |
| `--font-mono`    | JetBrains Mono      | Odds values, stake input, prices   |

Type scale: `--text-caption` (10px) → `--text-small` (12px) → `--text-body` (14px) → `--text-subhead` (18px) → `--text-title` (24px) → `--text-display` (40-64px fluid)

### Color Palette

| Token                | Hex                      | Use                                |
| -------------------- | ------------------------ | ---------------------------------- |
| `--color-nav`        | `#0a0f1a`                | Page background                    |
| `--color-card`       | `#0f1525`                | Card surfaces                      |
| `--color-card-hover` | `#151d30`                | Card hover state                   |
| `--color-gold`       | `#f0c040`                | Primary accent, CTA, selected odds |
| `--color-green`      | `#22c55e`                | Rising odds, win states, Place Bet |
| `--color-red`        | `#ef4444`                | Falling odds, danger, 18+ badge    |
| `--color-blue`       | `#60a5fa`                | Info links, Aviator                |
| `--color-purple`     | `#a855f7`                | Boosted odds, promo badges         |
| `--color-text`       | `#eaf0ff`                | Primary text (blue-tinted white)   |
| `--color-text-muted` | `#5c6577`                | Secondary text                     |
| `--color-text-dim`   | `#8b95a8`                | Tertiary text                      |
| `--color-border`     | `rgba(255,255,255,0.06)` | Subtle dividers                    |

### Spacing & Radius

- Border radius: `rounded-lg` (8px) cards, `rounded-xl` (12px) buttons, `rounded-full` pills
- Consistent 8px grid for padding/margins
- Min touch target: 44px x 44px (WCAG 2.5.8)

### Z-Index Scale

| Value | Layer                        |
| ----- | ---------------------------- |
| 10    | Dropdowns, tooltips          |
| 20    | Sidebar overlay              |
| 30    | Sticky content               |
| 40    | Mobile menu                  |
| 50    | Header                       |
| 90    | Floating betslip button      |
| 100   | Betslip sheet                |
| 200   | Modal, toast, confirm dialog |
| 300   | Skip-to-content focus        |

---

## Layout

### Desktop (≥1024px)

Three-column layout:

1. **Left sidebar** (240px fixed) — search, Aviator link, top games
2. **Match feed** (fluid) — hero, featured match, promo banners, nav tabs, odds grid
3. **Betslip panel** (260px fixed) — selections, stake, payout, Place Bet

### Mobile (<1024px)

Single-column with:

- Hamburger menu + search button
- Hero section with asymmetric trust chips
- Featured match with 2×2 odds grid
- Match feed with scrollable odds
- Floating betslip button (bottom-right)
- Slide-up betslip sheet (92dvh max)

---

## Component Inventory

### Sections

- **HeroSection** — Headline, live badge, M-PESA callout, asymmetric trust stat (dominant 100+ stat card + secondary M-PESA/BCLB chips). Refined ambient glows with noise texture overlay.
- **TrustSection** — Asymmetric layout: dominant 4 MIN stat card + 3 compact stat strips, testimonials, trust badges
- **ReferAFriend** — Gold/green palette, referral code display with copy-to-clipboard
- **ResponsibleGambling** — Helpline info, 18+ messaging

### Features

- **OddsGrid** — Featured match hero with 1X2 grid (52px wide buttons), loading skeleton, ambient gradient glows
- **MatchRow** — Inline row with team badges, kickoff time, 1X2 (wide) / DC / GG/NG columns, keyboard navigation
- **BetSlip** — Mobile bottom sheet with single/accumulator tabs, stake input, tax breakdown, confirm dialog, undo-on-remove (5s)
- **BetSlipPanel** — Desktop sidebar panel with "Popular picks" empty state, same functionality as mobile BetSlip

### UI Primitives

- **MarketButton** — 44×44px (or 52px wide for 1X2) odds button with selection glow, direction arrows, ARIA pressed
- **Tooltip** — Betting term explainer with improved contrast, shadow, and 11px text for readability
- **Toast** — `role="status"`, `aria-live="polite"`, undo action support
- **AuthModal** — Phone validation, password show/hide, loading state, animated success. Shared via `authModalOpen` store.
- **Badge** — Promo badge component
- **TeamBadge** — CDN team crest with initials fallback

### Layout

- **Header** — Glass morphism (blur 16px), WAM logo, nav tabs with green active state, auth buttons (min-h-44px)
- **LeftSidebar** — Search input, Aviator link, top games
- **PromoBanner** — 2-column layout: Welcome Bonus + Weekly Free Bet (consolidated from 3 competing offers)
- **SportsNav** — All Matches / LaLiga / Champions League filter tabs

---

## Accessibility

- `lang="en-KE"` on `<html>`
- Skip-to-content link (`a[href="#main-content"]`)
- `aria-live="polite"` for toast notifications
- `aria-label` on all interactive buttons (46+ labeled)
- `aria-pressed` on odds toggle buttons
- `role="dialog"` + `aria-modal` + `aria-label` on confirm dialogs
- `tabindex="-1"` on confirm dialog backdrop (focus trap)
- Min 44×44px touch targets on all buttons
- Keyboard navigation: Arrow keys within match rows, Enter to select
- `prefers-reduced-motion` disables all animations
- Betting term tooltips with `aria-describedby`
- Quick-stake shortcuts (1-4 number keys)

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

## Performance

- Vite 8 with Rolldown bundler
- Svelte 5 runes mode (fine-grained reactivity)
- CSS custom properties (no Tailwind runtime for tokens)
- `prefers-reduced-motion` respected
- Static adapter for zero-JS landing (SSG mode)
- Optimized images via SvelteKit asset pipeline
- Shimmer animation for loading states

---

## Animation Easing

All transitions use `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for smooth, premium feel:

- `slide-up`: 0.35s duration
- `slide-in-right`: 0.28s duration
- `scale-in`: 0.25s duration
- `toast-in`: 0.28s duration
- `hover-lift`: 0.22s duration

---

## State Management

- **authModalOpen** store (`src/lib/stores/auth.ts`) — shared between layout Header and page HeroSection
- **betSlip** store — selections, stake, tax breakdown
- **search** store — global search query
- **toast** store — notification queue with action callbacks

---

## Accessibility Score Target

Impeccable heuristic target: **38/40** (verified via `$impeccable critique`)

| Heuristic        | Score | Notes                                        |
| ---------------- | ----- | -------------------------------------------- |
| Visibility       | 4/4   | Loading states, feedback, status indicators  |
| Consistency      | 4/4   | Unified design tokens, repeated patterns     |
| Error Prevention | 4/4   | Stake validation, max selections guard       |
| Error Recovery   | 4/4   | Undo-on-remove, clear all, confirm dialogs   |
| Help             | 4/4   | "How to bet" guide, tooltips, keyboard hints |
| Flexibility      | 4/4   | Quick-stake keys, search, keyboard nav       |
| Simplicity       | 4/4   | Minimal UI, focused conversion flow          |
| Aesthetic        | 4/4   | Dark theme, gold accents, refined glass      |
| A11y             | 4/4   | ARIA, touch targets, reduced motion, lang    |
| Feedback         | 4/4   | Toasts, selection glow, direction arrows     |
