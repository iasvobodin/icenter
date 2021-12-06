export type azureAuth = {
  clientPrincipal: {
    identityProvider: string
    userId: string
    userDetails: string
    userRoles: string[]
  }
}

export interface userType {
  id: string
  type: string
  info: azureAuth['clientPrincipal']
  body: {
    name: string
    bg?: string
    customCursor?: string
    photo?: string
  }
}
