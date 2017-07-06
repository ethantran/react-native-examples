import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-chord';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgPath = Svg.Path;

export const args = [/* 'source', 'target', */ 'radius', 'startAngle', 'endAngle'];

function createGenerator(props, generator) {
    generator = generator || d3.ribbon();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, generator);
}

function createPath(generator, data) {
    return generator(data);
}

class SvgD3Ribbon extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = this.listenToData(props);
        this.d = createPath(this.generator, this.data);
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (props.source) {
            this.data.source = this.listenToDataItem(props.source, 'source');
        }
        if (props.target) {
            this.data.target = this.listenToDataItem(props.target, 'target');
        }
        if (argChanged || props.updateD3Ribbon || props.source || props.target) {
            props.d = createPath(this.generator, this.data);
        }
        this._component && this._component.setNativeProps(props);
    }
    updateDataItemProp = (dataIndex, propKey, value) => {
        let newData = [...this.data];
        let newDataItem = {
            ...newData[dataIndex],
            [propKey]: value
        };
        newData[dataIndex] = newDataItem;
        return newData;
    }
    addListenerForAnimatedArgProp = (prop, dataIndex, propKey) => {
        const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
        const interpolator = prop._interpolation;
        let callback = e => e;
        if (interpolator) {
            callback = _value => interpolator(_value);
        }
        let prevCallback = callback;
        callback = e => {
            const value = prevCallback(e.value);
            this.data = this.updateDataItemProp(dataIndex, propKey, value);
            this.setNativeProps({ updateD3Shape: true });
        };
        return addListener(callback);
    }
    listenToData = ({ source, target }) => {
        this.listeners = [];
        return {
            source: this.listenToDataItem(source, 'source'),
            target: this.listenToDataItem(target, 'target'),
        };
    }
    listenToDataItem = (props, dataIndex) => {
        return Object.keys(props).reduce((acc, key) => {
            const prop = props[key];
            if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                acc[key] = prop.__getValue();
                const listener = this.addListenerForAnimatedArgProp(prop, dataIndex, key);
                this.listeners.push(listener);
            } else {
                acc[key] = prop;
            }
            return acc;
        }, {});
    }
    removeAllListeners = ({ children, source, target }) => {
        this.removeListeners(source);
        this.removeListeners(target);
        this.listeners = [];
    }
    removeListeners = (props) => {
        Object.keys(props).forEach((key) => {
            const prop = props[key];
            if (prop instanceof Animated.Value) {
                this.listeners.forEach(listener => prop.removeListener(listener));
            } else if (prop instanceof Animated.Interpolation) {
                this.listeners.forEach(listener => prop._parent.removeListener(listener));
            }
        });
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        const sourceChanged = nextProps.source !== this.props.source;
        const targetChanged = nextProps.target !== this.props.target;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (sourceChanged) {
            this.removeListeners(this.props.source);
            this.data.source = this.listenToDataItem(nextProps.source, 'source');
        }
        if (targetChanged) {
            this.removeListeners(this.props.target);
            this.data.target = this.listenToDataItem(nextProps.target, 'target');
        }
        return argChanged || sourceChanged || targetChanged;
    }
    componentWillUnmount() {
        this.removeAllListeners(this.props);
    }
    render() {
        const filteredProps = omit(this.props, args);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...filteredProps}
                d={this.d}
            />
        );
    }
}
SvgD3Ribbon = AnimatedSvgFix(SvgD3Ribbon);
export default SvgD3Ribbon;
