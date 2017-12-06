import { OPEN as OPEN_POLY, CLOSE as CLOSE_POLY } from '../actions/poly';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_POLY:
            return {
                ...state,
                show: false
            };
        case CLOSE_POLY:
            return {
                ...state,
                show: true
            };
        default:
            return state;
    }
}
