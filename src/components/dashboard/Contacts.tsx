import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, SearchInput, StatusBadge, useListControls } from '../primitives'

const typeOptions = ['All', 'Buyer', 'Seller', 'Renter', 'Investor']

export function Contacts() {
  const { contacts } = useDemoData()
  const list = useListControls(contacts, (c, q, f) => {
    if (f !== 'All' && c.type !== f) return false
    if (q && !`${c.name} ${c.locality} ${c.email}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Contacts"
      subtitle={`${list.filtered.length} of ${contacts.length} contacts`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search contacts..." />
          <FilterSelect
            value={list.filter}
            onChange={list.setFilter}
            options={typeOptions.map((t) => ({ value: t, label: t === 'All' ? 'All types' : t }))}
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
            <div className="text-sm text-estate-ink font-medium">{c.name} · {c.locality}</div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {c.phone} · {c.email} · {c.dealsCount} deals · last touch {c.lastInteraction} · {c.note}
            </div>
          </div>
          <StatusBadge status={c.type} />
        </div>
      ))}
    </ListCard>
  )
}
