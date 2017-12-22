import React from 'react';
import { View, PanResponder, Dimensions, PixelRatio } from 'react-native';
import { Location, Permissions, MapView, FileSystem } from 'expo';
import ExpoGraphics from 'expo-graphics';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import ExpoTHREE, { THREE } from 'expo-three';
import * as turf from '@turf/turf';

require('three/examples/js/loaders/OBJLoader');
require('../../loaders/MTLLoader');

import { GEOMETRIES, MATERIALS } from './constants';
import HUD from './HUD';
import HUDSelection from './HUDSelection';
import IO3DSearchView from './IO3DSearchView';
import GeometryListView from './GeometryListView';
import PolySearchView from './PolySearchView';
import Progress from './Progress';
import {
    getCameraPosition,
    calibrateObject,
    placeObject3DFromCamera,
    castPoint
} from './utils';
import {
    init,
    setInitialLocation,
    setLocation,
    setInitialHeading,
    setHeading,
    setRegion,
    addObject,
    addObjects,
    addObjectAtHeading,
    selectObject3D,
    reset,
    loadFromStorage
} from './actions/ar';
import LongpressControl from './LongpressControl';
import TransformControls from './TransformControls';
import TouchVisualizer from './TouchVisualizer';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
            onPanResponderTerminate: this.handlePanResponderTerminate,
            onShouldBlockNativeResponder: () => false
        });
    }

    componentDidMount() {
        // console.disableYellowBox = true;
        THREE.suppressExpoWarnings(true);
    }

    componentWillUnmount() {
        // console.disableYellowBox = false;
        THREE.suppressExpoWarnings(false);

        // stop listening for location and heading
        this.subs.forEach(sub => sub.remove());

        this.props.reset();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.mapVisible !== nextProps.mapVisible) {
            return true;
        }
        if (nextProps.mapVisible) {
            if (this.props.currentLocation !== nextProps.currentLocation) {
                return true;
            }
            if (this.props.objects !== nextProps.objects) {
                return true;
            }
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
        this.props.loadFromStorage();
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
                key={obj.id || `${obj.type}_${obj.latitude}_${obj.longitude}`}
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
                <View {...this.panResponder.panHandlers} style={{ flex: 1 }}>
                    <ExpoGraphics.View
                        pointerEvents="none"
                        style={{ flex: 1 }}
                        onContextCreate={this._onGLContextCreate}
                        onRender={this.handleRender}
                        onResize={this.handleResize}
                        arEnabled
                    />
                </View>
                {this.props.currentLocation &&
                    this.props.mapVisible &&
                    this.props.region && (
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
                            showsUserLocation={true}
                            followsUserLocation={true}
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
                <IO3DSearchView />
                <Progress />
            </View>
        );
    }

    handlePanResponderGrant = (event, gestureState) => {
        const { featurePoints } = ExpoTHREE.getRawFeaturePoints(this.arSession);
        if (featurePoints.length > 0) {
        }

        this.longpressControl.handlePanResponderGrant(event, gestureState);
        this.touchVisualizer.handlePanResponderGrant(event, gestureState);
        let touch = castPoint(event.nativeEvent, {
            width: this.props.width,
            height: this.props.height
        });
        this.props.raycaster.setFromCamera(touch, this.props.camera);
        let intersects = this.props.raycaster.intersectObjects(
            this.props.object3Ds,
            true
        );
        console.log(
            'handlePanResponderGrant',
            this.props.object3Ds.length,
            intersects.length
        );
        if (intersects.length > 0) {
            const intersection = intersects[0];
            this.props.selectObject3D(intersection.object);
            this.transformControl.detach();
            this.transformControl.attach(intersection.object.userData.root);
            this.transformControl.handlePanResponderGrant(event, gestureState);
            this.longpressControl.attach(intersection.object.userData.root);
        }
    };

    handlePanResponderMove = (event, gestureState) => {
        this.transformControl.handlePanResponderMove(event, gestureState);
        this.longpressControl.handlePanResponderMove(event, gestureState);
    };

    handlePanResponderRelease = () => {
        this.transformControl.handlePanResponderRelease();
        this.longpressControl.handlePanResponderRelease();
        this.touchVisualizer.handlePanResponderRelease();
        // TODO: update latitude longitude and elevation changes from pan responder
    };

    handlePanResponderTerminate = () => {
        this.transformControl.handlePanResponderTerminate();
        this.longpressControl.handlePanResponderTerminate();
        this.touchVisualizer.handlePanResponderTerminate();
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
                this.props.currentLocation.coords,
                this.props.initialHeading
            )
        );

        // reset recalibrate counter
        this.recalibrateCount = 0;
    };

    _onGLContextCreate = async (gl, arSession) => {
        const { drawingBufferWidth, drawingBufferHeight } = gl;
        const scale = PixelRatio.get();
        const width = drawingBufferWidth / scale;
        const height = drawingBufferHeight / scale;

        const renderer = ExpoTHREE.createRenderer({ gl });
        renderer.setSize(width, height);
        renderer.setPixelRatio(scale);

        const scene = new THREE.Scene();
        const camera = ExpoTHREE.createARCamera(
            arSession,
            width,
            height,
            0.01,
            1000
        );
        // need to add camera to scene to make attached objects visible
        scene.add(camera);

        scene.background = ExpoTHREE.createARBackgroundTexture(
            arSession,
            renderer
        );
        ExpoTHREE.setIsLightEstimationEnabled(arSession, true);
        ExpoTHREE.setIsPlaneDetectionEnabled(arSession, true);

        // add lights so models are not black
        const ambient = new THREE.HemisphereLight(0x66aaff, 0x886666, 0.5);
        ambient.position.set(-0.5, 0.75, -1);
        scene.add(ambient);
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 0.75, 0.5);
        scene.add(light);

        // good for debugging and seeing the three js space
        scene.add(new THREE.GridHelper(10, 10));
        scene.add(new THREE.CameraHelper(camera));
        scene.add(new THREE.AxesHelper(5));
        scene.add(new THREE.DirectionalLightHelper(light, 5));

        this.transformControl = new TransformControls(camera);
        this.longpressControl = new LongpressControl(camera);
        this.touchVisualizer = new TouchVisualizer(scene, camera);

        // start geolocation and heading tracking here so the initial location and
        // initial heading is as accurate as possible
        this.init();

        // store these in redux so other components and actions can use them without having to pass them as props
        this.props.init({
            width,
            height,
            arSession,
            scene,
            camera,
            renderer,
            ambient,
            light
        });

        this.width = width;
        this.height = height;
        this.arSession = arSession;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.ambient = ambient;
        this.light = light;
    };

    handleResize = ({ width, height }) => {
        const scale = PixelRatio.get();

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
    };

    handleRender = () => {
        // recalibrate only if geolocation updates a certain number of times
        // if (this.recalibrateCount >= recalibrateThreshold) {
        //     this.recalibrate();
        // }

        this.transformControl.update();
        this.longpressControl.update();

        const lightEstimation = ExpoTHREE.getARLightEstimation(
            this.props.arSession
        );
        if (lightEstimation) {
            this.light.intensity = 1 / 2000 * lightEstimation.ambientIntensity;
            // this.props.light.ambientIntensity = lightEstimation.ambientColorTemperature;
        }

        this.renderer.render(this.scene, this.camera);
    };
}

const mapStateToProps = state => ({
    initialHeading: state.heading.initialHeading,
    currentHeading: state.heading.currentHeading,
    currentLocation: state.location.currentLocation,
    mapVisible: state.map.visible,
    region: state.region,
    ...state.three,
    objects: state.objects
});

const mapDispatchToProps = {
    init,
    setInitialLocation,
    setLocation,
    setInitialHeading,
    setHeading,
    setRegion,
    addObject,
    addObjects,
    addObjectAtHeading,
    selectObject3D,
    reset,
    loadFromStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(ARExample);
