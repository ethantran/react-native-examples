import { HUD_RESIZE, HUD_CLOSE } from '../actions/hudSelection';

const initialState = {
    show: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case HUD_RESIZE:
            return {
                ...state,
                show: false
            };
        case HUD_CLOSE:
            return {
                ...state,
                show: true
            };
        default:
            return state;
    }
}
