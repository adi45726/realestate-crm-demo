import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useDemoData } from '../../context/DemoDataContext'
import { StatusBadge } from '../primitives'

const moduleTone: Record<string, string> = {
  Leads: 'bg-estate-gold/15 text-estate-gold',
  'Site Visits': 'bg-estate-blue/15 text-estate-blue',
  Deals: 'bg-estate-purple/15 text-estate-purple',
  Inventory: 'bg-estate-red/15 text-estate-red',
  Tasks: 'bg-estate-green/15 text-estate-green',
  Reports: 'bg-estate-purple/15 text-estate-purple',
}

const PAGE_SIZE = 20

export function AuditLogTab() {
  const { auditLog } = useDemoData()
  const [query, setQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    return auditLog.filter((e) => {
      if (moduleFilter !== 'All' && e.module !== moduleFilter) return false
      if (query) {
        const q = query.toLowerCase()
        if (!e.action.toLowerCase().includes(q) && !e.user.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [auditLog, moduleFilter, query])

  const visible = filtered.slice(0, visibleCount)
  const modules = ['All', 'Leads', 'Site Visits', 'Deals', 'Inventory', 'Tasks', 'Reports']

  return (
    <div className="estate-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-estate-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-estate-ink">Audit log</h2>
          <p className="text-xs text-estate-slate mt-0.5">
            {filtered.length} of {auditLog.length} entries — timestamped and attributed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-estate-slate absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
              placeholder="Search by user or action..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-estate-border bg-transparent text-estate-ink outline-none focus:border-estate-gold w-48"
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => { setModuleFilter(e.target.value); setVisibleCount(PAGE_SIZE) }}
            className="text-xs rounded-lg border border-estate-border bg-estate-panel text-estate-ink px-2 py-1.5 outline-none focus:border-estate-gold"
          >
            {modules.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-estate-slate border-b border-estate-border">
              <th className="px-5 py-2.5 font-medium">Time</th>
              <th className="px-3 py-2.5 font-medium">User</th>
              <th className="px-3 py-2.5 font-medium">Role</th>
              <th className="px-3 py-2.5 font-medium">Module</th>
              <th className="px-3 py-2.5 font-medium">Action</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visible.map((entry) => (
              <tr key={entry.id}>
                <td className="px-5 py-3 text-estate-slate tabular-nums whitespace-nowrap">{entry.time}</td>
                <td className="px-3 py-3 text-estate-ink font-medium whitespace-nowrap">{entry.user}</td>
                <td className="px-3 py-3 text-estate-slate whitespace-nowrap">{entry.role}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${moduleTone[entry.module] ?? 'bg-white/[0.06] text-estate-slate'}`}>
                    {entry.module}
                  </span>
                </td>
                <td className="px-3 py-3 text-estate-ink/80">{entry.action}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-estate-slate">No entries match your filters.</div>
        )}
      </div>
      {visibleCount < filtered.length && (
        <div className="px-5 py-3 border-t border-estate-border text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="text-xs font-medium text-estate-gold hover:underline"
          >
            Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
          </button>
        </div>
      )}
    </div>
  )
}
