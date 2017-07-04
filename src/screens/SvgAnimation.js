import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, Dimensions, Button } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { Svg as NativeSvg } from 'expo';
import pick from 'lodash/pick';
const Defs = NativeSvg.Defs;

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import randomPolygons, { randomPolygon } from '../randomPolygons';
import { d as GithubIconSvgPath } from '../components/GithubIconSvgPath';
import { d as TwitterIconSvgPath } from '../components/TwitterIconSvgPath';
import Svg from '../components/AnimatedSvg';
import Circle, { args as circleArgs } from '../components/AnimatedSvgCircle';
import Rect, { args as rectArgs } from '../components/AnimatedSvgRect';
import Ellipse, { args as ellipseArgs } from '../components/AnimatedSvgEllipse';
import Line, { args as lineArgs } from '../components/AnimatedSvgLine';
import Polygon from '../components/AnimatedSvgPolygon';
import Polyline from '../components/AnimatedSvgPolyline';
import D3Path, { argsForCommand as d3PathArgsForCommand } from '../components/AnimatedSvgD3Path';
import D3InterpolatePath from '../components/AnimatedSvgD3InterpolatePath';
import D3ShapeArc, { args as d3ShapeArcArgs } from '../components/AnimatedSvgD3ShapeArc';
import D3ShapePie, { args as d3ShapePieArgs } from '../components/AnimatedSvgD3ShapePie';
import D3ShapeLine, { args as d3ShapeLineArgs } from '../components/AnimatedSvgD3ShapeLine';
import D3ShapeLineRadial, { args as d3ShapeLineRadialArgs } from '../components/AnimatedSvgD3ShapeLineRadial';
import D3ShapeArea, { args as d3ShapeAreaArgs } from '../components/AnimatedSvgD3ShapeArea';
import D3ShapeAreaRadial, { args as d3ShapeAreaRadialArgs } from '../components/AnimatedSvgD3ShapeAreaRadial';
import D3ShapeStack, { args as d3ShapeStackArgs } from '../components/AnimatedSvgD3ShapeStack';
import FlubberPath, { flubberArgsForType } from '../components/AnimatedSvgFlubberPath';
import AnimatedSvgText from '../components/AnimatedSvgText';
import TSpan from '../components/AnimatedSvgTSpan';
import TextPath from '../components/AnimatedSvgTextPath';
import G from '../components/AnimatedSvgG';
import Use from '../components/AnimatedSvgUse';
import LinearGradient, { args as linearGradientArgs } from '../components/AnimatedSvgLinearGradient';
import RadialGradient, { args as radialGradientArgs } from '../components/AnimatedSvgRadialGradient';
import Stop from '../components/AnimatedSvgStop';
import D3PathCommand from '../components/D3PathCommand';
import D3ShapeData from '../components/D3ShapeData';
import StrokeDasharray from '../components/AnimatedSvgStrokeDasharray';

const componentsForType = {
    Circle,
    Rect,
    Ellipse,
    Line,
    Polygon,
    Polyline,
    D3Path,
    D3InterpolatePath,
    D3ShapeArc,
    D3ShapePie,
    D3ShapeLine,
    D3ShapeLineRadial,
    D3ShapeArea,
    D3ShapeAreaRadial,
    D3ShapeStack,
    FlubberPath,
    Text,
    TSpan,
    TextPath,
    G,
    Use,
    LinearGradient,
    RadialGradient,
};
const types = Object.keys(componentsForType);
const transformAnimTypes = [
    'origin+rotation',
    'scale', 'scaleX', 'scaleY',
    'skew', 'skewX', 'skewY',
    'translate', 'translateX', 'translateY',
    'x', 'y', 'x+y',
];
const defaultAnimTypes = ['none', 'defaultProps'];
const fillAnimTypes = ['fill', 'fillOpacity'];
const strokeAnimTypes = ['stroke', 'strokeOpacity', 'strokeWidth', 'strokeDasharray', 'strokeDashoffset', 'strokeDasharray+strokeDashoffset', 'strokeMiterlimit'];
const gradAnimTypes = ['offset', 'stopColor', 'stopOpacity'];
const lineAnimTypes = [...transformAnimTypes, ...strokeAnimTypes];
const shapeAnimTypes = [...fillAnimTypes, ...lineAnimTypes];
const textAnimTypes = ['dx', 'dy', 'dx+dy', 'dxn', 'dyn', 'dxn+dyn', 'fontSize', ...shapeAnimTypes];
const d3PathCommands = Object.keys(d3PathArgsForCommand);
const flubberTypes = Object.keys(flubberArgsForType);
const animTypes = {
    Circle: shapeAnimTypes,
    Rect: shapeAnimTypes,
    Ellipse: shapeAnimTypes,
    Line: lineAnimTypes,
    Polygon: shapeAnimTypes,
    Polyline: shapeAnimTypes,
    Path: shapeAnimTypes,
    D3Path: [...d3PathCommands, ...shapeAnimTypes],
    D3InterpolatePath: shapeAnimTypes,
    D3ShapeArc: [...d3ShapeArcArgs, ...shapeAnimTypes],
    D3ShapePie: [...d3ShapePieArgs, 'data', ...shapeAnimTypes],
    D3ShapeLine: [...d3ShapeLineArgs, 'data', ...shapeAnimTypes],
    D3ShapeLineRadial: [...d3ShapeLineRadialArgs, 'data', ...shapeAnimTypes],
    D3ShapeArea: [...d3ShapeAreaArgs, 'data', ...shapeAnimTypes],
    D3ShapeAreaRadial: [...d3ShapeAreaRadialArgs, 'data', ...shapeAnimTypes],
    D3ShapeStack: [...d3ShapeStackArgs, 'data', ...shapeAnimTypes],
    FlubberPath: [...flubberTypes, 'separateSingle', 'combineSingle', 'interpolateAllSingleAndMatch', ...shapeAnimTypes],
    Text: textAnimTypes,
    TSpan: ['text+tspan', ...textAnimTypes],
    TextPath: ['startOffset', 'text+textpath+tspan', ...textAnimTypes],
    G: ['g+rect', 'g+circle', 'g+ellipse', 'g+line', 'g+polygon', 'g+polyline', 'g+d3path', 'g+text', ...transformAnimTypes],
    Use: transformAnimTypes,
    LinearGradient: [...linearGradientArgs, ...gradAnimTypes],
    RadialGradient: [...radialGradientArgs, ...gradAnimTypes],
};

