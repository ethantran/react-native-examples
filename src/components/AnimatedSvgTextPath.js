import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

/**
 * BUG: this._component does not have setNativeProps, I guess expo svg is not updated
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
SvgTextPath = AnimatedSvgFix(SvgTextPath, {
    state: ['fontSize', 'startOffset']
});
export default SvgTextPath;
