
export const addGridsetApi = (gridset) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/new`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(gridset)
  });
}

export const fetchAllGridsetsApi = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset`, {
    method: 'GET',
  });
}

export const getDefaultGridsetsApi = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/defaultGridset`, {
    method: 'GET',
  });
}

export const fetchAllGridsetsByUser = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset`, {
    method: 'GET',
  });
}

export const fetchAllGridsetsByID = (id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    })
  });
}

export const fetchGridsetInfoAPI = (user_id, gridsetId) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/userPlaylist/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id, 
      gridsetId
    })
  });
}

export const fetchCubetInfo = (gridsetId) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/cube/${gridsetId}`, {
    method: 'GET',
  });
}

export const updateGridsetApi = (gridset) => {
  const { id, ...rest } = gridset;
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rest)
  });
}

export const disableGridsetApi = (gridsetId, disable) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/disable/${gridsetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      disable,
    })
  });
}

export const swapGridset = (id, old,  order) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/move-gridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      old,
      order
    })
  })
}

export const addGridsetByID = (user, gridset) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/add-gridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      gridset,
    })
  })
}

export const addNewDefaultGridsetApi = (gridset) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/addDefaultGridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset,
    })
  })
}

export const removeDefaultGridsetApi = (gridset) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/removeDefaultGridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset,
    })
  })
}


export const swapDefaultGrdisetOrderApi = (id, order, swap_id, swap_order) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/swapDefaultGrdisetOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      order,
      swap_id,
      swap_order
    })
  })
}

export const removeUserGridsetAPI = (user, gridset, order) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/remove-gridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      gridset,
      order
    })
  })
}

export const removeGridsetAPI = (gridset_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/remove-gridset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset_id
    })
  })
}

export const updateGridsetVisibilityApi = (gridset_id, visibility) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/updateVisibility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset_id,
      visibility
    })
  })
}

export const getGridsetTitleAPI = (gspn) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/playlist/getPlaylistTitle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gspn
    })
  })
}

export const resetAllGridsetApi = (user_id, gridset_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/resetAllGridsets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      gridset_id
    })
  })
}

export const setGridsetPasswordApi = (gridset_id, password, pwd_protected) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/gridset/setPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gridset_id, 
      password,
      pwd_protected
    })
  })
}

export const updateGridsetLocked = (user_id,gridset_id,locked) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/updateLocked`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      gridset_id,
      locked
    })
  })
}

export const setGridsetAsMasterApi = (user_id,gridset_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/usergridset/setGridsetAsMaster`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      gridset_id,
    })
  })
}
