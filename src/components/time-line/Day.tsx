import { isEmpty, clone } from 'ramda';
import { useRef } from 'react';

import Action from './Action';
import { IDay, ITimeline } from './interface';
import Track from './Track';
import { coordinateToTime, pointInSection } from './util';

interface IProps {
  week: IDay[];
  dayIndex: number;
  setWeek: (week: IDay[]) => void;
  onComplete?: (week: IDay[]) => void;
}

function Day({ week, dayIndex, setWeek, onComplete }: IProps) {
  const day = week[dayIndex];
  const timeSliders: ITimeline[] = day.timelines;
  const SliderRef = useRef<HTMLDivElement>(null);
  let startX = 0; // 某个时间段的开始位置（相对时间轴）
  let startPosition = 0; // 某个时间段的开始位置（相对页面）
  const trackIndex: number = timeSliders.length;

  // 按下鼠标左键
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { id } = e.target as HTMLDivElement;
    if (id !== `slider${dayIndex}`) return;
    // 判断鼠标的左键点击
    if (e.button !== 0) {
      return;
    }
    e.stopPropagation(); // 阻止冒泡
    e.preventDefault(); // 阻止默认事件
    const { left } = SliderRef.current!.getBoundingClientRect(); // 获取时间轴距离视图左边的距离
    const { pageX } = e; // 获取当前鼠标点击位置距离视图左边的距离
    startX = Math.floor(pageX - left) >= 0 ? Math.floor(pageX - left) : 0; // 时间条距离边框的宽度
    startPosition = pageX; // 鼠标左键按下位置
    // 当点在某个时间段内
    if (pointInSection(timeSliders, startX)) {
      // 拖拽事件，交给子元素自行处理
      return;
    }
    document.addEventListener('mousemove', onMouseMove); // 全局注册mousemove事件
    document.addEventListener('mouseup', onMouseUp); // 全局注册mouseup事件
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    // if (coincide) return; // 鼠标按下位置已有画线
    const length: number = e.pageX - startPosition; // 实时计算长度

    let endX = startX + length; // 鼠标结束位置
    // 反方向操作
    if (length <= 0) {
      return;
    }

    // 先筛选在当前位置的时间点之后最近的一个时间段
    const list = day.timelines
      .filter((item) => startX < item.startX && endX > item.startX)
      .sort((a, b) => a.startX - b.startX);
    if (!isEmpty(list)) {
      endX = list[0].startX - 1; // 上一个时间段开始 -1
    }

    // 当画线超过 slider 总长度时
    if (endX >= SliderRef.current!.clientWidth) {
      endX = SliderRef.current!.clientWidth;
    }

    // 计算时间
    const timeObj = coordinateToTime(startX, endX);
    // 把值赋给当前的线段
    const track = {
      id: `${day.day}-${timeObj.startTime}-${timeObj.endTime}`,
      ...timeObj,
    };

    timeSliders[trackIndex] = track;
    const weekN = clone(week);
    setWeek && setWeek(weekN);
  };

  const onMouseUp = (e: MouseEvent) => {
    const weekN = clone(week);
    onComplete && onComplete(weekN);
    // console.log(weekN);
    e.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  function TimeRate() {
    return (
      <div className="time">
        {new Array(25).fill(1).map((_hour, index) => {
          return (
            <div className="hour" key={index}>
              <span>{index}</span>
              <i className="line" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-nowrap items-end">
      <span className="h-4 w-7 flex-none">{day.day}</span>
      <div className="flex flex-col items-center justify-center">
        <TimeRate />
        <div ref={SliderRef} onMouseDown={onMouseDown} className="slider" id={`slider${dayIndex}`}>
          {day.timelines.map((track, trackIndex) => {
            return (
              <Track
                key={track.id}
                dayIndex={dayIndex}
                trackIndex={trackIndex}
                week={week}
                setWeek={setWeek}
                onComplete={onComplete}
              />
            );
          })}
        </div>
      </div>
      <Action dayIndex={dayIndex} week={week} setWeek={setWeek} onComplete={onComplete} />
    </div>
  );
}

export default Day;
