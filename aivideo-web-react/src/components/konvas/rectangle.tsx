import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback } from 'react';
import { Rect, Layer, Stage } from 'react-konva';

import { RectangleProps, RectType } from './interface';
import { createRect } from './util';

function Rectangle({
  width,
  height,
  groupList,
  start,
  complete,
  setGroupList,
  setStart,
  onComplete,
}: RectangleProps) {
  const MouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      // 结束就不需要绘制了
      if (complete) {
        return;
      }
      if (!start && e.evt.button === 0) {
        // console.log('开始绘制');
        setStart(true);
        const rect = createRect(e.evt.offsetX, e.evt.offsetY);
        // 创建新的 PatternGroup
        const newPattern = {
          id: `rect-pattern-${Date.now()}`,
          completed: false,
          elements: [rect],
        };
        setGroupList([...groupList, newPattern]);
      }
    },
    [complete, start, groupList, setStart, setGroupList],
  );

  const MouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (complete || !start) {
        return;
      }

      const { offsetX, offsetY } = e.evt;
      // 更新未完成的 PatternGroup 中的矩形
      const groupListN = groupList.map((patternGroup) => {
        if (!patternGroup.completed) {
          // 更新图案中的矩形元素
          const updatedElements = patternGroup.elements.map((item) => {
            if (item.type === 'rect') {
              const rect = item as RectType;
              return {
                ...rect,
                width: Math.max(offsetX - rect.x, 10),
                height: Math.max(offsetY - rect.y, 10),
              };
            }
            return item;
          });
          return {
            ...patternGroup,
            elements: updatedElements,
          };
        }
        return patternGroup;
      });

      setGroupList(groupListN);
    },
    [complete, start, groupList, setGroupList],
  );

  const MouseUp = useCallback(() => {
    if (complete) {
      return;
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
    setStart(false);

    // 将 PatternGroup[] 传给父组件
    onComplete && onComplete(updatedGroupList);
  }, [complete, groupList, setStart, setGroupList, onComplete]);

  const Contextmenu = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    return false;
  }, []);

  return (
    <Stage
      onMouseUp={MouseUp}
      onMouseMove={MouseMove}
      onMouseDown={MouseDown}
      onContextmenu={Contextmenu}
      width={width}
      height={height}
    >
      <Layer>
        {groupList.map((patternGroup) =>
          patternGroup.elements.map((item, itemIndex) => {
            if (item.type === 'rect') {
              const rect = item as RectType;
              return (
                <Rect
                  key={`${patternGroup.id}-${itemIndex}`}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.fill}
                />
              );
            }
            return null;
          }),
        )}
      </Layer>
    </Stage>
  );
}

export default Rectangle;
