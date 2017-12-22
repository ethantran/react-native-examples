import * as THREE from 'three';
import Io3dMaterial from './Io3dMaterial';
import Wireframe from './Wireframe';
import setMaterial from './setMaterial';

var WEBGL_SIDE = {
    front: 0,
    back: 1,
    both: 2
};

var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180 / Math.PI;

// shared variables

var geometry3dCache = {};

/**
 * @name three.Data3dView
 * @memberof three
 * @param options
 * @constructor
 */

function Data3dView(options) {
    // API
    this.threeParent = options.parent;

    // internals
    this.meshKeys = [];
    this.meshes = {};
    this.materialKeys = [];
    this.materials = {};
    this._meshes3d = {}; // three meshes indexed by meshId
    this._wireframes3d = {}; // wireframe  three meshes indexed by meshId
    this._materials3d = {}; // three materials indexed by meshId
}

Data3dView.prototype = {
    set: function(data3d, options) {
        // API
        options = options || {};
        var meshes = data3d.meshes || this.meshes,
            meshKeys = data3d.meshKeys,
            materials = data3d.materials || this.materials,
            materialKeys = data3d.materialKeys,
            loadingQueuePrefix =
                data3d.loadingQueuePrefix ||
                options.loadingQueuePrefix ||
                'architecture',
            onFirstTextureSetLoaded = options.onFirstTextureSetLoaded,
            lightMapIntensity = options.lightMapIntensity,
            lightMapExposure = options.lightMapExposure;

        // internals
        var self = this,
            meshId,
            mesh,
            materialId,
            wireframe3d,
            positions,
            uvs,
            uvs2,
            scale,
            normals,
            mesh3d,
            geometry3d,
            material3d,
            position,
            rotRad,
            rotDeg,
            i,
            l;

        // output
        var promise;

        ///////////////// meshes
        if (meshes) {
            // generate IDs if not provided
            if (!meshKeys) {
                meshKeys = Object.keys(meshes);
            }

            for (i = 0, l = meshKeys.length; i < l; i++) {
                meshId = meshKeys[i];
                mesh = meshes[meshId];

                // internals
                materialId = mesh.material;
                positions = mesh.positions;
                uvs = mesh.uvs;
                uvs2 = mesh.uvsLightmap;
                normals = mesh.normals;
                position = mesh.position;
                rotRad = mesh.rotRad;
                rotDeg = mesh.rotDeg;
                scale = mesh.scale;

                // three.js materials
                if (!self._materials3d[meshId]) {
                    // (one material pro mesh, because some of our mesh properties are material properties and it does not matter performance wise)
                    material3d = new Io3dMaterial();
                    material3d.name = materialId;
                    if (!materials) {
                        // there is no material properties. using default properties
                        setMaterial({
                            material3d: material3d
                        });
                    }
                    self._materials3d[meshId] = material3d;
                }

                // set face side (a mesh property in our data structure, but a material property in three.js data structure)
                self._materials3d[meshId].side =
                    WEBGL_SIDE[meshes[meshId].side] || WEBGL_SIDE.front;

                // create three.js meshes
                if (!self._meshes3d[meshId]) {
                    // create geometry
                    geometry3d = createOrReuseGeometry3d(mesh.cacheKey);
                    // create mesh
                    mesh3d = new THREE.Mesh(geometry3d, material3d);
                    // add to parent
                    self.threeParent.add(mesh3d);
                    // remembers
                    self._meshes3d[meshId] = mesh3d;

                    // create a separate geometry object for wireframes
                    wireframe3d = new Wireframe();
                    // add to parent
                    self._meshes3d[meshId].add(wireframe3d);
                    // remember
                    self._wireframes3d[meshId] = wireframe3d;
                } else {
                    mesh3d = self._meshes3d[meshId];
                    geometry3d = mesh3d.geometry;
                }

                // apply scale
                if (scale) {
                    mesh3d.scale.set(scale[0], scale[1], scale[2]);
                }

                // apply position
                if (position) {
                    mesh3d.position.set(position[0], position[1], position[2]);
                }

                // apply rotation
                if (rotRad) {
                    mesh3d.rotation.set(rotRad[0], rotRad[1], rotRad[2]);
                } else if (rotDeg) {
                    mesh3d.rotation.set(
                        rotDeg[0] * DEG_TO_RAD,
                        rotDeg[1] * DEG_TO_RAD,
                        rotDeg[2] * DEG_TO_RAD
                    );
                }

                // apply buffers if they are different than current buffers
                if (geometry3d.attributes.position === undefined) {
                    geometry3d.addAttribute(
                        'position',
                        new THREE.BufferAttribute(positions, 3)
                    );
                    // The bounding box of the scene may need to be updated
                    // self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true
                } else if (geometry3d.attributes.position.array !== positions) {
                    geometry3d.attributes.position.array = positions;
                    geometry3d.attributes.position.needsUpdate = true;
                    // Three.js needs this to update
                    geometry3d.computeBoundingSphere();
                    // The bounding box of the scene may need to be updated
                    // self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true
                }
                if (geometry3d.attributes.normal === undefined) {
                    geometry3d.addAttribute(
                        'normal',
                        new THREE.BufferAttribute(normals, 3)
                    );
                } else if (geometry3d.attributes.normal.array !== normals) {
                    geometry3d.attributes.normal.array = normals;
                    geometry3d.attributes.normal.needsUpdate = true;
                }
                // geometry3d.attributesKeys = ['position', 'normal']
                // set uvs channel 1 (material)
                if (uvs) {
                    if (geometry3d.attributes.uv === undefined) {
                        geometry3d.attributes.uv = new THREE.BufferAttribute(
                            uvs,
                            2
                        );
                    } else if (geometry3d.attributes.uv.array !== uvs) {
                        geometry3d.attributes.uv.array = uvs;
                        geometry3d.attributes.uv.needsUpdate = true;
                        // remove previous scale settings
                        delete geometry3d.attributes.uv._scaleU;
                        delete geometry3d.attributes.uv._scaleV;
                        delete geometry3d.attributes.uv._source;
                    }
                    // geometry3d.attributesKeys[ 2 ] = 'uv'
                } else if (geometry3d.attributes.uv) {
                    delete geometry3d.attributes.uv;
                }
                if (uvs2) {
                    if (geometry3d.attributes.uv2 === undefined) {
                        geometry3d.attributes.uv2 = new THREE.BufferAttribute(
                            uvs2,
                            2
                        );
                    } else if (geometry3d.attributes.uv2.array !== uvs2) {
                        geometry3d.attributes.uv2.array = uvs2;
                        geometry3d.attributes.uv2.needsUpdate = true;
                    }
                    // geometry3d.attributesKeys[ geometry3d.attributesKeys.length++ ] = 'uv2'
                } else if (geometry3d.attributes.uv2) {
                    delete geometry3d.attributes.uv2;
                }

                // (2017/01/09) The WebGL buffer of the pickingColor attribute is erroneously deleted
                // by ThreeJS (r69) in deallocateGeometry(). ThreeJS doesn't seem to account for the fact
                // that the attribute is shared by multiple geometries. It then does not get recreated, because
                // this function was attempting to manually set BufferGeometry.attributesKeys, missing any
                // extra attributes such as pickingColor.
                geometry3d.attributesKeys = Object.keys(geometry3d.attributes);

                // update wireframe

                if (materials[materialId]) {
                    self._wireframes3d[meshId].update({
                        positions: positions,
                        thickness:
                            materials[materialId].wireframeThickness ===
                            undefined
                                ? 0
                                : materials[materialId].wireframeThickness,
                        thresholdAngle:
                            materials[materialId].wireframeThresholdAngle,
                        color: materials[materialId].wireframeColor,
                        opacity: materials[materialId].wireframeOpacity
                    });
                }
            }

            // remove obsolete three.js meshes
            var mesh,
                meshIds = Object.keys(self._meshes3d);
            meshIds.forEach(function(meshId, i) {
                mesh = self._meshes3d[meshId];
                if (!meshes[meshId]) {
                    // destroy wireframe geometry
                    var wireframe3d = self._wireframes3d[meshId];
                    if (wireframe3d.parent) {
                        wireframe3d.parent.remove(wireframe3d);
                        wireframe3d.geometry.dispose();
                    }
                    // destroy geometry
                    var geometry3d = self._meshes3d[meshId].geometry;
                    disposeGeometry3dIfNotUsedElsewhere(
                        self.meshes[meshId].cacheKey,
                        geometry3d
                    );
                    // destroy threejs mesh
                    var mesh3d = self._meshes3d[meshId];
                    if (mesh3d.parent) {
                        mesh3d.parent.remove(mesh3d);
                    }
                    // destroy material
                    var material3d = self._materials3d[meshId];
                    if (material3d.map) {
                        material3d.map.disposeIfPossible();
                    }
                    if (material3d.specularMap) {
                        material3d.specularMap.disposeIfPossible();
                    }
                    if (material3d.normalMap) {
                        material3d.normalMap.disposeIfPossible();
                    }
                    if (material3d.alphaMap) {
                        material3d.alphaMap.disposeIfPossible();
                    }
                    if (material3d.lightMap) {
                        material3d.lightMap.disposeIfPossible();
                    }
                    material3d.dispose();
                    // remove reference to destroyed 3d objects
                    delete self._meshes3d[meshId];
                    delete self._wireframes3d[meshId];
                    delete self._materials3d[meshId];
                }
            });

            // update properties
            self.meshKeys = meshKeys;
            self.meshes = meshes;
        }

        ///////////////// materials

        if (materials) {
            var materialPromises = [],
                material;
            for (i = 0, l = self.meshKeys.length; i < l; i++) {
                meshId = self.meshKeys[i];
                materialId = self.meshes[meshId].material;

                // material attributes
                material = materials[materialId];
                if (material && Object.keys(material).length) {
                    // set material
                    materialPromises[i] = setMaterial({
                        vm: self.vm,
                        loadingQueuePrefix: loadingQueuePrefix,
                        mesh3d: self._meshes3d[meshId],
                        material3d: self._materials3d[meshId],
                        attributes: materials[materialId],
                        onFirstTextureSetLoaded: onFirstTextureSetLoaded,
                        lightMapIntensity: lightMapIntensity,
                        lightMapExposure: lightMapExposure
                    });
                }
            }

            // output
            promise = Promise.all(materialPromises);

            // update properties
            self.materialKeys = materialKeys;
            self.materials = materials;
        }

        ///////////////// return

        return promise ? promise : Promise.resolve();
    },

    hasMeshes: function hasMeshes() {
        return Object.keys(this._meshes3d).length > 0;
    },

    setMeshes: function(meshes) {
        this.set({
            meshes: meshes
        });
    },

    setMaterials: function(materials, options) {
        this.set(
            {
                materials: materials
            },
            options
        );
    },

    reset: function() {
        this.set({
            meshes: {},
            materials: {}
        });
    },

    destroy: function() {
        this.isDestroyed = true;

        this.reset();

        this.threeParent = null;

        // internals
        this.meshKeys = null;
        this.meshes = null;
        this.materialKeys = null;
        this.materials = null;
        this._meshes3d = null;
        this._materials3d = null;
    }
};

