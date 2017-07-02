import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgLine = Svg.Line;

class SvgLine extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgLine
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgLine = AnimatedSvgFix(SvgLine, {
    propString: ['x1', 'y1', 'x2', 'y2'],
});
export default SvgLine;
