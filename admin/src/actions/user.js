import { GetAllUserIdInfo } from '../api/user';

export const GetAllUserID = () => {
    return () => {
        return new Promise((resolve, reject) => {
            GetAllUserIdInfo()
                .then((res) => {
                    res.json().then(json => {
                            resolve(json);
                    });
                })
                .catch((err) => {
                    reject('Server is not working!');
                })
        })
    }
}
