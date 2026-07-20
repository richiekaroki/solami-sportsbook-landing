# E2E Test Catalog

Complete listing of all 164 E2E tests organized by file and section.

---

## auth.spec.ts — Auth Modal (33 tests)

Tests the login/signup modal flow end-to-end. The modal is triggered from the hero CTA, header buttons, and mobile hamburger menu.

### Modal Open/Close (6 tests)

| Test | Description |
|---|---|
| `opens from header "Join Now" button` | Clicking header Join Now opens auth modal |
| `opens from header "Log In" button` | Clicking header Log In opens auth modal |
| `opens from hero CTA` | Clicking hero "Join Free — Claim KSh 500" opens modal |
| `closes on Escape key` | Pressing Escape closes the modal |
| `closes on X button click` | Clicking the X button closes the modal |
| `closes on backdrop click` | Clicking outside the modal closes it |

### Signup Tab (6 tests)

| Test | Description |
|---|---|
| `signup tab active by default` | Modal opens on signup mode by default |
| `signup shows "Create your free account" subtitle` | Subtitle text is visible |
| `signup shows welcome bonus banner` | "Welcome Bonus" banner with KSh 500 text |
| `signup has Phone, M-PESA, and Password fields` | All three signup fields are present |
| `signup submit button shows "Create Account & Claim Bonus"` | Submit button text matches |
| `signup shows terms, privacy, and BCLB text` | Terms & conditions text visible below form |

### Login Tab (5 tests)

| Test | Description |
|---|---|
| `switching to login shows "Welcome back"` | Clicking "Log In" tab changes subtitle |
| `login hides M-PESA field` | M-PESA field is not visible in login mode |
| `login shows "Forgot password?"` | Forgot password link visible |
| `login does NOT show welcome bonus` | Welcome bonus banner hidden in login mode |
| `login submit button shows "Log In"` | Submit button text changes for login |

### Form Validation (6 tests)

| Test | Description |
|---|---|
| `submit disabled when all fields empty` | Submit button is disabled with no input |
| `submit disabled with invalid phone (05 prefix)` | 05xx phone prefix is rejected |
| `submit enabled with valid 07xx phone` | 07xx phone enables submit |
| `submit enabled with valid 01xx phone` | 01xx phone enables submit |
| `submit disabled when password < 6 chars` | Passwords under 6 chars disable submit |
| `submit enabled with exactly 6-char password` | Exactly 6-char password enables submit |

### Form Interactions (3 tests)

| Test | Description |
|---|---|
| `password visibility toggle works` | Eye icon toggles password visibility |
| `M-PESA auto-fills from phone number` | Phone input populates M-PESA field via `formatKEPhone` |
| `signup: shows loading spinner then success` | Submit shows loading → "Account Created!" → success screen |

### Submission & Navigation (6 tests)

| Test | Description |
|---|---|
| `login: shows loading spinner then success` | Login submit shows loading → "Welcome Back!" → success |
| `"Start Betting" button closes modal` | Success screen CTA closes modal |
| `mobile: hamburger menu → Join Now opens modal` | Mobile menu Join Now triggers modal |
| `mobile: hamburger menu → Log In opens modal` | Mobile menu Log In triggers modal |
| `dialog is interactive on open` | Dialog has `aria-modal="true"` and `role="dialog"` |
| `tab key moves focus through form fields` | Tab cycles through all form inputs |

---

## betslip.spec.ts — Bet Slip (25 tests)

Tests the desktop bet slip panel (right sidebar). Covers adding/removing selections, stake input, quick stakes, tabs, confirm dialog, and toast notifications.

### Helper Functions

- `addFeaturedOdds(page)` — Clicks the first odds button in the featured match grid
- `addMultipleRowSelections(page, count)` — Adds selections from different match rows (different markets to avoid store dedup)

### Empty State (3 tests)

| Test | Description |
|---|---|
| `desktop panel shows "No selections yet" when empty` | Empty state text visible |
| `desktop panel shows empty potential win "KSh 0.00"` | Default potential win is zero |
| `desktop panel "Select Odds to Bet" button is disabled initially` | Submit button disabled when empty |

