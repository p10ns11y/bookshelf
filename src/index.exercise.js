// 🐨 you don't need to do anything for the exercise, but there's an extra credit!
import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {AuthProvider} from './context/auth-context'
import {App} from './app'

const queryConfig = {
  retry(failureCount, error) {
    if (error.status === 404) return false
    else if (failureCount < 2) return true
    else return false
  },
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

loadDevTools(() => {
  ReactDOM.render(
    <AuthProvider>
      <ReactQueryConfigProvider config={queryConfig}>
        <App />
      </ReactQueryConfigProvider>
    </AuthProvider>,
    document.getElementById('root'),
  )
})
