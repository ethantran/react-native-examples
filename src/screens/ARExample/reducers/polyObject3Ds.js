/**
 * Once a poly asset is turned into an object3d using a loader you can clone it instead of using a loader again
 */
import { SELECT_ASSET, LOAD_ASSETS, LOAD_ASSET } from '../actions/poly';
import { RESET } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SELECT_ASSET:
            return {
                ...state,
                [action.asset.name]: action.object3D
            };
        case LOAD_ASSETS:
            return {
                ...state,
                ...action.object3Ds
            };
        case LOAD_ASSET:
            return {
                ...state,
                [action.assetName]: action.object3D
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
