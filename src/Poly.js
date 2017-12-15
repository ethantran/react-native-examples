import qs from 'qs';

const Poly = {
    getAsset: async (name, params) =>
        (await fetch(
            `https://poly.googleapis.com/v1/${name}/?${qs.stringify(params)}`
        )).json(),
    listAssets: async params =>
        (await fetch(
            `https://poly.googleapis.com/v1/assets/?${qs.stringify(params)}`
        )).json()
};

export default Poly;
