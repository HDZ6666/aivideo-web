import { message } from 'antd';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo } from 'react';
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
  setComplete,
  onComplete,
}: PolygonProps) {
  const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
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

      setGroupList([...groupList, circle, line]);
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
      // console.log('结束绘制');
      // const groupListN = DrawPolygon(groupList, pointList[0].x, pointList[0].y);
      // setGroupList(groupListN);
      setStart(false);
      setComplete(true);
      message.success('绘制结束');
      onComplete && onComplete(pointList);
    }
  };

  const MouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (complete) {
      return;
    }
    if (!start) {
      return;
    }

    const groupListN = DrawPolygon(groupList, e.evt.offsetX, e.evt.offsetY);
    setGroupList(groupListN);
  };

  const DrawPolygon = (groupList: GroupType[], x: number, y: number) => {
    return groupList.map((item, index) => {
      if (index === groupList.length - 1 && item.type === 'line') {
        const line = item as LineType;
        line.points = [line.points[0], line.points[1], x, y];
      }
      return item;
    });
  };

  const lineList = useMemo(() => {
    return groupList.filter((item) => item.type === 'line') as LineType[];
  }, [groupList]);

  const pointList = useMemo(() => {
    return groupList.filter((item) => item.type === 'circle') as CircleType[];
  }, [groupList]);

  const competePoints = useMemo(() => {
    return pointList.reduce((acc: number[], cur: CircleType) => {
      return [...acc, cur.x, cur.y];
    }, []);
  }, [pointList]);

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
          {complete ? (
            <Line
              points={competePoints}
              stroke="rgba(255,0,0,0.5)"
              fill="rgba(255,0,0,0.5)"
              strokeWidth={2}
              closed
            />
          ) : (
            groupList.map((item, index) => {
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
              return null;
            })
          )}
        </Group>
      </Layer>
    </Stage>
  );
}

export default Polygon;
