import { userType, azureAuth } from '@/types/userType'
import { templateType } from '@/types/templateType'
import { projectInfoType, projectType } from '@/types/projectInfoType'
import { cabinetsType } from '@/types/cabinetsType'
import { cabtimeType } from '@/types/cabtimeTypes'
import { errorType } from '@/types/errorType'
import { taskType } from '@/types/taskType'
import { cabinetInfo } from '@/types/cabinetsType'

type assign = projectInfoType & { wo: string, 'cab name': string, 'project number'?: string }
type cabItems = Array<cabinetInfo | errorType | cabtimeType | taskType>

type cabinets = {
    info: {
        "cab name": string
        id: string
        "project number": string
        "Project Name": string
        status: string
        "status project": string
        wo: string
    }
}

export type rootState = {
    activeErrors: errorType[]
    loader: false
    template: templateType
    projectList: null
    selectedProjectNumber: string
    projectInfo: assign
    user: userType
    cabinetInfo: cabinets | null
    userTask: taskType | null
    cabinets: cabinets[]
    currentError: null
    cabinetItems: cabItems | null
    passedTime: number
    cabtimeWithStatus: cabtimeType['body']
    allSumm: number
    photosToUpload: FormData
    compressBlob: Blob[]
    photosToDelete: string[]
    photoContainer: string
    taskResult: { [index: string]: number }
}