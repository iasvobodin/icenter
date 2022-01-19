type cabtimeBody = {
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
}

export type cabtimeType = {
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
}
