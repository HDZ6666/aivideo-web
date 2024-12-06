export interface IDay {
  day: WEEK;
  timelines: ITimeline[];
}

export interface IDayForm {
  day: WEEK;
  timelines: ITimeForm[];
}

export interface ITimeForm {
  startTime: string;
  endTime: string;
}

export interface ITimeline extends ITime {
  id: string;
  showTime?: boolean;
  border?: boolean;
}

export interface ITime {
  startTime: string;
  endTime: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  startX: number;
  endX: number;
  length: number;
}

export interface ICopyDay {
  day: WEEK;
  checked: boolean;
}

export enum WEEK {
  MOMENDAY = '周一',
  THUESDAY = '周二',
  WEDNESDAY = '周三',
  THURSDAY = '周四',
  FIRDAY = '周五',
  SATURDAY = '周六',
  SUNDAY = '周日',
}
