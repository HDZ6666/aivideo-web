import { useState, FC, ReactElement } from "react";
import { Button, message, TimePicker, Segmented, Input } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash";
import moment from "dayjs";
import { ITimeline } from "./interface";
import { timeToCoordinate2, canEditTime } from "./util";

type IProps = {
	activeIndex: number;
	dayIndex: number;
	timeline: ITimeline;
	timelines: ITimeline[];
	handleVisibleClose: () => void;
	getDay: (timelines: ITimeline[], dayIndex: number) => void;
};

const format = "HH:mm";

const EditTime: FC<IProps> = (props): ReactElement => {
	const { activeIndex, dayIndex, timeline, timelines, handleVisibleClose, getDay } = props;
	const [startTime, setStartTime] = useState(moment(timeline.startTime, format));
	const endTimeChangeText: string = timeline.endTime === "24:00" ? "次日" : "当天";
	const [endTime, setEndTime] = useState(moment(timeline.endTime, format));
	const [endTimeChange, setTimeChange] = useState<string>(endTimeChangeText);

	const changeStartTime = (time: any) => {
		setStartTime(time);
	};

	const changeEndTime = (time: any) => {
		setEndTime(time);
	};

	const handleEndTimeChange = (value: string) => {
		// 次日转当天 要扣减一天
		const _endTime = value === "当天" ? moment("00:00", format) : moment("24:00", format);
		setEndTime(_endTime);
		setTimeChange(value);
	};

	// const onOpenChange = (open: boolean) => {
	// 	SetOpne(open);
	// };
	// const cellRender = (current: number, info: any) => {
	// 	return endTimeChange === "当天" ? (
	// 		<div className="ant-picker-time-panel-cell-inner">{current <= 9 ? `0${current}` : current}</div>
	// 	) : info.subType === "hour" ? (
	// 		<div className="ant-picker-time-panel-cell-inner">24</div>
	// 	) : (
	// 		info.originNode
	// 	);
	// };
	// useEffect(() => {
	// 	timeline.endTime === "24:00" && handleEndTimeChange("次日");
	// }, []);

	const confirm = () => {
		if (endTimeChange === "当天" && startTime.isAfter(endTime)) {
			return message.error("开始时间不能晚于结束时间");
		}
		let { startX, length, startHour, startMin, endHour, endMin } = timeToCoordinate2(startTime, endTime, endTimeChange);
		const endX = startX + length;
		if (!canEditTime(timelines, activeIndex, startX, endX)) {
			return message.error("时间有重叠");
		}
		let time_sliders = cloneDeep(timelines);
		const _timeline = time_sliders[activeIndex];
		time_sliders[activeIndex] = {
			..._timeline,
			startX,
			endX,
			length,
			startTime: startTime.format("HH:mm"),
			endTime: endTimeChange === "当天" ? endTime.format("HH:mm") : "24:00",
			startHour,
			startMin,
			endHour,
			endMin
		};
		handleVisibleClose();
		getDay(time_sliders, dayIndex);
	};

	// if (timeline.endTime === "24:00") handleEndTimeChange("次日");
	return (
		<div className="edit-time-container">
			<div className="edit-time">
				<div className="time-content">
					<div className="end-time-choose">
						<Segmented size="small" options={["当天"]} />
					</div>
					<div className="time-wapper">
						<TimePicker
							placeholder="开始时间1"
							value={startTime}
							format={format}
							allowClear={false}
							showNow={false}
							needConfirm={false}
							onChange={changeStartTime}
						/>
					</div>
				</div>
				<span className="time-label">至</span>
				<div className="time-content">
					<div className="end-time-choose">
						<Segmented size="small" options={["当天", "次日"]} value={endTimeChange} onChange={handleEndTimeChange} />
					</div>
					<div className="time-wapper">
						<div className="input-wrapper" style={{ zIndex: endTimeChange === "次日" ? 2 : -1 }}>
							<Input value="24:00" suffix={<FieldTimeOutlined style={{ color: "RGBA(0,0,0,0.25)", fontSize: 16 }} />} />
						</div>
						<TimePicker
							placeholder="结束时间"
							value={endTime}
							format={format}
							allowClear={false}
							showNow={false}
							needConfirm={false}
							onChange={changeEndTime}
						/>
					</div>
				</div>
			</div>
			<div className="pop-footer">
				<Button
					size="small"
					type="default"
					style={{ marginRight: "10px" }}
					// onClick={handleVisibleChange}
					onClick={handleVisibleClose}
				>
					取消
				</Button>
				<Button size="small" type="primary" onClick={confirm}>
					保存
				</Button>
			</div>
		</div>
	);
};

export default EditTime;
