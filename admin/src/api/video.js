export const getAllVideos = () => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/all`, {
        method: 'GET',
    });
}

export const _validateLink = (link) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link })
    });
}

export const getNewGsvn = () => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/new`, {
        method: 'GET',
    });
}

export const saveVideoToDB = (video) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video })
    })
}

export const getAllPlaylists = (video_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/playlists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({video_id})
    })
}

export const addVideoToPlaylist = (video_id, playlist_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/addtoplaylist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_id,
            playlist_id
        })
    })
}

export const removeVideo = (video_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/remove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_id
        })
    })
}

export const removeUserVideoApi = (user_id, gspn, video_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/removeUserVideo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id, 
            gspn, 
            video_id
        })
    })
}
export const removeVideoFromPlaylist = (video_id, playlist_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/removefromplaylist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_id,
            playlist_id
        })
    })
}

export const uploadCSVFile = (file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/bulk`, {
        method: 'POST',
        body: formdata
    });
}

export const getVideosByUserApi = (user_id, gspn) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/userVideo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id,
            gspn
        })
    });
}

export const updateDotHiddenApi = (dotted, hidden, user_id, gspn, id,) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/updateCheck`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dotted, 
            hidden,
            user_id, 
            gspn, 
            id,
        })
    });
}

export const resetDefaultVideosApi = (gspn, user_id) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/video/resetDefault`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id, 
            gspn, 
        })
    });
}