import { message } from 'antd';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
import { Group, Line, Layer, Stage, Circle } from 'react-konva';

import { checkLineCrossLines, checkPointInPoints, createCircle, createLine } from './util';

import type { GroupType, PolygonProps, CircleType, LineType } from './interface';

function Polygon({
  width,
  height,
  groupList,
  start,
  complete,
  setGroupList,
  setStart,
  onComplete,
}: PolygonProps) {
  // 合并数据过滤逻辑，减少重复遍历
  const { lineList, pointList } = useMemo(() => {
    const lines: LineType[] = [];
    const points: CircleType[] = [];

    // 遍历所有图案组，访问 elements 属性
    groupList.forEach((patternGroup) => {
      if (!patternGroup.completed) {
        patternGroup.elements.forEach((item) => {
          if (item.type === 'line') {
            lines.push(item as LineType);
          } else if (item.type === 'circle') {
            points.push(item as CircleType);
          }
        });
      }
    });

    return {
      lineList: lines,
      pointList: points,
    };
  }, [groupList]);

  // 使用 useCallback 优化 DrawPolygon 函数，更新 PatternGroup 的 elements
  const DrawPolygon = useCallback((elements: GroupType[], x: number, y: number) => {
    return elements.map((item, index) => {
      if (index === elements.length - 1 && item.type === 'line') {
        const line = item as LineType;
        // 不直接修改原对象，而是创建新对象
        return {
          ...line,
          points: [line.points[0], line.points[1], x, y],
        };
      }
      return item;
    });
  }, []);

  // 使用 useCallback 优化事件处理函数
  const MouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      // 结束就不需要绘制了
      if (complete) {
        return;
      }

      if (e.evt.button === 0) {
        setStart(true);
        const { offsetX, offsetY } = e.evt;
        if (checkPointInPoints(pointList, offsetX, offsetY)) {
          message.error('绘制点不能重合');
          return;
        }

        if (lineList.length > 2) {
          const currentLine = lineList[lineList.length - 1];
          const otherLines = lineList.filter((_item, index) => index < lineList.length - 2);
          if (checkLineCrossLines(otherLines, currentLine.points)) {
            message.error('线段不能跨越');
            return;
          }
        }

        const circle = createCircle(offsetX, offsetY);
        const line = createLine([offsetX, offsetY, offsetX, offsetY]);

        // 查找未完成的图案组，如果没有则创建新的
        const uncompletedPattern = groupList.find((p) => !p.completed);

        if (uncompletedPattern) {
          // 更新未完成的图案组，添加新的点和线
          const updatedGroupList = groupList.map((patternGroup) => {
            if (!patternGroup.completed) {
              return {
                ...patternGroup,
                elements: [...patternGroup.elements, circle, line],
              };
            }
            return patternGroup;
          });
          setGroupList(updatedGroupList);
        } else {
          // 创建新的 PatternGroup
          const newPattern = {
            id: `polygon-pattern-${Date.now()}`,
            completed: false,
            elements: [circle, line],
          };
          setGroupList([...groupList, newPattern]);
          console.log('groupList', groupList);
        }
      } else if (e.evt.button === 2) {
        if (pointList.length < 3) {
          message.error('绘制图案不少于3个点');
          return;
        }

        if (lineList.length > 3) {
          const currentLinePoints = [
            lineList[lineList.length - 1].points[0],
            lineList[lineList.length - 1].points[1],
            pointList[0].x,
            pointList[0].y,
          ];
          const otherLines = lineList.filter(
            (_item, index) => index < lineList.length - 2 && index > 0,
          );
          if (checkLineCrossLines(otherLines, currentLinePoints)) {
            message.error('线段不能跨越');
            return;
          }
        }

        // 标记未完成的图案为完成状态
        const updatedGroupList = groupList.map((patternGroup) => {
          if (!patternGroup.completed) {
            return {
              ...patternGroup,
              completed: true,
            };
          }
          return patternGroup;
        });

        setGroupList(updatedGroupList);
        console.log('结束绘制', updatedGroupList);
        setStart(false);
        message.success('绘制结束');

        // 将 PatternGroup[] 传给父组件
        onComplete && onComplete(updatedGroupList);
      }
    },
    [complete, setStart, pointList, lineList, setGroupList, groupList, onComplete],
  );

  const MouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (complete || !start) {
        return;
      }

      // 更新未完成的 PatternGroup 的 elements
      const newGroupList = groupList.map((patternGroup) => {
        if (!patternGroup.completed) {
          const updatedElements = DrawPolygon(patternGroup.elements, e.evt.offsetX, e.evt.offsetY);
          return {
            ...patternGroup,
            elements: updatedElements,
          };
        }
        return patternGroup;
      });
      setGroupList(newGroupList);
    },
    [complete, start, DrawPolygon, groupList, setGroupList],
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
          {groupList.map((patternGroup) => {
            if (patternGroup.completed) {
              // 已完成的图案：渲染封闭的多边形
              const points = patternGroup.elements
                .filter((item) => item.type === 'circle')
                .reduce((acc: number[], item) => {
                  const circle = item as CircleType;
                  return [...acc, circle.x, circle.y];
                }, []);

              return (
                <Line
                  key={`${patternGroup.id}-polygon`}
                  points={points}
                  stroke="rgba(255,0,0,0.5)"
                  fill="rgba(255,0,0,0.5)"
                  strokeWidth={2}
                  closed
                />
              );
            }
            // 未完成的图案：渲染点和线（绘制过程）
            return patternGroup.elements.map((item, itemIndex) => {
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
              return null;
            });
          })}
        </Group>
      </Layer>
    </Stage>
  );
}

export default Polygon;
