import qs from 'qs';

const PredictHQ = {
    events: {
        search: async (params, options) =>
            (await fetch(
                `https://api.predicthq.com/v1/events/?${qs.stringify(params)}`,
                options
            )).json()
    }
};

export default PredictHQ;
