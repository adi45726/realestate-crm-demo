import { useState } from 'react'
import { ChevronLeft, ChevronRight, Menu, Search, User, X } from 'lucide-react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4'

const navLinks = ['Listings', 'Agents', 'Site Visits', 'Deals', 'Insights']

export function Landing({ onLaunchDemo }: { onLaunchDemo: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="hero-video-frame relative flex h-screen w-full flex-col overflow-hidden bg-black text-white">
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero-blur-mask fixed inset-0 z-[1] pointer-events-none backdrop-blur-xl" />

      {/* Navbar */}
      <div className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <div className="flex h-8 items-center md:h-10">
          <span
            className="animate-blur-fade-up text-lg font-bold tracking-wide md:text-xl"
            style={{ animationDelay: '0ms' }}
          >
            ESTATEFLOW
          </span>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className="animate-blur-fade-up text-sm transition-colors hover:text-gray-300"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="liquid-glass animate-blur-fade-up hidden items-center gap-2 rounded-full px-4 py-2 text-sm sm:flex md:px-6"
            style={{ animationDelay: '350ms' }}
          >
            <Search size={18} />
            Search
          </button>
          <button
            className="liquid-glass animate-blur-fade-up hidden h-10 w-10 items-center justify-center rounded-full sm:flex"
            style={{ animationDelay: '400ms' }}
            aria-label="Profile"
          >
            <User size={18} />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="liquid-glass animate-blur-fade-up relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            style={{ animationDelay: '350ms' }}
            aria-label="Toggle menu"
          >
            <Menu
              size={18}
              className={`absolute transition-all duration-500 ease-out ${
                menuOpen ? 'rotate-180 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={18}
              className={`absolute transition-all duration-500 ease-out ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-50 opacity-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 right-0 top-[72px] z-40 border-b border-t border-gray-800 bg-gray-900/95 shadow-2xl backdrop-blur-lg transition-all duration-500 ease-out lg:hidden ${
          menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-col px-4 py-3">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`rounded-lg px-3 py-3 transition-all duration-500 ease-out hover:bg-gray-800/50 ${
                menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-gray-800 px-4 py-4 sm:hidden">
          <button className="liquid-glass flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm">
            <Search size={18} />
            Search
          </button>
          <button className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full" aria-label="Profile">
            <User size={18} />
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-8 sm:px-6 md:px-12 md:pb-16">
        <div className="flex flex-col items-end gap-8 md:flex-row">
          <div className="flex-1">
            <h1
              className="animate-blur-fade-up mb-4 text-3xl font-normal sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
              style={{ letterSpacing: '-0.04em', animationDelay: '400ms' }}
            >
              From First Lead To Final Closing.
            </h1>

            <p
              className="animate-blur-fade-up mb-6 max-w-2xl text-base text-gray-400 sm:text-lg md:mb-12 md:text-xl"
              style={{ animationDelay: '500ms' }}
            >
              Track leads from portals, brokers, and your website, then move them through
              site visits, offers, and closings — all with full team visibility.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={onLaunchDemo}
                className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-medium text-black transition-colors hover:bg-gray-200 sm:px-8 sm:py-3"
                style={{ animationDelay: '600ms' }}
              >
                View Live Demo
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 md:w-auto">
            <button
              className="liquid-glass animate-blur-fade-up flex items-center justify-center rounded-full px-4 py-2.5 sm:px-6 sm:py-3"
              style={{ animationDelay: '800ms' }}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="liquid-glass animate-blur-fade-up flex items-center justify-center rounded-full px-4 py-2.5 sm:px-6 sm:py-3"
              style={{ animationDelay: '900ms' }}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
