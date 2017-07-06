import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeData from './D3ShapeData';

export const args = ['keys', 'value', 'order', 'offset'];

function createGenerator(props, generator) {
    generator = generator || d3.stack();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, generator);
}

function getElementData(generator, data) {
    return generator(data);
}

class SvgD3ShapeLine extends Component {
    static defaultProps = {
        elementProps: () => ({}),
        renderElement: () => null
    }
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = props.children && props.children.length ? this.listenToChildren(props) : this.listenToData(props);
        this.elementData = getElementData(this.generator, this.data);
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props.updateD3Shape) {
            this.elementData = getElementData(this.generator, this.data);
            this.elementData.forEach((element, i) => {
                this._components[i].setNativeProps({ data: element });
            });
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
        return data.map(this.listenToDataItem);
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
        data.forEach(this.removeListeners);
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
            this.generator = createGenerator(nextProps, this.generator);
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
                {this.elementData.map((element, i) => {
                    const child = this.props.renderElement(element, i);
                    const extraProps = {
                        ref: component => (this._components[i] = component)
                    };
                    return React.cloneElement(child, extraProps);
                })}
            </Svg.G>
        );
    }
}
SvgD3ShapeLine = AnimatedSvgFix(SvgD3ShapeLine);
export default SvgD3ShapeLine;
