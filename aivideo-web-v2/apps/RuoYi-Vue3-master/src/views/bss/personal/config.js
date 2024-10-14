/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2024-01-04 16:46:30
 * @LastEditors: ZCR
 * @LastEditTime: 2024-01-04 16:52:33
 */
export const config = [
    {
        type: 'el-input',
        prop: 'userAccount',
        label: '用户账户',
    },
    {
        type: 'el-input',
        prop: 'userName',
        label: '用户名称',
    },
    {
        type: 'el-input',
        prop: 'institutionName',
        label: '机构名称',
    },
    {
        type: 'el-input',
        prop: 'appAccessNum',
        label: '应用访问数',
    },
    {
        type: 'el-input',
        prop: 'loginNum',
        label: '登录次数',
    },
    {
        type: 'el-date-picker',
        prop: 'lastLoginTime',
        label: '最后登录时间',
        width:"500px",
        attrs: {
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            type: 'datetimerange',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
        },
    },
];

export const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'id',
        label: '主键id',
        align: 'center',
    },
    {
        prop: 'userAccount',
        label: '用户账户',
        align: 'center',
    },
    {
        prop: 'userName',
        label: '用户名称',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'institutionName',
        label: '机构名称',
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
        prop: 'loginNum',
        label: '登录次数',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'lastLoginTime',
        label: '最后登录时间',
        align: 'center',
        showOverflowTooltip: true,
    },
];
