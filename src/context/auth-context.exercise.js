import * as React from 'react'

const AuthContext = React.createContext()

function useAuth() {
  const authContextValue = React.useContext(AuthContext)

  if (authContextValue === undefined) {
    throw new Error('useAuth must be used within AuthContext Provider')
  }

  return authContextValue
}

export {AuthContext, useAuth}
