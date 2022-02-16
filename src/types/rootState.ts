import { userType, azureAuth } from '@/types/userType'
import { templateType } from '@/types/templateType'
import { projectInfoType } from '@/types/projectInfoType'
import { cabinetsType } from '@/types/cabinetsType'
import { cabtimeType } from '@/types/cabtimeTypes'
import { errorType } from '@/types/errorType'
import { taskType } from '@/types/taskType'
import { cabinetInfo } from '@/types/cabinetsType'
import { projectType } from '@/types/projectType'

type assign = projectInfoType & { wo: string, 'cab name': string, 'project number'?: string }
type cabItems = Array<cabinetInfo | errorType | cabtimeType | taskType>

type cabinets = {
    info: {
        "cab name": string
        id?: string
        "project number": string
        "Project Name": string
        status: string
        "status project": string
        wo: string
    }
}

export type rootState = {
    openCabinets: cabinets[]
    projects: projectType[] | null
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

export const state = {
    openCabinets: <cabinets[]>{},
    projects: null,
    cabinetInfo: null,
    activeErrors: [],
    taskResult: {},
    photosToUpload: new FormData(),
    photosToDelete: [],
    photoContainer: '',
    compressBlob: [],
    loader: false,
    template: <templateType>{},
    projectList: null,
    selectedProjectNumber: '',
    projectInfo: <assign>{},
    user: <userType>{},
    userTask: null,
    currentError: null,
    cabinetItems: null,
    cabinets: [],
    passedTime: 0,
    cabtimeWithStatus: [],
    allSumm: 0,
}