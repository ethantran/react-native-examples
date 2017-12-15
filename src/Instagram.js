import qs from 'qs';

const Instagram = {
    location: {
        search: async params =>
            (await fetch(
                `https://api.instagram.com/v1/locations/search?${qs.stringify(
                    params
                )}`
            )).json(),
        media: {
            recent: async (id, params) =>
                (await fetch(
                    `https://api.instagram.com/v1/locations/${
                        id
                    }/media/recent?${qs.stringify(params)}`
                )).json()
        }
    },
    media: {
        search: async (id, params) =>
            (await fetch(
                `https://api.instagram.com/v1/media/search?${qs.stringify(
                    params
                )}`
            )).json()
    }
};
export default Instagram;
