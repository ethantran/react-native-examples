import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeData from './D3ShapeData';
import D3ShapeArc from './AnimatedSvgD3ShapeArc';

export const args = ['value', 'sort', 'sortValues', 'startAngle', 'endAngle', 'padAngle'];

function createGenerator(props) {
    let gen = d3.pie();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, gen);
}

function getArcData(generator, data) {
    return generator(data);
}

class SvgD3ShapePie extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.prevProps = pick(props, args);
        this.data = props.children && props.children.length ? this.listenToChildren(props) : this.listenToData(props);
        this.arcData = getArcData(this.generator, this.data);
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props);
        }
        if (argChanged || props.updateD3Shape) {
            this.arcData = getArcData(this.generator, this.data);
            this.arcData.forEach((arcData, i) => {
                this._components[arcData.index] && this._components[arcData.index].setNativeProps(arcData);
            });
            this.prevProps = Object.assign(this.prevProps, pick(props, args));
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
    listenToChildren = ({ children }) => {
        this.listeners = [];
        let data = [];
        let dataIndex = 0;
        React.Children.forEach(children, (child) => {
            if (child) {
                if (child.type === D3ShapeData) {
                    const dataItem = this.listenToDataItem(child.props, dataIndex);
                    data[dataIndex] = dataItem;
                    dataIndex += 1;
                }
            }
        });
        return data;
    }
    listenToData = ({ data }) => {
        this.listeners = [];
        return data.map((dataItem, index) => this.listenToDataItem(dataItem, index));
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
    removeAllListeners = ({ children, data }) => {
        React.Children.forEach(children, (child) => {
            if (child) {
                if (child.type === D3ShapeData) {
                    this.removeListeners(child.props);
                }
            }
        });
        data.forEach(item => this.removeListeners(item));
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
        const childrenChanged = nextProps.children !== this.props.children;
        const dataChanged = nextProps.children !== this.props.children;
        if (argChanged) {
            this.generator = createGenerator(nextProps);
        }
        if (childrenChanged) {
            this.removeAllListeners(this.props);
            this.data = this.listenToChildren(nextProps);
        }
        if (dataChanged) {
            this.removeAllListeners(this.props);
            this.data = this.listenToData(nextProps);
        }
        return argChanged || childrenChanged || dataChanged;
    }
    componentWillUnmount() {
        this.removeAllListeners(this.props);
    }
    render() {
        const filteredProps = omit(this.props, args);
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}>
                {this.arcData.map((arcData, i) => {
                    return (
                        <D3ShapeArc
                            key={arcData.index}
                            ref={component => (this._components[arcData.index] = component)}
                            {...this.data[arcData.index]}
                            {...arcData}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3ShapePie = AnimatedSvgFix(SvgD3ShapePie);
export default SvgD3ShapePie;
