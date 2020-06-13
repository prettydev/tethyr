export const vanguardUserInfoApi = () => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/vanguard`, {
        method: 'GET',
    });
}