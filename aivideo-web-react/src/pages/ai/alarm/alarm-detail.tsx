import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Image,
  Col,
  Descriptions,
  Modal,
  Row,
  Space,
  Tag,
  message,
  Empty,
  Flex,
  Radio,
} from 'antd';
import { CSSProperties, useState } from 'react';

import aiService, { AlarmListItem } from '@/api/services/aiService';
import LivePlayer from '@/components/live-player';

export type AlarmDetailModalProps = {
  alarmItem: AlarmListItem | undefined;
  show: boolean;
  close: VoidFunction;
};

export default function AlarmDetailModal({ show, alarmItem, close }: AlarmDetailModalProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('image'); // image or video
  const options = [
    { label: '查看图片', value: 'image' },
    { label: '查看回放', value: 'video' },
  ];

  const { data: alarmDetail, isLoading } = useQuery({
    queryKey: ['alarmDetail', { alarmID: alarmItem?.id }],
    queryFn: () => aiService.getAlarmDetailByID({ alarm_id: alarmItem!.id }),
    enabled: show,
    staleTime: 10 * 1000,
  });

  const { isLoading: updateLoading, mutate } = useMutation(aiService.updateAlarmStatusByID, {
    onSuccess: (_data, variables) => {
      message.success('操作成功');
      // 直接修改缓存的数据状态，减少重复请求
      const currentAlarmDetail = { ...alarmDetail, status: variables.status };
      queryClient.setQueryData(['alarmDetail', { alarmID: variables.alarmId }], currentAlarmDetail);
    },
  });

  const onAlarmHandle = (status: number) => {
    mutate({ alarmId: alarmItem!.id, status });
  };

  const footer = () => {
    const footerBtn = [
      [
        <Button key="2" onClick={() => onAlarmHandle(2)} loading={updateLoading}>
          误报{updateLoading}
        </Button>,
        <Button key="1" type="primary" onClick={() => onAlarmHandle(1)} loading={updateLoading}>
          快速处理{updateLoading}
        </Button>,
      ],
      [
        <Button disabled key="1">
          已处理{updateLoading}
        </Button>,
      ],
      [
        <Button disabled key="2">
          误报{updateLoading}
        </Button>,
      ],
    ];
    return alarmDetail ? footerBtn[alarmDetail.status] : null;
  };

  const style: CSSProperties = {
    width: '480px',
    height: '280px',
    backgroundColor: '#000',
    padding: '5px',
    boxSizing: 'border-box',
  };

  return (
    <Modal
      title="告警详情"
      open={show}
      onCancel={close}
      footer={footer}
      width={900}
      loading={isLoading}
      getContainer={false}
      afterOpenChange={() => {
        setType('image');
      }}
    >
      {alarmDetail ? (
        <Row gutter={[16, 0]}>
          <Col span={14}>
            <Flex className="mb-2">
              <Radio.Group
                value={type}
                buttonStyle="solid"
                onChange={(e) => setType(e.target.value)}
                options={options}
                optionType="button"
              />
            </Flex>
            {type === 'image' && (
              <>
                <Flex style={{ ...style }}>
                  <Image.PreviewGroup>
                    <Image
                      width="100%"
                      height="100%"
                      className="object-contain bg-black"
                      src={alarmDetail.alarm_img}
                    />
                  </Image.PreviewGroup>
                </Flex>
                <Flex wrap>
                  <Image
                    width="80px"
                    height="60px"
                    className="object-cover bg-black hover:cursor-pointer hover:opacity-80"
                    src={alarmDetail.alarm_img}
                    preview={false}
                  />
                  {/* <Image
                    width="80px"
                    height="60px"
                    className="object-cover bg-black hover:cursor-pointer hover:opacity-80"
                    src={alarmDetail.alarm_img}
                    preview={false}
                  /> */}
                </Flex>
              </>
            )}
            {type === 'video' && <LivePlayer videoUrl={alarmDetail.videoUrl} />}
          </Col>
          <Col span={10}>
            <Descriptions title="告警信息" column={1}>
              <Descriptions.Item label="检测类型">
                <span className="font-bold">{alarmDetail.modelname}</span>
              </Descriptions.Item>
              <Descriptions.Item label="置信度">90%</Descriptions.Item>
              {/* <Descriptions.Item label="区域统计">
                <span className="font-bold text-error">80</span>
              </Descriptions.Item> */}
              {/* <Descriptions.Item label="进入数量">
                <span className="font-bold text-error">80</span>
              </Descriptions.Item>
              <Descriptions.Item label="出去数量">
                <span className="font-bold text-error">80</span>
              </Descriptions.Item> */}
              <Descriptions.Item label="设备名称">
                {alarmDetail.device_name || ''}
              </Descriptions.Item>
              <Descriptions.Item label="通知方式">
                {alarmDetail.notice_type || '微信'}
              </Descriptions.Item>
              <Descriptions.Item label="通知人">
                <Space className="info-detail-notice">
                  {alarmDetail.notice_unames?.map((user: any) => {
                    return <Tag>{user}</Tag>;
                  })}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="告警时间">{alarmDetail.alarm_time}</Descriptions.Item>
              {/* <Descriptions.Item label="处理人"></Descriptions.Item> */}
            </Descriptions>
          </Col>
        </Row>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Modal>
  );
}
