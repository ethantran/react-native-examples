import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, Dimensions, Button } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { Svg as NativeSvg } from 'expo';
const Defs = NativeSvg.Defs;

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import randomPolygons, { randomPolygon } from '../randomPolygons';
import { d as GithubIconSvgPath } from '../components/GithubIconSvgPath';
import { d as TwitterIconSvgPath } from '../components/TwitterIconSvgPath';
import Svg from '../components/AnimatedSvg';
import Circle from '../components/AnimatedSvgCircle';
import Rect from '../components/AnimatedSvgRect';
import Ellipse from '../components/AnimatedSvgEllipse';
import Line from '../components/AnimatedSvgLine';
import Polygon from '../components/AnimatedSvgPolygon';
import Polyline from '../components/AnimatedSvgPolyline';
import D3Path from '../components/AnimatedSvgD3Path';
import D3InterpolatePath from '../components/AnimatedSvgD3InterpolatePath';
import FlubberPath from '../components/AnimatedSvgFlubberPath';
import AnimatedSvgText from '../components/AnimatedSvgText';
import TSpan from '../components/AnimatedSvgTSpan';
import TextPath from '../components/AnimatedSvgTextPath';
import G from '../components/AnimatedSvgG';
import Use from '../components/AnimatedSvgUse';
import LinearGradient from '../components/AnimatedSvgLinearGradient';
import RadialGradient from '../components/AnimatedSvgRadialGradient';
import Stop from '../components/AnimatedSvgStop';
import D3PathCommand from '../components/D3PathCommand';
import StrokeDasharray from '../components/AnimatedSvgStrokeDasharray';

