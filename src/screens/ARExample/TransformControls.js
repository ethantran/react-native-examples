import * as THREE from 'three';
import { Dimensions } from 'react-native';

export default function TransformControls(camera) {
    // TODO: Make non-uniform scale and rotate play nice in hierarchies
    // TODO: ADD RXYZ contol

    THREE.Object3D.call(this);

    this.object = undefined;
    this.translationSnap = null;
    this.rotationSnap = null;
    this.space = 'world';
    this.size = 1;
    this.axis = null;

    var scope = this;

    var _mode = 'translate';

    var ray = new THREE.Raycaster();
    var pointerVector = new THREE.Vector2();

    var point = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var startTouchData = {
        point0: new THREE.Vector2(),
        point1: new THREE.Vector2(),
        angleRadians: 0,
        vector: new THREE.Vector2(),
        distance: 0
    };
    var endTouchData = {
        point0: new THREE.Vector2(),
        point1: new THREE.Vector2(),
        angleRadians: 0,
        vector: new THREE.Vector2(),
        distance: 0
    };

    var rotation = new THREE.Vector3();
    var offsetRotation = new THREE.Vector3();
    var scale = 1;

    var lookAtMatrix = new THREE.Matrix4();
    var eye = new THREE.Vector3();

    var tempMatrix = new THREE.Matrix4();
    var tempVector = new THREE.Vector3();
    var tempQuaternion = new THREE.Quaternion();
    var unitX = new THREE.Vector3(1, 0, 0);
    var unitY = new THREE.Vector3(0, 1, 0);
    var unitZ = new THREE.Vector3(0, 0, 1);

    var quaternionXYZ = new THREE.Quaternion();
    var quaternionX = new THREE.Quaternion();
    var quaternionY = new THREE.Quaternion();
    var quaternionZ = new THREE.Quaternion();
    var quaternionE = new THREE.Quaternion();

    var oldPosition = new THREE.Vector3();
    var oldScale = new THREE.Vector3();
    var oldRotationMatrix = new THREE.Matrix4();

    var parentRotationMatrix = new THREE.Matrix4();
    var parentScale = new THREE.Vector3();

    var worldPosition = new THREE.Vector3();
    var worldRotation = new THREE.Euler();
    var worldRotationMatrix = new THREE.Matrix4();
    var camPosition = new THREE.Vector3();
    var camRotation = new THREE.Euler();

    var plane = new THREE.Plane();

    this.dispose = function() {};

    this.attach = function(object) {
        this.object = object;
    };

    this.detach = function() {
        this.object = undefined;
    };

    this.getMode = function() {
        return _mode;
    };

    this.setMode = function(mode) {
        _mode = mode ? mode : _mode;

        if (_mode === 'scale') {
            scope.space = 'local';
        }

        scope.triggerUpdate = true;
    };

    this.setTranslationSnap = function(translationSnap) {
        scope.translationSnap = translationSnap;
    };

    this.setRotationSnap = function(rotationSnap) {
        scope.rotationSnap = rotationSnap;
    };

    this.setSize = function(size) {
        scope.size = size;
        scope.triggerUpdate = true;
    };

    this.setSpace = function(space) {
        scope.space = space;
        scope.triggerUpdate = true;
    };

    this.update = function() {
        if (!scope.triggerUpdate) {
            return;
        }
        scope.triggerUpdate = false;

        if (scope.object === undefined) {
            return;
        }

        scope.object.updateMatrixWorld();
        worldPosition.setFromMatrixPosition(scope.object.matrixWorld);
        worldRotation.setFromRotationMatrix(
            tempMatrix.extractRotation(scope.object.matrixWorld)
        );

        camera.updateMatrixWorld();
        camPosition.setFromMatrixPosition(camera.matrixWorld);
        camRotation.setFromRotationMatrix(
            tempMatrix.extractRotation(camera.matrixWorld)
        );

        scale = worldPosition.distanceTo(camPosition) / 6 * scope.size;
        this.position.copy(worldPosition);
        this.scale.set(scale, scale, scale);

        if (camera instanceof THREE.PerspectiveCamera) {
            eye
                .copy(camPosition)
                .sub(worldPosition)
                .normalize();
        } else if (camera instanceof THREE.OrthographicCamera) {
            eye.copy(camPosition).normalize();
        }
    };

    this.handlePanResponderGrant = function(event, gestureState) {
        if (event.nativeEvent.touches.length === 2) {
            startTouchData = getTouchData(event, gestureState);
            offset.copy(startTouchData.vector);

            eye
                .copy(camPosition)
                .sub(worldPosition)
                .normalize();

            oldPosition.copy(scope.object.position);
            oldScale.copy(scope.object.scale);

            oldRotationMatrix.extractRotation(scope.object.matrix);
            worldRotationMatrix.extractRotation(scope.object.matrixWorld);

            parentRotationMatrix.extractRotation(
                scope.object.parent.matrixWorld
            );
            parentScale.setFromMatrixScale(
                tempMatrix.getInverse(scope.object.parent.matrixWorld)
            );

            plane.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(plane.normal),
                scope.object.position
            );
        }
    };

    function translate() {
        point.sub(offset);
        point.multiply(parentScale);

        if (scope.space === 'local') {
            point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

            // if (scope.axis.search('X') === -1) {
            //     point.x = 0;
            // }
            // if (scope.axis.search('Y') === -1) {
            //     point.y = 0;
            // }
            // if (scope.axis.search('Z') === -1) {
            //     point.z = 0;
            // }

            point.applyMatrix4(oldRotationMatrix);

            scope.object.position.copy(oldPosition);
            scope.object.position.add(point);
        }

        if (scope.space === 'world' /*|| scope.axis.search('XYZ') !== -1*/) {
            // if (scope.axis.search('X') === -1) {
            //     point.x = 0;
            // }
            // if (scope.axis.search('Y') === -1) {
            //     point.y = 0;
            // }
            // if (scope.axis.search('Z') === -1) {
            //     point.z = 0;
            // }

            point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix));

            scope.object.position.copy(oldPosition);
            scope.object.position.add(point);
        }

        if (scope.translationSnap !== null) {
            if (scope.space === 'local') {
                scope.object.position.applyMatrix4(
                    tempMatrix.getInverse(worldRotationMatrix)
                );
            }

            if (scope.axis.search('X') !== -1) {
                scope.object.position.x =
                    Math.round(
                        scope.object.position.x / scope.translationSnap
                    ) * scope.translationSnap;
            }
            if (scope.axis.search('Y') !== -1) {
                scope.object.position.y =
                    Math.round(
                        scope.object.position.y / scope.translationSnap
                    ) * scope.translationSnap;
            }
            if (scope.axis.search('Z') !== -1) {
                scope.object.position.z =
                    Math.round(
                        scope.object.position.z / scope.translationSnap
                    ) * scope.translationSnap;
            }

            if (scope.space === 'local') {
                scope.object.position.applyMatrix4(worldRotationMatrix);
            }
        }
    }

    function scaleOneAxisOnMove() {
        point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

        if (scope.axis === 'X') {
            scope.object.scale.x = oldScale.x * (1 + point.x / oldScale.x);
        }
        if (scope.axis === 'Y') {
            scope.object.scale.y = oldScale.y * (1 + point.y / oldScale.y);
        }
        if (scope.axis === 'Z') {
            scope.object.scale.z = oldScale.z * (1 + point.z / oldScale.z);
        }
    }

    function scaleOnMove() {
        scale = endTouchData.distance / startTouchData.distance;
        scope.object.scale.x = oldScale.x * scale;
        scope.object.scale.y = oldScale.y * scale;
        scope.object.scale.z = oldScale.z * scale;
    }

    function rotateEAxis() {
        point.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));
        tempVector.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));

        rotation.set(
            Math.atan2(point.z, point.y),
            Math.atan2(point.x, point.z),
            Math.atan2(point.y, point.x)
        );
        offsetRotation.set(
            Math.atan2(tempVector.z, tempVector.y),
            Math.atan2(tempVector.x, tempVector.z),
            Math.atan2(tempVector.y, tempVector.x)
        );

        tempQuaternion.setFromRotationMatrix(
            tempMatrix.getInverse(parentRotationMatrix)
        );

        quaternionE.setFromAxisAngle(eye, offsetRotation.z - rotation.z);
        quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

        tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionE);
        tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

        scope.object.quaternion.copy(tempQuaternion);
    }

    function rotateXYZEAxis() {
        let euler = new THREE.Euler();
        euler.setFromVector3(
            point
                .clone()
                .cross(tempVector)
                .normalize()
        );
        quaternionE.setFromEuler(euler); // rotation axis

        tempQuaternion.setFromRotationMatrix(
            tempMatrix.getInverse(parentRotationMatrix)
        );
        quaternionX.setFromAxisAngle(
            quaternionE,
            -point.clone().angleTo(tempVector)
        );
        quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

        tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
        tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

        scope.object.quaternion.copy(tempQuaternion);
    }

    function rotateLocalSpace() {
        point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));
        tempVector.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

        rotation.set(
            Math.atan2(point.z, point.y),
            Math.atan2(point.x, point.z),
            Math.atan2(point.y, point.x)
        );
        offsetRotation.set(
            Math.atan2(tempVector.z, tempVector.y),
            Math.atan2(tempVector.x, tempVector.z),
            Math.atan2(tempVector.y, tempVector.x)
        );

        quaternionXYZ.setFromRotationMatrix(oldRotationMatrix);

        if (scope.rotationSnap !== null) {
            quaternionX.setFromAxisAngle(
                unitX,
                Math.round(
                    (rotation.x - offsetRotation.x) / scope.rotationSnap
                ) * scope.rotationSnap
            );
            quaternionY.setFromAxisAngle(
                unitY,
                Math.round(
                    (rotation.y - offsetRotation.y) / scope.rotationSnap
                ) * scope.rotationSnap
            );
            quaternionZ.setFromAxisAngle(
                unitZ,
                Math.round(
                    (rotation.z - offsetRotation.z) / scope.rotationSnap
                ) * scope.rotationSnap
            );
        } else {
            quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
            quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
            quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
        }

        if (scope.axis === 'X') {
            quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionX);
        }
        if (scope.axis === 'Y') {
            quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionY);
        }
        if (scope.axis === 'Z') {
            quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionZ);
        }

        scope.object.quaternion.copy(quaternionXYZ);
    }

    function rotateWorldSpace() {
        rotation.set(
            Math.atan2(point.z, point.y),
            Math.atan2(point.x, point.z),
            Math.atan2(point.y, point.x)
        );
        offsetRotation.set(
            Math.atan2(tempVector.z, tempVector.y),
            Math.atan2(tempVector.x, tempVector.z),
            Math.atan2(tempVector.y, tempVector.x)
        );

        tempQuaternion.setFromRotationMatrix(
            tempMatrix.getInverse(parentRotationMatrix)
        );

        if (scope.rotationSnap !== null) {
            quaternionX.setFromAxisAngle(
                unitX,
                Math.round(
                    (rotation.x - offsetRotation.x) / scope.rotationSnap
                ) * scope.rotationSnap
            );
            quaternionY.setFromAxisAngle(
                unitY,
                Math.round(
                    (rotation.y - offsetRotation.y) / scope.rotationSnap
                ) * scope.rotationSnap
            );
            quaternionZ.setFromAxisAngle(
                unitZ,
                Math.round(
                    (rotation.z - offsetRotation.z) / scope.rotationSnap
                ) * scope.rotationSnap
            );
        } else {
            quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
            quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
            quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
        }

        quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

        if (scope.axis === 'X') {
            tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
        }
        if (scope.axis === 'Y') {
            tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
        }
        if (scope.axis === 'Z') {
            tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
        }

        tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

        scope.object.quaternion.copy(tempQuaternion);
    }

    function rotateOnMove() {
        point.sub(worldPosition);
        point.multiply(parentScale);
        tempVector.copy(offset).sub(worldPosition);
        tempVector.multiply(parentScale);
        rotateEAxis();
    }

    function getTouchData(event, gestureState) {
        const touches = event.nativeEvent.touches;
        const point0 = new THREE.Vector3(
            touches[0].locationX,
            touches[0].locationY
        );
        const point1 = new THREE.Vector3(
            touches[1].locationX,
            touches[1].locationY
        );
        const angleRadians = Math.atan2(
            point1.y - point0.y,
            point1.x - point0.x
        );
        const vector = new THREE.Vector3();
        vector.subVectors(point1, point0).normalize();
        const distance = point1.distanceTo(point0);
        return {
            point0,
            point1,
            angleRadians,
            vector,
            distance
        };
    }

    this.handlePanResponderMove = function(event, gestureState) {
        if (event.nativeEvent.touches.length === 2) {
            endTouchData = getTouchData(event, gestureState);
            if (!startTouchData) {
                startTouchData = endTouchData;
                offset.copy(startTouchData.vector);

                eye
                    .copy(camPosition)
                    .sub(worldPosition)
                    .normalize();

                oldPosition.copy(scope.object.position);
                oldScale.copy(scope.object.scale);

                oldRotationMatrix.extractRotation(scope.object.matrix);
                worldRotationMatrix.extractRotation(scope.object.matrixWorld);

                parentRotationMatrix.extractRotation(
                    scope.object.parent.matrixWorld
                );
                parentScale.setFromMatrixScale(
                    tempMatrix.getInverse(scope.object.parent.matrixWorld)
                );
            }
            point.copy(endTouchData.vector);
            // translateOnMove();
            scaleOnMove();
            rotateOnMove();

            scope.triggerUpdate = true;
        }
    };

    this.handlePanResponderRelease = function(event) {};

    this.handlePanResponderTerminate = function(event) {};

    function intersectObjects({ locationX, locationY }, objects) {
        const { width, height } = Dimensions.get('window');

        pointerVector.set(
            locationX / width * 2 - 1,
            -(locationY / height * 2) + 1
        );
        ray.setFromCamera(pointerVector, camera);

        var intersections = ray.intersectObjects(objects, true);
        return intersections[0] ? intersections[0] : false;
    }
}

TransformControls.prototype = Object.create(THREE.Object3D.prototype);
TransformControls.prototype.constructor = TransformControls;
