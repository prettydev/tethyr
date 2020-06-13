import {
    getAllVideos,
    _validateLink,
    getNewGsvn,
    saveVideoToDB,
    getAllPlaylists,
    addVideoToPlaylist,
    removeVideo as removeVideoApi,
    removeVideoFromPlaylist,
    removeUserVideoApi,
    uploadCSVFile,
    getVideosByUserApi,
    updateDotHiddenApi,
    resetDefaultVideosApi
} from '../api/video';

export const getVideos = () => {
    return () => {
        return new Promise((resolve, reject) => {
            getAllVideos()
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

export const validateLink = (link) => {
    return () => {
        return new Promise((resolve, reject) => {
            _validateLink(link)
                .then((res) => {
                    if (!res.ok) {
                        return reject();
                    }
                    res.json().then(json => {
                        resolve(json);
                    })
                })
                .catch((err) => {
                    reject();
                })
        })
    }
};

export const getNewGSVN = () => {
    return () => {
        return new Promise((resolve, reject) => {
            getNewGsvn()
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

export const saveVideo = (video) => {
    return () => {
        return new Promise((resolve, reject) => {
            saveVideoToDB(video)
                .then(res => {
                    res.json().then(json => {
                        if (json.success) resolve(json.video);
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

export const getPlaylists = (video_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            getAllPlaylists(video_id)
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

export const addToPlaylist = (video_id, playlist_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            addVideoToPlaylist(video_id, playlist_id)
                .then((res) => {
                    res.json().then(json => {
                        if (json.success) resolve();
                        else reject();
                    })
                    .catch(() => reject())
                })
                .catch((err) => {
                    reject();
                })
        })
    }
}

export const removeVideo = (video_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            removeVideoApi(video_id)
                .then((res) => {
                    res.json().then(json => {
                        if (json.success) resolve();
                        else reject();
                    })
                        .catch(() => reject())
                })
                .catch((err) => {
                    reject();
                })
        })
    }
};

export const removeUserVideo = (user_id, gspn, video_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            removeUserVideoApi(user_id, gspn, video_id)
                .then((res) => {
                    res.json().then(json => {
                        if (json.success) resolve();
                        else reject();
                    })
                        .catch(() => reject())
                })
                .catch((err) => {
                    reject();
                })
        })
    }
};

export const removeFromPlaylist = (video_id, playlist_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            removeVideoFromPlaylist(video_id, playlist_id)
                .then((res) => {
                    res.json().then(json => {
                        if (json.success) resolve();
                        else reject();
                    })
                    .catch(() => reject())
                })
                .catch((err) => {
                    reject();
                })
        })
    }
};

export const uploadCSV = (file) => {
    return () => {
        return new Promise((resolve, reject) => {
            uploadCSVFile(file)
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

export const getVideosByUser = (user_id, gspn) => {
    return () => {
        return new Promise((resolve, reject) => {
            getVideosByUserApi(user_id, gspn)
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

export const updateDotHidden = (dotted, hidden, user_id, gspn, id) => {
    return () => {
        return new Promise((resolve, reject) => {
            updateDotHiddenApi(dotted, hidden, user_id, gspn, id,)
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

export const resetDefaultVideos = (gspn, user_id) => {
    return () => {
        return new Promise((resolve, reject) => {
            resetDefaultVideosApi(gspn, user_id)
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
