import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Row, Col, Tag } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { styled } from 'styled-components';

import { useThemeToken } from '@/theme/hooks';

import DeviceModal, { DeviceType } from './device-modal';

interface DeviceSelectProps {
  value?: DeviceType[];
  onChange?: (value: DeviceType[]) => void;
  disabled?: boolean;
}

const DeviceSelect = forwardRef(({ value, onChange, disabled = false }: DeviceSelectProps, ref) => {
  const { colorPrimary } = useThemeToken();
  const deviceList = value || [];
  const setDeviceList = onChange || (() => {});
  useImperativeHandle(ref, () => ({
    handleChooseDevice,
  }));

  const [deviceModalShow, setDeviceModalShow] = useState<boolean>(false);

  const handleChooseDevice = () => {
    setDeviceModalShow(true);
  };

  const deleteDevice = (id: number) => {
    setDeviceList(deviceList.filter((item) => item.id !== id));
  };

  return (
    <Row gutter={16} align="middle">
      <Col span={16}>
        <StyledTag>
          {deviceList.map((item) => {
            return (
              <Tag
                key={item.id}
                className="inline-flex"
                color={colorPrimary}
                closable={!disabled}
                closeIcon={<CloseCircleOutlined />}
                onClose={() => {
                  deleteDevice(item.id);
                }}
              >
                {item.name}
              </Tag>
            );
          })}
        </StyledTag>
      </Col>
      <Col span={6}>
        <Button type="primary" onClick={handleChooseDevice} disabled={disabled}>
          请选择设备
        </Button>
      </Col>
      <DeviceModal
        show={deviceModalShow}
        setShow={setDeviceModalShow}
        deviceList={deviceList}
        setDeviceList={setDeviceList}
      />
    </Row>
  );
});

const StyledTag = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  padding: 3px 3px 3px 6px;
  min-height: 36px;
  box-sizing: content-box;
  .ant-tag {
    border-radius: 6px;
    cursor: default;
    height: 30px;
    min-width: 30px;
    padding: 0 6px;
    margin: 3px 3px 3px 0px;
    font-size: 15px;
    font-weight: 700;
    border-width: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    text-transform: capitalize;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    .ant-tag-close-icon {
      padding-left: 6px;
      font-size: 16px;
      color: #fff;
    }
  }
`;

export default DeviceSelect;
