import { cabtimeType } from '@/types/cabtimeTypes'
import { errorType } from '@/types/errorType'


export type cabinetInfo = {
  "id": string,
  "type": 'info',
  "info": {
    "wo": string,
    "cab name": string,
    "project number": string,
    "Project Name": string,
    "status": string
  },
  "ttl"?: number
}
export interface cabinetsType {
  // id: string
  // status: string
  info: {
    wo: string
    status: string
    'cab name': string
    'project number': string
    'Project Name': string
    'status project': string
    id: string
  }
  // extend: Record<string, unknown>
  // stats: {
  //   cabTime: cabtimeType
  //   time: number
  //   errors: errorType[]
  // }
}
