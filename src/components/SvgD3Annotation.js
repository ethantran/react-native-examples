// @flow
/**
 * TODO: handles
 */
import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-svg-annotation';
import * as d3Shape from 'd3-shape';

import noteAlignment, {
    leftRightDynamic,
    topBottomDynamic
} from '../noteAlignment';
import Annotation from '../Annotation';
import AnnotationCollection from '../AnnotationCollection';
import {
    getLines,
    approximateTextWidth,
    approximateCharWidth
} from './SvgTextWrap';

const { G, Path, Text, TSpan, Rect } = Svg;

const a = {
    select: () => {}
};

// crude adjustment to text length estimate
const adjust = (width, c) => width - width / 3;

const Note = ({
    note,
    type,
    notePadding,
    offset,
    fontSize,
    annotationColor,
    renderTitle,
    renderLabel,
    bgProps,
    noteContentProps = {},
    noteLineProps = {},
    ...props
}) => {
    const titleLines = getLines(
        {
            text: note.title,
            width: note.wrap
        },
        { fontSize, adjust }
    );
    const labelLines = getLines(
        {
            text: note.label,
            width: note.wrap
        },
        { fontSize, adjust }
    );

    // have to do this rough calculation since there is no way to get bbox
    const bbox = {
        x: 0,
        y: 0,
        width: note.wrap,
        height: (titleLines.length + labelLines.length) * fontSize
    };
    return (
        <G id="note" translateX={offset.x} translateY={offset.y} {...props}>
            <NoteContent
                note={note}
                type={type}
                notePadding={notePadding}
                offset={offset}
                bbox={bbox}
                fontSize={fontSize}
                annotationColor={annotationColor}
                renderTitle={renderTitle}
                renderLabel={renderLabel}
                titleLines={titleLines}
                labelLines={labelLines}
                bgProps={bgProps}
                {...noteContentProps}
            />
            <NoteLine
                note={note}
                type={type}
                offset={offset}
                bbox={bbox}
                annotationColor={annotationColor}
                {...noteLineProps}
            />
        </G>
    );
};

const NoteContent = ({
    note,
    type,
    notePadding,
    offset,
    bbox,
    fontSize,
    annotationColor,
    renderTitle,
    renderLabel,
    titleLines,
    labelLines,
    bgProps = {},
    ...props
}) => {
    const noteData = note;
    const typeSettings = type.typeSettings.note;
    const padding =
        noteData.padding !== undefined ? noteData.padding : notePadding;
    let orientation =
        noteData.orientation || typeSettings.orientation || 'topBottom';
    const lineType = noteData.lineType || typeSettings.lineType;
    const align = noteData.align || typeSettings.align || 'dynamic';

    if (lineType === 'vertical') {
        orientation = 'leftRight';
    } else if (lineType === 'horizontal') {
        orientation = 'topBottom';
    }

    const noteParams = {
        padding,
        bbox,
        offset,
        orientation,
        align
    };
    const { x: translateX, y: translateY } = noteAlignment(noteParams);
    // const offsetCornerX = x + annotation.dx;
    // const offsetCornerY = y + annotation.dy;

    return (
        <G translateX={translateX} translateY={translateY} {...props}>
            <Rect
                width={bbox.width}
                height={bbox.height}
                fill="none"
                {...bgProps}
            />
            <Text fontSize={fontSize} fill={annotationColor}>
                {titleLines.map(renderTitle)}
                {labelLines.map(renderLabel)}
            </Text>
        </G>
    );
};

const NoteLine = ({ note, type, offset, bbox, annotationColor, ...props }) => {
    const noteData = note;
    const typeSettings = type.typeSettings.note;
    const align = noteData.align || typeSettings.align || 'dynamic';
    const noteParams = {
        bbox,
        align,
        offset
    };
    const lineType = noteData.lineType || typeSettings.lineType;
    if (lineType === 'vertical') {
        return (
            <NoteLineVertical
                {...noteParams}
                bbox={bbox}
                fill="none"
                stroke={annotationColor}
                {...props}
            />
        );
    } else if (lineType === 'horizontal') {
        return (
            <NoteLineHorizontal
                {...noteParams}
                fill="none"
                stroke={annotationColor}
                {...props}
            />
        );
    }
    return null;
};