// helpers

function createOrReuseGeometry3d(key) {
    if (key) {
        // use cache
        if (geometry3dCache[key]) {
            geometry3dCache[key].refCount++;
        } else {
            geometry3dCache[key] = {
                geometry3d: new THREE.BufferGeometry(),
                refCount: 1
            };
        }
        return geometry3dCache[key].geometry3d;
    } else {
        // no key no cache
        return new THREE.BufferGeometry();
    }
}

function disposeGeometry3dIfNotUsedElsewhere(key, geometry3d) {
    if (key) {
        // involve cache
        if (geometry3dCache[key]) {
            geometry3dCache[key].refCount--;
            if (geometry3dCache[key].refCount < 1) {
                geometry3dCache[key].geometry3d.dispose();
                delete geometry3dCache[key];
            }
        } else {
            // (2017/01/09) See comment in ThreeView.set()
            // if (geometry3d.attributes.pickingColor)
            //  delete geometry3d.attributes['pickingColor'];
            geometry3d.dispose();
        }
    } else {
        // no key bo cache
        // (2017/01/09) See comment in ThreeView.set()
        // if (geometry3d.attributes.pickingColor)
        //   delete geometry3d.attributes['pickingColor'];
        geometry3d.dispose();
    }
}

export default Data3dView;
