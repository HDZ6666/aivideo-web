/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2023-12-21 10:36:07
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-21 10:54:41
 */
export const config = [
    {
        type: 'el-input',
        prop: 'industry',
        label: '行业',
    },
];

export const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'industry',
        label: '行业',
        align: 'center',
    },
    {
        prop: 'loginUserNum',
        label: '登录用户数',
        align: 'center',
    },
    {
        prop: 'userLoginNum',
        label: '用户登录数',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'appAccessNum',
        label: '应用访问数',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'remark',
        label: '备注',
        align: 'center',
        showOverflowTooltip: true,
    },
];