const NoteLineVertical = ({ align, x = 0, y = 0, bbox, offset, ...props }) => {
    align = leftRightDynamic(align, offset.y);

    if (align === 'top') {
        y -= bbox.height;
    } else if (align === 'middle') {
        y -= bbox.height / 2;
    }

    const data = [[x, y], [x, y + bbox.height]];
    return <Path d={createLine({ data })} {...props} />;
};

const NoteLineHorizontal = ({
    align,
    x = 0,
    y = 0,
    offset,
    bbox,
    ...props
}) => {
    align = topBottomDynamic(align, offset.x);

    if (align === 'right') {
        x -= bbox.width;
    } else if (align === 'middle') {
        x -= bbox.width / 2;
    }

    const data = [[x, y], [x + bbox.width, y]];
    return <Path d={createLine({ data })} {...props} />;
};

function createLine({ data, curve = d3Shape.curveLinear }): string {
    return d3Shape.line().curve(curve)(data);
}

function createArc(data): string {
    return d3Shape
        .arc()
        .innerRadius(data.innerRadius || 0)
        .outerRadius(data.outerRadius || data.radius || 2)
        .startAngle(data.startAngle || 0)
        .endAngle(data.endAngle || 2 * Math.PI)();
}

function createLineData({ type, subjectType }) {
    let annotation = type.annotation;
    let offset = annotation.position;

    let x1 = annotation.x - offset.x,
        x2 = x1 + annotation.dx,
        y1 = annotation.y - offset.y,
        y2 = y1 + annotation.dy;

    const subjectData = annotation.subject;

    if (
        subjectType === 'circle' &&
        (subjectData.outerRadius || subjectData.radius)
    ) {
        const h = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        const angle = Math.asin(-y2 / h);
        const r =
            subjectData.outerRadius ||
            subjectData.radius + (subjectData.radiusPadding || 0);

        x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
        y1 = Math.abs(Math.sin(angle) * r) * (y2 < 0 ? -1 : 1);
    }

    if (subjectType === 'rect') {
        const { width, height } = subjectData;

        if (
            (width > 0 && annotation.dx > 0) ||
            (width < 0 && annotation.dx < 0)
        ) {
            if (Math.abs(width) > Math.abs(annotation.dx)) {
                x1 = width / 2;
            } else {
                x1 = width;
            }
        }
        if (
            (height > 0 && annotation.dy > 0) ||
            (height < 0 && annotation.dy < 0)
        ) {
            if (Math.abs(height) > Math.abs(annotation.dy)) {
                y1 = height / 2;
            } else {
                y1 = height;
            }
        }
        if (x1 === width / 2 && y1 === height / 2) {
            x1 = x2;
            y1 = y2;
        }
    }

    return [[x1, y1], [x2, y2]];
}

function createPoints(offset, anchors = 2) {
    const diff = { x: offset.x / (anchors + 1), y: offset.y / (anchors + 1) };
    const p = [];

    let i = 1;
    for (; i <= anchors; i++) {
        p.push([diff.x * i + i % 2 * 20, diff.y * i - i % 2 * 20]);
    }
    return p;
}

function createCurveData({ type, connectorData, subjectType }) {
    if (!connectorData) {
        connectorData = {};
    }
    if (!connectorData.points || typeof connectorData.points === 'number') {
        connectorData.points = createPoints(
            type.annotation.offset,
            connectorData.points
        );
    }
    if (!connectorData.curve) {
        connectorData.curve = d3Shape.curveCatmullRom;
    }
    let data = createLineData({ type, subjectType });
    data = [data[0], ...connectorData.points, data[1]];
    return data;
}

function createCurve({ data, connectorData }): string {
    return createLine({ data, curve: connectorData.curve });
}

