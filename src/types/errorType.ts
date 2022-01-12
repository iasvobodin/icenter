export type errorBodyType = {
  Открыто: {
    Тип?: string
    ['Тип ошибки']?: string
    Причина?: string
    Этап?: string
    Описание: string
    'Количество ошибок'?: '2'
    Ответственный?: 'Сборщик' | 'Инженер'
    'Ошибку допустил'?: string
  }
  Принято: {
    Описание?: string
    'Статус решения': string
  }
  Устранено: {
    Описание?: ' '
    ['Время на устранение']: number
    'Статус коррекции': string
  }
  _changed?: string | null
  _time?: string
}

export interface errorType {
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