// this will test using D3ShapeData component instead of props.data
const USE_D3_SHAPE_DATA = false;

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    }
});

function createDefaultProps() {
    return {
        cx: Math.round(randomNumber(1, 100)),
        cy: Math.round(randomNumber(1, 100)),

        cpx: Math.round(randomNumber(1, 100)),
        cpy: Math.round(randomNumber(1, 100)),
        cpx1: Math.round(randomNumber(1, 100)),
        cpy1: Math.round(randomNumber(1, 100)),
        cpx2: Math.round(randomNumber(1, 100)),
        cpy2: Math.round(randomNumber(1, 100)),

        dx: Math.round(randomNumber(1, 100)),
        dy: Math.round(randomNumber(1, 100)),
        dx0: Math.round(randomNumber(1, 100)),
        dy0: Math.round(randomNumber(1, 100)),
        dx1: Math.round(randomNumber(1, 100)),
        dy1: Math.round(randomNumber(1, 100)),
        dx2: Math.round(randomNumber(1, 100)),
        dy2: Math.round(randomNumber(1, 100)),

        px0: Math.round(randomNumber(1, 100)),
        py0: Math.round(randomNumber(1, 100)),
        px1: Math.round(randomNumber(1, 100)),
        py1: Math.round(randomNumber(1, 100)),
        px2: Math.round(randomNumber(1, 100)),
        py2: Math.round(randomNumber(1, 100)),

        fx: Math.round(randomNumber(1, 100)),
        fy: Math.round(randomNumber(1, 100)),

        r: Math.round(randomNumber(1, 100)),
        rx: Math.round(randomNumber(1, 100)),
        ry: Math.round(randomNumber(1, 100)),

        t: 0,

        x: Math.round(randomNumber(1, 100)),
        x1: Math.round(randomNumber(1, 100)),
        x2: Math.round(randomNumber(1, 100)),
        y: Math.round(randomNumber(1, 100)),
        y1: Math.round(randomNumber(1, 100)),
        y2: Math.round(randomNumber(1, 100)),

        offset: Math.random(),

        inputStopColor: 0,
        stopOpacity: Math.random(),

        origin: Math.round(randomNumber(1, 100)),
        originX: Math.round(randomNumber(1, 100)),
        originY: Math.round(randomNumber(1, 100)),

        scale: Math.round(randomNumber(1, 10)),
        scaleX: Math.round(randomNumber(1, 10)),
        scaleY: Math.round(randomNumber(1, 10)),

        skew: Math.round(randomNumber(1, 10)),
        skewX: Math.round(randomNumber(1, 10)),
        skewY: Math.round(randomNumber(1, 10)),

        translate: Math.round(randomNumber(0, Dimensions.get('window').width / 2)),
        translateX: Math.round(randomNumber(1, Dimensions.get('window').width / 2)),
        translateY: Math.round(randomNumber(1, Dimensions.get('window').height / 2)),

        rotate: Math.round(randomNumber(1, 360)),
        rotation: Math.round(randomNumber(1, 360)),

        width: Math.round(randomNumber(1, 100)),
        height: Math.round(randomNumber(1, 100)),

        inputFill: 0,
        fillOpacity: Math.random(),

        fontSize: Math.round(randomNumber(12, 30)),

        inputStroke: 0,
        strokeOpacity: Math.random(),
        strokeWidth: Math.round(randomNumber(5, 15)),
        strokeDasharray0: randomNumber(1, 15),
        strokeDasharray1: randomNumber(1, 15),
        strokeDasharray2: randomNumber(1, 15),
        strokeDashoffset: randomNumber(1, 100),
        strokeMiterlimit: randomNumber(1, 100),

        startOffset: Math.round(randomNumber(1, 100)),

        angle: randomNumber(0, 2 * Math.PI),
        startAngle: randomNumber(0, Math.PI),
        endAngle: randomNumber(2 * Math.PI, 3 * Math.PI),
        padAngle: Math.random(),
        radius: Math.round(randomNumber(1, 100)),
        innerRadius: Math.round(randomNumber(0, 50)),
        outerRadius: Math.round(randomNumber(60, 100)),
        cornerRadius: Math.round(randomNumber(0, 5)),
        padRadius: Math.round(randomNumber(0, 5)),
    };
}

