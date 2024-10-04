export interface IDay {
	day: WEEK;
	timelines: ITimeline[];
	checked: boolean;
	delete: boolean;
}

export interface ITimeline extends ITime {
	startX: number;
	endX: number;
	length: number;
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
}

export interface ICopyDay {
	day: WEEK;
	checked: boolean;
}

export enum WEEK {
	MOMENDAY = "周一",
	THUESDAY = "周二",
	WEDNESDAY = "周三",
	THURSDAY = "周四",
	FIRDAY = "周五",
	SATURDAY = "周六",
	SUNDAY = "周日"
}
