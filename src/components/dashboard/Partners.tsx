import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, SearchInput, StatusBadge, useListControls } from '../primitives'

const statusOptions = ['All', 'active', 'inactive']

export function Partners() {
  const { partners } = useDemoData()
  const list = useListControls(partners, (p, q, f) => {
    if (f !== 'All' && p.status !== f) return false
    if (q && !`${p.firm} ${p.contactName}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Channel Partners"
      subtitle={`${list.filtered.length} of ${partners.length} partner firms`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search partners..." />
          <FilterSelect
            value={list.filter}
            onChange={list.setFilter}
            options={statusOptions.map((s) => ({ value: s, label: s === 'All' ? 'All statuses' : s }))}
          />
        </>
      }
      hasMore={list.hasMore}
      moreCount={list.moreCount}
      onMore={list.showMore}
      isEmpty={list.visible.length === 0}
    >
      {list.visible.map((p) => (
        <div key={p.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium">{p.firm}</div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {p.contactName} · {p.phone} · {p.leadsShared} leads shared · {p.dealsClosed} closed · commission {p.commissionRate} · last lead {p.lastLead}
            </div>
          </div>
          <StatusBadge status={p.status} />
        </div>
      ))}
    </ListCard>
  )
}
