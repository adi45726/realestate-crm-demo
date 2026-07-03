import { useMemo, useState } from 'react'
import { BarChart3, Building2, FileDown, Handshake, Megaphone, Target, TrendingUp, Users } from 'lucide-react'
import { useDemoData } from '../../context/DemoDataContext'
import { inrLabel } from '../../data/seed'
import type { Role } from '../../types'

const iconTone = [
  { icon: TrendingUp, cls: 'bg-estate-green/15 text-estate-green' },
  { icon: Target, cls: 'bg-estate-gold/15 text-estate-gold' },
  { icon: Building2, cls: 'bg-estate-blue/15 text-estate-blue' },
  { icon: Handshake, cls: 'bg-estate-purple/15 text-estate-purple' },
  { icon: Users, cls: 'bg-estate-blue/15 text-estate-blue' },
  { icon: BarChart3, cls: 'bg-estate-gold/15 text-estate-gold' },
  { icon: Megaphone, cls: 'bg-estate-green/15 text-estate-green' },
]

const RANGE_MS: Record<string, number | null> = {
  'This week': 7 * 24 * 60 * 60 * 1000,
  'This month': 30 * 24 * 60 * 60 * 1000,
  'All time': null,
}

export function Reports({ role }: { role: Role }) {
  const { leads, visits, deals, units, campaigns, team, auditLog, exportReport } = useDemoData()
  const [range, setRange] = useState<'This week' | 'This month' | 'All time'>('This month')

  const cutoff = RANGE_MS[range] ? Date.now() - RANGE_MS[range]! : null

  const scopedLeads = useMemo(() => (cutoff ? leads.filter((l) => l.sortTs >= cutoff) : leads), [leads, cutoff])
  const scopedVisits = useMemo(() => (cutoff ? visits.filter((v) => v.sortTs >= cutoff) : visits), [visits, cutoff])
  const scopedDeals = useMemo(() => (cutoff ? deals.filter((d) => d.sortTs >= cutoff) : deals), [deals, cutoff])

  const closedDeals = scopedDeals.filter((d) => d.stage === 'closed-won')
  const closedValue = closedDeals.reduce((s, d) => s + d.value, 0)
  const pipelineValue = scopedDeals.filter((d) => d.stage !== 'closed-won' && d.stage !== 'lost').reduce((s, d) => s + d.value, 0)

  const sourceCounts = new Map<string, number>()
  for (const l of scopedLeads) sourceCounts.set(l.source, (sourceCounts.get(l.source) ?? 0) + 1)
  const topSource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  const completedVisits = scopedVisits.filter((v) => v.status === 'completed').length
  const noShowVisits = scopedVisits.filter((v) => v.status === 'no-show').length
  const visitConversion = completedVisits ? Math.round((closedDeals.length / completedVisits) * 100) : 0

  const agentPerf = team
    .filter((t) => t.role === 'Agent')
    .map((t) => ({ name: t.name, closed: scopedDeals.filter((d) => d.agent === t.name && d.stage === 'closed-won').length }))
    .sort((a, b) => b.closed - a.closed)
  const topAgent = agentPerf[0]

  const soldUnits = units.filter((u) => u.status === 'sold').length
  const availableUnits = units.filter((u) => u.status === 'available').length
  const liveCampaigns = campaigns.filter((c) => c.status === 'live').length
  const totalCampaignLeads = campaigns.reduce((s, c) => s + c.leads, 0)

  const reports = [
    { title: 'Pipeline summary', desc: `${inrLabel(pipelineValue)} active pipeline across ${scopedDeals.filter((d) => d.stage !== 'closed-won' && d.stage !== 'lost').length} open deals.` },
    { title: 'Leads by source', desc: topSource ? `${topSource[0]} is the top source, with ${topSource[1]} leads this range.` : 'No leads in this range yet.' },
    { title: 'Inventory status', desc: `${availableUnits} units available, ${soldUnits} sold to date across all projects.` },
    { title: 'Closures & revenue', desc: `${closedDeals.length} deals closed for ${inrLabel(closedValue)} this range.` },
    { title: 'Agent performance', desc: topAgent ? `${topAgent.name} leads with ${topAgent.closed} closures this range.` : 'No closures yet.' },
    { title: 'Site visit conversion', desc: `${completedVisits} visits completed, ${noShowVisits} no-shows, ${visitConversion}% converted to closure.` },
    { title: 'Campaign performance', desc: `${liveCampaigns} campaigns live, ${totalCampaignLeads.toLocaleString('en-IN')} total leads generated.` },
  ]

  function handleExport() {
    const rows = [
      ['Report', 'Summary'],
      ...reports.map((r) => [r.title, r.desc]),
      [],
      ['Recent audit activity'],
      ...auditLog.slice(0, 30).map((e) => [`${e.time} · ${e.user} (${e.role})`, `${e.action} — ${e.status}`]),
    ]
    const csv = rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `estateflow-report-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    exportReport(role)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-estate-ink">Reports & insights</h2>
          <p className="text-xs text-estate-slate mt-0.5">Export a pipeline snapshot for leadership or partner review.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as typeof range)}
            className="text-xs rounded-lg border border-estate-border bg-estate-panel text-estate-ink px-2 py-1.5 outline-none focus:border-estate-gold"
          >
            {Object.keys(RANGE_MS).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181206] bg-gradient-to-br from-estate-gold to-estate-goldDeep rounded-lg px-3 py-2 hover:brightness-110"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export as CSV
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {reports.map((r, i) => {
          const { icon: Icon, cls } = iconTone[i]
          return (
            <div key={r.title} className="estate-card rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-2.5 text-sm font-semibold text-estate-ink">{r.title}</div>
              <div className="mt-1.5 text-xs text-estate-slate leading-[1.5]">{r.desc}</div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-estate-slate">
        Exports are logged in the Audit Log with a timestamp and the exporting user's role.
      </p>
    </div>
  )
}
