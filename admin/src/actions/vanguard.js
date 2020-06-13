import { vanguardUserInfoApi } from '../api/vanguard';

export const vanguardUserInfo = () => {
    return () => {
        return new Promise((resolve, reject) => {
            vanguardUserInfoApi()
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