import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Space, Spin, Image } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { styled } from 'styled-components';

import LineSegment from './Linesegment';
import Polygon from './polygon';
import Rectangle from './rectangle';
import {
  createArrow,
  createCircle,
  createLine,
  createText,
  getVerticalPoint,
  transformCircleToRect,
} from './util';

import type { CircleType, GroupType, KonvasFormType } from './interface';

export interface ImgProps {
  realUrl: string; // 真实地址
  url?: string; // 相对地址
  loaded: boolean; // 加载状态
  onLoad?: () => void;
  onError?: () => void;
}

interface KonvaCanvasProps {
  value?: KonvasFormType;
  bgImage?: ImgProps;
  mtype?: string; // 绘图 all area line
  buttons?: React.ReactNode;
  onChange?: (value: KonvasFormType) => void;
}

const konvasDefaultData: KonvasFormType = {
  width: 500,
  height: 300,
  canvasType: 'all',
  list: [],
};

const areaOptions = [
  { value: 'all', label: '全屏监控' },
  { value: 'polygon', label: '自定义监控区域' },
  { value: 'big', label: '最大区域' },
  { value: 'except', label: '排除区域' },
];

const lineOptions = [
  { value: 'linesegment', label: '线段(A ↔ B)' },
  { value: 'linesegmentBA', label: '线段(B → A)' },
  { value: 'linesegmentAB', label: '线段(A → B)' },
];

const KonvasCanvas = forwardRef(
  ({ value, bgImage, mtype = 'all', buttons, onChange }: KonvaCanvasProps, ref) => {
    const konvasData = value || konvasDefaultData;
    const { width, height, canvasType, list } = konvasData;
    const lineType = lineOptions.findIndex((item) => item.value === canvasType);

    const [groupList, setGroupList] = useState<GroupType[]>([]); // 自定义图形的数据
    const [start, setStart] = useState<boolean>(false); // 是否开始绘制
    const [complete, setComplete] = useState<boolean>(false); // 是否完成绘制

    useEffect(() => {
      clear();
      if (list.length > 0) {
        const circleList = list.map((item) => {
          return createCircle(item.x, item.y);
        });
        setComplete(true);
        switch (canvasType) {
          case 'big':
          case 'except':
            const rect = transformCircleToRect(circleList);
            setGroupList([rect]);
            break;
          case 'linesegment':
          case 'linesegmentAB':
          case 'linesegmentBA':
            const line = createLine([
              circleList[0].x,
              circleList[0].y,
              circleList[1].x,
              circleList[1].y,
            ]);
            const arrowPoints = getVerticalPoint(line.points, 50, 1 / 2);
            const textPoints = getVerticalPoint(line.points, 70, 1 / 2);
            const arrowListN = ['A', 'B'].map((_arrow, index) => {
              return createArrow(arrowPoints[index], lineType === index + 1 || lineType === 0);
            });
            const textListN = ['A', 'B'].map((text, index) => {
              return createText(textPoints[index][2], textPoints[index][3], text, true);
            });

            setGroupList([line, ...arrowListN, ...textListN]);
            break;
          default:
            setGroupList(circleList);
            break;
        }
      }
      console.log('改变数据', list);
    }, [canvasType, lineType, list]);

    const SelectOptions = useMemo(() => {
      if (mtype === 'area') {
        return areaOptions;
      }
      if (mtype === 'line') {
        return lineOptions;
      }
      return [...areaOptions, ...lineOptions];
    }, [mtype]);

    const changeType = (type: string) => {
      clear();
      onChange && onChange({ ...konvasData, canvasType: type, list: [] });
    };

    useImperativeHandle(ref, () => ({
      clear,
    }));

    const clear = () => {
      setGroupList([]);
      setStart(false);
      setComplete(false);
    };

    const onComplete = (competeList: CircleType[]) => {
      const konvasData = {
        width,
        height,
        canvasType,
        list: competeList.map((item) => {
          return {
            x: item.x,
            y: item.y,
          };
        }),
      };
      console.log('完成绘制', konvasData);
      onChange && onChange(konvasData);
    };

    const shape = {
      width,
      groupList,
      height,
      start,
      complete,
      setStart,
      setComplete,
      setGroupList,
      onComplete,
    };

    function KonvasComponent() {
      switch (canvasType) {
        case 'polygon':
          return <Polygon {...shape} />;
        case 'big':
        case 'except':
          return <Rectangle {...shape} />;
        case 'linesegment':
        case 'linesegmentAB':
        case 'linesegmentBA':
          return <LineSegment {...shape} lineType={lineType} />;
        default:
          return null;
      }
    }

    return (
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Select
            value={canvasType}
            className="w-full"
            onChange={changeType}
            options={SelectOptions}
          />
        </Col>
        <Col span={18}>
          <Space>
            <Button type="primary" danger onClick={clear}>
              重新绘制
            </Button>
            {buttons}
          </Space>
        </Col>
        <Col span={24}>
          <StyledNode $width={width} $height={height}>
            <Spin spinning={!bgImage?.loaded}>
              <Image
                width={width}
                height={height}
                src={bgImage?.realUrl || bgImage?.url || ''}
                onLoad={bgImage?.onLoad}
                onError={bgImage?.onError}
                preview={false}
                placeholder={<LoadingOutlined />}
              />
              {bgImage?.loaded && (
                <div className="absolute inset-0">
                  <KonvasComponent />
                </div>
              )}
            </Spin>
          </StyledNode>
        </Col>
      </Row>
    );
  },
);

const StyledNode = styled.div<{ $width: number; $height: number }>`
  position: relative;
  background-color: #a0a0a0;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;

  .canvasContainer {
    position: absolute;
    inset: 0;
  }
`;

export default KonvasCanvas;
