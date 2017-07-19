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
export function approximateCharWidth(c, { fontSize = 12, adjust } = {}) {
    let width;
    if (c === 'W' || c === 'M') {
        width = 15;
    } else if (c === 'w' || c === 'm') {
        width = 12;
    } else if (c === 'I' || c === 'i' || c === 'l' || c === 't' || c === 'f') {
        width = 4;
    } else if (c === 'r') {
        width = 8;
    } else if (c === c.toUpperCase()) {
        width = 12;
    } else {
        width = 10;
    }
    // adjust based on fontSize
    width *= fontSize / 12;
    // adjust based on custom function
    if (adjust) {
        width = adjust(width, c);
    }
    return width;
}

export function approximateTextWidth(s, options) {
    return s.split('').reduce((w, c) => {
        const width = approximateCharWidth(c, options);
        w += width;
        return w;
    }, 0);
}

export function getLines({ text, width }, options) {
    const words = text.split(/[ \t\r\n]+/).reverse().filter(w => w !== '');
    let word;
    let lines = [];
    let line = [];
    while ((word = words.pop())) {
        line.push(word);
        if (
            approximateTextWidth(line.join(' '), options) > width &&
            line.length > 1
        ) {
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
