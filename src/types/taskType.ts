import { cabtimeType } from '@/types/cabtimeTypes'

export type taskType = {
  id: string
  info: {
    user: string
    userId: string
    'project number': string
    'cab name': string
    wo: string
  }
  timeStart?: number
  type: string
  version: number
  status: 'active' | 'completed'
  body: {
    timeStart: number
    timeEnd: number
    timePassed: number
    completeTask: cabtimeType['body'] | null
  }
  ttl?: number
}
