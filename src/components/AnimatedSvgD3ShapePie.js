import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';
import D3ShapeArc from './AnimatedSvgD3ShapeArc';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type Pie = d3.Pie;
type PieArcDatum = d3.PieArcDatum;
type Props = {
    arcProps: (arc: PieArcDatum, i: number) => Object,
    renderArc: (arc: PieArcDatum, i: number) => ?ReactElement<any>
};

export const args = [
    'value',
    'sort',
    'sortValues',
    'startAngle',
    'endAngle',
    'padAngle'
];

function createGenerator(props, generator?: Pie): Pie {
    generator = generator || d3.pie();
    return args.reduce((acc: Pie, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getArcData(generator: Pie, data): PieArcDatum[] {
    return generator(data);
}

const defaultProps = {
    arcProps: () => ({}),
    renderArc: null
};

class SvgD3ShapePie extends Component {
    props: Props;
    generator: Pie;
    data: AnimatedListener;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = listen(props.data, _ =>
            this.setNativeProps({ _listener: true })
        );
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props._listener) {
            const arcData = getArcData(this.generator, this.data.values);
            arcData.forEach((arc, i) => {
                const component = this._components[arc.index];
                component && component.setNativeProps(arc);
            });
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const dataChanged = nextProps.data !== this.props.data;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (dataChanged) {
            removeListeners(this.data);
            this.data = listen(nextProps.data, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || dataChanged;
    }
    componentWillUnmount() {
        removeListeners(this.data);
    }
    renderArc = (arc, i) => {
        return (
            <D3ShapeArc
                key={arc.index}
                ref={component => (this._components[arc.index] = component)}
                {...arc}
                {...this.props.arcProps(arc, i)}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const arcData = getArcData(this.generator, this.data.values);
        const renderArc = this.props.renderArc || this.renderArc;
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {arcData.map((arc, i) => {
                    const element = renderArc(arc, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component =>
                                (this._components[arc.index] = component)
                        });
                    }
                    return element;
                })}
            </G>
        );
    }
}
SvgD3ShapePie.defaultProps = defaultProps;
SvgD3ShapePie = Animated.createAnimatedComponent(SvgD3ShapePie);
export default SvgD3ShapePie;
