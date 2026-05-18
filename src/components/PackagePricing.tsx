import { useQuotationStore } from '../store/useQuotationStore'
import { Input } from './ui/Input'
import { Card, CardBody, CardHeader } from './ui/Card'
import { IndianRupee, Tag } from 'lucide-react'

export function PackagePricing() {
  const packageCost = useQuotationStore((s) => s.packageCost)
  const setPackageCost = useQuotationStore((s) => s.setPackageCost)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-ink-800">Package Pricing</h2>
            <p className="text-xs text-ink-400">Set the total package cost for the quotation</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute left-3 top-[38px] pointer-events-none">
              <IndianRupee className="w-4 h-4 text-ink-300" />
            </div>
            <Input
              id="packageCost"
              label="Package Cost (Total)"
              value={packageCost}
              onChange={(e) => setPackageCost(e.target.value)}
              placeholder="e.g. ₹3,15,000/-"
              className="pl-10 text-lg font-display font-semibold"
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
            <Tag className="w-3 h-3" />
            Enter the total amount including all services and post-production
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
