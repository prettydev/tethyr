export const getAllGridsets = () => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/getAllGridset/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const getPublicGridsetsApi = (userId) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/getPublicGridset/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const takePublicGridsetApi = (userId, gridset_id) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/takePublicGridset/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ 
      gridset_id
    })
  });
}

export const takePublicPlaylistApi = (userId, gridset_id, playlist_id) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/takePublicPlaylist/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ 
      gridset_id,
      playlist_id
    })
  });
}

export const checkUserInfoApi = () => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/user/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const setGridsetGangedApi = (gridset_id, playlist_id, value) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/gangedGridset/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ 
      gridset_id, 
      playlist_id, 
      value 
    })
  });
}

export const setGridsetAsMasterApi = (gridset_id) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/setGridsetAsMaster/${userId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          gridset_id,
      })
  })
}

export const getPreviewApi = (gridset_id) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/getPreview/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ gridset_id })
  });
}

export const getAllPlaylists = (user_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/cubes/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ user_id })
  });
}

export const setPlaylistAutoUpdateApi = (id, value) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/setAutoUpdate/${userId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id, 
      value
    })
  })
}

export const setAsDefaultVideosApi = (id, videos) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/setDefaultVideos`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id,
          videos
      })
  })
}

export const checkPlaylistUpdateApi = () => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/checkUpdate/${userId}`, {
      method: 'GET',
  })
}

export const getAllVideosTypes = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/getTypes`, {
      method: 'GET',
  });
}

export const setCubePlaylist = (user_id, cube_id, playlist_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/cube/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id,
      cube_id,
      playlist_id,
    })
  });
};

export const loginApi = (username, password) => {
  return fetch(`${process.env.REACT_APP_LOGIN_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password
    })
  });
}

export const signupApi = (data) => {
  const email = data[2];
  const username = data[3];
  const password = data[4];
  return fetch(`${process.env.REACT_APP_LOGIN_URL}/registerUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      username,
      password,
      password_confirmation : password,
      tos : true,
    })
  });
}

export const getUserDetails = (token) => {
  return fetch(`${process.env.REACT_APP_LOGIN_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const fetchYoutubePlaylistItemsApi = (id, pageToken) => {
  return fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${process.env.REACT_APP_YOUTUBE_API}`, {
    method: "GET",
  })
}

export const fetchYoutubeVideoInfoApi = (id) => {
  return fetch(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.REACT_APP_YOUTUBE_API}&id=${id}&part=snippet,contentDetails`, {
    method: "GET",
  })
}

export const fetchYoutubeUserInfoApi = (id) => {
  return fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items/snippet/thumbnails/default&id=${id}&key=${process.env.REACT_APP_YOUTUBE_API}`, {
    method: "GET",
  })
}

export const fetchFacebookVideoInfoApi = (id) => {
  return fetch(`https://graph.facebook.com/v6.0/${id}?access_token=${process.env.REACT_APP_FACEBOOK_API}&fields=description,title,created_time,length,content_category,format,content_tags,from,place,captions,thumbnails,tags,picture,live_status`, {
    method: "GET",
  })
}

