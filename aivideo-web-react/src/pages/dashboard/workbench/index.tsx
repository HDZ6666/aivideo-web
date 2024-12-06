import { Col, Row } from 'antd';

import { TodayAlarm, OnlineDevice, TotalDevice, AlarmNoHandle } from './analysis-card';
import BannerCard from './banner-card';
import CpuMemory from './cpu-memory';
import Disk from './disk';
import NetWork from './network';
import Nodes from './nodes';
import { NationalDevice, Channel, PushDevice, PullDevice } from './total-card';

function Workbench() {
  return (
    <div className="p-2">
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} md={12}>
          <BannerCard />
        </Col>
        <Col span={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col md={12} span={24}>
              <TotalDevice />
            </Col>
            <Col md={12} span={24}>
              <OnlineDevice />
            </Col>
            <Col md={12} span={24}>
              <TodayAlarm />
            </Col>
            <Col md={12} span={24}>
              <AlarmNoHandle />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={6}>
          <NationalDevice />
        </Col>
        <Col span={24} md={6}>
          <Channel />
        </Col>
        <Col span={24} md={6}>
          <PushDevice />
        </Col>
        <Col span={24} md={6}>
          <PullDevice />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={12}>
          <CpuMemory />
        </Col>
        <Col span={24} md={12}>
          <Nodes />
        </Col>
        <Col span={24} md={12}>
          <Disk />
        </Col>
        <Col span={24} md={12}>
          <NetWork />
        </Col>
      </Row>
    </div>
  );
}

export default Workbench;
