import {
    addPlatformApi,
    fetchAllPlatforms,
    removePlatformApi
} from '../api/platform';

export const addPlatform = (name) => {
    return () => {
        return new Promise((resolve, reject) => {
            addPlatformApi(name)
                .then(res => {
                    res.json().then(json => {
                        if (json.success) resolve(json.id);
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

export const fetchPlatforms = () => {
    return () => {
        return new Promise((resolve, reject) => {
            fetchAllPlatforms()
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

export const removePlatform = (platformId) => {
    return () => {
        return new Promise((resolve, reject) => {
            removePlatformApi(platformId)
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
