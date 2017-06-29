import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgTextFix from './AnimatedSvgTextFix';

/**
 * BUG: TextPath does not have setNativeProps
 * BUG: startOffset does not animate even with state
 */

const NativeSvgTextPath = Svg.TextPath;

class SvgTextPath extends Component {
    setNativeProps = (props) => {
        // this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgTextPath
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgTextPath = AnimatedSvgTextFix(SvgTextPath, { container: true });
export default SvgTextPath;
