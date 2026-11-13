// Validation shared by the newsletter form (instant feedback) and the Worker
// (the authority). Each validator returns a map of field -> message; empty = valid.

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validateSubscribe(input: Record<string, unknown>): FieldErrors {
  return EMAIL.test(str(input.email)) ? {} : { email: 'Enter a valid email address.' }
}
