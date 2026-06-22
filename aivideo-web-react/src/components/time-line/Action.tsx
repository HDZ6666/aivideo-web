import { Popover, Button } from 'antd';
import { useState } from 'react';

import CopyContainer from './CopyContainer';
import { IDay } from './interface';

interface IProps {
  week: IDay[];
  dayIndex: number;
  setWeek: (week: IDay[]) => void;
  onComplete?: (week: IDay[]) => void;
}

export default function Action(props: IProps) {
  const { week, setWeek, dayIndex, onComplete } = props;
  const [copyVisible, setCopyVisible] = useState<boolean>(false);
  const { timelines } = week[dayIndex];

  const handleCopyVisible = () => {
    setCopyVisible((copyVisible) => !copyVisible);
  };

  return (
    <Popover
      content={
        <CopyContainer
          dayIndex={dayIndex}
          week={week}
          setWeek={setWeek}
          setCopyVisible={setCopyVisible}
          onComplete={onComplete}
        />
      }
      destroyTooltipOnHide
      title="复制到..."
      trigger="click"
      open={copyVisible}
      onOpenChange={handleCopyVisible}
    >
      <Button danger type="text" className="!h-4 !p-0" disabled={timelines.length === 0}>
        复制
      </Button>
    </Popover>
  );
}
