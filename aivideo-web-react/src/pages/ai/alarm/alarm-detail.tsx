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
  const [type, setType] = useState('image'); // image, video, live
  const [liveVideoUrl, setLiveVideoUrl] = useState(''); // 实时视频URL
  const options = [
    { label: '查看图片', value: 'image' },
    { label: '查看回放', value: 'video' },
    { label: '实时视频', value: 'live' },
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

  // 实时视频播放 mutation
  const { isLoading: liveVideoLoading, mutate: getLiveVideoMutation } = useMutation(
    aiService.getLiveVideoStart,
    {
      onSuccess: (response) => {
        // 根据当前协议选择视频流URL
        let videoUrl = '';
        if (window.location.protocol === 'https:') {
          videoUrl = response.wss_flv || '';
        } else {
          videoUrl = response.ws_flv || '';
        }

        if (videoUrl) {
          setLiveVideoUrl(videoUrl);
        } else {
          message.error('获取实时视频流失败');
        }
      },
    },
  );

  const onAlarmHandle = (status: number) => {
    mutate({ alarmId: alarmItem!.id, status });
  };

  // 获取实时视频流地址
  const getLiveVideoUrl = () => {
    if (!alarmDetail?.detail?.national_num || !alarmDetail?.detail?.channel) {
      message.error('缺少设备参数，无法获取实时视频');
      return;
    }

    // 使用 mutation 调用接口
    getLiveVideoMutation({
      national_num: alarmDetail.detail.national_num,
      channel: alarmDetail.detail.channel,
    });
  };

  // 处理类型切换
  const handleTypeChange = (newType: string) => {
    setType(newType);
    // 当切换到实时视频时，自动获取视频流
    if (newType === 'live') {
      getLiveVideoUrl();
    }
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
        setLiveVideoUrl(''); // 重置实时视频URL
      }}
    >
      {alarmDetail ? (
        <Row gutter={[16, 0]}>
          <Col span={14}>
            <Flex className="mb-2">
              <Radio.Group
                value={type}
                buttonStyle="solid"
                onChange={(e) => handleTypeChange(e.target.value)}
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
                      className="bg-black object-contain"
                      src={alarmDetail.alarm_img}
                    />
                  </Image.PreviewGroup>
                </Flex>
                <Flex wrap>
                  <Image
                    width="80px"
                    height="60px"
                    className="bg-black object-cover hover:cursor-pointer hover:opacity-80"
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
            {type === 'live' && <LivePlayer videoUrl={liveVideoUrl} live />}
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
