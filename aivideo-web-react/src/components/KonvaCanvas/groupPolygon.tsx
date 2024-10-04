import { Fragment } from "react";
import { Circle, Line } from "react-konva";
import { GroupType } from "./konvaType";

interface KonvaCanvasProps {
	groupList: GroupType[];
}

const GroupPolygon = ({ groupList }: KonvaCanvasProps) => {
	return (
		<Fragment>
			{groupList.map((item, index) => {
				if (item.type === "circle") {
					return (
						<Circle
							key={index}
							id={`cicle_${index}`}
							x={item.points[0]}
							y={item.points[1]}
							radius={item.width}
							fill={item.fill}
						/>
					);
				} else if (item.type === "line") {
					return <Line key={index} id={`line_${index}`} points={item.points} stroke={item.fill} strokeWidth={item.width} />;
				}
			})}
		</Fragment>
	);
};

export default GroupPolygon;
