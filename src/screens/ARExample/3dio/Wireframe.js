import * as THREE from 'three';
import getWireframeBuffer from '3dio/src/utils/data3d/buffer/get-wireframe.js';
import compareArrays from '3dio/src/utils/math/compare-arrays.js';

function Wireframe() {
    // internals
    this._wireframeGeometry = new THREE.BufferGeometry();
    this._wireframeGeometry.addAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(0), 3)
    );
    this._wireframeMaterial = new THREE.LineBasicMaterial();

    this._positions = null;
    this._buffer = null;
    this._thresholdAngle = 10;
    this._thickness = 1;
    this._color = [0, 0, 0];
    this._opacity = 1;

    // init
    this.isLineSegments = true;
    THREE.Line.call(this, this._wireframeGeometry, this._wireframeMaterial);
}

// inherit from THREE Line prototype

Wireframe.prototype = Object.create(THREE.Line.prototype);
Wireframe.prototype.constructor = Wireframe;

// extend with own methods

Wireframe.prototype.update = function(options) {
    // API
    var positions = options.positions;
    //var normals = options.normals
    var thresholdAngle =
        options.thresholdAngle === undefined
            ? this._thresholdAngle
            : options.thresholdAngle;
    var thickness =
        options.thickness === undefined ? this._thickness : options.thickness;
    var color = options.color === undefined ? this._color : options.color;
    var opacity =
        options.opacity === undefined ? this._opacity : options.opacity;

    if (thickness === 0) {
        this.visible = false;
    } else {
        // take care of line buffer
        var regenerateBuffer =
            !this._buffer ||
            thresholdAngle !== this._thresholdAngle ||
            !compareArrays(this._positions, positions);
        if (regenerateBuffer) {
            // generate new buffer from positions
            var newBuffer = getWireframeBuffer(positions, thresholdAngle);
            if (newBuffer.length) {
                this._wireframeGeometry.attributes.position.setArray(newBuffer);
                this.visible = true;
            } else {
                this.visible = false;
            }
            // remember settings
            this._buffer = newBuffer;
            this._positions = positions;
            this._thresholdAngle = thresholdAngle;
        } else if (this._thickness === 0) {
            // was hidden
            this.visible = true;
        }

        // update material
        this._wireframeMaterial.color.r = color[0];
        this._wireframeMaterial.color.g = color[1];
        this._wireframeMaterial.color.b = color[2];
        this._wireframeMaterial.opacity = opacity;
        this._wireframeMaterial.linewidth = thickness;
        // remember settings
        this._color = color;
        this._opacity = opacity;
    }

    this._thickness = thickness;
};

Wireframe.prototype.destroy = function() {
    this._wireframeGeometry = null;
    this._wireframeMaterial = null;

    this._positions = null;
    this._buffer = null;
    this._thresholdAngle = null;
    this._thickness = null;
    this._color = null;
    this._opacity = null;
};

export default Wireframe;
