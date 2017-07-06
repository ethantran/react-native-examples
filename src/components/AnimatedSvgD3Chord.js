import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-chord';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeArc from './AnimatedSvgD3ShapeArc';
import D3Ribbon from './AnimatedSvgD3Ribbon';

export const args = ['padAngle', 'sortGroups', 'sortSubgroups', 'sortChords'];

function createGenerator(props, generator) {
    generator = generator || d3.chord();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, generator);
}

function getChords(generator, matrix) {
    return generator(matrix);
}

class SvgD3Chord extends Component {
    static defaultProps = {
        chordProps: () => {},
        groupProps: () => {}
    }
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.matrix = this.listenToMatrix(props);
        this.chords = getChords(this.generator, this.matrix);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props.updateD3Shape) {
            this.chords = getChords(this.generator, this.matrix);
            this.chords.groups.forEach((group, i) => {
                const key = 'group' + group.index;
                this._components[key] && this._components[key].setNativeProps(group);
            });
            this.chords.forEach((chord, i) => {
                const key = chord.source.index + ',' + chord.source.subindex;
                this._components[key] && this._components[key].setNativeProps(chord);
            });
        }
        this._component && this._component.setNativeProps(props);
    }
    updateMatrixItemProp = (matrixIndex, key, value) => {
        let newMatrix = [...this.matrix];
        let newMatrixItem = [...newMatrix[matrixIndex]];
        newMatrixItem[key] = value;
        newMatrix[matrixIndex] = newMatrixItem;
        return newMatrix;
    }
    addListenerForAnimatedArgProp = (prop, matrixIndex, propKey) => {
        const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
        const interpolator = prop._interpolation;
        let callback = e => e;
        if (interpolator) {
            callback = _value => interpolator(_value);
        }
        let prevCallback = callback;
        callback = e => {
            const value = prevCallback(e.value);
            this.matrix = this.updateMatrixItemProp(matrixIndex, propKey, value);
            this.setNativeProps({ updateD3Shape: true });
        };
        return addListener(callback);
    }
    listenToMatrix = ({ matrix }) => {
        this.listeners = [];
        return matrix.map(this.listenToMatrixItem);
    }
    listenToMatrixItem = (matrixItem, matrixIndex) => {
        return matrixItem.map((value, key) => {
            if (value instanceof Animated.Value || value instanceof Animated.Interpolation) {
                const listener = this.addListenerForAnimatedArgProp(value, matrixIndex, key);
                this.listeners.push(listener);
                return value.__getValue();
            } else {
                return value;
            }
        });
    }
    removeAllListeners = ({ matrix }) => {
        matrix && matrix.forEach(this.removeListeners);
        this.listeners = [];
    }
    removeListeners = (matrixItem) => {
        matrixItem.forEach((value) => {
            if (value instanceof Animated.Value) {
                this.listeners.forEach(listener => value.removeListener(listener));
            } else if (value instanceof Animated.Interpolation) {
                this.listeners.forEach(listener => value._parent.removeListener(listener));
            }
        });
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        const matrixChanged = nextProps.matrix !== this.props.matrix;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (matrixChanged) {
            this.removeAllListeners(this.props);
            this.matrix = this.listenToMatrix(nextProps);
        }
        return argChanged || matrixChanged;
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
                {this.chords.groups.map((group) => {
                    return (
                        <D3ShapeArc
                            key={'group' + group.index}
                            ref={component => (this._components['group' + group.index] = component)}
                            {...this.props.groupProps(group)}
                            {...group}
                        />
                    );
                })}
                {this.chords.map((chord) => {
                    const key = chord.source.index + ',' + chord.source.subindex;
                    return (
                        <D3Ribbon
                            key={key}
                            ref={component => (this._components[key] = component)}
                            {...this.props.chordProps(chord)}
                            {...chord}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3Chord = AnimatedSvgFix(SvgD3Chord);
export default SvgD3Chord;
