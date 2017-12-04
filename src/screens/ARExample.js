import React from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { GLView, Location, Permissions, MapView } from 'expo';
import * as turf from '@turf/turf';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const destinations = [
    // cvs
    {
        latitude: 32.782149,
        longitude: -96.805218
    },
    // tiff treats
    {
        latitude: 32.782521,
        longitude: -96.804757
    },
    // 7 11
    {
        latitude: 32.782232,
        longitude: -96.803999
    },
    // wine and spirits
    {
        latitude: 32.782422,
        longitude: -96.805492
    },
    // lot 041
    {
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

const castPoint = ({ locationX: x, locationY: y }, { width, height }) => {
    let touch = new THREE.Vector2();
    // touch.set( x, y);
    touch.set(x / width * 2 - 1, -(y / height) * 2 + 1);
    return touch;
};

const defaultZ = 3;
const defaultX = 3;

export default class ARExample extends React.Component {
    state = {
        customDests: []
    };
    subs = [];
    panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event, gestureState) => {
            let touch = castPoint(event.nativeEvent, {
                width: this.width,
                height: this.height
            });
            this.raycaster.setFromCamera(touch, this.camera);
            // Find all intersected objects
            let intersects = this.raycaster.intersectObjects(this.objects);
            // if touched an object
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
                // this.selection.position.x += gestureState.dx;
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
    }

    componentWillUnmount() {
        console.disableYellowBox = false;
        this.subs.forEach(sub => sub.remove());
    }

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

    watchPositionAsync = async () => {
        this.subs.push(
            await Location.watchPositionAsync(
                {
                    enableHighAccuracy: true
                },
                location => {
                    this.setState({
                        location,
                        region: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }
                    });
                }
            )
        );
    };

    getHeadingAsync = async () => {
        let heading = await Location.getHeadingAsync();
        this.setState({ initialHeading: heading, heading });
    };

    watchHeadingAsync = async () => {
        this.subs.push(
            await Location.watchHeadingAsync(heading => {
                this.setState({ heading });
            })
        );
    };

    onRegionChange = region => {
        this.setState({ region });
    };

    onRegionChangeComplete = region => {
        this.setState({ region });
    };

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
    // {destinations.map((dest, i) => (
    //     <MapView.Marker key="" coordinate={dest} />
    // ))}
    render() {
        return (
            <View style={{ flex: 1 }}>
                <GLView
                    {...this.panResponder.panHandlers}
                    ref={ref => (this._glView = ref)}
                    style={{ flex: 1 }}
                    onContextCreate={this._onGLContextCreate}
                />
                {this.state.location && (
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
                        showsCompass
                    >
                        <MapView.Marker
                            coordinate={this.state.location.coords}
                        />
                        {this.state.customDests.map((dest, i) => (
                            <MapView.Marker
                                key={'custom' + i}
                                coordinate={dest}
                            />
                        ))}
                    </MapView>
                )}
            </View>
        );
    }

    addDestinations = () => {
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);
        this.destinations = [];
        destinations.forEach((dest, i) => {
            const geometry = geometries[0];
            const mesh = new THREE.Mesh(geometry, materials[i]);
            const { distanceInKilometers } = this.getDistance(
                this.state.initialLocation.coords,
                dest
            );
            const { bearingInDegrees } = this.getBearing(
                this.state.initialLocation.coords,
                dest
            );
            const correctedBearingInDegrees =
                bearingInDegrees - this.state.initialHeading.trueHeading;
            const correctedBearingInRadians = turf.helpers.degreesToRadians(
                correctedBearingInDegrees
            );
            const distanceInMeters = distanceInKilometers * 1000;
            mesh.position.z =
                cameraPos.z +
                -1 * Math.cos(correctedBearingInRadians) * distanceInMeters;
            mesh.position.x =
                cameraPos.x +
                Math.sin(correctedBearingInRadians) * distanceInMeters;
            this.scene.add(mesh);
            this.objects.push(mesh);
            this.destinations.push(mesh);
        });
    };

    recalibrateDestinations = () => {
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);
        this.destinations.forEach((mesh, i) => {
            const { distanceInKilometers } = this.getDistance(
                this.state.location.coords,
                destinations[i]
            );
            const { bearingInDegrees } = this.getBearing(
                this.state.location.coords,
                destinations[i]
            );
            const correctedBearingInDegrees =
                bearingInDegrees - this.state.initialHeading.trueHeading;
            const correctedBearingInRadians = turf.helpers.degreesToRadians(
                correctedBearingInDegrees
            );
            const distanceInMeters = distanceInKilometers * 1000;
            mesh.position.z =
                cameraPos.z +
                -1 * Math.cos(correctedBearingInRadians) * distanceInMeters;
            mesh.position.x =
                cameraPos.x +
                Math.sin(correctedBearingInRadians) * distanceInMeters;
        });
    };

    handleSelection = selection => {
        this.selection = selection;
    };

    handleCreateGeometry = () => {
        const cameraPos = new THREE.Vector3(0, 0, 0);
        cameraPos.applyMatrix4(this.camera.matrixWorld);

        let mesh = new THREE.Mesh(geometries[0], materials[0]);
        const headingInRadians = turf.helpers.degreesToRadians(
            this.state.heading.trueHeading -
                this.state.initialHeading.trueHeading
        );
        mesh.position.z =
            cameraPos.z + -1 * Math.cos(headingInRadians) * defaultZ;
        mesh.position.x = cameraPos.x + Math.sin(headingInRadians) * defaultX;
        const longitude =
            this.state.location.coords.longitude +
            -1 *
                Math.cos(headingInRadians) *
                turf.helpers.lengthToDegrees(defaultZ, 'meters');
        const latitude =
            this.state.location.coords.latitude +
            Math.sin(headingInRadians) *
                turf.helpers.lengthToDegrees(defaultX, 'meters');
        this.setState({
            customDests: [...this.state.customDests, { latitude, longitude }]
        });
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.customObjects.push({ mesh, headingInRadians });
    };

    // recalibrateCustomObjects = () => {
    //     this.customObjects.forEach(({ mesh, headingInRadians }, i) => {
    //         mesh.position.z = -1 * Math.cos(headingInRadians) * defaultZ;
    //         mesh.position.x = Math.sin(headingInRadians) * defaultX;
    //     });
    // };

    _onGLContextCreate = async gl => {
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
        this.raycaster = new THREE.Raycaster();

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

        await Permissions.askAsync(Permissions.LOCATION);
        await this.getCurrentPositionAsync();
        await this.getHeadingAsync();
        await this.watchPositionAsync();
        await this.watchHeadingAsync();

        this.objects = [];
        this.customObjects = [];
        this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);
        this.addDestinations();
        let i = 0;
        const animate = () => {
            this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);
            i++;
            if (i > 600) {
                this.recalibrateDestinations();
                // this.recalibrateCustomObjects();
                i = 0;
            }
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            gl.endFrameEXP();
        };
        animate();
    };
}
