import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { Rect, Layer } from "react-konva";
import { CompeteType } from "./konvaType";

export interface RectType {
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
}
interface KonvaCanvasProps {
	shapeProps: RectType;
	start: Boolean;
	complete: Boolean;
	changeShape: (shapeProps: RectType) => void;
	changeStart: (start: Boolean) => void;
	changeComplete: (complete: Boolean) => void;
	onComplete?: (competeList: CompeteType[]) => void;
}

const Rectangle = ({ shapeProps, start, complete, changeStart, changeComplete, changeShape, onComplete }: KonvaCanvasProps) => {
	const shapeRef = useRef<any>();
	const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
		// 结束就不需要绘制了
		if (complete) {
			return;
		}
		if (!start && e.evt.button === 0) {
			console.log("开始绘制");
			changeStart(true);
			changeShape({ ...shapeProps, x: e.evt.offsetX, y: e.evt.offsetY, width: 10, height: 10 });
		}
	};

	const MouseMove = (e: KonvaEventObject<MouseEvent>) => {
		if (complete) {
			return;
		}
		if (!start) {
			return;
		}

		changeShape({
			...shapeProps,
			width: Math.max(e.evt.offsetX - shapeProps.x, 10),
			height: Math.max(e.evt.offsetY - shapeProps.y, 10)
		});
	};

	const MouseUp = () => {
		Finish();
		changeComplete(true);
	};

	const Finish = () => {
		const points = [
			[shapeProps.x, shapeProps.y],
			[shapeProps.x + shapeProps.width, shapeProps.y],
			[shapeProps.x + shapeProps.width, shapeProps.y + shapeProps.height],
			[shapeProps.x, shapeProps.y + shapeProps.height]
		];
		const grouplist: CompeteType[] = new Array(4).fill(0).map((item, index) => {
			return {
				points: points[index],
				width: 2,
				fill: "red",
				type: "circle"
			};
		});
		onComplete && onComplete(grouplist);
	};

	const onDragEnd = (e: KonvaEventObject<MouseEvent>) => {
		changeShape({
			...shapeProps,
			x: e.target.x(),
			y: e.target.y()
		});
		Finish();
	};

	const DragBoundFunc = (pos: { x: number; y: number }) => {
		const node = shapeRef.current;
		const newX = Math.max(0, Math.min(pos.x, 600 - node.width()));
		const newY = Math.max(0, Math.min(pos.y, 400 - node.height()));
		return {
			x: newX,
			y: newY
		};
	};

	return (
		<Layer onMouseMove={MouseMove} onMouseUp={MouseUp} onMouseDown={MouseDown}>
			<Rect ref={shapeRef} {...shapeProps} draggable dragBoundFunc={DragBoundFunc} onDragEnd={onDragEnd} />
		</Layer>
	);
};

export default Rectangle;
