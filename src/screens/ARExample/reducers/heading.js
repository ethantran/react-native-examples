import { SET_INITIAL_HEADING, SET_HEADING } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_HEADING:
            return {
                ...state,
                initialHeading: action.heading,
                currentHeading: action.heading
            };
        case SET_HEADING:
            return {
                ...state,
                currentHeading: action.heading
            };
        default:
            return state;
    }
}
