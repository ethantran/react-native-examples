import {
    LIST_FURNITURES,
    LIST_FURNITURES_SUCCESS,
    LIST_FURNITURES_ERROR,
    LOAD_MORE,
    LOAD_MORE_SUCCESS,
    LOAD_MORE_ERROR,
    OPEN,
    CLOSE,
    SELECT_FURNITURE,
    SELECT_FURNITURE_REQUEST,
    SELECT_FURNITURE_ERROR
} from '../actions/io3d';
import { RESET } from '../actions/ar';

const initialState = {
    furnitures: [],
    loadedFurnitures: {},
    loading: false,
    loadingMore: false,
    visible: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LIST_FURNITURES:
            return {
                ...state,
                loading: true
            };
        case LIST_FURNITURES_SUCCESS:
            return {
                ...state,
                furnitures: action.furnitures,
                loading: false
            };
        case LIST_FURNITURES_ERROR:
            return {
                ...state,
                error: action.error,
                loading: false
            };
        case LOAD_MORE:
            return {
                ...state,
                loadingMore: true
            };
        case LOAD_MORE_SUCCESS:
            return {
                ...state,
                furnitures: [...state.furnitures, ...action.furnitures],
                loadingMore: false
            };
        case LOAD_MORE_ERROR:
            return {
                ...state,
                error: action.error,
                loadingMore: false
            };
        case OPEN:
            return {
                ...state,
                visible: true
            };
        case CLOSE:
            return {
                ...state,
                visible: false
            };
        case SELECT_FURNITURE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case SELECT_FURNITURE_ERROR:
            return {
                loading: false,
                error: action.error
            };
        case SELECT_FURNITURE:
            return {
                ...state,
                loading: false,
                loadedFurnitures: {
                    ...state.loadedFurnitures,
                    [action.furniture.id]: action.furniture
                },
                error: null
            };
        case RESET:
            return {
                ...state,
                loading: false,
                loadingMore: false,
                visible: false
            };
        default:
            return state;
    }
}
