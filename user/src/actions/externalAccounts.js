import routes from 'config/routes'
import {matchPath} from 'react-router-dom'

export const checkExternalAccountCallback = () => {
  const match = matchPath(window.location.pathname, {
    path: routes.settings.externalAccountsCallback(),
  })
  return !!match
}

export const handleExternalAccountCallback = () => {
  window.opener.externalAccountCallback(window.location)
  window.close()
}
