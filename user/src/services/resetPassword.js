import axios from 'axios'
import config from '../config/config'

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/user/forgot_password',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: {
        email: email,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      if (err.response.status === 404) {
        reject('Account not found')
      } else {
        reject('Failed to request password reset')
      }
    })
  })
}

export const resetPassword = (unique_id, token, password) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/user/reset_password',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: {
        unique_id: unique_id,
        password: password,
        token: token,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
