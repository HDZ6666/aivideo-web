import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Radio, Space, message, Flex, Spin } from 'antd';
import { useState } from 'react';

import aiService from '@/api/services/aiService';

import BaseSet from './base-set';

export type AddRulePageProps = {
  alarmTypeId: string;
  setActionType: (actionType: string) => void;
};

function AddRulePage({ alarmTypeId, setActionType }: AddRulePageProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('b');
  const [form] = Form.useForm();
  const options = [{ label: '基础设置', value: 'b' }];

  const { isLoading, mutate } = useMutation(aiService.addRuleByAlarmType, {
    onSuccess: () => {
      message.success('添加规则成功');
      // 更新查询接口数据
      queryClient.refetchQueries(['getRuleListByAlarmType']);
      handleRouteBack();
    },
  });

  const FormSubmit = (values: any) => {
    const data = { ...values, alarmTypeId };
    mutate(data);
  };

  const handleRouteBack = () => {
    setActionType('list');
  };

  return (
    <Card title="告警规则新增">
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
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={FormSubmit}>
          <BaseSet frameSetAble={false} />
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

export default AddRulePage;
