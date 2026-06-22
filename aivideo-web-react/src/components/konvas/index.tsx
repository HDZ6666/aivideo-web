import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Space, Spin, Image, message } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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

import type {
  CircleType,
  GroupType,
  KonvasFormType,
  LineType,
  PatternGroup,
  RectType,
} from './interface';

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

// 定义固定的线段方向文本，这是业务逻辑上的常量
const LINE_TEXT_LIST = ['进', '出'];

const KonvasCanvas = forwardRef(
  ({ value, bgImage, mtype = 'all', buttons, onChange }: KonvaCanvasProps, ref) => {
    // console.log('value', value);
    const konvasData = value || konvasDefaultData;
    const { width, height, canvasType, list } = konvasData;
    const hasInitialized = useRef(false);

    // 直接使用常量，无需稳定化处理

    // 使用 useMemo 优化选项数组
    const areaOptions = useMemo(
      () => [
        { value: 'all', label: '全屏监控' },
        { value: 'polygon', label: '自定义监控区域' },
        { value: 'big', label: '最大区域' },
        { value: 'except', label: '排除区域' },
      ],
      [],
    );

    const lineOptions = useMemo(
      () => [
        {
          value: 'linesegment',
          label: `线段(${LINE_TEXT_LIST[0]} ↔ ${LINE_TEXT_LIST[1]})`,
        },
        {
          value: 'linesegmentBA',
          label: `线段(${LINE_TEXT_LIST[1]} → ${LINE_TEXT_LIST[0]})`,
        },
        {
          value: 'linesegmentAB',
          label: `线段(${LINE_TEXT_LIST[0]} → ${LINE_TEXT_LIST[1]})`,
        },
      ],
      [], // 常量数组，无需依赖项
    );

    const lineType = useMemo(
      () => lineOptions.findIndex((item) => item.value === canvasType),
      [canvasType, lineOptions],
    );

    const [groupList, setGroupList] = useState<PatternGroup[]>([]); // 多个图案的渲染数据（PatternGroup数组）
    const [start, setStart] = useState<boolean>(false); // 是否开始绘制
    const [complete, setComplete] = useState<boolean>(false); // 是否完成绘制

    // 定义 clear 函数，需要在 useEffect 之前定义
    const clear = useCallback(() => {
      setGroupList([]);
      setStart(false);
      setComplete(false);
    }, []);

    // 将复杂计算逻辑移到 useMemo 中，提高性能
    const processedGroupList = useMemo(() => {
      if (list.length === 0) return [];

      const patternGroups: PatternGroup[] = []; // 改为 PatternGroup 数组

      list.forEach((patternPoints, index) => {
        if (patternPoints.length > 0) {
          const circleList = patternPoints.map((item) => {
            return createCircle(item.x, item.y);
          });

          // 每个图案的元素列表
          const patternElements: GroupType[] = [];

          switch (canvasType) {
            case 'big':
            case 'except':
              const rect = transformCircleToRect(circleList);
              patternElements.push(rect);
              break;
            case 'linesegment':
            case 'linesegmentAB':
            case 'linesegmentBA':
              if (circleList.length >= 2) {
                const line = createLine([
                  circleList[0].x,
                  circleList[0].y,
                  circleList[1].x,
                  circleList[1].y,
                ]);
                const arrowPoints = getVerticalPoint(line.points, 50, 1 / 2);
                const textPoints = getVerticalPoint(line.points, 70, 1 / 2);
                const arrowListN = LINE_TEXT_LIST.map((_arrow, index) => {
                  return createArrow(arrowPoints[index], lineType === index + 1 || lineType === 0);
                });
                const textListN = LINE_TEXT_LIST.map((text, index) => {
                  return createText(textPoints[index][2], textPoints[index][3], text, true);
                });

                patternElements.push(line, ...arrowListN, ...textListN);
              }
              break;
            default:
              patternElements.push(...circleList);
              break;
          }

          // 创建 PatternGroup 对象
          const patternGroup: PatternGroup = {
            id: `pattern-${index}-${Date.now()}`, // 基于索引和时间戳生成ID
            completed: true, // 来自父组件的数据认为是已完成的
            elements: patternElements,
          };

          patternGroups.push(patternGroup);
        }
      });

      console.log('processedGroupList', patternGroups);

      return patternGroups;
    }, [list, canvasType, lineType]); // LINE_TEXT_LIST 是常量，无需作为依赖项

    // 拆分 useEffect，职责更单一
    useEffect(() => {
      clear();
    }, [canvasType, clear]);

    useEffect(() => {
      if (!hasInitialized.current) {
        if (processedGroupList.length > 0) {
          setGroupList(processedGroupList);
          setComplete(true); // 有初始数据，标记为已完成
          hasInitialized.current = true;
        } else {
          // 无初始数据，不设置 complete，允许用户绘制
          setGroupList([]);
          setComplete(false);
          hasInitialized.current = true;
        }
      }
    }, [processedGroupList]);

    const SelectOptions = useMemo(() => {
      if (mtype === 'area') {
        return areaOptions;
      }
      if (mtype === 'line') {
        return lineOptions;
      }
      return [...areaOptions, ...lineOptions];
    }, [mtype, areaOptions, lineOptions]); // areaOptions 是稳定的，lineOptions 依赖 lineTextList

    // 使用 useCallback 优化回调函数，避免子组件不必要的重渲染
    const changeType = useCallback(
      (type: string) => {
        clear();
        onChange?.({ ...konvasData, canvasType: type, list: [] }); // 清空时保持二维数组结构
      },
      [clear, onChange, konvasData],
    );

    const onComplete = useCallback(
      (competeList: PatternGroup[]) => {
        console.log('完成绘制', competeList);

        // 根据 canvasType 提取不同的数据
        const newList = competeList
          .filter((pattern) => pattern.completed) // 只包含已完成的图案
          .map((pattern) => {
            switch (canvasType) {
              case 'big':
              case 'except':
                // 矩形类型：从 rect 元素提取 4 个角点
                const rectElement = pattern.elements.find((el) => el.type === 'rect');
                if (rectElement) {
                  const rect = rectElement as RectType;
                  // 返回矩形的 4 个角点：左上、右上、右下、左下
                  return [
                    { x: rect.x, y: rect.y },
                    { x: rect.x + rect.width, y: rect.y },
                    { x: rect.x + rect.width, y: rect.y + rect.height },
                    { x: rect.x, y: rect.y + rect.height },
                  ];
                }
                return [];

              case 'linesegment':
              case 'linesegmentAB':
              case 'linesegmentBA':
                // 线段类型：从 line 元素提取起点和终点
                const lineElement = pattern.elements.find((el) => el.type === 'line');
                if (lineElement) {
                  const line = lineElement as LineType;
                  // 返回线段的起点和终点
                  return [
                    { x: line.points[0], y: line.points[1] },
                    { x: line.points[2], y: line.points[3] },
                  ];
                }
                return [];

              case 'all':
              case 'polygon':
              default:
                // 多边形类型：提取所有 circle 元素
                return pattern.elements
                  .filter((element) => element.type === 'circle')
                  .map((circle) => {
                    const circleElement = circle as CircleType;
                    return { x: circleElement.x, y: circleElement.y };
                  });
            }
          });

        const newKonvasData = {
          width,
          height,
          canvasType,
          list: newList,
        };
        console.log('onComplete 输出数据', newKonvasData);
        onChange?.(newKonvasData);
      },
      [width, height, canvasType, onChange],
    );

    // 撤销最后一个图案
    const undoLastPattern = useCallback(() => {
      if (complete) {
        message.error('请先重绘后再撤销');
        return;
      }
      if (groupList.length > 0) {
        // 移除最后一个图案（无论是否完成）
        const newGroupList = groupList.slice(0, -1);
        setGroupList(newGroupList);

        // 同步更新父组件数据
        onComplete(newGroupList);

        console.log('撤销后的 groupList', newGroupList);
      }
    }, [groupList, complete, onComplete]);

    useImperativeHandle(
      ref,
      () => ({
        clear,
        undoLastPattern, // 暴露撤销最后一个图案的方法
      }),
      [clear, undoLastPattern],
    );

    // 使用 useMemo 优化 shape 对象，避免子组件不必要的重渲染
    const shape = useMemo(
      () => ({
        width,
        groupList,
        height,
        start,
        complete,
        setStart,
        setComplete,
        setGroupList,
        onComplete,
      }),
      [width, groupList, height, start, complete, setStart, setComplete, setGroupList, onComplete],
    );

    // 使用 useMemo 优化组件渲染，避免不必要的重新创建
    const KonvasComponent = useMemo(() => {
      switch (canvasType) {
        case 'polygon':
          return <Polygon {...shape} />;
        case 'big':
        case 'except':
          return <Rectangle {...shape} />;
        case 'linesegment':
        case 'linesegmentAB':
        case 'linesegmentBA':
          return <LineSegment {...shape} lineType={lineType} lineTextList={LINE_TEXT_LIST} />;
        default:
          return null;
      }
    }, [canvasType, shape, lineType]);

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
              重绘
            </Button>
            {!complete ? (
              <Button type="primary" onClick={undoLastPattern} disabled={groupList.length === 0}>
                撤销
              </Button>
            ) : null}
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
              {bgImage?.loaded && <div className="absolute inset-0">{KonvasComponent}</div>}
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
