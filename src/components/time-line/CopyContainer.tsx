import { Checkbox, Button, Row, Col } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useState } from 'react';

import { IDay, WEEK } from './interface';

interface IProps {
  dayIndex: number;
  week: IDay[];
  setWeek: (week: IDay[]) => void;
  setCopyVisible: (copyVisible: boolean) => void;
  onComplete?: (week: IDay[]) => void;
}

const copyDays = [
  WEEK.MOMENDAY,
  WEEK.THUESDAY,
  WEEK.WEDNESDAY,
  WEEK.THURSDAY,
  WEEK.FIRDAY,
  WEEK.SATURDAY,
  WEEK.SUNDAY,
];

function CopyContainer({ dayIndex, week, setWeek, setCopyVisible, onComplete }: IProps) {
  const [checkedList, setCheckedList] = useState<string[]>([copyDays[dayIndex]]);
  const checkAll = copyDays.length === checkedList.length;
  const indeterminate = checkedList.length < copyDays.length;

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? copyDays : [copyDays[dayIndex]]);
  };

  const onCheckSingleChange = (list: string[]) => {
    setCheckedList(list);
  };

  const confirm = () => {
    const { timelines } = week[dayIndex];
    const weekN = week.map((day, index) => {
      if (index !== dayIndex && checkedList.some((item) => item === day.day)) {
        day.timelines = timelines.map((track) => {
          return {
            ...track,
            id: `${day.day}-${track.startTime}-${track.endTime}`,
          };
        });
      }
      return day;
    });
    setWeek(weekN);
    setCopyVisible(false);
    onComplete && onComplete(weekN);
  };
  return (
    <div>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          全选
        </Checkbox>
      </div>
      <Checkbox.Group value={checkedList} onChange={onCheckSingleChange}>
        <Row>
          {copyDays.map((item, i) => {
            return (
              <Col span={8} key={i}>
                <Checkbox value={item} disabled={i === dayIndex}>
                  {item}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
      <div className="pop-footer">
        <Button
          size="small"
          type="default"
          style={{ marginRight: '10px' }}
          onClick={() => setCopyVisible(false)}
        >
          取消
        </Button>
        <Button size="small" type="primary" onClick={confirm}>
          确认
        </Button>
      </div>
    </div>
  );
}

export default CopyContainer;
