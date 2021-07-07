import API from "api";

export const getHoldersName = () => {
    return new Promise((resolve, reject) => {
        API.GET(`/algo_holder/get`).then((res) => {
            if( res === null ) {
                reject(null);
            } else {
                resolve(res);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}

export const addHoldersName = (addr, nickname) => {
    return new Promise((resolve, reject) => {
        API.POST("/algo_holder/add", {addr, nickname}).then((res) => {
            if( res === null ) {
                reject(null);
            } else {
                resolve(res);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}
