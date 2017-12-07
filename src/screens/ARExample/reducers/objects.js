// import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { ADD_OBJECT, ADD_OBJECTS } from '../actions/ar';

// need to track objects in the scene for loading from storage,
const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_OBJECT:
            // remove mesh beacuse we don't want to store that
            return [...state, omit(action.object, 'mesh')];
        case ADD_OBJECTS:
            return [...state, ...action.objects.map(o => omit(o, 'mesh'))];
        default:
            return state;
    }
}
