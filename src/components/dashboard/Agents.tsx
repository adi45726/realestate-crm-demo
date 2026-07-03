import { useDemoData } from '../../context/DemoDataContext'
import { FilterSelect, ListCard, SearchInput, StatusBadge, useListControls } from '../primitives'
import type { Role } from '../../types'

const roleOptions = ['All', 'Director', 'Sales Manager', 'Agent', 'Channel Partner', 'Admin Staff']

export function Agents() {
  const { team } = useDemoData()
  const list = useListControls(team, (t, q, f) => {
    if (f !== 'All' && t.role !== (f as Role)) return false
    if (q && !`${t.name} ${t.region} ${t.jobTitle}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Agents & Team"
      subtitle={`${list.filtered.length} of ${team.length} team members`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search team..." />
          <FilterSelect
            value={list.filter}
            onChange={list.setFilter}
            options={roleOptions.map((r) => ({ value: r, label: r === 'All' ? 'All roles' : r }))}
          />
        </>
      }
      hasMore={list.hasMore}
      moreCount={list.moreCount}
      onMore={list.showMore}
      isEmpty={list.visible.length === 0}
    >
      {list.visible.map((t) => (
        <div key={t.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium">{t.name} · {t.jobTitle}</div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {t.region} · {t.phone} · {t.dealsClosed} deals closed · last login {t.lastLogin}
            </div>
          </div>
          <StatusBadge status={t.role} />
          <StatusBadge status={t.status} />
        </div>
      ))}
    </ListCard>
  )
}
