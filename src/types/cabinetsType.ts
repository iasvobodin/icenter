import { cabtimeType } from '@/types/cabtimeTypes'
import { errorType } from '@/types/errorType'

export interface cabinetsType {
    id: string
    status: string
    info: {
        wo: string
        "cab name": string
        "project number": string
        "project name": string
        "project status": string
    }
    extend: {}
    stats: {
        cabTime: cabtimeType
        time: number
        errors:errorType[]
    }
}