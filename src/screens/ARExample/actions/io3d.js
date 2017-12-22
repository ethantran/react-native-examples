import Data3dView from '../3dio/Data3dView';
import getFurniture from '../3dio/getFurniture';
import searchFurniture from '../3dio/searchFurniture';

import { addObjects } from './ar';

const loadFurniture = async (furniture, id) => {
    const result = await getFurniture(id);
    console.log('loadFurniture', result)
    furniture.set(result.data3d);
};

export const LIST_FURNITURES = 'io3d/LIST_FURNITURES';
export const LIST_FURNITURES_SUCCESS = 'io3d/LIST_FURNITURES_SUCCESS';
export const LIST_FURNITURES_ERROR = 'io3d/LIST_FURNITURES_ERROR';

export const LOAD_MORE = 'io3d/LOAD_MORE';
export const LOAD_MORE_SUCCESS = 'io3d/LOAD_MORE_SUCCESS';
export const LOAD_MORE_ERROR = 'io3d/LOAD_MORE_ERROR';

export const OPEN = 'io3d/OPEN';
export const CLOSE = 'io3d/CLOSE';

export const SELECT_FURNITURE = 'io3d/SELECT_FURNITURE';
export const SELECT_FURNITURE_REQUEST = 'io3d/SELECT_FURNITURE_REQUEST';
export const SELECT_FURNITURE_ERROR = 'io3d/SELECT_FURNITURE_ERROR';

export const listFurnitures = query => async dispatch => {
    try {
        dispatch({ type: LIST_FURNITURES });
        const furnitures = await searchFurniture(query);
        dispatch({
            type: LIST_FURNITURES_SUCCESS,
            furnitures
        });
        return furnitures;
    } catch (error) {
        dispatch({ type: LIST_FURNITURES_ERROR, error });
        throw error;
    }
};

export const selectFurniture = furniture => async (dispatch, getState) => {
    const { three: { scene } } = getState();
    const data3dView = new Data3dView({ parent: scene });
    try {
        dispatch({ type: SELECT_FURNITURE_REQUEST });
        await loadFurniture(data3dView, furniture.id);
        dispatch({ type: SELECT_FURNITURE, data3dView, furniture });
        return { data3dView, furniture };
    } catch (error) {
        dispatch({ type: SELECT_FURNITURE_ERROR, error });
        throw error;
    }
};

export const open = () => ({ type: OPEN });
export const close = () => ({ type: CLOSE });
