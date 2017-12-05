import React from 'react';
import {
    View,
    Dimensions,
    PanResponder,
    TouchableOpacity,
    TextInput,
    Image,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { GLView, Location, Permissions, MapView, FileSystem } from 'expo';
import * as turf from '@turf/turf';
import { MaterialIcons } from '@expo/vector-icons';

require('three/examples/js/loaders/OBJLoader');
require('../../loaders/MTLLoader');

import HUD from './HUD';
import PolySearchView from './PolySearchView';
import Progress from './Progress';

const { scaleLongestSideToSize, alignMesh } = ExpoTHREE.utils;

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const POLY_API_KEY = 'AIzaSyDVowQMZQfFz7XsURJciLIQXZpgBDLfqIc';
const GOOGLE_MAPS_GEOCODING_API_KEY = 'AIzaSyBzaFQvsdY9Cx5aB6tXMxrYm3jNchcvFhk';

// temporary save until i setup redux persist
const savedObjects = [
    // cvs
    {
        type: 'place',
        latitude: 32.782149,
        longitude: -96.805218
    },
    // tiff treats
    {
        type: 'place',
        latitude: 32.782521,
        longitude: -96.804757
    },
    // 7 11
    {
        type: 'place',
        latitude: 32.782232,
        longitude: -96.803999
    },
    // wine and spirits
    {
        type: 'place',
        latitude: 32.782422,
        longitude: -96.805492
    },
    // lot 041
    {
        type: 'place',
        latitude: 32.783134,
        longitude: -96.804276
    }
];
const geometries = [new THREE.BoxGeometry(1, 2, 1)];
const materials = [
    //red
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    }),
    //blue
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }),
    //lime
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }),
    //yellow
    new THREE.MeshBasicMaterial({
        color: 0xffff00
    }),
    //aqua
    new THREE.MeshBasicMaterial({
        color: 0x00ffff
    }),
    //fuchsia
    new THREE.MeshBasicMaterial({
        color: 0xff00ff
    }),
    //white
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
];

// not sure why x and y are modified, copied from expo three demos
const castPoint = ({ locationX: x, locationY: y }, { width, height }) => {
    let touch = new THREE.Vector2();
    // touch.set( x, y);
    touch.set(x / width * 2 - 1, -(y / height) * 2 + 1);
    return touch;
};

const defaultCreateDistance = 3;
const recalibrateThreshold = 1;

