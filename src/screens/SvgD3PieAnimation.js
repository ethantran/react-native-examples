import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import randomColor from '../randomColor';
import Pie from '../components/AnimatedSvgD3ShapePie';

const dataLength = 10;
const min = 0;
const max = 100;

export default class SvgPieAnimation extends Component {
    constructor(props) {
        super(props);
        this.data = Array(dataLength).fill().map((_, index) => ({
            index,
            value: new Animated.Value(randomNumber(min, max))
        }));
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        Animated.sequence(
            this.data.map(item =>
                Animated.spring(item.value, {
                    toValue: randomNumber(min, max)
                })
            )
        ).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const maxSize = Math.min(width, height);
        const outerRadius = maxSize / 2;
        const innerRadius = randomNumber(0, outerRadius);
        const cornerRadius = randomNumber(0, 10);
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Pie
                        data={this.data}
                        value={d => d.value}
                        arcProps={(arc, i) => ({
                            fill: randomColor(),
                            outerRadius,
                            innerRadius,
                            cornerRadius
                        })}
                        translate={width / 2}
                    />
                </Svg>
            </View>
        );
    }
}
