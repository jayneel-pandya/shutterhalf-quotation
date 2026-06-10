import { useState, useEffect, useRef } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { fetchQuotations, type QuotationRow } from '../utils/fetchQuotations'
import { Card, CardBody } from './ui/Card'
import { Button } from './ui/Button'
import { FilePlus, FolderOpen, Search, Loader2, AlertCircle } from 'lucide-react'

export function LoadQuotation() {
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)
  const setClientName = useQuotationStore((s) => s.setClientName)
  const setContactNumber = useQuotationStore((s) => s.setContactNumber)
  const setVenue = useQuotationStore((s) => s.setVenue)
  const setLocation = useQuotationStore((s) => s.setLocation)
  const setEventDates = useQuotationStore((s) => s.setEventDates)
  const setDays = useQuotationStore((s) => s.setDays)
  const setPostProduction = useQuotationStore((s) => s.setPostProduction)
  const setPackageCost = useQuotationStore((s) => s.setPackageCost)

  const [mode, setMode] = useState<'new' | 'load' | null>(null)
  const [quotations, setQuotations] = useState<QuotationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<QuotationRow | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleStartNew = () => {
    setCurrentStep(1)
  }

  const handleLoadMode = async () => {
    setMode('load')
    setLoading(true)
    setError('')
    try {
      const data = await fetchQuotations()
      setQuotations(data)
    } catch {
      setError('Failed to load quotations. Check your connection and redeploy the Apps Script.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = quotations.filter((q) =>
    q.clientName.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (q: QuotationRow) => {
    setSelectedRow(q)
    setSearch(q.clientName)
    setDropdownOpen(false)
  }

  const handleLoad = () => {
    if (!selectedRow) return

    setClientName(selectedRow.clientName)
    setContactNumber(selectedRow.contactNumber)
    setVenue(selectedRow.venue)
    setLocation(selectedRow.location)
    setEventDates(selectedRow.eventDates)

    if (selectedRow.rawData) {
      setDays(selectedRow.rawData.days)
      setPostProduction(selectedRow.rawData.postProduction)
      setPackageCost(selectedRow.rawData.packageCost)
    }

    setCurrentStep(1)
  }

  if (mode === 'load') {
    return (
      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-ink-800">Load Existing Quotation</h2>
              <p className="text-xs text-ink-400">Select a quotation to edit</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
              <span className="ml-3 text-sm text-ink-500">Loading quotations...</span>
            </div>
          ) : (
            <>
              <div className="relative mb-4" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by client name..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setDropdownOpen(true)
                      setSelectedRow(null)
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder-ink-300"
                  />
                </div>

                {dropdownOpen && filtered.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-ink-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filtered.map((q) => (
                      <button
                        key={q.row}
                        type="button"
                        onClick={() => handleSelect(q)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-brand-50 border-b border-ink-50 last:border-b-0 transition-colors ${
                          selectedRow?.row === q.row ? 'bg-brand-50' : ''
                        }`}
                      >
                        <span className="block font-semibold text-ink-800">{q.clientName}</span>
                        <span className="block text-[11px] text-ink-400 mt-0.5">
                          {q.eventDates} | {q.venue}
                          {q.rawData ? '' : ' — partial data'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {dropdownOpen && filtered.length === 0 && !loading && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-ink-200 rounded-lg shadow-lg p-4 text-center text-sm text-ink-400">
                    {quotations.length === 0
                      ? 'No quotations found in sheet'
                      : 'No matching client name'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" onClick={handleLoad} disabled={!selectedRow}>
                  <FolderOpen className="w-4 h-4" />
                  Load & Edit
                </Button>
                <Button variant="ghost" onClick={() => setMode(null)}>
                  Back
                </Button>
              </div>

              {selectedRow && (
                <div className="mt-4 p-3 bg-ink-50 rounded-lg border border-ink-100">
                  <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">Selected</p>
                  <p className="text-sm font-bold text-ink-800">{selectedRow.clientName}</p>
                  <p className="text-xs text-ink-400">{selectedRow.contactNumber} | {selectedRow.venue} | {selectedRow.eventDates}</p>
                  {!selectedRow.rawData && (
                    <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Partial data — services & post-production unavailable</span>
                  )}
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2384654a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3Cline x1='16' y1='13' x2='8' y2='13'/%3E%3Cline x1='16' y1='17' x2='8' y2='17'/%3E%3Cpolyline points='10 9 9 9 8 9'/%3E%3C/svg%3E"
              alt=""
              className="w-8 h-8"
            />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink-800 mb-2">
            Studio Shutter Half
          </h2>
          <p className="text-sm text-ink-400 mb-8 max-w-sm mx-auto">
            Create a new quotation or load an existing one to edit
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartNew}
              className="w-56 flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-ink-200 bg-white hover:border-brand-400 hover:bg-brand-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <FilePlus className="w-6 h-6 text-ink-600 group-hover:text-brand-700" />
              </div>
              <div>
                <p className="text-base font-display font-bold text-ink-800">New Quotation</p>
                <p className="text-xs text-ink-400 mt-0.5">Start from scratch</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleLoadMode}
              className="w-56 flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-ink-200 bg-white hover:border-brand-400 hover:bg-brand-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <FolderOpen className="w-6 h-6 text-ink-600 group-hover:text-brand-700" />
              </div>
              <div>
                <p className="text-base font-display font-bold text-ink-800">Load Existing</p>
                <p className="text-xs text-ink-400 mt-0.5">Edit a past quotation</p>
              </div>
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
