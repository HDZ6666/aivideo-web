import { KonvaEventObject } from "konva/lib/Node";
import { Rect } from "react-konva";
import { RectType } from "./konvaType";

interface KonvaCanvasProps {
	maxWidth: number;
	maxHeight: number;
	shapeProps: RectType;
	onComplete?: (points: number[][]) => void;
}

const Rectangle = ({ maxWidth, maxHeight, shapeProps, onComplete }: KonvaCanvasProps) => {
	const onDragEnd = (e: KonvaEventObject<MouseEvent>) => {
		const { x, y } = e.target.position();
		const points = [
			[x, y],
			[x + shapeProps.width, y],
			[x + shapeProps.width, y + shapeProps.height],
			[x, y + shapeProps.height]
		];
		onComplete && onComplete(points);
	};

	const DragBoundFunc = (pos: { x: number; y: number }) => {
		const newX = Math.max(0, Math.min(pos.x, maxWidth - shapeProps.width));
		const newY = Math.max(0, Math.min(pos.y, maxHeight - shapeProps.height));
		return {
			x: newX,
			y: newY
		};
	};

	return <Rect {...shapeProps} draggable dragBoundFunc={DragBoundFunc} onDragEnd={onDragEnd} />;
};

export default Rectangle;
