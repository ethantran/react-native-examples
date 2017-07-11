/**
 * TODO: figure out how to animate props.root
 * @flow
 */

import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-hierarchy';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';

type Cluster = typeof d3.cluster;
type Node = d3.HierarchyNode;
type PointNode = d3.HierarchyPointNode;
type Layout = d3.ClusterLayout;

type Props = Cluster & {
    root: Object,
    leafProps: (leaf: Object, i: number) => Object,
    renderLeaf: (leaf: Object, i: number) => ?ReactElement<any>,
    renderNode: (node: Node, i: number) => ?ReactElement<any>
};

export const args = ['size', 'nodeSize', 'separation'];

function createGenerator(props, generator?: Layout): Layout {
    generator = generator || d3.cluster();
    return args.reduce((acc: Layout, arg: string) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getNode(generator: Layout, root): PointNode {
    return generator(root);
}

const defaultProps = {
    leafProps: () => ({}),
    renderLeaf: null,
    renderNode: null
};

class SvgD3HierarchyCluster extends Component {
    props: Props;
    generator: Layout;
    node: PointNode;
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;

    constructor(props: Props) {
        super(props);
        this.generator = createGenerator(props);
        this.node = getNode(this.generator, this.props.root);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            this.node = getNode(this.generator, this.props.root);
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps: Props) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const rootChanged = nextProps.root !== this.props.root;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (argChanged || rootChanged) {
            this.node = getNode(this.generator, nextProps.root);
        }
        return argChanged || rootChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        if (this.props.renderNode) {
            return this.props.renderNode(this.node);
        }
        let items;
        let renderItem;
        if (this.props.renderAncestor) {
            items = this.node.ancestors();
            renderItem = this.props.renderAncestor;
        } else if (this.props.renderDescendant) {
            items = this.node.descendants();
            renderItem = this.props.renderDescendant;
        } else if (this.props.renderLeaf) {
            items = this.node.leaves();
            renderItem = this.props.renderLeaf;
        } else if (this.props.renderLink) {
            items = this.node.links();
            renderItem = this.props.renderLink;
        }
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {items.map((item, i) => {
                    const element = renderItem(item, i);
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
SvgD3HierarchyCluster.defaultProps = defaultProps;
SvgD3HierarchyCluster = Animated.createAnimatedComponent(SvgD3HierarchyCluster);
export default SvgD3HierarchyCluster;
