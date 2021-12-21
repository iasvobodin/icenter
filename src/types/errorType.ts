export type Extend = {
  _field: string
  name: string
  value: string | string[]
  min?: number
  max?: number
  type?: string
}
type t = {
  t_error: string
  f_error: string
}

export type templateBodyType = {
  Открыто: {
    [key in keyof errorType['body'][0]['Открыто']]: Extend
  }
  Принято: {
    [key in keyof errorType['body'][0]['Принято']]: Extend
  }
  Устранено: {
    [key in keyof errorType['body'][0]['Устранено']]: Extend
  }
}

type test = {
  Описание: string
  ['Тип ошибки']: string
  Причина: string
  Этап: string
  'Количество ошибок': number
  Ответственный: string
  'Ошибку допустил': string
}
type templateOpenBody = {
  [key in keyof openTesterBody]: Extend
}
interface openFitterBody {
  Описание: string
  ['Тип ошибки']: string
}
interface openTesterBody extends openFitterBody {
  Причина: string
  Этап: string
  'Количество ошибок': number
  Ответственный: string
  'Ошибку допустил': string
}
export interface errorBodyFitterType {
  Открыто: openFitterBody
  Принято: {
    Описание: string
    'Статус решения': string
  }
  Устранено: {
    Описание: string
    'Статус коррекции': string
    ['Время на устранение']: number
  }
  _changed?: string | null
  _time?: string
}
export interface errorBodyTesterType {
  Открыто: openTesterBody
  Принято: {
    Описание: string
    'Статус решения': string
  }
  Устранено: {
    Описание: string
    'Статус коррекции': string
    ['Время на устранение']: number
  }
  _changed: string | null
  _time: string
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
  body: {
    Открыто: {
      Описание: string
      ['Тип ошибки']: string
      Причина?: string
      Этап?: string
      'Количество ошибок'?: number
      Ответственный?: string
      'Ошибку допустил'?: string
    }
    Принято?: {
      Описание: string
      'Статус решения': string
    }
    Устранено?: {
      Описание: string
      'Статус коррекции': string
      ['Время на устранение']: number
    }
  }[] //(errorBodyTesterType|errorBodyFitterType|templateBodyType)[]//[{[property: string]:any}]// type extends 'f_error' ? errorBodyFitterType[] : errorBodyTesterType[]; // errorBodyTesterType[]|errorBodyFitterType[]
  // confirmedTime: number
  // confirmedChanged: string
}
