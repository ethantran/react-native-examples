import * as THREE from 'three';
import { Dimensions } from 'react-native';

export default class TouchVisualizer {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.arrows = [];
    }

    handlePanResponderGrant(event, gestureState) {
        const { width, height } = Dimensions.get('window');
        const touches = event.nativeEvent.touches;
        this.clean();
        touches.forEach(({ locationX, locationY }) => {
            let pointerVector = new THREE.Vector2();
            pointerVector.set(
                locationX / width * 2 - 1,
                -(locationY / height * 2) + 1
            );
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(pointerVector, this.camera);
            const arrow = new THREE.ArrowHelper(
                // pointerVector.normalize(),
                // this.camera.position,
                raycaster.ray.direction,
                raycaster.ray.origin,
                100,
                Math.random() * 0xffffff
            );
            this.scene.add(arrow);
            this.arrows.push(arrow);
        });
    }

    handlePanResponderRelease(event, gestureState) {
        
    }

    handlePanResponderTerminate(event, gestureState) {
        this.clean();
    }

    clean() {
        this.arrows.forEach(arrow => {
            this.scene.remove(arrow);
        });
        this.arrows = [];
    }
}
