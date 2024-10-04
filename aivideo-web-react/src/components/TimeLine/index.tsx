import { useState, useImperativeHandle, forwardRef } from "react";
import { cloneDeep } from "lodash";
import { IDay, ITimeline, WEEK } from "./interface";
import { Popconfirm, Button } from "antd";
import Day from "./Day";
import "./index.css";

// const initState = {}
const TimeLine = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		getAllData
	}));

	const [week, setWeek] = useState<IDay[]>([
		{ day: WEEK.MOMENDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.THUESDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.WEDNESDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.THURSDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.FIRDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.SATURDAY, timelines: [], checked: false, delete: false },
		{ day: WEEK.SUNDAY, timelines: [], checked: false, delete: false }
	]);
	// const [state, dispatch] = useReducer(weekReducer, initState)

	// 更新画线数据
	const getDay = (timelines: ITimeline[], dayIndex: number) => {
		let _week: IDay[] = cloneDeep(week);
		const index = timelines.findIndex(slider => slider.border === true);
		if (index > -1) {
			_week[dayIndex].delete = true;
		} else {
			_week[dayIndex].delete = false;
		}
		_week[dayIndex].timelines = timelines;
		setWeek(_week);
	};

	// 更新复制的画线数据
	const getCopyDays = (timelines: ITimeline[], dayIndexs: number[]) => {
		let _week: IDay[] = cloneDeep(week);
		dayIndexs.forEach(index => {
			_week[index].timelines = timelines;
		});
		setWeek(_week);
	};

	// 批量删除
	const batchDelete = () => {
		let _week: IDay[] = cloneDeep(week);
		_week.forEach(day => {
			day.timelines = [];
			day.checked = false;
		});
		setWeek(_week);
	};

	const getAllData = () => week;
	return (
		<div className="arming-time-container">
			<div className="batch-operation">
				<Popconfirm
					title="确定批量删除吗"
					okText="确定"
					cancelText="取消"
					onConfirm={() => {
						batchDelete();
					}}
				>
					<Button type="link" danger>
						全部删除
					</Button>
				</Popconfirm>
			</div>
			<div className="table">
				{week.map((day, i) => {
					return <Day key={day.day} dayIndex={i} day={day} getDay={getDay} getCopyDays={getCopyDays} />;
				})}
			</div>
		</div>
	);
});
TimeLine.displayName = "TimeLine";

export default TimeLine;
