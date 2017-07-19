import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import * as d3 from 'd3-svg-annotation';
import { Svg } from 'expo';
import loremipsum from 'lorem-ipsum-react-native';

import Annotation from '../components/SvgD3Annotation';

const x = 50;
const y = 150;
const dx = 137;
const dy = 162;
const wrap = 150;
let i = 0;

const type = d3.annotationLabel;
const label = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationLabel'
    },
    x,
    y,
    dy,
    dx
};
const callout = {
    type: d3.annotationCallout,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationCallout',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const calloutElbow = {
    type: d3.annotationCalloutElbow,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationCalloutElbow',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const calloutCurve = {
    type: d3.annotationCalloutCurve,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationCalloutCurve',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const calloutCircle = {
    type: d3.annotationCalloutCircle,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationCalloutCircle',
        wrap
    },
    subject: {
        radius: 50
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const calloutRect = {
    type: d3.annotationCalloutRect,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationCalloutRect',
        wrap
    },
    subject: {
        width: -50,
        height: 100
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const xyThreshold = {
    type: d3.annotationXYThreshold,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationXYThreshold',
        wrap
    },
    subject: {
        x1: 0,
        x2: 500
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const badge = {
    type: d3.annotationBadge,
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'd3.annotationBadge',
        wrap
    },
    subject: {
        text: 'A',
        radius: 14
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const arrow = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'arrow',
        wrap,
        align: 'left'
    },
    connector: {
        end: 'arrow'
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const dot = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'dot+curve',
        wrap
    },
    connector: {
        end: 'dot',
        type: 'curve',
        points: [[100, 14], [190, 52]]
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const horizontalMiddle = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'horizontal+middle',
        lineType: 'horizontal',
        align: 'middle',
        orientation: 'leftRight',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const horizontalLeft = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'horizontal+left',
        lineType: 'horizontal',
        align: 'left',
        orientation: 'leftRight',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const horizontalRight = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'horizontal+right',
        lineType: 'horizontal',
        align: 'right',
        orientation: 'leftRight',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const verticalMiddle = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'vertical+middle',
        lineType: 'vertical',
        align: 'middle',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const verticalTop = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'vertical+top',
        lineType: 'vertical',
        align: 'top',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const verticalBottom = {
    note: {
        label: loremipsum({ count: 5, units: 'words' }),
        title: 'vertical+bottom',
        lineType: 'vertical',
        align: 'bottom',
        wrap
    },
    x,
    y: y + dy * ++i,
    dy,
    dx
};
const annotations = [
    label,
    callout,
    calloutElbow,
    calloutCurve,
    calloutCircle,
    calloutRect,
    xyThreshold,
    badge,
    arrow,
    dot,
    horizontalMiddle,
    horizontalLeft,
    horizontalRight,
    verticalMiddle,
    verticalTop,
    verticalBottom
];
const annotationColor = 'red';

export default class SvgD3AnnotationExample extends Component {
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <ScrollView>
                <Svg width={width} height={5000}>
                    <Annotation
                        type={type}
                        annotations={annotations}
                        annotationColor={annotationColor}
                    />
                </Svg>
            </ScrollView>
        );
    }
}
