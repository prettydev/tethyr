export default {
  settings: {
    externalAccounts: () =>
      '/settings/external_accounts',
    externalAccountsCallback: ({service = ':service'} = {}) =>
      `/settings/external_accounts/${service}/connect`,
  },
  api: {
    settings: {
      externalAccounts: () =>
        '/api/user/external_accounts'
    },
  }
}
