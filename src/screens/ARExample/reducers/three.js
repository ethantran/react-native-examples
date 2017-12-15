import * as THREE from 'three';

import {
    INIT,
    ADD_OBJECT,
    ADD_OBJECTS,
    REMOVE_OBJECT,
    RESTORE_OBJECTS,
    SELECT_OBJECT,
    SELECT_OBJECT3D,
    DESELECT
} from '../actions/ar';

const initialState = {
    // used to highlight selected object edges
    highlights: null,
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
        case REMOVE_OBJECT:
            return {
                ...state,
                objects: state.objects.filter(e => e !== action.object),
                object3Ds: state.object3Ds.filter(
                    e => e !== action.object.object3D.userData.root
                )
            };
        case RESTORE_OBJECTS:
            return {
                ...state,
                objects: action.objects,
                object3Ds: action.objects.map(object => object.object3D)
            };
        case SELECT_OBJECT:
            return {
                ...state,
                highlights: action.highlights,
                selection: action.object,
                selection3D: action.object.object3D
            };
        case SELECT_OBJECT3D:
            return {
                ...state,
                highlights: action.highlights,
                selection: state.objects.find(
                    object => object.object3D === action.object3D.userData.root
                ),
                selection3D: action.object3D.userData.root
            };
        case DESELECT:
            return {
                ...state,
                highlights: null,
                selection: null,
                selection3D: null
            };
        default:
            return state;
    }
}
