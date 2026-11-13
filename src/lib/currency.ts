/**
 * Prices are authored once, in euro cents. Other currencies are derived, never
 * stored, so the three can never drift apart. Rates are a deliberate constant
 * reviewed when they move more than a few percent — not a live API, which
 * would add a third-party request to a site that makes none.
 */
export type CurrencyCode = 'EUR' | 'USD' | 'GBP'

export const CURRENCIES = {
  EUR: { symbol: '€', rate: 1, label: 'EUR' },
  USD: { symbol: '$', rate: 1.08, label: 'USD' },
  GBP: { symbol: '£', rate: 0.85, label: 'GBP' },
} as const

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[]

/** Convert euro cents to whole major units in `currency`. */
export function convert(eurCents: number, currency: CurrencyCode): number {
  if (eurCents <= 0) return 0
  const major = (eurCents / 100) * CURRENCIES[currency].rate
  const rounded = major >= 50 ? Math.round(major / 5) * 5 : Math.round(major)
  return Math.max(1, rounded)
}

/** "€39", "$42", "£33", or "Free". */
export function formatPrice(eurCents: number, currency: CurrencyCode = 'EUR'): string {
  const value = convert(eurCents, currency)
  if (!value) return 'Free'
  return `${CURRENCIES[currency].symbol}${value}`
}

/** Best guess from the browser's language tag. Never a network call. */
export function detectCurrency(): CurrencyCode {
  if (typeof navigator === 'undefined') return 'EUR'
  const lang = navigator.language?.toLowerCase() ?? ''
  if (lang === 'en-gb' || lang.endsWith('-gb')) return 'GBP'
  if (lang === 'en-us' || lang.endsWith('-us')) return 'USD'
  return 'EUR'
}
