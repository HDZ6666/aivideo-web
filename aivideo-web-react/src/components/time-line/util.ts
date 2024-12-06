import dayjs from 'dayjs';

import { ITimeline, ITime } from './interface';

const widthDpr = 1440 / 576;

export function coordinateToTime(startX: number, endX: number): ITime {
  // slider 的 width 为576，60 * 24 = 1440，为了都用整数好计算
  const startHour: number = Math.floor((startX * widthDpr) / 60);
  const startMin: number = Math.floor((startX * widthDpr) % 60);
  const endHour: number = Math.floor((endX * widthDpr) / 60);
  const endMin: number = Math.floor((endX * widthDpr) % 60);
  const startTime = `${startHour > 9 ? startHour : `0${startHour}`}:${
    startMin > 9 ? startMin : `0${startMin}`
  }`;
  const endTime = `${endHour > 9 ? endHour : `0${endHour}`}:${endMin > 9 ? endMin : `0${endMin}`}`;
  const length = endX - startX;
  return {
    startTime,
    endTime,
    startHour,
    startMin,
    endHour,
    endMin,
    startX,
    endX,
    length,
  };
}
export function timeToCoordinate(startTimeStr: string, endTimeStr: string) {
  const startTime = dayjs(startTimeStr, 'HH:mm');
  const endTime = dayjs(endTimeStr, 'HH:mm');
  const zeroTime = dayjs('00:00', 'HH:mm'); // 当天0点
  const startHour: number = startTime.hour(); // 开始小时
  const startMin: number = startTime.minute(); // 开始分钟
  const startX: number = startTime.diff(zeroTime, 'minute') / widthDpr;
  const endHour: number = endTime.diff(zeroTime, 'hour');
  // const endHour: number = endTimeChange === '当天' ? endTime.hour() : 24; // 次日返回24
  const endMin: number = endTime.minute();
  const length: number = endTime.diff(startTime, 'minute') / widthDpr;
  const endX = startX + length;
  return {
    startX,
    length,
    endX,
    startHour,
    startMin,
    endHour,
    endMin,
    startTime: startTimeStr,
    endTime: endTimeStr,
  };
}

// export function timeToCoordinate(startTime: string, endTime: string) {
//   let [startHour, startMin]: Array<string | number> = startTime.split(':');
//   let [endHour, endMin]: Array<string | number> = endTime.split(':');
//   startHour = parseInt(startHour, 10);
//   startMin = parseInt(startMin, 10);
//   endHour = parseInt(endHour, 10);
//   endMin = parseInt(endMin, 10);
//   const startX = startHour * 60 + startMin / widthDpr;
//   const length = endHour * 60 + endMin / widthDpr - startX;
//   return {
//     startX,
//     length,
//     startHour,
//     startMin,
//     endHour,
//     endMin,
//   };
// }
// 当点在某个时间段里面
export function pointInSection(timelines: ITimeline[], startX: number): boolean {
  for (let i = 0; i < timelines.length; i++) {
    if (timelines[i].startX < startX && timelines[i].endX > startX) {
      return true;
    }
  }
  return false;
}
// 线段重合
export function interSection(timelines: ITimeline[], startX: number, endX: number): number {
  for (let i = 0; i < timelines.length; i++) {
    if (startX < timelines[i].startX && endX > timelines[i].startX) {
      return i;
    }
  }
  return -1;
}

// 时间有交叉
export function canEditTime(
  timelines: ITimeline[],
  activeIndex: number,
  startX: number,
  endX: number,
): boolean {
  for (let i = 0; i < timelines.length; i++) {
    if (i !== activeIndex) {
      if (timelines[i].startX < startX && timelines[i].endX > startX) {
        return false;
      }
      if (startX < timelines[i].startX && endX > timelines[i].startX) {
        return false;
      }
    }
  }
  return true;
}
