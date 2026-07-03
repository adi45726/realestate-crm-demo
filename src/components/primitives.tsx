import { useMemo, useState, type ReactNode } from 'react'
import { Building2, ChevronRight, Search } from 'lucide-react'

export function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-[0.9rem] bg-gradient-to-br from-estate-gold to-estate-goldDeep flex items-center justify-center shrink-0 shadow-estate`}
    >
      <Building2 className="w-1/2 h-1/2 text-[#181206]" strokeWidth={2.5} />
    </div>
  )
}

export function PrimaryButton({
  label,
  href,
  onClick,
}: {
  label: string
  href?: string
  onClick?: () => void
}) {
  const className =
    'group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-estate-gold to-estate-goldDeep text-[#181206] font-semibold text-sm px-5 py-3 transition-all hover:-translate-y-px active:scale-[0.98] shadow-estate-glow'
  const content = (
    <>
      {label}
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
    </>
  )
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    )
  }
  return (
    <a href={href} className={className}>
      {content}
    </a>
  )
}

export function SecondaryButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-estate-border bg-white/[0.02] text-estate-ink font-medium text-sm px-5 py-3 hover:bg-white/5 hover:-translate-y-px transition-all"
    >
      {label}
    </a>
  )
}

export function Eyebrow({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-estate-goldLight bg-estate-gold/[0.08] border border-estate-gold/25 px-3 py-1.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-estate-gold" />
      {label}
    </span>
  )
}

/** Semantic color tone for statuses across leads, visits, deals, units, and tasks. */
export type Tone = 'red' | 'gold' | 'green' | 'blue' | 'purple' | 'slate'

const toneClasses: Record<Tone, { badge: string; bar: string; icon: string }> = {
  red: { badge: 'bg-estate-red/15 text-estate-red', bar: 'bg-estate-red', icon: 'bg-estate-red/15 text-estate-red' },
  gold: { badge: 'bg-estate-gold/15 text-estate-gold', bar: 'bg-estate-gold', icon: 'bg-estate-gold/15 text-estate-gold' },
  green: { badge: 'bg-estate-green/15 text-estate-green', bar: 'bg-estate-green', icon: 'bg-estate-green/15 text-estate-green' },
  blue: { badge: 'bg-estate-blue/15 text-estate-blue', bar: 'bg-estate-blue', icon: 'bg-estate-blue/15 text-estate-blue' },
  purple: { badge: 'bg-estate-purple/15 text-estate-purple', bar: 'bg-estate-purple', icon: 'bg-estate-purple/15 text-estate-purple' },
  slate: { badge: 'bg-white/[0.06] text-estate-slate', bar: 'bg-white/20', icon: 'bg-white/[0.06] text-estate-slate' },
}

/**
 * Keyword matching for status strings. Order matters — red first, green last.
 * Every keyword was checked against every other status word in this app for
 * accidental substring collisions (e.g. 'token-paid' must hit purple before
 * 'paid' could hit green, and 'closed-won' must not match a red keyword).
 */
export function toneFor(status: string): Tone {
  const s = status.toLowerCase()
  if (['lost', 'no-show', 'cancel', 'overdue', 'blocked', 'inactive', 'hot', 'high'].some((k) => s.includes(k))) return 'red'
  if (['new', 'hold', 'negotiation', 'offer', 'warm', 'paused', 'open', 'medium'].some((k) => s.includes(k))) return 'gold'
  if (['token'].some((k) => s.includes(k))) return 'purple'
  if (['scheduled', 'qualified', 'agreement', 'contacted', 'sold', 'revisit', 'seller', 'investor'].some((k) => s.includes(k))) return 'blue'
  if (['won', 'completed', 'available', 'active', 'done', 'live', 'paid', 'buyer'].some((k) => s.includes(k))) return 'green'
  return 'slate'
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = toneClasses[toneFor(status)]
  return (
    <span className={`text-[11px] font-medium px-2 py-1 rounded-full shrink-0 capitalize ${tone.badge}`}>
      {label ?? status.replace('-', ' ')}
    </span>
  )
}

export function toneClassesFor(status: string) {
  return toneClasses[toneFor(status)]
}

/** Use when you already have a concrete Tone (not a status string to keyword-match). */
export function toneClassesForTone(tone: Tone) {
  return toneClasses[tone]
}

// ---------------------------------------------------------------------------
// Shared list scaffolding for dashboard tabs
// ---------------------------------------------------------------------------

const PAGE_SIZE = 25

/** Search + optional status filter + paging over a dataset. */
export function useListControls<T>(items: T[], matches: (item: T, query: string, filter: string) => boolean) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () => items.filter((item) => matches(item, query.toLowerCase(), filter)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, query, filter],
  )

  return {
    query,
    setQuery: (q: string) => { setQuery(q); setVisibleCount(PAGE_SIZE) },
    filter,
    setFilter: (f: string) => { setFilter(f); setVisibleCount(PAGE_SIZE) },
    filtered,
    visible: filtered.slice(0, visibleCount),
    hasMore: visibleCount < filtered.length,
    showMore: () => setVisibleCount((v) => v + PAGE_SIZE),
    moreCount: Math.min(PAGE_SIZE, filtered.length - visibleCount),
  }
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="w-3.5 h-3.5 text-estate-slate absolute left-2.5 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-estate-border bg-transparent text-estate-ink outline-none focus:border-estate-gold w-44"
      />
    </div>
  )
}

export function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs rounded-lg border border-estate-border bg-estate-panel text-estate-ink px-2 py-1.5 outline-none focus:border-estate-gold"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function ListCard({
  title,
  subtitle,
  controls,
  children,
  hasMore,
  moreCount,
  onMore,
  empty,
  isEmpty,
}: {
  title: string
  subtitle: string
  controls?: ReactNode
  children: ReactNode
  hasMore?: boolean
  moreCount?: number
  onMore?: () => void
  empty?: string
  isEmpty?: boolean
}) {
  return (
    <div className="estate-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-estate-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-estate-ink">{title}</h2>
          <p className="text-xs text-estate-slate mt-0.5">{subtitle}</p>
        </div>
        {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
      </div>
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {isEmpty && <div className="px-5 py-8 text-center text-sm text-estate-slate">{empty ?? 'Nothing matches your filters.'}</div>}
        {children}
      </div>
      {hasMore && onMore && (
        <div className="px-5 py-3 border-t border-estate-border text-center">
          <button onClick={onMore} className="text-xs font-medium text-estate-gold hover:underline">
            Show {moreCount} more
          </button>
        </div>
      )}
    </div>
  )
}

/** Small inline action button used on list rows. */
export function RowAction({ label, onClick, tone = 'gold' }: { label: string; onClick: () => void; tone?: 'gold' | 'slate' }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium rounded-lg px-2.5 py-1.5 shrink-0 border transition-colors ${
        tone === 'gold'
          ? 'text-estate-gold border-estate-gold/30 hover:bg-estate-gold/10'
          : 'text-estate-slate border-estate-border hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}
