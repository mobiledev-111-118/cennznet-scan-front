import axios from "axios";
import ALGOAPI from "../api/algoApi";

export const getAssetFromNetwork = () => {
    return new Promise((resolve, reject) => {
        ALGOAPI.GET(`/assets`).then((res) => {
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

export const getLatestBlockNumber = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://algoexplorerapi.io/v1/status`).then((res) => {
            !res? reject(null): resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })
}

export const getAssetOne = (assetId) => {
    const url = `https://algoexplorerapi.io/idx2/v2/assets?asset-id=${assetId}`;
    return new Promise((resolve, reject) => {
        axios.get(url).then((res) => {
            if( res.status === 200 &&  res.data.assets.length ) {
                resolve({
                    decimals: res.data.assets[0].params.decimals,
                    unit: res.data.assets[0].params[`unit-name`]
                });
            } else {
                resolve(false);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}

export const getTopHolders = (limit = 1, asset_id = 27165954, next, greater) => {
    const cnt = 100 * parseInt(limit);
    const url =next? `https://algoexplorerapi.io/idx2/v2/accounts?asset-id=${asset_id}&limit=${cnt}&next=${next}&currency-greater-than=${greater}`:
                `https://algoexplorerapi.io/idx2/v2/accounts?asset-id=${asset_id}&limit=${cnt}&currency-greater-than=${greater}`;
    return new Promise((resolve, reject) => {
        axios.get(url).then((res) => {
            if( res.status === 200 &&  res.data.accounts ) {
                resolve(res.data);
            } else {
                resolve(false);
            }
        }).catch((err) => {
            reject(err);
        })
    })
}