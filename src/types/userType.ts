export interface userType {
  id: string
  type: string
  info: {
    identityProvider: string
    userId: string
    userDetails: string
    userRoles: string[]
  }
  body: {
    name: string
  }
}
