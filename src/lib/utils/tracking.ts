/**
 * Solami Analytics — stub layer
 * Ready to connect to GA4 / PostHog / Meta Pixel / TikTok Ads
 *
 * Usage:
 *   trackCTA('hero_join_now')
 *   trackOddsClick(69339342, '1x2', 'FC Barcelona')
 *   trackBetslipOpen('floating_cart')
 */

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
		fbq?: (...args: unknown[]) => void;
	}
}

function emit(event: string, props: Record<string, unknown> = {}): void {
	// GA4
	window.gtag?.('event', event, props);
	// PostHog
	window.posthog?.capture(event, props);
	// Meta Pixel
	window.fbq?.('trackCustom', event, props);
	// Dev log
	if (import.meta.env.DEV) {
		console.info(`[Solami Analytics] ${event}`, props);
	}
}

export function trackCTA(label: string, location?: string): void {
	emit('cta_click', { label, location });
}

export function trackOddsClick(matchId: number, market: string, outcome: string, odds: number): void {
	emit('odds_click', { match_id: matchId, market, outcome, odds });
}

export function trackBetslipOpen(trigger: 'floating_cart' | 'header' | 'cta'): void {
	emit('betslip_open', { trigger });
}

export function trackBetPlaced(count: number, totalOdds: number, stake: number, payout: number): void {
	emit('bet_placed', { selection_count: count, total_odds: totalOdds, stake, potential_payout: payout });
}

export function trackSignupIntent(source: string): void {
	emit('signup_intent', { source });
}

export function trackAuthModalOpen(trigger: string): void {
	emit('auth_modal_open', { trigger });
}