### Adding Selections (2 tests)

| Test | Description |
|---|---|
| `clicking odds adds selection to bet slip` | Clicking featured odds removes empty state |
| `multiple selections from different rows show correct count` | 3 selections → button shows "Place Bet — 3 bets" |

### Removing Selections (1 test)

| Test | Description |
|---|---|
| `removing a selection updates the slip` | Removing 1 of 2 selections → button shows "1 bet" |

### Stake Input (6 tests)

| Test | Description |
|---|---|
| `stake input has default value of 100` | Default stake is KSh 100 |
| `quick stake buttons set the stake value` | Clicking "200" sets stake to 200 |
| `quick stake 500 sets value to 500` | Clicking "500" sets stake to 500 |
| `custom stake can be typed into input` | Typing 250 sets stake to 250 |
| `stake below MIN_STAKE shows error` | Stake of 5 shows "Min KSh 10" error |
| `stake above MAX_STAKE shows error` | Stake of 600000 shows "Max KSh 500,000" error |

### Single / Accumulator Tabs (3 tests)

| Test | Description |
|---|---|
| `single tab is active by default` | Single tab has `aria-pressed="true"` |
| `switching to accumulator tab` | Clicking Accumulator tab activates it |
| `accumulator shows total odds with multiple selections` | Acca mode shows "Total odds" with 2+ selections |

### Place Bet Flow (7 tests)

| Test | Description |
|---|---|
| `place bet button enables with selection and valid stake` | Button enabled after adding odds |
| `place bet button shows bet count` | 2 selections → "Place Bet — 2 bets" |
| `clicking place bet opens confirm dialog` | Confirm dialog appears |
| `confirm dialog shows selections and stake` | Dialog shows "Confirm Bet" + "Stake" |
| `confirm dialog cancel closes it` | Cancel button closes dialog |
| `confirm dialog Escape closes it` | Escape key closes dialog (focuses dialog first) |
| `confirming bet clears the slip` | Confirm closes dialog + shows "No selections yet" |

### Toast Notifications (3 tests)

| Test | Description |
|---|---|
| `adding odds shows toast notification` | Status role toast appears |
| `removing odds shows undo toast` | Removal shows "removed" text + "Undo" button |
| `undo button restores the selection` | Undo restores the selection |

---

## content-sections.spec.ts — Content Sections (34 tests)

Tests all visual sections of the landing page: hero, trust stats, promo banners, footer, and "How to bet".

### Hero Section (9 tests)

| Test | Description |
|---|---|
| `hero heading is visible` | "BET ON EVERY" + "MATCH DAY." text |
| `hero has CTA button` | "Join Free" button visible |
| `hero has "See live odds" link` | Link with text "See live odds" |
| `"See live odds" links to #matches` | `href="#matches"` attribute |
| `hero shows "100+" stat` | "100+" text in dominant stat |
| `hero shows Markets per match` | "Markets per match" label |
| `hero shows trust chips text` | "M-PESA Instant" + "BCLB Licensed" |
| `hero shows "Deposits & withdrawals" subtitle` | Chip subtitle text |
| `hero shows "Kenya Gaming Board" subtitle` | Chip subtitle text |

### Trust Section (8 tests)

| Test | Description |
|---|---|
| `shows withdrawal speed stat` | "avg. withdrawal" text |
| `shows "50K+ bettors" stat` | "50K+" + "bettors" |
| `shows "KSh 2M+ paid daily" stat` | "KSh 2M+" + "paid daily" |
| `shows "99.8% uptime" stat` | "99.8%" + "uptime" |
| `shows testimonials` | James M., Peter K., Faith W. |
| `testimonials show city names` | Nairobi, Mombasa, Kisumu |
| `testimonials show star ratings` | "Withdrew KSh 12,500" text |
| `trust badges are visible` | "M-PESA Partner" + "SSL Secured" |

### Promo Banners (4 tests)

