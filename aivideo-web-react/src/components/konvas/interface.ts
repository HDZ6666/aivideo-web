export type GroupType = RectType | CircleType | TextType | ArrowType | LineType;

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
  list: CircleFormType[];
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
  onComplete?: (compete: CircleType[]) => void;
}

export interface RectangleProps extends KonvaProps {
  groupList: GroupType[];
  setGroupList: (groupList: GroupType[]) => void;
}

export interface PolygonProps extends KonvaProps {
  groupList: (GroupType | LineType)[];
  setGroupList: (groupList: GroupType[]) => void;
}

export interface LineProps extends KonvaProps {
  lineType: number;
  lineTextList: string[];
  groupList: GroupType[];
  setGroupList: (groupList: GroupType[]) => void;
}
