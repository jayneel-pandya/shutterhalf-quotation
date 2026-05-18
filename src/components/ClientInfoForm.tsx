import { useQuotationStore } from '../store/useQuotationStore'
import { Input } from './ui/Input'
import { Card, CardBody, CardHeader } from './ui/Card'
import { User, Phone, MapPin, Globe, Calendar } from 'lucide-react'

export function ClientInfoForm() {
  const clientName = useQuotationStore((s) => s.clientName)
  const contactNumber = useQuotationStore((s) => s.contactNumber)
  const venue = useQuotationStore((s) => s.venue)
  const location = useQuotationStore((s) => s.location)
  const eventDates = useQuotationStore((s) => s.eventDates)
  const setClientName = useQuotationStore((s) => s.setClientName)
  const setContactNumber = useQuotationStore((s) => s.setContactNumber)
  const setVenue = useQuotationStore((s) => s.setVenue)
  const setLocation = useQuotationStore((s) => s.setLocation)
  const setEventDates = useQuotationStore((s) => s.setEventDates)

  const setters: Record<string, (v: string) => void> = {
    clientName: setClientName,
    contactNumber: setContactNumber,
    venue: setVenue,
    location: setLocation,
    eventDates: setEventDates,
  }

  const fields = [
    { id: 'clientName', label: 'Client Name', value: clientName, icon: User, placeholder: 'e.g. Siddharth Nair', type: 'text' },
    { id: 'contactNumber', label: 'Contact Number', value: contactNumber, icon: Phone, placeholder: 'e.g. +61426913249', type: 'tel' },
    { id: 'venue', label: 'Venue', value: venue, icon: MapPin, placeholder: 'e.g. Ananta', type: 'text' },
    { id: 'location', label: 'Location', value: location, icon: Globe, placeholder: 'e.g. Rajkot & Ahmedabad', type: 'text' },
    { id: 'eventDates', label: 'Event Dates', value: eventDates, icon: Calendar, placeholder: 'e.g. 21,22,23 Feb 2026', type: 'text' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-ink-800">Client Information</h2>
            <p className="text-xs text-ink-400">Enter the client and event details</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map(({ id, label, value, icon: Icon, placeholder, type }) => (
            <div key={id} className="relative">
              <div className="absolute left-3 top-[38px] pointer-events-none">
                <Icon className="w-4 h-4 text-ink-300" />
              </div>
              <Input
                id={id}
                label={label}
                value={value}
                onChange={(e) => setters[id](e.target.value)}
                placeholder={placeholder}
                type={type}
                className="pl-10"
              />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
