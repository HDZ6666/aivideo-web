import { Button, Checkbox, Form, InputNumber, Radio, Slider, Space } from 'antd';
import { useState } from 'react';

import DeviceSelect from '@/components/device-select';
import SnapshotSelect from '@/components/snapshot-select';
import TimeLine from '@/components/time-line';
import UserSelect from '@/components/user-select';

export type BaseSetProps = {
  selectDeviceable?: boolean;
  frameSetAble?: boolean;
  alarmTypeId?: number; // 告警类型ID，由父组件传入
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
  alarmTypeId,
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

  const CountType = (
    <Form.Item name="countType" label="统计类型" initialValue={0}>
      <Radio.Group>
        <Radio value={0}> 区域统计 </Radio>
        <Radio value={1}> 进出统计 </Radio>
      </Radio.Group>
    </Form.Item>
  );

  function FrameSet() {
    return (
      <div className={showFrameSet ? 'block' : 'hidden'}>
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
      <Form.Item name="splitTime" label="抽帧间隔" initialValue={1000}>
        <InputNumber min={0} suffix="毫秒" controls={false} />
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
      <Form.Item name="isCount" label="统计和告警配置" initialValue={0}>
        <Radio.Group>
          <Radio value={0}> 只告警 </Radio>
          <Radio value={1}> 只统计 </Radio>
          <Radio value={2}> 告警并统计 </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          if (getFieldValue('isCount') === 0) return null;
          return CountType;
        }}
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const showTracking = alarmTypeId === 11 || alarmTypeId === 82; // 是否存在目标追踪配置
          const trackingEnabled = getFieldValue('trackingEnabled'); // 目标追踪是否启用（1 启用，0 禁用）
          const hideAlarmTime = showTracking && trackingEnabled === 1; // 启用目标追踪时隐藏同一告警间隔通知时间

          // 1. 没有目标追踪时：默认展示 alarmTime
          // 2. 有目标追踪时：trackingEnabled 启用隐藏，禁用显示
          if (hideAlarmTime) return null;

          return (
            <Form.Item name="alarmTime" label="同一告警间隔通知时间">
              <InputNumber min={0} precision={0} suffix="分钟" controls={false} />
            </Form.Item>
          );
        }}
      </Form.Item>
      {/* 目标追踪配置：仅在特定告警类型下展示 */}
      {(alarmTypeId === 11 || alarmTypeId === 82) && (
        <Form.Item label="目标追踪" tooltip="只有人员和车辆检测才有目标追踪功能">
          <Space>
            <Form.Item name="trackingEnabled" noStyle initialValue={1}>
              <Radio.Group>
                <Radio value={0}>禁用</Radio>
                <Radio value={1}>启用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                return getFieldValue('trackingEnabled') === 1 ? (
                  <Form.Item name="trackingDuration" noStyle>
                    <InputNumber
                      style={{ width: 120 }}
                      min={0}
                      precision={0}
                      suffix="分钟"
                      controls={false}
                      placeholder="停留时间"
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </Space>
        </Form.Item>
      )}
      <Form.Item name="confidence" label="置信度">
        <Slider style={{ width: '100%', maxWidth: 500 }} />
      </Form.Item>
    </>
  );
}
