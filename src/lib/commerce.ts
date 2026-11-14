import { SITE } from '../data'

/** Every buy action lands on the support page with the product preselected. */
export function checkoutHref(slug: string) {
  return `/support?product=${encodeURIComponent(slug)}#buy`
}

/** A product-specific email enquiry for the existing email/payment-link checkout. */
export function orderMailto(productName: string) {
  const subject = `${productName} — licence enquiry`
  const body = [
    `Product: ${productName}`,
    'Platform (FiveM / Roblox / both):',
    'Name:',
    'Country:',
    'VAT number (optional):',
  ].join('\n')
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
