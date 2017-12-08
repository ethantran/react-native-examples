import { OPEN, CLOSE } from '../actions/geometry';

const initialState = {
    visible: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN:
            return {
                ...state,
                visible: true
            };
        case CLOSE:
            return {
                ...state,
                visible: false
            };
        default:
            return state;
    }
}
