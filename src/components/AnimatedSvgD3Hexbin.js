// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-hexbin';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';
import Path from './AnimatedSvgPath';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

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
    points: AnimatedListener;
    bins: Bin[];
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;

    constructor(props: Props) {
        super(props);
        this.generator = createGenerator(props);
        this.points = listen(props.points, _ =>
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
            const bins = getBins(this.generator, this.points.values);
            const d = this.generator.hexagon();
            bins.forEach((bin, i) => {
                const component = this._components[i];
                component &&
                    component.setNativeProps({
                        d,
                        translateX: bin.x,
                        translateY: bin.y
                    });
            });
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
        if (pointsChanged) {
            removeListeners(this.points);
            this.points = listen(nextProps.points, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || pointsChanged;
    }
    componentWillUnmount() {
        removeListeners(this.values);
    }
    renderBin = (bin, i) => {
        const d = this.generator.hexagon();
        return (
            <Path
                ref={component => (this._components[i] = component)}
                key={i}
                d={d}
                translateX={bin.x}
                translateY={bin.y}
                {...this.props.binProps}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const bins = getBins(this.generator, this.points.values);
        const renderBin = this.props.renderBin || this.renderBin;
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {bins.map((bin, i) => {
                    const element = renderBin(bin, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component => (this._components[i] = component)
                        });
                    }
                    return element;
                })}
            </G>
        );
    }
}
SvgD3Hexbin.defaultProps = defaultProps;
SvgD3Hexbin = Animated.createAnimatedComponent(SvgD3Hexbin);
export default SvgD3Hexbin;
