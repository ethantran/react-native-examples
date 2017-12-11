import { OPEN as OPEN_POLY, CLOSE as CLOSE_POLY } from '../actions/poly';
import {
    OPEN as OPEN_GEOMETRY,
    CLOSE as CLOSE_GEOMETRY
} from '../actions/geometry';
import { RESET } from '../actions/ar';

const initialState = {
    visible: true
};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_POLY:
        case OPEN_GEOMETRY:
            return {
                ...state,
                visible: false
            };
        case CLOSE_POLY:
        case CLOSE_GEOMETRY:
            return {
                ...state,
                visible: true
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
