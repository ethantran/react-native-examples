import * as turf from '@turf/turf';
import * as THREE from 'three';

import {
    placeObject3DFromCamera,
    getCameraPosition,
    calibrateObject,
    mapRootToChildren
} from '../utils';
import { creators as geometryCreators } from './geometry';
import { loadAssets as loadPolyAssets } from './poly';

export const INIT = 'ar/init';

export const SET_INITIAL_LOCATION = 'ar/SET_INITIAL_LOCATION';
export const SET_LOCATION = 'ar/SET_LOCATION';

export const SET_INITIAL_HEADING = 'ar/SET_INITIAL_HEADING';
export const SET_HEADING = 'ar/SET_HEADING';

export const SET_REGION = 'ar/SET_REGION';

export const ADD_OBJECT = 'ar/ADD_OBJECT';
export const ADD_OBJECTS = 'ar/ADD_OBJECTS';
export const REMOVE_OBJECT = 'ar/REMOVE_OBJECT';

export const SELECT_OBJECT = 'ar/SELECT_OBJECT';
export const SELECT_OBJECT3D = 'ar/SELECT_OBJECT3D';
export const DESELECT = 'ar/DESELECT';

export const RESET = 'ar/RESET';

export const RESTORE_OBJECTS = 'ar/RESTORE_OBJECTS';

export const init = state => ({
    type: INIT,
    state
});

export const setInitialLocation = location => ({
    type: SET_INITIAL_LOCATION,
    location
});
export const setLocation = location => ({
    type: SET_LOCATION,
    location
});
export const setInitialHeading = heading => ({
    type: SET_INITIAL_HEADING,
    heading
});
export const setHeading = heading => ({ type: SET_HEADING, heading });
export const setRegion = region => ({ type: SET_REGION, region });

export const defaultCreateDistance = 3;

export const addObject = object => dispatch => {
    mapRootToChildren(object.object3D);
    dispatch({ type: ADD_OBJECT, object });
};
export const addObjects = objects => ({ type: ADD_OBJECTS, objects });
// take the current camera pos and add the distance from current geolocation to object geolocation
// camera position is the best guess of where we are, current geolocation to three.js position
// camera position can be not in synce with current geolocation if geo is not updating when we move
// TODO: perhaps finding a geolocation from the initial geolocation and the camera position's distance from origin is better
export const addObjectAtHeading = object => (dispatch, getState) => {
    const {
        heading: { currentHeading },
        location: { currentLocation },
        three: { camera, scene }
    } = getState();
    if (!object.type || !object.object3D) {
        console.error('type or object3D missing');
        return;
    }

    placeObject3DFromCamera(camera, object.object3D, defaultCreateDistance);

    // update scene
    scene.add(object.object3D);

    // heading is used like bearing
    const headingInRadians = turf.helpers.degreesToRadians(
        currentHeading.trueHeading
    );

    // calculate geolocation by adding distance to current geolocation
    // need this to save and load the custom poly object in the same spot in the future
    //TODO: correct this with new formula
    const distanceInMeters = turf.helpers.lengthToDegrees(
        camera.position.distanceTo(object.object3D.position),
        'meters'
    );
    const direction = new THREE.Vector2(0, 1);
    const center = new THREE.Vector2(0, 0);
    direction.rotateAround(center, -1 * headingInRadians);
    direction.multiplyScalar(distanceInMeters);
    const latlngVector = new THREE.Vector2(
        currentLocation.coords.longitude,
        currentLocation.coords.latitude
    );
    latlngVector.add(direction);

    // update object with geolocation and update state
    const newObject = {
        ...object,
        longitude: latlngVector.x,
        latitude: latlngVector.y
    };

    dispatch(addObject(newObject));
};
export const removeObject = object => (dispatch, getState) => {
    const { three: { scene } } = getState();
    scene.remove(object.object3D);
    dispatch({ type: REMOVE_OBJECT, object });
};

// TODO: use EdgesGeometry or WireframeGeometry
const addHighlights = (scene, object3D) => {
    let highlights = [];
    return highlights;
};

export const selectObject = object => (dispatch, getState) => {
    const { three: { scene } } = getState();
    const highlights = addHighlights(scene, object.object3D);
    dispatch({ type: SELECT_OBJECT, object, highlights });
};
export const selectObject3D = object3D => (dispatch, getState) => {
    const { three: { scene } } = getState();
    const highlights = addHighlights(scene, object3D);
    dispatch({ type: SELECT_OBJECT3D, object3D, highlights });
};
export const deselect = object3D => (dispatch, getState) => {
    const { three: { scene, highlights } } = getState();
    if (highlights) {
        highlights.forEach(highlight => {
            scene.remove(highlight);
        });
    }
    dispatch({ type: DESELECT });
};

export const reset = () => ({ type: RESET });

export const loadFromStorage = () => async dispatch => {
    // await dispatch(loadPolyAssets());
    await dispatch(createFromStorage());
};

// TODO: scale
// TODO: rotation
// TODO: elevation
export const createFromStorage = () => (dispatch, getState) => {
    const {
        heading: { initialHeading },
        location: { currentLocation },
        objects,
        three: { scene, camera }
    } = getState();
    const cameraPos = getCameraPosition(camera);
    const restoredObjects = objects.map((object, i) => {
        let restoredObject = {
            ...object
        };
        if (restoredObject.type === 'geometry') {
            restoredObject.object3D = geometryCreators[object.geometryName]();
        }
        mapRootToChildren(restoredObject.object3D);
        calibrateObject(
            restoredObject,
            cameraPos,
            currentLocation.coords,
            initialHeading
        );
        scene.add(restoredObject.object3D);
        return restoredObject;
    });
    dispatch({ type: RESTORE_OBJECTS, objects: restoredObjects });
};
