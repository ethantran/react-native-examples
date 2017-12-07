import { addObjectAtHeading, removeObject } from './ar';

export const HUD_RESIZE = 'hudSelection/RESIZE';
export const HUD_CLOSE = 'hudSelection/CLOSE';

export const resize = () => ({ type: HUD_RESIZE });
export const scaleUp = mesh => {
    mesh.set(mesh.scale.x + 1, mesh.scale.y + 1, mesh.scale.z + 1);
};
export const scaleDown = mesh => {
    mesh.set(mesh.scale.x - 1, mesh.scale.y - 1, mesh.scale.z - 1);
};
export const copy = selection => dispatch => {
    let object = {};
    object.type = selection.type;
    object.mesh = selection.mesh.clone();
    dispatch(addObjectAtHeading(object));
};
/**
 * Remove mesh from scene and object from store
 */
export const remove = selection => (dispatch, getState) => {
    const { three: { scene } } = getState();
    scene.remove(selection.mesh);
    dispatch(removeObject(selection));
};
export const close = () => ({ type: HUD_CLOSE });
