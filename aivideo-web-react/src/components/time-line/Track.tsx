import { Popover } from 'antd';
import { clone } from 'ramda';
import { useState } from 'react';

import EditTime from './EditTime';
import { IDay } from './interface';

interface IProps {
  week: IDay[];
  dayIndex: number;
  trackIndex: number;
  setWeek: (week: IDay[]) => void;
  onComplete?: (week: IDay[]) => void;
}

function Track(props: IProps) {
  const { week, dayIndex, trackIndex, setWeek } = props;
  const timeline = week[dayIndex].timelines[trackIndex];
  const [visible, setVisible] = useState<boolean>(false);
  const style: React.CSSProperties = {
    visibility: 'visible',
    left: `${timeline.startX}px`,
    width: `${timeline.length}px`,
  };
  if (timeline.border) {
    style.border = '1px dotted rgb(34 103 0)';
  }

  const handleVisibleChange = (visible: boolean) => {
    const weekN = clone(week);
    weekN[dayIndex].timelines[trackIndex].border = visible;
    setWeek(weekN);
    setVisible(visible);
  };
  return (
    <Popover
      title="修改时间"
      content={
        <EditTime {...props} setVisible={setVisible} handleVisibleChange={handleVisibleChange} />
      }
      destroyTooltipOnHide
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
    >
      <div className="timeline-track" style={style} />
    </Popover>
  );
}

export default Track;
