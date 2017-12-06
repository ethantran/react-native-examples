import { SET_PROGRESS, CLOSE_PROGRESS } from '../actions/progress';

const initialState = {
    show: false,
    progress: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PROGRESS:
            return {
                ...state,
                show: true,
                progress: action.progress
            };
        case CLOSE_PROGRESS:
            return {
                ...state,
                show: false
            };
        default:
            return state;
    }
}
