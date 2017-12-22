/*

 PERFORMANCE CRITICAL CODE

 readability may suffer from performance optimization
 ask tomas-polach if you have questions

*/

import fetchTexture from './fetchTexture';
import * as THREE from 'three';

// static method, @memberof View

// constants

var THREEJS_TEXTURE_TYPES_MAP = {
    // hi-res textures
    mapDiffuse: 'map',
    mapSpecular: 'specularMap',
    mapNormal: 'normalMap',
    mapAlpha: 'alphaMap',
    mapLight: 'lightMap',
    // lo-res textures
    mapDiffusePreview: 'map',
    mapSpecularPreview: 'specularMap',
    mapNormalPreview: 'normalMap',
    mapAlphaPreview: 'alphaMap',
    mapLightPreview: 'lightMap'
};
var WEBGL_WRAP_TYPES = {
    repeat: 1000,
    mirror: 1002,
    clamp: 1001
};
// RepeatWrapping: 1000 / ClampToEdgeWrapping: 1001 / MirroredRepeatWrapping: 1002

// helpers

function onError(e) {
    console.error('Texture could not been loaded: ', e);
}

var textureRefCount = {};

function countTextureReference(key) {
    if (key !== undefined) {
        if (textureRefCount[key]) {
            textureRefCount[key]++;
        } else {
            textureRefCount[key] = 1;
        }
    }
}

function disposeIfPossible() {
    var texture3d = this;
    var key = this.url;
    if (key) {
        if (textureRefCount[key]) {
            textureRefCount[key]--;
            if (textureRefCount[key] === 0) {
                //          console.log('dispose texture', texture3d.url)
                texture3d.dispose();
                //          texture3d.needsUpdate = true
            }
        } else {
            //        console.warn('texture not in cache ' + key)
            texture3d.dispose();
        }
    } else {
        texture3d.dispose();
        //      texture3d.needsUpdate = true
    }
}

// class

