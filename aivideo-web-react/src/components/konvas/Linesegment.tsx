import { message } from 'antd';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo } from 'react';
import { Group, Line, Layer, Stage, Circle, Arrow, Text } from 'react-konva';

import {
  checkPointInPoints,
  createArrow,
  createCircle,
  createLine,
  createText,
  getDistance,
  getVerticalPoint,
} from './util';

import type { ArrowType, CircleType, LineProps, LineType, TextType } from './interface';

function LineSegment({
  lineType,
  width,
  height,
  groupList,
  start,
  complete,
  setGroupList,
  setStart,
  setComplete,
  onComplete,
}: LineProps) {
  const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // 结束就不需要绘制了
    if (complete) {
      return;
    }
    setStart(true);
    const { offsetX, offsetY } = e.evt;
    if (checkPointInPoints(pointList, offsetX, offsetY)) {
      message.error('绘制点不能重合');
      return;
    }
    if (lineList.length > 0) {
      const distance = getDistance(lineList[0].points);
      if (distance < 50) {
        message.error('距离不能少于50');
        return;
      }

      const circle = createCircle(offsetX, offsetY);
      setComplete(true);
      message.success('绘制完成');
      onComplete && onComplete([...pointList, circle]);
      setGroupList([...groupList, circle]);
    } else {
      // 创建点
      const circle = createCircle(offsetX, offsetY);
      // 创建线
      const line = createLine([offsetX, offsetY, offsetX, offsetY]);
      // 创建箭头
      const arrows: ArrowType[] = ['A', 'B'].map((_item) => {
        return createArrow([0, 0, 0, 0]);
      });
      // 创建字体
      const texts: TextType[] = ['A', 'B'].map((item) => {
        return createText(0, 0, item);
      });
      setGroupList([...groupList, ...arrows, ...texts, circle, line]);
    }
  };

  const MouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (complete) {
      return;
    }
    if (!start) {
      return;
    }

    const { offsetX, offsetY } = e.evt;

    const lineListN = lineList.map((line) => {
      line.points = [line.points[0], line.points[1], offsetX, offsetY];
      return line;
    });

    // 获取线段的中点
    const arrowPoints = getVerticalPoint(lineList[0].points, 50, 1 / 2); // 返回垂直平分线上的距离中点50px的两个点 [中点X,中点Y,顶端X,顶端Y]
    const textPoints = getVerticalPoint(lineList[0].points, 70, 1 / 2); // 返回垂直平分线上的距离中点70px的两个点 [中点X,中点Y,顶端X,顶端Y]

    const arrowListN = arrowList.map((arrow, index) => {
      arrow.points = arrowPoints[index];
      arrow.visible = lineType === index + 1 || lineType === 0;
      return arrow;
    });

    const textListN = textList.map((text, index) => {
      const [, , x, y] = textPoints[index];
      text.x = x;
      text.y = y;
      text.visible = true;
      return text;
    });

    setGroupList([...pointList, ...lineListN, ...arrowListN, ...textListN]);
  };

  const pointList = useMemo(() => {
    return groupList.filter((item) => item.type === 'circle') as CircleType[];
  }, [groupList]);

  const lineList = useMemo(() => {
    return groupList.filter((item) => item.type === 'line') as LineType[];
  }, [groupList]);

  const arrowList = useMemo(() => {
    return groupList.filter((item) => item.type === 'arrow') as ArrowType[];
  }, [groupList]);

  const textList = useMemo(() => {
    return groupList.filter((item) => item.type === 'text') as TextType[];
  }, [groupList]);

  const Contextmenu = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    return false;
  };

  return (
    <Stage
      onMouseMove={MouseMove}
      onMouseDown={MouseDown}
      onContextmenu={Contextmenu}
      width={width}
      height={height}
    >
      <Layer>
        <Group>
          {groupList.map((item, index) => {
            if (item.type === 'circle') {
              const circle = item as CircleType;
              return (
                <Circle
                  key={index}
                  id={`cicle_${index}`}
                  x={circle.x}
                  y={circle.y}
                  radius={circle.radius}
                  fill={circle.fill}
                />
              );
            }
            if (item.type === 'line') {
              const line = item as LineType;
              return (
                <Line
                  key={index}
                  id={`line_${index}`}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                />
              );
            }

            if (item.type === 'arrow') {
              const arrow = item as ArrowType;
              return (
                <Arrow
                  key={index}
                  id={`arrow_${index}`}
                  fill={arrow.fill}
                  points={arrow.points}
                  stroke={arrow.stroke}
                  strokeWidth={arrow.strokeWidth}
                  pointerLength={20}
                  pointerWidth={20}
                  visible={arrow.visible}
                />
              );
            }

            if (item.type === 'text') {
              const text = item as TextType;
              return (
                <Text
                  key={index}
                  text={text.text}
                  fontSize={20}
                  fontStyle="bold"
                  fill={text.fill}
                  x={text.x}
                  y={text.y}
                  visible={text.visible}
                  width={20}
                  height={20}
                  offset={{
                    x: 10,
                    y: 10,
                  }}
                />
              );
            }
            return null;
          })}
        </Group>
      </Layer>
    </Stage>
  );
}

export default LineSegment;
