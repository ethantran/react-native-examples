import { addObjectAtHeading, removeObject } from './ar';

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
export const copy = selectedObject => dispatch => {
    const object = {
        ...selectedObject,
        object3D: selectedObject.object3D.clone()
    };
    dispatch(addObjectAtHeading(object));
};
/**
 * Remove object3D from scene and object from store
 */
export const remove = selectedObject => (dispatch, getState) => {
    const { three: { scene } } = getState();
    scene.remove(selectedObject.object3D);
    dispatch(removeObject(selectedObject));
};
export const close = () => ({ type: HUD_CLOSE });
