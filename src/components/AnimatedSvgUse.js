import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgUse = Svg.Use;

class SvgUse extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgUse
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgUse = AnimatedSvgFix(SvgUse);
export default SvgUse;
