import React from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import { GLView, Location, Permissions, MapView, FileSystem } from 'expo';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import * as THREE from 'three';
import * as turf from '@turf/turf';

require('three/examples/js/loaders/OBJLoader');
require('../../loaders/MTLLoader');

import { GEOMETRIES, MATERIALS } from './constants';
import HUD from './HUD';
import HUDSelection from './HUDSelection';
import GeometryListView from './GeometryListView';
import PolySearchView from './PolySearchView';
import Progress from './Progress';
import {
    getCameraPosition,
    calibrateObject,
    placeObjectFromCamera,
    castPoint
} from './utils';
import {
    setupARKit,
    setInitialLocation,
    setLocation,
    setInitialHeading,
    setHeading,
    setRegion,
    addObject,
    addObjects,
    addObjectAtHeading,
    selectObject3D
} from './actions/ar';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const defaultPlaceDistance = 3;

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

const createRegionWithLocation = location => ({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
});

const recalibrateThreshold = 1;

class ARExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objects: []
        };
        /**
         * Subscriptions for location and heading tracking
         */
        this.subs = [];
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderRelease: this.handlePanResponderRelease,
            onPanResponderTerminate: () => {
                clearTimeout(this.longPressTimeoutId);
            },
            onShouldBlockNativeResponder: () => false
        });
    }

    componentDidMount() {
        console.disableYellowBox = true;
    }

    componentWillUnmount() {
        console.disableYellowBox = false;

        // stop listening for location and heading
        this.subs.forEach(sub => sub.remove());

        // stop requestAnimationFrame infinite loop
        cancelAnimationFrame(this.requestID);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.currentLocation !== nextProps.currentLocation) {
            return true;
        }
        if (this.props.showMap !== nextProps.showMap) {
            return true;
        }
        if (this.props.region !== nextProps.region) {
            return true;
        }
        return false;
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
        // this.addSavedObjectsToScene();
    };

    getCurrentPositionAsync = async () => {
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });
        this.props.setInitialLocation(location);
        this.props.setRegion(createRegionWithLocation(location));
    };

    /**
     * increment recalibrateCount after updating location
     * because we want to make sure all object3Ds are in an an accurate
     * spot no matter where you move by recalibrating the object3D position
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
                    this.props.setLocation(location);
                    this.props.setRegion(createRegionWithLocation(location));
                    this.recalibrateCount = (this.recalibrateCount || 0) + 1;
                }
            )
        );
    };

    getHeadingAsync = async () => {
        const heading = await Location.getHeadingAsync();
        this.props.setInitialHeading(heading);
    };

    watchHeadingAsync = async () => {
        this.subs.push(
            await Location.watchHeadingAsync(heading => {
                this.props.setHeading(heading);
                // this.animateToBearing(heading);
            })
        );
    };

    // map

    // attempt to rotate map when heading changes
    // BUG: crashes
    animateToBearing = heading => {
        this.map && this.map.animateToBearing(heading);
    };
    animateToBearing = debounce(this.animateToBearing, 1000);

    onRegionChange = region => {
        this.props.setRegion(region);
    };

    onRegionChangeComplete = region => {
        this.props.setRegion(region);
    };

    // HUD

    // progress

    handleRemoteDownload = downloadProgress => {
        this.props.setProgress(
            downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite *
                100
        );
    };

    renderObjectMarker = (obj, i) => {
        return (
            <MapView.Marker
                key={obj.id || `${obj.type}_${i}`}
                coordinate={{
                    latitude: obj.latitude,
                    longitude: obj.longitude
                }}
            />
        );
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
                {this.props.currentLocation &&
                    this.props.showMap && (
                        <MapView
                            ref={c => (this.map = c)}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '50%'
                            }}
                            initialRegion={this.props.region}
                            region={this.props.region}
                            onRegionChange={this.onRegionChange}
                            showsUserLocation={false}
                            followsUserLocation={false}
                        >
                            <MapView.Marker
                                coordinate={this.props.currentLocation.coords}
                            />
                            {this.props.objects.map(this.renderObjectMarker)}
                        </MapView>
                    )}
                <HUD />
                <HUDSelection />
                <GeometryListView />
                <PolySearchView />
                <Progress />
            </View>
        );
    }

    // addSavedObjectsToScene = () => {
    //     // not sure why i should do this, copied from somewhere
    //     this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);

    //     // get camera position
    //     const cameraPos = new THREE.Vector3(0, 0, 0);
    //     cameraPos.applyMatrix4(this.camera.matrixWorld);

    //     // take the current object state (should be empty anyway) and add saved objects
    //     const newObjects = [...this.state.objects];
    //     // TODO: replace savedObjects with real redux persist
    //     savedObjects.forEach((object, i) => {
    //         const newObject = { ...object };
    //         // default object type place handler
    //         if (object.type === 'place') {
    //             const geometry = GEOMETRIES[0];
    //             const material = MATERIALS[i % MATERIALS.length];
    //             const object3D = new THREE.Mesh(geometry, material);
    //             newObject.object3D = object3D;
    //         } else if (object.type === 'poly') {
    //         }
    //         this.scene.add(newObject.object3D);
    //         this.calibrateObject(newObject, cameraPos);
    //         newObjects.push(newObject);
    //     });
    //     this.setState({ objects: newObjects });
    // };

    handlePanResponderGrant = (event, gestureState) => {
        let touch = castPoint(event.nativeEvent, {
            width: this.props.width,
            height: this.props.height
        });
        this.props.raycaster.setFromCamera(touch, this.props.camera);

        // visualize raycaster
        if (this.arrow) {
            this.props.scene.remove(this.arrow);
        }
        this.arrow = new THREE.ArrowHelper(
            this.props.raycaster.ray.direction,
            this.props.raycaster.ray.origin,
            100,
            Math.random() * 0xffffff
        );
        this.props.scene.add(this.arrow);

        // Find all intersected object3Ds
        let intersects = this.props.raycaster.intersectObjects(
            this.props.object3Ds
        );

        if (intersects.length > 0) {
            this.handleIntersection(event, gestureState, intersects[0]);
        }
    };

    /**
     * Provide different interactions based on object type
     */
    handleIntersection = (event, gestureState, intersection) => {
        // need to store selection because it can be used for pan responder move, animate, or render
        this.props.selectObject3D(intersection.object);
        console.log('handleIntersection');
        if (event.nativeEvent.touches.length === 2) {
        } else {
            this.longPressTimeoutId = setTimeout(() => {
                console.log('longpress');
                this.longpress = intersection;
            }, 1000);
        }
    };

    handlePanResponderMove = (event, gestureState) => {
        let touch = castPoint(event.nativeEvent, {
            width: this.props.width,
            height: this.props.height
        });
        this.props.raycaster.setFromCamera(touch, this.props.camera);

        // if selected an object
        if (this.props.selection) {
            // this.props.selection.object3D.position.x += gestureState.dx;
        }
    };

    handlePanResponderRelease = () => {
        clearTimeout(this.longPressTimeoutId);
        if (this.longpress) {
            this.longpress = false;
        }
    };

    // adjust object3D positions to new geolocation
    recalibrate = () => {
        // animate could run before we have a location and heading
        if (!this.props.currentLocation || !this.props.initialHeading) {
            return;
        }

        const cameraPos = getCameraPosition(this.props.camera);
        this.props.objects.forEach(object =>
            calibrateObject(
                object,
                cameraPos,
                this.props.currentLocation,
                this.props.initialHeading
            )
        );

        // reset recalibrate counter
        this.recalibrateCount = 0;
    };

    _onGLContextCreate = async gl => {
        // boilerplace arkit setup
        const { scene, camera, renderer } = await this.props.setupARKit(
            this._glView,
            gl
        );

        const animate = () => {
            // recalibrate only if geolocation updates a certain number of times
            if (this.recalibrateCount >= recalibrateThreshold) {
                this.recalibrate();
            }

            if (this.longpress) {
                placeObjectFromCamera(
                    this.props.camera,
                    this.longpress.object,
                    defaultPlaceDistance
                );
            }

            this.requestID = requestAnimationFrame(animate);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();

        // start geolocation and heading tracking here so the initial location and
        // initial heading is as accurate as possible
        this.init();
    };
}

const mapStateToProps = state => ({
    initialHeading: state.heading.initialHeading,
    currentHeading: state.heading.currentHeading,
    currentLocation: state.location.currentLocation,
    ...state.three
});

const mapDispatchToProps = {
    setupARKit,
    setInitialLocation,
    setLocation,
    setInitialHeading,
    setHeading,
    setRegion,
    addObject,
    addObjects,
    addObjectAtHeading,
    selectObject3D
};

export default connect(mapStateToProps, mapDispatchToProps)(ARExample);
