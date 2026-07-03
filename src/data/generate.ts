import type {
  AuditEntry,
  Campaign,
  CampaignChannel,
  CampaignStatus,
  Contact,
  ContactType,
  CrmTask,
  Deal,
  DealStage,
  Lead,
  LeadIntent,
  LeadScore,
  LeadSource,
  LeadStage,
  MemberStatus,
  Notification,
  Partner,
  PropertyType,
  Role,
  SiteVisit,
  TaskPriority,
  TeamMember,
  Unit,
  UnitStatus,
  VisitStatus,
  VisitType,
} from '../types'
import {
  campaignNames,
  contactNotes,
  facings,
  firstNames,
  followUpNotes,
  jobTitleByRole,
  lastNames,
  localities,
  partnerFirms,
  projects,
  propertyConfigs,
  taskTitles,
  visitOutcomes,
} from './names'

/** Seeded PRNG (mulberry32) — deterministic so the dataset looks the same
 *  across reloads instead of reshuffling every visit. */
function mulberry32(seed: number) {
  let s = seed
  return function rng() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function formatTime(rng: () => number): string {
  const hour = 9 + Math.floor(rng() * 11) // 9 AM - 8 PM
  const minute = Math.floor(rng() * 4) * 15
  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
}

function dayLabel(daysOffset: number, timeStr: string): string {
  if (daysOffset === 0) return `Today, ${timeStr}`
  if (daysOffset === 1) return `Tomorrow, ${timeStr}`
  if (daysOffset === -1) return `Yesterday, ${timeStr}`
  if (daysOffset > 1) return `In ${daysOffset} days, ${timeStr}`
  return `${Math.abs(daysOffset)} days ago, ${timeStr}`
}

function makeSortTs(daysOffset: number, timeStr: string): number {
  const [time, period] = timeStr.split(' ')
  const [hh, mm] = time.split(':').map(Number)
  let hour = hh % 12
  if (period === 'PM') hour += 12
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(hour, mm, 0, 0)
  return d.getTime()
}

function formatDateOffset(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** ₹ label in Indian units: 85L, 1.25Cr */
export function inrLabel(n: number): string {
  if (n >= 1e7) {
    const cr = n / 1e7
    return `₹${cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)}Cr`
  }
  return `₹${Math.round(n / 1e5)}L`
}

const SEED = 20260703

const FIXED_TEAM: Omit<TeamMember, 'id'>[] = [
  { name: 'Aditya Chakrabarti', jobTitle: 'Managing Director', role: 'Director', phone: '9812470001', email: 'aditya@estateflow-demo.in', region: 'All Regions', status: 'Active', dealsClosed: 0, lastLogin: 'Today' },
  { name: 'Sneha Kulkarni', jobTitle: 'Sales Manager', role: 'Sales Manager', phone: '9812470002', email: 'sneha.kulkarni@estateflow-demo.in', region: 'West Zone', status: 'Active', dealsClosed: 34, lastLogin: 'Today' },
  { name: 'Rahul Menon', jobTitle: 'Senior Sales Advisor', role: 'Agent', phone: '9812470003', email: 'rahul.menon@estateflow-demo.in', region: 'East Zone', status: 'Active', dealsClosed: 21, lastLogin: 'Today' },
  { name: 'Farhan Sheikh', jobTitle: 'Channel Partner', role: 'Channel Partner', phone: '9812470004', email: 'farhan@primerealty.in', region: 'North Zone', status: 'Active', dealsClosed: 12, lastLogin: 'Today' },
  { name: 'Lakshmi Iyer', jobTitle: 'CRM Executive', role: 'Admin Staff', phone: '9812470005', email: 'lakshmi.iyer@estateflow-demo.in', region: 'Head Office', status: 'Active', dealsClosed: 0, lastLogin: 'Today' },
]

const teamRoleCycle: Role[] = ['Agent', 'Agent', 'Agent', 'Sales Manager', 'Agent', 'Channel Partner', 'Admin Staff', 'Agent']
const regions = ['West Zone', 'East Zone', 'North Zone', 'South Zone', 'Central'] as const

function generateTeam(rng: () => number, count: number): TeamMember[] {
  const team: TeamMember[] = FIXED_TEAM.map((m, i) => ({ id: `tm${i + 1}`, ...m }))
  for (let i = team.length; i < count; i++) {
    const role = teamRoleCycle[i % teamRoleCycle.length]
    const first = pick(rng, firstNames)
    const last = pick(rng, lastNames)
    const status: MemberStatus = rng() > 0.94 ? 'On leave' : 'Active'
    const lastLoginDaysAgo = Math.floor(rng() * 4)
    team.push({
      id: `tm${i + 1}`,
      name: `${first} ${last}`,
      jobTitle: pick(rng, jobTitleByRole[role]),
      role,
      phone: `9${Math.floor(100000000 + rng() * 899999999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@estateflow-demo.in`,
      region: pick(rng, regions),
      status,
      dealsClosed: Math.floor(rng() * rng() * 40),
      lastLogin: lastLoginDaysAgo === 0 ? 'Today' : lastLoginDaysAgo === 1 ? 'Yesterday' : `${lastLoginDaysAgo} days ago`,
    })
  }
  return team
}

const propertyTypes: PropertyType[] = ['Apartment', 'Apartment', 'Apartment', 'Villa', 'Plot', 'Commercial', 'Penthouse']

function priceFor(rng: () => number, type: PropertyType): number {
  switch (type) {
    case 'Apartment': return 45e5 + Math.floor(rng() * 120e5)
    case 'Villa': return 1.4e7 + Math.floor(rng() * 2.6e7)
    case 'Plot': return 30e5 + Math.floor(rng() * 90e5)
    case 'Commercial': return 80e5 + Math.floor(rng() * 3.2e7)
    case 'Penthouse': return 2.2e7 + Math.floor(rng() * 4e7)
  }
}

function generateUnits(rng: () => number, agents: TeamMember[], count: number): Unit[] {
  const units: Unit[] = []
  const towers = ['A', 'B', 'C', 'D', 'E']
  for (let i = 0; i < count; i++) {
    const project = pick(rng, projects)
    const type = pick(rng, propertyTypes)
    const config = pick(rng, propertyConfigs[type])
    const price = priceFor(rng, type)
    const s = rng()
    const status: UnitStatus = s < 0.44 ? 'available' : s < 0.58 ? 'on-hold' : s < 0.66 ? 'blocked' : s < 0.8 ? 'under-offer' : 'sold'
    const listedDaysAgo = Math.floor(rng() * 120)
    const floorNum = 1 + Math.floor(rng() * 24)
    units.push({
      id: `unit${i + 1}`,
      sortTs: makeSortTs(-listedDaysAgo, formatTime(rng)),
      code: `${project.name.split(' ')[0].slice(0, 3).toUpperCase()}-${pick(rng, towers)}${String(100 + i).slice(-3)}`,
      project: project.name,
      locality: project.locality,
      type,
      config,
      areaSqft: type === 'Plot' ? Number(config.split(' ')[0]) : 550 + Math.floor(rng() * 3200),
      price,
      priceLabel: inrLabel(price),
      status,
      facing: pick(rng, facings),
      floor: type === 'Plot' || type === 'Villa' ? '—' : `${floorNum} of ${Math.max(floorNum, 22)}`,
      agent: pick(rng, agents).name,
      listedLabel: formatDateOffset(-listedDaysAgo),
    })
  }
  return units.sort((a, b) => b.sortTs - a.sortTs)
}

const leadStagesPast: { stage: LeadStage; w: number }[] = [
  { stage: 'won', w: 0.14 },
  { stage: 'lost', w: 0.22 },
  { stage: 'negotiation', w: 0.1 },
  { stage: 'visit-scheduled', w: 0.14 },
  { stage: 'qualified', w: 0.2 },
  { stage: 'contacted', w: 0.2 },
]

function generateLeads(rng: () => number, agents: TeamMember[], count: number): Lead[] {
  const leads: Lead[] = []
  const sources: LeadSource[] = ['Portal', 'Portal', 'Website', 'Walk-in', 'Referral', 'Broker', 'Ads', 'Ads']
  const intents: LeadIntent[] = ['Buy', 'Buy', 'Buy', 'Rent', 'Invest']
  for (let i = 0; i < count; i++) {
    const createdDaysAgo = Math.floor(rng() * rng() * 90)
    const timeStr = formatTime(rng)
    const type = pick(rng, propertyTypes)
    const budget = priceFor(rng, type)
    let stage: LeadStage
    if (createdDaysAgo === 0) {
      stage = rng() < 0.7 ? 'new' : 'contacted'
    } else if (createdDaysAgo < 4) {
      const r = rng()
      stage = r < 0.25 ? 'new' : r < 0.6 ? 'contacted' : r < 0.85 ? 'qualified' : 'visit-scheduled'
    } else {
      let r = rng()
      stage = 'contacted'
      for (const { stage: st, w } of leadStagesPast) {
        if (r < w) { stage = st; break }
        r -= w
      }
    }
    const score: LeadScore =
      stage === 'negotiation' || stage === 'visit-scheduled' ? (rng() < 0.7 ? 'hot' : 'warm')
      : stage === 'qualified' ? (rng() < 0.5 ? 'warm' : 'hot')
      : stage === 'won' || stage === 'lost' ? 'cold'
      : rng() < 0.3 ? 'warm' : 'cold'
    const followUpOffset = stage === 'won' || stage === 'lost' ? 0 : Math.floor(rng() * 6) - 2
    const active = stage !== 'won' && stage !== 'lost'
    leads.push({
      id: `lead${i + 1}`,
      sortTs: makeSortTs(-createdDaysAgo, timeStr),
      name: `${pick(rng, firstNames)} ${pick(rng, lastNames)}`,
      phone: `9${Math.floor(100000000 + rng() * 899999999)}`,
      source: pick(rng, sources),
      intent: pick(rng, intents),
      budget,
      budgetLabel: inrLabel(budget),
      preferredType: type,
      project: pick(rng, projects).name,
      stage,
      score,
      assignedAgent: pick(rng, agents).name,
      nextFollowUp: active ? dayLabel(followUpOffset, formatTime(rng)) : '—',
      followUpDue: active && followUpOffset <= 0,
      lastActivity: pick(rng, followUpNotes),
      createdLabel: createdDaysAgo === 0 ? `Today, ${timeStr}` : createdDaysAgo === 1 ? `Yesterday, ${timeStr}` : `${createdDaysAgo} days ago`,
    })
  }
  return leads.sort((a, b) => b.sortTs - a.sortTs)
}

function generateContacts(rng: () => number, count: number): Contact[] {
  const contacts: Contact[] = []
  const types: ContactType[] = ['Buyer', 'Buyer', 'Buyer', 'Seller', 'Renter', 'Investor']
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * rng() * 300)
    const lastDaysAgo = Math.floor(rng() * rng() * 30)
    const first = pick(rng, firstNames)
    const last = pick(rng, lastNames)
    contacts.push({
      id: `con${i + 1}`,
      sortTs: makeSortTs(-daysAgo, formatTime(rng)),
      name: `${first} ${last}`,
      phone: `9${Math.floor(100000000 + rng() * 899999999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@mail.com`,
      type: pick(rng, types),
      locality: pick(rng, localities),
      dealsCount: Math.floor(rng() * rng() * 4),
      lastInteraction: lastDaysAgo === 0 ? 'Today' : lastDaysAgo === 1 ? 'Yesterday' : `${lastDaysAgo} days ago`,
      note: pick(rng, contactNotes),
    })
  }
  return contacts.sort((a, b) => b.sortTs - a.sortTs)
}

