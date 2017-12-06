import { SET_REGION } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_REGION:
            return {
                ...state,
                ...action.region
            };
        default:
            return state;
    }
}
