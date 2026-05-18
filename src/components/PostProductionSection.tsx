import { useState } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { Button } from './ui/Button'
import { Card, CardBody, CardHeader } from './ui/Card'
import { POST_PRODUCTION_TEMPLATES } from '../constants/services'
import { Plus, Trash2, Film, Sparkles, Pencil, Check, X } from 'lucide-react'

export function PostProductionSection() {
  const items = useQuotationStore((s) => s.postProduction)
  const addItem = useQuotationStore((s) => s.addPostProductionItem)
  const removeItem = useQuotationStore((s) => s.removePostProductionItem)
  const updateItem = useQuotationStore((s) => s.updatePostProductionItem)
  const [customValue, setCustomValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = (name: string) => {
    addItem(name)
    setCustomValue('')
  }

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      updateItem(editingId, editValue.trim())
    }
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const usedTemplates = items.map((i) => i.name)
  const availableTemplates = POST_PRODUCTION_TEMPLATES.filter((t) => !usedTemplates.includes(t))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Film className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-ink-800">Post Production</h2>
            <p className="text-xs text-ink-400">Add editing and post-production deliverables</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-2 mb-5">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customValue.trim()) {
                handleAdd(customValue.trim())
              }
            }}
            placeholder="Type custom item and press Enter..."
            className="flex-1 px-4 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => customValue.trim() && handleAdd(customValue.trim())}
            disabled={!customValue.trim()}
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {availableTemplates.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-medium text-ink-400 uppercase tracking-wider mb-2">
              Quick add templates
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableTemplates.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => handleAdd(tpl)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {tpl}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          {items.length === 0 && (
            <p className="text-sm text-ink-400 text-center py-6">
              No post-production items added yet.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-ink-100 bg-white group hover:border-ink-200 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
              {editingId === item.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className="flex-1 px-3 py-1 text-sm bg-white border border-ink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 rounded text-ink-400 hover:bg-ink-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="flex-1 text-sm text-ink-700">{item.name}</span>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  type="button"
                  onClick={() => startEdit(item.id, item.name)}
                  className="p-1 rounded-md text-ink-300 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded-md text-ink-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
