export interface Task {
  id: number
  state: string
  parameters: object
  activityId: number
  agentId: string
  userCreationName: string
  organizationCreationId: number
  dateCreation: string // TODO: Transform in date
  dateLastModified: string // TODO: Transform in date
  finishStatus?: string
  finishMessage?: string
  test: boolean
  activityLabel?: string
}

// TODO: Implement endpoint getTasks
