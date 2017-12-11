import {
    LIST_ASSETS,
    LIST_ASSETS_SUCCESS,
    LIST_ASSETS_ERROR,
    LOAD_MORE,
    LOAD_MORE_SUCCESS,
    LOAD_MORE_ERROR,
    OPEN,
    CLOSE
} from '../actions/poly';
import { RESET } from '../actions/ar';

const initialState = {
    assets: [],
    loading: false,
    loadingMore: false,
    visible: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LIST_ASSETS:
            return {
                ...state,
                loading: true
            };
        case LIST_ASSETS_SUCCESS:
            return {
                ...state,
                ...action.results,
                assets: action.assets,
                loading: false
            };
        case LIST_ASSETS_ERROR:
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
                ...action.results,
                assets: [...state.assets, ...action.assets],
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
