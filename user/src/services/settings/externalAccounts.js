import routes from 'config/routes'
import fetch from 'utils/fetch'

export const loadAccountsAPI = () =>
  fetch.get(routes.api.settings.externalAccounts())

export const addAccountAPI = ({service, username}) =>
  fetch.post(routes.api.settings.externalAccounts(), {service, externalId: username})

export const removeAccountAPI = ({service}) =>
  fetch.delete(routes.api.settings.externalAccounts(), {service})