function createElbowData({ type, subjectType }) {
    const annotation = type.annotation;
    const offset = annotation.position;

    let x1 = annotation.x - offset.x,
        x2 = x1 + annotation.dx,
        y1 = annotation.y - offset.y,
        y2 = y1 + annotation.dy;

    const subjectData = annotation.subject;

    if (subjectType === 'rect') {
        const { width, height } = subjectData;

        if (
            (width > 0 && annotation.dx > 0) ||
            (width < 0 && annotation.dx < 0)
        ) {
            if (Math.abs(width) > Math.abs(annotation.dx)) {
                x1 = width / 2;
            } else {
                x1 = width;
            }
        }
        if (
            (height > 0 && annotation.dy > 0) ||
            (height < 0 && annotation.dy < 0)
        ) {
            if (Math.abs(height) > Math.abs(annotation.dy)) {
                y1 = height / 2;
            } else {
                y1 = height;
            }
        }
        if (x1 === width / 2 && y1 === height / 2) {
            x1 = x2;
            y1 = y2;
        }
    }

    let data = [[x1, y1], [x2, y2]];

    let diffY = y2 - y1;
    let diffX = x2 - x1;
    let xe = x2;
    let ye = y2;
    let opposite = (y2 < y1 && x2 > x1) || (x2 < x1 && y2 > y1) ? -1 : 1;

    if (Math.abs(diffX) < Math.abs(diffY)) {
        xe = x2;
        ye = y1 + diffX * opposite;
    } else {
        ye = y2;
        xe = x1 + diffY * opposite;
    }

    if (
        subjectType === 'circle' &&
        (subjectData.outerRadius || subjectData.radius)
    ) {
        const r =
            (subjectData.outerRadius || subjectData.radius) +
            (subjectData.radiusPadding || 0);
        const length = r / Math.sqrt(2);

        if (Math.abs(diffX) > length && Math.abs(diffY) > length) {
            x1 = length * (x2 < 0 ? -1 : 1);
            y1 = length * (y2 < 0 ? -1 : 1);
            data = [[x1, y1], [xe, ye], [x2, y2]];
        } else if (Math.abs(diffX) > Math.abs(diffY)) {
            const angle = Math.asin(-y2 / r);
            x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
            data = [[x1, y2], [x2, y2]];
        } else {
            const angle = Math.acos(x2 / r);
            y1 = Math.abs(Math.sin(angle) * r) * (y2 < 0 ? -1 : 1);
            data = [[x2, y1], [x2, y2]];
        }
    } else {
        data = [[x1, y1], [xe, ye], [x2, y2]];
    }
    return data;
}

function createArrowData({ annotation, start, end }) {
    const offset = annotation.position;
    if (!start) {
        start = [annotation.dx, annotation.dy];
    } else {
        start = [-end[0] + start[0], -end[1] + start[1]];
    }
    if (!end) {
        end = [annotation.x - offset.x, annotation.y - offset.y];
    }

    let x1 = end[0],
        y1 = end[1];

    let dx = start[0];
    let dy = start[1];

    let size = 10;
    let angleOffset = 16 / 180 * Math.PI;
    let angle = Math.atan(dy / dx);

    if (dx < 0) {
        angle += Math.PI;
    }

    const data = [
        [x1, y1],
        [
            Math.cos(angle + angleOffset) * size + x1,
            Math.sin(angle + angleOffset) * size + y1
        ],
        [
            Math.cos(angle - angleOffset) * size + x1,
            Math.sin(angle - angleOffset) * size + y1
        ],
        [x1, y1]
    ];

    return data;
}

function createArrow({ data }): string {
    return createLine({ data });
}

const Arrow = ({ annotationColor, annotation, start, end, ...props }) => {
    const data = createArrowData({ annotation, start, end });
    return (
        <Path
            d={createArrow({ data })}
            fill={annotationColor}
            stroke={annotationColor}
            {...props}
        />
    );
};

function createDot({ dotRadius }): string {
    const data = { radius: dotRadius };
    return createArc(data);
}

const Dot = ({ data, annotationColor, dotRadius, ...props }) => {
    return (
        <Path
            d={createDot({ dotRadius })}
            translateX={data[0][0]}
            translateY={data[0][1]}
            fill={annotationColor}
            stroke={annotationColor}
            {...props}
        />
    );
};

type Props = {
    fontSize: number,
    annotationColor: string,
    dotRadius: number,
    connectorProps: Object,
    subjectProps: Object,
    noteProps: Object,
    noteContentProps: Object,
    noteLineProps: Object
};

const defaultProps = {
    fontSize: 12,
    annotationColor: 'black',
    dotRadius: 5,
    connectorProps: {},
    subjectProps: {},
    noteProps: {},
    noteContentProps: {},
    noteLineProps: {}
};

export const args = ['type', 'annotations'];

type AnnotationGen = typeof d3.annotation;

