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
  token?: {
    access_token: string
    expires_in: number
    ext_expires_in: number
    refresh_token: string
    scope: string
    token_type: string
  }
}
