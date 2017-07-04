import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeData from './D3ShapeData';
import D3ShapeArea from './AnimatedSvgD3ShapeArea';

export const args = ['keys', 'value', 'order', 'offset'];

function createGenerator(props) {
    let gen = d3.stack();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, gen);
}

function getAreaData(generator, data) {
    return generator(data);
}

class SvgD3ShapeLine extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.prevProps = pick(props, args);
        this.data = props.children && props.children.length ? this.listenToChildren(props) : this.listenToData(props);
        this.areaData = getAreaData(this.generator, this.data.items);
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props);
        }
        if (argChanged || props.updateD3Shape) {
            this.areaData = getAreaData(this.generator, this.data.items);
            this.areaData.forEach((dataItem, i) => {
                this._components[i].setNativeProps({ data: dataItem, ...this.data.props[i]});
            });
            this.prevProps = Object.assign(this.prevProps, pick(props, args));
        }
        this._component && this._component.setNativeProps(props);
    }
    updateDataItemProp = (dataIndex, propKey, value) => {
        let newData = [...this.data.items];
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
            this.data.items = this.updateDataItemProp(dataIndex, propKey, value);
            this.setNativeProps({ updateD3Shape: true });
        };
        return addListener(callback);
    }
    listenToChildren = ({ children, keys }) => {
        this.listeners = [];
        let data = { items: [], props: [] };
        let dataIndex = 0;
        React.Children.forEach(children, (child) => {
            if (child) {
                if (child.type === D3ShapeData) {
                    const result = this.listenToDataItem(child.props, keys, dataIndex);
                    data.items[dataIndex] = result.items;
                    data.props[dataIndex] = result.props;
                    dataIndex += 1;
                }
            }
        });
        return data;
    }
    listenToData = ({ data, keys }) => {
        this.listeners = [];
        return data.reduce((acc, dataItem, index) => {
            const result = this.listenToDataItem(dataItem, keys, index);
            acc.items[index] = result.items;
            acc.props[index] = result.props;
            return acc;
        }, { items: [], props: [] });
    }
    listenToDataItem = (props, keys, dataIndex) => {
        const pickedProps = pick(props, [...keys, 'index']);
        const restProps = omit(props, keys);
        return Object.keys(pickedProps).reduce((acc, key) => {
            const prop = props[key];
            if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                acc.items[key] = prop.__getValue();
                const listener = this.addListenerForAnimatedArgProp(prop, dataIndex, key);
                this.listeners.push(listener);
            } else {
                acc.items[key] = prop;
            }
            return acc;
        }, {
            items: [],
            props: restProps
        });
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
        const dataChanged = nextProps.data !== this.props.data;
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
                {this.areaData.map((areaDataItem, i) => {
                    return (
                        <D3ShapeArea
                            key={i}
                            ref={component => (this._components[i] = component)}
                            data={areaDataItem}
                            {...this.data.props[i]}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3ShapeLine = AnimatedSvgFix(SvgD3ShapeLine);
export default SvgD3ShapeLine;
