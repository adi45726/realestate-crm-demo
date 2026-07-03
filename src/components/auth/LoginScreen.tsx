import { motion } from 'motion/react'
import { Briefcase, ChevronRight, ClipboardCheck, Crown, Handshake, UserRound } from 'lucide-react'
import { Logo } from '../primitives'
import { roleUser } from '../../data/seed'
import type { Role } from '../../types'

const roles: { role: Role; icon: typeof Crown; desc: string }[] = [
  { role: 'Director', icon: Crown, desc: 'Full visibility across pipeline value, closures, campaigns, partners, and audit.' },
  { role: 'Sales Manager', icon: Briefcase, desc: 'Runs lead distribution, site visits, deal reviews, and agent performance.' },
  { role: 'Agent', icon: UserRound, desc: 'Works assigned leads, follow-ups, site visits, and deal stages.' },
  { role: 'Channel Partner', icon: Handshake, desc: 'Shares leads, tracks status sync, inventory, and attributed deals.' },
  { role: 'Admin Staff', icon: ClipboardCheck, desc: 'Manages contacts, documentation, visit schedules, and task queues.' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function LoginScreen({ onSelectRole }: { onSelectRole: (role: Role) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-3xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <Logo className="w-11 h-11" />
          <h1 className="mt-5 font-display text-3xl md:text-4xl tracking-tight text-estate-ink">
            Access the EstateFlow CRM Demo
          </h1>
          <p className="mt-3 text-estate-slate text-sm leading-[1.6] max-w-lg">
            Explore how directors, sales managers, agents, channel partners, and admin teams run
            leads, listings, site visits, deals, and closings through one platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {roles.map(({ role, icon: Icon, desc }, i) => (
            <motion.button
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              onClick={() => onSelectRole(role)}
              className={`group estate-card rounded-xl p-5 text-left hover:border-estate-gold/50 transition-colors ${
                role === 'Admin Staff' ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-estate-gold/10 border border-estate-gold/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-estate-gold" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-estate-ink">{role}</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-estate-gold group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="mt-1.5 text-xs text-estate-slate leading-[1.5]">{desc}</p>
              <p className="mt-3 text-[11px] text-white/30">Signed in as {roleUser[role]}</p>
            </motion.button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          Demo only — no real credentials required. Select a role to continue.
        </p>
      </motion.div>
    </div>
  )
}
