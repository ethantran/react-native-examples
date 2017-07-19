// @flow
import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-axis';
import omit from 'lodash/omit';

type Axis = d3.Axis;

function identity(x) {
    return x;
}

function number(scale) {
    return function(d) {
        return +scale(d);
    };
}

function center(scale) {
    var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
    if (scale.round()) {
        offset = Math.round(offset);
    }
    return function(d) {
        return +scale(d) + offset;
    };
}

export const args = [
    'scale',
    'ticks',
    'tickArguments',
    'tickValues',
    'tickFormat',
    'tickSize',
    'tickSizeInner',
    'tickSizeOuter',
    'tickPadding'
];
export const axisTypes = ['axisTop', 'axisRight', 'axisBottom', 'axisLeft'];

function createGenerator(props, generator?: Axis): Axis {
    if (!generator) {
        generator = props.axisTop
            ? d3.axisTop()
            : props.axisRight
              ? d3.axisRight()
              : props.axisBottom
                ? d3.axisBottom()
                : props.axisLeft ? d3.axisLeft() : null;
    }
    return args.reduce((acc: Axis, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

export default class SvgD3Axis extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
    }
    render() {
        const top = 1;
        const right = 2;
        const bottom = 3;
        const left = 4;
        // const epsilon = 1e-6;
        const scale = this.generator.scale();
        const tickArguments = this.generator.tickArguments();
        const tickValues = this.generator.tickValues();
        const tickFormat = this.generator.tickFormat();
        const tickSizeInner = this.generator.tickSizeInner();
        const tickSizeOuter = this.generator.tickSizeOuter();
        const tickPadding = this.generator.tickPadding();
        const orient = this.props.axisTop
            ? top
            : this.props.axisRight
              ? right
              : this.props.axisBottom ? bottom : this.props.axisLeft ? left : 0;
        const k = orient === top || orient === left ? -1 : 1;
        const x = orient === left || orient === right ? 'x' : 'y';
        const y = x === 'x' ? 'y' : 'x';
        const translatePadding = 0;
        const translateX =
            orient === top || orient === bottom
                ? value => value + translatePadding
                : _ => 0;
        const translateY =
            orient === top || orient === bottom
                ? _ => 0
                : value => value + translatePadding;
        const values =
            tickValues == null
                ? scale.ticks
                  ? scale.ticks.apply(scale, tickArguments)
                  : scale.domain()
                : tickValues;
        const format =
            tickFormat == null
                ? scale.tickFormat
                  ? scale.tickFormat.apply(scale, tickArguments)
                  : identity
                : tickFormat;
        const spacing = Math.max(tickSizeInner, 0) + tickPadding;
        const range = scale.range();
        const range0 = +range[0] + 0.5;
        const range1 = +range[range.length - 1] + 0.5;
        const position = (scale.bandwidth ? center : number)(scale.copy());
        const textAnchor =
            orient === right ? 'start' : orient === left ? 'end' : 'middle';
        const d =
            orient === left || orient === right
                ? 'M' +
                  k * tickSizeOuter +
                  ',' +
                  range0 +
                  'H0.5V' +
                  range1 +
                  'H' +
                  k * tickSizeOuter
                : 'M' +
                  range0 +
                  ',' +
                  k * tickSizeOuter +
                  'V0.5H' +
                  range1 +
                  'V' +
                  k * tickSizeOuter;
        // const dy = orient === top ? 0 : orient === bottom ? 0.71 : 0.32;
        const dy = 0;
        const fontSize = 10;
        const filteredProps = omit(this.props, [...args, ...axisTypes]);
        const xValue =
            orient === left || orient === right
                ? k * spacing
                : orient === bottom
                  ? k * spacing - fontSize / 2
                  : k * (spacing * 2 + tickSizeInner);
        const yValue = orient === left || orient === right ? -1 * fontSize : 0;
        return (
            <Svg.G fill="none" fontSize={fontSize} {...filteredProps}>
                <Svg.Path stroke="black" d={d} />
                {values.map((tick, i) => {
                    const p = position(tick);
                    const tickProps = {
                        key: i,
                        translateX: translateX(p),
                        translateY: translateY(p)
                    };
                    const lineProps = {
                        stroke: 'black',
                        [x + '2']: k * tickSizeInner
                    };
                    const textProps = {
                        textAnchor,
                        fill: 'black',
                        [x]: xValue,
                        [y]: yValue,
                        dy
                    };
                    return (
                        <Svg.G {...tickProps}>
                            <Svg.Line {...lineProps} />
                            <Svg.Text {...textProps}>
                                {format(tick)}
                            </Svg.Text>
                        </Svg.G>
                    );
                })}
            </Svg.G>
        );
    }
}
