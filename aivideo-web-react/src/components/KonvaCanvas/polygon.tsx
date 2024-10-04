import { KonvaEventObject } from "konva/lib/Node";
import { Fragment, useCallback } from "react";
import { Line } from "react-konva";
import GroupPolygon from "./groupPolygon";
import { GroupType } from "./konvaType";

interface KonvaCanvasProps {
	maxWidth: number;
	maxHeight: number;
	shapeProps: GroupType[];
	complete: boolean;
	onComplete?: (competeList: number[][]) => void;
}

const Polygon = ({ maxWidth, maxHeight, shapeProps, complete }: KonvaCanvasProps) => {
	const DragEnd = (e: KonvaEventObject<MouseEvent>) => {
		console.log(e);
		// onChange({
		// 	...shapeProps,
		// 	x: e.target.x(),
		// 	y: e.target.y()
		// });
	};

	const Compete = useCallback(() => {
		return shapeProps.reduce((acc: number[], cur: GroupType) => {
			if (cur.type === "circle") {
				return [...acc, ...cur.points];
			}
			return acc;
		}, []);
	}, [shapeProps]);

	const DragBoundFunc = (pos: { x: number; y: number }) => {
		const xList = Compete().filter((item, index) => index % 2 === 0);
		const yList = Compete().filter((item, index) => index % 2 === 1);
		const MaxX = maxWidth - Math.max(...xList);
		const MinX = 0 - Math.min(...xList);
		const MaxY = maxHeight - Math.max(...yList);
		const MinY = 0 - Math.min(...yList);
		const newX = Math.max(MinX, Math.min(pos.x, MaxX));
		const newY = Math.max(MinY, Math.min(pos.y, MaxY));
		return {
			x: newX,
			y: newY
		};
	};

	return (
		<Fragment>
			{complete ? (
				<Line
					points={Compete()}
					stroke="red"
					fill="#00D2FF"
					strokeWidth={2}
					closed
					draggable
					dragBoundFunc={DragBoundFunc}
					onDragEnd={DragEnd}
				/>
			) : (
				<GroupPolygon groupList={shapeProps} />
			)}
		</Fragment>
	);
};

export default Polygon;
