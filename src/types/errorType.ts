﻿
// type t = {
//   t_error: string
//   f_error: string
// }



// type test = {
//   Описание: string
//   ['Тип ошибки']: string
//   Причина: string
//   Этап: string
//   'Количество ошибок': number
//   Ответственный: string
//   'Ошибку допустил': string
// }
// type templateOpenBody = {
//   [key in keyof openTesterBody]: Extend
// }
// interface openFitterBody {
//   Описание: string
//   ['Тип ошибки']: string
// }
// interface openTesterBody extends openFitterBody {
//   Причина: string
//   Этап: string
//   'Количество ошибок': number
//   Ответственный: string
//   'Ошибку допустил': string
// }
// export interface errorBodyFitterType {
//   Открыто: openFitterBody
//   Принято: {
//     Описание: string
//     'Статус решения': string
//   }
//   Устранено: {
//     Описание: string
//     'Статус коррекции': string
//     ['Время на устранение']: number
//   }
//   _changed?: string | null
//   _time?: string
// }
// export interface errorBodyTesterType {
//   Открыто: openTesterBody
//   Принято: {
//     Описание: string
//     'Статус решения': string
//   }
//   Устранено: {
//     Описание: string
//     'Статус коррекции': string
//     ['Время на устранение']: number
//   }
//   _changed: string | null
//   _time: string
// }
export type Extend = {
  _field: string
  name: string
  value: string | string[]
  min?: number
  max?: number
  type?: string
}

export type templateBodyType = {
  Открыто: {
    [key in keyof BodyType['Открыто']]: Extend
  }
  Принято: {
    [key in keyof BodyType['Принято']]: Extend
  }
  Устранено: {
    [key in keyof BodyType['Устранено']]: Extend
  }
}

export type BodyType = {
  Открыто: {
    Описание: string| Extend
    Тип: string| Extend
    ['Тип ошибки']: string| Extend
    Причина?: string| Extend
    Этап?: string| Extend
    'Количество ошибок'?: number| Extend
    Ответственный?: string| Extend
    'Ошибку допустил'?: string| Extend
  }
  Принято?: {
    Описание: string| Extend
    'Статус решения': string| Extend
  }
  Устранено?: {
    Описание: string| Extend
    'Статус коррекции': string| Extend
    ['Время на устранение']: number| Extend
  }
}
export type errorType = {
  id: string
  info: {
    Проект: string
    Шкаф: string
    wo: string
    Добавил: string
    Мастер: string
    status?: 'open' | 'confirmed' | 'closed'
  }
  photos?: string[]
  type: 'f_error' | 't_error'
  body: BodyType[]
}
