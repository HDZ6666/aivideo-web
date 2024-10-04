import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import { Group, Line, Layer } from "react-konva";
import GroupPolygon from "./groupPolygon";
import { GroupType, CompeteType } from "./konvaType";

interface KonvaCanvasProps {
	shapeProps: GroupType[];
	start: Boolean;
	complete: Boolean;
	changeShape: (value: GroupType[]) => void;
	changeStart: (start: Boolean) => void;
	changeComplete: (complete: Boolean) => void;
	onComplete?: (competeList: CompeteType[]) => void;
}

const Polygon = ({ shapeProps, start, complete, changeShape, changeStart, changeComplete, onComplete }: KonvaCanvasProps) => {
	const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
		// 结束就不需要绘制了
		if (complete) {
			return;
		}

		if (e.evt.button === 0) {
			console.log("开始绘制");
			changeStart(true);
			const { offsetX, offsetY } = e.evt;

			const circle = CreateGroupType([offsetX, offsetY], "circle");
			const line = CreateGroupType([offsetX, offsetY, offsetX, offsetY], "line");
			changeShape([...shapeProps, circle, line]);
		} else if (e.evt.button === 2) {
			console.log("结束绘制");
			const circleList = shapeProps.filter(item => item.type === "circle");
			if (circleList.length < 3) {
				return;
			}
			const groupList_s = DrawPolygon(shapeProps, circleList[0].points);
			changeShape(groupList_s);
			changeComplete(true);
			onComplete && onComplete(groupList_s);
		}
	};

	const MouseMove = (e: KonvaEventObject<MouseEvent>) => {
		if (complete) {
			return;
		}
		if (!start) {
			return;
		}

		const groupList_s = DrawPolygon(shapeProps, [e.evt.offsetX, e.evt.offsetY]);
		changeShape(groupList_s);
	};

	const DragEnd = (e: KonvaEventObject<MouseEvent>) => {
		console.log(e);
		// onChange({
		// 	...shapeProps,
		// 	x: e.target.x(),
		// 	y: e.target.y()
		// });
	};

	const CreateGroupType = (points: number[], type: string) => {
		return {
			points: points,
			width: 2,
			fill: "red",
			type: type
		};
	};
	const DrawPolygon = (groupList: GroupType[], points: number[]) => {
		return groupList.map((item, index) => {
			if (index === groupList.length - 1 && item.type === "line") {
				item.points = [item.points[0], item.points[1], ...points];
			}
			return item;
		});
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
		const MaxX = 600 - Math.max(...xList);
		const MinX = 0 - Math.min(...xList);
		const MaxY = 400 - Math.max(...yList);
		const MinY = 0 - Math.min(...yList);
		const newX = Math.max(MinX, Math.min(pos.x, MaxX));
		const newY = Math.max(MinY, Math.min(pos.y, MaxY));
		return {
			x: newX,
			y: newY
		};
	};

	return (
		<Layer onMouseMove={MouseMove} onMouseDown={MouseDown}>
			<Group>
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
			</Group>
		</Layer>
	);
};

export default Polygon;
