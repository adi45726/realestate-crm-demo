import type { Role } from '../types'
import { generateDemoData } from './generate'

export { inrLabel } from './generate'

// Fixed login identities for the 5 role cards on the login screen — kept
// stable and separate from the generated team roster below.
export const roleUser: Record<Role, string> = {
  Director: 'Aditya Chakrabarti',
  'Sales Manager': 'Sneha Kulkarni',
  Agent: 'Rahul Menon',
  'Channel Partner': 'Farhan Sheikh',
  'Admin Staff': 'Lakshmi Iyer',
}

export const roleTabs: Record<Role, string[]> = {
  Director: ['overview', 'leads', 'listings', 'deals', 'agents', 'partners', 'campaigns', 'reports', 'auditLog', 'settings'],
  'Sales Manager': ['overview', 'leads', 'contacts', 'listings', 'siteVisits', 'deals', 'agents', 'tasks', 'reports'],
  Agent: ['overview', 'leads', 'contacts', 'siteVisits', 'deals', 'tasks'],
  'Channel Partner': ['overview', 'leads', 'listings', 'deals'],
  'Admin Staff': ['overview', 'contacts', 'listings', 'siteVisits', 'tasks', 'auditLog'],
}

// A large, realistic, time-spread demo dataset — generated once per session
// with a fixed seed so it's varied but stable across reloads.
const demo = generateDemoData()

export const initialTeam = demo.team
export const initialUnits = demo.units
export const initialLeads = demo.leads
export const initialContacts = demo.contacts
export const initialVisits = demo.visits
export const initialPartners = demo.partners
export const initialDeals = demo.deals
export const initialCampaigns = demo.campaigns
export const initialTasks = demo.tasks
export const initialAuditLog = demo.auditLog
export const initialNotifications = demo.notifications
