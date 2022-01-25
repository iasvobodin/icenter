export type projectInfoType = {
  'Project Number': string
  wo: string
  'cab name': string
  'Project Name': string
  'SZ №': number
  PM: string
  Buyer: string
  'Contract Administrator': string
  'Buyout Administrator': string
  'Lead Engineer': string | null
  'status project': string
  'senior fitter': string
  'Comments field': string
  'Hours calculated': string
  'Hours actual': string
  'Shipping date': string
  'Specific requirement field': string
}
type cabinet = { wo: string; 'cab name': string }

export interface projectType {
  id: '71501894'
  status: 'open'
  info: {
    base: {
      'project number': string
      wo: string
      'cab name': string
      'Project Name': string
      'SZ №': number
      PM: string
      Buyer: string
      'Contract Administrator': string
      'Buyout Administrator': string
      'Lead Engineer': string | null
    }
    extends: {
      'status project': string
      'senior fitter': string
      'Comments field': string
      'Hours calculated': string
      'Hours actual': string
      'Shipping date': string
      'Specific requirement field': string
    }
  }
  cabinets: cabinet[]
}
