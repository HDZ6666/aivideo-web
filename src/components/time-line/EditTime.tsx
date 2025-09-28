import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, message, TimePicker, Segmented, Input, Space } from 'antd';
import moment from 'dayjs';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { clone } from 'ramda';
import { useState } from 'react';

import { IDay } from './interface';
import { timeToCoordinate, canEditTime } from './util';

moment.extend(IsSameOrAfter);

interface IProps {
  week: IDay[];
  dayIndex: number;
  trackIndex: number;
  setWeek: (week: IDay[]) => void;
  setVisible: (visible: boolean) => void;
  handleVisibleChange: (visible: boolean) => void;
  onComplete?: (week: IDay[]) => void;
}

const format = 'HH:mm';

function EditTime(props: IProps) {
  const { week, dayIndex, trackIndex, setWeek, setVisible, handleVisibleChange, onComplete } =
    props;
  const day = week[dayIndex];
  const { timelines } = day;
  const track = timelines[trackIndex];
  const [startTime, setStartTime] = useState(moment(track.startTime, format));
  const [endTime, setEndTime] = useState(moment(track.endTime, format));
  const [endTimeChange, setEndTimeChange] = useState<string>(
    track.endTime === '24:00' ? '次日' : '当天',
  );

  const deleteTrack = () => {
    const weekN = clone(week);
    weekN[dayIndex].timelines.splice(trackIndex, 1);
    setWeek(weekN);
    setVisible(false);
    onComplete && onComplete(weekN);
  };

  const handleEndTimeChange = (value: string) => {
    // 次日转当天 要扣减一天
    if (value === '当天' && track.endTime === '24:00') {
      setEndTime(moment('00:00', format));
    }
    setEndTimeChange(value);
  };

  const handleConfirm = () => {
    if (endTimeChange === '当天' && startTime.isSameOrAfter(endTime)) {
      message.error('开始时间不能晚于或者等于结束时间');
      return;
    }
    const finallyStartTime = startTime.format('HH:mm');
    const finallyEndTime = endTimeChange === '当天' ? endTime.format('HH:mm') : '24:00';

    const timeObj = timeToCoordinate(finallyStartTime, finallyEndTime);
    console.log(timeObj);
    if (!canEditTime(timelines, trackIndex, timeObj.startX, timeObj.endX)) {
      message.error('时间有重叠');
      return;
    }

    const trackN = {
      ...timeObj,
      id: `${day.day}-${timeObj.startTime}-${timeObj.endTime}`,
      border: false,
    };
    const weekN = clone(week);
    weekN[dayIndex].timelines[trackIndex] = trackN;
    setWeek(weekN);
    setVisible(false);
    onComplete && onComplete(weekN);
  };

  return (
    <div className="edit-time-container">
      <div className="edit-time">
        <div className="time-content">
          <div className="end-time-choose">
            <Segmented size="small" options={['当天']} />
          </div>
          <div className="time-wapper">
            <TimePicker
              placeholder="开始时间1"
              value={startTime}
              format={format}
              allowClear={false}
              showNow={false}
              needConfirm={false}
              onChange={(time) => setStartTime(time)}
            />
          </div>
        </div>
        <span className="time-label">至</span>
        <div className="time-content">
          <div className="end-time-choose">
            <Segmented
              size="small"
              options={['当天', '次日']}
              value={endTimeChange}
              onChange={handleEndTimeChange}
            />
          </div>
          <div className="time-wapper">
            <div className="input-wrapper" style={{ zIndex: endTimeChange === '次日' ? 2 : -1 }}>
              <Input
                value="24:00"
                suffix={<ClockCircleOutlined style={{ color: 'RGBA(0,0,0,0.25)', fontSize: 14 }} />}
              />
            </div>
            <TimePicker
              placeholder="结束时间"
              value={endTime}
              format={format}
              allowClear={false}
              showNow={false}
              needConfirm={false}
              onChange={(time) => setEndTime(time)}
            />
          </div>
        </div>
      </div>
      <div className="pop-footer">
        <Space>
          <Button size="small" type="link" danger onClick={deleteTrack}>
            删除
          </Button>
          <Button
            size="small"
            type="default"
            onClick={() => {
              handleVisibleChange(false);
            }}
          >
            取消
          </Button>
          <Button size="small" type="primary" onClick={handleConfirm}>
            保存
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default EditTime;