| Test | Description |
|---|---|
| `shows promo banners` | All 3 banners visible (SPORTS WELCOME BONUS, EARLY PAYOUT OFFER, WEEKLY FREE BET) |
| `first banner is active by default` | First banner has `aria-pressed="true"` |
| `clicking a banner activates it` | Clicking second banner sets it active |
| `banner shows deposit text` | "on your first deposit" text |

### Footer (9 tests)

| Test | Description |
|---|---|
| `footer shows copyright` | "© 2026 WAM Ltd" |
| `footer shows license info` | "Licensed by BCLB Kenya" |
| `footer shows "Gamble responsibly"` | "Please gamble responsibly" |
| `footer has Sports column` | "Sports" heading (scoped to `getByRole('heading')`) |
| `footer has Company column` | "Company" heading |
| `footer has Support column` | "Support" heading |
| `footer shows sports links` | "Football" + "Basketball" |
| `footer shows support links` | "Help Centre" + "Live Chat" |
| `footer mobile sticky CTA is hidden on desktop` | "Ready to bet?" not visible at 1440px |

### How to Bet Section (4 tests)

| Test | Description |
|---|---|
| `shows "How to bet" heading` | Section heading visible |
| `shows 3 steps` | "Pick your odds", "Set your stake", "Place & win" |
| `shows keyboard shortcuts info` | "Keyboard:" text |
| `shows odds direction legend` | "rising" + "falling" with arrows |

---

## navigation.spec.ts — Navigation & Search (19 tests)

Tests sports navigation tabs, competition filters, sidebar, and search functionality.

### Competition Filter (6 tests)

| Test | Description |
|---|---|
| `shows "All Matches" tab and competition tabs` | "Filter by All Matches" button |
| `"All Matches" tab is active by default` | `aria-pressed="true"` on All Matches |
| `competition tabs show match counts` | Tab text contains a number |
| `clicking a competition tab filters matches` | Clicking a tab sets All Matches to inactive |
| `clicking "All Matches" restores all matches` | All Matches becomes active again |
| `competition tab shows abbreviation badge` | Champions League tab shows "CL" badge |

### Desktop Search (7 tests)

| Test | Description |
|---|---|
| `desktop sidebar has search input` | Search input with aria-label "Search teams" |
| `search input is empty by default` | Input value is empty string |
| `typing in search filters matches` | Filling "Barcelona" shows filtered rows |
| `search for non-existent team shows "No matches found"` | "XYZNONEXISTENT" shows empty state |
| `no-results state shows "Clear search" button` | "Clear search" button visible |
| `"Clear search" resets the search` | Clicking clears input, restores rows |
| `search with partial match works` | "Atleti" finds Atletico matches |

### Sidebar (3 tests)

| Test | Description |
|---|---|
| `sidebar shows "Top Games" section` | "Top Games" text |
| `sidebar has Aviator link` | "Play Aviator" link |
| `Aviator link has correct href` | `href="/aviator"` |

### Mobile Search (3 tests)

| Test | Description |
|---|---|
| `mobile search button toggles search bar` | Clicking search icon shows search input |
| `mobile search input can filter matches` | Typing "Barcelona" filters results |
| `mobile search close button hides search bar` | Close button hides the search |

> **Note:** Mobile search tests scope to `.xl:hidden.fixed.top-[56px]` to avoid matching the hidden desktop sidebar search.

---

## odds-match.spec.ts — Odds Grid & Match Feed (26 tests)

Tests the featured match odds grid, match feed rows, competition groups, and keyboard navigation.

### Featured Match — Odds Grid (15 tests)

