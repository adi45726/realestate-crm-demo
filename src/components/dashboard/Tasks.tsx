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

const statusOptions = ['All', 'open', 'overdue', 'done']

export function Tasks({ role }: { role: Role }) {
  const { tasks, completeTask } = useDemoData()
  const list = useListControls(tasks, (t, q, f) => {
    if (f !== 'All' && t.status !== f) return false
    if (q && !`${t.title} ${t.related} ${t.assignee}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <ListCard
      title="Tasks"
      subtitle={`${list.filtered.length} of ${tasks.length} tasks`}
      controls={
        <>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search tasks..." />
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
      {list.visible.map((t) => (
        <div key={t.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-estate-ink font-medium flex items-center gap-2">
              {t.title}
              <StatusBadge status={t.priority} />
            </div>
            <div className="text-xs text-estate-slate mt-0.5 truncate">
              {t.related} · {t.assignee} · due {t.due}
            </div>
          </div>
          <StatusBadge status={t.status} />
          {canManage[role] && t.status !== 'done' && (
            <RowAction label="Mark done" onClick={() => completeTask(t.id, role)} />
          )}
        </div>
      ))}
    </ListCard>
  )
}
