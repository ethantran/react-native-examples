import { OPEN, CLOSE } from '../actions/geometry';
import { RESET } from '../actions/ar';

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
        case RESET:
            return initialState;
        default:
            return state;
    }
}
