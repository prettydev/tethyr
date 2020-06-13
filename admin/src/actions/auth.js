import { loginApi } from '../api/auth';

export const loginAction = (email, password) => {
    return () => {
        return new Promise((resolve, reject) => {
            loginApi(email, password)
                .then((res) => {
                    res.json().then(json => {
                        if (json.success) {
                            sessionStorage.setItem('userId', json.id);
                            resolve();
                        } else {
                            reject(json.msg);
                        }
                    });
                })
                .catch((err) => {
                    reject('Server is not working!');
                })
        })
    }
}