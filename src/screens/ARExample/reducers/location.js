import { SET_INITIAL_LOCATION, SET_LOCATION } from '../actions/ar';

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
        default:
            return state;
    }
}
