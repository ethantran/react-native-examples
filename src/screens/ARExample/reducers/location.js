import { SET_INITIAL_LOCATION, SET_LOCATION, RESET } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_LOCATION:
            return {
                ...state,
                initialLocation: action.location,
                currentLocation: action.location
            };
        case SET_LOCATION:
            return {
                ...state,
                currentLocation: action.location
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
