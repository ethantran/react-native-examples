import React, { Component } from 'react';
import { Svg as NativeSvg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

class Svg extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvg
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
Svg = AnimatedSvgFix(Svg, {
    propString: ['width', 'height']
});
export default Svg;
