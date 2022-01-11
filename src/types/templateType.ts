import { cabtimeType } from './cabtimeTypes'

export type Extend = {
  _field?: string
  name: string
  value: string | string[]
  min?: number
  max?: number
  type?: string
  status: 'open' | 'confirmed' | 'closed'
}

export interface templateBodyType {
  Открыто: {
    [index: string]: Extend
  }
  Принято: {
    [index: string]: Extend
  }
  Устранено: {
    [index: string]: Extend
  }
}
export interface templateType {
  [x:string]:any
  id: 'ver1'
  type: 'templateProject'
  template: {
    base: {
      'senior fitter': string[]
      'status project': string[]
    }
    extendManual: {
      [index: string]: Extend
    }
    extend: {
      [index: string]: Extend
    }
  }
  CabTimeV3: cabtimeType
  error: {
    // errorid: string
    // wo: string
    // user: string
    // 'project number': string
    // 'cab name': string
    // type: string
    // status: ['open', 'confirmed', 'closed']
    // 'senior fitter': string
    // Photo: [string]
    // body: templateBodyType[]
    t_error: {
      Открыто: {
        [index: string]: Extend
      }
      Принято: {
        [index: string]: Extend
      }
      Устранено: {
        [index: string]: Extend
      }
    }
    f_error: {
      Открыто: {
        [index: string]: Extend
      }
      Принято: {
        [index: string]: Extend
      }
      Устранено: {
        [index: string]: Extend
      }
    }
  }
  Инженер: string[]
  Сборщик: string[]
}
