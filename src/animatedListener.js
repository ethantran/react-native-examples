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
    listeners: number
};

type ResultOther = {
    values: any
};

type RecResult = ResultArray | ResultObject;

type Result = RecResult | ResultAnimated | ResultOther;
export type AnimatedListener = Result;

type AnimatedValue = typeof Animated.Value | typeof Animated.Interpolation;

function recursiveListen(
    object,
    accumulator: ResultArray | ResultObject,
    accIndex: number,
    cb: Function
): RecResult {
    if (Array.isArray(object)) {
        let initialValue = {
            values: [],
            listeners: []
        };
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
        const listener = addListenerForAnimated(
            object,
            accumulator,
            accIndex,
            cb
        );
        return {
            values: object.__getValue(),
            listeners: listener
        };
    }
    if (typeof object === 'object' && object !== null) {
        let initialValue = {
            values: {},
            listeners: {}
        };
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
    return {
        values: object
    };
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
export function removeListeners(listeners: Object | any[], object: Object | any[]) {
    if (Array.isArray(listeners)) {
        listeners.forEach((listener, index) =>
            removeListeners(listener, object[index])
        );
    } else if (typeof listeners === 'object' && listeners !== null) {
        Object.keys(listeners).forEach(key =>
            removeListeners(listeners[key], object[key])
        );
    } else if (listeners) {
        const removeListener = object._parent
            ? object._parent.removeListener.bind(object._parent)
            : object.removeListener.bind(object);
        removeListener(listeners);
    }
}
