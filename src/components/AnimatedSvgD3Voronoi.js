// @flow
/**
 * TODO: animate data
 */
import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-voronoi';
import omit from 'lodash/omit';

type VoronoiLayout = d3.VoronoiLayout;
type VoronoiEdge = d3.VoronoiEdge;
type VoronoiCell = d3.VoronoiCell;
type VoronoiDiagram = d3.VoronoiDiagram;

import AnimatedSvgFix from './AnimatedSvgFix';

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
    diagram: VoronoiDiagram;
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.diagram = getDiagram(this.generator, this.props.data);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            this.diagram = getDiagram(this.generator, this.props.data);
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
            this.diagram = getDiagram(this.generator, nextProps.data);
        }
        return argChanged || dataChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        if (this.props.renderDiagram) {
            return this.props.renderDiagram(this.diagram);
        }
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {this.props.renderPolygon && this.diagram.polygons().map(this.props.renderPolygon)}
                {this.props.renderTriangle && this.diagram.triangles().map(this.props.renderTriangle)}
                {this.props.renderLink && this.diagram.links().map(this.props.renderLink)}
            </Svg.G>
        );
    }
}
SvgD3Voronoi.defaultProps = defaultProps;
SvgD3Voronoi = AnimatedSvgFix(SvgD3Voronoi);
export default SvgD3Voronoi;
