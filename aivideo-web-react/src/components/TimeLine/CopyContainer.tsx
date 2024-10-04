import { FC, useState } from "react";
import { Checkbox, Button, Row, Col } from "antd";
import { cloneDeep } from "lodash";
import { ICopyDay, WEEK } from "./interface";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

interface IProps {
	dayIndex: number;
	handleCopyVisible: () => void;
	handleCopySave: (copyIndexs: number[]) => void;
}

const CopyContainer: FC<IProps> = ({ dayIndex, handleCopyVisible, handleCopySave }) => {
	const [checkAll, setCheckAll] = useState<boolean>(false);
	const [indeterminate, setIndeterminate] = useState<boolean>(true);
	const [copyDays, setCopyDays] = useState<ICopyDay[]>([
		{
			day: WEEK.MOMENDAY,
			checked: false
		},
		{
			day: WEEK.THUESDAY,
			checked: false
		},
		{
			day: WEEK.WEDNESDAY,
			checked: false
		},
		{
			day: WEEK.THURSDAY,
			checked: false
		},
		{
			day: WEEK.FIRDAY,
			checked: false
		},
		{
			day: WEEK.SATURDAY,
			checked: false
		},
		{
			day: WEEK.SUNDAY,
			checked: false
		}
	]);

	const onCheckAllChange = (e: CheckboxChangeEvent) => {
		let _copyDays: ICopyDay[] = cloneDeep(copyDays);
		_copyDays.forEach(item => {
			if (e.target.checked && !item.checked) {
				item.checked = true;
			}
			if (!e.target.checked) {
				item.checked = e.target.checked;
			}
		});
		setCopyDays(_copyDays);
		setIndeterminate(false);
		setCheckAll(e.target.checked);
	};

	const onCheckSingleChange = (e: CheckboxChangeEvent, index: number) => {
		let _copyDays: ICopyDay[] = cloneDeep(copyDays),
			_indeterminate: boolean = true,
			_checkAll: boolean = false;
		_copyDays[index].checked = e.target.checked;
		if (!_copyDays.find(item => !item.checked)) {
			_indeterminate = false;
			_checkAll = true;
		}
		setCopyDays(_copyDays);
		setIndeterminate(_indeterminate);
		setCheckAll(_checkAll);
	};

	const confirm = () => {
		let _copyDays: ICopyDay[] = cloneDeep(copyDays),
			copyIndexs: number[] = [];
		_copyDays.forEach((item, i) => {
			if (item.checked && i !== dayIndex) {
				copyIndexs.push(i);
				item.checked = false;
			}
		});
		setCopyDays(_copyDays);
		handleCopySave(copyIndexs);
	};
	return (
		<div>
			<div style={{ borderBottom: "1px solid #E9E9E9" }}>
				<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
					全选
				</Checkbox>
			</div>
			<Row>
				{copyDays.map((item, i) => {
					if (i === dayIndex) {
						item.checked = true;
					}
					return (
						<Col span={8} key={i}>
							<Checkbox
								disabled={i === dayIndex}
								checked={item.checked}
								onChange={(e: CheckboxChangeEvent) => onCheckSingleChange(e, i)}
							>
								{item.day}
							</Checkbox>
						</Col>
					);
				})}
			</Row>
			<div className="pop-footer">
				<Button size="small" type="default" style={{ marginRight: "10px" }} onClick={handleCopyVisible}>
					取消
				</Button>
				<Button size="small" type="primary" onClick={confirm}>
					确认
				</Button>
			</div>
		</div>
	);
};

export default CopyContainer;