| Test | Description |
|---|---|
| `featured match section is visible` | `#featured` element visible |
| `featured match has "Featured Match" label` | Label text visible |
| `featured match shows "Odds updating live"` | Live indicator text |
| `featured match shows team names` | "FC Barcelona" + "Atletico Madrid" |
| `featured match shows "VS" text` | VS text between teams |
| `featured match shows countdown "Kicks off in"` | Countdown label visible |
| `featured match has "Boosted Odds" badge` | "Boosted Odds" badge |
| `featured match has "Featured" label` | "Featured" label (exact match) |
| `featured match has bonus ribbon` | Bonus text with deposit info |
| `featured match has 3 odds buttons (1X2)` | 3 buttons with `aria-pressed` |
| `odds buttons have correct labels (1, X, 2)` | First button has text content |
| `odds button shows aria-pressed false initially` | Unselected state |
| `clicking odds button toggles selection` | Click → `aria-pressed="true"` |
| `clicking selected odds button deselects it` | Click again → `aria-pressed="false"` |
| `odds values are numerical (format like X.XX)` | Text matches `\d+\.\d+` pattern |

> **Key fix:** Uses `button[aria-pressed]` (any value) for click toggle tests, NOT `button[aria-pressed="false"]`, because the locator re-evaluates after click and `.first()` would pick a different button.

### Match Feed — Competition Groups (8 tests)

| Test | Description |
|---|---|
| `soccer header shows event count` | "Soccer" + "N events" |
| `match groups have competition headers` | "Champions League" or "LaLiga" headers |
| `match rows are rendered` | At least 1 `[role="row"]` |
| `match row shows team names` | First row has >5 chars of text |
| `match row has odds buttons for 1X2 market` | At least 3 odds buttons per row |
| `match row has kickoff time` | Time or date pattern in row text |
| `match row has bet count indicator` | Bet count number visible |
| `odds update over time (live simulation)` | Button still visible after 7s wait |

### Keyboard Navigation (3 tests)

| Test | Description |
|---|---|
| `arrow right moves focus between odds buttons` | ArrowRight focuses next button |
| `arrow left moves focus backward` | ArrowLeft focuses previous button |
| `arrow down moves focus to next row` | ArrowDown focuses first button in next row |

---

## responsive.spec.ts — Responsive Layout (27 tests)

Tests the app at different viewport sizes and verifies SEO/accessibility.

### Desktop 1440px (8 tests)

| Test | Description |
|---|---|
| `desktop header with "Join Now" button is visible` | Header CTA visible |
| `header "Log In" button is visible` | Login button visible |
| `sidebar search is visible` | Sidebar search input |
| `mobile menu button is hidden` | "Open menu" not visible |
| `mobile search button is hidden` | Mobile search icon not visible |
| `footer mobile sticky CTA is hidden` | "Ready to bet?" not visible |
| `match rows are visible` | At least 1 match row |
| `featured match is visible` | `#featured` visible |

### Tablet 768px (3 tests)

| Test | Description |
|---|---|
| `match feed is visible` | Main content visible |
| `featured match is visible` | Featured section visible |
| `footer is visible` | Footer visible |

### Mobile 375px (9 tests)

| Test | Description |
|---|---|
| `mobile header with hamburger is visible` | Hamburger button visible |
| `WAM logo is visible in mobile header` | WAM text in `.xl:hidden a` |
| `mobile hamburger menu opens` | Menu shows "Close menu" + "Join Now" |
| `mobile hamburger menu closes` | Menu closes, "Open menu" returns |
| `mobile search toggle works` | Search opens in mobile overlay |
| `hero CTA is visible on mobile` | "Join Free" button visible |
| `footer mobile sticky CTA is visible` | "Ready to bet?" visible |
| `matches section is visible` | `#matches` visible |
| `odds buttons are tap-friendly` | Button ≥36×36px |

### Large Desktop 1920px (2 tests)

| Test | Description |
|---|---|
| `content is visible` | Main content visible |
| `match rows are visible` | Match rows present |

### SEO & Accessibility (5 tests)

| Test | Description |
|---|---|
| `page has correct title` | Title matches `/WAM/` |
| `page has meta description` | First `<meta name="description">` has content |
| `main content has proper heading hierarchy` | `<h1>` is visible |
| `interactive elements have aria labels` | Join now + Log in buttons have labels |
| `auth modal has proper aria attributes` | Dialog has `aria-modal="true"` + `role="dialog"` |
