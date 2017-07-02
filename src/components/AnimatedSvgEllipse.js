import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgEllipse = Svg.Ellipse;

class SvgEllipse extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgEllipse
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgEllipse = AnimatedSvgFix(SvgEllipse, {
    propString: ['rx', 'ry', 'cx', 'cy']
});
export default SvgEllipse;
