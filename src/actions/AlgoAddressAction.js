import API from "api";

export const getAllAddress = (userid) => {
    return new Promise((resolve, reject) => {
        API.GET(`/algo_address/get/${userid}`).then((res) => {
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

export const addAddress = (userid, nickname, addr) => {
    return new Promise((resolve, reject) => {
        API.POST("/algo_address/add", {userid, nickname, addr}).then((res) => {
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

export const updateAddress = (id, nickname, addr) => {
    return new Promise((resolve, reject) => {
        API.POST("/algo_address/update", {id, nickname, addr}).then((res) => {
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

export const updateStatus = (id, active) => {
    return new Promise((resolve, reject) => {
        API.POST("/algo_address/updateActive", {id, active}).then((res) => {
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
        API.GET(`/algo_address/delete/${id}`).then((res) => {
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