function mergeProps(...args) {
    return args.reduce((acc, obj = {}) => ({
        ...acc,
        ...obj,
        children: [
            ...(acc.children || []),
            ...(obj.children || [])
        ]
    }), {});
}

export default class SvgAnimation extends Component {
    static defaultProps = createDefaultProps();

    constructor(props) {
        super(props);
        this.state = { type: '', animType: 'none' };
        this.d = 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5';
        this.createAnimValues();
        this.createNormalProps();
        this.createAnimProps();
    }

    createAnimValues() {
        this.animatedValues = [];
        const propKeys = Object.keys(SvgAnimation.defaultProps);
        propKeys.forEach(key => {
            const value = this.props[key];
            if (typeof value === 'number') {
                const animatedValue = new Animated.Value(value);
                this[key] = animatedValue;
                this.animatedValues.push(animatedValue);
            }
        });
        this.fill = this.inputFill.interpolate({
            inputRange: [0, 1],
            outputRange: [
                randomColor(),
                randomColor()
            ]
        });
        this.stroke = this.inputFill.interpolate({
            inputRange: [0, 1],
            outputRange: [
                randomColor(),
                randomColor()
            ]
        });
        this.stopColor = this.inputStopColor.interpolate({
            inputRange: [0, 1],
            outputRange: [
                randomColor(),
                randomColor()
            ]
        });
    }

