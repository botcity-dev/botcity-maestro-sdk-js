export interface Task {
  id: number
  state: string
  parameters: object
  activityId: number
  userEmail: string | null
  agentId: string
  userCreationName: string
  organizationLabel: string | null
  organizationCreationId: number
  dateCreation: string // TODO: Transform in date
  dateLastModified: string // TODO: Transform in date
  finishStatus?: string
  finishMessage?: string
  test: boolean
  interrupted: boolean | null
  machineId: string | number | null
  activityLabel?: string
  minExecutionDate: string | Date
  killed: boolean | null
  dateStartRunning: string | Date
  priority: number | null
  repositoryLabel: string
  processedItems: number | null
  failedItems: number | null
  totalItems: number | null
}

// TODO: Implement endpoint getTasks
