import {
    SELECT_FURNITURE,
    LOAD_FURNITURES,
    LOAD_FURNITURE
} from '../actions/io3d';
import { RESET } from '../actions/ar';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SELECT_FURNITURE:
            return {
                ...state,
                [action.furniture.id]: action.data3dView.meshKeys.map(meshId => action.data3dView.meshes[meshId])
            };
        // TODO
        case LOAD_FURNITURES:
            return state;
        case LOAD_FURNITURE:
            return {
                ...state,
                [action.furnitureId]: action.data3dView.meshKeys.map(meshId => action.data3dView.meshes[meshId])
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
}
