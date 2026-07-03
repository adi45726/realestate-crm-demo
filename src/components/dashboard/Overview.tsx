import { AlertTriangle, Building, CalendarClock, Flame, Handshake, IndianRupee, Target } from 'lucide-react'
import { useDemoData } from '../../context/DemoDataContext'
import { StatusBadge, toneClassesForTone, type Tone } from '../primitives'
import { inrLabel, roleUser } from '../../data/seed'
import type { DealStage, LeadSource, Role } from '../../types'

const roleHeadline: Record<Role, string> = {
  Director: 'Business performance overview',
  'Sales Manager': 'Sales floor overview',
  Agent: 'My day at a glance',
  'Channel Partner': 'Partner pipeline overview',
  'Admin Staff': 'Operations overview',
}

function StatCard({ icon: Icon, tone, value, label }: { icon: typeof Target; tone: Tone; value: string; label: string }) {
  const t = toneClassesForTone(tone)
  return (
    <div className="estate-card rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.icon}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="mt-3 text-2xl font-bold text-estate-ink">{value}</div>
      <div className="text-xs text-estate-slate mt-0.5">{label}</div>
    </div>
  )
}

function BarPanel({ title, rows, max }: { title: string; rows: { label: string; count: number }[]; max: number }) {
  return (
    <div className="estate-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-estate-ink mb-4">{title}</h3>
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[110px_1fr_40px] gap-3 items-center text-xs text-estate-slate">
            <span className="capitalize">{r.label}</span>
            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-estate-gold to-estate-goldDeep"
                style={{ width: `${max ? Math.round((r.count / max) * 100) : 0}%` }}
              />
            </div>
            <span className="text-right">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Overview({ role }: { role: Role }) {
  const { leads, visits, deals, units, tasks } = useDemoData()
  const me = roleUser[role]

  const scopedLeads = role === 'Agent' ? leads.filter((l) => l.assignedAgent === me || l.followUpDue).slice(0, 400) : leads
  const today = new Date().setHours(0, 0, 0, 0)

  const newLeadsToday = leads.filter((l) => l.sortTs >= today && (l.stage === 'new' || l.stage === 'contacted')).length
  const visitsScheduled = visits.filter((v) => v.status === 'scheduled').length
  const activeListings = units.filter((u) => u.status === 'available' || u.status === 'on-hold').length
  const inNegotiation = deals.filter((d) => d.stage === 'negotiation' || d.stage === 'offer').length
  const pipelineValue = deals
    .filter((d) => d.stage !== 'closed-won' && d.stage !== 'lost')
    .reduce((s, d) => s + d.value, 0)
  const followUpsDue = scopedLeads.filter((l) => l.followUpDue).length
  const overdueTasks = tasks.filter((t) => t.status === 'overdue').length

  const sources: LeadSource[] = ['Portal', 'Ads', 'Website', 'Broker', 'Referral', 'Walk-in']
  const bySource = sources.map((s) => ({ label: s, count: leads.filter((l) => l.source === s).length }))
  const stages: DealStage[] = ['offer', 'negotiation', 'token-paid', 'agreement', 'closed-won']
  const byStage = stages.map((s) => ({ label: s.replace('-', ' '), count: deals.filter((d) => d.stage === s).length }))

  const upcomingVisits = visits.filter((v) => v.status === 'scheduled' && v.sortTs >= Date.now()).slice(-6).reverse()
  const hotLeads = scopedLeads.filter((l) => l.score === 'hot' && l.stage !== 'won' && l.stage !== 'lost').slice(0, 6)
  const dueFollowUps = scopedLeads.filter((l) => l.followUpDue).slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-estate-ink">{roleHeadline[role]}</h1>
        <p className="text-sm text-estate-slate mt-1">Signed in as {me} · {role}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Target} tone="gold" value={String(newLeadsToday)} label="New leads today" />
        <StatCard icon={CalendarClock} tone="blue" value={String(visitsScheduled)} label="Site visits scheduled" />
        <StatCard icon={Building} tone="green" value={String(activeListings)} label="Active listings" />
        <StatCard icon={Handshake} tone="purple" value={String(inNegotiation)} label="Deals in negotiation" />
        <StatCard icon={IndianRupee} tone="green" value={inrLabel(pipelineValue)} label="Pipeline value" />
        <StatCard icon={AlertTriangle} tone="red" value={String(followUpsDue + overdueTasks)} label="Follow-ups & tasks due" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <BarPanel title="Leads by source" rows={bySource} max={Math.max(...bySource.map((r) => r.count))} />
        <BarPanel title="Deals by stage" rows={byStage} max={Math.max(...byStage.map((r) => r.count))} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="estate-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-estate-ink mb-3 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-estate-blue" /> Upcoming site visits
          </h3>
          <div className="flex flex-col gap-2.5">
            {upcomingVisits.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="text-estate-ink font-medium truncate">{v.leadName} · {v.project}</div>
                  <div className="text-estate-slate mt-0.5">{v.when} · {v.agent}</div>
                </div>
                <StatusBadge status={v.type} />
              </div>
            ))}
            {upcomingVisits.length === 0 && <p className="text-xs text-estate-slate">No visits scheduled.</p>}
          </div>
        </div>

        <div className="estate-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-estate-ink mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-estate-red" /> Hot leads
          </h3>
          <div className="flex flex-col gap-2.5">
            {hotLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="text-estate-ink font-medium truncate">{l.name} · {l.budgetLabel}</div>
                  <div className="text-estate-slate mt-0.5">{l.preferredType} · {l.project}</div>
                </div>
                <StatusBadge status={l.stage} />
              </div>
            ))}
          </div>
        </div>

        <div className="estate-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-estate-ink mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-estate-gold" /> Follow-ups due
          </h3>
          <div className="flex flex-col gap-2.5">
            {dueFollowUps.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="text-estate-ink font-medium truncate">{l.name}</div>
                  <div className="text-estate-slate mt-0.5 truncate">{l.lastActivity}</div>
                </div>
                <span className="text-estate-red font-medium shrink-0">{l.nextFollowUp}</span>
              </div>
            ))}
            {dueFollowUps.length === 0 && <p className="text-xs text-estate-slate">All caught up.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
