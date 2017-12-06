import qs from 'qs';

const GoogleMaps = {
    geocode: async params =>
        (await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?${qs.stringify(
                params
            )}`
        )).json(),
    place: {
        nearbysearch: async params =>
            (await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/output?${qs.stringify(
                    params
                )}`
            )).json(),
        textsearch: async params =>
            (await fetch(
                `https://maps.googleapis.com/maps/api/place/textsearch/output?${qs.stringify(
                    params
                )}`
            )).json(),
        details: async params =>
            (await fetch(
                `https://maps.googleapis.com/maps/api/place/details/output?${qs.stringify(
                    params
                )}`
            )).json(),
        autocomplete: async params =>
            (await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/output?${qs.stringify(
                    params
                )}`
            )).json(),
        queryautocomplete: async params =>
            (await fetch(
                `https://maps.googleapis.com/maps/api/place/queryautocomplete/output?${qs.stringify(
                    params
                )}`
            )).json()
    }
};

export default GoogleMaps;
