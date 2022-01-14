import { cabtimeType } from '@/types/cabtimeTypes'

export interface taskType {
  id: string
  info: {
    user: string
    userId: string
    'project number': string
    'cab name': string
    wo: string
  }
  type: string
  status: string
  body: {
    timeStart: number
    timeEnd: number
    timePassed: number
    completeTask: cabtimeType['body'] | null
  },
  ttl?: number
}
