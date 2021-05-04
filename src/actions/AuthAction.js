import API from "api";

export const signup = (email, password) => {
    return new Promise((resolve, reject) => {
        API.POST("/user/signup", {email:email, password:password}).then((res) => {
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

export const signin = (email, password) => {
    return new Promise((resolve, reject) => {
        API.POST("/user/signin", {email:email, password:password}).then((res) => {
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