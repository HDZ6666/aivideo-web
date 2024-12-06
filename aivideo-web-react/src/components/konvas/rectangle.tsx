import { KonvaEventObject } from 'konva/lib/Node';
import { Rect, Layer, Stage } from 'react-konva';

import { RectangleProps, RectType } from './interface';
import { createRect, transformRectToCircle } from './util';

function Rectangle({
  width,
  height,
  groupList,
  start,
  complete,
  setGroupList,
  setStart,
  setComplete,
  onComplete,
}: RectangleProps) {
  const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // 结束就不需要绘制了
    if (complete) {
      return;
    }
    if (!start && e.evt.button === 0) {
      // console.log('开始绘制');
      setStart(true);
      const rect = createRect(e.evt.offsetX, e.evt.offsetY);
      setGroupList([...groupList, rect]);
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
    const groupListN = groupList.map((item) => {
      if (item.type === 'rect') {
        const rect = item as RectType;
        rect.width = Math.max(offsetX - rect.x, 10);
        rect.height = Math.max(offsetY - rect.y, 10);
      }
      return item;
    });

    setGroupList(groupListN);
  };

  const MouseUp = () => {
    if (complete) {
      return;
    }
    setStart(false);
    setComplete(true);
    const rect = groupList[0] as RectType;
    const completeList = transformRectToCircle(rect);
    onComplete && onComplete(completeList);
  };

  const Contextmenu = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    return false;
  };

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
        {groupList.map((item, index) => {
          const rect = item as RectType;
          return (
            <Rect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}

export default Rectangle;
