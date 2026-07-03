import { useState } from 'react'
import { Landing } from './components/Landing'
import { LoginScreen } from './components/auth/LoginScreen'
import { DashboardShell } from './components/dashboard/DashboardShell'
import { DemoDataProvider } from './context/DemoDataContext'
import type { Role } from './types'

type View = 'landing' | 'login' | 'dashboard'

function AppShell() {
  const [view, setView] = useState<View>('landing')
  const [role, setRole] = useState<Role | null>(null)

  if (view === 'login') {
    return (
      <LoginScreen
        onSelectRole={(selected) => {
          setRole(selected)
          setView('dashboard')
        }}
      />
    )
  }

  if (view === 'dashboard' && role) {
    return (
      <DashboardShell
        role={role}
        onSwitchRole={() => setView('login')}
        onExit={() => {
          setView('landing')
          setRole(null)
        }}
      />
    )
  }

  return <Landing onLaunchDemo={() => setView('login')} />
}

export default function App() {
  return (
    <DemoDataProvider>
      <AppShell />
    </DemoDataProvider>
  )
}
