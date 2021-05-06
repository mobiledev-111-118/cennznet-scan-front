import API from "api";

export const getSetting = () => {
    return new Promise((resolve, reject) => {
        API.GET(`/setting/get`).then((res) => {
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

export const getAllTrans = (userid) => {
    return new Promise((resolve, reject) => {
        API.GET(`/transaction/get/${userid}`).then((res) => {
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

export const deleteOneItem = (id) => {
    return new Promise((resolve, reject) => {
        API.GET(`/transaction/delete/${id}`).then((res) => {
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

export const addSettings = (limit, start, end) => {
    return new Promise((resolve, reject) => {
        API.POST("/setting/add", {limit, start, end}).then((res) => {
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

export const updateAsset = (id, address, tkname, nickname, qty, tkdecimal) => {
    return new Promise((resolve, reject) => {
        API.POST("/transaction/update", {id, address, tkname, nickname, qty, tkdecimal}).then((res) => {
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

export const addAsset = (userid, address, tkname, nickname, qty, tkdecimal) => {
    return new Promise((resolve, reject) => {
        API.POST("/transaction/add", {userid, address, tkname, nickname, qty, tkdecimal}).then((res) => {
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