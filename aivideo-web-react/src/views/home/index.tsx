import "./index.less";
// import KonvaCanvas from "@/components/KonvaCanvas";
// import welcome from "@/assets/images/welcome.png";
// import { Button, Row, Col, Space, Select } from "antd";
// import { useRef } from "react";

const Home = () => {
	return (
		<div className="home">
			{/* <KonvaCanvas
				bgImage="/src/assets/images/welcome.png"
				onComplete={group => {
					console.log("完成绘制");
					console.log(group);
				}}
			/> */}
			{/* <Row>
				<Col span={24}>
					<Space>
						<Select
							options={[
								{ value: "rect", label: "矩形" },
								{ value: "polygon", label: "自定义图案" },
								{ value: "lineAB", label: "线段AB" },
								{ value: "lineBA", label: "线段BA" },
								{ value: "line", label: "线段" }
							]}
						></Select>
						<Button onClick={reast}>重置</Button>
					</Space>
				</Col>
			</Row> */}
			{/* <div className="aiDraw">
				<img src={welcome} />
				<div className="canvas1">
					<KonvaCanvas
						onComplete={group => {
							console.log("完成绘制");
							console.log(group);
						}}
					/>
				</div>
			</div> */}
		</div>
	);
};

export default Home;
