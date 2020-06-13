import axios from 'axios'
import config from '../config/config'

export const getUserGridsetSharedLink = (user_id, gridset_id,token) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/userGridset/getUserGridsetSharedLink',
      baseURL: config.apiBaseUrl,
      method: 'post',
      headers: {
        'x-access-token': token
      },
      data: {
        user_id: user_id,
        gridset_id: gridset_id,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const importFromSharedLink = (user_id, shared_gridset_id,token) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/userGridset/importFromSharedLink',
      baseURL: config.apiBaseUrl,
      method: 'post',
      headers: {
        'x-access-token': token
      },
      data: {
        user_id: user_id,
        shared_gridset_id: shared_gridset_id,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const getUserAllGridset = (user_id, token, page_size, page) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userGridset/getUserAllGridset/${user_id}/${page_size}/${page}`,
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

export const getUserPublicGridsets = (user_id, token) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/userGridset/getUserPublicGridsets/${user_id}`,
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

export const setUserGridsetAsMaster = (user_id, token, gridset_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/userGridset/setUserGridsetAsMaster',
      baseURL: config.apiBaseUrl,
      method: 'post',
      headers: {
        'x-access-token': token
      },
      data: {
        user_id: user_id,
        gridset_id: gridset_id,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}