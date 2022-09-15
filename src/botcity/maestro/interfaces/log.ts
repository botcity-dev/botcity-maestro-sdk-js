// TODO: Change in next version

import { Column } from '../columns'

// TODO: Verify in next version
export interface Logs {
  id: number
  label: string // TODO
  name: string
  icon: string // TODO: Search type
  description: string
  agentId: string // TODO: Search type
  organizationLabel: string
  humanTimePerItem: number
  parameters: Object[]
  machines: string[]
  cron: string // TODO: Transform in date?
  scheduleStrategy: string
  technology: string
  notification: Object[] // TODO: Searh type
  status?: string
  user?: string[]
  notificationType: string[]
}

export interface Log {
  id: string
  organizationLabel: string
  activityLabel: string
  columns: Column[]
}

export interface DataLog {
  columns: Column[]
  dateCreation: string
}
