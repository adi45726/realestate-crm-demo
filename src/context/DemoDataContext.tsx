import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  initialAuditLog,
  initialCampaigns,
  initialContacts,
  initialDeals,
  initialLeads,
  initialNotifications,
  initialPartners,
  initialTasks,
  initialTeam,
  initialUnits,
  initialVisits,
  roleUser,
} from '../data/seed'
import type {
  AuditEntry,
  Campaign,
  Contact,
  CrmTask,
  Deal,
  DealStage,
  Lead,
  LeadStage,
  Notification,
  Partner,
  Role,
  SiteVisit,
  TeamMember,
  Unit,
  UnitStatus,
  VisitStatus,
} from '../types'

function nowLabel(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

interface DemoData {
  team: TeamMember[]
  units: Unit[]
  leads: Lead[]
  contacts: Contact[]
  visits: SiteVisit[]
  partners: Partner[]
  deals: Deal[]
  campaigns: Campaign[]
  tasks: CrmTask[]
  auditLog: AuditEntry[]
  notifications: Notification[]
  advanceLeadStage: (id: string, stage: LeadStage, role: Role) => void
  recordVisitOutcome: (id: string, status: VisitStatus, role: Role) => void
  advanceDealStage: (id: string, stage: DealStage, role: Role) => void
  setUnitStatus: (id: string, status: UnitStatus, role: Role) => void
  completeTask: (id: string, role: Role) => void
  exportReport: (role: Role) => void
  markNotificationRead: (id: string) => void
}

const DemoDataContext = createContext<DemoData | null>(null)

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [visits, setVisits] = useState<SiteVisit[]>(initialVisits)
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [units, setUnits] = useState<Unit[]>(initialUnits)
  const [tasks, setTasks] = useState<CrmTask[]>(initialTasks)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(initialAuditLog)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  function logAction(role: Role, module: string, action: string, status: string) {
    const entry: AuditEntry = {
      id: `a${Date.now()}`,
      time: nowLabel(),
      sortTs: Date.now(),
      user: roleUser[role],
      role,
      module,
      action,
      status,
    }
    setAuditLog((prev) => [entry, ...prev])
  }

  function advanceLeadStage(id: string, stage: LeadStage, role: Role) {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage, followUpDue: false } : l)))
    logAction(role, 'Leads', `Updated lead stage — ${lead.name} (${lead.source}, ${lead.budgetLabel})`, stage.replace('-', ' '))
  }

  function recordVisitOutcome(id: string, status: VisitStatus, role: Role) {
    const visit = visits.find((v) => v.id === id)
    if (!visit) return
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
    logAction(role, 'Site Visits', `Recorded visit outcome — ${visit.leadName} at ${visit.project}`, status)
  }

  function advanceDealStage(id: string, stage: DealStage, role: Role) {
    const deal = deals.find((d) => d.id === id)
    if (!deal) return
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)))
    if (stage === 'closed-won') {
      setUnits((prev) => prev.map((u) => (u.code === deal.unitCode ? { ...u, status: 'sold' } : u)))
    }
    logAction(role, 'Deals', `Updated deal stage — ${deal.clientName}, ${deal.unitCode} (${deal.valueLabel})`, stage.replace('-', ' '))
  }

  function setUnitStatus(id: string, status: UnitStatus, role: Role) {
    const unit = units.find((u) => u.id === id)
    if (!unit) return
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)))
    logAction(role, 'Inventory', `Updated unit status — ${unit.code}, ${unit.project}`, status.replace('-', ' '))
  }

  function completeTask(id: string, role: Role) {
    const task = tasks.find((t) => t.id === id)
    if (!task || task.status === 'done') return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)))
    logAction(role, 'Tasks', `Completed task — ${task.title} (${task.related})`, 'Done')
  }

  function exportReport(role: Role) {
    logAction(role, 'Reports', 'Exported pipeline summary report', 'Exported')
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const value = useMemo(
    () => ({
      team: initialTeam,
      units,
      leads,
      contacts: initialContacts,
      visits,
      partners: initialPartners,
      deals,
      campaigns: initialCampaigns,
      tasks,
      auditLog,
      notifications,
      advanceLeadStage,
      recordVisitOutcome,
      advanceDealStage,
      setUnitStatus,
      completeTask,
      exportReport,
      markNotificationRead,
    }),
    [leads, visits, deals, units, tasks, auditLog, notifications],
  )

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext)
  if (!ctx) throw new Error('useDemoData must be used within DemoDataProvider')
  return ctx
}
