import {
  getAllGridsets,
  getPreviewApi,
  getAllPlaylists,
  getAllVideosTypes,
  setCubePlaylist,
  loginApi,
  signupApi,
  getUserDetails,
  fetchYoutubePlaylistItemsApi,
  fetchYoutubeVideoInfoApi,
  fetchYoutubeUserInfoApi,
  fetchFacebookVideoInfoApi,
  fetchFacebookUserInfoApi,
  fetchTwitterVideoInfoApi,
  saveYoutubePlaylistApi,
  getVimeoVideoInfoApi,
  getTwitchVideoInfoApi,
  getTwitchUserInfoApi,
  getTwitchStreamInfoApi,
  getTwitchGameInfoApi,
  updateTwitchInfoApi,
  fetchPodCastInfoApi,
  getImageInfoApi,
  addPlaylistApi,
  addYoutubePlaylistApi,
  saveVideoApi,
  reorderPlaylistApi,
  setPlaylistRatingApi,
  removePlaylistItemApi,
  checkUserInfoApi,
  saveUserInfoApi,
  search_filterApi,
  hidePlaylistItemApi,
  hideUserItemApi,
  addNewToPlaylistApi,
  createNewPlaylistApi,
  brokePlaylistItemApi,
  detectXFrameOptionApi,
  resetDefaultPlaylistApi,
  getPlaylistInfoApi,
  metaLoginApi,
  searchVideosApi,
  addVideoToPlaylistApi,
  getAndmoorInfoApi,
  setPlaylistAutoUpdateApi,
  setAsDefaultVideosApi,
  checkPlaylistUpdateApi,
  importExternalVideoApi,
  setGridsetGangedApi,
  setGridsetAsMasterApi,
  takePublicGridsetApi,
  takePublicPlaylistApi,
  removeGridsetApi,
  removePlaylistApi,
  confirmEmailApi,
  createUserGroupApi,
  setUserGridsetStatusApi,
  editUserGridsetApi,
  saveUserGridsetOrderstApi,
  editUserPlaylistApi,
  saveUserPlaylistOrdersApi,
  setUserGridsetPermissionApi,
  getAllAdsApi,
} from '../api';

