import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, RowAction, SearchInput, StatusBadge, useListControls } from '../primitives'
import type { Role } from '../../types'

const canManage: Record<Role, boolean> = {
  Director: false,
  'Sales Manager': true,
  Agent: true,
  'Channel Partner': false,
  'Admin Staff': true,
}

const statusOptions = ['All', 'scheduled', 'completed', 'no-show', 'cancelled']

export function SiteVisits({ role }: { role: Role }) {
  const { visits, recordVisitOutcome } = useDemoData()
  const list = useListControls(visits, (v, q, f) => {
    if (f !== 'All' && v.status !== f) return false
    if (q && !`${v.leadName} ${v.project} ${v.unitCode} ${v.agent}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Site Visits"
      subtitle={`${list.filtered.length} of ${visits.length} visits`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search visits..." />
          <FilterSelect
            value={list.filter}
            onChange={list.setFilter}
            options={statusOptions.map((s) => ({ value: s, label: s === 'All' ? 'All statuses' : s.replace('-', ' ') }))}
          />
        </>
      }
      hasMore={list.hasMore}
      moreCount={list.moreCount}
      onMore={list.showMore}
      isEmpty={list.visible.length === 0}
    >
      {list.visible.map((v) => (
        <div key={v.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium flex items-center gap-2">
              {v.leadName} · {v.project} ({v.unitCode})
              <StatusBadge status={v.type} />
            </div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {v.when} · {v.agent} · {v.outcome}
            </div>
          </div>
          <StatusBadge status={v.status} />
          {canManage[role] && v.status === 'scheduled' && (
            <>
              <RowAction label="Mark completed" onClick={() => recordVisitOutcome(v.id, 'completed', role)} />
              <RowAction label="No-show" tone="slate" onClick={() => recordVisitOutcome(v.id, 'no-show', role)} />
            </>
          )}
        </div>
      ))}
    </ListCard>
  )
}
