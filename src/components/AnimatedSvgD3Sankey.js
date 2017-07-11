// @flow
/**
 * BUG: animating nodeWidth or nodePadding crashes
 */
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-sankey';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';
import Path from './AnimatedSvgPath';
import Rect from './AnimatedSvgRect';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type Sankey = typeof d3.sankey;

type Graph = {
    nodes: Node[],
    links: Link[]
};

type Props = Sankey & {
    values: Values,
    renderGraph?: (graph: Graph, i: number) => ?ReactElement<any>,
    renderLink?: (link: Link, i: number) => ?ReactElement<any>,
    renderNode?: (node: Node, i: number) => ?ReactElement<any>,
    linkProps: (link: Link, i: number) => Object,
    nodeProps: (node: Node, i: number) => Object
};

type Node = {
    depth: number,
    height: number,
    index: number,
    name: string,
    sourceLinks: Link[],
    targetLinks: Link[],
    x0: number,
    x1: number,
    y0: number,
    y1: number
};

type Link = {
    index: number,
    source: Node,
    target: Node,
    value: number,
    width: number,
    y0: number,
    y1: number
};

type Values = {
    nodes: Node[],
    links: Link[]
};

export const args = [
    'update',
    'nodes',
    'links',
    'nodeId',
    'nodeAlign',
    'nodeWidth',
    'nodePadding',
    'extent',
    'size',
    'iterations'
];

function createGenerator(props, generator?: Sankey): Sankey {
    generator = generator || d3.sankey();
    return args.reduce((acc: Sankey, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getGraph(generator: Sankey, values: Values): Graph {
    return generator(values);
}

const defaultProps = {
    renderGraph: null,
    renderLink: null,
    renderNode: null,
    linkProps: () => ({}),
    nodeProps: () => ({})
};

class SvgD3Sankey extends Component {
    props: Props;
    graph: Graph;
    generator: Sankey;
    values: AnimatedListener;
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;

    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.values = listen(props.values, _ =>
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
            const graph = getGraph(this.generator, this.values.values);
            graph.links.forEach((link, i) => {
                const component = this._components['link' + link.index];
                component &&
                    component.setNativeProps({
                        d: d3.sankeyLinkHorizontal()(link)
                    });
            });
            graph.nodes.forEach((node, i) => {
                const component = this._components['node' + node.index];
                component &&
                    component.setNativeProps({
                        x: node.x0,
                        y: node.y0,
                        height: node.y1 - node.y0,
                        width: node.x1 - node.x0
                    });
            });
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const valuesChanged = nextProps.values !== this.props.values;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (valuesChanged) {
            removeListeners(this.values);
            this.values = listen(nextProps.values, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || valuesChanged;
    }
    componentWillUnmount() {
        removeListeners(this.values);
    }
    renderLink = (link, i) => {
        const key = 'link' + link.index;
        return (
            <Path
                ref={component => (this._components[key] = component)}
                key={key}
                d={d3.sankeyLinkHorizontal()(link)}
                {...this.props.linkProps(link, i)}
            />
        );
    };
    renderNode = (node, i) => {
        const key = 'node' + node.index;
        return (
            <Rect
                ref={component => (this._components[key] = component)}
                key={key}
                x={node.x0}
                y={node.y0}
                height={node.y1 - node.y0}
                width={node.x1 - node.x0}
                {...this.props.nodeProps(node, i)}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const graph = getGraph(this.generator, this.values.values);
        if (this.props.renderGraph) {
            return this.props.renderGraph(graph);
        }
        const renderLink = this.props.renderLink || this.renderLink;
        const renderNode = this.props.renderNode || this.renderNode;
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {graph.links.map((link, i) => {
                    const key = 'link' + link.index;
                    const element = renderLink(link, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component =>
                                (this._components[key] = component)
                        });
                    }
                    return element;
                })}
                {graph.nodes.map((node, i) => {
                    const key = 'node' + node.index;
                    const element = renderNode(node, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component =>
                                (this._components[key] = component)
                        });
                    }
                    return element;
                })}
            </G>
        );
    }
}
SvgD3Sankey.defaultProps = defaultProps;
SvgD3Sankey = Animated.createAnimatedComponent(SvgD3Sankey);
export default SvgD3Sankey;
