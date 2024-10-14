/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2024-01-04 16:46:30
 * @LastEditors: ZCR
 * @LastEditTime: 2024-01-05 10:26:06
 */
export const config = [
    {
        type: 'el-input',
        prop: 'userId',
        label: '用户id',
    },
    {
        type: 'el-date-picker',
        prop: 'lastLoginTime',
        label: '最后登录时间',
        attrs: {
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            type: 'date',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
        },
    },
 
];

export const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'userId',
        label: '用户id',
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
        prop: 'userRegistrationDuration',
        label: '用户注册时长',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'userTemplateNum',
        label: '用户模板总数',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop:"lastLoginTime",
        label: '登录时间',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'operation',
        label: '操作',
        align: 'center',
    },
   
];
