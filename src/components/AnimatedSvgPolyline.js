import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgPolyline = Svg.Polyline;

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractPolyPoints.js
function extractPolyPoints(polyPoints) {
    return polyPoints.replace(/[^e]-/, ' -').split(/(?:\s+|\s*,\s*)/g).join(' ');
}

class SvgPolyline extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateCache(props);
    }
    updateCache(props) {
        let i = 0;
        this.points = [];
        while (props['px' + i] != null) {
            this.points.push({x: props['px' + i], y: props['py' + i]});
            i++;
        }
    }
    componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps);
    }
    setNativeProps = (props) => {
        // if some pxn or pyn exists in props that means we need to recreate d
        if (this.points.some((key, i) => props['px' + i] != null || props['py' + i] != null)) {
            props.d = this.createPropsD(props, this.totalKeys);
        }
        // BUG: getNativeElement() is not a function https://github.com/react-native-community/react-native-svg/issues/180
        // this._component.setNativeProps(props);
        this._component && this._component.root && this._component.root.setNativeProps(props);
        // this._component.root.setNativeProps(props);
    }
    pointsToString = (props) => {
        return this.points.reduce((acc, point, i) => {
            const propX = props['px' + i];
            const propY = props['py' + i];
            const x = propX != null ? propX : point.x;
            const y = propY != null ? propY : point.y;
            return acc + x + ',' + y + ' ';
        }, '');
    }
    createPropsD = (props) => {
        const points = this.pointsToString(props);
        // https://github.com/react-native-community/react-native-svg/blob/master/elements/Polygon.js
        return `M${extractPolyPoints(points)}z`;
    }
    render() {
        return (
            <NativeSvgPolyline
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgPolyline = AnimatedSvgFix(SvgPolyline);
export default SvgPolyline;
