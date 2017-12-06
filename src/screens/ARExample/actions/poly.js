import * as THREE from 'three';

require('three/examples/js/loaders/OBJLoader');
require('../../../loaders/MTLLoader');

import { addObject, selectObject } from './ar';
import { setProgress, closeProgress } from './progress';
import { POLY_API_KEY } from '../constants';
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

export const selectAsset = asset => dispatch => {
    const handleLoaderProgress = xhr => {
        dispatch(setProgress(xhr.loaded / xhr.total * 100));
    };

    const handleLoaderError = error => {
        console.error(error);
        dispatch(closeProgress());
    };
    const objFormat = asset.formats.find(format => format.formatType === 'OBJ');
    if (objFormat) {
        const urlOBJ = objFormat.root.url;
        const urlMTL = objFormat.resources[0].url;
        const mtlloader = new THREE.MTLLoader();
        mtlloader.load(
            urlMTL,
            mats => {
                const objloader = new THREE.OBJLoader();
                objloader.setMaterials(mats);
                objloader.load(
                    urlOBJ,
                    mesh => {
                        const object = {
                            type: 'poly',
                            mesh,
                            asset
                        };
                        dispatch(selectObject(object));
                        dispatch(closeProgress());
                        dispatch(close());
                    },
                    handleLoaderProgress,
                    handleLoaderError
                );
            },
            handleLoaderProgress,
            handleLoaderError
        );
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
    // const mesh = await ExpoTHREE.loadAsync(
    //     [
    //         rootDownload.uri,
    //         ...resourceDownloads.map(download => download.uri)
    //     ],
    //     this.handleLocalDownload
    // );
    // console.log('local downloading complete');
    // console.log('apply materials');
    // mesh.traverse(async child => {
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
    // this.addCustomDestination({ mesh });
    // this.setState({
    //     polySelection: { mesh },
    //     showDownloadProgress: false
    // });

    // const mesh = await ExpoTHREE.loadAsync(
    //     [
    //         objFormat.root.url,
    //         ...objFormat.resources.map(resource => resource.url)
    //     ],
    //     this.handleLocalDownload
    // );
    // this.addCustomDestination({ mesh });
    // this.setState({
    //     polySelection: { mesh },
    //     showDownloadProgress: false
    // });
};

export const open = () => ({ type: OPEN });
export const close = () => ({ type: CLOSE });
