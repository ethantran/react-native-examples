/**
 * TODO: figure out how to animate props.points
 * @flow
 */

import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-hexbin';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

type Hexbin = typeof d3.hexbin;
type Bin = number[] & {
    x: number,
    y: number
};

type Props = Hexbin & {
    points: any[],
    binProps: (bin: Object, i: number) => Object,
    renderBin: (bin: Object, i: number) => ?ReactElement<any>
};

export const args = [
    'hexagon',
    'centers',
    'mesh',
    'x',
    'y',
    'radius',
    'extent',
    'size'
];

function createGenerator(props, generator?: Hexbin): Hexbin {
    generator = generator || d3.hexbin();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getBins(generator: Hexbin, points): Bin[] {
    return generator(points);
}

const defaultProps = {
    binProps: () => ({}),
    renderBin: null
};

class SvgD3Hexbin extends Component {
    props: Props;
    generator: Hexbin;
    bins: Bin[];
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;

    constructor(props: Props) {
        super(props);
        this.generator = createGenerator(props);
        this.bins = getBins(this.generator, this.props.points);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            this.bins = getBins(this.generator, this.props.points);
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps: Props) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const pointsChanged = nextProps.points !== this.props.points;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (argChanged || pointsChanged) {
            this.bins = getBins(this.generator, nextProps.points);
        }
        return argChanged || pointsChanged;
    }
    renderBin = (bin, i) => {
        const d = this.generator.hexagon();
        return (
            <Svg.Path
                ref={component => (this._components[i] = component)}
                d={d}
                translateX={bin.x}
                translateY={bin.y}
                {...this.props.binProps}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const renderBin = this.props.renderBin || this.renderBin;
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {this.bins.map((bin, i) => {
                    const element = renderBin(bin, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component => (this._components[i] = component)
                        });
                    }
                    return element;
                })}
            </Svg.G>
        );
    }
}
SvgD3Hexbin.defaultProps = defaultProps;
SvgD3Hexbin = AnimatedSvgFix(SvgD3Hexbin);
export default SvgD3Hexbin;
