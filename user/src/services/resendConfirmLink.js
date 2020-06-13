import axios from 'axios'
import config from '../config/config'

export const resendConfirmLink = (user_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/user/resend_confirm_link',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: {
        user_id: user_id,
      },
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject('Failed to send the confirm link')
    })
  })
}