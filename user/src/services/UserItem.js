import axios from 'axios'
import config from '../config/config'

export const swapUserItemOrder = (user_id, token, currentPlaylist, source_id, destination_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userItem/userItemOrderSwap`,
      baseURL: config.apiBaseUrl,
      method: 'post',
      headers: {
        'x-access-token': token
      },
      data: {
        user_id,
        currentPlaylist,
        source_id,
        destination_id,
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getUserAllItem = (user_id, token, playlist_id, page_size, page) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userItem/getUserAllItem/${user_id}/${playlist_id}/${page_size}/${page}`,
      baseURL: config.apiBaseUrl,
      method: 'get',
      headers: {
        'x-access-token': token
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getUserPublicItems = (user_id, token, playlist_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userItem/getUserPublicItems/${user_id}/${playlist_id}`,
      baseURL: config.apiBaseUrl,
      method: 'get',
      headers: {
        'x-access-token': token
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}