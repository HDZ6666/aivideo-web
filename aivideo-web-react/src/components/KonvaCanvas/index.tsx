import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Group } from "react-konva";
import Rectangle from "./rect";
import Polygon from "./polygon";
import { Button, Card, Col, Row, Select } from "antd";
import useImage from "use-image";
import { GroupType, RectType } from "./konvaType";

export type KonvaCanvasType = "rect" | "polygon" | "lineBA" | "lineAB" | "line"; //矩形、多边形、线段AB、线段BA、线段

export interface KonvaCanvasProps {
	width?: number;
	height?: number;
	color?: string;
	bgImage: string;
	onComplete?: (competeList: number[][]) => void;
}

const KonvaCanvas = ({ width = 600, height = 400, color = "red", bgImage, onComplete }: KonvaCanvasProps) => {
	const [image] = useImage(bgImage);
	const groupRef = useRef<Konva.Group>(null);
	const [type, setType] = useState<KonvaCanvasType>("polygon");
	const [start, setStart] = useState<boolean>(false); //是否开始绘制
	const [complete, setComplete] = useState<boolean>(false); //是否完成绘制
	const [rect, setRect] = useState<RectType>({ x: 0, y: 0, width: 0, height: 0, fill: color }); // 矩形的数据
	const [groupList, setGroupList] = useState<GroupType[]>([]); //自定义图形的数据

	const MouseDown = (e: KonvaEventObject<MouseEvent>) => {
		// 结束就不需要绘制了
		if (complete) {
			return;
		}
		if (type === "rect") {
			if (!start && e.evt.button === 0) {
				console.log("开始绘制");
				setStart(true);
				setRect({ x: e.evt.offsetX, y: e.evt.offsetY, width: 10, height: 10, fill: color });
			}
		}

		if (type === "polygon") {
			if (e.evt.button === 0) {
				console.log("开始绘制");
				setStart(true);
				// const { offsetX, offsetY } = e.evt;

				// 画多边形

				// if (groupRef && groupRef.current) {
				// 	const res = groupRef.current.getAllIntersections({ x: offsetX, y: offsetY });
				// 	if (res.length === 1) {
				// 		// 大于0的情况可能是点击中最后一条线 或者击中最后一个点 ,或者击中其他的点或者线
				// 		if (res[0].attrs.id !== `line_${groupList.length - 1}`) {
				// 			console.log("拦截了", res);
				// 			return;
				// 		}
				// 	} else if (res.length > 1) {
				// 		console.log("拦截了", res);
				// 		return;
				// 	}

				// 	const circle = CreateGroupType([offsetX, offsetY], "circle");
				// 	const line = CreateGroupType([offsetX, offsetY, offsetX, offsetY], "line");
				// 	setGroupList([...groupList, circle, line]);
				// }
				// if (checkPointInLine([offsetX, offsetY], groupList)) {
				// 	console.log("拦截了", [offsetX, offsetY]);
				// 	return;
				// }
			} else if (e.evt.button === 2) {
				console.log("结束绘制");
				const circleList = groupList.filter(item => item.type === "circle");
				if (circleList.length < 3) {
					return;
				}
				const groupList_s = DrawPolygon(groupList, circleList[0].points);
				setGroupList(groupList_s);
				setComplete(true);
				console.log(groupList);
			}
		}

		setStart(true);
	};

	const MouseMove = (e: KonvaEventObject<MouseEvent>) => {
		if (complete) {
			return;
		}
		if (!start) {
			return;
		}

		if (type === "rect") {
			setRect({ ...rect, width: Math.max(e.evt.offsetX - rect.x, 10), height: Math.max(e.evt.offsetY - rect.y, 10) });
		}
		if (type === "polygon") {
			const groupList_s = DrawPolygon(groupList, [e.evt.offsetX, e.evt.offsetY]);
			setGroupList(groupList_s);
		}
	};

	const MouseUp = () => {
		if (type === "rect") {
			const points = [
				[rect.x, rect.y],
				[rect.x + rect.width, rect.y],
				[rect.x + rect.width, rect.y + rect.height],
				[rect.x, rect.y + rect.height]
			];
			onComplete && onComplete(points);
			setComplete(true);
		}
	};

	// const CreateGroupType = (points: number[], type: string) => {
	// 	return {
	// 		points: points,
	// 		width: 10,
	// 		fill: "red",
	// 		type: type
	// 	};
	// };

	const DrawPolygon = (groupList: GroupType[], points: number[]) => {
		return groupList.map((item, index) => {
			if (index === groupList.length - 1 && item.type === "line") {
				item.points = [...item.points.filter((_item, index) => index < 2), ...points];
			}
			return item;
		});
	};

	// 判断点是否和存在过的点重合
	// const checkPointInPoints = (groupList: GroupType[], pointX: number, pointY: number): boolean => {
	// 	return groupList
	// 		.filter(item => item.type === "circle")
	// 		.some(item => item.points.includes(pointX) && item.points.includes(pointY));
	// };

	// 判断点是否在线段上
	// const checkPointInLines = (groupList: GroupType[], pointX: number, pointY: number) => {
	// 	const groupList_s = groupList.filter((item, index) => item.type === "line" && index !== groupList.length - 1);
	// 	if (groupList_s.length === 0) {
	// 		return false;
	// 	}
	// 	return groupList_s.some(item => {
	// 		// 点c[x,y] 是否在线段 [x1,y1,x2,y2] ab 上
	// 		const line = item.points; //线段ab [x1,y1,x2,y2]
	// 		const v1 = { x: line[2] - line[0], y: line[3] - line[1] }; //构建向量 ab
	// 		const v2 = { x: pointX - line[0], y: pointY - line[1] }; //向量ac
	// 		// 向量叉乘 ab * ac 如果等于0 并且点的坐标在ab上
	// 		const res1 = v1.x * v2.y - v1.y * v2.x; //叉积
	// 		// 判断点是否在线段上
	// 		const res2 =
	// 			Math.min(line[0], line[2]) < pointX &&
	// 			pointX <= Math.max(line[0], line[2]) &&
	// 			Math.min(line[1], line[3]) <= pointY &&
	// 			pointY <= Math.max(line[1], line[3]);
	// 		// 计算点到两个端点的距离
	// 		// const distanceStart = Math.sqrt(Math.pow(pointX - line[0], 2) + Math.pow(pointY - line[1], 2));
	// 		// const distanceEnd = Math.sqrt(Math.pow(pointX - line[2], 2) + Math.pow(pointY - line[3], 2));
	// 		// 点在线段上并且点在线段中或者点在起点那一侧
	// 		return res1 === 0 && res2;
	// 	});
	// };

	// const checkLineCrossLines = (groupList: GroupType[]) => {
	// 	const groupList_s = groupList.filter((item, index) => item.type === "line");
	// 	if (groupList_s.length < 3) {
	// 		return false;
	// 	}
	// 	const currentLine = groupList_s[groupList_s.length - 1].points; //当前线段ab [x1,y1,x2,y2]
	// 	const otherLines = groupList_s.filter((item, index) => index < groupList_s.length - 2);

	// 	return otherLines.some(item => {
	// 		const line = item.points; //不相邻的线段cd [x3,y3,x4,y4]
	// 		const v1 = { x: currentLine[0] - line[0], y: currentLine[1] - line[1] }; // 构建向量 ca
	// 		const v2 = { x: currentLine[2] - line[0], y: currentLine[3] - line[1] }; // 构建向量 cb
	// 		const v3 = { x: line[2] - line[0], y: line[3] - line[1] }; // 构建向量 cd
	// 		// 向量ca * cd的叉积  和 向量cb * cd 的叉积  一定是异号
	// 		const res1 = (v1.x * v3.y - v1.y * v3.x) * (v2.x * v3.y - v2.y * v3.x);
	// 		const v4 = { x: line[0] - currentLine[0], y: line[1] - currentLine[1] }; // 构建向量 ac
	// 		const v5 = { x: line[2] - currentLine[0], y: line[3] - currentLine[1] }; // 构建向量 ad
	// 		const v6 = { x: currentLine[2] - currentLine[0], y: currentLine[3] - currentLine[1] }; // 构建向量 ab
	// 		const res2 = (v4.x * v6.y - v4.y * v6.x) * (v5.x * v6.y - v5.y * v6.x);

	// 	});
	// };

	// const checkPointInLine = (p0: number[], groupList: GroupType[]) => {
	// 	// 点p0 [x, y] 是否在线段上 [x1, y1 ,x2, y2]
	// 	const groupList_s = groupList.filter((item, index) => item.type === "line" && index);
	// 	if (groupList_s.length === 0) {
	// 		return false;
	// 	}
	// 	return groupList_s.some(item => {
	// 		return checkPointInLine2(item.points, p0);
	// 	});
	// };

	// const checkPointInLine2 = (line: number[], a: number[]) => {
	// 	// a[x,y] 是否在线段 line[x1,y1,x2,y2] cd
	// 	const v1 = { x: line[2] - line[0], y: line[3] - line[1] }; //向量 cd
	// 	const v2 = { x: a[0] - line[0], y: a[1] - line[1] }; //向量ca
	// 	const res1 = v1.x * v2.y - v1.y * v2.x; //叉积
	// 	const res2 =
	// 		Math.min(line[0], line[2]) <= a[0] &&
	// 		a[0] <= Math.max(line[0], line[2]) &&
	// 		Math.min(line[1], line[3]) <= a[1] &&
	// 		a[1] <= Math.max(line[1], line[3]);
	// 	return res1 === 0 && res2;
	// };

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
						<Stage
							width={width}
							height={height}
							onMouseMove={MouseMove}
							onMouseUp={MouseUp}
							onMouseDown={MouseDown}
							onContextmenu={Contextmenu}
						>
							<Layer>
								<Image x={0} y={0} image={image} width={width} height={height} />
							</Layer>
							<Layer>
								{type === "rect" && (
									<Rectangle maxHeight={height} maxWidth={width} shapeProps={rect} onComplete={onComplete}></Rectangle>
								)}
								{type === "polygon" && (
									<Group ref={groupRef}>
										<Polygon
											maxHeight={height}
											maxWidth={width}
											complete={complete}
											shapeProps={groupList}
											onComplete={onComplete}
										></Polygon>
									</Group>
								)}
							</Layer>
						</Stage>
					</div>
				</Col>
			</Row>
		</Card>
	);
};

export default KonvaCanvas;
