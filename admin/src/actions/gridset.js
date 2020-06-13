import {
  addGridsetApi,
  fetchAllGridsetsApi,
  fetchAllGridsetsByUser,
  fetchAllGridsetsByID,
  fetchGridsetInfoAPI,
  fetchCubetInfo,
  updateGridsetApi,
  disableGridsetApi,
  swapGridset,
  addGridsetByID,
  removeUserGridsetAPI,
  removeGridsetAPI,
  getGridsetTitleAPI,
  resetAllGridsetApi,
  setGridsetPasswordApi,
  updateGridsetLocked,
  setGridsetAsMasterApi,
  updateGridsetVisibilityApi,
  getDefaultGridsetsApi,
  addNewDefaultGridsetApi,
  removeDefaultGridsetApi,
  swapDefaultGrdisetOrderApi
} from '../api/gridset';

export const addGridset = (gridset) => {
  return () => {
    return new Promise((resolve, reject) => {
      addGridsetApi(gridset)
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

export const fetchAllGridsets = () => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchAllGridsetsApi()
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

export const getDefaultGridsets = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getDefaultGridsetsApi()
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

export const fetchGridsetsByUser = () => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchAllGridsetsByUser()
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

export const fetchGridsetsByID = (id) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchAllGridsetsByID(id)
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

export const fetchGridsetInfo = (user_id, gridsetId) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchGridsetInfoAPI(user_id, gridsetId)
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

export const fetchGridset = (gridsetId) => {
  return () => {
    return new Promise((resolve, reject) => {
      fetchCubetInfo(gridsetId)
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

export const updateGridset = (gridset) => {
  return () => {
    return new Promise((resolve, reject) => {
      updateGridsetApi(gridset)
        .then(res => {
          res.json().then(json => {
            if (json.success) resolve();
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

export const disableGridset = (gridsetId, disable) => {
  return () => {
    return new Promise((resolve, reject) => {
      disableGridsetApi(gridsetId, disable)
        .then(res => {
          res.json().then(json => {
            if (json.success) resolve();
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

export const swapGridsetOrder = (id, old, order) => {
  return () => {
    return new Promise((resolve, reject) => {
      swapGridset(id, old, order)
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

export const addNewGridset = (user, gridset) => {
  return () => {
    return new Promise((resolve, reject) => {
      addGridsetByID(user, gridset)
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

export const addNewDefaultGridset = (gridset) => {
  return () => {
    return new Promise((resolve, reject) => {
      addNewDefaultGridsetApi(gridset)
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

export const removeDefaultGridset = (gridset) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeDefaultGridsetApi(gridset)
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

export const swapDefaultGrdisetOrder = (id, order, swap_id, swap_order) => {
  return () => {
    return new Promise((resolve, reject) => {
      swapDefaultGrdisetOrderApi(id, order, swap_id, swap_order)
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

export const removeUserGridset = (user, gridset, order) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeUserGridsetAPI(user, gridset, order)
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

export const removeGridset = (gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeGridsetAPI(gridset_id)
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

export const updateGridsetVisibility = (gridset_id, visibility) => {
  return () => {
    return new Promise((resolve, reject) => {
      updateGridsetVisibilityApi(gridset_id, visibility)
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

export const getGridsetTitle = (gspn) => {
  return () => {
    return new Promise((resolve, reject) => {
      getGridsetTitleAPI(gspn)
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

export const resetAllGridset = (user_id, gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      resetAllGridsetApi(user_id, gridset_id)
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

export const setGridsetPassword = (gridset_id, password, pwd_protected) => {
  return () => {
    return new Promise((resolve, reject) => {
      setGridsetPasswordApi(gridset_id, password, pwd_protected)
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

export const updateLocked = (user_id,gridset_id,locked) => {
  return () => {
    return new Promise((resolve, reject) => {
      updateGridsetLocked(user_id,gridset_id,locked)
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

export const setGridsetAsMaster = (user_id,gridset_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      setGridsetAsMasterApi(user_id,gridset_id)
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