function createGenerator(props, generator?: AnnotationGen): AnnotationGen {
    generator = generator || d3.annotation();
    return args.reduce((acc: AnnotationGen, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

const Connector = ({ annotation, annotationColor, ...props }) => {
    const { connector: connectorData, type } = annotation;
    const typeSettings = type.typeSettings;
    const connectorType = connectorData.type || typeSettings.connector.type;
    const connectorParams = { type, connectorData };
    const endType = connectorData.end || typeSettings.connector.end;
    let data;
    let connectorElement;

    connectorParams.subjectType = typeSettings.subject.type;

    if (connectorType === 'curve') {
        data = createCurveData(connectorParams);
        connectorElement = (
            <Path
                d={createCurve({
                    data,
                    connectorData: connectorParams.connectorData
                })}
                fill="none"
                stroke={annotationColor}
                {...props}
            />
        );
    } else if (connectorType === 'elbow') {
        data = createElbowData(connectorParams);
        connectorElement = (
            <Path
                d={createLine({ data })}
                fill="none"
                stroke={annotationColor}
                {...props}
            />
        );
    } else {
        data = createLineData(connectorParams);
        connectorElement = (
            <Path
                d={createLine({ data })}
                fill="none"
                stroke={annotationColor}
                {...props}
            />
        );
    }

    return (
        <G>
            {connectorElement}
            <ConnectorEnd
                type={endType}
                data={data}
                annotation={annotation}
                annotationColor={annotationColor}
                {...props}
            />
        </G>
    );
};

const ConnectorEnd = ({ type, data, annotation, ...props }) => {
    if (type === 'arrow') {
        let start = data[1];
        let end = data[0];
        const distance = Math.sqrt(
            Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2)
        );
        if (distance < 5 && data[2]) {
            start = data[2];
        }
        return (
            <Arrow {...props} annotation={annotation} start={start} end={end} />
        );
    } else if (type === 'dot') {
        return <Dot {...props} data={data} />;
    }
    return null;
};

const Subject = ({ type, subject, annotationColor, ...props }) => {
    const subjectData = subject;
    const typeSettings = type.typeSettings.subject;
    const subjectType = typeSettings.type;
    const subjectParams = { type, subjectData };
    if (subjectType === 'circle') {
        return (
            <SubjectCircle
                {...subjectParams}
                annotationColor={annotationColor}
                {...props}
            />
        );
    } else if (subjectType === 'rect') {
        return (
            <SubjectRect
                {...subjectParams}
                annotationColor={annotationColor}
                {...props}
            />
        );
    } else if (subjectType === 'threshold') {
        return (
            <SubjectThreshold
                {...subjectParams}
                annotationColor={annotationColor}
                {...props}
            />
        );
    } else if (subjectType === 'badge') {
        return (
            <SubjectBadge
                {...subjectParams}
                annotationColor={annotationColor}
                {...props}
            />
        );
    }
    return null;
};

const SubjectCircle = ({ subjectData, type, annotationColor, ...props }) => {
    if (!subjectData.radius && !subjectData.outerRadius) {
        subjectData.radius = 20;
    }
    return (
        <Path
            d={createArc(subjectData)}
            fill="none"
            stroke={annotationColor}
            {...props}
        />
    );
};

const SubjectRect = ({ subjectData, type, annotationColor, ...props }) => {
    if (!subjectData.width) {
        subjectData.width = 100;
    }
    if (!subjectData.height) {
        subjectData.height = 100;
    }
    let { width, height } = subjectData;
    const data = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]];
    return (
        <Path
            d={createLine({ data })}
            fill="none"
            stroke={annotationColor}
            {...props}
        />
    );
};

const SubjectThreshold = ({ subjectData, type, annotationColor, ...props }) => {
    const offset = type.annotation.position;
    let x1 =
            (subjectData.x1 !== undefined ? subjectData.x1 : offset.x) -
            offset.x,
        x2 =
            (subjectData.x2 !== undefined ? subjectData.x2 : offset.x) -
            offset.x,
        y1 =
            (subjectData.y1 !== undefined ? subjectData.y1 : offset.y) -
            offset.y,
        y2 =
            (subjectData.y2 !== undefined ? subjectData.y2 : offset.y) -
            offset.y;
    const data = [[x1, y1], [x2, y2]];
    return (
        <Path
            d={createLine({ data })}
            fill="none"
            stroke={annotationColor}
            {...props}
        />
    );
};