function generateVisits(rng: () => number, leads: Lead[], units: Unit[], agents: TeamMember[], count: number): SiteVisit[] {
  const visits: SiteVisit[] = []
  for (let i = 0; i < count; i++) {
    const daysOffset = Math.floor(rng() * 18) - 12 // 12 days past to 5 days future
    const timeStr = formatTime(rng)
    const unit = pick(rng, units)
    const lead = pick(rng, leads)
    let status: VisitStatus
    if (daysOffset >= 0) {
      status = rng() < 0.9 ? 'scheduled' : 'cancelled'
    } else {
      const r = rng()
      status = r < 0.68 ? 'completed' : r < 0.84 ? 'no-show' : 'cancelled'
    }
    const type: VisitType = rng() < 0.7 ? 'First Visit' : 'Revisit'
    visits.push({
      id: `visit${i + 1}`,
      sortTs: makeSortTs(daysOffset, timeStr),
      leadName: lead.name,
      project: unit.project,
      unitCode: unit.code,
      when: dayLabel(daysOffset, timeStr),
      agent: pick(rng, agents).name,
      type,
      status,
      outcome: status === 'completed' ? pick(rng, visitOutcomes) : status === 'no-show' ? 'Did not arrive — reschedule call planned' : status === 'cancelled' ? 'Cancelled by client' : 'Awaiting visit',
    })
  }
  return visits.sort((a, b) => b.sortTs - a.sortTs)
}

