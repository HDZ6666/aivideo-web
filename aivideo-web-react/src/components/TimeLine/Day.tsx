import { FC, ReactElement, useRef, useState } from "react";
import { isEmpty, cloneDeep } from "lodash";
import { coordinateToTime, pointInSection, interSection } from "./util";
import { IDay, ITimeline } from "./interface";
import Track from "./Track";
import Action from "./Action";

interface IProps {
	day: IDay;
	dayIndex: number;
	getDay: (timelines: ITimeline[], dayIndex: number) => void;
	getCopyDays: (timelines: ITimeline[], copyIndexs: number[]) => void;
}

const Day: FC<IProps> = ({ day, dayIndex, getDay, getCopyDays }): ReactElement => {
	let startX: number, // 某个时间段的开始位置（相对时间轴）
		startPosition: number, // 某个时间段的开始位置（相对页面）
		activeTimelineIndex: number,
		time_sliders: ITimeline[] = cloneDeep(day.timelines);
	// const [coincide, setCoincide] = useState<boolean>(false); //时间端开始位置是否已经存在时间段
	const [trackIndex, setTrackIndex] = useState<number | undefined>(undefined); // 选中时间段的索引
	const SliderRef = useRef<HTMLDivElement>(null);

	// 按下鼠标左键
	const onMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
		// 判断鼠标的左键点击
		if (e.button !== 0) {
			return;
		}
		e.stopPropagation(); // 阻止冒泡
		e.preventDefault(); // 阻止默认事件
		const { left } = SliderRef.current!.getBoundingClientRect(); //获取时间轴距离视图左边的距离
		const { pageX } = e; //获取当前鼠标点击位置距离视图左边的距离
		startX = Math.floor(pageX - left) >= 0 ? Math.floor(pageX - left) : 0; // 时间条距离边框的宽度
		startPosition = pageX; // 鼠标左键按下位置
		activeTimelineIndex = day.timelines.length; // 正在画线的 index
		if (pointInSection(day.timelines, startX)) {
			// 拖拽事件，交给子元素自行处理
			return;
		}
		document.addEventListener("mousemove", onMouseMove); // 全局注册mousemove事件
		document.addEventListener("mouseup", onMouseUp); // 全局注册mouseup事件
	};

	const onMouseMove = (e: MouseEvent) => {
		e.preventDefault();
		// if (coincide) return; // 鼠标按下位置已有画线
		let length: number = e.pageX - startPosition; // 实时计算长度
		let endX = startX + length; // 鼠标结束位置
		// 反方向操作
		if (length <= 0) {
			return;
		}
		// 限制画线重合
		const interSectionIndex = interSection(day.timelines, startX, endX);
		if (interSectionIndex > -1) {
			length = day.timelines[interSectionIndex].startX - startX - 1;
			endX = day.timelines[interSectionIndex].startX - 1; // 上一个时间段开始 -1
		}
		// 当画线超过 slider 总长度时
		if (endX >= SliderRef.current!.clientWidth) {
			length = SliderRef.current!.clientWidth - startX;
			endX = startX + length;
		}
		// 计算时间
		const { startTime, endTime, startHour, startMin, endHour, endMin } = coordinateToTime(startX, endX);
		// 把值赋给当前的线段
		time_sliders[activeTimelineIndex] = {
			startX,
			endX,
			length,
			startTime,
			endTime,
			startHour,
			startMin,
			endHour,
			endMin
		};
		// 刷新页面
		getDay(time_sliders, dayIndex);
	};

	const onMouseUp = (e: MouseEvent) => {
		e.preventDefault();
		getDay(time_sliders, dayIndex);
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	// 点击选中 track
	const changeTrack = (index: number) => {
		time_sliders.forEach(slider => {
			if (slider.border) slider.border = false;
		});
		time_sliders[index].border = true;
		getDay(time_sliders, dayIndex);
		setTrackIndex(index);
	};

	// 删除选中的 track
	const handleDeleteTrack = () => {
		if (isEmpty(day.timelines) || trackIndex === undefined) return;
		time_sliders.splice(trackIndex, 1);
		getDay(time_sliders, dayIndex);
		setTrackIndex(undefined);
	};
	return (
		<div className="day">
			<div className="date">{day.day}</div>
			<div className="timeline">
				<div className="time">
					{new Array(25).fill(1).map((hour, index) => {
						return (
							<div className="hour" key={index}>
								<span>{index}</span>
								<i className="line"></i>
							</div>
						);
					})}
				</div>
				<div ref={SliderRef} onMouseDown={onMouseDown} className="slider">
					{day.timelines.map((timeline, i) => {
						return (
							<Track
								key={i}
								activeIndex={i}
								dayIndex={dayIndex}
								timeline={timeline}
								startX={timeline.startX}
								length={timeline.length}
								timelines={day.timelines}
								changeTrack={changeTrack}
								getDay={getDay}
							/>
						);
					})}
				</div>
			</div>
			<Action
				trackIndex={trackIndex}
				getCopyDays={getCopyDays}
				day={day}
				dayIndex={dayIndex}
				handleDeleteTrack={handleDeleteTrack}
			/>
		</div>
	);
};

export default Day;