export const getGridsets = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllGridsets()
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
take the public gridsets(playlist groups)
------------------------------------------------------------
*/
export const takePublicGridset = (userId, gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      takePublicGridsetApi(userId, gridset_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
take the public playlists
------------------------------------------------------------
*/
export const takePublicPlaylist = (userId, gridset_id, playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      takePublicPlaylistApi(userId, gridset_id, playlist_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
set the Status of the user's gridset (online/offline)
------------------------------------------------------------
*/
export const setUserGridsetStatus = ( gridset_id, status) => {
  return () => {
    return new Promise((resolve, reject) => {
      setUserGridsetStatusApi(gridset_id, status)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
edit the Gridset Title and Description (Gridset Owner)
------------------------------------------------------------
*/
export const editUserGridset = ( gridset_id, title, description ) => {
  return () => {
    return new Promise((resolve, reject) => {
      editUserGridsetApi(gridset_id, title, description)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
save the User Gridsets' swapped lists
------------------------------------------------------------
*/
export const saveUserGridsetOrders = ( items ) => {
  return () => {
    return new Promise((resolve, reject) => {
      saveUserGridsetOrderstApi(items)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
edit the Gridset Title and Description (Gridset Owner)
------------------------------------------------------------
*/
export const editUserPlaylist = ( playlist_id, title, description,password ) => {
  return () => {
    return new Promise((resolve, reject) => {
      editUserPlaylistApi(playlist_id, title, description,password)
        .then(res => {
          res.json().then(json => {
            console.log(json)
            resolve(json);
          })
        })
        .catch((e) => {console.log(e);
          reject();})
    })
  }
}

/*
------------------------------------------------------------
edit the Gridset Permission (Gridset Owner)
------------------------------------------------------------
*/
export const setUserGridsetPermission = ( gridset_id ) => {
  return () => {
    return new Promise((resolve, reject) => {
      setUserGridsetPermissionApi(gridset_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

/*
------------------------------------------------------------
save the User Playlists' swapped lists
------------------------------------------------------------
*/
export const saveUserPlaylistOrders = ( gridset_id, items ) => {
  return () => {
    return new Promise((resolve, reject) => {
      saveUserPlaylistOrdersApi(gridset_id, items)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getPreview = (gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getPreviewApi(gridset_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getPlaylists = (user_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllPlaylists(user_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getVideosTypes = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllVideosTypes()
        .then((res) => {
          res.json().then(json => {
            resolve(json);
          })
          .catch(() => reject())
        })
        .catch((err) => {
          reject();
        })
    })
  }
}

export const setPlaylistForCube = (user_id, cube_id, playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      setCubePlaylist(user_id, cube_id, playlist_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const login = (username, password) => {
  return () => {
    return new Promise((resolve, reject) => {
      loginApi(username, password)
        .then(res => {
          if (res.status === 401 || res.status === 422) {
            reject();
            return;
          }
          res.json().then(json => {
            getUserDetails(json.token)
              .then(data => {
                data.json().then(details => {
                  sessionStorage.setItem('token', json.token);
                  sessionStorage.setItem('userId', details.id);
                  resolve(json);
                })
              })
          })
        })
        .catch(() => reject())
    })
  }
}

export const signup = (data) => {
  return () => {
    return new Promise((resolve, reject) => {
      signupApi(data)
        .then(res => {
          if (res.status === 401 || res.status === 422) {
            res.json().then(json => {
              if(json.username) {
                alert(json.username[0]);
                reject();
                return;
              }
              if(json.email) {
                alert(json.email[0]);
                reject();
                return;
              }
              reject();
              return;
            })
          }
          else {
            res.json().then(json => {
              resolve(json);
            })
          }
        })
        .catch(() => reject())
    })
  }
}

export const fetchYoutubePlaylistItems = (id, pageToken) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchYoutubePlaylistItemsApi(id, pageToken)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const fetchYoutubeVideoInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchYoutubeVideoInfoApi(id)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const fetchYoutubeUserInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchYoutubeUserInfoApi(id)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const fetchFacebookVideoInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchFacebookVideoInfoApi(id)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const fetchFacebookUserInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchFacebookUserInfoApi(id)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getVimeoVideoInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getVimeoVideoInfoApi(id)
        .then(res => {    
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getTwitchVideoInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getTwitchVideoInfoApi(id)
      .then(res => {    
        res.json().then(data => {
          resolve(data);
        })
      })
      .catch(() => reject())
  })}
}

export const getTwitchUserInfo = (id, type) => {
  return () => {
    return new Promise((resolve, reject) => {
      getTwitchUserInfoApi(id, type)
      .then(res => {    
        res.json().then(data => {
          resolve(data);
        })
      })
      .catch(() => reject())
    })
  }
}

export const getTwitchStreamInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getTwitchStreamInfoApi(id)
      .then(res => {    
        res.json().then(data => {
          resolve(data);
        })
      })
      .catch(() => reject())
    })
  }
}

export const getTwitchGameInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getTwitchGameInfoApi(id)
      .then(res => {    
        res.json().then(data => {
          resolve(data);
        })
      })
      .catch(() => reject())
    })
  }
}

export const updateTwitchInfo = (video) => {
  return () => {
    return new Promise((resolve, reject) => {
      updateTwitchInfoApi(video)
      .then(res => {    
        res.json().then(data => {
          resolve(data);
        })
      })
      .catch(() => reject())
    })
  }
}

export const fetchTwitterVideoInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchTwitterVideoInfoApi(id)
        .then(res => {
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const fetchPodCastInfo = (url, type) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchPodCastInfoApi(url, type)
        .then(res => {
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const getImageInfo = (url) => {
  return () => {
    return new Promise((resolve, reject) => {
      getImageInfoApi(url)
        .then(res => {
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const addPlaylist = ( video_id, playlist_id, position, playingPlaylists, hideMode) => {
  return () => {
    return new Promise((resolve, reject) => {
      addPlaylistApi( video_id, playlist_id, position, playingPlaylists, hideMode)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const addYoutubePlaylist = ( video_ids, playlist_id, position, playingPlaylists, hideMode) => {
  return () => {
    return new Promise((resolve, reject) => {
      addYoutubePlaylistApi( video_ids, playlist_id, position, playingPlaylists, hideMode)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const saveUserInfo = () => {
  return () => {
    return new Promise((resolve, reject) => {
      saveUserInfoApi()
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const saveVideo = (video) => {
  return () => {
    return new Promise((resolve, reject) => {
      saveVideoApi(video)
        .then(res => {
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const saveYoutubePlaylist = (video) => {
  return () => {
    return new Promise((resolve, reject) => {
      saveYoutubePlaylistApi(video)
        .then(res => {
          res.json().then(data => {
            resolve(data);
          })
        })
        .catch(() => reject())
    })
  }
}

export const reorderPlaylist = (playlist_id, newIndex, oldIndex, hide_filter) => {
  return () => {
    return new Promise((resolve, reject) => {
      reorderPlaylistApi(playlist_id, newIndex, oldIndex, hide_filter)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const setPlaylistRating = ( value, id ) => {
  return () => {
    return new Promise((resolve, reject) => {
      setPlaylistRatingApi(value, id)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const removePlaylistItem = ( playlist_id, id ) => {
  return () => {
    return new Promise((resolve, reject) => {
      removePlaylistItemApi(playlist_id, id)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const brokePlaylistItem = ( playlist_id, id ) => {
  return () => {
    return new Promise((resolve, reject) => {
      brokePlaylistItemApi(playlist_id, id)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const hidePlaylistItem = ( playlist_id, id, hideValue, hide_filter ) => {
  return () => {
    return new Promise((resolve, reject) => {
      hidePlaylistItemApi(playlist_id, id, hideValue, hide_filter)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const hideUserItem = ( playlist_id, id, hideValue ) => {
  return () => {
    return new Promise((resolve, reject) => {
      hideUserItemApi(playlist_id, id, hideValue)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const checkUserInfo = () => {
  return () => {
    return new Promise((resolve, reject) => {
      checkUserInfoApi()
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch((err) => { console.log(err); reject()})
    })
  }
}

export const search_filter = (dotValue, hideValue, filter_value, playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      search_filterApi(dotValue, hideValue, filter_value, playlist_id)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const addNewToPlaylist = (gspn, gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      addNewToPlaylistApi(gspn, gridset_id)
        .then(res => {
          res.json().then(res => {
            resolve(res);
          })
        })
        .catch(() => reject())
    })
  }
}

export const createNewPlaylist = (title, description) => {
  return () => {
    return new Promise((resolve, reject) => {
      createNewPlaylistApi(title, description)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export const detectXFrameOption = (url) => {
  return () => {
    return new Promise((resolve, reject) => {
      detectXFrameOptionApi(url)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}

export function showOverlaySpinner(){
  return function(dispatch) {
    dispatch({ type: 'SHOW_OVERLAY_SPINNER' })
  }
}

export function hideOverlaySpinner(){
  return function(dispatch) {
    dispatch({ type: 'HIDE_OVERLAY_SPINNER'})
  }
}

export function updateManagementState(){
  return function(dispatch) {
    dispatch({ type: 'UPDATE_STATE_MANAGEMENT'})
  }
}

export function findStuffScreen(value){
  if(value === 'public')
  {
    return function(dispatch) {
      dispatch({ type: 'Public Screen' })
    }
  }
  else if(value === 'promoted')
  {
    return function(dispatch) {
      dispatch({ type: 'Promoted Screen'})
    }
  }
  else if(value === 'sale')
  {
    return function(dispatch) {
      dispatch({ type: 'Sale Screen' })
    }
  }
  else {
    return null;
  }
}

export const resetDefaultPlaylist = (playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      resetDefaultPlaylistApi(playlist_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const getPlaylistInfo = (playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getPlaylistInfoApi(playlist_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const metaLogin = (userName, pwd) => {
  return () => {
    return new Promise((resolve, reject) => {
      metaLoginApi(userName, pwd)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const searchVideos = (value, position) => {
  return () => {
    return new Promise((resolve, reject) => {
      searchVideosApi(value, position)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const addVideoToPlaylist = (video_ids, playlist_id, positionValue) => {
  return () => {
    return new Promise((resolve, reject) => {
      addVideoToPlaylistApi(video_ids, playlist_id, positionValue)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const getAndmoorInfo = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      getAndmoorInfoApi(id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const setPlaylistAutoUpdate = (id, value) => {
  return () => {
    return new Promise((resolve, reject) => {
      setPlaylistAutoUpdateApi(id, value)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const setAsDefaultVideos = (id, videos) => {
  return () => {
    return new Promise((resolve, reject) => {
      setAsDefaultVideosApi(id, videos)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const checkPlaylistUpdate = () => {
  return () => {
    return new Promise((resolve, reject) => {
      checkPlaylistUpdateApi()
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const importExternalVideo = (videos, playlist) => {
  return () => {
    return new Promise((resolve, reject) => {
      importExternalVideoApi(videos, playlist)
        .then(res => {
          res.json().then(json => {
            
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const setGridsetGanged = (gridset_id, playlist_id, value) => {
  return () => {
    return new Promise((resolve, reject) => {
      setGridsetGangedApi(gridset_id, playlist_id, value)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const setGridsetAsMaster = (gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      setGridsetAsMasterApi(gridset_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const removeGridset = (gridset_id, sort_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeGridsetApi(gridset_id, sort_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const removePlaylist = (gspn, gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      removePlaylistApi(gspn, gridset_id)
        .then(res => {
          res.json().then(json => {
            resolve(json);
          }).catch(() => {
            reject();
          })
        })
        .catch(() => {
          reject();
        })
    })
  }
}

export const confirmEmail = (token) => {
  return () => {
    return new Promise((resolve, reject) => {
      confirmEmailApi(token)
        .then(res => {
          res.json().then(json => {
            resolve(json);                
          })
        })
        .catch(() => reject())
    })
  }
}

export const createUserGroup = (title, description) => {
  return () => {
    return new Promise((resolve, reject) => {
      createUserGroupApi(title, description)
        .then(res => {
          res.json().then(json => {
            resolve(json);                
          })
        })
        .catch(() => reject())
    })
  }
}

export const getAllAds = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllAdsApi()
        .then(res => {
          res.json().then(json => {
            resolve(json);
          })
        })
        .catch(() => reject())
    })
  }
}
