import {
  fetchAllPlaylistsApi,
  getNewGspn,
  savePlaylistInfo,
  addPlaylistApi,
  getAllVideos,
  removeVideo,
  swapVideo,
  saveDataFromCSVApi,
  resetDefaultPlaylistApi,
  removePlaylistApi,
  removeUserPlaylistApi,
  updateSponsoredApi,
  setAsDefaultVideosApi,
  swapPlaylistOrderApi,
  setAutoUpdateApi
} from '../api/playlist';

export const fetchAllPlaylists = () => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchAllPlaylistsApi()
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
};

export const getNewGSPN = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getNewGspn()
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

export const savePlaylist = (gspn, title, users, description, thumb, password) => {
  return () => {
    return new Promise((resolve, reject) => {
      savePlaylistInfo(gspn, title, users, description, thumb, password)
        .then(res => {
          res.json().then(json => {
            if (json.success) resolve(json);
            else reject();
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

export const setAutoUpdate = (user_id, gspn, value) => {
  return () => {
    return new Promise((resolve, reject) => {
      setAutoUpdateApi(user_id, gspn,  value)
        .then(res => {
          res.json().then(json => {
            if (json.success) resolve(json);
            else reject();
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

export const addPlaylist = (id, playlist_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      addPlaylistApi(id, playlist_id)
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


export const fetchAllVideos = (gspn) => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllVideos(gspn)
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

export const removeVideoFromPlaylist = (gspn, video_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeVideo(gspn, video_id)
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

export const swapVideoOrder = (gspn, video_id, swap_video_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      swapVideo(gspn, video_id, swap_video_id)
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

export const updateSponsored = (id, value) => {
  return () => {
    return new Promise((resolve, reject) => {
      updateSponsoredApi(id, value)
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

export const saveDataFromCSV = (data) => {
  return () => {
    return new Promise((resolve, reject) => {
      saveDataFromCSVApi(data)
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

export const resetDefaultPlaylist = (gspn, videos) => {
  return () => {
    return new Promise((resolve, reject) => {
      resetDefaultPlaylistApi(gspn, videos)
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

export const removePlaylist = (id, gspn) => {
    return () => {
        return new Promise((resolve, reject) => {
            removePlaylistApi(id, gspn)
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

export const removeUserPlaylist = (id, gridset_id, gspn) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeUserPlaylistApi(id, gridset_id, gspn)
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

export const swapPlaylistOrder = (id, gspn, swap_gspn) => {
  return () => {
    return new Promise((resolve, reject) => {
      swapPlaylistOrderApi(id, gspn, swap_gspn)
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
export const setAsDefaultVideos = (gspn, videos) => {
  return () => {
    return new Promise((resolve, reject) => {
      setAsDefaultVideosApi(gspn, videos)
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


