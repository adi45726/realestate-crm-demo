import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, SearchInput, StatusBadge, useListControls } from '../primitives'

const statusOptions = ['All', 'live', 'paused', 'completed']

export function Campaigns() {
  const { campaigns } = useDemoData()
  const list = useListControls(campaigns, (c, q, f) => {
    if (f !== 'All' && c.status !== f) return false
    if (q && !`${c.name} ${c.channel}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Campaigns"
      subtitle={`${list.filtered.length} of ${campaigns.length} campaigns`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search campaigns..." />
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
      {list.visible.map((c) => (
        <div key={c.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium">{c.name}</div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {c.channel} · {c.leads} leads · {c.conversions} conversions · spend {c.costLabel} · {c.period}
            </div>
          </div>
          <StatusBadge status={c.status} />
        </div>
      ))}
    </ListCard>
  )
}
