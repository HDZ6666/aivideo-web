import { faker } from '@faker-js/faker';
import { Button, Col, Row, Space, Tag } from 'antd';

import Card from '@/components/card';
import { SvgIcon } from '@/components/icon';

export default function ConnectionsTab() {
  const items = [
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 1,
      count: 1,
      in: 100,
      out: 90,
      num: 10,
    },
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 2,
      count: 2,
      in: 100,
      out: 90,
      num: 10,
      startTime: faker.date.past().toLocaleString(),
      endTime: faker.date.past().toLocaleString(),
    },
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 1,
      count: 2,
      in: 100,
      out: 90,
      num: 10,
    },
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 1,
      count: 1,
      in: 100,
      out: 90,
      num: 10,
    },
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 1,
      count: 1,
      in: 100,
      out: 90,
      num: 10,
    },
    {
      name: '华侨城南区1号楼',
      tag: '行人统计',
      timeType: 1,
      count: 1,
      in: 100,
      out: 90,
      num: 10,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col span={24} md={12} lg={8} key={item.name}>
          <Card className="relative h-72 w-full">
            <div className="absolute left-2 top-2 flex items-center">
              <SvgIcon
                icon={item.timeType === 1 ? 'ic_live' : 'ic_history'}
                size={20}
                color="#2065d1"
              />
              <span className="ml-1 font-semibold opacity-60">
                {item.timeType === 1 ? '实时' : '历史'}
              </span>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-between">
              <span className="mt-2 text-xl font-semibold opacity-60">{item.name}</span>
              <div className="mt-4 flex gap-4">
                <Tag color={faker.color.rgb()}>{item.tag}</Tag>
              </div>
              <div className="mt-4 flex gap-10">
                {item.count === 1 && (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-semibold">{item.num}</span>
                    <span className="text-base opacity-60">区域数量</span>
                  </div>
                )}
                {item.count === 2 && (
                  <>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-semibold">{item.num}</span>
                      <span className="text-base opacity-60">实时</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-semibold">{item.in}</span>
                      <span className="text-base opacity-60">进</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-semibold">{item.out}</span>
                      <span className="text-base opacity-60">出</span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 flex">
                <span className="ml-2 text-sm opacity-60">
                  {item.timeType === 1
                    ? faker.date.past().toLocaleString()
                    : `${item.startTime} - ${item.endTime}`}
                </span>
              </div>
              <div className="mt-4 flex">
                <Space>
                  <Button type="primary">
                    <span>编辑</span>
                  </Button>
                  <Button type="dashed" danger>
                    <span>删除</span>
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