export default function loadTextureSet(
    queueName,
    TEXTURE_TYPES,
    vm,
    _attributes,
    material3d,
    mesh3d,
    resetTexturesOnLoadStart
) {
    // new textures

    var texture3dKeys = [],
        textureKeys = [],
        texturePromises = [],
        textureCount = 0,
        textureS3Key,
        texture3d,
        textureType3d,
        textureType,
        needsUpdate,
        hasUv1Textures = false,
        geometry3d = mesh3d ? mesh3d.geometry : null,
        attributes3d = geometry3d ? geometry3d.attributes : null,
        hasUvVertices =
            attributes3d && attributes3d.uv && attributes3d.uv.count > 0,
        hasUv2Vertices =
            attributes3d && attributes3d.uv2 && attributes3d.uv2.count > 0,
        i,
        l;

    // UV1 textures

    for (i = 0, l = TEXTURE_TYPES.UV1.length; i < l; i++) {
        textureType = TEXTURE_TYPES.UV1[i];
        textureS3Key = _attributes[textureType];
        textureType3d = THREEJS_TEXTURE_TYPES_MAP[textureType];
        texture3d = material3d[textureType3d];

        if (textureS3Key) {
            if (hasUvVertices) {
                hasUv1Textures = true;
            } else {
                console.error(
                    'Texture ' +
                        textureS3Key +
                        ' could not be assigned because geometry has no UV vertices.'
                );
                continue;
            }
        }

        if (textureS3Key) {
            needsUpdate = true;

            // update wrap
            wrap =
                WEBGL_WRAP_TYPES[_attributes.wrap] ||
                WEBGL_WRAP_TYPES.repeat;
            if (texture3d && wrap !== texture3d.wrapS) {
                texture3d.wrapS = wrap;
                texture3d.wrapT = wrap;
                texture3d.needsUpdate = true;
            }

            // don't reload texture if files are of same origin
            if (texture3d && texture3d.url && textureS3Key === texture3d.url) {
                needsUpdate = false;
            }

            if (needsUpdate && texture3d && resetTexturesOnLoadStart) {
                // dispose old texture
                if (
                    material3d[textureType3d] &&
                    material3d[textureType3d].disposeIfPossible
                ) {
                    material3d[textureType3d].disposeIfPossible();
                }
                material3d[textureType3d] = null;
            }

            if (needsUpdate) {
                // load new texture
                texturePromises[textureCount] = fetchTexture(
                    textureS3Key,
                    queueName
                ).catch(onError);
                textureKeys[textureCount] = textureType;
                texture3dKeys[textureCount] = textureType3d;
                textureCount++;
                material3d.needsUpdate = true;
            }
        } else if (material3d[textureType3d]) {
            // no new texture: just dispose old texture
            if (
                material3d[textureType3d] &&
                material3d[textureType3d].disposeIfPossible
            ) {
                material3d[textureType3d].disposeIfPossible();
            }
            material3d[textureType3d] = null;
            material3d.needsUpdate = true;
        }
    }

    // UV1 vectors

    if (attributes3d) {
        // UV channel 1

        if (hasUv1Textures) {
            // resize UV array

            if (_attributes.size) {
                var targetScaleU = _attributes.size[0],
                    targetScaleV = _attributes.size[1],
                    currentScaleU = attributes3d.uv._scaleU || 1,
                    currentScaleV = attributes3d.uv._scaleV || 1;
                // check if uv recalculation is needed
                if (
                    targetScaleU !== currentScaleU ||
                    targetScaleV !== currentScaleV
                ) {
                    // remember original uv array
                    if (!attributes3d.uv._source) {
                        attributes3d.uv._source = attributes3d.uv.array;
                    }
                    // internals
                    var sourceUVs = attributes3d.uv._source,
                        resizedUVs = new Float32Array(sourceUVs.length);
                    // resize array
                    for (var i = 0, l = resizedUVs.length; i < l; i += 2) {
                        resizedUVs[i] = sourceUVs[i] / targetScaleU;
                        resizedUVs[i + 1] = sourceUVs[i + 1] / targetScaleV;
                    }
                    // set resized array
                    attributes3d.uv.array = resizedUVs;
                    // remember size
                    attributes3d.uv._scaleU = targetScaleU;
                    attributes3d.uv._scaleV = targetScaleV;
                    // set update flag
                    attributes3d.uv.needsUpdate = true;
                }
            }
        }

        // UV channel 2

        if (_attributes[TEXTURE_TYPES.UV2]) {
            // check uv count
            if (hasUv2Vertices) {
                // everything ok - load lightmap
                textureType = TEXTURE_TYPES.UV2;
                textureS3Key = _attributes[textureType];
                texturePromises[textureCount] = fetchTexture(
                    textureS3Key,
                    queueName
                ).catch(onError);
                textureKeys[textureCount] = textureType;
                texture3dKeys[textureCount] =
                    THREEJS_TEXTURE_TYPES_MAP[textureType];
                textureCount++;
            } else {
                console.error(
                    'Lightmap ' +
                        _attributes[TEXTURE_TYPES.UV2] +
                        ' could not be assigned because geometry has no lightmap UV (UV2) vertices.'
                );
            }
        }
    }

    // load textures

    var promise, wrap, isTexture, isTextureToBeLoadedNext;
    if (textureCount) {
        promise = Promise.all(texturePromises).then(function(textures) {
            // assign textures
            wrap =
                WEBGL_WRAP_TYPES[_attributes.wrap] ||
                WEBGL_WRAP_TYPES.repeat;
            for (i = 0; i < textureCount; i++) {
                // filter texture loading errors
                isTexture =
                    textures[i] instanceof THREE.CompressedTexture ||
                    textures[i] instanceof THREE.Texture;
                // avoid racing conditions
                isTextureToBeLoadedNext =
                    textures[i] &&
                    textures[i].url ===
                        material3d._texturesToBeLoaded[textureKeys[i]];

                if (!isTexture || !isTextureToBeLoadedNext) {continue;}

                // cache
                countTextureReference(textures[i].url);
                textures[i].disposeIfPossible = disposeIfPossible;

                // set texture settings
                textures[i].wrapS = wrap;
                textures[i].wrapT = wrap;
                textures[i].anisotropy = 2;
                // dispose previous texture
                if (
                    material3d[texture3dKeys[i]] &&
                    material3d[texture3dKeys[i]].disposeIfPossible
                ) {
                    material3d[texture3dKeys[i]].disposeIfPossible();
                }
                // add new texture
                material3d[texture3dKeys[i]] = textures[i];
                material3d.uniforms[texture3dKeys[i]].value = textures[i];
                material3d[texture3dKeys[i]].needsUpdate = true;
            }
            // update material
            material3d.needsUpdate = true;

            // to prevent warnings: "GL ERROR :GL_INVALID_OPERATION : glDrawElements: attempt to access out of range vertices in attribute 1 "
            // this happens when switching from a material without texture to a material with texture or vice versa
            if (mesh3d && mesh3d.geometry) {
                mesh3d.geometry.buffersNeedUpdate = true;
                mesh3d.geometry.uvsNeedUpdate = true;
            }

            // render
            if (vm) {vm.viewport.render();}
        });
    } else {
        promise = Promise.resolve();

        // render
        if (vm) {vm.viewport.render();}
    }

    return promise;
}
