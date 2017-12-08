import * as THREE from 'three';

import {
    INIT,
    ADD_OBJECT,
    ADD_OBJECTS,
    SELECT_OBJECT,
    SELECT_OBJECT3D
} from '../actions/ar';

const initialState = {
    // used for touch events to see if we touched an object
    raycaster: new THREE.Raycaster(),
    // need to track objects for raycaster
    object3Ds: [],
    // need to track objects in the scene for recalibrating object3Ds,
    objects: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case INIT:
            return { ...initialState, ...action.state };
        case ADD_OBJECT:
            return {
                ...state,
                objects: [...state.objects, action.object],
                object3Ds: [...state.object3Ds, action.object.object3D]
            };
        case ADD_OBJECTS:
            return {
                ...state,
                objects: [...state.objects, ...action.objects],
                object3Ds: [
                    ...state.object3Ds,
                    ...action.objects.map(object => object.object3D)
                ]
            };
        case SELECT_OBJECT:
            return {
                ...state,
                selection: action.object,
                selection3D: action.object.object3D
            };
        case SELECT_OBJECT3D:
            console.log('action', action.object3D.id);
            console.log(
                state.objects.find(object => {
                    console.log(object.object3D.id);
                    return object.object3D.id === action.object3D.id;
                })
            );
            return {
                ...state,
                selection: state.objects.find(
                    object => object.object3D === action.object3D
                ),
                selection3D: action.object3D
            };
        default:
            return state;
    }
}
