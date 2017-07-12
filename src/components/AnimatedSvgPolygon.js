// @flow
import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

const NativeSvgPolygon = Svg.Polygon;

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractPolyPoints.js
function extractPolyPoints(polyPoints) {
    return polyPoints.replace(/[^e]-/, ' -').split(/(?:\s+|\s*,\s*)/g).join(' ');
}

function pointsToString(points: number[][]): string {
    return points.reduce((acc, point, i) => acc + point[0] + ',' + point[1] + ' ', '');
}

// https://github.com/react-native-community/react-native-svg/blob/master/elements/Polygon.js
function getPath(points: number[][]): string {
    return `M${extractPolyPoints(pointsToString(points))}z`;
}

class SvgPolygon extends Component {
    points: AnimatedListener;
    constructor(props) {
        super(props);
        this.points = listen(props.points, _ => this.setNativeProps({ _listener: true }));
    }
    setNativeProps = (props) => {
        if (props._listener) {
            props.d = getPath(this.points.values);
        }
        // BUG: getNativeElement() is not a function https://github.com/react-native-community/react-native-svg/issues/180
        this._component && this._component.root && this._component.root.setNativeProps(props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.points !== this.props.points) {
            removeListeners(this.points);
            this.points = listen(nextProps.points, _ => this.setNativeProps({ _listener: true }));
        }
    }
    componentWillUnmount() {
        removeListeners(this.points);
    }
    render() {
        const d = getPath(this.points.values);
        return (
            <NativeSvgPolygon
                ref={component => (this._component = component)}
                {...this.props}
                d={d}
            />
        );
    }
}
SvgPolygon = AnimatedSvgFix(SvgPolygon);
export default SvgPolygon;
