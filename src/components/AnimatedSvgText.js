import React, { Component } from 'react';
import { Svg } from 'expo';
import AnimatedSvgTextFix from './AnimatedSvgTextFix';

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
SvgText = AnimatedSvgTextFix(SvgText, { container: true });
export default SvgText;
