import axios from 'axios'
import config from '../../config/config'

export function getAllAds(){
    token = localStorage.getItem('_token')
    axios.request({
        url: '/user/login',
        baseURL: config.apiBaseUrl,
        headers: {
        'x-access-token': token
        }
    }).then((response) => {
        console.log(response)
    })
}
