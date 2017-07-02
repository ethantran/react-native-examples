import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgCircle = Svg.Circle;

export const args = ['r', 'cx', 'cy'];

class SvgCircle extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgCircle
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgCircle = AnimatedSvgFix(SvgCircle, { propString: args });
export default SvgCircle;
