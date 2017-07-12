import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Array from 'd3-array';

import Voronoi from '../components/AnimatedSvgD3Voronoi';
import Path from '../components/AnimatedSvgPath';

const voronoiLength = 10;

class PolygonPath extends Component {
    setNativeProps(props) {
        if (props.polygon) {
            props.d = 'M' + props.polygon.join('L') + 'Z';
        }
        this._component.setNativeProps(props);
    }
    render() {
        const { polygon, ...props } = this.props;
        return (
            <Path
                ref={component => (this._component = component)}
                {...props}
                d={'M' + polygon.join('L') + 'Z'}
                fill="none"
                stroke="black"
            />
        );
    }
}

export default class SvgVoronoiAnimation extends Component {
    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');
        this.data = d3Array
            .range(voronoiLength)
            .map(_ => [
                new Animated.Value(Math.random() * width),
                new Animated.Value(Math.random() * width)
            ]);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        const { width } = Dimensions.get('window');
        Animated.sequence(
            this.data.map(item =>
                Animated.sequence([
                    Animated.timing(item[0], {
                        toValue: Math.random() * width,
                        duration: 1000
                    }),
                    Animated.timing(item[1], {
                        toValue: Math.random() * width,
                        duration: 1000
                    })
                ])
            )
        ).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const size = [width, width];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Voronoi
                        data={this.data}
                        size={size}
                        renderPolygon={(polygon, i) =>
                            <PolygonPath
                                key={i}
                                polygon={polygon}
                                fill="none"
                                stroke="black"
                            />}
                    />
                </Svg>
            </View>
        );
    }
}
