import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Radio, Space, message, Flex, Spin } from 'antd';
import { useState } from 'react';

import aiService from '@/api/services/aiService';
import KonvasCanvas, { ImgProps } from '@/components/konvas';
import SnapshotModal from '@/components/snapshot-select/snapshot-modal';

import BaseSet from './base-set';

import { baseApiUrl } from '#/enum';

export type EditRulePageProps = {
  alarmTypeId: string;
  ruleId: number;
  setActionType: (actionType: string) => void;
};

function EditRulePage({ alarmTypeId, ruleId, setActionType }: EditRulePageProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('a');
  const [bgImage, setBgImage] = useState<ImgProps>({
    url: '',
    realUrl: '',
    loaded: false,
    onLoad: () => {
      setBgImage((pre) => ({ ...pre, loaded: true }));
    },
    onError: () => {
      message.error('图片加载失败');
      setBgImage((pre) => ({ ...pre, loaded: true }));
    },
  });
  const [snapshotModalShow, setSnapshotModalShow] = useState<boolean>(false);
  const [form] = Form.useForm();

  const options = [
    { label: '区域设置', value: 'a' },
    { label: '基础设置', value: 'b' },
  ];

  const { isLoading } = useQuery({
    queryKey: ['getRuleDetail', { alarmTypeId, ruleId }],
    staleTime: 0,
    cacheTime: 0,
    queryFn: () => aiService.getRuleDetail({ ruleId }),
    onSuccess: (data) => {
      const { imgLink } = data;
      if (imgLink) {
        setBgImage((pre) => ({ ...pre, realUrl: `${baseApiUrl}${imgLink}`, url: imgLink }));
      } else {
        setBgImage((pre) => ({ ...pre, loaded: true }));
      }
      form.setFieldsValue(data);
    },
  });

  const { mutate: reshImg } = useMutation(aiService.getDeviceSnap, {
    onSuccess: (data) => {
      setBgImage((pre) => ({
        ...pre,
        realUrl: `${baseApiUrl}${data}`,
        url: data,
        loaded: true,
      }));
      message.success('操作成功');
    },
    onError: () => {
      setBgImage((pre) => ({
        ...pre,
        loaded: true,
      }));
      message.error('操作失败');
    },
  });

  const { mutate: snapshotSave, isLoading: saveSnapshotLoading } = useMutation(
    aiService.getSnapshotSave,
    {
      onSuccess: () => {
        message.success('操作成功');
        queryClient.refetchQueries(['getSnapshotList']);
      },
      onError: () => {
        message.error('操作失败');
      },
    },
  );

  const { isLoading: updateLoading, mutate } = useMutation(aiService.updateRuleByAlarmType, {
    onSuccess: () => {
      message.success('操作成功');
      // 直接修改缓存的数据状态，减少重复请求
      queryClient.refetchQueries(['getRuleListByAlarmType']);
      handleRouteBack();
    },
    onError: () => {
      message.error('操作失败');
    },
  });

  const FormSubmit = (values: any) => {
    const data = { ...values, alarmTypeId, ruleId, imgLink: bgImage.url };
    mutate(data);
  };

  const handleRouteBack = () => {
    setActionType('list');
  };

  const handleRefreshImg = () => {
    setBgImage((pre) => ({ ...pre, loaded: false }));
    const device = form.getFieldValue('device');
    const { deviceId, channelId } = device[0];
    reshImg({ deviceId, channelId });
  };

  const handleSnapshotSave = () => {
    const device = form.getFieldValue('device');
    const { deviceId, channelId } = device[0];
    snapshotSave({ deviceId, channelId });
  };

  const buttons = (
    <>
      <Button type="primary" onClick={handleRefreshImg}>
        刷新抽图
      </Button>
      <Button onClick={handleSnapshotSave} loading={saveSnapshotLoading}>
        保存截图
      </Button>
      <Button onClick={() => setSnapshotModalShow(true)}>历史快照</Button>
    </>
  );
  return (
    <Card title="告警设置" loading={isLoading}>
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
        <Form form={form} onFinish={FormSubmit}>
          <div className={type === 'a' ? 'block' : 'hidden'}>
            <Form.Item name="areaSet" label="">
              <KonvasCanvas bgImage={bgImage} buttons={buttons} mtype="all" />
            </Form.Item>
          </div>
          <div className={type === 'b' ? 'block' : 'hidden'}>
            <BaseSet selectDeviceable={false} alarmTypeId={Number(alarmTypeId)} />
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
        <SnapshotModal select={false} show={snapshotModalShow} setShow={setSnapshotModalShow} />
      </Spin>
    </Card>
  );
}

export default EditRulePage;
