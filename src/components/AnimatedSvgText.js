import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgText = Svg.Text;

class SvgText extends Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    }
    render() {
        return (
            <NativeSvgText
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}
SvgText = AnimatedSvgFix(SvgText, {
    propString: ['fontSize']
});
export default SvgText;
