export const getAllAdvertisersListApi = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/getAllAdsOwners`, {
    method: 'GET'
  });
}

export const getAllAdsApi = () => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/getAllAds`, {
    method: 'GET'
  });
}
 
export const createNewAdvertiserApi= (name) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/createNewAdvertiser`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({name})
  });
}

export const createNewAdApi= (adName, advertiser_id, localURL, targetURL, duration, adImg) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/createNewAd`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({adName, advertiser_id, localURL, targetURL, duration, adImg})
  });
}

export const enabledAdsApi= (ad_id, ad_enabled) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/enableAds`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ad_id, ad_enabled})
  });
}

export const removeAdApi= (ad_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ads/removeAds`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ad_id})
  });
}