/*
 * @Description:
 * @Autor: CIRAO
 * @Date: 2023-10-24 10:25:41
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-29 09:22:54
 */
import { useWindowSize } from '@vueuse/core';
const { width, height } = useWindowSize();
/* 设计稿高度 */
export const DESIGN_H = 1080;
/* 设计稿宽度 */
export const DESIGN_W = 1920;
export const setHeight = (size) => {
    let docH = (size / DESIGN_W) * width.value;
    return docH;
};
export const setWeigth = (size) => {
    let docW = (size / DESIGN_H) * height.value;
    return docW;
};
