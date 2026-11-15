import { Card } from './Card'
import { Badge } from './Bits'

/** Shown wherever an account feature needs the store backend to be connected. */
export function BackendNotice() {
  return (
    <Card className="grid gap-3 p-6">
      <div className="flex items-center gap-2">
        <Badge tone="outline">Preview</Badge>
        <span className="caps text-[10px] text-faint">Accounts</span>
      </div>
      <p className="text-[15px] font-medium">Accounts are not connected in this preview yet.</p>
      <p className="max-w-prose text-[13px] leading-relaxed text-muted">
        Sign-in, registration and the community boards switch on once the account service is connected. Until then the pages stay visible for review,
        and nothing you type is stored.
      </p>
    </Card>
  )
}
