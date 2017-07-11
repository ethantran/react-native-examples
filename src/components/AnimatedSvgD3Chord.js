// @flow
import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-chord';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3ShapeArc from './AnimatedSvgD3ShapeArc';
import D3Ribbon from './AnimatedSvgD3Ribbon';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type ChordLayout = d3.ChordLayout;
type Chords = d3.Chords;
type Props = {
    matrix: number[][]
};

export const args = ['padAngle', 'sortGroups', 'sortSubgroups', 'sortChords'];

function createGenerator(props, generator?: ChordLayout): ChordLayout {
    generator = generator || d3.chord();
    return args.reduce((acc: ChordLayout, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getChords(generator: ChordLayout, matrix): Chords {
    return generator(matrix);
}

const defaultProps = {
    chordProps: () => ({}),
    groupProps: () => ({})
};

class SvgD3Chord extends Component {
    props: Props;
    generator: ChordLayout;
    matrix: AnimatedListener;
    chords: Chords;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.matrix = listen(props.matrix, _ =>
            this.setNativeProps({ _listener: true })
        );
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props._listener) {
            const chords = getChords(this.generator, this.matrix.values);
            chords.groups.forEach((group, i) => {
                const key = 'group' + group.index;
                const component = this._components[key];
                component && component.setNativeProps(group);
            });
            chords.forEach((chord, i) => {
                const key = chord.source.index + ',' + chord.source.subindex;
                const component = this._components[key];
                component && component.setNativeProps(chord);
            });
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const matrixChanged = nextProps.matrix !== this.props.matrix;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (matrixChanged) {
            removeListeners(this.matrix);
            this.matrix = listen(nextProps.matrix, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || matrixChanged;
    }
    componentWillUnmount() {
        removeListeners(this.matrix);
    }
    render() {
        const filteredProps = omit(this.props, args);
        const chords = getChords(this.generator, this.matrix.values);
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {chords.groups.map(group => {
                    const key = 'group' + group.index;
                    return (
                        <D3ShapeArc
                            key={key}
                            ref={component =>
                                (this._components[key] = component)}
                            {...this.props.groupProps(group)}
                            {...group}
                        />
                    );
                })}
                {chords.map(chord => {
                    const key =
                        chord.source.index + ',' + chord.source.subindex;
                    return (
                        <D3Ribbon
                            key={key}
                            ref={component =>
                                (this._components[key] = component)}
                            {...this.props.chordProps(chord)}
                            {...chord}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3Chord.defaultProps = defaultProps;
SvgD3Chord = AnimatedSvgFix(SvgD3Chord);
export default SvgD3Chord;
