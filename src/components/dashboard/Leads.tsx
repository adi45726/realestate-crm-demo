import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, RowAction, SearchInput, StatusBadge, useListControls } from '../primitives'
import type { LeadStage, Role } from '../../types'

const canManage: Record<Role, boolean> = {
  Director: false,
  'Sales Manager': true,
  Agent: true,
  'Channel Partner': false,
  'Admin Staff': false,
}

const nextAction: Record<LeadStage, { label: string; next: LeadStage } | null> = {
  new: { label: 'Mark contacted', next: 'contacted' },
  contacted: { label: 'Qualify', next: 'qualified' },
  qualified: { label: 'Schedule visit', next: 'visit-scheduled' },
  'visit-scheduled': { label: 'Move to negotiation', next: 'negotiation' },
  negotiation: { label: 'Mark won', next: 'won' },
  won: null,
  lost: null,
}

const stageOptions = ['All', 'new', 'contacted', 'qualified', 'visit-scheduled', 'negotiation', 'won', 'lost']

export function Leads({ role }: { role: Role }) {
  const { leads, advanceLeadStage } = useDemoData()
  const list = useListControls(leads, (l, q, f) => {
    if (f !== 'All' && l.stage !== f) return false
    if (q && !`${l.name} ${l.assignedAgent} ${l.project} ${l.source}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Leads"
      subtitle={`${list.filtered.length} of ${leads.length} leads`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search leads..." />
          <FilterSelect
            value={list.filter}
            onChange={list.setFilter}
            options={stageOptions.map((s) => ({ value: s, label: s === 'All' ? 'All stages' : s.replace('-', ' ') }))}
          />
        </>
      }
      hasMore={list.hasMore}
      moreCount={list.moreCount}
      onMore={list.showMore}
      isEmpty={list.visible.length === 0}
    >
      {list.visible.map((l) => {
        const action = nextAction[l.stage]
        return (
          <div key={l.id} className="flex items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-estate-ink font-medium flex items-center gap-2">
                {l.name} · {l.budgetLabel}
                <StatusBadge status={l.score} />
                {l.followUpDue && l.stage !== 'won' && l.stage !== 'lost' && (
                  <span className="text-[11px] text-estate-red font-medium">follow-up due</span>
                )}
              </div>
              <div className="text-xs text-estate-slate mt-0.5 truncate">
                {l.source} · {l.intent} · {l.preferredType} at {l.project} · {l.assignedAgent} · next: {l.nextFollowUp}
              </div>
            </div>
            <StatusBadge status={l.stage} />
            {canManage[role] && action && (
              <RowAction label={action.label} onClick={() => advanceLeadStage(l.id, action.next, role)} />
            )}
            {canManage[role] && l.stage !== 'won' && l.stage !== 'lost' && (
              <RowAction label="Mark lost" tone="slate" onClick={() => advanceLeadStage(l.id, 'lost', role)} />
            )}
          </div>
        )
      })}
    </ListCard>
  )
}
