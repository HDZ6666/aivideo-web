import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Radio, Space, message, Flex, Spin } from 'antd';
import { useState } from 'react';

import aiService, { DeviceItem, RuleItem } from '@/api/services/aiService';
import DefalutCamera from '@/assets/images/camera/defalut.png';
import KonvasCanvas, { ImgProps } from '@/components/konvas';

import BaseSet from './base-set';

export type EditRulePageProps = {
  alarmTypeId: string;
  selectedRows: RuleItem[];
  setActionType: (actionType: string) => void;
};

function EditDeviceRulePage({ alarmTypeId, selectedRows, setActionType }: EditRulePageProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('a');
  const [bgImage, setBgImage] = useState<ImgProps>({
    url: '',
    realUrl: DefalutCamera,
    loaded: false,
    onLoad: () => {
      setBgImage((pre) => ({ ...pre, loaded: true }));
    },
    onError: () => {
      message.error('图片加载失败');
      setBgImage((pre) => ({ ...pre, loaded: true }));
    },
  });
  const [form] = Form.useForm();
  const formInitValue = {
    device: selectedRows.reduce((pre, cur) => {
      return pre.concat(cur.device);
    }, [] as DeviceItem[]),
  };

  const options = [
    { label: '区域设置', value: 'a' },
    { label: '基础设置', value: 'b' },
  ];

  const { isLoading: updateLoading, mutate } = useMutation(aiService.updateRuleByDevice, {
    onSuccess: () => {
      message.success('操作成功');
      // 直接修改缓存的数据状态，减少重复请求
      queryClient.refetchQueries(['getRuleListByAlarmType']);
      handleRouteBack();
    },
    onError: () => {
      message.success('操作失败');
    },
  });

  const FormSubmit = (values: any) => {
    const ruleIds = selectedRows.map((item) => item.id);
    const data = { ...values, alarmTypeId, ruleIds };
    mutate(data);
  };

  const handleRouteBack = () => {
    setActionType('list');
  };

  return (
    <Card title="告警批量设置">
      <Flex className="mb-4">
        <Radio.Group
          value={type}
          buttonStyle="solid"
          size="large"
          onChange={(e) => setType(e.target.value)}
          options={options}
          optionType="button"
        />
      </Flex>
      <Spin spinning={updateLoading}>
        <Form form={form} onFinish={FormSubmit} initialValues={formInitValue}>
          <div className={type === 'a' ? 'block' : 'hidden'}>
            <Form.Item name="areaSet" label="">
              <KonvasCanvas bgImage={bgImage} mtype="area" />
            </Form.Item>
          </div>
          <div className={type === 'b' ? 'block' : 'hidden'}>
            <BaseSet selectDeviceable={false} frameSetAble={false} />
          </div>
          <Space>
            <Button type="default" onClick={handleRouteBack}>
              返回
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </Form>
      </Spin>
    </Card>
  );
}

export default EditDeviceRulePage;
