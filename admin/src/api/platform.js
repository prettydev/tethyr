export const addPlatformApi = (name) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/platform`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ name })
    });
}

export const fetchAllPlatforms = () => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/platform/`, {
        method: 'GET',
    });
}

export const removePlatformApi = (platformId) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/platform/${platformId}`, {
        method: 'DELETE',
    });
}
