/*
 * @Description:
 * @Autor: CIRAO
 * @Date: 2023-10-12 16:28:57
 * @LastEditors: lhl
 * @LastEditTime: 2023-12-01 16:16:35
 */

/* 设计稿高度 */
export const DESIGN_H = 1080;
/* 设计稿宽度 */
export const DESIGN_W = 1920;

export const setFontSize = (size, H = DESIGN_H) => {
    let docH = document.documentElement.clientHeight;
    return ((docH / 100) * size * 100) / H;
};

export const setWidth = (size, w = DESIGN_W) => {
    let docW = document.documentElement.clientWidth;
    return ((docW / 100) * size * 100) / w;
};
