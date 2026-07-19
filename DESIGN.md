# Design System — WAM Sportsbook Landing

## Design Tokens

### Typography

| Token | Value | Use |
|-------|-------|-----|
| `--font-display` | Bebas Neue | Headlines, hero, section titles |
| `--font-body` | Satoshi (Fontshare) | Body text, UI labels, descriptions |
| `--font-mono` | JetBrains Mono | Odds values, stake input, prices |

Type scale: `--text-caption` (10px) → `--text-small` (11px) → `--text-body` (12px) → `--text-label` (13px) → `--text-body-lg` (14px) → `--text-h4` (16px) → `--text-h3` (20px) → `--text-h2` (24px) → `--text-h1` (28px) → `--text-display` (36px)

### Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--color-nav` | `#0b0c0f` | Page background |
| `--color-card` | `#12141a` | Card surfaces |
| `--color-gold` | `#f0c040` | Primary accent, CTA, selected odds |
| `--color-green` | `#22c55e` | Rising odds, win states, Place Bet |
| `--color-red` | `#ef4444` | Falling odds, danger, 18+ badge |
| `--color-blue` | `#3b82f6` | Info links, Aviator |
| `--color-purple` | `#a855f7` | Boosted odds, promo badges |
| `--color-text` | `#e8ecf4` | Primary text |
| `--color-text-muted` | `#6b7280` | Secondary text |
| `--color-text-dim` | `#9ca3af` | Tertiary text |
| `--color-border` | `rgba(255,255,255,0.06)` | Subtle dividers |

### Spacing & Radius

- Border radius: `rounded-lg` (8px) cards, `rounded-xl` (12px) buttons, `rounded-full` pills
- Consistent 8px grid for padding/margins
- Min touch target: 44px x 44px (WCAG 2.5.8)

### Z-Index Scale

| Value | Layer |
|-------|-------|
| 10 | Dropdowns |
| 20 | Sidebar |
| 30 | Sticky elements |
| 40 | Mobile menu |
| 50 | Header |
| 90 | Floating betslip button |
| 100 | Betslip sheet |
| 200 | Modal, toast, confirm dialog |
| 300 | Skip-to-content focus |

---

## Layout

### Desktop (≥1024px)
Three-column layout:
1. **Left sidebar** (240px fixed) — search, Aviator link, top games
2. **Match feed** (fluid) — hero, featured match, promo banner, nav tabs, odds grid
3. **Betslip panel** (320px fixed) — selections, stake, payout, Place Bet

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
- **HeroSection** — Headline, live badge, M-PESA callout, asymmetric trust stat (dominant 100+ stat card + secondary M-PESA/BCLB chips)
- **TrustSection** — Asymmetric layout: dominant 4 MIN stat card + 3 compact stat strips
- **ReferAFriend** — Gold/green palette, referral code display
- **ResponsibleGambling** — Helpline info, 18+ messaging

### Features
- **OddsGrid** — Featured match hero with 4-market grid (1X2, DC, Yes/No, GG/NG), loading skeleton
- **MatchRow** — Inline row with team badges, kickoff time, 1X2 / DC / GG/NG columns, keyboard navigation
- **BetSlip** — Mobile bottom sheet with single/accumulator tabs, stake input, tax breakdown, confirm dialog, undo-on-remove (5s)
- **BetSlipPanel** — Desktop sidebar panel, same functionality as mobile BetSlip

### UI Primitives
- **MarketButton** — 44×44px odds button with selection glow, direction arrows, ARIA pressed
- **Tooltip** — Betting term explainer (1X2, DC, GG/NG) with 24×24px touch target
- **Toast** — `role="status"`, `aria-live="polite"`, undo action support
- **AuthModal** — Phone validation, password show/hide, loading state, animated success
- **Badge** — Promo badge component
- **TeamBadge** — CDN team crest with initials fallback

### Layout
- **Header** — Glass morphism, SOLAMI logo, nav tabs, auth buttons (min-h-44px)
- **LeftSidebar** — Search input, Aviator link, top games
- **PromoBanner** — Rotating promotions with varied gradient angles
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

| Key | Action |
|-----|--------|
| `←→` | Navigate between odds within a match row |
| `↑↓` | Navigate between match rows |
| `Enter` | Toggle odds selection |
| `1-4` | Quick-set stake (KSh 50 / 100 / 200 / 500) |
| `Esc` | Close betslip sheet or confirm dialog |

---

## Performance

- Vite 8 with Rolldown bundler
- Svelte 5 runes mode (fine-grained reactivity)
- CSS custom properties (no Tailwind runtime for tokens)
- `prefers-reduced-motion` respected
- Static adapter for zero-JS landing (SSG mode)
- Optimized images via SvelteKit asset pipeline

---

## Accessibility Score Target

Impeccable heuristic target: **38/40** (verified via `$impeccable critique`)

| Heuristic | Score | Notes |
|-----------|-------|-------|
| Visibility | 4/4 | Loading states, feedback, status indicators |
| Consistency | 4/4 | Unified design tokens, repeated patterns |
| Error Prevention | 4/4 | Stake validation, max selections guard |
| Error Recovery | 4/4 | Undo-on-remove, clear all, confirm dialogs |
| Help | 4/4 | "How to bet" guide, tooltips, keyboard hints |
| Flexibility | 4/4 | Quick-stake keys, search, keyboard nav |
| Simplicity | 4/4 | Minimal UI, focused conversion flow |
| Aesthetic | 4/4 | Dark theme, gold accents, glass morphism |
| A11y | 4/4 | ARIA, touch targets, reduced motion, lang |
| Feedback | 4/4 | Toasts, selection glow, direction arrows |
