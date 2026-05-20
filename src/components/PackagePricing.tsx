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
            <h2 className="text-xl font-display font-semibold text-ink-800">Package Pricing</h2>
            <p className="text-sm text-ink-400">Set the total package cost for the quotation</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-ink-600 uppercase tracking-wider">
            Package Cost (Total)
          </label>
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <IndianRupee className="w-7 h-7 text-ink-300" />
            </div>
            <Input
              id="packageCost"
              value={packageCost}
              onChange={(e) => setPackageCost(e.target.value)}
              placeholder="e.g. ₹3,15,000/-"
              className="pl-16 text-3xl sm:text-4xl font-display font-bold py-5 h-auto tracking-wide"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm sm:text-base text-ink-400">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
          Enter the total amount including all services and post-production
        </div>
      </CardBody>
    </Card>
  )
}
