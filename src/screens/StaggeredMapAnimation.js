import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as topojson from 'topojson';

import randomNumber from '../randomNumber';
import GeoPath from '../components/AnimatedSvgD3GeoPath';
import Circle from '../components/AnimatedSvgCircle';

async function fetchJSON() {
    const response = await fetch('https://d3js.org/us-10m.v1.json');
    return response.json();
}

export default class StaggeredMapAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = { features: [] };
        const { width, height } = Dimensions.get('window');
        this.points = Array(8)
            .fill()
            .map(_ => [
                randomNumber(100, width - 100),
                randomNumber(50, 200)
            ]);
        this.r = this.points.map(_ => new Animated.Value(0));
    }
    async componentWillMount() {
        const us = await fetchJSON();
        const features = topojson.feature(us, us.objects.states).features;
        this.setState(
            {
                features
            },
            () => this.animate()
        );
    }
    animate() {
        const animation = Animated.sequence([
            Animated.delay(1000),
            Animated.stagger(
                100,
                this.r.map(animValue =>
                    Animated.spring(animValue, { toValue: 10 })
                )
            )
        ]);
        animation.start();
    }
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Svg.G scale={width / 900}>
                        {this.state.features.map(object =>
                            <GeoPath
                                key={object.id}
                                object={object}
                                strokeWidth="1"
                                stroke="#fff"
                            />
                        )}
                    </Svg.G>
                    {this.points.map((point, i) =>
                        <Circle
                            key={i}
                            r={this.r[i]}
                            cx={point[0]}
                            cy={point[1]}
                            fillOpacity={0.5}
                            fill="red"
                            stroke="red"
                            strokeWidth={5}
                        />
                    )}
                </Svg>
            </View>
        );
    }
}
