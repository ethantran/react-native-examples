import { placeObjectFromCamera } from './utils';

export default class LongpressControl {
    constructor(camera, distance = 3, duration = 1000) {
        this.camera = camera;
        this.distance = distance;
        this.duration = duration;
    }

    handlePanResponderGrant(event, gestureState) {
        this.timeoutId = setTimeout(() => {
            console.log('longpress');
            this.triggerUpdate = true;
        }, this.duration);
    }

    handlePanResponderMove(event, gestureState) {
        if (event.nativeEvent.touches.length > 1) {
            clearTimeout(this.timeoutId);
            this.triggerUpdate = false;
        }
    }

    handlePanResponderRelease() {
        clearTimeout(this.timeoutId);
        this.triggerUpdate = false;
        this.detach();
    }

    handlePanResponderTerminate() {
        clearTimeout(this.timeoutId);
        this.triggerUpdate = false;
        this.detach();
    }

    attach(object) {
        this.object = object;
    }

    detach() {
        this.object = undefined;
    }

    update() {
        if (this.triggerUpdate && this.object) {
            placeObjectFromCamera(this.camera, this.object, this.distance);
        }
    }
}
