import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, RowAction, SearchInput, StatusBadge, useListControls } from '../primitives'
import type { Role } from '../../types'

const canManage: Record<Role, boolean> = {
  Director: false,
  'Sales Manager': true,
  Agent: false,
  'Channel Partner': false,
  'Admin Staff': true,
}

const statusOptions = ['All', 'available', 'on-hold', 'blocked', 'under-offer', 'sold']

export function Listings({ role }: { role: Role }) {
  const { units, setUnitStatus } = useDemoData()
  const list = useListControls(units, (u, q, f) => {
    if (f !== 'All' && u.status !== f) return false
    if (q && !`${u.code} ${u.project} ${u.locality} ${u.type} ${u.config}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Listings & Inventory"
      subtitle={`${list.filtered.length} of ${units.length} units`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search units..." />
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
      {list.visible.map((u) => (
        <div key={u.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium">
              {u.code} · {u.config} · {u.priceLabel}
            </div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {u.project}, {u.locality} · {u.areaSqft.toLocaleString('en-IN')} sqft · {u.facing} facing · floor {u.floor} · {u.agent}
            </div>
          </div>
          <StatusBadge status={u.status} />
          {canManage[role] && u.status === 'available' && (
            <RowAction label="Place hold" onClick={() => setUnitStatus(u.id, 'on-hold', role)} />
          )}
          {canManage[role] && (u.status === 'on-hold' || u.status === 'blocked') && (
            <RowAction label="Release" tone="slate" onClick={() => setUnitStatus(u.id, 'available', role)} />
          )}
        </div>
      ))}
    </ListCard>
  )
}
