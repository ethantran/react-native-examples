import { SET_PROGRESS, CLOSE_PROGRESS } from '../actions/progress';
import { RESET } from '../actions/ar';

const initialState = {
    visible: false,
    progress: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PROGRESS:
            return {
                ...state,
                visible: true,
                progress: action.progress
            };
        case CLOSE_PROGRESS:
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
