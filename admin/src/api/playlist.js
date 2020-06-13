export const fetchAllPlaylistsApi = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist`, {
    method: 'GET',
  });
}

export const getNewGspn = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/new`, {
    method: 'GET',
  });
}

export const savePlaylistInfo = (gspn, title, users, description, thumb, password) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/savePlaylist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn,
      title,
      users,
      description,
      thumb,
      password
    })
  })
}

export const setAutoUpdateApi = (user_id, gspn,  value) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/setAutoUpdate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id, 
      gspn,  
      value
    })
  })
}

export const addPlaylistApi = (id, playlist_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/addPlaylist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      playlist_id
    })
  })
}

export const getAllVideos = (gspn) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn
    })
  })
}

export const removeVideo = (gspn, video_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/remove-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn,
      video_id
    })
  })
}

export const swapVideo = (gspn, video_id, swap_video_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/move-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn, 
      video_id, 
      swap_video_id
    })
  })
}

export const saveDataFromCSVApi = (data) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/saveCSVData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data
    })
  })
}

export const resetDefaultPlaylistApi = (gspn, videos) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/resetPlaylist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn, 
      videos
    })
  })
}

export const removePlaylistApi = (id, gspn) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/removePlaylist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      gspn
    })
  })
}

export const removeUserPlaylistApi = (user_id, gridset_id, gspn) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/remove-playlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      gridset_id,
      gspn
    })
  })
}

export const swapPlaylistOrderApi = (id, gspn, swap_gspn) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/swapPlaylist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      gspn,
      swap_gspn
    })
  })
}
export const updateSponsoredApi = (id, value) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/updateSponsored`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      value
    })
  })
}

export const setAsDefaultVideosApi = (gspn, videos) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/setDefaultVideos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn,
      videos
    })
  })
}
