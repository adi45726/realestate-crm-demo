import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, RowAction, SearchInput, StatusBadge, useListControls } from '../primitives'
import type { DealStage, Role } from '../../types'

const canManage: Record<Role, boolean> = {
  Director: false,
  'Sales Manager': true,
  Agent: true,
  'Channel Partner': false,
  'Admin Staff': false,
}

const nextAction: Record<DealStage, { label: string; next: DealStage } | null> = {
  offer: { label: 'Move to negotiation', next: 'negotiation' },
  negotiation: { label: 'Token received', next: 'token-paid' },
  'token-paid': { label: 'Agreement signed', next: 'agreement' },
  agreement: { label: 'Mark closed', next: 'closed-won' },
  'closed-won': null,
  lost: null,
}

const stageOptions = ['All', 'offer', 'negotiation', 'token-paid', 'agreement', 'closed-won', 'lost']

export function Deals({ role }: { role: Role }) {
  const { deals, advanceDealStage } = useDemoData()
  const list = useListControls(deals, (d, q, f) => {
    if (f !== 'All' && d.stage !== f) return false
    if (q && !`${d.clientName} ${d.unitCode} ${d.project} ${d.agent}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Deals"
      subtitle={`${list.filtered.length} of ${deals.length} deals`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search deals..." />
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
      {list.visible.map((d) => {
        const action = nextAction[d.stage]
        return (
          <div key={d.id} className="flex items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-estate-ink font-medium">
                {d.clientName} · {d.unitCode} · {d.valueLabel}
              </div>
              <div className="text-xs text-estate-slate mt-0.5 truncate">
                {d.project} · {d.agent}{d.partner ? ` · via ${d.partner}` : ''} · expected close {d.expectedClose}
              </div>
            </div>
            <StatusBadge status={d.stage} />
            {canManage[role] && action && (
              <RowAction label={action.label} onClick={() => advanceDealStage(d.id, action.next, role)} />
            )}
            {canManage[role] && d.stage !== 'closed-won' && d.stage !== 'lost' && (
              <RowAction label="Mark lost" tone="slate" onClick={() => advanceDealStage(d.id, 'lost', role)} />
            )}
          </div>
        )
      })}
    </ListCard>
  )
}
