import * as turf from '@turf/turf';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

export const INIT = 'ar/init';

export const SET_INITIAL_LOCATION = 'ar/SET_INITIAL_LOCATION';
export const SET_LOCATION = 'ar/SET_LOCATION';

export const SET_INITIAL_HEADING = 'ar/SET_INITIAL_LOCATION';
export const SET_HEADING = 'ar/SET_HEADING';

export const SET_REGION = 'ar/SET_REGION';

export const ADD_OBJECT = 'ar/ADD_OBJECT';
export const ADD_OBJECTS = 'ar/ADD_OBJECTS';
export const SELECT_OBJECT = 'ar/SELECT_OBJECT';

export const setupARKit = (view, gl) => async dispatch => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const arSession = await view.startARSessionAsync();
    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(
        arSession,
        width,
        height,
        0.01,
        1000
    );
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(width, height);
    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);

    // add lights for fun
    const ambient = new THREE.HemisphereLight(0x66aaff, 0x886666, 0.5);
    ambient.position.set(-0.5, 0.75, -1);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 0.75, 0.5);
    scene.add(light);

    // good for debugging and seeing the three js space
    scene.add(new THREE.GridHelper(10, 10));

    const state = {
        width,
        height,
        arSession,
        scene,
        camera,
        renderer,
        ambient,
        light
    };

    dispatch({
        type: INIT,
        state
    });

    return state;
};

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

export const addObject = object => ({ type: ADD_OBJECT, object });
export const addObjects = objects => ({ type: ADD_OBJECTS, objects });
export const addObjectAtHeading = object => (dispatch, getState) => {
    const {
        heading: { initialHeading, currentHeading },
        location: { currentLocation },
        three: { camera, scene }
    } = getState();
    if (!object.type || !object.mesh) {
        console.error('type or mesh missing');
        return;
    }

    // not sure why i should do this, copied from somewhere
    camera.position.setFromMatrixPosition(camera.matrixWorld);

    // get camera position
    const cameraPos = new THREE.Vector3(0, 0, 0);
    cameraPos.applyMatrix4(camera.matrixWorld);

    // heading is used like bearing
    // find difference between current and initial heading because arkit three js space heading does not know where is true north
    const headingInRadians = turf.helpers.degreesToRadians(
        currentHeading.trueHeading - initialHeading.trueHeading
    );

    // take the current camera pos and add the distance from current geolocation to object geolocation
    // camera position is the best guess of where we are, current geolocation to three.js position
    // camera position can be not in synce with current geolocation if geo is not updating when we move
    // TODO: perhaps finding a geolocation from the initial geolocation and the camera position's distance from origin is better
    object.mesh.position.z =
        cameraPos.z + -1 * Math.cos(headingInRadians) * defaultCreateDistance;
    object.mesh.position.x =
        cameraPos.x + Math.sin(headingInRadians) * defaultCreateDistance;

    // calculate geolocation by adding distance to current geolocation
    // need this to save and load the custom poly object in the same spot in the future
    const longitude =
        currentLocation.coords.longitude +
        -1 *
            Math.cos(headingInRadians) *
            turf.helpers.lengthToDegrees(defaultCreateDistance, 'meters');
    const latitude =
        currentLocation.coords.latitude +
        Math.sin(headingInRadians) *
            turf.helpers.lengthToDegrees(defaultCreateDistance, 'meters');

    // update scene
    scene.add(object.mesh);

    // update object with geolocation and update state
    const newObject = { ...object, longitude, latitude };

    dispatch(addObject(newObject));
};
export const selectObject = object => ({ type: SELECT_OBJECT, object });
