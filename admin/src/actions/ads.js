import { getAllAdvertisersListApi, getAllAdsApi, createNewAdvertiserApi, createNewAdApi, enabledAdsApi, removeAdApi } from '../api/ads';

export const getAllAdvertisersList = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllAdvertisersListApi()
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

export const getAllAds = () => {
  return () => {
    return new Promise((resolve, reject) => {
      getAllAdsApi()
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

export const createNewAdvertiser = (advertiser_name) => {
  return () => {
    return new Promise((resolve, reject) => {
      createNewAdvertiserApi(advertiser_name)
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

export const createNewAd = (adName, advertiser_id, localURL, targetURL, duration, adImg) => {
  return () => {
    return new Promise((resolve, reject) => {
      createNewAdApi(adName, advertiser_id, localURL, targetURL, duration, adImg)
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

export const enabledAds = (ad_id, ad_enabled) => {
  return () => {
    return new Promise((resolve, reject) => {
      enabledAdsApi(ad_id, ad_enabled)
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

export const removeAd = (ad_id) => {
  return () => {
    return new Promise((resolve, reject) => {
      removeAdApi(ad_id)
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