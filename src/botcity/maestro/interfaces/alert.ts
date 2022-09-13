export interface Alert {
  id: string
  organizationId: string
  taskId: number
  activityName: string
  botId?: string
  title: string
  message: string
  type: string
  date: string
}
