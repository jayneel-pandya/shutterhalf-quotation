import { useState, useEffect } from 'react'
import type { ApprovedClient, TeamMember, TeamAssignment } from '../types'
import { getAllTeamData } from '../utils/teamSheet'
import { ApprovedClientCard } from './ApprovedClientCard'
import { ClientAssignment } from './ClientAssignment'
import { TeamMemberManager } from './TeamMemberManager'
import { Button } from './ui/Button'
import { ArrowLeft, Loader2, AlertCircle, UserCheck, Users } from 'lucide-react'

interface TeamManagementProps {
  onBack: () => void
}

export function TeamManagement({ onBack }: TeamManagementProps) {
  const [clients, setClients] = useState<ApprovedClient[]>([])
  const [allMembers, setAllMembers] = useState<TeamMember[]>([])
  const [allAssignments, setAllAssignments] = useState<TeamAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClient, setSelectedClient] = useState<ApprovedClient | null>(null)
  const [activeTab, setActiveTab] = useState<'assignments' | 'members'>('assignments')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getAllTeamData()
      .then((data) => {
        setClients(data.approvedClients)
        setAllMembers(data.members)
        setAllAssignments(data.assignments)
        if (data.approvedClients.length > 0) {
          setSelectedClient((prev) =>
            prev ? data.approvedClients.find((c) => c.row === prev.row) || data.approvedClients[0] : data.approvedClients[0]
          )
        }
        setError('')
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load data. Make sure the Apps Script is deployed.')
        setLoading(false)
      })
  }, [refreshKey])

  const totalRolesFor = (client: ApprovedClient) => {
    if (!client.rawData?.days) return 0
    return client.rawData.days.reduce((sum, d) => sum + d.services.filter((s) => s.quantity > 0).length, 0)
  }

  const assignmentCountFor = (clientName: string): number => {
    return allAssignments.filter((a) => a.clientName === clientName && a.assignedMembers.length > 0).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
        <span className="ml-3 text-sm text-ink-500">Loading team management...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-brand-700" />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-ink-800">Team Management</h2>
          <p className="text-xs text-ink-400">Assign crew members to approved clients</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-ink-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => { setActiveTab('assignments'); setError('') }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'assignments'
              ? 'bg-white text-ink-800 shadow-sm'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 inline mr-1.5" />
          Assignments
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('members'); setError('') }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'members'
              ? 'bg-white text-ink-800 shadow-sm'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1.5" />
          Manage Team Members
        </button>
      </div>

      {activeTab === 'assignments' && (
        <div className="flex gap-6">
          <div className="w-64 shrink-0 space-y-2">
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">
              Approved Clients
              <span className="ml-1.5 font-normal normal-case">({clients.length})</span>
            </h3>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="w-6 h-6 text-ink-300 mx-auto mb-1" />
                <p className="text-xs text-ink-400">No approved clients yet</p>
              </div>
            ) : (
              clients.map((c) => (
                <ApprovedClientCard
                  key={c.row}
                  client={c}
                  active={selectedClient?.row === c.row}
                  onClick={() => setSelectedClient(c)}
                  assignmentCount={assignmentCountFor(c.clientName)}
                  totalRoles={totalRolesFor(c)}
                />
              ))
            )}
          </div>

          <div className="flex-1 min-w-0">
            {selectedClient ? (
              <div className="bg-white border border-ink-200 rounded-xl p-5">
                <div className="mb-4 pb-3 border-b border-ink-100">
                  <h3 className="text-base font-display font-bold text-ink-800">{selectedClient.clientName}</h3>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {selectedClient.eventDates} | {selectedClient.venue} | {selectedClient.location}
                  </p>
                </div>
                <ClientAssignment
                  client={selectedClient}
                  allMembers={allMembers}
                  allAssignments={allAssignments}
                  onAssignmentsChanged={() => setRefreshKey((k) => k + 1)}
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-ink-200 rounded-xl">
                <Users className="w-8 h-8 text-ink-300 mx-auto mb-2" />
                <p className="text-sm text-ink-400">Select a client from the sidebar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white border border-ink-200 rounded-xl p-5">
          <TeamMemberManager />
        </div>
      )}
    </div>
  )
}
