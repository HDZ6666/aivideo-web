import { Table } from "antd";
import { useEffect, useState } from "react";
import "./index.less";

const MyTable = ({ scroll, ...restProps }: any) => {
	const [tableHeight, setTableHeight] = useState("100%");
	useEffect(() => {
		const y = document.querySelector("#my-table-container")?.clientHeight;
		y && setTableHeight(`${y - 32 - 56}px`);
	}, []);
	return (
		<div id="my-table-container">
			<Table {...restProps} scroll={{ x: scroll.x, y: tableHeight }} />;
		</div>
	);
};

export default MyTable;
