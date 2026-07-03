import { Building2, MapPin, Tags } from 'lucide-react'
import { useDemoData } from '../../context/DemoDataContext'
import { localities, projects } from '../../data/names'

const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Penthouse']

export function Settings() {
  const { units } = useDemoData()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-estate-ink">Settings</h2>
        <p className="text-xs text-estate-slate mt-0.5">Projects, localities, and property type configuration.</p>
      </div>

      <div className="estate-card rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-estate-ink mb-3">
          <Building2 className="w-4 h-4 text-estate-gold" />
          Projects
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {projects.map((p) => (
            <div key={p.name} className="rounded-lg border border-estate-border bg-white/[0.02] px-3 py-2.5">
              <div className="text-sm text-estate-ink">{p.name}</div>
              <div className="text-xs text-estate-slate mt-0.5">{p.locality} · {units.filter((u) => u.project === p.name).length} units</div>
            </div>
          ))}
        </div>
      </div>

      <div className="estate-card rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-estate-ink mb-3">
          <Tags className="w-4 h-4 text-estate-gold" />
          Property types
        </div>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => (
            <span key={t} className="text-xs text-estate-ink border border-estate-border bg-white/[0.02] rounded-full px-3 py-1.5">{t}</span>
          ))}
        </div>
      </div>

      <div className="estate-card rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-estate-ink mb-3">
          <MapPin className="w-4 h-4 text-estate-gold" />
          Localities covered
        </div>
        <div className="flex flex-wrap gap-2">
          {localities.map((l) => (
            <span key={l} className="text-xs text-estate-ink border border-estate-border bg-white/[0.02] rounded-full px-3 py-1.5">{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
