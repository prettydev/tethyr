export const GetAllUserIdInfo = () => {
    return fetch(`${process.env.REACT_APP_SERVER_URL}/admin/user/`, {
        method: 'GET',
    });
}