import { useQuery } from '@tanstack/react-query';
import { Col, Descriptions, Modal, Row, Spin } from 'antd';

import AnalysisService from '@/api/services/analysisService';

export type PermissionModalProps = {
  title: string;
  show: boolean;
  onCancel: () => void;
};

export type SipType = {
  ids: string;
  domain: string;
  ip: string;
  port: number;
  password: string;
  [key: string]: any;
};

export type DescriptionsItemType = {
  key: string;
  label: string;
  children: any;
};

export type VersionType = {
  version: string;
  buildTime: string;
  gitVersion: string;
  gitLastCommitTime: string;
  [key: string]: any;
};

const nationalList: DescriptionsItemType[] = [
  {
    key: 'ids',
    label: '编号',
    children: '',
  },
  {
    key: 'domain',
    label: '域',
    children: '',
  },
  {
    key: 'ip',
    label: 'IP',
    children: '',
  },
  {
    key: 'port',
    label: '端口',
    children: '',
  },
  {
    key: 'password',
    label: '密码',
    children: '',
  },
];

const versionList: DescriptionsItemType[] = [
  {
    key: 'version',
    label: '版本',
    children: '',
  },
  {
    key: 'buildTime',
    label: '编译时间',
    children: '',
  },
  {
    key: 'gitVersion',
    label: 'GIT版本',
    children: '',
  },
  {
    key: 'gitLastCommitTime',
    label: 'GIT最后提交时间',
    children: '',
  },
];

export default function PermissionModal({ title, show, onCancel }: PermissionModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => AnalysisService.getSystemInfo(),
    select: formatData,
  });

  return (
    <Modal title={title} open={show} onCancel={onCancel} width={700} footer={null}>
      <Spin tip="数据加载中" size="small" spinning={isLoading}>
        <Row className="!mx-0 rounded-2xl" gutter={[16, 16]}>
          <Col span={24} className="flex-1 text-center md:text-left">
            <Descriptions
              bordered
              layout="horizontal"
              items={isError ? nationalList : data?.nationalInfo}
              size="small"
              title={<div className="text-sm">国标信息</div>}
            />
          </Col>
          <Col span={24} className="flex-1 text-center md:text-left">
            <Descriptions
              bordered
              layout="horizontal"
              items={isError ? versionList : data?.versionInfo}
              size="small"
              title={<div className="text-sm">版本信息</div>}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}

const formatData = (res: any) => {
  const national: SipType = {
    ids: res.sip.id,
    domain: res.sip.domain,
    ip: res.sip.ip,
    port: res.sip.port,
    password: res.sip.password,
  };
  const version: VersionType = {
    version: res.version.version,
    buildTime: res.version.BUILD_DATE,
    gitVersion: res.version.GIT_Revision_SHORT,
    gitLastCommitTime: res.version.GIT_DATE,
  };

  const nationalInfo = nationalList.map((item) => {
    return { ...item, children: national[item.key] };
  });

  const versionInfo = versionList.map((item) => {
    return { ...item, children: version[item.key] };
  });

  return { nationalInfo, versionInfo };
};
