import * as THREE from 'three';

require('three/examples/js/loaders/OBJLoader');
require('../../../loaders/MTLLoader');

import { addObjectAtHeading, selectObject } from './ar';
import { setProgress, closeProgress } from './progress';
import { POLY_API_KEY } from '../constants';
import { loadOBJMTL } from '../utils';
import Poly from '../../../Poly';

export const LIST_ASSETS = 'poly/LIST_ASSETS';
export const LIST_ASSETS_SUCCESS = 'poly/LIST_ASSETS_SUCCESS';
export const LIST_ASSETS_ERROR = 'poly/LIST_ASSETS_ERROR';

export const LOAD_MORE = 'poly/LOAD_MORE';
export const LOAD_MORE_SUCCESS = 'poly/LOAD_MORE_SUCCESS';
export const LOAD_MORE_ERROR = 'poly/LOAD_MORE_ERROR';

export const OPEN = 'poly/OPEN';
export const CLOSE = 'poly/CLOSE';

export const SELECT_ASSET = 'poly/SELECT_ASSET';

export const LOAD_ASSET = 'poly/LOAD_ASSET';
export const LOAD_ASSETS = 'poly/LOAD_ASSETS';

export const listAssets = keywords => async dispatch => {
    try {
        dispatch({ type: LIST_ASSETS });
        const results = await Poly.listAssets({
            key: POLY_API_KEY,
            keywords
        });
        const assets = results.assets.filter(asset =>
            asset.formats.find(format => format.formatType === 'OBJ')
        );
        dispatch({
            type: LIST_ASSETS_SUCCESS,
            results,
            assets
        });
        return {
            results,
            assets
        };
    } catch (error) {
        dispatch({ type: LIST_ASSETS_ERROR, error });
        throw error;
    }
};

export const loadMore = params => async (dispatch, getState) => {
    try {
        dispatch({ type: LOAD_MORE });
        const { nextPageToken } = getState().poly;
        const results = await Poly.listAssets({
            key: POLY_API_KEY,
            pageToken: nextPageToken
        });
        const assets = results.assets.filter(asset =>
            asset.formats.find(format => format.formatType === 'OBJ')
        );
        dispatch({
            type: LOAD_MORE_SUCCESS,
            results,
            assets
        });
        return {
            results,
            assets
        };
    } catch (error) {
        dispatch({ type: LOAD_MORE_ERROR, error });
        throw error;
    }
};

export const selectAsset = asset => async (dispatch, getState) => {
    const { polyObject3Ds } = getState();
    const polyObject3D = polyObject3Ds[asset.name];
    if (polyObject3D) {
        const clone = polyObject3D.clone();
        const object = {
            type: 'poly',
            object3D: clone,
            asset
        };
        dispatch({ type: SELECT_ASSET, asset });
        dispatch(addObjectAtHeading(object));
        dispatch(selectObject(object));
        dispatch(closeProgress());
        dispatch(close());
        return;
    }
    const handleLoaderProgress = xhr => {
        dispatch(setProgress(xhr.loaded / xhr.total * 100));
    };
    const objFormat = asset.formats.find(format => format.formatType === 'OBJ');
    if (objFormat) {
        const urlOBJ = objFormat.root.url;
        const urlMTL = objFormat.resources[0].url;
        try {
            const object3D = await loadOBJMTL(
                urlOBJ,
                urlMTL,
                handleLoaderProgress
            );
            const object = {
                type: 'poly',
                object3D: object3D.clone(),
                asset
            };
            dispatch({ type: SELECT_ASSET, asset, object3D });
            dispatch(addObjectAtHeading(object));
            dispatch(selectObject(object));
            dispatch(closeProgress());
            dispatch(close());
        } catch (error) {
            console.error(error);
            dispatch(closeProgress());
            throw error;
        }
    } else {
        console.error('Asset must have an obj format');
        return;
    }
    // const downloadResumable = FileSystem.createDownloadResumable(
    //     objFormat.root.url,
    //     FileSystem.documentDirectory + objFormat.root.relativePath,
    //     {},
    //     this.handleRemoteDownload
    // );
    // console.log('remote downloading root');
    // const rootDownload = await downloadResumable.downloadAsync();
    // console.log(rootDownload);
    // console.log('remote downloading resources');
    // const resourceDownloads = await Promise.all(
    //     objFormat.resources.map(
    //         async resource =>
    //             await FileSystem.createDownloadResumable(
    //                 resource.url,
    //                 FileSystem.documentDirectory + resource.relativePath,
    //                 {},
    //                 this.handleRemoteDownload
    //             ).downloadAsync()
    //     )
    // );
    // console.log(resourceDownloads);
    // console.log('remote downloading complete');
    // console.log('local downloading root');
    // console.log('load uris', [
    //     rootDownload.uri,
    //     ...resourceDownloads.map(download => download.uri)
    // ]);
    // const object3D = await ExpoTHREE.loadAsync(
    //     [
    //         rootDownload.uri,
    //         ...resourceDownloads.map(download => download.uri)
    //     ],
    //     this.handleLocalDownload
    // );
    // console.log('local downloading complete');
    // console.log('apply materials');
    // object3D.traverse(async child => {
    //     if (child instanceof THREE.Mesh) {
    //         /// Smooth geometry
    //         const tempGeo = new THREE.Geometry().fromBufferGeometry(
    //             child.geometry
    //         );
    //         tempGeo.mergeVertices();
    //         // after only mergeVertices my textrues were turning black so this fixed normals issues
    //         tempGeo.computeVertexNormals();
    //         tempGeo.computeFaceNormals();
    //         child.geometry = new THREE.BufferGeometry().fromGeometry(
    //             tempGeo
    //         );
    //         child.material.shading = THREE.SmoothShading;
    //         child.material.side = THREE.FrontSide;
    //     }
    // });
    // this.addCustomDestination({ object3D });
    // this.setState({
    //     polySelection: { object3D },
    //     showDownloadProgress: false
    // });

    // const object3D = await ExpoTHREE.loadAsync(
    //     [
    //         objFormat.root.url,
    //         ...objFormat.resources.map(resource => resource.url)
    //     ],
    //     this.handleLocalDownload
    // );
    // this.addCustomDestination({ object3D });
    // this.setState({
    //     polySelection: { object3D },
    //     showDownloadProgress: false
    // });
};

export const open = () => ({ type: OPEN });
export const close = () => ({ type: CLOSE });

export const loadAssets = () => async (dispatch, getState) => {
    const { poly: { loadedAssets } } = getState();
    let object3Ds = {};
    try {
        for (let assetName in loadedAssets) {
            const asset = loadedAssets[assetName];
            const objFormat = asset.formats.find(
                format => format.formatType === 'OBJ'
            );
            const urlOBJ = objFormat.root.url;
            const urlMTL = objFormat.resources[0].url;
            const object3D = await loadOBJMTL(urlOBJ, urlMTL);
            object3Ds[assetName] = object3D;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    dispatch({ type: LOAD_ASSETS, object3Ds });
};
export const loadAsset = assetName => async (dispatch, getState) => {
    const { poly: { loadedAssets } } = getState();
    const asset = loadedAssets[assetName];
    const objFormat = asset.formats.find(format => format.formatType === 'OBJ');
    const urlOBJ = objFormat.root.url;
    const urlMTL = objFormat.resources[0].url;
    try {
        const object3D = await loadOBJMTL(urlOBJ, urlMTL);
        dispatch({ type: LOAD_ASSET, object3D, assetName });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
