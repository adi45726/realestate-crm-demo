import { useState } from 'react'
import {
  Bell,
  Building,
  CalendarClock,
  ClipboardList,
  Contact as ContactIcon,
  FileBarChart,
  Handshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Repeat,
  Settings as SettingsIcon,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from 'lucide-react'
import { Logo } from '../primitives'
import { roleTabs, roleUser } from '../../data/seed'
import { useDemoData } from '../../context/DemoDataContext'
import type { Role } from '../../types'
import { Overview } from './Overview'
import { Leads } from './Leads'
import { Contacts } from './Contacts'
import { Listings } from './Listings'
import { SiteVisits } from './SiteVisits'
import { Deals } from './Deals'
import { Agents } from './Agents'
import { Partners } from './Partners'
import { Campaigns } from './Campaigns'
import { Tasks } from './Tasks'
import { Reports } from './Reports'
import { AuditLogTab } from './AuditLog'
import { Settings } from './Settings'

const roleAccent: Record<Role, string> = {
  Director: 'bg-estate-purple/15 text-estate-purple',
  'Sales Manager': 'bg-estate-blue/15 text-estate-blue',
  Agent: 'bg-estate-gold/15 text-estate-gold',
  'Channel Partner': 'bg-estate-green/15 text-estate-green',
  'Admin Staff': 'bg-pink-500/15 text-pink-400',
}

const tabMeta: Record<string, { label: string; icon: typeof LayoutDashboard }> = {
  overview: { label: 'Overview', icon: LayoutDashboard },
  leads: { label: 'Leads', icon: Target },
  contacts: { label: 'Contacts', icon: ContactIcon },
  listings: { label: 'Listings', icon: Building },
  siteVisits: { label: 'Site Visits', icon: CalendarClock },
  deals: { label: 'Deals', icon: Handshake },
  agents: { label: 'Agents', icon: Users },
  partners: { label: 'Partners', icon: UserRound },
  campaigns: { label: 'Campaigns', icon: Megaphone },
  tasks: { label: 'Tasks', icon: ClipboardList },
  reports: { label: 'Reports', icon: FileBarChart },
  auditLog: { label: 'Audit Log', icon: ShieldCheck },
  settings: { label: 'Settings', icon: SettingsIcon },
}

export function DashboardShell({
  role,
  onSwitchRole,
  onExit,
}: {
  role: Role
  onSwitchRole: () => void
  onExit: () => void
}) {
  const tabs = roleTabs[role]
  const [active, setActive] = useState(tabs[0])
  const [showNotifs, setShowNotifs] = useState(false)
  const { notifications, markNotificationRead } = useDemoData()
  const unreadCount = notifications.filter((n) => !n.read).length

  function handleNotificationClick(n: (typeof notifications)[number]) {
    markNotificationRead(n.id)
    const target =
      n.refType === 'lead' ? 'leads' :
      n.refType === 'visit' ? 'siteVisits' :
      n.refType === 'deal' ? 'deals' :
      n.refType === 'unit' ? 'listings' :
      n.refType === 'task' ? 'tasks' : null
    if (target && tabs.includes(target)) setActive(target)
    setShowNotifs(false)
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="bg-[#0c1018]/75 backdrop-blur-xl border-b border-estate-border sticky top-0 z-20">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            <span className="text-base font-bold text-estate-ink">EstateFlow CRM</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifs((v) => !v)}
                className="relative w-9 h-9 rounded-lg border border-estate-border flex items-center justify-center hover:bg-white/5"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-estate-slate" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-estate-red text-white text-[9px] font-semibold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-72 estate-card rounded-xl p-3 shadow-lg z-30 max-h-96 overflow-y-auto">
                  <div className="text-xs font-semibold text-estate-ink mb-2 px-1">Notifications</div>
                  <div className="flex flex-col gap-1">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`text-left px-2 py-2 rounded-lg hover:bg-white/5 ${!n.read ? 'bg-estate-gold/5' : ''}`}
                      >
                        <div className="flex items-start gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-estate-gold mt-1 shrink-0" />}
                          <div className={`text-xs ${n.read ? 'text-estate-slate' : 'text-estate-ink font-medium'}`}>{n.text}</div>
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5 pl-3">{n.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs font-semibold text-estate-ink">{roleUser[role]}</span>
              <span className={`text-[11px] font-medium px-1.5 rounded ${roleAccent[role]}`}>{role}</span>
            </div>

            <button
              onClick={onSwitchRole}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-estate-slate border border-estate-border rounded-lg px-3 py-2 hover:bg-white/5"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch role</span>
            </button>
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#181206] bg-gradient-to-br from-estate-gold to-estate-goldDeep rounded-lg px-3 py-2 hover:brightness-110"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const meta = tabMeta[tab]
            const Icon = meta.icon
            const isActive = active === tab
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-estate-gold text-estate-ink'
                    : 'border-transparent text-estate-slate hover:text-estate-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {active === 'overview' && <Overview role={role} />}
        {active === 'leads' && <Leads role={role} />}
        {active === 'contacts' && <Contacts />}
        {active === 'listings' && <Listings role={role} />}
        {active === 'siteVisits' && <SiteVisits role={role} />}
        {active === 'deals' && <Deals role={role} />}
        {active === 'agents' && <Agents />}
        {active === 'partners' && <Partners />}
        {active === 'campaigns' && <Campaigns />}
        {active === 'tasks' && <Tasks role={role} />}
        {active === 'reports' && <Reports role={role} />}
        {active === 'auditLog' && <AuditLogTab />}
        {active === 'settings' && <Settings />}
      </div>
    </div>
  )
}
