// @flow
/**
 * TODO: animate data
 */
import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-shape';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type Stack = d3.Stack;
type Series = d3.Series;
type Props = typeof d3.stack & {
    renderSeries: (series: Series, i: number) => ?ReactElement<any>,
    seriesProps: (series: Series, i: number) => Object
};

export const args = ['keys', 'value', 'order', 'offset'];

function createGenerator(props, generator?: Stack): Stack {
    generator = generator || d3.stack();
    return args.reduce((acc: Stack, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getSeriesData(generator: Stack, data): Series[] {
    return generator(data);
}

const defaultProps = {
    seriesProps: () => ({}),
    renderSeries: () => null
};

class SvgD3ShapeLine extends Component {
    static defaultProps = typeof defaultProps;
    props: Props;
    generator: Stack;
    data: AnimatedListener;
    seriesData: Series[];
    _component: any;
    _components: Object;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = listen(props.data, _ =>
            this.setNativeProps({ _listener: true })
        );
        this.seriesData = getSeriesData(this.generator, this.data.values);
        this._components = [];
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props._listener) {
            this.seriesData = getSeriesData(this.generator, this.data.values);
            this.seriesData.forEach((series, i) => {
                const component = this._components[i];
                component && component.setNativeProps({ data: series });
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
            removeListeners(this.data.listeners, this.props.data);
            this.data = listen(nextProps.data, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || dataChanged;
    }
    componentWillUnmount() {
        removeListeners(this.data.listeners, this.props.data);
    }
    render() {
        const filteredProps = omit(this.props, args);
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {this.seriesData.map((seriesItem, i) => {
                    const element = this.props.renderSeries(seriesItem, i);
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
SvgD3ShapeLine.defaultProps = defaultProps;
SvgD3ShapeLine = AnimatedSvgFix(SvgD3ShapeLine);
export default SvgD3ShapeLine;
