import { SITE } from '../data'

/** Every buy action starts the signed-in Paddle checkout for one product. */
export function checkoutHref(slug: string) {
  return `/checkout?product=${encodeURIComponent(slug)}`
}

/** A product-specific email enquiry for pre-sale or order support. */
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