    createNormalProps() {
        const data = Array(8).fill().map((val, i) => ({ index: i, value: randomNumber(0, 100) }));
        const transformProps = {
            origin: SvgAnimation.defaultProps.origin,
            skew: SvgAnimation.defaultProps.skew,
            scale: SvgAnimation.defaultProps.scale,
            translate: SvgAnimation.defaultProps.translate,
            rotation: SvgAnimation.defaultProps.rotation
        };
        let normalPropsForType = {
            Circle: pick(SvgAnimation.defaultProps, circleArgs),
            Rect: pick(SvgAnimation.defaultProps, rectArgs),
            Ellipse: pick(SvgAnimation.defaultProps, ellipseArgs),
            Line: lineArgs.reduce((acc, arg) => {
                acc[arg] = SvgAnimation.defaultProps[arg];
                return acc;
            }, {
                    stroke: randomColor(),
                    strokeWidth: SvgAnimation.defaultProps.strokeWidth
                }),
            Polygon: {
                points: '40,5 70,80 25,95',
                fill: randomColor(),
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            Polyline: {
                points: '40,5 70,80 25,95',
                fill: 'none',
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            D3InterpolatePath: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
                d1: 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5',
                d2: 'm82.5,187.5c1,0 87,-86 181,2c88,88 186,-15 185.5,-85.5'
            },
            Text: {
                fontSize: 40,
                dx: randomNumber(1, 100),
                dy: randomNumber(1, 100)
            },
            TSpan: {
                fontSize: 10,
                dx: randomNumber(1, 100),
                dy: randomNumber(1, 100)
            },
            TextPath: {
                startOffset: SvgAnimation.defaultProps.startOffset
            },
            LinearGradient: pick(SvgAnimation.defaultProps, linearGradientArgs),
            RadialGradient: pick(SvgAnimation.defaultProps, radialGradientArgs),
            Stop: {
                offset: SvgAnimation.defaultProps.offset,
                stopColor: randomColor(),
                stopOpacity: SvgAnimation.defaultProps.stopOpacity
            },
            G: transformProps,
            Use: transformProps
        };
        const closePath = <D3PathCommand command="closePath" />;
        const argList = ['x', 'y', 'cpx', 'cpy', 'cpx1', 'cpx2', 'cpy1', 'cpy2', 'x1', 'x2', 'y1', 'y2', 'radius', 'w', 'h'];
        const regularProps = argList.reduce((acc, key) => {
            acc[key] = randomNumber(1, 100);
            return acc;
        }, {
                startAngle: randomNumber(1, 180),
                endAngle: randomNumber(181, 360)
            });
        const regularCommands = {
            moveTo: <D3PathCommand command="moveTo" {...regularProps} />,
            lineTo: <D3PathCommand command="lineTo" {...regularProps} />,
            quadraticCurveTo: <D3PathCommand command="quadraticCurveTo" {...regularProps} />,
            bezierCurveTo: <D3PathCommand command="bezierCurveTo" {...regularProps} />,
            arcTo: <D3PathCommand command="arcTo" {...regularProps} />,
            arc: <D3PathCommand command="arc" {...regularProps} />,
            rect: <D3PathCommand command="rect" {...regularProps} />,
        };
        normalPropsForType.D3Path = {
            d: this.d,
            stroke: randomColor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            children: Object.keys(regularCommands).map(key => regularCommands[key])
        };
        const numShapes = Math.round(randomNumber(3, 10));
        normalPropsForType.FlubberPath = {
            stroke: randomColor(),
            strokeWidth: 1,
            fromShape: GithubIconSvgPath,
            toShape: TwitterIconSvgPath,
            fromShapeList: randomPolygons(numShapes, Dimensions.get('window').width, Dimensions.get('window').height),
            toShapeList: randomPolygons(numShapes, Dimensions.get('window').width, Dimensions.get('window').height),
            x: SvgAnimation.defaultProps.x,
            y: SvgAnimation.defaultProps.y,
            r: SvgAnimation.defaultProps.r,
            width: SvgAnimation.defaultProps.width,
            height: SvgAnimation.defaultProps.height,
        };
        normalPropsForType.D3ShapeArc = {
            ...pick(SvgAnimation.defaultProps, d3ShapeArcArgs),
            translate: SvgAnimation.defaultProps.translate,
            stroke: randomColor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
        };
        const dataKey = USE_D3_SHAPE_DATA ? 'children' : 'data';
        const pieDataItemProps = pick(SvgAnimation.defaultProps, d3ShapeArcArgs);
        // attach random fill so it looks nicer
        const pieData = data.map((dataItem) => {
            if (USE_D3_SHAPE_DATA) {
                return <D3ShapeData fill={randomColor()} {...pieDataItemProps} {...dataItem} />;
            }
            return { fill: randomColor(), ...pieDataItemProps, ...dataItem };
        });
        normalPropsForType.D3ShapePie = {
            ...pick(SvgAnimation.defaultProps, d3ShapeArcArgs),
            translate: SvgAnimation.defaultProps.translate,
            [dataKey]: pieData
        };
        const lineAndAreaData = USE_D3_SHAPE_DATA ? data.map((dataItem) => <D3ShapeData {...dataItem} />) : data;
        const lineData = {
            translate: SvgAnimation.defaultProps.translate,
            stroke: randomColor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            [dataKey]: lineAndAreaData
        };
        normalPropsForType.D3ShapeLine = {
            ...pick(SvgAnimation.defaultProps, d3ShapeLineArgs),
            ...lineData
        };
        normalPropsForType.D3ShapeLineRadial = {
            ...pick(SvgAnimation.defaultProps, d3ShapeLineRadialArgs),
            ...lineData
        };
        const areaData = {
            translate: SvgAnimation.defaultProps.translate,
            fill: randomColor(),
            [dataKey]: lineAndAreaData
        };
        normalPropsForType.D3ShapeArea = {
            ...pick(SvgAnimation.defaultProps, d3ShapeAreaArgs),
            ...areaData
        };
        normalPropsForType.D3ShapeAreaRadial = {
            ...pick(SvgAnimation.defaultProps, d3ShapeAreaRadialArgs),
            ...areaData
        };
        const stackData = {
            [dataKey]: [
                { index: 0, apples: 3840, bananas: 1920, cherries: 960, dates: 400, fill: randomColor() },
                { index: 1, apples: 1600, bananas: 1440, cherries: 960, dates: 400, fill: randomColor() },
                { index: 2, apples: 640, bananas: 960, cherries: 640, dates: 400, fill: randomColor() },
                { index: 3, apples: 320, bananas: 480, cherries: 640, dates: 400, fill: randomColor() }
            ].map((dataItem) => USE_D3_SHAPE_DATA ? <D3ShapeData {...dataItem} /> : dataItem)
        };
        normalPropsForType.D3ShapeStack = {
            ...pick(SvgAnimation.defaultProps, d3ShapeStackArgs),
            ...stackData,
            keys: ['apples', 'bananas', 'cherries', 'dates'],
        };
        let normalPropsForAnimType = {
            stroke: {
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            },
            strokeOpacity: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            strokeWidth: {
                stroke: randomColor()
            },
            strokeDashoffset: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
                children: [
                    <StrokeDasharray value={randomNumber(1, 15)} />,
                    <StrokeDasharray value={randomNumber(1, 15)} />,
                    <StrokeDasharray value={randomNumber(1, 15)} />
                ]
            },
            strokeDasharray: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            'strokeDasharray+strokeDashoffset': {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            },
            strokeMiterlimit: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            }
        };
        flubberTypes.forEach((type) => {
            normalPropsForAnimType[type] = {
                interpolatorType: type,
                options: { maxSegmentLength: 1 }
            };
        });
        normalPropsForAnimType.separateSingle = {
            ...normalPropsForAnimType.separate,
            options: { single: true }
        };
        normalPropsForAnimType.combineSingle = {
            ...normalPropsForAnimType.combine,
            options: { single: true }
        };
        normalPropsForAnimType.interpolateAllSingleAndMatch = {
            ...normalPropsForAnimType.interpolateAll,
            options: { single: true, match: true }
        };
        this.data = data;
        this.regularCommands = regularCommands;
        this.normalPropsForType = normalPropsForType;
        this.normalPropsForAnimType = normalPropsForAnimType;
    }

    createAnimProps() {
        let animPropsForType = {
            Polygon: {
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            },
            Polyline: {
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            },
            D3InterpolatePath: {
                t: this.t,
            },
            FlubberPath: {
                t: this.t
            }
        };
        let animPropsForAnimType = {
            'origin+rotation': {
                rotation: this.rotation,
                origin: this.origin
            },
            'x+y': {
                x: this.x,
                y: this.y
            },
            'dx+dy': {
                dx: this.dx,
                dy: this.dy,
            },
            dxn: {
                dx0: this.dx0,
                dx1: this.dx1,
                dx2: this.dx2
            },
            dyn: {
                dy0: this.dy0,
                dy1: this.dy1,
                dy2: this.dy2
            },
            'dxn+dyn': {
                dx0: this.dx0,
                dx1: this.dx1,
                dx2: this.dx2,
                dy0: this.dy0,
                dy1: this.dy1,
                dy2: this.dy2
            },
            strokeDasharray: {
                children: [
                    <StrokeDasharray key="1" value={this.strokeDasharray0} />,
                    <StrokeDasharray key="2" value={this.strokeDasharray1} />,
                    <StrokeDasharray key="3" value={this.strokeDasharray2} />
                ]
            },
            'strokeDasharray+strokeDashoffset': {
                strokeDashoffset: this.strokeDashoffset,
                children: [
                    <StrokeDasharray value={this.strokeDasharray0} />,
                    <StrokeDasharray value={this.strokeDasharray1} />,
                    <StrokeDasharray value={this.strokeDasharray2} />
                ]
            }
        };
        const animatedCommands = {
            moveTo: <D3PathCommand command="moveTo" x={this.x} y={this.x} />,
            lineTo: <D3PathCommand command="lineTo" x={this.x1} y={this.x1} />,
            quadraticCurveTo: <D3PathCommand command="quadraticCurveTo" cpx={this.cx} cpy={this.cy} x={this.x2} y={this.x2} />,
            bezierCurveTo: <D3PathCommand command="bezierCurveTo" cpx1={this.cpx1} cpy1={this.cpy1} cpx2={this.cpx2} cpy2={this.cpy2} x={this.x2} y={this.x2} />,
            arcTo: <D3PathCommand command="arcTo" x1={this.dx} y1={this.dy} x2={this.dx0} y2={this.dx1} radius={this.r} />,
            arc: <D3PathCommand command="arc" x={this.dx1} y={this.dy1} radius={this.r} startAngle={this.startAngle} endAngle={this.endAngle} />,
            rect: <D3PathCommand command="rect" x={this.dx2} y={this.dy2} w={this.fx} h={this.fy} />,
        };
        d3PathCommands.forEach(command => {
            animPropsForAnimType[command] = {
                children: [
                    this.regularCommands.moveTo,
                    animatedCommands[command]
                ]
            };
        });
        animPropsForAnimType = {
            ...animPropsForAnimType,
            d3pathall: {
                children: Object.keys(animatedCommands).map(key => animatedCommands[key])
            },
            moveTo: {
                children: [
                    animatedCommands.moveTo,
                    this.regularCommands.lineTo
                ]
            },
            arc: {
                children: [animatedCommands.arc]
            }
        };
        this.animatedCommands = animatedCommands;
        this.animPropsForType = animPropsForType;
        this.animPropsForAnimType = animPropsForAnimType;
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        if (this.stopAnimate) {
            return;
        }
        Animated.parallel([
            Animated.spring(this.cx, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cy, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.cpx, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cpy, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cpx1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cpy1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cpx2, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.cpy2, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.dx, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dy, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.fx, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.fy, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.dx0, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dy0, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dx1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dy1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dx2, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.dy2, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.px0, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.py0, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.px1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.py1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.px2, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.py2, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.r, { toValue: Math.max(0, Math.round(randomNumber(1, 100))) }),
            Animated.spring(this.rx, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.ry, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.timing(this.t, { toValue: this.t.__getValue() < 0.5 ? 1 : 0, duration: 1500 }),

            Animated.spring(this.x, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.x1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.x2, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.y, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.y1, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.y2, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.fontSize, { toValue: Math.round(randomNumber(12, 30)) }),
            Animated.spring(this.startOffset, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.width, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.height, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.offset, { toValue: Math.random() }),
            Animated.spring(this.inputStopColor, { toValue: Math.random() }),
            Animated.spring(this.stopOpacity, { toValue: Math.random() }),

            Animated.spring(this.origin, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.originX, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.originY, { toValue: Math.round(randomNumber(1, 100)) }),

            Animated.spring(this.scale, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.scaleX, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.scaleY, { toValue: Math.round(randomNumber(1, 10)) }),

            Animated.spring(this.skew, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.skewX, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.skewY, { toValue: Math.round(randomNumber(1, 10)) }),

            Animated.spring(this.translate, { toValue: Math.round(randomNumber(1, Dimensions.get('window').width / 2)) }),
            Animated.spring(this.translateX, { toValue: Math.round(randomNumber(1, Dimensions.get('window').width / 2)) }),
            Animated.spring(this.translateY, { toValue: Math.round(randomNumber(1, Dimensions.get('window').height / 2)) }),

            Animated.spring(this.rotate, { toValue: Math.round(randomNumber(1, 360)) }),
            Animated.spring(this.rotation, { toValue: Math.round(randomNumber(1, 360)) }),

            Animated.spring(this.inputFill, { toValue: Math.random() }),
            Animated.spring(this.fillOpacity, { toValue: Math.random() }),

            Animated.spring(this.inputStroke, { toValue: Math.random() }),
            Animated.spring(this.strokeOpacity, { toValue: Math.random() }),
            Animated.spring(this.strokeWidth, { toValue: randomNumber(5, 15) }),
            Animated.spring(this.strokeDasharray0, { toValue: randomNumber(5, 15) }),
            Animated.spring(this.strokeDasharray1, { toValue: randomNumber(5, 15) }),
            Animated.spring(this.strokeDasharray2, { toValue: randomNumber(5, 15) }),
            Animated.spring(this.strokeDashoffset, { toValue: randomNumber(5, 100) }),
            Animated.spring(this.strokeMiterlimit, { toValue: randomNumber(5, 15) }),

            Animated.spring(this.angle, { toValue: randomNumber(0, 2 * Math.PI) }),
            Animated.spring(this.startAngle, { toValue: randomNumber(0, Math.PI) }),
            Animated.spring(this.endAngle, { toValue: randomNumber(2 * Math.PI, 3 * Math.PI) }),
            Animated.spring(this.padAngle, { toValue: Math.random() }),

            Animated.spring(this.radius, { toValue: randomNumber(0, 100) }),
            Animated.spring(this.innerRadius, { toValue: randomNumber(0, 50) }),
            Animated.spring(this.outerRadius, { toValue: randomNumber(60, 100) }),
            Animated.spring(this.cornerRadius, { toValue: randomNumber(0, 5) }),
            Animated.spring(this.padRadius, { toValue: randomNumber(0, 5) }),
        ]).start(() => this.animate());
    }

    stopAnimation = () => {
        this.stopAnimate = true;
        Object.keys(SvgAnimation.defaultProps).forEach(key => {
            const value = this[key];
            if (value && value.stopAnimation) {
                value.stopAnimation();
            }
        });
    }

    getNormalProps({ type = this.state.type, animType = this.state.animType } = {}) {
        const props = this.normalPropsForType[type] || {};
        const props2 = this.normalPropsForAnimType[animType] || {};
        let props3 = mergeProps(props, props2);
        // this is just so you can clearly see the svg
        if (props3.translate == null && props3.translateX == null && props3.translateY == null) {
            props3.translate = SvgAnimation.defaultProps.translate;
        }
        return props3;
    }

    getAnimProps({ type = this.state.type, animType = this.state.animType } = {}) {
        const props = this.animPropsForType[type] || {};
        const props2 = this.animPropsForAnimType[animType] || {};
        let props3 = {};
        if (this[animType]) {
            props3[animType] = this[animType];
        }
        if (animType === 'none') {
            return {};
        }
        if (animType === 'defaultProps') {
            props3 = {};
            const normalProps = this.getNormalProps({ type, animType });
            const keys = Object.keys(normalProps);
            keys.reduce((acc, key) => {
                const animValue = this[key];
                if (animValue) {
                    acc[key] = this[key];
                }
                return acc;
            }, props3);
            if (type === 'D3Path') {
                props3 = mergeProps(props3, this.animPropsForAnimType.d3pathall);
            }
        }
        if (type === 'D3ShapePie' && animType === 'data') {
            const shapeDataProps = {
                ...pick(SvgAnimation.defaultProps, d3ShapeArcArgs),
                fill: randomColor()
            };
            if (USE_D3_SHAPE_DATA) {
                props3.children = this.animatedValues.map((value, index) => <D3ShapeData value={value} index={index} {...shapeDataProps} />);
            } else {
                props3.data = this.animatedValues.map((value, index) => ({ index, value, ...shapeDataProps }));
            }
        }
        if (['D3ShapeLine', 'D3ShapeLineRadial', 'D3ShapeArea', 'D3ShapeAreaRadial'].includes(type) && animType === 'data') {
            if (USE_D3_SHAPE_DATA) {
                props3.children = this.animatedValues.map((value, index) => <D3ShapeData index={index} value={value} />);
            } else {
                props3.data = this.animatedValues.map((value, index) => ({ index, value }));
            }
        }
        props3 = mergeProps(props, props2, props3);
        // remove translate from getNormalProps if testing other translate animTypes or a type doesn't need to animate it
        if (props3.translate != null && !['translateX', 'translateY'].includes(animType) && !['g', 'use'].includes(type)) {
            delete props3.translate;
        }
        return props3;
    }

    renderComponent({ requiredType, type = this.state.type, animType = this.state.animType } = {}) {
        const ComponentForType = componentsForType[type];
        if (requiredType && type !== requiredType) {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <ComponentForType {...props} />;
    }

    renderD3Path({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3Path') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // dont merge children
        if (animType !== 'none') {
            props.children = animProps.children.length ? animProps.children : normalProps.children;
        }
        return <D3Path {...props} />;
    }

    renderD3ShapePie({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapePie') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // value is not a function so cannot animate
        props.value = d => d.value;
        // need to animchildren if 'data'
        if (animType === 'data') {

        }
        return <D3ShapePie {...props } />;
    }

    renderD3ShapeLine({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapeLine') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        props.fill = 'none';
        // x and y are functions so cannot animate
        props.x = d => d.index * Dimensions.get('window').width / this.data.length;
        props.y = d => d.value;
        // need to animchildren if 'data'
        if (animType === 'data') {
            props.x = d => d.index * Dimensions.get('window').width / this.animatedValues.length;
        }
        return <D3ShapeLine {...props} />;
    }

    renderD3ShapeLineRadial({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapeLineRadial') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        props.fill = 'none';
        // angle and radius are functions so cannot animate
        props.angle = d => d.index * 2 * Math.PI / this.data.length;
        props.radius = d => {
            const ratio = d.value / Dimensions.get('window').width;
            return 50 + 50 * ratio;
        };
        // need to animchildren if 'data'
        if (animType === 'data') {
            props.angle = d => d.index * 2 * Math.PI / this.animatedValues.length;
        }
        return <D3ShapeLineRadial {...props} />;
    }

    renderD3ShapeArea({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapeArea') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // x and y1 are functions so cannot animate
        props.x = d => d.index * Dimensions.get('window').width / this.data.length;
        props.y1 = d => d.value;
        delete props.x1;
        props.y = Dimensions.get('window').height / 2;
        delete props.translate;
        // need to animchildren if 'data'
        if (animType === 'data') {
            props.x = d => d.index * Dimensions.get('window').width / this.animatedValues.length;
        }
        return <D3ShapeArea {...props} />;
    }

    renderD3ShapeAreaRadial({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapeAreaRadial') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // angle and outerRadius are functions so cannot animate
        props.angle = d => d.index * 2 * Math.PI / this.data.length;
        props.outerRadius = d => {
            const ratio = d.value / Dimensions.get('window').width;
            return 50 + 50 * ratio;
        };
        delete props.startAngle;
        delete props.endAngle;
        props.innerRadius = 0;
        props.radius = 100;
        // need to animchildren if 'data'
        if (animType === 'data') {
            props.angle = d => d.index * 2 * Math.PI / this.animatedValues.length;
        }
        return <D3ShapeAreaRadial {...props} />;
    }

    renderD3ShapeStack({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'D3ShapeStack') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // remove props that cannot be animated
        delete props.offset;
        if (animType === 'data') {

        }
        return <D3ShapeStack {...props } />;
    }

    renderText({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'Text') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <AnimatedSvgText {...props}>abc</AnimatedSvgText>;
    }

    renderTSpan({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'TSpan') {
            return null;
        }
        const textProps = {
            fontSize: 10
        };
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        if (animType === 'text+tspan') {
            return (
                <AnimatedSvgText {...textProps} dx={this.x} dy={this.y} fill={this.fill} stroke={this.stroke}>
                    Level0
                    <TSpan {...normalProps} dx={this.x0} dy={this.y0} fill={this.fill} stroke={this.stroke}>
                        Level1_0
                    </TSpan>
                    <TSpan {...normalProps} dx={this.x1} dy={this.y1} fill={this.fill} stroke={this.stroke}>
                        Level1_1
                    </TSpan>
                    <TSpan {...normalProps} dx={this.x2} dy={this.y2} fill={this.fill} stroke={this.stroke}>
                        Level1_2
                        <TSpan {...normalProps} dx={this.dx0} dy={this.dx0} fill={this.fill} stroke={this.stroke}>
                            Level2_0
                        </TSpan>
                        <TSpan {...normalProps} dx={this.dx1} dy={this.dy1} fill={this.fill} stroke={this.stroke}>
                            Level2_1
                        </TSpan>
                    </TSpan>
                </AnimatedSvgText>
            );
        }
        return (
            <AnimatedSvgText {...textProps}>
                <TSpan {...props}>abc</TSpan>
            </AnimatedSvgText>
        );
    }

    renderTextPath({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'TextPath') {
            return null;
        }
        const textProps = {
            fontSize: 10
        };
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        if (animType === 'text+textpath+tspan') {
            return (
                <AnimatedSvgText {...textProps} dx={this.x} dy={this.y} fill={this.fill} stroke={this.stroke}>
                    <TextPath href="#path" {...props}>
                        Level0
                        <TSpan {...textProps} dx={this.x0} dy={this.y0} fill={this.fill} stroke={this.stroke}>
                            Level1_0
                        </TSpan>
                        <TSpan {...textProps} dx={this.x1} dy={this.y1} fill={this.fill} stroke={this.stroke}>
                            Level1_1
                        </TSpan>
                        <TSpan {...textProps} dx={this.x2} dy={this.y2} fill={this.fill} stroke={this.stroke}>
                            Level1_2
                            <TSpan {...textProps} dx={this.dx0} dy={this.dx0} fill={this.fill} stroke={this.stroke}>
                                Level2_0
                            </TSpan>
                            <TSpan {...textProps} dx={this.dx1} dy={this.dy1} fill={this.fill} stroke={this.stroke}>
                                Level2_1
                            </TSpan>
                        </TSpan>
                    </TextPath>
                </AnimatedSvgText>
            );
        }
        return (
            <NativeSvg.Text fill="blue">
                <TextPath href="#path" {...props}>
                    {loremipsum({ count: 5, units: 'words' })}
                    <NativeSvg.TSpan fill="red" dy="5,5,5">{loremipsum({ count: 5, units: 'words' })}</NativeSvg.TSpan>
                </TextPath>
            </NativeSvg.Text>
        );
    }

    renderG({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'G') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        let children = this.renderComponent({ type: 'Rect', animType: 'none' });
        if (animType === 'g+rect') {
            children = this.renderComponent({ type: 'Rect', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+circle') {
            children = this.renderComponent({ type: 'Circle', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+ellipse') {
            children = this.renderComponent({ type: 'Ellipse', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+line') {
            children = this.renderComponent({ type: 'Line', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+polygon') {
            children = this.renderComponent({ type: 'Polygon', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+polyline') {
            children = this.renderComponent({ type: 'Polyline', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+d3path') {
            children = this.renderD3Path({ type: 'D3Path', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+text') {
            children = this.renderText({ type: 'Text', animType: 'defaultProps' });
        }
        return (
            <G {...props}>
                {children}
            </G>
        );
    }

    renderUse({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'Use') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Use href="#shape" {...props} />;
    }

    renderLinearGradient({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'LinearGradient') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        const stopNormalProps = this.getNormalProps({ type: 'Stop' });
        const stopAnimProps = this.getAnimProps({ type: 'Stop' });
        const stopProps = mergeProps(stopNormalProps, stopAnimProps);
        return (
            <LinearGradient id="grad" {...props}>
                <Stop offset={Math.random()} stopColor={randomColor()} stopOpacity={Math.random()} />
                <Stop {...stopProps} />
            </LinearGradient>
        );
    }

    renderRadialGradient({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'RadialGradient') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        const stopNormalProps = this.getNormalProps({ type: 'Stop' });
        const stopAnimProps = this.getAnimProps({ type: 'Stop' });
        const stopProps = mergeProps(stopNormalProps, stopAnimProps);
        return (
            <RadialGradient id="grad" {...props} gradientUnits="userSpaceOnUse">
                <Stop offset={Math.random()} stopColor={randomColor()} stopOpacity={Math.random()} />
                <Stop {...stopProps} />
            </RadialGradient>
        );
    }

    renderTypeButton = (type, i) => (
        <Button
            key={i}
            title={type}
            onPress={() => {
                this.stopAnimation();
                this.setState({ type, animType: 'none' }, () => {
                    this.stopAnimate = false;
                    this.animate();
                });
            }}
        />
    )


    renderAnimTypeButton = (animType, i) => (
        <Button
            key={i}
            title={animType}
            onPress={() => {
                this.stopAnimation();
                this.setState({ animType }, () => {
                    this.stopAnimate = false;
                    this.animate();
                });
            }}
        />
    )

    render() {
        const { type, animType } = this.state;
        const animsForType = animTypes[type] || [];
        const anims = [...defaultAnimTypes, ...animsForType];
        return (
            <View>
                <View style={{ marginTop: 40 }} />
                <Text>Components</Text>
                <ScrollView horizontal style={{ flexDirection: 'row', paddingBottom: 20 }}>
                    {types.map(this.renderTypeButton)}
                </ScrollView>
                {!!type && <Text>Animations</Text>}
                {!!type && <ScrollView horizontal style={{ flexDirection: 'row', paddingBottom: 20 }}>
                    {anims.map(this.renderAnimTypeButton)}
                </ScrollView>}
                <Button
                    title="Reset"
                    onPress={() => {
                        this.stopAnimation();
                        SvgAnimation.defaultProps = createDefaultProps();
                        this.createAnimValues();
                        this.createNormalProps();
                        this.createAnimProps();
                        this.setState({ type: '', animType: 'none' }, () => {
                            this.stopAnimate = false;
                            this.animate();
                        });
                    }}
                />
                <Text>{type} {animType}</Text>
                <ScrollView style={styles.container}>
                    <Svg height={Dimensions.get('window').height} width={Dimensions.get('window').width}>
                        <Defs>
                            <NativeSvg.Path
                                id="path"
                                d={this.d}
                            />
                            <G id="shape">
                                <G>
                                    <Circle cx="50" cy="50" r="50" />
                                    <Rect x="50" y="50" width="50" height="50" />
                                    <Circle cx="50" cy="50" r="5" fill={randomColor()} />
                                </G>
                            </G>
                            {this.renderLinearGradient()}
                            {this.renderRadialGradient()}
                        </Defs>
                        {this.renderComponent({ requiredType: 'Circle' })}
                        {this.renderComponent({ requiredType: 'Rect' })}
                        {this.renderComponent({ requiredType: 'Ellipse' })}
                        {this.renderComponent({ requiredType: 'Line' })}
                        {this.renderComponent({ requiredType: 'Polygon' })}
                        {this.renderComponent({ requiredType: 'Polyline' })}
                        {this.renderD3Path()}
                        {this.renderComponent({ requiredType: 'D3InterpolatePath' })}
                        {this.renderComponent({ requiredType: 'D3ShapeArc' })}
                        {this.renderD3ShapePie()}
                        {this.renderD3ShapeLine()}
                        {this.renderD3ShapeLineRadial()}
                        {this.renderD3ShapeArea()}
                        {this.renderD3ShapeAreaRadial()}
                        {this.renderD3ShapeStack()}
                        {this.renderComponent({ requiredType: 'FlubberPath' })}
                        {this.renderText()}
                        {this.renderTSpan()}
                        {this.renderTextPath()}
                        {this.renderG()}
                        {this.renderUse()}
                        {(type === 'LinearGradient' || type === 'RadialGradient') && (
                            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
                        )}
                        {type === 'TextPath' && (
                            <NativeSvg.Path d={this.d} fill="none" stroke="red" strokeWidth="1" />
                        )}
                    </Svg>
                </ScrollView>
            </View>
        );
    }
}
