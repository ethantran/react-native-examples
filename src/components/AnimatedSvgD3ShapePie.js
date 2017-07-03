import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeData from './D3ShapeData';
import D3ShapeArc from './AnimatedSvgD3ShapeArc';

const NativeSvgPath = Svg.Path;

export const args = ['startAngle', 'endAngle', 'padAngle'];

function createGenerator(props) {
    return d3.pie(pick(props, args));
}

function getArcData(generator, data) {
    return generator(data);
}

class SvgD3ShapePie extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.prevProps = pick(props, args);
        this.data = this.listenToChildren(props);
        this.arcData = getArcData(this.generator, this.data.values);
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props);
        }
        if (argChanged || props.updateD3Shape) {
            this.arcData = getArcData(this.generator, this.data.values);
            this.arcData.forEach((arcData, i) => {
                this._components[i].setNativeProps(arcData);
            });
            this.prevProps = Object.assign(this.prevProps, pick(props, args));
        }
        this._component && this._component.setNativeProps(props);
    }
    updateDataValue = (dataIndex, value) => {
        let newData = [...this.data.values];
        newData[dataIndex] = value;
        return newData;
    }
    addListenerForAnimatedArgProp = (prop, dataIndex) => {
        const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
        const interpolator = prop._interpolation;
        let callback = e => e;
        if (interpolator) {
            callback = _value => interpolator(_value);
        }
        let prevCallback = callback;
        callback = e => {
            const value = prevCallback(e.value);
            this.data.values = this.updateDataValue(dataIndex, value);
            this.setNativeProps({ updateD3Shape: true });
        };
        return addListener(callback);
    }
    listenToChildren = ({ children }) => {
        this.listeners = [];
        let dataValues = [];
        let dataProps = [];
        let dataIndex = 0;
        React.Children.forEach(children, (child, i) => {
            if (child) {
                if (child.type === D3ShapeData) {
                    const { value: prop, ...rest } = child.props;
                    dataProps[dataIndex] = rest;
                    if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                        dataValues[dataIndex] = prop.__getValue();
                        const listener = this.addListenerForAnimatedArgProp(prop, dataIndex);
                        this.listeners.push(listener);
                    } else {
                        dataValues[dataIndex] = prop;
                    }
                    dataIndex += 1;
                }
            }
        });
        return {
            values: dataValues,
            props: dataProps
        };
    }
    removeAllListeners = ({ children }) => {
        React.Children.forEach(children, (child) => {
            if (child) {
                if (child.type === D3ShapeData) {
                    const prop = child.props.value;
                    if (prop instanceof Animated.Value) {
                        this.listeners.forEach(listener => prop.removeListener(listener));
                    } else if (prop instanceof Animated.Interpolation) {
                        this.listeners.forEach(listener => prop._parent.removeListener(listener));
                    }
                }
            }
        });
        this.listeners = [];
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        const childrenChanged = nextProps.children !== this.props.children;
        if (argChanged) {
            this.generator = createGenerator(nextProps);
        }
        if (childrenChanged) {
            this.removeAllListeners(this.props);
            this.data = this.listenToChildren(nextProps);
        }
        return false;
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
                            ref={component => (this._components[i] = component)}
                            {...this.data.props[i]}
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
