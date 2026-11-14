import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import { LAUNCH } from '../data'
import { CURRENCIES, CURRENCY_CODES, convert, detectCurrency, formatPrice, type CurrencyCode } from '../lib/currency'
import { cx } from '../lib/cx'

const KEY = 'modsmith:currency'

type CurrencyValue = {
  currency: CurrencyCode
  setCurrency: (next: CurrencyCode) => void
  format: (eurCents: number) => string
}

const CurrencyContext = createContext<CurrencyValue>({
  currency: 'EUR',
  setCurrency: () => {},
  format: (c) => formatPrice(c, 'EUR'),
})

function readStored(): CurrencyCode {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw && (CURRENCY_CODES as string[]).includes(raw)) return raw as CurrencyCode
  } catch {
    /* storage unavailable */
  }
  return detectCurrency()
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, set] = useState<CurrencyCode>(readStored)

  const setCurrency = useCallback((next: CurrencyCode) => {
    set(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode */
    }
  }, [])

  const format = useCallback((eurCents: number) => formatPrice(eurCents, currency), [currency])

  const value = useMemo(() => ({ currency, setCurrency, format }), [currency, setCurrency, format])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

/** € / $ / £ as a segmented control. Purely a display choice. */
export function CurrencySwitch({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()
  return (
    <div className={cx('inline-flex items-center gap-1 rounded-full border border-line-strong bg-card p-1', className)} role="group" aria-label="Display currency">
      {CURRENCY_CODES.map((code) => {
        const active = currency === code
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setCurrency(code)}
            className={cx(
              'round flex h-9 min-w-12 items-center justify-center gap-1 rounded-full px-3 text-sm font-medium transition-colors',
              active ? 'bg-violet text-white' : 'text-muted hov:text-ink',
            )}
          >
            <span aria-hidden>{CURRENCIES[code].symbol}</span>
            <span className="sr-only">{CURRENCIES[code].label}</span>
            <span aria-hidden className="text-[11px] tracking-wide">
              {code}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** True while the launch window is open. Evaluated per render, not cached. */
export function launchActive(now = Date.now()) {
  return now < Date.parse(LAUNCH.endsAt)
}

export const launchPrice = (cents: number) => Math.round((cents * LAUNCH.multiplier) / 100) * 100

export { convert }
