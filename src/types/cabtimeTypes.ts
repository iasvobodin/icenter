export type cabtimeBody = {
  _id: string
  _const: string
  _type: string
  _field: string
  name: string
  value: string
  result: number
  status: string
  propTime?: number
  fitter?: string
  new?: boolean
  date?: number
}

export type cabtimeType = {
  id: string
  info: {
    Проект: string
    Шкаф: string
    wo: string
  }
  body: cabtimeBody[]
  groupByType: {
    type: string
    total: string
    _id: number
  }[]
  control: {
    adminCoef: number
    documents: number
  }
  result: {
    assemble: string
    test: string
    admin: string
    final: string
  }
  history?: [cabtimeBody[]]
  type: 'cabTime'
  ttl?: number
  photos?: Array<string>
}
