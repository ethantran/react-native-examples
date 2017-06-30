import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Animated, Dimensions, Button } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { Svg as NativeSvg } from 'expo';
const Defs = NativeSvg.Defs;

import randomcolor from '../randomcolor';
import randomnumber from '../randomnumber';
import randompolygons, { randompolygon } from '../randompolygons';
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
import Text from '../components/AnimatedSvgText';
import TSpan from '../components/AnimatedSvgTSpan';
import TextPath from '../components/AnimatedSvgTextPath';
import G from '../components/AnimatedSvgG';
import Use from '../components/AnimatedSvgUse';
import LinearGradient from '../components/AnimatedSvgLinearGradient';
import RadialGradient from '../components/AnimatedSvgRadialGradient';
import Stop from '../components/AnimatedSvgStop';
import D3PathCommand from '../components/D3PathCommand';

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
const strokeAnimTypes = ['stroke', 'strokeOpacity', 'strokeWidth'];
const gradAnimTypes = ['offset', 'offset0', 'stopColor', 'stopColor0', 'stopOpacity', 'stopOpacity0', 'onlyStop'];
const lineAnimTypes = [...transformAnimTypes, ...strokeAnimTypes];
const shapeAnimTypes = [...fillAnimTypes, ...lineAnimTypes];
const textAnimTypes = ['dx', 'dy', 'dx+dy', 'dxn', 'dyn', 'fontSize', ...shapeAnimTypes];
const d3PathArgs = ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arcTo', 'arc', 'rect'];
const flubberArgs = ['toCircle', 'toRect', 'fromCircle', 'fromRect', 'separate', 'combine', 'interpolateAll'];
const animTypes = {
    circle: shapeAnimTypes,
    rect: shapeAnimTypes,
    ellipse: shapeAnimTypes,
    line: lineAnimTypes,
    polygon: shapeAnimTypes,
    polyline: shapeAnimTypes,
    path: shapeAnimTypes,
    d3path: [...d3PathArgs, 'all', ...shapeAnimTypes],
    d3interpolatepath: shapeAnimTypes,
    flubberpath: [...flubberArgs, ...shapeAnimTypes],
    text: textAnimTypes,
    tspan: textAnimTypes,
    textpath: ['startOffset', ...textAnimTypes],
    g: transformAnimTypes,
    use: transformAnimTypes,
    lgrad: gradAnimTypes,
    rgrad: gradAnimTypes,
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    }
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const startColor = randomcolor();
const endColor = randomcolor();

export default class SvgAnimation extends Component {
    static defaultProps = {
        cx: Math.round(randomnumber(1, 100)),
        cy: Math.round(randomnumber(1, 100)),

        cpx: Math.round(randomnumber(1, 100)),
        cpy: Math.round(randomnumber(1, 100)),
        cpx1: Math.round(randomnumber(1, 100)),
        cpy1: Math.round(randomnumber(1, 100)),
        cpx2: Math.round(randomnumber(1, 100)),
        cpy2: Math.round(randomnumber(1, 100)),

        dx: Math.round(randomnumber(1, 100)),
        dy: Math.round(randomnumber(1, 100)),
        dx0: Math.round(randomnumber(1, 100)),
        dy0: Math.round(randomnumber(1, 100)),
        dx1: Math.round(randomnumber(1, 100)),
        dy1: Math.round(randomnumber(1, 100)),
        dx2: Math.round(randomnumber(1, 100)),
        dy2: Math.round(randomnumber(1, 100)),

        px0: Math.round(randomnumber(1, 100)),
        py0: Math.round(randomnumber(1, 100)),
        px1: Math.round(randomnumber(1, 100)),
        py1: Math.round(randomnumber(1, 100)),
        px2: Math.round(randomnumber(1, 100)),
        py2: Math.round(randomnumber(1, 100)),

        fx: Math.round(randomnumber(1, 100)),
        fy: Math.round(randomnumber(1, 100)),

        r: Math.round(randomnumber(1, 100)),
        rx: Math.round(randomnumber(1, 100)),
        ry: Math.round(randomnumber(1, 100)),

        t: Math.random(),

        x: Math.round(randomnumber(1, 100)),
        x1: Math.round(randomnumber(1, 100)),
        x2: Math.round(randomnumber(1, 100)),
        y: Math.round(randomnumber(1, 100)),
        y1: Math.round(randomnumber(1, 100)),
        y2: Math.round(randomnumber(1, 100)),

        offset0: Math.max(0.49, Math.random()),
        offset1: Math.min(0.51, Math.random()),

        origin: Math.round(randomnumber(1, 100)),
        originX: Math.round(randomnumber(1, 100)),
        originY: Math.round(randomnumber(1, 100)),
        originXY: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },

