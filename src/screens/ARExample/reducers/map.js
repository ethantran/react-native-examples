import { TOGGLE_MAP } from '../actions/hud';
import { RESET } from '../actions/ar';

const initialState = {
    visible: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_MAP:
            return {
                ...state,
                visible: !state.visible
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
