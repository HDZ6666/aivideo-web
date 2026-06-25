import type { Dayjs } from 'dayjs';

export interface CardModalForm {
  title: string; // 分组名称
  alarmTypeId: number; // 算法ID
  countType: number; // 统计类型 1、区域统计 2、进出统计
  device: number; // 设备列表
  date: Dayjs[];
  timeType: number; // 时间类型 1、实时当天 2、历史时段
  startTime: string; // 开始时间
  endTime: string; // 结束时间
}
