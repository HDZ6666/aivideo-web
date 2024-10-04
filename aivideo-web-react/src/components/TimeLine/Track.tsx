import { FC, ReactElement, useState } from "react";
import { Popover } from "antd";
import { ITimeline } from "./interface";
import EditTime from "./EditTime";

interface IProps {
	activeIndex: number;
	dayIndex: number;
	changeTrack: (index: number) => void;
	timeline: ITimeline;
	startX: number;
	length: number;
	timelines: ITimeline[];
	getDay: (timelines: ITimeline[], dayIndex: number) => void;
}

const Track: FC<IProps> = (props): ReactElement => {
	const { activeIndex, dayIndex, timeline, startX, length, timelines, getDay, changeTrack } = props;
	const [visible, setVisible] = useState<boolean>(false);
	const style: React.CSSProperties = {
		visibility: "visible",
		left: startX + "px",
		width: length + "px"
	};
	if (timeline.border) {
		style.border = "1px dotted rgb(34 103 0)";
	}

	const handleVisibleClose = () => {
		setVisible(false);
	};
	const handleVisibleChange = (visible: boolean) => {
		visible && changeTrack(activeIndex);
		setVisible(visible);
	};
	return (
		<Popover
			title="修改时间"
			content={
				<EditTime
					activeIndex={activeIndex}
					dayIndex={dayIndex}
					timeline={timeline}
					timelines={timelines}
					handleVisibleClose={handleVisibleClose}
					getDay={getDay}
				/>
			}
			destroyTooltipOnHide
			trigger="click"
			open={visible}
			onOpenChange={handleVisibleChange}
		>
			<div className="timeline-track" style={style}></div>
		</Popover>
	);
};

export default Track;
