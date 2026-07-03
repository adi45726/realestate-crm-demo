export const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan', 'Kabir', 'Dev',
  'Ananya', 'Diya', 'Aadhya', 'Kiara', 'Myra', 'Sara', 'Ishita', 'Priya', 'Riya', 'Meera',
  'Vikram', 'Rahul', 'Amit', 'Suresh', 'Rajesh', 'Nikhil', 'Sanjay', 'Deepak', 'Manish', 'Harsh',
  'Pooja', 'Neha', 'Kavita', 'Sunita', 'Ritu', 'Shreya', 'Divya', 'Anjali', 'Swati', 'Nisha',
] as const

export const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Kapoor', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai',
  'Singh', 'Chopra', 'Mehta', 'Shah', 'Patel', 'Joshi', 'Desai', 'Kulkarni', 'Agarwal', 'Bansal',
  'Rao', 'Naidu', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Das', 'Bose', 'Sen', 'Ghosh', 'Dutta',
] as const

export const projects = [
  { name: 'Skyline Heights', locality: 'Baner' },
  { name: 'Palm Meadows', locality: 'Whitefield' },
  { name: 'Riverfront Residences', locality: 'Kharadi' },
  { name: 'Emerald Enclave', locality: 'Gachibowli' },
  { name: 'The Grand Vista', locality: 'Powai' },
  { name: 'Lakeshore Villas', locality: 'Kompally' },
  { name: 'Orchid Business Park', locality: 'Hinjewadi' },
  { name: 'Maple Court', locality: 'Sarjapur Road' },
  { name: 'Sunstone Towers', locality: 'Wakad' },
  { name: 'Casa Verde', locality: 'Kondapur' },
] as const

export const localities = [
  'Baner', 'Whitefield', 'Kharadi', 'Gachibowli', 'Powai', 'Kompally', 'Hinjewadi',
  'Sarjapur Road', 'Wakad', 'Kondapur', 'Andheri West', 'HSR Layout',
] as const

export const propertyConfigs: Record<string, string[]> = {
  Apartment: ['1 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK'],
  Villa: ['3 BHK Villa', '4 BHK Villa', '5 BHK Villa'],
  Plot: ['1200 sqft Plot', '1800 sqft Plot', '2400 sqft Plot', '4000 sqft Plot'],
  Commercial: ['Office Suite', 'Retail Space', 'Showroom', 'Warehouse Bay'],
  Penthouse: ['4 BHK Penthouse', '5 BHK Duplex Penthouse'],
}

export const facings = ['East', 'West', 'North', 'South', 'North-East', 'South-East'] as const

export const visitOutcomes = [
  'Liked the layout, wants pricing sheet',
  'Comparing with a nearby project',
  'Asked for a revisit with family',
  'Concerned about possession timeline',
  'Very positive — requested cost sheet',
  'Wants a higher floor in the same tower',
  'Budget mismatch, exploring smaller config',
  'Loved the clubhouse and amenities',
  'Asked about loan tie-ups and EMI plans',
  'Wants corner unit availability',
] as const

export const followUpNotes = [
  'Send updated cost sheet',
  'Share floor plan PDF',
  'Confirm site visit slot',
  'Discuss payment plan options',
  'Follow up after loan approval',
  'Share possession timeline',
  'Send comparison of two units',
  'Check on token payment decision',
  'Reconfirm budget and locality',
  'Invite to weekend open house',
] as const

export const contactNotes = [
  'Prefers early-morning calls',
  'Looking to close before fiscal year end',
  'NRI buyer — coordinate over WhatsApp',
  'Repeat investor, owns two units already',
  'Referred by an existing client',
  'Wants vastu-compliant units only',
  'Selling current flat to upgrade',
  'Corporate lease requirement',
] as const

export const partnerFirms = [
  'Prime Realty Partners', 'HomeBridge Associates', 'Landmark Brokers', 'UrbanNest Realty',
  'Vertex Property Advisors', 'BlueKey Estates', 'Habitat Realty Co', 'Crestline Properties',
  'Anchor Realty Group', 'Skyward Brokerage', 'TrueNorth Realty', 'Golden Gate Associates',
  'Metro Realty Hub', 'Cornerstone Advisors', 'NestPoint Realty', 'Summit Property Partners',
  'Oakline Realtors', 'CityScape Brokers', 'Fortune Realty Desk', 'Zenith Property Mart',
  'Harbour Realty', 'Sterling Estates', 'Nova Property Advisors', 'Regal Realty Services',
] as const

export const campaignNames = [
  { name: 'Skyline Heights — Launch Blitz', channel: 'Google Ads' },
  { name: 'Palm Meadows — NRI Outreach', channel: 'Email' },
  { name: 'Festive Offer — Zero Stamp Duty', channel: 'Facebook' },
  { name: 'Riverfront — Portal Premium Slot', channel: 'Portal' },
  { name: 'Weekend Open House — Emerald Enclave', channel: 'Open House' },
  { name: 'Grand Vista — Penthouse Preview', channel: 'Facebook' },
  { name: 'Plot Investment Webinar Leads', channel: 'Google Ads' },
  { name: 'Lakeshore Villas — Retargeting', channel: 'Facebook' },
  { name: 'Orchid Business Park — B2B Drive', channel: 'Email' },
  { name: 'Maple Court — Possession Ready Push', channel: 'Portal' },
  { name: 'Sunstone — Channel Partner Meet', channel: 'Open House' },
  { name: 'Casa Verde — Monsoon Offer', channel: 'Google Ads' },
] as const

export const taskTitles = [
  'Call back portal enquiry',
  'Send cost sheet and payment plan',
  'Prepare offer letter draft',
  'Collect KYC documents',
  'Schedule revisit with family',
  'Verify token payment receipt',
  'Update unit availability sheet',
  'Coordinate with loan banker',
  'Share legal due-diligence pack',
  'Confirm agreement signing slot',
  'Follow up on price approval',
  'Book conference room for negotiation',
] as const

export const jobTitleByRole: Record<string, string[]> = {
  Director: ['Managing Director'],
  'Sales Manager': ['Sales Manager', 'Regional Sales Head', 'Pre-Sales Manager'],
  Agent: ['Sales Advisor', 'Senior Sales Advisor', 'Property Consultant', 'Closing Specialist'],
  'Channel Partner': ['Channel Partner'],
  'Admin Staff': ['CRM Executive', 'Documentation Executive', 'Front Desk Executive'],
}
