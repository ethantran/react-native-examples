import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgRect = Svg.Rect;

export const args = ['width', 'height'];

class SvgRect extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgRect
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgRect = AnimatedSvgFix(SvgRect, { propString: args, keepXY: true });
export default SvgRect;
