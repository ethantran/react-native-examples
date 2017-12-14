import * as turf from '@turf/turf';
import * as THREE from 'three';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const getDistance = (coord1, coord2) => {
    const from = turf.point([coord1.longitude, coord1.latitude]);
    const to = turf.point([coord2.longitude, coord2.latitude]);
    const distanceInKilometers = turf.distance(from, to);
    const distanceInMiles = turf.distance(from, to, { units: 'miles' });
    const distanceInRadians = turf.distance(from, to, { units: 'radians' });
    const distanceInDegrees = turf.distance(from, to, { units: 'degrees' });
    return {
        distanceInKilometers,
        distanceInMiles,
        distanceInRadians,
        distanceInDegrees
    };
};

export const getBearing = (coord1, coord2) => {
    const point1 = turf.point([coord1.longitude, coord1.latitude]);
    const point2 = turf.point([coord2.longitude, coord2.latitude]);
    const bearingInDegrees = turf.bearing(point1, point2);
    const bearingInRadians = turf.helpers.degreesToRadians(bearingInDegrees);
    return {
        bearingInDegrees,
        bearingInRadians
    };
};

export const getRhumbBearing = (coord1, coord2) => {
    const point1 = turf.point([coord1.longitude, coord1.latitude]);
    const point2 = turf.point([coord2.longitude, coord2.latitude]);
    const rhumbBearingInDegrees = turf.rhumbBearing(point1, point2);
    const rhumbBearingInRadians = turf.helpers.degreesToRadians(
        rhumbBearingInDegrees
    );
    return {
        rhumbBearingInDegrees,
        rhumbBearingInRadians
    };
};

// what is the difference between this and getWorldRotation()
export const getCameraPosition = camera => {
    // not sure why i should do this, copied from somewhere
    camera.position.setFromMatrixPosition(camera.matrixWorld);
    // get camera position
    const cameraPos = new THREE.Vector3(0, 0, 0);
    cameraPos.applyMatrix4(camera.matrixWorld);
    return cameraPos;
};

// take the current camera pos and add the distance from current geolocation to object geolocation
// camera position is the best guess of where we are, current geolocation to three.js position
// camera position can be not in synce with current geolocation if geo is not updating when we move
// TODO: perhaps finding a geolocation from the initial geolocation and the camera position's distance from origin is better
export const calibrateObject = (
    object,
    cameraPos,
    currentLocationCoords,
    initialHeading
) => {
    // get distance from current geolocation to the object geolocation
    const { distanceInKilometers } = getDistance(currentLocationCoords, object);

    // convert into meters since arkit is in meters i think
    const distanceInMeters = distanceInKilometers * 1000;

    // bearing is used to find a new point at a distance and an angle from starting coordinates
    const { bearingInDegrees } = getBearing(currentLocationCoords, object);

    // adjust bearing based on the heading that arkit three.js space likely initialized at
    const correctedBearingInDegrees =
        bearingInDegrees - initialHeading.trueHeading;

    // converting bearing to radians is required for Math.cos and Math.sin
    const correctedBearingInRadians = turf.helpers.degreesToRadians(
        correctedBearingInDegrees
    );

    const bearingVector = new THREE.Vector3(0, 0, -1);
    const axis = new THREE.Vector3(0, 1, 0);
    bearingVector.applyAxisAngle(axis, correctedBearingInRadians);
    object.object3D.position.addVectors(
        cameraPos,
        bearingVector.multiplyScalar(distanceInMeters)
    );
};

export const placeObject3DFromCamera = (camera, object3D, distanceInMeters) => {
    const position = getCameraPosition(camera);
    const rotation = camera.getWorldRotation();
    placeObject3D(object3D, position, rotation, distanceInMeters);
};

// push object from position at angle
export const placeObject3D = (
    object3D,
    fromPosition,
    rotation,
    distanceInMeters
) => {
    object3D.position.copy(fromPosition);
    const { x, y, z } = calculatePosition(
        distanceInMeters,
        rotation.y,
        rotation.x
    );
    object3D.position.x += -1 * z;
    object3D.position.y += y;
    object3D.position.z += -1 * x;
};

// position given two angles and a distance
// https://math.stackexchange.com/questions/1385137/calculate-3d-vector-out-of-two-angles-and-vector-length
export const calculatePosition = (r, betaAngle, alphaAngle) => {
    const x = r * Math.cos(betaAngle) * Math.cos(alphaAngle);
    const y = r * Math.cos(betaAngle) * Math.sin(alphaAngle);
    const z = r * Math.sin(betaAngle);
    return { x, y, z };
};

export const castPoint = ({ locationX: x, locationY: y }) => {
    let touch = new THREE.Vector2();
    touch.set(x / width * 2 - 1, -(y / height) * 2 + 1);
    return touch;
};

export const loadOBJMTL = (urlOBJ, urlMTL, onProgress) =>
    new Promise((resolve, reject) => {
        const mtlloader = new THREE.MTLLoader();
        mtlloader.load(
            urlMTL,
            mats => {
                const objloader = new THREE.OBJLoader();
                objloader.setMaterials(mats);
                objloader.load(
                    urlOBJ,
                    object3D => {
                        resolve(object3D);
                    },
                    onProgress,
                    reject
                );
            },
            onProgress,
            reject
        );
    });

// used for raycaster intersection
// get root object3d from child intersection by making every child know the root
export const mapRootToChildren = (object3D, root) => {
    object3D.userData.root = root ? root : object3D;
    object3D.children.forEach(child => {
        mapRootToChildren(child, object3D);
    });
};
