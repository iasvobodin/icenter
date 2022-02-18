import { cabtimeType } from '@/types/cabtimeTypes'

export type taskType = {
  id: string
  info: {
    user: string
    userId: string
    'project number': string
    Шкаф: string
    wo: string
  }
  timeStart?: number
  type: 'task'
  version: number
  status: 'active' | 'completed'
  body: {
    timeStart: number
    timeEnd: number
    timePassed: number
    completeTask: cabtimeType['body'] | null
    timeStartUTC: string
  }
  ttl?: number
}
