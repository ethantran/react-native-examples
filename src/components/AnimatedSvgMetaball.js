// Credit: varun.ca/metaballs/
//@flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import pick from 'lodash/pick';

import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';
import Path from './AnimatedSvgPath';

type Props = {
    radius1: number,
    radius2: number,
    center1: [number, number],
    center2: [number, number],
    handleSize: number,
    v: number
};

const KEYS = ['radius1', 'radius2', 'handleSize', 'v'];

class AnimatedSvgMetaball extends Component {
    props: Props;
    center1: AnimatedListener;
    center2: AnimatedListener;
    constructor(props) {
        super(props);
        this.updateCache(props);
        this.center1 = listen(props.center1, _ =>
            this.setNativeProps({ updateCenter1: true })
        );
        this.center2 = listen(props.center2, _ =>
            this.setNativeProps({ updateCenter2: true })
        );
    }
    updateCache(props) {
        this.prevProps = pick(props, KEYS);
    }
    setNativeProps = props => {
        if (
            props.hasOwnProperty('radius1') ||
            props.hasOwnProperty('radius2') ||
            props.hasOwnProperty('handleSize') ||
            props.hasOwnProperty('v') ||
            props.hasOwnProperty('updateCenter1') ||
            props.hasOwnProperty('updateCenter2')
        ) {
            this.prevProps = { ...this.prevProps, ...pick(props, KEYS) };
            const d = metaball(
                this.prevProps.radius1,
                this.prevProps.radius2,
                this.center1.values,
                this.center2.values,
                this.prevProps.handleSize,
                this.prevProps.v
            );
            props.d = d;
        }
        this._component && this._component.setNativeProps(props);
    };
    componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps);
        if (nextProps.center1 !== this.props.center1) {
            removeListeners(this.center1);
            this.center1 = listen(nextProps.center1, _ =>
                this.setNativeProps({ updateCenter1: true })
            );
        }
        if (nextProps.center2 !== this.props.center2) {
            removeListeners(this.center2);
            this.center2 = listen(nextProps.center2, _ =>
                this.setNativeProps({ updateCenter2: true })
            );
        }
    }
    componentWillUnmount() {
        removeListeners(this.center1);
        removeListeners(this.center2);
    }
    render() {
        const {
            radius1,
            radius2,
            center1,
            center2,
            handleSize,
            v,
            ...props
        } = this.props;
        const d = metaball(radius1, radius2, center1, center2, handleSize, v);
        return (
            <Path
                ref={component => (this._component = component)}
                {...props}
                d={d}
            />
        );
    }
}
AnimatedSvgMetaball = Animated.createAnimatedComponent(AnimatedSvgMetaball);
export default AnimatedSvgMetaball;

function metaball(
    radius1,
    radius2,
    center1,
    center2,
    handleSize = 2.4,
    v = 0.5
) {
    const HALF_PI = Math.PI / 2;
    const d = dist(center1, center2);
    const maxDist = radius1 + radius2 * 2.5;
    let u1, u2;

    if (
        radius1 === 0 ||
        radius2 === 0 ||
        d > maxDist ||
        d <= Math.abs(radius1 - radius2)
    ) {
        return '';
    }

    if (d < radius1 + radius2) {
        u1 = Math.acos(
            (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d)
        );
        u2 = Math.acos(
            (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d)
        );
    } else {
        u1 = 0;
        u2 = 0;
    }

    // All the angles
    const angleBetweenCenters = angle(center2, center1);
    const maxSpread = Math.acos((radius1 - radius2) / d);

    const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
    const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v;
    const angle3 =
        angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
    const angle4 =
        angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;
    // Points
    const p1 = getVector(center1, angle1, radius1);
    const p2 = getVector(center1, angle2, radius1);
    const p3 = getVector(center2, angle3, radius2);
    const p4 = getVector(center2, angle4, radius2);

    // Define handle length by the
    // distance between both ends of the curve
    const totalRadius = radius1 + radius2;
    const d2Base = Math.min(v * handleSize, dist(p1, p3) / totalRadius);

    // Take into account when circles are overlapping
    const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));

    const r1 = radius1 * d2;
    const r2 = radius2 * d2;

    const h1 = getVector(p1, angle1 - HALF_PI, r1);
    const h2 = getVector(p2, angle2 + HALF_PI, r1);
    const h3 = getVector(p3, angle3 + HALF_PI, r2);
    const h4 = getVector(p4, angle4 - HALF_PI, r2);

    return metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, d > radius1, radius2);
}

function metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, escaped, r) {
    return [
        'M',
        p1,
        'C',
        h1,
        h3,
        p3,
        'A',
        r,
        r,
        0,
        escaped ? 1 : 0,
        0,
        p4,
        'C',
        h4,
        h2,
        p2
    ].join(' ');
}

function dist([x1, y1], [x2, y2]) {
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
}

function angle([x1, y1], [x2, y2]) {
    return Math.atan2(y1 - y2, x1 - x2);
}

function getVector([cx, cy], a, r) {
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