const SubjectBadge = ({
    subjectData,
    type,
    annotationColor,
    strokeWidth = 3,
    fontSize = 12
}) => {
    const typeSettings = type.typeSettings.subject;

    if (!subjectData.radius) {
        if (typeSettings.radius) {
            subjectData.radius = typeSettings.radius;
        } else {
            subjectData.radius = 14;
        }
    }
    if (!subjectData.x) {
        if (typeSettings.x) {
            subjectData.x = typeSettings.x;
        } else {
            subjectData.x = 'left';
        }
    }
    if (!subjectData.y) {
        if (typeSettings.y) {
            subjectData.y = typeSettings.y;
        } else {
            subjectData.y = 'top';
        }
    }

    const radius = subjectData.radius;
    const innerRadius = radius * 0.7;
    const x = subjectData.x === 'left' ? -radius : radius;
    const y = subjectData.y === 'top' ? -radius : radius;
    return (
        <G>
            <Path
                d={createLine({
                    data: [[0, 0], [x, 0], [0, y], [0, 0]]
                })}
                fill={annotationColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <Path
                d={createArc({ radius })}
                translateX={x}
                translateY={y}
                fill={annotationColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <Path
                d={createArc({ outerRadius: radius, innerRadius })}
                translateX={x}
                translateY={y}
                fill="white"
                strokeWidth={strokeWidth}
                stroke={annotationColor}
            />
            {!!subjectData.text &&
                <Text
                    textAnchor="middle"
                    x={x}
                    y={y - fontSize / 1.5}
                    fill="white"
                    fontSize={fontSize}
                >
                    {subjectData.text}
                </Text>}
        </G>
    );
};

class SvgD3Annotation extends Component {
    props: Props;
    generator: AnnotationGen;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
    }
    renderAnnotation = (annotation, i) => {
        const {
            annotationColor,
            fontSize,
            dotRadius,
            connectorProps,
            subjectProps,
            noteProps,
            noteContentProps,
            noteLineProps
        } = this.props;
        const { position, type, subject, note, offset } = annotation;
        return (
            <G key={i} translateX={position.x} translateY={position.y}>
                <Connector
                    annotation={annotation}
                    annotationColor={annotationColor}
                    dotRadius={dotRadius}
                    fontSize={fontSize}
                    {...connectorProps}
                />
                <Subject
                    subject={subject}
                    type={type}
                    annotationColor={annotationColor}
                    {...subjectProps}
                />
                <Note
                    note={note}
                    type={type}
                    offset={offset}
                    fontSize={fontSize}
                    annotationColor={annotationColor}
                    renderTitle={this.renderTitle}
                    renderLabel={this.renderLabel}
                    noteContentProps={noteContentProps}
                    noteLineProps={noteLineProps}
                    {...noteProps}
                />
            </G>
        );
    };
    renderTitle = (title, i) => {
        return (
            <TSpan
                key={'title' + i}
                x={0}
                dy={i === 0 ? 0 : this.props.fontSize}
                fontWeight="bold"
            >
                {title}
            </TSpan>
        );
    };
    renderLabel = (line, i) => {
        return (
            <TSpan key={'label' + i} x={0} dy={this.props.fontSize}>
                {line}
            </TSpan>
        );
    };
    render() {
        const textWrap = this.generator.textWrap();
        const notePadding = this.generator.notePadding();
        const type = this.generator.type();
        const annotations = this.generator.annotations();
        const ids = this.generator.ids();
        const disable = this.generator.disable() || [];
        const accessors = this.generator.accessors() || {};
        const accessorsInverse = this.generator.accessorsInverse() || {};
        const editMode = this.generator.editMode() || false;
        const translatedAnnotations = annotations.map(annotation => {
            if (!annotation.type) {
                annotation.type = type;
            }
            if (!annotation.disable) {
                annotation.disable = disable;
            }
            return new Annotation(annotation);
        });
        const collection =
            this.generator.collection() ||
            new AnnotationCollection({
                annotations: translatedAnnotations,
                accessors,
                accessorsInverse,
                ids
            });
        collection.annotations.forEach(annotation => {
            annotation.type =
                annotation.type.toString() === '[object Object]'
                    ? annotation.type
                    : new annotation.type({
                          a,
                          annotation,
                          textWrap,
                          notePadding,
                          editMode,
                          accessors
                      });
            annotation.type.typeSettings.connector = {
                ...annotation.type.typeSettings.connector
            };
            annotation.type.typeSettings.note = {
                ...annotation.type.typeSettings.note
            };
            annotation.type.typeSettings.subject = {
                ...annotation.type.typeSettings.subject
            };
        });
        return (
            <G>
                {collection.annotations.map(this.renderAnnotation)}
            </G>
        );
    }
}
SvgD3Annotation.defaultProps = defaultProps;
export default SvgD3Annotation;
