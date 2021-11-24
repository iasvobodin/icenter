import { cabtimeType } from './cabtimeTypes'

export type Extend = {
  _field: string
  name: string
  value: string | string[]
  min?: number
  max?: number
}

export interface templateType {
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