export const fetchFacebookUserInfoApi = (id) => {
  return fetch(`https://graph.facebook.com/v6.0/${id}/picture?access_token=${process.env.REACT_APP_FACEBOOK_API}&fields=description,title,created_time,length,content_category,format,content_tags,from,place,captions,thumbnails,tags,picture,live_status`, {
    method: "GET",
  })
}
export const fetchTwitterVideoInfoApi = (id) => {
  const token = sessionStorage.getItem('token');
  var data = JSON.stringify({
    id:id
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/social/twitter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
}

export const getVimeoVideoInfoApi = (id) => {
  return fetch(`https://api.vimeo.com/videos/${id}?access_token=${process.env.REACT_APP_VIMEO_API}&token_type=bearer&scope=public`, {
    method: "GET",
  })
}

export const getTwitchVideoInfoApi = (id) => {
  return fetch(`https://api.twitch.tv/helix/videos?id=${id}`, {
    headers: {
      'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
      Authorization: `Bearer ${process.env.REACT_APP_TWITCH_API}`
    },
    method: "GET",
  })
}

export const getTwitchUserInfoApi = async(id, type) => {
  if(type === "login") {
    return await fetch(`https://api.twitch.tv/helix/users?login=${id}`, {
      headers: {
        'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
        Authorization: `Bearer ${process.env.REACT_APP_TWITCH_API}`
      },
      method: "GET",
    })
  }
  else {
    return await fetch(`https://api.twitch.tv/helix/users?id=${id}`, {
    headers: {
      'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
      Authorization: `Bearer ${process.env.REACT_APP_TWITCH_API}`
    },
    method: "GET",
  })
  }
}

export const getTwitchStreamInfoApi = (id) => {
  return fetch(`https://api.twitch.tv/helix/streams?user_id=${id}`, {
    headers: {
      'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
      Authorization: `Bearer ${process.env.REACT_APP_TWITCH_API}`
    },
    method: "GET",
  })
}

export const getTwitchGameInfoApi = (id) => {
  return fetch(`https://api.twitch.tv/helix/games?id=${id}`, {
    headers: {
      'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
      Authorization: `Bearer ${process.env.REACT_APP_TWITCH_API}`
    },
    method: "GET",
  })
}

export const updateTwitchInfoApi = (video) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/updateTwitch`, {
    method: "POST",
    headers: {
      'client-id' : 'yqok11ir134rn9bmi4d7nionwi2epq',
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      video
    })
  });
};

export const fetchPodCastInfoApi = (url, type) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/social/podcast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      url,
      type
    })
  });
}

export const getImageInfoApi = (url) => {
  const token = sessionStorage.getItem('token');
  var data = JSON.stringify({
    url:url
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/social/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
}

export const addPlaylistApi = (video_id, playlist_id, position, playingPlaylists, hideMode) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    video_id: video_id,
    playlist_id : playlist_id,
    position : position,
    playingPlaylists : playingPlaylists,
    hideMode : hideMode,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/addPlaylist/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const addYoutubePlaylistApi = (video_ids, playlist_id, position, playingPlaylists, hideMode) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    video_ids: video_ids,
    playlist_id : playlist_id,
    position : position,
    playingPlaylists : playingPlaylists,
    hideMode : hideMode,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/addYoutubePlaylist/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const saveUserInfoApi = () => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/user/saveUserInfo/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
};

export const saveVideoApi = (video) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/saveVideos/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      video
    })
  });
};

export const saveYoutubePlaylistApi = (videos) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/saveYoutubeVideos/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      videos
    })
  });
};

export const reorderPlaylistApi = (playlist_id, newIndex, oldIndex, hide_filter) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    playlist_id: playlist_id,
    newIndex : newIndex,
    oldIndex : oldIndex,
    hide_filter : hide_filter,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/reorder/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const setPlaylistRatingApi = (ratingValue, video_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    ratingValue: ratingValue,
    video_id : video_id,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/saveRating/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const removePlaylistItemApi = (playlist_id, video_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    playlist_id: playlist_id,
    video_id : video_id,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/removefromplaylist/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const brokePlaylistItemApi = (playlist_id, video_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    playlist_id: playlist_id,
    video_id : video_id,
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/brokeVideo/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const hidePlaylistItemApi = (playlist_id, video_id, hideValue, hide_filter) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    playlist_id: playlist_id,
    video_id : video_id,
    hideValue : hideValue,
    hide_filter : hide_filter
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/hidefromplaylist/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const hideUserItemApi = (playlist_id, video_id, hideValue) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    playlist_id: playlist_id,
    video_id : video_id,
    hideValue : hideValue
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/hideUserItem/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const search_filterApi = (dotValue, hideValue, filterValue, playlist_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  var data = JSON.stringify({
    dotValue : dotValue,
    hideValue : hideValue,
    filterValue: filterValue,
    playlist_id: playlist_id
  });
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/filterSearch/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: [data]
  });
};

export const createNewPlaylistApi = (title, description) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId')
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/new/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title, 
      description
    })
  });
}

export const addNewToPlaylistApi = (gspn, gridset_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId')
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/save/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      gspn, 
      gridset_id
    })
  });
};

export const detectXFrameOptionApi = (url) => {
  //const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/social/iframeCheck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      url
    })
  });
}

export const resetDefaultPlaylistApi = (playlist_id) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/resetPlaylist/${userId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        playlist_id
      })
  })
}

export const getPlaylistInfoApi = (playlist_id) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/getPlaylistInfo`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        playlist_id
      })
  })
}

export const metaLoginApi = (userName, pwd) => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/auth/metaLoginInfo`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userName, 
        pwd
      })
  })
}

export const searchVideosApi = (value, position) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/searchVideo/${userId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        position
      })
  })
}

export const importExternalVideoApi = (videos, playlist) => {
  console.log(videos)
  console.log(playlist)
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/importVideo/${userId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videos,
        playlist
      })
  })
}

export const addVideoToPlaylistApi = (video_ids, playlist_id, positionValue) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/video/addtoplaylist/${userId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_ids, 
      playlist_id, 
      positionValue
    })
  })
}

export const getAndmoorInfoApi = (id) => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/"
  return fetch( proxyurl + `https://andmoor.com/getmeta?link=${id}`, {
    method: 'GET'
  })
}

export const removeGridsetApi = (gridset, order) => {
  const user = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/remove-gridset/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset, 
      user,
      order
    })
  })
}

export const removePlaylistApi = (gspn, gridset_id) => {
  const user_id = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/remove-playlist/`, {
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

export const confirmEmailApi = (token) => {
  return fetch(`${process.env.REACT_APP_LOGIN_URL}/register/verify-email/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
}

export const createUserGroupApi = (title, description) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/createUserGridset/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title, 
      description,
    })
  });
}

export const setUserGridsetStatusApi = (gridset_id, status) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/setUserGridsetStatus/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gridset_id, 
      status,
    })
  });
}

export const editUserGridsetApi = (gridset_id, title, description) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/editUserGridset/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gridset_id, 
      title,
      description,
    })
  });
}

export const saveUserGridsetOrderstApi = (items) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/saveUserGridsetOrders/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items
    })
  });
}

export const editUserPlaylistApi = (playlist_id, title, description,password) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/editUserPlaylist/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playlist_id, 
      title,
      description,
      password
    })
  });
}

export const saveUserPlaylistOrdersApi = (gridset_id, items) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/playlist/saveUserPlaylistOrders/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gridset_id,
      items
    })
  });
}

export const setUserGridsetPermissionApi = (gridset_id) => {
  const userId = sessionStorage.getItem('userId');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/user/gridset/setUserGridsetPermission/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gridset_id,
    })
  });
}

export const getAllAdsApi = () => {
  const token = sessionStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/getAllAds`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
