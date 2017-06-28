import React, { Component } from 'react';
import { StyleSheet, ScrollView, Animated, Dimensions, Button } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { Svg as NativeSvg } from 'expo';
const Defs = NativeSvg.Defs;

import randomcolor from '../randomcolor';
import randomnumber from '../randomnumber';
import Svg from '../components/AnimatedSvg';
import Circle from '../components/AnimatedSvgCircle';
import Rect from '../components/AnimatedSvgRect';
import Ellipse from '../components/AnimatedSvgEllipse';
import Line from '../components/AnimatedSvgLine';
import Polygon from '../components/AnimatedSvgPolygon';
import Polyline from '../components/AnimatedSvgPolyline';
import Path from '../components/AnimatedSvgPath';
import Text from '../components/AnimatedSvgText';
import TSpan from '../components/AnimatedSvgTSpan';
import TextPath from '../components/AnimatedSvgTextPath';
import G from '../components/AnimatedSvgG';
import Use from '../components/AnimatedSvgUse';
import LinearGradient from '../components/AnimatedSvgLinearGradient';
import RadialGradient from '../components/AnimatedSvgRadialGradient';
import Stop from '../components/AnimatedSvgStop';

const types = ['circle', 'rect', 'ellipse', 'line', 'polygon', 'polyline', 'path', 'text', 'tspan', 'textpath', 'g', 'use', 'lgrad', 'rgrad'];

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

        dx: Math.round(randomnumber(1, 100)),
        dy: Math.round(randomnumber(1, 100)),
        dx0: Math.round(randomnumber(1, 100)),
        dy0: Math.round(randomnumber(1, 100)),
        dx1: Math.round(randomnumber(1, 100)),
        dy1: Math.round(randomnumber(1, 100)),
        dx2: Math.round(randomnumber(1, 100)),
        dy2: Math.round(randomnumber(1, 100)),

        fx: Math.round(randomnumber(1, 100)),
        fy: Math.round(randomnumber(1, 100)),

        r: Math.round(randomnumber(1, 100)),
        rx: Math.round(randomnumber(1, 100)),
        ry: Math.round(randomnumber(1, 100)),

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

        scale: Math.round(randomnumber(1, 2)),
        scaleX: Math.round(randomnumber(1, 2)),
        scaleY: Math.round(randomnumber(1, 2)),
        scaleXY: { x: Math.round(randomnumber(1, 2)), y: Math.round(randomnumber(1, 2)) },

        skew: Math.round(randomnumber(1, 5)),
        skewX: Math.round(randomnumber(1, 5)),
        skewY: Math.round(randomnumber(1, 5)),
        skewXY: { x: Math.round(randomnumber(1, 5)), y: Math.round(randomnumber(1, 5)) },

        translate: Math.round(randomnumber(1, 100)),
        translateX: Math.round(randomnumber(1, 100)),
        translateY: Math.round(randomnumber(1, 100)),
        translateXY: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },

        rotate: Math.round(randomnumber(1, 360)),
        rotation: Math.round(randomnumber(1, 360)),

        point0: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },
        point1: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },
        point2: { x: Math.round(randomnumber(1, 100)), y: Math.round(randomnumber(1, 100)) },

        width: Math.round(randomnumber(1, 100)),
        height: Math.round(randomnumber(1, 100)),

        fill: 0,
        fillOpacity: Math.random(),

        fontSize: Math.round(randomnumber(12, 30)),

        stroke: 0,
        strokeOpacity: Math.random(),
        strokeWidth: Math.round(randomnumber(1, 5)),

        startOffset: Math.round(randomnumber(1, 100)),
    }

    state = {}

    componentDidMount() {
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
        this.points = propKeys
            .filter(key => key.includes('point'))
            .map((key, i) => this[key]);
        this.interpolatedFill = this.fill.interpolate({
            inputRange: [0, 1],
            outputRange: [
                startColor,
                endColor
            ]
        });
        this.interpolatedStroke = this.stroke.interpolate({
            inputRange: [0, 1],
            outputRange: [
                endColor,
                startColor
            ]
        });
        this.animate();
    }

    animate = () => {
        if (this.stopAnimate) {
            return;
        }
        const pointsAnimations = this.points.map(animatedValue => {
            return Animated.spring(animatedValue, {
                toValue: { x: randomnumber(1, 100), y: randomnumber(1, 100) }
            });
        });
        Animated.parallel([
            Animated.spring(this.cx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.cy, { toValue: Math.round(randomnumber(1, 100)) }),

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

            Animated.spring(this.width, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.height, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.r, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.rx, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.ry, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.x, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.x1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.x2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.y, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.y1, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.y2, { toValue: Math.round(randomnumber(1, 100)) }),

            Animated.spring(this.fontSize, { toValue: Math.round(randomnumber(12, 30)) }),
            Animated.spring(this.startOffset, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.rotate, { toValue: Math.round(randomnumber(1, 360)) }),
            Animated.spring(this.rotation, { toValue: Math.round(randomnumber(1, 360)) }),

            Animated.spring(this.offset0, { toValue: Math.max(0.49, Math.random()) }),
            Animated.spring(this.offset1, { toValue: Math.min(0.51, Math.random()) }),

            Animated.spring(this.origin, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originX, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originY, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.originXY, {
                toValue: { x: randomnumber(1, 100), y: randomnumber(1, 100) }
            }),

            Animated.spring(this.scale, { toValue: Math.round(randomnumber(1, 2)) }),
            Animated.spring(this.scaleX, { toValue: Math.round(randomnumber(1, 2)) }),
            Animated.spring(this.scaleY, { toValue: Math.round(randomnumber(1, 2)) }),
            Animated.spring(this.scaleXY, {
                toValue: { x: randomnumber(1, 2), y: randomnumber(1, 2) }
            }),

            Animated.spring(this.skew, { toValue: Math.round(randomnumber(1, 5)) }),
            Animated.spring(this.skewX, { toValue: Math.round(randomnumber(1, 5)) }),
            Animated.spring(this.skewY, { toValue: Math.round(randomnumber(1, 5)) }),
            Animated.spring(this.skewXY, {
                toValue: { x: randomnumber(1, 5), y: randomnumber(1, 5) }
            }),

            Animated.spring(this.translate, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateX, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateY, { toValue: Math.round(randomnumber(1, 100)) }),
            Animated.spring(this.translateXY, {
                toValue: { x: randomnumber(1, 100), y: randomnumber(1, 100) }
            }),

            Animated.spring(this.fill, { toValue: Math.random() }),
            Animated.spring(this.fillOpacity, { toValue: Math.random() }),

            Animated.spring(this.stroke, { toValue: Math.random() }),
            Animated.spring(this.strokeOpacity, { toValue: Math.random() }),
            Animated.spring(this.strokeWidth, { toValue: randomnumber(1, 5) }),

            ...pointsAnimations,
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

    renderCircle() {
        if (this.state.type !== 'circle') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Circle
                    ref={ref => (this.circle = ref)}
                    r={this.r}
                    cx={this.cx}
                    cy={this.cy}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderRect() {
        if (this.state.type !== 'rect') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Rect
                    ref={ref => (this.rect = ref)}
                    width={this.width}
                    height={this.height}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderEllipse() {
        if (this.state.type !== 'ellipse') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Ellipse
                    ref={ref => (this.ellipse = ref)}
                    cx={this.cx}
                    cy={this.cy}
                    rx={this.rx}
                    ry={this.ry}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderLine() {
        if (this.state.type !== 'line') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Line
                    ref={ref => (this.line = ref)}
                    x1={this.x1}
                    y1={this.y1}
                    x2={this.x2}
                    y2={this.y2}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderPolygon() {
        if (this.state.type !== 'polygon') {
            return null;
        }
        const pointProps = this.points.reduce((acc, animatedValue, i) => {
            acc['point' + i] = animatedValue;
            return acc;
        }, {});
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Polygon
                    ref={ref => (this.polygon = ref)}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                    {...pointProps}
                />
            </Svg>
        );
    }

    renderPolyline() {
        if (this.state.type !== 'polyline') {
            return null;
        }
        const pointProps = this.points.reduce((acc, animatedValue, i) => {
            acc['point' + i] = animatedValue;
            return acc;
        }, {});
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Polyline
                    ref={ref => (this.polyline = ref)}
                    fill="none"
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                    {...pointProps}
                />
            </Svg>
        );
    }

    renderPath() {
        if (this.state.type !== 'path') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Path
                    ref={ref => (this.path = ref)}
                    d={this.d}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderText() {
        if (this.state.type !== 'text') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Text
                    ref={ref => (this.text = ref)}
                    fontSize={this.fontSize}
                    fill={this.interpolatedFill}
                    fillOpacity={this.fillOpacity}
                    stroke={this.interpolatedStroke}
                    strokeOpacity={this.strokeOpacity}
                    strokeWidth={this.strokeWidth}
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
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
        //         <Text x="10" y="60" fill={this.interpolatedFill} fontSize={this.fontSize}>
        //             <TSpan dy={this.cy}>12345</TSpan>
        //             <TSpan fill={this.interpolatedStroke} dx={this.dx} dy={this.dy}>
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
                        <TextPath href="#path" startOffset={this.x}>
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
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <G
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}>
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
                    rotation={this.rotation}
                    origin={this.origin}
                    scale={this.scale}
                    skew={this.skew}
                    translate={this.translate}
                />
            </Svg>
        );
    }

    renderLinearGradient() {
        if (this.state.type !== 'lgrad') {
            return null;
        }
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <LinearGradient id="grad" x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2}>
                        <Stop offset={this.offset0} stopColor={this.interpolatedFill} stopOpacity={this.fillOpacity} />
                        <Stop offset={this.offset1} stopColor={this.interpolatedStroke} stopOpacity={this.strokeOpacity} />
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
        return (
            <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
                <Defs>
                    <RadialGradient id="grad" cx={this.cx} cy={this.cy} rx={this.rx} ry={this.ry} fx={this.fx} fy={this.fy} gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor={this.interpolatedFill} stopOpacity={this.fillOpacity} />
                        <Stop offset="1" stopColor={this.interpolatedStroke} stopOpacity={this.strokeOpacity} />
                    </RadialGradient>
                </Defs>
                <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
            </Svg>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {types.map((type, i) => (
                    <Button
                        key={i}
                        title={type}
                        onPress={() => {
                            this.stopAnimation();
                            this.setState({ type }, () => {
                                this.stopAnimate = false;
                                this.animate();
                            });
                        }} />
                ))}
                {this.renderCircle()}
                {this.renderRect()}
                {this.renderEllipse()}
                {this.renderLine()}
                {this.renderPolygon()}
                {this.renderPolyline()}
                {this.renderPath()}
                {this.renderText()}
                {this.renderTextPath()}
                {this.renderG()}
                {this.renderUse()}
                {this.renderLinearGradient()}
                {this.renderRadialGradient()}
            </ScrollView>
        );
    }
}
