import * as THREE from 'three';
import { addObjectAtHeading, removeObject, deselect } from './ar';

export const HUD_RESIZE = 'hudSelection/RESIZE';
export const HUD_CLOSE = 'hudSelection/CLOSE';

export const resize = () => ({ type: HUD_RESIZE });
export const translate = addObjectAtHeading;
export const scaleUp = (object, value = 1) => dispatch => {
    object.object3D.scale.set(
        object.object3D.scale.x + object.object3D.scale.x * 0.1,
        object.object3D.scale.y + object.object3D.scale.y * 0.1,
        object.object3D.scale.z + object.object3D.scale.z * 0.1
    );
};
export const scaleDown = (object, value = 1) => dispatch => {
    object.object3D.scale.set(
        object.object3D.scale.x - object.object3D.scale.x * 0.1,
        object.object3D.scale.y - object.object3D.scale.y * 0.1,
        object.object3D.scale.z - object.object3D.scale.z * 0.1
    );
};
export const rotateLeft = object => (dispatch, getState) => {
    const { three: { camera } } = getState();
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        object.object3D.position
    );
    // const coplanarPoint = plane.coplanarPoint();
    // const focalPoint = new THREE.Vector3().copy(coplanarPoint).add(plane.normal);
    object.object3D.rotateOnAxis(plane.normal, -0.1);
};
export const rotateRight = object => (dispatch, getState) => {
    const { three: { camera } } = getState();
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        object.object3D.position
    );
    object.object3D.rotateOnAxis(plane.normal, 0.1);
};
export const copy = object => dispatch => {
    const newObject = {
        ...object,
        object3D: object.object3D.clone()
    };
    dispatch(addObjectAtHeading(newObject));
};
/**
 * Remove object3D from scene and object from store
 */
export const remove = object => (dispatch, getState) => {
    dispatch(removeObject(object));
    dispatch(close());
};
export const close = () => dispatch => {
    dispatch(deselect());
    dispatch({ type: HUD_CLOSE });
};