function generateDeals(rng: () => number, units: Unit[], agents: TeamMember[], partners: Partner[], count: number): Deal[] {
  const deals: Deal[] = []
  const dealable = units.filter((u) => u.status === 'under-offer' || u.status === 'sold' || u.status === 'blocked')
  for (let i = 0; i < count; i++) {
    const unit = dealable.length ? dealable[i % dealable.length] : pick(rng, units)
    const daysAgo = Math.floor(rng() * rng() * 60)
    const timeStr = formatTime(rng)
    let stage: DealStage
    if (unit.status === 'sold') {
      stage = rng() < 0.85 ? 'closed-won' : 'agreement'
    } else {
      const r = rng()
      stage = r < 0.22 ? 'offer' : r < 0.48 ? 'negotiation' : r < 0.68 ? 'token-paid' : r < 0.82 ? 'agreement' : 'lost'
    }
    const value = Math.round(unit.price * (0.94 + rng() * 0.08))
    deals.push({
      id: `deal${i + 1}`,
      sortTs: makeSortTs(-daysAgo, timeStr),
      clientName: `${pick(rng, firstNames)} ${pick(rng, lastNames)}`,
      unitCode: unit.code,
      project: unit.project,
      agent: pick(rng, agents).name,
      partner: rng() < 0.3 ? pick(rng, partners).firm : undefined,
      stage,
      value,
      valueLabel: inrLabel(value),
      expectedClose: stage === 'closed-won' ? formatDateOffset(-Math.floor(rng() * 30)) : stage === 'lost' ? '—' : formatDateOffset(5 + Math.floor(rng() * 40)),
      lastActivity: pick(rng, followUpNotes),
    })
  }
  return deals.sort((a, b) => b.sortTs - a.sortTs)
}

