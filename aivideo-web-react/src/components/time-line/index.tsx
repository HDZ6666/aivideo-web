import { Popconfirm, Button, Row, Col } from 'antd';
import { clone } from 'ramda';
import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';

import Day from './Day';
import './index.css';
import { IDay, IDayForm, WEEK } from './interface';
import { timeToCoordinate } from './util';

interface TimeLineProps {
  value?: IDayForm[];
  onChange?: (value: IDayForm[]) => void;
}

const TimeLine = forwardRef((props: TimeLineProps, ref) => {
  const { value, onChange } = props;
  useImperativeHandle(ref, () => ({
    batchDelete,
  }));

  const [week, setWeek] = useState<IDay[]>([
    { day: WEEK.MOMENDAY, timelines: [] },
    { day: WEEK.THUESDAY, timelines: [] },
    { day: WEEK.WEDNESDAY, timelines: [] },
    { day: WEEK.THURSDAY, timelines: [] },
    { day: WEEK.FIRDAY, timelines: [] },
    { day: WEEK.SATURDAY, timelines: [] },
    { day: WEEK.SUNDAY, timelines: [] },
  ]);

  useEffect(() => {
    if (value?.length) {
      const weekN: IDay[] = value.map((day) => {
        return {
          day: day.day,
          timelines: day.timelines.map((track) => {
            return {
              id: `${day.day}-${track.startTime}-${track.endTime}`,
              ...timeToCoordinate(track.startTime, track.endTime),
            };
          }),
        };
      });

      setWeek(weekN);
    }
  }, [value]);

  const onComplete = (week: IDay[]) => {
    const weekN: IDayForm[] = week.map((day) => {
      return {
        day: day.day,
        timelines: day.timelines.map((track) => {
          return {
            id: track.id,
            startTime: track.startTime,
            endTime: track.endTime,
          };
        }),
      };
    });
    onChange && onChange(weekN);
  };
  // 批量删除
  const batchDelete = () => {
    const weekN: IDay[] = clone(week);
    weekN.forEach((day) => {
      day.timelines = [];
    });
    setWeek(weekN);
    onChange && onChange(weekN);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Popconfirm
          title="确定批量删除吗"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            batchDelete();
          }}
        >
          <Button type="link" danger>
            全部删除
          </Button>
        </Popconfirm>
      </Col>
      {week.map((item, i) => {
        return (
          <Col span={24} key={item.day}>
            <Day dayIndex={i} setWeek={setWeek} week={week} onComplete={onComplete} />
          </Col>
        );
      })}
    </Row>
  );
});

export default TimeLine;
