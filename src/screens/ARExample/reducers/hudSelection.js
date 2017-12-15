import { HUD_CLOSE } from '../actions/hudSelection';
import { SELECT_OBJECT, SELECT_OBJECT3D, RESET } from '../actions/ar';

const initialState = {
    visible: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SELECT_OBJECT:
        case SELECT_OBJECT3D:
            return {
                ...state,
                visible: true
            };
        case HUD_CLOSE:
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
