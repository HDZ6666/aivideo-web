import { message } from 'antd';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
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
  lineTextList,
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
  // 合并数据过滤逻辑，减少重复遍历，提高性能
  const { pointList, lineList, arrowList, textList } = useMemo(() => {
    const points: CircleType[] = [];
    const lines: LineType[] = [];
    const arrows: ArrowType[] = [];
    const texts: TextType[] = [];

    // 遍历所有图案组，访问 elements 属性
    groupList.forEach((patternGroup) => {
      patternGroup.elements.forEach((item) => {
        switch (item.type) {
          case 'circle':
            points.push(item as CircleType);
            break;
          case 'line':
            lines.push(item as LineType);
            break;
          case 'arrow':
            arrows.push(item as ArrowType);
            break;
          case 'text':
            texts.push(item as TextType);
            break;
          default:
            break;
        }
      });
    });

    return {
      pointList: points,
      lineList: lines,
      arrowList: arrows,
      textList: texts,
    };
  }, [groupList]);

  const MouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
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

        // 更新最后一个 PatternGroup，将 circle 添加到 elements 中，并标记为完成
        const updatedGroupList = groupList.map((patternGroup) => {
          if (!patternGroup.completed) {
            return {
              ...patternGroup,
              completed: true,
              elements: [...patternGroup.elements, circle],
            };
          }
          return patternGroup;
        });
        setGroupList(updatedGroupList);
        setComplete(true);
        message.success('绘制完成');
        // 将 PatternGroup[] 传给父组件
        onComplete && onComplete(updatedGroupList);
      } else {
        // 创建点
        const circle = createCircle(offsetX, offsetY);
        // 创建线
        const line = createLine([offsetX, offsetY, offsetX, offsetY]);
        // 创建箭头
        const arrows: ArrowType[] = lineTextList.map((_item) => {
          return createArrow([0, 0, 0, 0]);
        });
        // 创建字体
        const texts: TextType[] = lineTextList.map((item) => {
          return createText(0, 0, item);
        });
        // 创建新的 PatternGroup
        const newPattern = {
          id: `line-pattern-${Date.now()}`,
          completed: false,
          elements: [...arrows, ...texts, circle, line],
        };
        setGroupList([...groupList, newPattern]);
      }
    },
    [
      complete,
      setStart,
      pointList,
      lineList,
      setComplete,
      onComplete,
      setGroupList,
      groupList,
      lineTextList,
    ],
  );

  const MouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (complete || !start) {
        return;
      }

      const { offsetX, offsetY } = e.evt;

      // 修复不可变性问题：不直接修改原对象
      const lineListN = lineList.map((line) => ({
        ...line,
        points: [line.points[0], line.points[1], offsetX, offsetY],
      }));

      // 获取线段的中点
      const arrowPoints = getVerticalPoint(lineList[0].points, 50, 1 / 2);
      const textPoints = getVerticalPoint(lineList[0].points, 70, 1 / 2);

      const arrowListN = arrowList.map((arrow, index) => ({
        ...arrow,
        points: arrowPoints[index],
        visible: lineType === index + 1 || lineType === 0,
      }));

      const textListN = textList.map((text, index) => {
        const [, , x, y] = textPoints[index];
        return {
          ...text,
          x,
          y,
          visible: true,
        };
      });

      const updatedElements = [...pointList, ...lineListN, ...arrowListN, ...textListN];
      const newGroupList = groupList.map((patternGroup) => {
        if (!patternGroup.completed) {
          return {
            ...patternGroup,
            elements: updatedElements,
          };
        }
        return patternGroup;
      });
      setGroupList(newGroupList);
    },
    [complete, start, lineList, arrowList, textList, pointList, lineType, groupList, setGroupList],
  );

  const Contextmenu = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    return false;
  }, []);

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
          {groupList.map((patternGroup) =>
            patternGroup.elements.map((item, itemIndex) => {
              const key = `${patternGroup.id}-${itemIndex}`;
              if (item.type === 'circle') {
                const circle = item as CircleType;
                return (
                  <Circle
                    key={key}
                    id={`cicle_${key}`}
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
                    key={key}
                    id={`line_${key}`}
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
                    key={key}
                    id={`arrow_${key}`}
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
                    key={key}
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
            }),
          )}
        </Group>
      </Layer>
    </Stage>
  );
}

export default LineSegment;
