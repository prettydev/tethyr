import axios from 'axios'
import config from '../config/config'

export const checkUserPlaylistUpdate = (user_id, token) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userPlaylist/checkUserPlaylistUpdate/${user_id}`,
      baseURL: config.apiBaseUrl,
      method: 'get',
      headers: {
        'x-access-token': token
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const moveUserPlaylist = (user_id, token, original_group_id, group_id, playlist_id, move_option) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userPlaylist/moveUserPlaylist/${user_id}`,
      baseURL: config.apiBaseUrl,
      method: 'post',
      headers: {
        'x-access-token': token
      },
      data: {
        original_group_id,
        group_id,
        playlist_id,
        move_option
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getUserAllPlaylist = (user_id, token, group_id, page_size, page) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userPlaylist/getUserPlaylist/${user_id}/${group_id}/${page_size}/${page}`,
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

export const getUserPublicPlaylists = (user_id, token, group_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userPlaylist/getUserPublicPlaylists/${user_id}/${group_id}`,
      baseURL: config.apiBaseUrl,
      method: 'get',
      headers: {
        'x-access-token': token
      }
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

export const getUserPreviewPlaylists = (user_id, token, group_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userPlaylist/getUserPreviewPlaylists/${user_id}/${group_id}`,
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