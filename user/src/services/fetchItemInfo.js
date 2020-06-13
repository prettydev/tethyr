import axios from 'axios'

export const fetchYoutubeVideoInfo = (video_id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `https://www.googleapis.com/youtube/v3/videos?key=${process.env.REACT_APP_YOUTUBE_API}&id=${video_id}&part=snippet,contentDetails`,
      method: 'get',
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject('Failed to fetch the youtube video info!')
    })
  })
}

export const fetchYoutubeUserInfo = (channelId) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items/snippet/thumbnails/default&id=${channelId}&key=${process.env.REACT_APP_YOUTUBE_API}`,
      method: 'get',
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject('Failed to fetch the youtube video\' user info!')
    })
  })
}