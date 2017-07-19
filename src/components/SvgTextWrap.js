// @flow
import React, { Component } from 'react';
import { Svg } from 'expo';

const { Text, TSpan } = Svg;

type Props = {
    text: string,
    width: number,
    fontSize: number
};

const defaultProps = {
    fontSize: 12
};

// https://gist.github.com/gka/7469245
function approximateCharWidth(w, c) {
    if (c === 'W' || c === 'M') {
        w += 15;
    } else if (c === 'w' || c === 'm') {
        w += 12;
    } else if (c === 'I' || c === 'i' || c === 'l' || c === 't' || c === 'f') {
        w += 4;
    } else if (c === 'r') {
        w += 8;
    } else if (c === c.toUpperCase()) {
        w += 12;
    } else {
        w += 10;
    }
    return w;
}

function approximateTextWidth(s) {
    return s.split('').reduce(approximateCharWidth, 0);
}

export function getLines({ text, width }) {
    const words = text.split(/[ \t\r\n]+/).reverse().filter(w => w !== '');
    let word;
    let lines = [];
    let line = [];
    while ((word = words.pop())) {
        line.push(word);
        if (approximateTextWidth(line.join(' ')) > width && line.length > 1) {
            line.pop();
            lines.push(line.join(' '));
            line = [word];
        }
    }
    if (line.length > 0) {
        lines.push(line.join(' '));
    }
    return lines;
}

class SvgTextWrap extends Component {
    props: Props;
    static defaultProps = typeof defaultProps;
    render() {
        const { text, width, ...props } = this.props;
        const lines = getLines(this.props);
        return (
            <Text {...props}>
                {lines.map(line =>
                    <TSpan x={0} dy={this.props.fontSize}>
                        {line}
                    </TSpan>
                )}
            </Text>
        );
    }
}
SvgTextWrap.defaultProps = defaultProps;
export default SvgTextWrap;
