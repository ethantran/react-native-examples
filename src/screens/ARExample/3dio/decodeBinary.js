import decodeArrayToString from './decodeArrayToString';
import pathUtil from '3dio/src/utils/path.js';
import urlUtil from '3dio/src/utils/url.js';

// constants
var IS_URL = new RegExp('^http:\\/\\/.*$|^https:\\/\\/.*$');

// configs

var HEADER_BYTE_LENGTH = 16;
var MAGIC_NUMBER = 0x41443344; // AD3D encoded as ASCII characters in hex
var VERSION = 1;
var TEXTURE_PATH_KEYS = [
    // source
    'mapDiffuseSource',
    'mapSpecularSource',
    'mapNormalSource',
    'mapAlphaSource',
    'mapLightSource',
    // hi-res
    'mapDiffuse',
    'mapSpecular',
    'mapNormal',
    'mapAlpha',
    'mapLight',
    // preview
    'mapDiffusePreview',
    'mapSpecularPreview',
    'mapNormalPreview',
    'mapAlphaPreview',
    'mapLightPreview'
];

// public methods

export default function decodeBinary(buffer, options) {
    // API
    options = options || {};
    var url = options.url;

    var parsedUrl, rootDir, origin;

    if (url) {
        parsedUrl = urlUtil.parse(url);
        rootDir = pathUtil.parse(parsedUrl.path || parsedUrl.pathname || '')
            .dir;
        origin = parsedUrl.protocol + '//' + parsedUrl.host;
    }

    // check buffer type
    if (!buffer) {
        return Promise.reject('Missing buffer parameter.');
    } else if (typeof Buffer !== 'undefined' && buffer instanceof Buffer) {
        // convert node buffer to arrayBuffer
        buffer = buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
        );
    }

    // internals
    var headerArray = new Int32Array(buffer, 0, HEADER_BYTE_LENGTH / 4);
    var magicNumber = headerArray[0];
    var version = headerArray[1];
    var structureByteLength = headerArray[2];
    var payloadByteLength = headerArray[3];
    var expectedFileByteLength =
        HEADER_BYTE_LENGTH + structureByteLength + payloadByteLength;

    // validation warnings

    if (magicNumber !== MAGIC_NUMBER) {
        console.error(
            'File header error: Wrong magic number. File is probably not data3d buffer format.'
        );
    }
    if (version !== VERSION) {
        console.error(
            'File header error: Wrong version number: ' +
                version +
                '. Parser supports version: ' +
                VERSION
        );
    }

    // validation errors

    if (buffer.byteLength !== expectedFileByteLength) {
        var errorMessage =
            'Can not parse Data3d buffer. Wrong buffer size: ' +
            buffer.byteLength +
            ' Expected: ' +
            expectedFileByteLength;
        console.error(errorMessage);
        return Promise.reject(errorMessage);
    }

    // parse structure info

    var structureArray = new Uint16Array(
        buffer,
        HEADER_BYTE_LENGTH,
        structureByteLength / 2
    );
    var structureString = decodeArrayToString.utf16(structureArray);
    var structure;
    try {
        structure = JSON.parse(structureString);
    } catch (e) {
        return Promise.reject(e);
    }

    // add geometry arrays to data3d

    var payloadByteOffset = HEADER_BYTE_LENGTH + structureByteLength;
    traverseData3d(structure.data3d, function(data3d) {
        // map typed arrays to payload area in file buffer
        mapArraysToBuffer(data3d, buffer, payloadByteOffset, url);

        //  convert relative material keys into absolute one
        if (origin && data3d.materials)
            {convertTextureKeys(data3d, origin, rootDir);}
    });

    return Promise.resolve(structure.data3d);
}

function convertTextureKeys(data3d, origin, rootDir) {
    var i,
        l,
        i2,
        l2,
        m,
        materialKeys =
            data3d.materialKeys || Object.keys(data3d.materials || {}),
        texturePathKey;

    for (i = 0, l = materialKeys.length; i < l; i++) {
        m = data3d.materials[materialKeys[i]];

        // hi-res textures
        for (i2 = 0, l2 = TEXTURE_PATH_KEYS.length; i2 < l2; i2++) {
            texturePathKey = TEXTURE_PATH_KEYS[i2];

            if (m[texturePathKey]) {
                if (IS_URL.test(m[texturePathKey])) {
                    // is full URL already
                    m[texturePathKey] = m[texturePathKey];
                } else if (m[texturePathKey].substring(0, 5) === '/http') {
                    // FIXME: prevent leading slashes being added to absolute paths
                    m[texturePathKey] = m[texturePathKey].substring(1);
                } else if (m[texturePathKey][0] === '/') {
                    // absolute path
                    m[texturePathKey] = origin + m[texturePathKey];
                } else {
                    // relative path
                    m[texturePathKey] =
                        origin + rootDir + '/' + m[texturePathKey];
                }
            }
        }
    }
}

function mapArraysToBuffer(data3d, buffer, payloadByteOffset, url) {
    var mesh,
        i,
        l,
        meshKeys = data3d.meshKeys || Object.keys(data3d.meshes || {});

    for (i = 0, l = meshKeys.length; i < l; i++) {
        mesh = data3d.meshes[meshKeys[i]];

        // map arrays to meshes
        if (
            mesh.positionsOffset !== undefined &&
            mesh.positionsLength !== undefined
        ) {
            mesh.positions = new Float32Array(
                buffer,
                payloadByteOffset + mesh.positionsOffset * 4,
                mesh.positionsLength
            );
            delete mesh.positionsOffset;
            delete mesh.positionsLength;
        }
        if (
            mesh.normalsOffset !== undefined &&
            mesh.normalsLength !== undefined
        ) {
            mesh.normals = new Float32Array(
                buffer,
                payloadByteOffset + mesh.normalsOffset * 4,
                mesh.normalsLength
            );
            delete mesh.normalsOffset;
            delete mesh.normalsLength;
        }
        if (mesh.uvsOffset !== undefined && mesh.uvsLength !== undefined) {
            mesh.uvs = new Float32Array(
                buffer,
                payloadByteOffset + mesh.uvsOffset * 4,
                mesh.uvsLength
            );
            delete mesh.uvsOffset;
            delete mesh.uvsLength;
        }
        if (
            mesh.uvsLightmapOffset !== undefined &&
            mesh.uvsLightmapLength !== undefined
        ) {
            mesh.uvsLightmap = new Float32Array(
                buffer,
                payloadByteOffset + mesh.uvsLightmapOffset * 4,
                mesh.uvsLightmapLength
            );
            delete mesh.uvsLightmapOffset;
            delete mesh.uvsLightmapLength;
        }

        // add cache key
        if (url) {mesh.cacheKey = url + ':' + meshKeys[i];}
    }
}

function traverseData3d(data3d, callback) {
    callback(data3d);

    if (data3d.children) {
        for (var i = 0, l = data3d.children.length; i < l; i++) {
            traverseData3d(data3d.children[i], callback);
        }
    }
}
