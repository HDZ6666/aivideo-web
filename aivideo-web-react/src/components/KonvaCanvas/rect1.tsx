import { KonvaEventObject } from "konva/lib/Node";
import { Fragment, useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";

export interface RectType {
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
}

interface KonvaCanvasProps {
	shapeProps: RectType;
	onChange: (value: RectType) => void;
}

const Rectangle = ({ shapeProps, onChange }: KonvaCanvasProps) => {
	const shapeRef = useRef<any>();
	const trRef = useRef<any>();

	useEffect(() => {
		if (trRef && trRef.current) {
			trRef.current.nodes([shapeRef.current]);
			trRef.current.getLayer().batchDraw();
		}
	}, []);

	const onDragEnd = (e: KonvaEventObject<MouseEvent>) => {
		onChange({
			...shapeProps,
			x: e.target.x(),
			y: e.target.y()
		});
	};

	const onTransformEnd = () => {
		const node = shapeRef.current;
		console.log(node);
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		// we will reset it back
		node.scaleX(1);
		node.scaleY(1);
		onChange({
			...shapeProps,
			x: node.x(),
			y: node.y(),
			// set minimal value
			width: Math.max(5, node.width() * scaleX),
			height: Math.max(node.height() * scaleY)
		});
	};

	const boundBoxFunc = (oldBox: any, newBox: any) => {
		console.log(oldBox);
		if (Math.abs(newBox.width) + Math.abs(newBox.x) > 601 || Math.abs(newBox.height) + Math.abs(newBox.y) > 401) {
			return oldBox;
		}
		if (Math.abs(newBox.width) < 100 || Math.abs(newBox.height) < 100) {
			return oldBox;
		}
		return newBox;
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
		<Fragment>
			<Rect
				ref={shapeRef}
				{...shapeProps}
				draggable
				dragBoundFunc={DragBoundFunc}
				onDragEnd={onDragEnd}
				onTransformEnd={onTransformEnd}
			/>
			<Transformer ref={trRef} flipEnabled={false} boundBoxFunc={boundBoxFunc} />
		</Fragment>
	);
};

export default Rectangle;