function generatePartners(rng: () => number): Partner[] {
  return partnerFirms.map((firm, i) => {
    const daysAgo = Math.floor(rng() * 20)
    const status = rng() > 0.85 ? 'inactive' as const : 'active' as const
    return {
      id: `pt${i + 1}`,
      sortTs: makeSortTs(-daysAgo, formatTime(rng)),
      firm,
      contactName: `${pick(rng, firstNames)} ${pick(rng, lastNames)}`,
      phone: `9${Math.floor(100000000 + rng() * 899999999)}`,
      leadsShared: 8 + Math.floor(rng() * 120),
      dealsClosed: Math.floor(rng() * 18),
      commissionRate: `${(1 + rng() * 1.5).toFixed(2)}%`,
      status,
      lastLead: status === 'active' ? (daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`) : `${20 + Math.floor(rng() * 60)} days ago`,
    }
  })
}

function generateCampaigns(rng: () => number): Campaign[] {
  return campaignNames.map((c, i) => {
    const daysAgo = Math.floor(rng() * 45)
    const leads = 40 + Math.floor(rng() * 380)
    const status: CampaignStatus = i < 5 ? 'live' : rng() < 0.4 ? 'paused' : 'completed'
    const cost = 25000 + Math.floor(rng() * 400000)
    return {
      id: `cmp${i + 1}`,
      sortTs: makeSortTs(-daysAgo, formatTime(rng)),
      name: c.name,
      channel: c.channel as CampaignChannel,
      leads,
      conversions: Math.floor(leads * (0.02 + rng() * 0.09)),
      costLabel: `₹${Math.round(cost / 1000)}K`,
      status,
      period: status === 'completed' ? `Ended ${formatDateOffset(-daysAgo)}` : `Started ${formatDateOffset(-daysAgo - 10)}`,
    }
  })
}

function generateTasks(rng: () => number, agents: TeamMember[], count: number): CrmTask[] {
  const tasks: CrmTask[] = []
  const priorities: TaskPriority[] = ['High', 'Medium', 'Medium', 'Low']
  for (let i = 0; i < count; i++) {
    const dueOffset = Math.floor(rng() * 8) - 3
    const timeStr = formatTime(rng)
    const done = rng() < 0.3
    tasks.push({
      id: `task${i + 1}`,
      sortTs: makeSortTs(dueOffset, timeStr),
      title: pick(rng, taskTitles),
      related: `${pick(rng, firstNames)} ${pick(rng, lastNames)} · ${pick(rng, projects).name}`,
      assignee: pick(rng, agents).name,
      due: dayLabel(dueOffset, timeStr),
      priority: pick(rng, priorities),
      status: done ? 'done' : dueOffset < 0 ? 'overdue' : 'open',
    })
  }
  return tasks.sort((a, b) => a.sortTs - b.sortTs)
}

function generateAuditLog(
  rng: () => number,
  leads: Lead[],
  visits: SiteVisit[],
  deals: Deal[],
  units: Unit[],
  team: TeamMember[],
  count: number,
): AuditEntry[] {
  const entries: AuditEntry[] = []
  const agents = team.filter((t) => t.role === 'Agent' || t.role === 'Sales Manager')
  const admins = team.filter((t) => t.role === 'Admin Staff')
  const managers = team.filter((t) => t.role === 'Director' || t.role === 'Sales Manager')

  const push = (module: string, action: string, status: string, sortTs: number, time: string, staffer: TeamMember) => {
    if (entries.length >= count) return
    entries.push({ id: `a${entries.length + 1}`, sortTs, time, user: staffer.name, role: staffer.role, module, action, status })
  }

  for (const l of leads) {
    if (entries.length >= count) break
    if (l.stage === 'won') push('Deals', `Converted lead — ${l.name} (${l.budgetLabel} ${l.preferredType})`, 'Won', l.sortTs, l.createdLabel, pick(rng, agents))
    else if (l.stage === 'lost') push('Leads', `Marked lead lost — ${l.name} (${l.source})`, 'Lost', l.sortTs, l.createdLabel, pick(rng, agents))
    else if (l.stage === 'qualified') push('Leads', `Qualified lead — ${l.name}, budget ${l.budgetLabel}`, 'Qualified', l.sortTs, l.createdLabel, pick(rng, agents))
  }
  for (const v of visits) {
    if (entries.length >= count) break
    if (v.status === 'completed') push('Site Visits', `Completed ${v.type.toLowerCase()} — ${v.leadName} at ${v.project}`, 'Completed', v.sortTs, v.when, pick(rng, agents))
    else if (v.status === 'no-show') push('Site Visits', `Recorded no-show — ${v.leadName} at ${v.project}`, 'No-show', v.sortTs, v.when, pick(rng, agents))
  }
  for (const d of deals) {
    if (entries.length >= count) break
    if (d.stage === 'closed-won') push('Deals', `Closed deal — ${d.clientName}, ${d.unitCode} (${d.valueLabel})`, 'Closed', d.sortTs, d.expectedClose, pick(rng, managers))
    else if (d.stage === 'token-paid') push('Deals', `Token received — ${d.clientName} for ${d.unitCode}`, 'Token paid', d.sortTs, formatDateOffset(Math.round((d.sortTs - Date.now()) / 86400000)), pick(rng, agents))
  }
  for (const u of units) {
    if (entries.length >= count) break
    if (u.status === 'on-hold') push('Inventory', `Placed unit on hold — ${u.code}, ${u.project}`, 'On hold', u.sortTs, u.listedLabel, pick(rng, agents))
    else if (u.status === 'blocked') push('Inventory', `Blocked unit — ${u.code} pending token`, 'Blocked', u.sortTs, u.listedLabel, pick(rng, admins.length ? admins : agents))
  }
  while (entries.length < count) {
    const daysAgo = Math.floor(rng() * 30)
    const timeStr = formatTime(rng)
    const staffer = pick(rng, managers)
    push('Reports', 'Exported pipeline summary report', 'Exported', makeSortTs(-daysAgo, timeStr), dayLabel(-daysAgo, timeStr), staffer)
  }
  return entries.sort((a, b) => b.sortTs - a.sortTs).slice(0, count)
}

function generateNotifications(rng: () => number, leads: Lead[], visits: SiteVisit[], deals: Deal[], count: number): Notification[] {
  const notifications: Notification[] = []
  const now = Date.now()
  const twoDays = 2 * 24 * 60 * 60 * 1000
  const recentLeads = leads.filter((l) => now - l.sortTs < twoDays)
  const upcomingVisits = visits.filter((v) => v.status === 'scheduled' && v.sortTs > now)
  const hotDeals = deals.filter((d) => d.stage === 'negotiation' || d.stage === 'token-paid')
  let i = 0
  while (notifications.length < count && i < count * 4) {
    const r = rng()
    const daysAgo = notifications.length < 6 ? 0 : 1
    const timeStr = formatTime(rng)
    if (r < 0.4 && recentLeads.length) {
      const l = pick(rng, recentLeads)
      notifications.push({ id: `n${notifications.length + 1}`, text: `New ${l.source} lead: ${l.name} — ${l.preferredType}, budget ${l.budgetLabel}`, time: dayLabel(-daysAgo, timeStr), sortTs: makeSortTs(-daysAgo, timeStr), read: rng() < 0.35, refType: 'lead', refId: l.id })
    } else if (r < 0.72 && upcomingVisits.length) {
      const v = pick(rng, upcomingVisits)
      notifications.push({ id: `n${notifications.length + 1}`, text: `Site visit ${v.when.toLowerCase()}: ${v.leadName} at ${v.project}`, time: dayLabel(-daysAgo, timeStr), sortTs: makeSortTs(-daysAgo, timeStr), read: rng() < 0.35, refType: 'visit', refId: v.id })
    } else if (hotDeals.length) {
      const d = pick(rng, hotDeals)
      notifications.push({ id: `n${notifications.length + 1}`, text: `Deal update: ${d.clientName} for ${d.unitCode} is in ${d.stage.replace('-', ' ')}`, time: dayLabel(-daysAgo, timeStr), sortTs: makeSortTs(-daysAgo, timeStr), read: rng() < 0.35, refType: 'deal', refId: d.id })
    }
    i++
  }
  return notifications.sort((a, b) => b.sortTs - a.sortTs).slice(0, count)
}

export function generateDemoData() {
  const rng = mulberry32(SEED)
  const team = generateTeam(rng, 48)
  const sellingAgents = team.filter((t) => t.role === 'Agent')
  const units = generateUnits(rng, sellingAgents, 420)
  const leads = generateLeads(rng, sellingAgents, 1400)
  const contacts = generateContacts(rng, 450)
  const visits = generateVisits(rng, leads, units, sellingAgents, 320)
  const partners = generatePartners(rng)
  const deals = generateDeals(rng, units, sellingAgents, partners, 180)
  const campaigns = generateCampaigns(rng)
  const tasks = generateTasks(rng, sellingAgents, 64)
  const auditLog = generateAuditLog(rng, leads, visits, deals, units, team, 1000)
  const notifications = generateNotifications(rng, leads, visits, deals, 18)
  return { team, units, leads, contacts, visits, partners, deals, campaigns, tasks, auditLog, notifications }
}
