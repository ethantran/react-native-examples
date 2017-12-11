import { SET_REGION, RESET } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_REGION:
            return {
                ...state,
                ...action.region
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