const types = ['circle', 'rect', 'ellipse', 'line', 'polygon', 'polyline', 'd3path', 'd3interpolatepath', 'flubberpath', 'text', 'tspan', 'textpath', 'g', 'use', 'lgrad', 'rgrad'];
const transformAnimTypes = [
    'origin+rotation', 'originXY+rotation',
    'scale', 'scaleX', 'scaleY', 'scaleXY',
    'skew', 'skewX', 'skewY', 'skewXY',
    'translate', 'translateX', 'translateY', 'translateXY',
    'x', 'y', 'x+y',
];
const defaultAnimTypes = ['none', 'defaultProps'];
const fillAnimTypes = ['fill', 'fillOpacity'];
const strokeAnimTypes = ['stroke', 'strokeOpacity', 'strokeWidth', 'strokeDasharray', 'strokeDashoffset', 'strokeDasharray+strokeDashoffset', 'strokeMiterlimit'];
const gradAnimTypes = ['offset', 'stopColor', 'stopOpacity'];
const lineAnimTypes = [...transformAnimTypes, ...strokeAnimTypes];
const shapeAnimTypes = [...fillAnimTypes, ...lineAnimTypes];
const textAnimTypes = ['dx', 'dy', 'dx+dy', 'dxn', 'dyn', 'dxn+dyn', 'fontSize', ...shapeAnimTypes];
const d3PathArgs = ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arcTo', 'arc', 'rect'];
const flubberArgs = ['interpolate', 'toCircle', 'toRect', 'fromCircle', 'fromRect', 'separate', 'combine', 'interpolateAll'];
const animTypes = {
    circle: shapeAnimTypes,
    rect: shapeAnimTypes,
    ellipse: shapeAnimTypes,
    line: lineAnimTypes,
    polygon: shapeAnimTypes,
    polyline: shapeAnimTypes,
    path: shapeAnimTypes,
    d3path: [...d3PathArgs, ...shapeAnimTypes],
    d3interpolatepath: shapeAnimTypes,
    flubberpath: [...flubberArgs, ...shapeAnimTypes],
    text: textAnimTypes,
    tspan: ['text+tspan', ...textAnimTypes],
    textpath: ['startOffset', 'text+textpath+tspan', ...textAnimTypes],
    g: ['g+rect', 'g+circle', 'g+ellipse', 'g+line', 'g+polygon', 'g+polyline', 'g+d3path', 'g+text', ...transformAnimTypes],
    use: transformAnimTypes,
    lgrad: gradAnimTypes,
    rgrad: gradAnimTypes,
};

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
        originXY: { x: Math.round(randomNumber(1, 100)), y: Math.round(randomNumber(1, 100)) },

        scale: Math.round(randomNumber(1, 10)),
        scaleX: Math.round(randomNumber(1, 10)),
        scaleY: Math.round(randomNumber(1, 10)),
        scaleXY: { x: Math.round(randomNumber(1, 10)), y: Math.round(randomNumber(1, 10)) },

        skew: Math.round(randomNumber(1, 10)),
        skewX: Math.round(randomNumber(1, 10)),
        skewY: Math.round(randomNumber(1, 10)),
        skewXY: { x: Math.round(randomNumber(1, 10)), y: Math.round(randomNumber(1, 10)) },

        translate: Math.round(randomNumber(1, 100)),
        translateX: Math.round(randomNumber(1, 100)),
        translateY: Math.round(randomNumber(1, 100)),
        translateXY: { x: Math.round(randomNumber(1, 100)), y: Math.round(randomNumber(1, 100)) },

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

        startAngle: Math.round(randomNumber(1, 180)),
        endAngle: Math.round(randomNumber(181, 360)),
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
        const propKeys = Object.keys(SvgAnimation.defaultProps);
        propKeys.forEach(key => {
            const value = this.props[key];
            if (typeof value === 'number') {
                this[key] = new Animated.Value(value);
            } else {
                this[key] = new Animated.ValueXY(value);
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
        let normalPropsForType = {
            circle: {
                r: SvgAnimation.defaultProps.r,
                cy: SvgAnimation.defaultProps.cy,
                cx: SvgAnimation.defaultProps.cx
            },
            rect: {
                width: SvgAnimation.defaultProps.width,
                height: SvgAnimation.defaultProps.height
            },
            ellipse: {
                cx: SvgAnimation.defaultProps.cx,
                cy: SvgAnimation.defaultProps.cy,
                rx: SvgAnimation.defaultProps.rx,
                ry: SvgAnimation.defaultProps.ry,
            },
            line: {
                x1: SvgAnimation.defaultProps.x1,
                x2: SvgAnimation.defaultProps.x2,
                y1: SvgAnimation.defaultProps.y1,
                y2: SvgAnimation.defaultProps.y2,
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            polygon: {
                points: '40,5 70,80 25,95',
                fill: randomColor(),
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            polyline: {
                points: '40,5 70,80 25,95',
                fill: 'none',
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth
            },
            d3interpolatepath: {
                stroke: randomColor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
                d1: 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5',
                d2: 'm82.5,187.5c1,0 87,-86 181,2c88,88 186,-15 185.5,-85.5'
            },
            text: {
                fontSize: 40,
                dx: randomNumber(1, 100),
                dy: randomNumber(1, 100)
            },
            tspan: {
                fontSize: 10,
                dx: randomNumber(1, 100),
                dy: randomNumber(1, 100)
            },
            textpath: {
                startOffset: SvgAnimation.defaultProps.startOffset
            },
            lgrad: {
                x1: SvgAnimation.defaultProps.x1,
                x2: SvgAnimation.defaultProps.x2,
                y1: SvgAnimation.defaultProps.y1,
                y2: SvgAnimation.defaultProps.y2,
            },
            rgrad: {
                cx: SvgAnimation.defaultProps.cx,
                cy: SvgAnimation.defaultProps.cy,
                rx: SvgAnimation.defaultProps.rx,
                ry: SvgAnimation.defaultProps.ry,
                fx: SvgAnimation.defaultProps.fx,
                fy: SvgAnimation.defaultProps.fy,
            },
            stop: {
                offset: SvgAnimation.defaultProps.offset,
                stopColor: randomColor(),
                stopOpacity: SvgAnimation.defaultProps.stopOpacity
            },
            g: {
                origin: SvgAnimation.defaultProps.origin,
                skew: SvgAnimation.defaultProps.skew,
                scale: SvgAnimation.defaultProps.scale,
                translate: SvgAnimation.defaultProps.translate,
                rotation: SvgAnimation.defaultProps.rotation
            },
            use: {
                origin: SvgAnimation.defaultProps.origin,
                skew: SvgAnimation.defaultProps.skew,
                scale: SvgAnimation.defaultProps.scale,
                translate: SvgAnimation.defaultProps.translate,
                rotation: SvgAnimation.defaultProps.rotation
            }
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
        normalPropsForType.d3path = {
            d: this.d,
            stroke: randomColor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            children: Object.keys(regularCommands).map(key => regularCommands[key])
        };
        const numShapes = Math.round(randomNumber(3, 10));
        normalPropsForType.flubberpath = {
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
        flubberArgs.forEach((arg) => {
            normalPropsForAnimType[arg] = {
                interpolatorType: arg,
                options: { maxSegmentLength: 1 }
            };
        });
        normalPropsForAnimType.separate = {
            ...normalPropsForAnimType.separate,
            options: { single: true }
        };
        normalPropsForAnimType.combine = {
            ...normalPropsForAnimType.combine,
            options: { single: true }
        };
        normalPropsForAnimType.interpolateAll = {
            ...normalPropsForAnimType.interpolateAll,
            options: { single: true, match: true }
        };
        this.regularCommands = regularCommands;
        this.normalPropsForType = normalPropsForType;
        this.normalPropsForAnimType = normalPropsForAnimType;
    }

    createAnimProps() {
        let animPropsForType = {
            polygon: {
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            },
            polyline: {
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            },
            d3interpolatepath: {
                t: this.t,
            },
            flubberpath: {
                t: this.t
            }
        };
        let animPropsForAnimType = {
            'origin+rotation': {
                rotation: this.rotation,
                origin: this.origin
            },
            'originXY+rotation': {
                rotation: this.rotation,
                origin: this.originXY
            },
            scaleXY: {
                scale: this.scaleXY
            },
            skewXY: {
                skew: this.skewXY
            },
            translateXY: {
                translate: this.translateXY
            },
            'x+y': {
                x: this.x,
                y: this.y
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
        d3PathArgs.forEach(arg => {
            animPropsForAnimType[arg] = {
                children: [
                    this.regularCommands.moveTo,
                    animatedCommands[arg]
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
            Animated.spring(this.originXY, {
                toValue: { x: randomNumber(1, 100), y: randomNumber(1, 100) }
            }),

            Animated.spring(this.scale, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.scaleX, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.scaleY, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.scaleXY, {
                toValue: { x: randomNumber(1, 10), y: randomNumber(1, 10) }
            }),

            Animated.spring(this.skew, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.skewX, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.skewY, { toValue: Math.round(randomNumber(1, 10)) }),
            Animated.spring(this.skewXY, {
                toValue: { x: randomNumber(1, 10), y: randomNumber(1, 10) }
            }),

            Animated.spring(this.translate, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.translateX, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.translateY, { toValue: Math.round(randomNumber(1, 100)) }),
            Animated.spring(this.translateXY, {
                toValue: { x: randomNumber(1, 100), y: randomNumber(1, 100) }
            }),

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

            Animated.spring(this.startAngle, { toValue: Math.round(randomNumber(1, 180)) }),
            Animated.spring(this.endAngle, { toValue: Math.round(randomNumber(181, 360)) }),
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
        return mergeProps(props, props2);
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
            if (type === 'd3path') {
                props3 = mergeProps(props3, this.animPropsForAnimType.d3pathall);
            }
        }
        return mergeProps(props, props2, props3);
    }

    renderCircle({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'circle') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Circle {...props} />;
    }

    renderRect({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'rect') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Rect {...props} />;
    }

    renderEllipse({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'ellipse') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Ellipse {...props} />;
    }

    renderLine({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'line') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Line {...props} />;
    }

    renderPolygon({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'polygon') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Polygon {...props} />;
    }

    renderPolyline({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'polyline') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Polyline {...props} />;
    }

    renderD3Path({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'd3path') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        let props = mergeProps(normalProps, animProps);
        // need only animchildren if not 'none'
        if (animType !== 'none') {
            props.children = animProps.children;
        }
        return <D3Path {...props} />;
    }

    renderD3InterpolatePath({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'd3interpolatepath') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <D3InterpolatePath {...props} />;
    }

    renderFlubberPath({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'flubberpath') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <FlubberPath {...props} />;
    }

    renderText({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'text') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <AnimatedSvgText {...props}>abc</AnimatedSvgText>;
    }

    renderTSpan({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'tspan') {
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
        if (type !== 'textpath') {
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
        if (type !== 'g') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        let children = this.renderRect({ type: 'rect', animType: 'none' });
        if (animType === 'g+rect') {
            children = this.renderRect({ type: 'rect', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+circle') {
            children = this.renderCircle({ type: 'circle', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+ellipse') {
            children = this.renderEllipse({ type: 'ellipse', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+line') {
            children = this.renderLine({ type: 'line', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+polygon') {
            children = this.renderPolygon({ type: 'polygon', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+polyline') {
            children = this.renderPolyline({ type: 'polyline', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+d3path') {
            children = this.renderD3Path({ type: 'd3path', animType: 'defaultProps' });
        } else if (this.state.animType === 'g+text') {
            children = this.renderText({ type: 'text', animType: 'defaultProps' });
        }
        return (
            <G {...props}>
                {children}
            </G>
        );
    }

    renderUse({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'use') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        return <Use href="#shape" {...props} />;
    }

    renderLinearGradient({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'lgrad') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        const stopNormalProps = this.getNormalProps({ type: 'stop' });
        const stopAnimProps = this.getAnimProps({ type: 'stop' });
        const stopProps = mergeProps(stopNormalProps, stopAnimProps);
        return (
            <LinearGradient id="grad" {...props}>
                <Stop offset={Math.random()} stopColor={randomColor()} stopOpacity={Math.random()} />
                <Stop {...stopProps} />
            </LinearGradient>
        );
    }

    renderRadialGradient({ type = this.state.type, animType = this.state.animType } = {}) {
        if (type !== 'rgrad') {
            return null;
        }
        const normalProps = this.getNormalProps({ type, animType });
        const animProps = this.getAnimProps({ type, animType });
        const props = mergeProps(normalProps, animProps);
        const stopNormalProps = this.getNormalProps({ type: 'stop' });
        const stopAnimProps = this.getAnimProps({ type: 'stop' });
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
                        {this.renderCircle()}
                        {this.renderRect()}
                        {this.renderEllipse()}
                        {this.renderLine()}
                        {this.renderPolygon()}
                        {this.renderPolyline()}
                        {this.renderD3Path()}
                        {this.renderD3InterpolatePath()}
                        {this.renderFlubberPath()}
                        {this.renderText()}
                        {this.renderTSpan()}
                        {this.renderTextPath()}
                        {this.renderG()}
                        {this.renderUse()}
                        {(type === 'lgrad' || type === 'rgrad') && (
                            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
                        )}
                        {type === 'textpath' && (
                            <NativeSvg.Path d={this.d} fill="none" stroke="red" strokeWidth="1" />
                        )}
                    </Svg>
                </ScrollView>
            </View>
        );
    }
}
