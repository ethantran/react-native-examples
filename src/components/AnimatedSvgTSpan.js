import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgTextFix from './AnimatedSvgTextFix';

/**
 * BUG: does not even render anything
 */

const NativeSvgTSpan = Svg.TSpan;

class SvgTSpan extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgTSpan
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgTSpan = AnimatedSvgTextFix(SvgTSpan);
export default SvgTSpan;
