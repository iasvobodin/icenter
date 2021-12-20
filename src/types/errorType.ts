export type errorBodyType = {
  Открыто: {
    Тип?: string
    ['Тип ошибки']?: string
    Причина?: string
    Этап?: string
    Описание: string
    'Количество ошибок'?: number
    'Ответственный'?: string
    'Ошибку допустил'?: string
  }
  Принято:
    | {}
    | {
        Описание?: string
        'Статус решения': string
      }
  Устранено:
    | {}
    | {
        Описание?: ' '
        ['Время на устранение']: number
        'Статус коррекции': string
      }
  _changed?: string
  _time?: string
}

export interface errorType2 {
  id: string
  info: {
    Проект: string
    Шкаф: string
    wo: string
    Добавил: string
    Мастер: string
    status?: string
  }
  photos?: string[]
  type: 'f_error' | 't_error'
  body: errorBodyType[]
  confirmedTime: number
  confirmedChanged: string
}


export interface errorBodyFitterType {
  Открыто: {
    Тип: string
    Описание: string
  }
  Принято: {
    Описание: string
    'Статус решения': string
  }
  Устранено: {
    Описание: string
    'Статус коррекции': string
    ['Время на устранение']: number
  }
  // _changed: string | null
  // _time: string
}
export interface errorBodyTesterType {
  Открыто: {
    [key: string]: string|number
    ['Тип ошибки']: string
    Описание: string
    Причина: string
    Этап: string
    'Количество ошибок': number
    Ответственный: string
    'Ошибку допустил': string
  }
  Принято: {
    [key: string]: string
    Описание: string
    'Статус решения': string
  }
  Устранено: {
    [key: string]: string|number
    Описание: string
    'Статус коррекции': string
    ['Время на устранение']: number
  }
  // _changed: string | null
  // _time: string
}

// export interface AddressWithUnit extends errorBodyType {
//   Открыто: {
//     ['Тип ошибки']?: string
//   Причина?: string
//   Этап?: string
//   'Количество ошибок'?: '2'
//   Ответственный?: string
//   'Ошибку допустил'?: string }
// }

export type errorType = {
  id: string
  info: {
    Проект: string
    Шкаф: string
    wo: string
    Добавил: string
    Мастер: string
    status?: 'open'| 'confirmed'| 'closed'
  }
  photos?: string[]
  type: 'f_error' | 't_error'
  body: errorBodyType[] //errorBodyTesterType[]|errorBodyFitterType[]//[{[property: string]:any}]// type extends 'f_error' ? errorBodyFitterType[] : errorBodyTesterType[]; // errorBodyTesterType[]|errorBodyFitterType[]
  confirmedTime: number
  confirmedChanged: string
}
interface generalBody {

}
export type generalErrorType = {
  id: string
  info: {
    [key: string]: string
  }
  photos?: string[]
  type: 'f_error' | 't_error'
  body: errorBodyTesterType[]|errorBodyFitterType[]
  confirmedTime: number
  confirmedChanged: string
}
// export interface errorType {
//   id: string
//   info: {
//     Проект: string
//     Шкаф: string
//     wo: string
//     Добавил: string
//     Мастер: string
//     status?: string
//   }
//   photos?: string[]
//   type: 'f_error' | 't_error'
//   body: errorBodyType[]
//   confirmedTime: number
//   confirmedChanged: string
// }
