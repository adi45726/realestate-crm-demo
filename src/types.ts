export type Role = 'Director' | 'Sales Manager' | 'Agent' | 'Channel Partner' | 'Admin Staff'

export type MemberStatus = 'Active' | 'On leave'

export interface TeamMember {
  id: string
  name: string
  jobTitle: string
  role: Role
  phone: string
  email: string
  region: string
  status: MemberStatus
  dealsClosed: number
  lastLogin: string
}

export type LeadSource = 'Portal' | 'Website' | 'Walk-in' | 'Referral' | 'Broker' | 'Ads'
export type LeadIntent = 'Buy' | 'Rent' | 'Invest'
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'visit-scheduled' | 'negotiation' | 'won' | 'lost'
export type LeadScore = 'hot' | 'warm' | 'cold'

export interface Lead {
  id: string
  sortTs: number
  name: string
  phone: string
  source: LeadSource
  intent: LeadIntent
  budgetLabel: string
  budget: number
  preferredType: PropertyType
  project: string
  stage: LeadStage
  score: LeadScore
  assignedAgent: string
  nextFollowUp: string
  followUpDue: boolean
  lastActivity: string
  createdLabel: string
}

export type ContactType = 'Buyer' | 'Seller' | 'Renter' | 'Investor'

export interface Contact {
  id: string
  sortTs: number
  name: string
  phone: string
  email: string
  type: ContactType
  locality: string
  dealsCount: number
  lastInteraction: string
  note: string
}

export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Penthouse'
export type UnitStatus = 'available' | 'on-hold' | 'blocked' | 'under-offer' | 'sold'

export interface Unit {
  id: string
  sortTs: number
  code: string
  project: string
  locality: string
  type: PropertyType
  config: string
  areaSqft: number
  price: number
  priceLabel: string
  status: UnitStatus
  facing: string
  floor: string
  agent: string
  listedLabel: string
}

export type VisitType = 'First Visit' | 'Revisit'
export type VisitStatus = 'scheduled' | 'completed' | 'no-show' | 'cancelled'

export interface SiteVisit {
  id: string
  sortTs: number
  leadName: string
  project: string
  unitCode: string
  when: string
  agent: string
  type: VisitType
  status: VisitStatus
  outcome: string
}

export type DealStage = 'offer' | 'negotiation' | 'token-paid' | 'agreement' | 'closed-won' | 'lost'

export interface Deal {
  id: string
  sortTs: number
  clientName: string
  unitCode: string
  project: string
  agent: string
  partner?: string
  stage: DealStage
  value: number
  valueLabel: string
  expectedClose: string
  lastActivity: string
}

export type PartnerStatus = 'active' | 'inactive'

export interface Partner {
  id: string
  sortTs: number
  firm: string
  contactName: string
  phone: string
  leadsShared: number
  dealsClosed: number
  commissionRate: string
  status: PartnerStatus
  lastLead: string
}

export type CampaignChannel = 'Google Ads' | 'Facebook' | 'Portal' | 'Email' | 'Open House'
export type CampaignStatus = 'live' | 'paused' | 'completed'

export interface Campaign {
  id: string
  sortTs: number
  name: string
  channel: CampaignChannel
  leads: number
  conversions: number
  costLabel: string
  status: CampaignStatus
  period: string
}

export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'open' | 'overdue' | 'done'

export interface CrmTask {
  id: string
  sortTs: number
  title: string
  related: string
  assignee: string
  due: string
  priority: TaskPriority
  status: TaskStatus
}

export interface AuditEntry {
  id: string
  sortTs: number
  time: string
  user: string
  role: Role
  module: string
  action: string
  status: string
}

export interface Notification {
  id: string
  sortTs: number
  text: string
  time: string
  read: boolean
  refType?: 'lead' | 'visit' | 'deal' | 'unit' | 'task'
  refId?: string
}