export default class ARExample extends React.Component {
    state = {
        objects: []
    };
    /**
     * Subscriptions for location and heading tracking
     */
    subs = [];
    panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event, gestureState) => {
            let touch = castPoint(event.nativeEvent, {
                width: this.width,
                height: this.height
            });
            this.raycaster.setFromCamera(touch, this.camera);

            // Find all intersected meshes
            let intersects = this.raycaster.intersectObjects(this.meshes);

            // handle intersections
            if (intersects.length > 0) {
                this.handleSelection(intersects[0]);
            } else {
                this.handleCreateGeometry();
            }
        },
        onPanResponderMove: (event, gestureState) => {
            let touch = castPoint(event.nativeEvent, {
                width: this.width,
                height: this.height
            });
            this.raycaster.setFromCamera(touch, this.camera);

            // if selected an object
            if (this.selection) {
                // this.selection.mesh.position.x += gestureState.dx;
            }
        },
        onPanResponderRelease: () => {
            this.touching = false;
        },
        onPanResponderTerminate: () => {
            this.touching = false;
        },
        onShouldBlockNativeResponder: () => false
    });

    componentDidMount() {
        console.disableYellowBox = true;
        this.init();
    }

    componentWillUnmount() {
        console.disableYellowBox = false;

        // stop listening for location and heading
        this.subs.forEach(sub => sub.remove());

        // _onGLContextCreate does not stop running on unmount
        this.stopAnimate = true;
    }

    init = async () => {
        await Permissions.askAsync(Permissions.LOCATION);
        await Promise.all([
            this.getCurrentPositionAsync(),
            this.getHeadingAsync()
        ]);
        await Promise.all([
            this.watchPositionAsync(),
            this.watchHeadingAsync()
        ]);
    };

    getCurrentPositionAsync = async () => {
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });
        this.setState({
            initialLocation: location,
            location,
            region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
    };

    /**
     * increment recalibrateCount after updating location
     * because we want to make sure all meshes are in an an accurate
     * spot no matter where you move by recalibrating the mesh position
     * after so many updates
     * TODO: recalibrate based on a radius from last calibration
     * if location distance from calibration location
     * is greater than threshold, recalibrate
     */
    watchPositionAsync = async () => {
        this.subs.push(
            await Location.watchPositionAsync(
                {
                    enableHighAccuracy: true
                },
                location => {
                    this.setState(
                        {
                            location,
                            region: {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }
                        },
                        () => {
                            this.recalibrateCount =
                                (this.recalibrateCount || 0) + 1;
                        }
                    );
                }
            )
        );
    };

    getHeadingAsync = async () => {
        const heading = await Location.getHeadingAsync();
        this.setState({ initialHeading: heading, heading });
    };

    watchHeadingAsync = async () => {
        this.subs.push(
            await Location.watchHeadingAsync(heading => {
                this.setState({ heading });
            })
        );
    };

    // map

    onRegionChange = region => {
        this.setState({ region });
    };

    onRegionChangeComplete = region => {
        this.setState({ region });
    };

    // turf

    getDistance = (coord1, coord2) => {
        const from = turf.point([coord1.longitude, coord1.latitude]);
        const to = turf.point([coord2.longitude, coord2.latitude]);
        const distanceInKilometers = turf.distance(from, to);
        const distanceInMiles = turf.distance(from, to, { units: 'miles' });
        const distanceInRadians = turf.distance(from, to, { units: 'radians' });
        const distanceInDegrees = turf.distance(from, to, { units: 'degrees' });
        return {
            distanceInKilometers,
            distanceInMiles,
            distanceInRadians,
            distanceInDegrees
        };
    };

    getBearing = (coord1, coord2) => {
        const point1 = turf.point([coord1.longitude, coord1.latitude]);
        const point2 = turf.point([coord2.longitude, coord2.latitude]);
        const bearingInDegrees = turf.bearing(point1, point2);
        const bearingInRadians = turf.helpers.degreesToRadians(
            bearingInDegrees
        );
        return {
            bearingInDegrees,
            bearingInRadians
        };
    };

    getRhumbBearing = (coord1, coord2) => {
        const point1 = turf.point([coord1.longitude, coord1.latitude]);
        const point2 = turf.point([coord2.longitude, coord2.latitude]);
        const rhumbBearingInDegrees = turf.rhumbBearing(point1, point2);
        const rhumbBearingInRadians = turf.helpers.degreesToRadians(
            rhumbBearingInDegrees
        );
        return {
            rhumbBearingInDegrees,
            rhumbBearingInRadians
        };
    };

    // HUD

    // progress

    handleRemoteDownload = downloadProgress => {
        this.setState({
            showDownloadProgress: true,
            downloadProgress:
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite *
                100
        });
    };

    handleLocalDownload = xhr => {
        if (xhr.lengthComputable) {
            this.setState({
                showDownloadProgress: true,
                downloadProgress: xhr.loaded / xhr.total * 100
            });
        }
    };

    /**
     *
     */
    selectPolyAsset = async asset => {
        this.setState({ polySearch: false });
        const objFormat = asset.formats.find(
            format => format.formatType === 'OBJ'
        );
        if (!objFormat) {
            console.error('Asset does not have obj format');
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

        var urlOBJ = objFormat.root.url;
        var urlMTL = objFormat.resources[0].url;
        var mtlloader = new THREE.MTLLoader();
        mtlloader.load(
            urlMTL,
            mats => {
                var objloader = new THREE.OBJLoader();
                objloader.setMaterials(mats);
                objloader.load(
                    urlOBJ,
                    mesh => {
                        const object = {
                            type: 'poly',
                            mesh,
                            asset
                        };
                        this.addObject(object);
                        this.setState({
                            selection: object,
                            showDownloadProgress: false
                        });
                    },
                    this.handleLocalDownload
                );
            },
            this.handleLocalDownload
        );
    };

    handleHUD = type => {
        if (type === 'search') {
            this.openPolySearch();
        } else if (type === 'map') {
            this.toggleMap();
        }
    };

    openPolySearch = () => {
        this.setState({ polySearch: true });
    };

    closePolySearch = () => {
        this.setState({ polySearch: false });
    };

    toggleMap = () => {
        this.setState({ showMap: !this.state.showMap });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <GLView
                    {...this.panResponder.panHandlers}
                    ref={ref => (this._glView = ref)}
                    style={{ flex: 1 }}
                    onContextCreate={this._onGLContextCreate}
                />
                {this.state.location &&
                    this.state.showMap && (
                        <MapView
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '50%'
                            }}
                            initialRegion={this.state.region}
                            region={this.state.region}
                            onRegionChange={this.onRegionChange}
                            showsUserLocation
                            followsUserLocation
                            showsCompass
                        >
                            <MapView.Marker
                                coordinate={this.state.location.coords}
                            />
                            {this.state.objects.map((obj, i) => (
                                <MapView.Marker
                                    key={'custom' + i}
                                    coordinate={{
                                        latitude: obj.latitude,
                                        longitude: obj.longitude
                                    }}
                                />
                            ))}
                        </MapView>
                    )}
                <HUD onPress={this.handleHUD} />
                {this.state.polySearch && (
                    <PolySearchView
                        apiKey={POLY_API_KEY}
                        selectAsset={this.selectPolyAsset}
                        close={this.closePolySearch}
                    />
                )}
                {this.state.showDownloadProgress && (
                    <Progress progress={this.state.downloadProgress} />
                )}
            </View>
        );
    }

    addSavedObjectsToScene = () => {
        // not sure why i should do this, copied from somewhere
        this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);

        // get camera position
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);

        // take the current object state (should be empty anyway) and add saved objects
        const newObjects = [...this.state.objects];
        // TODO: replace savedObjects with real redux persist
        savedObjects.forEach((object, i) => {
            const newObject = { ...object };
            // default object type place handler
            if (object.type === 'place') {
                const geometry = geometries[0];
                const material = materials[i];
                const mesh = new THREE.Mesh(geometry, material);
                newObject.mesh = mesh;
            } else if (object.type === 'poly') {
            }
            this.scene.add(newObject.mesh);
            this.calibrateObject(newObject, cameraPos);
            newObjects.push(newObject);
        });
        this.setState({ objects: newObjects });
    };

    calibrateObject = (object, cameraPos) => {
        // get distance from current geolocation to the object geolocation
        const { distanceInKilometers } = this.getDistance(
            this.state.location.coords,
            object
        );

        // convert into meters since arkit is in meters i think
        const distanceInMeters = distanceInKilometers * 1000;

        // bearing is used to find a new point at a distance and an angle from starting coordinates
        const { bearingInDegrees } = this.getBearing(
            this.state.location.coords,
            object
        );

        // adjust bearing based on the heading that arkit three.js space likely initialized at
        const correctedBearingInDegrees =
            bearingInDegrees - this.state.initialHeading.trueHeading;

        // converting bearing to radians is required for Math.cos and Math.sin
        const correctedBearingInRadians = turf.helpers.degreesToRadians(
            correctedBearingInDegrees
        );

        // take the current camera pos and add the distance from current geolocation to object geolocation
        // camera position is the best guess of where we are, current geolocation to three.js position
        // camera position can be not in synce with current geolocation if geo is not updating when we move
        // TODO: perhaps finding a geolocation from the initial geolocation and the camera position's distance from origin is better
        object.mesh.position.z =
            cameraPos.z +
            -1 * Math.cos(correctedBearingInRadians) * distanceInMeters;
        object.mesh.position.x =
            cameraPos.x +
            Math.sin(correctedBearingInRadians) * distanceInMeters;
    };

    /**
     * Provide different interactions based on object type
     */
    handleSelection = selection => {
        // need to store selection because it can be used for pan responder move, animate, or render
        this.selection = selection;
        this.setState({ selection });
        if (selection.type === 'place') {
        } else if (selection.type === 'poly') {
        }
    };

    /**
     * if selected something
     * if selection is a poly asset, clone it
     * else create default geometry
     */
    handleCreateGeometry = () => {
        const selection = this.state.selection;
        let object = {};
        if (selection) {
            object.type = selection.type;
            if (selection.type === 'poly') {
                object.mesh = selection.mesh.clone();
            }
        } else {
            object.mesh = new THREE.Mesh(geometries[0], materials[0]);
        }
        this.addObject(object);
    };

    addObject = object => {
        // not sure why i should do this, copied from somewhere
        this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);

        // get camera position
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);

        // heading is used like bearing
        // find difference between current and initial heading because arkit three js space heading does not know where is true north
        const headingInRadians = turf.helpers.degreesToRadians(
            this.state.heading.trueHeading -
                this.state.initialHeading.trueHeading
        );

        // take the current camera pos and add the distance from current geolocation to object geolocation
        // camera position is the best guess of where we are, current geolocation to three.js position
        // camera position can be not in synce with current geolocation if geo is not updating when we move
        // TODO: perhaps finding a geolocation from the initial geolocation and the camera position's distance from origin is better
        object.mesh.position.z =
            cameraPos.z +
            -1 * Math.cos(headingInRadians) * defaultCreateDistance;
        object.mesh.position.x =
            cameraPos.x + Math.sin(headingInRadians) * defaultCreateDistance;

        // calculate geolocation by adding distance to current geolocation
        // need this to save and load the custom poly object in the same spot in the future
        const longitude =
            this.state.location.coords.longitude +
            -1 *
                Math.cos(headingInRadians) *
                turf.helpers.lengthToDegrees(defaultCreateDistance, 'meters');
        const latitude =
            this.state.location.coords.latitude +
            Math.sin(headingInRadians) *
                turf.helpers.lengthToDegrees(defaultCreateDistance, 'meters');

        // update scene
        this.scene.add(object.mesh);

        // update object with geolocation and update state
        const newObject = { ...object, longitude, latitude };
        this.objects.push(newObject);
        this.setState({
            objects: this.objects
        });
    };

    // adjust mesh positions to new geolocation
    recalibrate = () => {
        console.log('calibrate');
        // not sure why i should do this, copied from somewhere
        this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);

        // get camera position, calculated here to possibly increase perf
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);

        // calibration is possibly different for type
        this.objects.forEach(object => {
            this.calibrateObject(object, cameraPos);
            // if (object.type === 'poly') {
            //     this.recalibrateObject(object);
            // } else if (object.type === 'place') {
            //     this.recalibrateObject(object);
            // }
        });

        // reset recalibrate counter
        this.recalibrateCount = 0;
    };

    _onGLContextCreate = async gl => {
        // boilerplace arkit setup
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
        this.arSession = await this._glView.startARSessionAsync();
        this.scene = new THREE.Scene();
        this.camera = ExpoTHREE.createARCamera(
            this.arSession,
            this.width,
            this.height,
            0.01,
            1000
        );
        this.renderer = ExpoTHREE.createRenderer({ gl });
        this.renderer.setSize(this.width, this.height);
        this.scene.background = ExpoTHREE.createARBackgroundTexture(
            this.arSession,
            this.renderer
        );

        // add lights for fun
        const ambient = new THREE.HemisphereLight(0x66aaff, 0x886666, 0.5);
        ambient.position.set(-0.5, 0.75, -1);
        this.scene.add(ambient);
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 0.75, 0.5);
        this.scene.add(light);

        // good for debugging and seeing the three js space
        this.scene.add(new THREE.GridHelper(10, 10));

        // not sure if i need to do this, copied from somewhere
        this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);

        // start geolocation and heading tracking here so the initial location and initial heading is as accurate as possible
        await this.init();

        // used for touch events to see if we touched an object
        this.raycaster = new THREE.Raycaster();

        // need to track meshes for raycaster
        this.meshes = [];

        // need to track objects in the scene for caching, recalibrating,
        this.objects = [];

        this.addSavedObjectsToScene();

        const animate = () => {
            // _onGLContextCreate animate does not stop running on unmount
            if (this.stopAnimate) {
                return;
            }

            // recalibrate only if geolocation updates a certain number of times
            if (this.recalibrateCount >= recalibrateThreshold) {
                this.recalibrate();
            }

            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            gl.endFrameEXP();
        };
        animate();
    };
}