        scale: Math.round(randomnumber(1, 10)),
        scaleX: Math.round(randomnumber(1, 10)),
        scaleY: Math.round(randomnumber(1, 10)),
        scaleXY: { x: Math.round(randomnumber(1, 10)), y: Math.round(randomnumber(1, 10)) },

        skew: Math.round(randomnumber(1, 10)),
        skewX: Math.round(randomnumber(1, 10)),
        skewY: Math.round(randomnumber(1, 10)),
        skewXY: { x: Math.round(randomnumber(1, 10)), y: Math.round(randomnumber(1, 10)) },

        translate: Math.round(randomnumber(1, 100)),
        translateX: Math.round(randomnumber(1, 100)),
        translateY: Math.round(randomnumber(1, 100)),
        translateXY: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },

        rotate: Math.round(randomnumber(1, 360)),
        rotation: Math.round(randomnumber(1, 360)),

        width: Math.round(randomnumber(1, 100)),
        height: Math.round(randomnumber(1, 100)),

        inputFill: 0,
        fillOpacity: Math.random(),

        fontSize: Math.round(randomnumber(12, 30)),

        inputStroke: 0,
        strokeOpacity: Math.random(),
        strokeWidth: Math.round(randomnumber(5, 15)),

        startOffset: Math.round(randomnumber(1, 100)),

        startAngle: Math.round(randomnumber(1, 180)),
        endAngle: Math.round(randomnumber(181, 360)),
    }

    constructor(props) {
        super(props);
        this.state = { type: '', animType: 'none' };
        const propKeys = Object.keys(SvgAnimation.defaultProps);
        propKeys.forEach(key => {
            const value = this.props[key];
            if (typeof value === 'number') {
                this[key] = new Animated.Value(value);
            } else {
                this[key] = new Animated.ValueXY(value);
            }
        });
        this.d = 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5';
        this.fill = this.inputFill.interpolate({
            inputRange: [0, 1],
            outputRange: [
                startColor,
                endColor
            ]
        });
        this.stroke = this.inputFill.interpolate({
            inputRange: [0, 1],
            outputRange: [
                endColor,
                startColor
            ]
        });
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        if (this.stopAnimate) {
            return;
        }
        Animated.parallel([
            Animated.spring(this.cx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cy, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.cpx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cpy, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cpx1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cpy1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cpx2, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cpy2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.dx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dy, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.fx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.fy, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.dx0, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dy0, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dx1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dy1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dx2, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.dy2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.px0, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.py0, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.px1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.py1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.px2, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.py2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.r, { toValue: Math.max(0, Math.round(randomnumber(1, 100))) }),
            Animated.spring(this.rx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.ry, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.t, { toValue: Math.random() }),

            Animated.spring(this.x, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.x1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.x2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.y, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.y1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.y2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.fontSize, { toValue: Math.round(randomnumber(12, 30)) }),
            Animated.spring(this.startOffset, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.width, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.height, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.offset0, { toValue: Math.max(0.49, Math.random()) }),
            Animated.spring(this.offset1, { toValue: Math.min(0.51, Math.random()) }),

            Animated.spring(this.origin, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originX, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originY, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originXY, {
                toValue: { x: randomnumber(1, 100), y: randomnumber(1, 100) }
            }),

            Animated.spring(this.scale, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.scaleX, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.scaleY, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.scaleXY, {
                toValue: { x: randomnumber(1, 10), y: randomnumber(1, 10) }
            }),

            Animated.spring(this.skew, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.skewX, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.skewY, { toValue: Math.round(randomnumber(1, 10)) }),
            Animated.spring(this.skewXY, {
                toValue: { x: randomnumber(1, 10), y: randomnumber(1, 10) }
            }),

            Animated.spring(this.translate, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateX, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateY, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateXY, {
                toValue: { x: randomnumber(1, 100), y: randomnumber(1, 100) }
            }),

            Animated.spring(this.rotate, { toValue: Math.round(randomnumber(1, 360)) }),
            Animated.spring(this.rotation, { toValue: Math.round(randomnumber(1, 360)) }),

            Animated.spring(this.inputFill, { toValue: Math.random() }),
            Animated.spring(this.fillOpacity, { toValue: Math.random() }),

            Animated.spring(this.inputStroke, { toValue: Math.random() }),
            Animated.spring(this.strokeOpacity, { toValue: Math.random() }),
            Animated.spring(this.strokeWidth, { toValue: randomnumber(5, 15) }),

            Animated.spring(this.startAngle, { toValue: Math.round(randomnumber(1, 180)) }),
            Animated.spring(this.endAngle, { toValue: Math.round(randomnumber(181, 360)) }),
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

    getProps(normalProps) {
        if (this.state.animType === 'origin+rotation') {
            return {
                ...normalProps,
                rotation: this.rotation,
                origin: this.origin
            };
        }
        if (this.state.animType === 'originXY+rotation') {
            return {
                ...normalProps,
                rotation: this.rotation,
                origin: this.originXY
            };
        }
        if (this.state.animType === 'scaleXY') {
            return {
                ...normalProps,
                scale: this.scaleXY
            };
        }
        if (this.state.animType === 'skewXY') {
            return {
                ...normalProps,
                skew: this.skewXY
            };
        }
        if (this.state.animType === 'translateXY') {
            return {
                ...normalProps,
                translate: this.translateXY
            };
        }
        if (this.state.animType === 'x+y') {
            return {
                ...normalProps,
                x: this.x,
                y: this.y
            };
        }
        if (this.state.animType === 'stroke') {
            return {
                ...normalProps,
                stroke: this.stroke,
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            };
        }
        if (this.state.animType === 'strokeOpacity') {
            return {
                ...normalProps,
                stroke: randomcolor(),
                strokeWidth: SvgAnimation.defaultProps.strokeWidth,
                strokeOpacity: this.strokeOpacity
            };
        }
        if (this.state.animType === 'strokeWidth') {
            return {
                ...normalProps,
                stroke: randomcolor(),
                strokeWidth: this.strokeWidth
            };
        }
        if (this.state.animType === 'dx+dy') {
            return {
                ...normalProps,
                fill: randomcolor(),
                stroke: randomcolor(),
                dx: this.dx,
                dy: this.dy
            };
        }
        if (this.state.animType === 'dxn') {
            return {
                ...normalProps,
                fill: randomcolor(),
                stroke: randomcolor(),
                dx0: this.dx0,
                dx1: this.dx1,
                dx2: this.dx2
            };
        }
        if (this.state.animType === 'dyn') {
            return {
                ...normalProps,
                fill: randomcolor(),
                stroke: randomcolor(),
                dy0: this.dy0,
                dy1: this.dy1,
                dy2: this.dy2
            };
        }
        if (this.state.animType === 'defaultProps') {
            return Object.keys(normalProps).reduce((acc, key) => {
                acc[key] = this[key];
                return acc;
            }, {});
        }
        return {
            ...normalProps,
            [this.state.animType]: this[this.state.animType]
        };
    }

    renderCircle() {
        if (this.state.type !== 'circle') {
            return null;
        }
        const normalProps = {
            r: SvgAnimation.defaultProps.r,
            cy: SvgAnimation.defaultProps.cy,
            cx: SvgAnimation.defaultProps.cx
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Circle
                    ref={ref => (this.circle = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderRect() {
        if (this.state.type !== 'rect') {
            return null;
        }
        const normalProps = {
            width: SvgAnimation.defaultProps.width,
            height: SvgAnimation.defaultProps.height
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Rect
                    ref={ref => (this.rect = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderEllipse() {
        if (this.state.type !== 'ellipse') {
            return null;
        }
        const normalProps = {
            cx: SvgAnimation.defaultProps.cx,
            cy: SvgAnimation.defaultProps.cy,
            rx: SvgAnimation.defaultProps.rx,
            ry: SvgAnimation.defaultProps.ry,
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Ellipse
                    ref={ref => (this.ellipse = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderLine() {
        if (this.state.type !== 'line') {
            return null;
        }
        const normalProps = {
            x1: SvgAnimation.defaultProps.x1,
            x2: SvgAnimation.defaultProps.x2,
            y1: SvgAnimation.defaultProps.y1,
            y2: SvgAnimation.defaultProps.y2,
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Line
                    ref={ref => (this.line = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderPolygon() {
        if (this.state.type !== 'polygon') {
            return null;
        }
        let normalProps = {
            points: '40,5 70,80 25,95',
            fill: randomcolor(),
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth
        };
        let props = this.getProps(normalProps);
        if (this.state.animType === 'defaultProps') {
            props = {
                ...normalProps,
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            };
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Polygon
                    ref={ref => (this.polygon = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderPolyline() {
        if (this.state.type !== 'polyline') {
            return null;
        }
        const normalProps = {
            points: '40,5 70,80 25,95',
            fill: 'none',
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth
        };
        let props = this.getProps(normalProps);
        if (this.state.animType === 'defaultProps') {
            props = {
                ...normalProps,
                points: undefined,
                px0: this.px0,
                px1: this.px1,
                px2: this.px2,
                py0: this.py0,
                py1: this.py1,
                py2: this.py2,
            };
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Polyline
                    ref={ref => (this.polyline = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderD3Path() {
        if (this.state.type !== 'd3path') {
            return null;
        }
        const closePath = <D3PathCommand command="closePath" />;
        const argList = ['x', 'y', 'cpx', 'cpy', 'cpx1', 'cpx2', 'cpy1', 'cpy2', 'x1', 'x2', 'y1', 'y2', 'radius', 'w', 'h'];
        const regularProps = argList.reduce((acc, key) => {
            acc[key] = randomnumber(1, 100);
            return acc;
        }, {
            startAngle: randomnumber(1, 180),
            endAngle: randomnumber(181, 360)
        });
        const regularCommands = {
            moveTo: <D3PathCommand command="moveTo" {...regularProps}/>,
            lineTo: <D3PathCommand command="lineTo" {...regularProps} />,
            quadraticCurveTo: <D3PathCommand command="quadraticCurveTo" {...regularProps} />,
            bezierCurveTo: <D3PathCommand command="bezierCurveTo" {...regularProps} />,
            arcTo: <D3PathCommand command="arcTo" {...regularProps} />,
            arc: <D3PathCommand command="arc" {...regularProps} />,
            rect: <D3PathCommand command="rect" {...regularProps} />,
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
        const animatedCommand = animatedCommands[this.state.animType];
        const normalProps = {
            d: this.d,
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            children: Object.keys(regularCommands).map(key => regularCommands[key])
        };
        let props = this.getProps(normalProps);
        if (this.state.animType === 'defaultProps') {
            props = normalProps;
        } else if (this.state.animType === 'all') {
            props = {
                ...normalProps,
                children: Object.keys(animatedCommands).map(key => animatedCommands[key])
            };
        } else if (animatedCommand === animatedCommands.moveTo) {
            props = {
                ...normalProps,
                children: [animatedCommand, regularCommands.lineTo]
            };
        } else if (animatedCommand === animatedCommands.arc) {
            props = {
                ...normalProps,
                children: [animatedCommand]
            };
        } else if (animatedCommand) {
            props = {
                ...normalProps,
                children: [regularCommands.moveTo, animatedCommand]
            };
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <D3Path
                    ref={ref => (this.path = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderD3InterpolatePath() {
        if (this.state.type !== 'd3interpolatepath') {
            return null;
        }
        const normalProps = {
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            d1: 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5',
            d2: 'm82.5,187.5c1,0 87,-86 181,2c88,88 186,-15 185.5,-85.5'
        };
        let props = this.getProps(normalProps);
        if (this.state.animType === 'defaultProps') {
            props = {
                ...normalProps,
                t: this.t
            };
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <D3InterpolatePath
                    ref={ref => (this.path = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderFlubberPath() {
        if (this.state.type !== 'flubberpath') {
            return null;
        }
        const numShapes = Math.round(randomnumber(3, 10));
        const fromShape = randompolygon(SCREEN_WIDTH, SCREEN_HEIGHT);
        const toShape = randompolygon(SCREEN_WIDTH, SCREEN_HEIGHT);
        const fromShapeList = randompolygon(numShapes, SCREEN_WIDTH, SCREEN_HEIGHT);
        const toShapeList = randompolygon(numShapes, SCREEN_WIDTH, SCREEN_HEIGHT);
        const normalProps = {
            stroke: randomcolor(),
            strokeWidth: SvgAnimation.defaultProps.strokeWidth,
            fromShape,
            toShape,
            fromShapeList,
            toShapeList,
            x: SvgAnimation.defaultProps.x,
            y: SvgAnimation.defaultProps.y,
            r: SvgAnimation.defaultProps.r,
            width: SvgAnimation.defaultProps.width,
            height: SvgAnimation.defaultProps.height,
        };
        let props = this.getProps(normalProps);
        if (this.state.animType === 'defaultProps') {
            props = {
                ...normalProps,
                t: this.t
            };
        } else if (flubberArgs.includes(this.state.animType)) {
            props = {
                ...normalProps,
                t: this.t,
                interpolatorType: this.state.animType
            };
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <FlubberPath
                    ref={ref => (this.path = ref)}
                    {...props}
                />
            </Svg>
        );
    }

    renderText() {
        if (this.state.type !== 'text') {
            return null;
        }
        const normalProps = {
            fontSize: 40
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Text
                    ref={ref => (this.text = ref)}
                    {...props}
                >abc</Text>
            </Svg>
        );
    }

    renderTSpan() {
        if (this.state.type !== 'tspan') {
            return null;
        }
        return (
            <Svg
                height="160"
                width="200"
            >
                <Text y="20" dx="5 5">
                    <NativeSvg.TSpan x="10" >tspan line 1</NativeSvg.TSpan>
                    <NativeSvg.TSpan x="10" dy="15">tspan line 2</NativeSvg.TSpan>
                    <NativeSvg.TSpan x="10" dx="10" dy="15">tspan line 3</NativeSvg.TSpan>
                </Text>
                <Text x="10" y="60" fill="red" fontSize="14">
                    <NativeSvg.TSpan dy="5 10 20" >12345</NativeSvg.TSpan>
                    <NativeSvg.TSpan fill="blue" dy="15" dx="0 5 5">
                        <NativeSvg.TSpan>6</NativeSvg.TSpan>
                        <NativeSvg.TSpan>7</NativeSvg.TSpan>
                    </NativeSvg.TSpan>
                    <NativeSvg.TSpan dx="0 10 20" dy="0 20" fontWeight="bold" fontSize="12">89a</NativeSvg.TSpan>
                </Text>
                <Text y="140" dx="0 5 5" dy="0 -5 -5">delta on text</Text>
            </Svg>
        );
        // return (
        //     <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
        //         <Text y="20" dx="5 5">
        //             <TSpan x={this.x} >tspan line 1</TSpan>
        //             <TSpan x={this.x1} dy={this.y1}>tspan line 2</TSpan>
        //             <TSpan x={this.x2} dx={this.y2} dy={this.cx}>tspan line 3</TSpan>
        //         </Text>
        //         <Text x="10" y="60" fill={this.fill} fontSize={this.fontSize}>
        //             <TSpan dy={this.cy}>12345</TSpan>
        //             <TSpan fill={this.stroke} dx={this.dx} dy={this.dy}>
        //                 <TSpan>6</TSpan>
        //                 <TSpan>7</TSpan>
        //             </TSpan>
        //             <TSpan dx="0 10 20" dy="0 20" fontWeight="bold" fontSize={this.fontSize}>89a</TSpan>
        //         </Text>
        //         <Text y="140" dx="0 5 5" dy="0 -5 -5">delta on text</Text>
        //     </Svg>
        // );
    }

    renderTextPath() {
        if (this.state.type !== 'textpath') {
            return null;
        }
        const normalProps = {
            startOffset: SvgAnimation.defaultProps.startOffset
        };
        let props = this.getProps(normalProps);
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <Path
                        id="path"
                        d={this.d}
                    />
                </Defs>
                <G y="20">
                    <Text fill="blue">
                        <TextPath href="#path" {...props}>
                            {loremipsum({ count: 5, units: 'words' })}
                            <NativeSvg.TSpan fill="red" dy="5,5,5">{loremipsum({ count: 5, units: 'words' })}</NativeSvg.TSpan>
                        </TextPath>
                    </Text>
                    <Path
                        d={this.d}
                        fill="none"
                        stroke="red"
                        strokeWidth="1"
                    />
                </G>
            </Svg>
        );
    }

    renderG() {
        if (this.state.type !== 'g') {
            return null;
        }
        let props = this.getProps({});
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <G {...props}>
                    <Rect
                        x="60"
                        y="20"
                        height="50"
                        width="80"
                        stroke={randomcolor()}
                        fill={randomcolor()}
                    />
                </G>
            </Svg>
        );
    }

    renderUse() {
        if (this.state.type !== 'use') {
            return null;
        }
        let props = this.getProps({});
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <G id="shape">
                        <G>
                            <Circle cx="50" cy="50" r="50" />
                            <Rect x="50" y="50" width="50" height="50" />
                            <Circle cx="50" cy="50" r="5" fill={randomcolor()} />
                        </G>
                    </G>
                </Defs>
                <Use
                    href="#shape"
                    {...props}
                />
            </Svg>
        );
    }

    renderLinearGradient() {
        if (this.state.type !== 'lgrad') {
            return null;
        }
        const normalProps = {
            x1: SvgAnimation.defaultProps.x1,
            x2: SvgAnimation.defaultProps.x2,
            y1: SvgAnimation.defaultProps.y1,
            y2: SvgAnimation.defaultProps.y2,
        };
        let props = this.getProps(normalProps);
        let offset0 = '0';
        let offset1 = '1';
        let stopColor0 = startColor;
        let stopColor1 = endColor;
        let stopOpacity0 = '1';
        let stopOpacity1 = '1';
        if (this.state.animType === 'offset' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            offset0 = this.offset0;
            offset1 = this.offset1;
        } else if (this.state.animType === 'offset0') {
            offset0 = this.offset0;
        }
        if (this.state.animType === 'stopColor' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopColor0 = this.fill;
            stopColor1 = this.stroke;
        } else if (this.state.animType === 'stopColor0') {
            stopColor0 = this.fill;
        }
        if (this.state.animType === 'stopOpacity' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopOpacity0 = this.fillOpacity;
            stopOpacity1 = this.strokeOpacity;
        } else if (this.state.animType === 'stopOpacity0' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopOpacity0 = this.fillOpacity;
        }
        if (this.state.animType !== 'defaultProps') {
            props = normalProps;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <LinearGradient id="grad" {...props}>
                        <Stop offset={offset0} stopColor={stopColor0} stopOpacity={stopOpacity0} />
                        <Stop offset={offset1} stopColor={stopColor1} stopOpacity={stopOpacity1} />
                    </LinearGradient>
                </Defs>
                <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
            </Svg>
        );
    }

    renderRadialGradient() {
        if (this.state.type !== 'rgrad') {
            return null;
        }
        const normalProps = {
            cx: SvgAnimation.defaultProps.cx,
            cy: SvgAnimation.defaultProps.cy,
            rx: SvgAnimation.defaultProps.rx,
            ry: SvgAnimation.defaultProps.ry,
            fx: SvgAnimation.defaultProps.fx,
            fy: SvgAnimation.defaultProps.fy,
        };
        let props = this.getProps(normalProps);
        let offset0 = '0';
        let offset1 = '1';
        let stopColor0 = startColor;
        let stopColor1 = endColor;
        let stopOpacity0 = '1';
        let stopOpacity1 = '1';
        if (this.state.animType === 'offset' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            offset0 = this.offset0;
            offset1 = this.offset1;
        } else if (this.state.animType === 'offset0') {
            offset0 = this.offset0;
        }
        if (this.state.animType === 'stopColor' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopColor0 = this.fill;
            stopColor1 = this.stroke;
        } else if (this.state.animType === 'stopColor0') {
            stopColor0 = this.fill;
        }
        if (this.state.animType === 'stopOpacity' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopOpacity0 = this.fillOpacity;
            stopOpacity1 = this.strokeOpacity;
        } else if (this.state.animType === 'stopOpacity0' || this.state.animType === 'onlyStop' || this.state.animType === 'defaultProps') {
            stopOpacity0 = this.fillOpacity;
        }
        if (this.state.animType !== 'defaultProps') {
            props = normalProps;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <RadialGradient id="grad" {...props} gradientUnits="userSpaceOnUse">
                        <Stop offset={offset0} stopColor={stopColor0} stopOpacity={stopOpacity0} />
                        <Stop offset={offset1} stopColor={stopColor1} stopOpacity={stopOpacity1} />
                    </RadialGradient>
                </Defs>
                <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
            </Svg>
        );
    }

    render() {
        const animsForType = animTypes[this.state.type] || [];
        const anims = [...defaultAnimTypes, ...animsForType];
        return (
            <View>
                <ScrollView horizontal style={{ flexDirection: 'row', marginTop: 40, paddingBottom: 20 }}>
                    {types.map((type, i) => (
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
                    ))}
                </ScrollView>
                <ScrollView horizontal style={{ flexDirection: 'row', paddingBottom: 20 }}>
                    {anims.map((animType, i) => (
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
                    ))}
                </ScrollView>
                <ScrollView style={styles.container}>
                    {this.renderCircle()}
                    {this.renderRect()}
                    {this.renderEllipse()}
                    {this.renderLine()}
                    {this.renderPolygon()}
                    {this.renderPolyline()}
                    {this.renderD3Path()}
                    {this.renderD3InterpolatePath()}
                    {this.renderText()}
                    {this.renderTextPath()}
                    {this.renderG()}
                    {this.renderUse()}
                    {this.renderLinearGradient()}
                    {this.renderRadialGradient()}
                </ScrollView>
            </View>
        );
    }
}
