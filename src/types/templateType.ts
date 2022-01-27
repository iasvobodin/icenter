import { cabtimeType } from './cabtimeTypes'
import { projectInfoType } from '@/types/projectInfoType'

export type Extend = {
  _field: string
  name: string
  value: string | string[]
  min?: number
  max?: number
  search?: [{ id: string, givenName: string, surname: string }]
}
type Extends = {
  "Specific requirement field": string,
  "senior fitter": string,
  "status project": string,
  "Hours calculated": string,
  "Hours actual": string,
  "Comments field": string,
  "Shipping date": string
}

type Base = {
  "Project Name": string,
  "SZ №": number,
  "PM": string,
  "Buyer": string,
  "Contract Administrator": string,
  "Buyout Administrator": string,
  "Lead Engineer"?: string
}


type a = keyof Extends
export type templateType = {
  id: 'ver1'
  type: 'templateProject'
  template: {
    base: {
      'senior fitter': string[]
      'status project': string[]
    }
    extendManual: {
      [key in keyof projectInfoType]: Extend
    }
    extend: {
      [key in keyof Extends]: Extend
    }
  }
  CabTimeV3: cabtimeType
  error: {
    errorid: ''
    wo: ''
    user: 'local@mail.com'
    'project number': '71501851.4'
    'cab name': 'MMS-4.2'
    type: 'error'
    status: ['open', 'confirmed', 'closed']
    'senior fitter': ''
    Photo: ''
    body: {
      Открыто: {
        'Тип ошибки': ['Материалы', 'ПД электрическая схема', 'ПД конструктив']
        Описание: ''
      }
      Принято: {
        'Статус решения': [
          'Устранить до отгрузки',
          'Соглосовать с ПМ частичную отгрузку',
          'Внести корректировки в РД'
        ]
        Описание: ''
      }
      Устранено: {
        'Статус коррекции': [
          'Установлено',
          'Соглосовано',
          'Корректировки внесены'
        ]
        Описание: ''
        'Время на устранение': ''
      }
    }
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
