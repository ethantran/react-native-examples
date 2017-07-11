/**
 * TODO: figure out how to animate props.root
 * @flow
 */

import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-hierarchy';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

type Partition = d3.partition;
type Node = d3.HierarchyNode;
type RectangularNode = d3.HierarchyRectangularNode;
type Layout = d3.PartitionLayout;

type Props = Partition & {
    root: Object,
    leafProps: (leaf: Object, i: number) => Object,
    renderLeaf: (leaf: Object, i: number) => ?ReactElement<any>,
    renderNode: (node: Node, i: number) => ?ReactElement<any>
};

export const args = [
    'size',
    'round',
    'padding',
];

function createGenerator(
    props,
    generator?: Layout
): Layout {
    generator = generator || d3.partition();
    return args.reduce((acc: Layout, arg: string) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getNode(generator: Layout, root): RectangularNode {
    return generator(root);
}

const defaultProps = {
    leafProps: () => ({}),
    renderLeaf: null,
    renderNode: null
};

class SvgD3HierarchyPartition extends Component {
    props: Props;
    generator: Layout;
    node: RectangularNode;
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
            <Svg.G
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
            </Svg.G>
        );
    }
}
SvgD3HierarchyPartition.defaultProps = defaultProps;
SvgD3HierarchyPartition = AnimatedSvgFix(SvgD3HierarchyPartition);
export default SvgD3HierarchyPartition;
