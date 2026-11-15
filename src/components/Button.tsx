import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/cx'

export type ButtonVariant = 'solid' | 'violet' | 'outline' | 'ghost' | 'light'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'round relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] prs:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  solid: 'bg-white text-[#08080c] hov:bg-violet-light prs:bg-white',
  violet: 'bg-[linear-gradient(110deg,#7c3aed_0%,#a21caf_48%,#db2777_100%)] text-white shadow-[var(--shadow-violet)] hov:brightness-110 hov:shadow-[0_0_0_1px_rgb(216_204_255/0.35),0_20px_60px_-14px_rgb(192_38_211/0.7)] prs:brightness-95',
  outline: 'border border-line-strong text-ink hov:border-violet hov:bg-violet/15 hov:text-white prs:bg-violet/25',
  ghost: 'text-ink hov:bg-soft prs:bg-line',
  light: 'on-dark bg-white text-[#08080c] hov:bg-violet hov:text-white prs:bg-violet-deep prs:text-white',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

export function buttonClass(variant: ButtonVariant = 'solid', size: ButtonSize = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconRight?: ReactNode }

export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; 'data-force'?: string }) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  )
}

export function ButtonLink({ variant = 'solid', size = 'md', icon, iconRight, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </Link>
  )
}

export type IconTone = 'ink' | 'outline' | 'violet' | 'light'

/** Round icon-only button (the black menu button in the header). Always pass an aria-label. */
export function IconButton({
  className,
  tone = 'ink',
  size = 'md',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: IconTone; size?: 'sm' | 'md'; 'aria-label': string; 'data-force'?: string }) {
  return (
    <button
      type="button"
      className={cx(
        'round inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform,border-color] duration-[var(--duration-fast)] prs:scale-95 disabled:pointer-events-none disabled:opacity-40',
        size === 'md' ? 'size-11' : 'size-10',
        tone === 'ink' && 'bg-white text-[#08080c] hov:bg-violet hov:text-white',
        tone === 'outline' && 'border border-line-strong bg-card text-ink hov:border-violet hov:bg-violet hov:text-white',
        tone === 'violet' && 'bg-violet text-white shadow-[var(--shadow-violet)] hov:bg-violet-deep',
        tone === 'light' && 'on-dark bg-white text-[#08080c] hov:bg-violet hov:text-white',
        className,
      )}
      {...rest}
    />
  )
}
