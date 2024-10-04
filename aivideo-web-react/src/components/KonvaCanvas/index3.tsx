import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Layer, Stage, Image } from "react-konva";
import Rectangle from "./rect";
import Polygon from "./polygon";
import { Button, Card, Col, Row, Select } from "antd";
import useImage from "use-image";
import { CompeteType, GroupType, RectType } from "./konvaType";

export type KonvaCanvasType = "rect" | "polygon" | "lineBA" | "lineAB" | "line"; //矩形、多边形、线段AB、线段BA、线段

export interface KonvaCanvasProps {
	width?: number;
	height?: number;
	color?: string;
	bgImage: string;
	onComplete?: (competeList: CompeteType[]) => void;
}

const KonvaCanvas = ({ width = 600, height = 400, color = "red", bgImage, onComplete }: KonvaCanvasProps) => {
	const [image] = useImage(bgImage);
	const [type, setType] = useState<KonvaCanvasType>("polygon");
	const [start, setStart] = useState<Boolean>(false); //是否开始绘制
	const [complete, setComplete] = useState<Boolean>(false); //是否完成绘制
	const [rect, setRect] = useState<RectType>({ x: 0, y: 0, width: 0, height: 0, fill: color }); // 矩形的数据
	const [groupList, setGroupList] = useState<GroupType[]>([]); //自定义图形的数据

	const Contextmenu = (e: KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		return false;
	};

	const reset = () => {
		console.log("重置");
		setStart(false);
		setComplete(false);
		setRect({ x: 0, y: 0, width: 0, height: 0, fill: color });
		setGroupList([]);
	};

	const TypeChange = (value: KonvaCanvasType) => {
		reset();
		setType(value);
	};

	return (
		<Card>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={8}>
					<Select
						style={{ width: "100%" }}
						options={[
							{ value: "rect", label: "矩形" },
							{ value: "polygon", label: "自定义图案" },
							{ value: "lineAB", label: "线段AB" },
							{ value: "lineBA", label: "线段BA" },
							{ value: "line", label: "线段" }
						]}
						onChange={TypeChange}
					></Select>
				</Col>
				<Col span={8}>
					<Button onClick={reset}>重置</Button>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<div
						style={{
							width: width,
							height: height,
							backgroundColor: "#f2f2f2",
							border: "2px solid #000",
							position: "relative",
							boxSizing: "content-box"
						}}
					>
						<Stage width={width} height={height} onContextmenu={Contextmenu}>
							<Layer>
								<Image x={0} y={0} image={image} width={width} height={height} />
							</Layer>
							{type === "rect" && (
								<Layer
									onClick={() => {
										console.log(1);
									}}
								>
									<Rectangle
										shapeProps={rect}
										start={start}
										complete={complete}
										changeShape={setRect}
										changeStart={setStart}
										changeComplete={setComplete}
										onComplete={onComplete}
									></Rectangle>
								</Layer>
							)}
							{type === "polygon" && (
								<Polygon
									shapeProps={groupList}
									start={start}
									complete={complete}
									changeShape={setGroupList}
									changeStart={setStart}
									changeComplete={setComplete}
									onComplete={onComplete}
								></Polygon>
							)}
						</Stage>
					</div>
				</Col>
			</Row>
		</Card>
	);
};

export default KonvaCanvas;
