import { useState } from "react";
import { Popover, Popconfirm } from "antd";
import { isEmpty } from "lodash";
import { ITimeline, IDay } from "./interface";
import CopyContainer from "./CopyContainer";

type IProps = {
	trackIndex: number | undefined;
	day: IDay;
	dayIndex: number;
	getCopyDays: (timelines: ITimeline[], copyIndex: number[]) => void;
	handleDeleteTrack: () => void;
};

export default function Action(props: IProps) {
	const { trackIndex, getCopyDays, day, dayIndex, handleDeleteTrack } = props;
	const [copyVisible, setCopyVisible] = useState<boolean>(false);

	const handleCopySave = (copyIndexs: number[]) => {
		getCopyDays(day.timelines, copyIndexs);
		setCopyVisible(false);
	};

	const handleCopyVisible = () => {
		if (isEmpty(day.timelines)) return;
		setCopyVisible(copyVisible => !copyVisible);
	};

	return (
		<div className="action">
			<Popover
				content={<CopyContainer dayIndex={dayIndex} handleCopySave={handleCopySave} handleCopyVisible={handleCopyVisible} />}
				title="复制到..."
				trigger="click"
				open={copyVisible}
				onOpenChange={handleCopyVisible}
			>
				<span className={isEmpty(day.timelines) ? "disabled" : "copy"} style={{ marginLeft: 0 }}>
					复制
				</span>
			</Popover>
			<Popconfirm
				title="确定删除吗"
				disabled={trackIndex === undefined}
				onConfirm={handleDeleteTrack}
				okText="确定"
				cancelText="取消"
			>
				<span className={isEmpty(day.timelines) || !day.delete ? "disabled" : "delete"}>删除</span>
			</Popconfirm>
		</div>
	);
}
