// import welcome from "@/assets/images/welcome.png";
import { useEffect, useRef } from "react";
import "./index.less";
// import AlarmTimeLine from "@/components/AlarmTimeLine";
// import ArmingTime from "@/components/ArmingTime";

// interface ModalProps {
// 	sdraw: boolean;
// 	ctx: CanvasRenderingContext2D;
// 	coordinates: never[];
// 	cor_index: number;
// 	endtip: boolean;
// 	all_coordinates: never[];
// 	isdrag: boolean;
// 	drag_index: number[];
// 	img: string;
// 	val: {
// 		cor_x: string;
// 		cor_y: string;
// 	};
// 	upVal: {
// 		cor_x: string;
// 		cor_y: string;
// 	};
// 	isShowBox: boolean;
// }

const Home = () => {
	const state = {
		canvasWidth: 500,
		canvasHeight: 500,
		isdraw: false, //是否在画图形
		ctx: null, //canvas对象
		coordinates: [], //一个多边形的坐标信息
		cor_index: 0, //当前多边形的索引
		endtip: false, //是否结束一个多边形的绘制
		all_coordinates: [], //所有多边形的信息
		isdrag: false,
		drag_index: [-1, -1],
		img: "",
		val: { cor_x: 0, cor_y: 0 }, //鼠标按下
		upVal: { cor_x: 0, cor_y: 0 }, //鼠标抬起
		isShowBox: false
	};
	const mycanvas = useRef(null);

	//为当前的多边形端点画圆
	// const drawline = () => {
	// 	for (let i = 0; i < state.coordinates.length - 1; i++) {
	// 		this.ctx.beginPath();
	// 		let x0 = state.coordinates[i].cor_x;
	// 		let y0 = state.coordinates[i].cor_y;
	// 		let x1 = state.coordinates[i + 1].cor_x;
	// 		let y1 = state.coordinates[i + 1].cor_y;
	// 		state.ctx.moveTo(x0, y0);
	// 		state.ctx.lineTo(x1, y1);
	// 		state.ctx.stroke();
	// 		state.ctx.closePath();
	// 	}
	// };

	const onMouseDown = e => {
		let x = e.nativeEvent.offsetX;
		let y = e.nativeEvent.offsetY;
		state.val.cor_x = x;
		state.val.cor_y = y;
		state.coordinates.push({ cor_x: x, cor_y: y });
		state.isdraw = true; //正在画多边形
		console.log("鼠标按下", state);
	};
	const onMouseMove = e => {
		//画布中鼠标移动
		//没开始画或者结束画之后不进行操作
		const x = e.nativeEvent.offsetX;
		const y = e.nativeEvent.offsetY;

		//   console.log(338, state.coordinates.length == 0, !state.isdraw, state.endtip);
		if (state.coordinates.length == 0 || !state.isdraw || state.endtip) {
			return;
		}

		//获取上一个点
		const last_x = state.coordinates[state.coordinates.length - 1].cor_x;
		const last_y = state.coordinates[state.coordinates.length - 1].cor_y;
		state.ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight); //清空画布
		// drawline(); //把之前的点连线

		//获取鼠标移动时的点，画线，实现线段跟踪效果。
		state.ctx.beginPath();
		state.ctx.moveTo(last_x, last_y);

		state.ctx.lineTo(x, y);
		state.ctx.stroke();
		state.ctx.closePath();
		console.log("鼠标移动");
	};

	const onMouseUp = () => {
		console.log("鼠标松开");
	};

	useEffect(() => {
		initDraw();
	}, []);

	const initDraw = () => {
		//初始化画布对象
		if (!mycanvas.current) return;
		const canvas = mycanvas.current;
		const ctx = canvas.getContext("2d");
		state.ctx = ctx;
		ctx.strokeStyle = "rgb(235, 57, 65)";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#ff0000";
		console.log(ctx);
	};

	return (
		<div className="mains">
			<canvas
				className="mycanvas"
				ref={mycanvas}
				width={500}
				height={500}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			/>
		</div>

		// <ArmingTime />
		// <AlarmTimeLine></AlarmTimeLine>
		// <div className="home">
		// 	<img src={welcome} alt="welcome" />
		// </div>
	);
};

export default Home;
