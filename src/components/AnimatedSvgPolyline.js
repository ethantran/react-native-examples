import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgPolyline = Svg.Polyline;

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractPolyPoints.js
function extractPolyPoints(polyPoints) {
    return polyPoints.replace(/[^e]-/, ' -').split(/(?:\s+|\s*,\s*)/g).join(' ');
}

function getTotalPointKeys(props) {
    return Object.keys(props).filter(key => key.includes('point'));
}

class SvgPolyline extends Component {
    totalPointKeys = getTotalPointKeys(this.props)
    componentWillReceiveProps(nextProps) {
        if (this.totalPointKeys.some((key, index) => nextProps[key] !== this.props[key])) {
            this.totalPointKeys = getTotalPointKeys(nextProps);
            this.setNativeProps(nextProps);
        }
    }
    setNativeProps = (props) => {
        if (this.totalPointKeys.some((key, index) => props[key] != null)) {
            props.d = this.createPropsD(props, this.totalPointKeys);
        }
        // BUG: getNativeElement() is not a function https://github.com/react-native-community/react-native-svg/issues/180
        // this._component.setNativeProps(props);
        this._component && this._component.root && this._component.root.setNativeProps(props);
        // this._component.root.setNativeProps(props);
    }
    createPropsD = (props) => {
        const points = this.totalPointKeys.reduce((acc, key, j) => {
            return acc + props[key].x + ',' + props[key].y + ' ';
        }, '');
        // https://github.com/react-native-community/react-native-svg/blob/master/elements/Polygon.js
        return `M${extractPolyPoints(points)}`;
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
