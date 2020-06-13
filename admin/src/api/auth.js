export const loginApi = (email, password) => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        })
    })
};
