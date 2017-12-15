// import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { ADD_OBJECT, ADD_OBJECTS, REMOVE_OBJECT, RESET } from '../actions/ar';

// need to track objects in the scene for loading from storage,
const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_OBJECT:
            // remove object3D beacuse we don't want to store that
            return [...state, omit(action.object, 'object3D')];
        case ADD_OBJECTS:
            return [...state, ...action.objects.map(o => omit(o, 'object3D'))];
        case REMOVE_OBJECT:
            return state.filter(e => e !== action.object);
        case RESET:
            return initialState;
        default:
            return state;
    }
}
