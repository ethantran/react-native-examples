// @flow
import { Animated } from 'react-native';

type ResultArray = {
    values: any[],
    listeners: any[]
};

type ResultObject = {
    values: Object,
    listeners: Object
};

type ResultAnimated = {
    values: number | string,
    listeners: string
};

type ResultOther = {
    values: any
};

type RecResult = ResultArray | ResultObject;

type Result = RecResult | ResultAnimated | ResultOther;
export type AnimatedListener = Result;

type AnimatedValue = typeof Animated.Value | typeof Animated.Interpolation;

/**
 * Iterates object keys to find Animated objects to add listeners to and returns an object of values and listeners. The values field will be shaped identically to the passed in object with the Animated objects replaced with the value from __getValue at the time it was called.
 */
function recursiveListen(
    object,
    accumulator: ResultArray | ResultObject,
    accIndex: number,
    cb: Function
): RecResult {
    if (Array.isArray(object)) {
        let initialValue = new AnimatedTracker([], []);
        return object.reduce(
            (previousValue, currentValue, currentIndex, array) => {
                const result = recursiveListen(
                    currentValue,
                    previousValue.values,
                    currentIndex,
                    cb
                );
                previousValue.values[currentIndex] = result.values;
                previousValue.listeners[currentIndex] = result.listeners;
                return previousValue;
            },
            initialValue
        );
    }
    if (
        object instanceof Animated.Value ||
        object instanceof Animated.Interpolation
    ) {
        const id = addListenerForAnimated(object, accumulator, accIndex, cb);
        return new AnimatedTracker(
            object.__getValue(),
            new ListenerTracker(id, object)
        );
    }
    if (typeof object === 'object' && object !== null) {
        let initialValue = new AnimatedTracker({}, {});
        return Object.keys(object).reduce((previousValue, currentValue) => {
            const value = object[currentValue];
            const result = recursiveListen(
                value,
                previousValue.values,
                currentValue,
                cb
            );
            previousValue.values[currentValue] = result.values;
            previousValue.listeners[currentValue] = result.listeners;
            return previousValue;
        }, initialValue);
    }
    return new AnimatedTracker(object);
}
function addListenerForAnimated(
    animatedValue: AnimatedValue,
    accumulator: ResultArray | ResultObject,
    accIndex: number,
    cb: Function
) {
    const addListener = animatedValue._parent
        ? animatedValue._parent.addListener.bind(animatedValue._parent)
        : animatedValue.addListener.bind(animatedValue);
    const interpolator = animatedValue._interpolation;
    let callback = e => e;
    if (interpolator) {
        callback = _value => interpolator(_value);
    }
    let prevCallback = callback;
    callback = e => {
        const value = prevCallback(e.value);
        accumulator[accIndex] = value;
        cb();
    };
    return addListener(callback);
}
export function listen(object: Object | any[], cb: Function): Result {
    return recursiveListen(object, null, null, cb);
}

/**
 * Iterates object keys to find a ListenerTracker with an Animated object and listener id to remove
 */
function recursiveRemoveListeners(listeners: Object | any[]) {
    if (Array.isArray(listeners)) {
        listeners.forEach((listener, index) =>
            recursiveRemoveListeners(listener)
        );
    } else if (listeners instanceof ListenerTracker) {
        const id = listeners.id;
        const object = listeners.object;
        object._parent
            ? object._parent.removeListener(id)
            : object.removeListener(id);
    } else if (typeof listeners === 'object' && listeners !== null) {
        Object.keys(listeners).forEach(key =>
            recursiveRemoveListeners(listeners[key])
        );
    }
}
export function removeListeners(listeners: Object | any[] | AnimatedTracker) {
    if (listeners instanceof AnimatedTracker) {
        recursiveRemoveListeners(listeners.listeners);
    } else {
        recursiveRemoveListeners(listeners);
    }
}

class ListenerTracker {
    id: string;
    object: Animated.Value | Animated.Interpolation;
    constructor(id: string, object: Animated.Value | Animated.Interpolation) {
        this.id = id;
        this.object = object;
    }
}

class AnimatedTracker {
    values: any[] | Object | number | string;
    listeners: ?(ListenerTracker | ListenerTracker[] | Object);
    constructor(
        values?: any[] | Object | string,
        listeners?: ListenerTracker | ListenerTracker[] | Object
    ) {
        this.values = values;
        this.listeners = listeners;
    }
}
