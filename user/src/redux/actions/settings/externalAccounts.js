import routes from 'config/routes'
import {getGoogleApiClient} from 'services/googleApi'
import {loadAccountsAPI, addAccountAPI, removeAccountAPI} from 'services/settings/externalAccounts'
import openOauthWindow from 'utils/openOauthWindow'

export const LOAD_ACCOUNTS = 'LOAD_ACCOUNTS'
export const ADD_ACCOUNT = 'ADD_EXTERNAL_ACCOUNT'
export const REMOVE_ACCOUNT = 'ADD_EXTERNAL_ACCOUNT'
export const ADD_ACCOUNT_ERROR = 'ADD_ACCOUNT_ERROR'

export const loadAccounts = () => async (dispatch) => {
  const accounts = await loadAccountsAPI()
  dispatch({type: LOAD_ACCOUNTS, payload: accounts})
}

const getAccessToken = (uriHash) =>
  uriHash.match(/#access_token=([^&]+)&/)[1]

export const services = {
  facebook: (username) => username,
  youtube: () => new Promise(async (resolve, reject) => {
    try {
      const gapi = await getGoogleApiClient()
      await gapi.client.init({
        'apiKey': process.env.REACT_APP_GOOGLE_API_KEY,
        'clientId': process.env.REACT_APP_GOOGLE_CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      })

      const auth = gapi.auth2.getAuthInstance()
      if (auth.isSignedIn.get())
        auth.disconnect()

      auth.isSignedIn.listen((signedIn) => {
        if (!signedIn)
          return

        const request = gapi.client.youtube.channels.list({part: 'snippet', mine: true})
        request.execute((response) => {
          const username = response.items[0].snippet.title
          resolve(username)
        })
      })
      auth.signIn()
    } catch (error) {
      reject(error)
    }
  }),
  twitch: async () => {
    const clientId = process.env.REACT_APP_TWITCH_CLIENT_ID
    const redirect = `${window.location.origin}${routes.settings.externalAccountsCallback({service: 'twitch'})}`
    const location = await openOauthWindow({
      url: `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=user_read`,
      width: 500,
      height: 500,
    })
    const accessToken = getAccessToken(location.hash)
    const result = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const {data} = await result.json()
    return data[0].login
  },
  dailymotion: async () => {
    const clientId = process.env.REACT_APP_DAILYMOTION_CLIENT_ID
    const redirect = `${window.location.origin}${routes.settings.externalAccountsCallback({service: 'dailymotion'})}`
    const location = await openOauthWindow({
      url: `https://www.dailymotion.com/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirect}`,
      width: 500,
      height: 500,
    })
    const accessToken = getAccessToken(location.hash)
    const result = await fetch('https://api.dailymotion.com/user/me?fields=username', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const {username} = await result.json()
    return username
  },
  vimeo: async () => {
    const clientId = process.env.REACT_APP_VIMEO_CLIENT_ID
    const redirect = `${window.location.origin}${routes.settings.externalAccountsCallback({service: 'vimeo'})}`
    const location = await openOauthWindow({
      url: `https://api.vimeo.com/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirect}`,
      width: 500,
      height: 500,
    })
    const accessToken = getAccessToken(location.hash)
    const result = await fetch('https://api.vimeo.com/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const {name: username} = await result.json()
    return username
  },
}

export const toggleAccount = (accounts, type, username) => async (dispatch) => {
  try {
    if (accounts[type]) {
      await removeAccountAPI({accounts, service: type})
      dispatch({type: REMOVE_ACCOUNT, payload: {type}})
    } else {
      username = await services[type](username)
      await addAccountAPI({accounts, service: type, username: username})
      dispatch({type: ADD_ACCOUNT, payload: {type, username}})
    }
  } catch (error) {
    dispatch({type: ADD_ACCOUNT_ERROR, payload: error})
  }
}
