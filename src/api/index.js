
import axios from 'axios';
import {API_URL} from 'constants/config';

var headers = new Headers();
headers.append("Accept", "application/json");

class API {
  
    async NetWorkFailedError(err, reject) {
        console.log('..NetWorkFailedError..' + JSON.stringify(err))
        if (err !== "") {
            alert(err);
        } else if (typeof reject !== "undefined") {
            reject(err);
        } else {
            alert(err.message);
        }
    }
  
    async GET(endpoint) {
      return new Promise(async (resolve, reject) => {
            var uri = this.normalizePath(`${endpoint}`);
            try {
                axios.get(uri).then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                }).catch((err) => {
                    this.NetWorkFailedError(err, reject);
                })
            } catch (err) {
                this.NetWorkFailedError(err, reject);
            }
        });
    }
  
    async POST(endpoint, params) {
        try {
            return new Promise((resolve, reject) => {
                axios.post(this.normalizePath(endpoint), params).then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.data);
                    } else {
                        reject(res);
                    }
                }).catch((err) => {
                    this.NetWorkFailedError(err, reject);
                })
            });
        } catch (err) {
            console.log(err);
        }
    }
  
    async PUT(endpoint, params) {
        try {
            return new Promise((resolve, reject) => {
                fetch(this.normalizePath(endpoint), {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(params)
                })
                    .then((res) => {
                    return res.json().then((json) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(json);
                        } else {
                            reject(json);
                        }
                    });
                })
                .catch(async (err) => {
                    this.NetWorkFailedError(err, reject);
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
  
    normalizePath(endpoint) {
      return `${API_URL}${endpoint}`;
    }
    
}
  
export default new API();
  