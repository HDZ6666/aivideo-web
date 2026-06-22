export type GroupType = RectType | CircleType | TextType | ArrowType | LineType;

// 图案组接口，包含完成状态
export interface PatternGroup {
  id: string; // 图案唯一标识
  completed: boolean; // 是否完成绘制
  elements: GroupType[]; // 图案中的所有元素
}

export interface RectType {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  type: string; // 类型
}

export interface CircleType {
  x: number;
  y: number;
  radius: number;
  fill: string;
  type: string; // 类型
}

export interface TextType {
  x: number;
  y: number;
  text: string;
  fill: string;
  type: string; // 类型
  visible: boolean;
}

export interface ArrowType {
  points: number[];
  strokeWidth: number;
  stroke: string;
  fill: string;
  type: string; // 类型
  visible: boolean;
}

export interface LineType {
  points: number[];
  strokeWidth: number;
  stroke: string;
  type: string; // 类型
}

export interface KonvasFormType {
  width: number;
  height: number;
  canvasType: string;
  list: CircleFormType[][]; // 修改为二维数组，支持多个图案
}

export interface CircleFormType {
  x: number;
  y: number;
}

export interface KonvaProps {
  width: number;
  height: number;
  start: boolean;
  complete: boolean;
  setStart: (start: boolean) => void;
  setComplete: (complete: boolean) => void;
  onComplete?: (compete: PatternGroup[]) => void;
}

export interface RectangleProps extends KonvaProps {
  groupList: PatternGroup[];
  setGroupList: (groupList: PatternGroup[]) => void;
}

export interface PolygonProps extends KonvaProps {
  groupList: PatternGroup[];
  setGroupList: (groupList: PatternGroup[]) => void;
}

export interface LineProps extends KonvaProps {
  lineType: number;
  lineTextList: string[];
  groupList: PatternGroup[];
  setGroupList: (groupList: PatternGroup[]) => void;
}
