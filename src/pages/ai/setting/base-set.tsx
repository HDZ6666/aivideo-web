import { Button, Checkbox, Form, InputNumber, Radio, Slider, Space } from 'antd';
import { useState } from 'react';

import DeviceSelect from '@/components/device-select';
import SnapshotSelect from '@/components/snapshot-select';
import TimeLine from '@/components/time-line';
import UserSelect from '@/components/user-select';

export type BaseSetProps = {
  selectDeviceable?: boolean;
  frameSetAble?: boolean;
};

export const engineOptions = [
  { label: '产品自带AI', value: '0' },
  { label: '云化AI', value: '1' },
];
export const notificateTypeOptions = [
  { label: '微信', value: '0' },
  { label: '短信', value: '1' },
];

export default function BaseSetComponent({
  selectDeviceable = true,
  frameSetAble = true,
}: BaseSetProps) {
  const [showFrameSet, setShowFrameSet] = useState(false);

  const CompareType2 = (
    <Form.Item label="最小阈值-最大阈值" tooltip="前后帧对比的阈值，默认在0%-100%之间">
      <Space>
        <Form.Item name="compareMinSize" noStyle>
          <InputNumber
            placeholder="最小阈值"
            min={0}
            max={100}
            suffix="%"
            controls={false}
            style={{ width: 100 }}
          />
        </Form.Item>
        <span>至</span>
        <Form.Item name="compareMaxSize" noStyle>
          <InputNumber
            placeholder="最大阈值"
            min={0}
            max={100}
            suffix="%"
            controls={false}
            style={{ width: 100 }}
          />
        </Form.Item>
      </Space>
    </Form.Item>
  );

  const CompareType3 = (
    <Form.Item label="固定帧对比" name="comparePicture">
      <SnapshotSelect />
    </Form.Item>
  );

  function FrameSet() {
    return (
      <div className={showFrameSet ? 'block' : 'hidden'}>
        <Form.Item name="splitTime" label="抽帧间隔">
          <InputNumber min={0} suffix="毫秒" controls={false} />
        </Form.Item>
        <Form.Item name="isCompare" label="是否启动抽帧比对" initialValue={0}>
          <Radio.Group>
            <Radio value={0}> 不对比 </Radio>
            <Radio value={1}> 前后帧对比 </Radio>
            <Radio value={2}> 固定帧对比 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            if (getFieldValue('isCompare') === 0) return null;
            return getFieldValue('isCompare') === 1 ? CompareType2 : [CompareType2, CompareType3];
          }}
        </Form.Item>
      </div>
    );
  }
  return (
    <>
      <Form.Item name="engine" label="接入引擎">
        <Radio.Group options={engineOptions} />
      </Form.Item>
      <Form.Item name="device" label="选择设备">
        <DeviceSelect disabled={!selectDeviceable} />
      </Form.Item>
      <Form.Item label="通知方式" name="notificateType">
        <Checkbox.Group options={notificateTypeOptions} />
      </Form.Item>
      <Form.Item name="notificatePeople" label="通知人员">
        <UserSelect />
      </Form.Item>
      <Form.Item label="检查时间" name="timelines">
        <TimeLine />
      </Form.Item>
      {frameSetAble && (
        <>
          <Form.Item label="抽帧配置">
            <Button type="dashed" danger onClick={() => setShowFrameSet(!showFrameSet)}>
              {showFrameSet ? '收起' : '展开'}
            </Button>
          </Form.Item>
          <FrameSet />
        </>
      )}
      <Form.Item name="alarmTime" label="同一告警间隔通知时间">
        <InputNumber min={0} precision={0} suffix="分钟" controls={false} />
      </Form.Item>
      <Form.Item name="confidence" label="置信度">
        <Slider style={{ width: 500 }} />
      </Form.Item>
    </>
  );
}
