// @flow
/**
 * TODO: animate data
 */
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-voronoi';
import omit from 'lodash/omit';

type VoronoiLayout = d3.VoronoiLayout;
type VoronoiEdge = d3.VoronoiEdge;
type VoronoiCell = d3.VoronoiCell;
type VoronoiDiagram = d3.VoronoiDiagram;

import G from './AnimatedSvgG';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

export const args = [
    'x',
    'y',
    'extent',
    'size',
    'polygons',
    'triangles',
    'links'
];

type Props = VoronoiDiagram & {
    data: any[],
    renderDiagram: (diagram: VoronoiDiagram, i: number) => ?ReactElement<any>,
    renderEdge: (edge: VoronoiEdge, i: number) => ?ReactElement<any>,
    renderCell: (cell: VoronoiCell, i: number) => ?ReactElement<any>,
    edgeProps: (edge: VoronoiEdge, i: number) => Object,
    cellProps: (cell: VoronoiCell, i: number) => Object
};

function createGenerator(props, generator?: VoronoiLayout): VoronoiLayout {
    generator = generator || d3.voronoi();
    return args.reduce((acc: VoronoiLayout, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getDiagram(generator: VoronoiLayout, data): VoronoiDiagram {
    return generator(data);
}

const defaultProps = {
    renderDiagram: null,
    renderEdge: null,
    renderCell: null,
    edgeProps: () => ({}),
    cellProps: () => ({})
};

class SvgD3Voronoi extends Component {
    props: Props;
    generator: VoronoiLayout;
    data: AnimatedListener;
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = listen(props.data, _ =>
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
            const diagram = getDiagram(this.generator, this.data.values);
            if (this.props.renderPolygon) {
                diagram.polygons().forEach((polygon, i) => {
                    const component = this._components['polygon' + i];
                    component && component.setNativeProps({ polygon });
                });
            }
            if (this.props.renderTriangle) {
                diagram.triangles().forEach((triangle, i) => {
                    const component = this._components['triangle' + i];
                    component && component.setNativeProps({ triangle });
                });
            }
            if (this.props.renderLink) {
                diagram.links().forEach((link, i) => {
                    const component = this._components['link' + i];
                    component && component.setNativeProps({ link });
                });
            }
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
    render() {
        const filteredProps = omit(this.props, args);
        const diagram = getDiagram(this.generator, this.data.values);
        if (this.props.renderDiagram) {
            return this.props.renderDiagram(diagram);
        }
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {this.props.renderPolygon &&
                    diagram.polygons().map((polygon, i) => {
                        const element = this.props.renderPolygon(polygon, i);
                        if (element) {
                            return React.cloneElement(element, {
                                ref: component =>
                                    (this._components[
                                        'polygon' + i
                                    ] = component)
                            });
                        }
                        return element;
                    })}
                {this.props.renderTriangle &&
                    diagram.triangles().map((triangle, i) => {
                        const element = this.props.renderTriangle(triangle, i);
                        if (element) {
                            return React.cloneElement(element, {
                                ref: component =>
                                    (this._components[
                                        'triangle' + i
                                    ] = component)
                            });
                        }
                        return element;
                    })}
                {this.props.renderLink &&
                    diagram.links().map((link, i) => {
                        const element = this.props.renderLink(link, i);
                        if (element) {
                            return React.cloneElement(element, {
                                ref: component =>
                                    (this._components['link' + i] = component)
                            });
                        }
                        return element;
                    })}
            </G>
        );
    }
}
SvgD3Voronoi.defaultProps = defaultProps;
SvgD3Voronoi = Animated.createAnimatedComponent(SvgD3Voronoi);
export default SvgD3Voronoi;
