import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgG = Svg.G;

class SvgG extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgG
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgG = AnimatedSvgFix(SvgG);
export default SvgG;
