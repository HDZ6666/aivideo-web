import { CircleType, LineType, ArrowType, TextType, RectType, KonvasFormType } from './interface';

const color = 'rgba(255,0,0,0.5)';

export const createCircle = (x: number, y: number, radius = 2): CircleType => {
  return {
    x,
    y,
    radius,
    fill: color,
    type: 'circle',
  };
};

export const createLine = (points: number[], strokeWidth = 2): LineType => {
  return {
    points,
    strokeWidth,
    stroke: color,
    type: 'line',
  };
};

export const createArrow = (points: number[], visible = false, strokeWidth = 2): ArrowType => {
  return {
    points,
    strokeWidth,
    stroke: color,
    fill: color,
    type: 'arrow',
    visible,
  };
};

export const createText = (x: number, y: number, text: string, visible = false): TextType => {
  return {
    x,
    y,
    fill: color,
    text,
    type: 'text',
    visible,
  };
};

export const createRect = (x: number, y: number, width = 10, height = 10): RectType => {
  return {
    x,
    y,
    width,
    height,
    fill: color,
    type: 'rect',
  };
};

export const createCompeteType = (
  list: CircleType[],
  canvasType: string,
  width = 500,
  height = 300,
): KonvasFormType => {
  return {
    list,
    canvasType,
    width,
    height,
  };
};

// 将矩形转为点列表
export const transformRectToCircle = (rect: RectType): CircleType[] => {
  const points = [
    [rect.x, rect.y],
    [rect.x + rect.width, rect.y],
    [rect.x + rect.width, rect.y + rect.height],
    [rect.x, rect.y + rect.height],
  ];
  return points.map((item) => {
    return createCircle(item[0], item[1]);
  });
};

// 将矩形转为点列表
export const transformCircleToRect = (circleList: CircleType[]): RectType => {
  const { x } = circleList[0];
  const { y } = circleList[0];
  const width = circleList[1].x - x;
  const height = circleList[3].y - y;
  return createRect(x, y, width, height);
};

// 通过线段得到垂直平分线上的点
export const getVerticalPoint = (
  linePoint: number[],
  distance = 0,
  split: number = 1 / 2,
): number[][] => {
  if (linePoint.length !== 4) {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  const r = 1 / split - 1;
  // 获取线段等分点
  const x = (linePoint[0] + r * linePoint[2]) / (1 + r);
  const y = (linePoint[1] + r * linePoint[3]) / (1 + r);
  // 计算斜率
  const k = -(linePoint[2] - linePoint[0]) / (linePoint[3] - linePoint[1]);
  const b = y - k * x;
  const lineType = [1, -1];

  if (linePoint[0] < linePoint[2] && linePoint[1] === linePoint[3]) {
    // 平行于X轴且点A在点B的左侧
    const y1 = y - distance * lineType[0];
    const y2 = y - distance * lineType[1];
    return [
      [x, y, x, y1],
      [x, y, x, y2],
    ];
  }

  if (linePoint[0] > linePoint[2] && linePoint[1] === linePoint[3]) {
    // 平行于X轴且点A在点B的右侧
    const y1 = y + distance * lineType[0];
    const y2 = y + distance * lineType[1];
    return [
      [x, y, x, y1],
      [x, y, x, y2],
    ];
  }

  if (linePoint[0] === linePoint[2] && linePoint[1] < linePoint[3]) {
    // 平行于Y轴且点A在点B的上侧
    const x1 = x + distance * lineType[0];
    const x2 = x + distance * lineType[1];
    return [
      [x, y, x1, y],
      [x, y, x2, y],
    ];
  }

  if (linePoint[0] === linePoint[2] && linePoint[1] > linePoint[3]) {
    // 平行于Y轴且点A在点B的下侧
    const x1 = x - distance * lineType[0];
    const x2 = x - distance * lineType[1];
    return [
      [x, y, x1, y],
      [x, y, x2, y],
    ];
  }

  const aa = 1 + k ** 2;
  const bb = 2 * (k * b - x - y * k);
  const cc = x ** 2 + y ** 2 + b ** 2 - 2 * b * y - distance ** 2;
  const dd = Math.sqrt(bb ** 2 - 4 * aa * cc);
  if (linePoint[3] < linePoint[1] && linePoint[2] !== linePoint[0]) {
    // 在X轴上面 y2 < y1
    const x1 = (-bb - dd * lineType[0]) / (2 * aa);
    const y1 = k * x1 + b;
    const x2 = (-bb - dd * lineType[1]) / (2 * aa);
    const y2 = k * x2 + b;
    return [
      [x, y, x1, y1],
      [x, y, x2, y2],
    ];
  }

  if (linePoint[3] > linePoint[1] && linePoint[2] !== linePoint[0]) {
    // 在X轴下面 y2 > y1
    const x1 = (-bb + dd * lineType[0]) / (2 * aa);
    const y1 = k * x1 + b;
    const x2 = (-bb + dd * lineType[1]) / (2 * aa);
    const y2 = k * x2 + b;
    return [
      [x, y, x1, y1],
      [x, y, x2, y2],
    ];
  }

  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
};

export const getDistance = (points: number[]) => {
  if (points.length !== 4) return 0;
  return Math.floor(Math.sqrt((points[0] - points[2]) ** 2 + (points[1] - points[3]) ** 2));
};

// 检查点是否重合
export const checkPointInPoints = (
  groupList: CircleType[],
  pointX: number,
  pointY: number,
): boolean => {
  return groupList.some((item) => item.x === pointX && item.y === pointY);
};

// 判断线段是否和线段重合
export const checkLineCrossLines = (groupList: LineType[], currentLinePoints: number[]) => {
  // const currentLine = lines[lines.length - 1].points; // 当前线段ab [x1,y1,x2,y2]
  if (groupList.length === 0) return false;
  if (currentLinePoints.length !== 4) return false;
  return groupList.some((item) => {
    const line = item.points; // 不相邻的线段cd [x3,y3,x4,y4]
    const v1 = { x: currentLinePoints[0] - line[0], y: currentLinePoints[1] - line[1] }; // 构建向量 ca
    const v2 = { x: currentLinePoints[2] - line[0], y: currentLinePoints[3] - line[1] }; // 构建向量 cb
    const v3 = { x: line[2] - line[0], y: line[3] - line[1] }; // 构建向量 cd
    // 向量ca * cd的叉积  和 向量cb * cd 的叉积  一定是异号
    const res1 = (v1.x * v3.y - v1.y * v3.x) * (v2.x * v3.y - v2.y * v3.x);
    const v4 = { x: line[0] - currentLinePoints[0], y: line[1] - currentLinePoints[1] }; // 构建向量 ac
    const v5 = { x: line[2] - currentLinePoints[0], y: line[3] - currentLinePoints[1] }; // 构建向量 ad
    const v6 = {
      x: currentLinePoints[2] - currentLinePoints[0],
      y: currentLinePoints[3] - currentLinePoints[1],
    }; // 构建向量 ab
    const res2 = (v4.x * v6.y - v4.y * v6.x) * (v5.x * v6.y - v5.y * v6.x);
    return res1 <= 0 && res2 <= 0;
  });
};
