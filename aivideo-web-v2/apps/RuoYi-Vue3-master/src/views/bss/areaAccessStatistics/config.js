export const config = [
    {
        type: 'el-input',
        prop: 'city',
        label: '城市',
    },
    {
        type: 'el-input',
        prop: 'areaCode',
        label: '区域',
    },
];

export const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'areaCode',
        label: '区域',
        align: 'center',
    },
    {
        prop: 'city',
        label: '城市',
        align: 'center',
    },
    {
        prop: 'loginUserNum',
        label: '登录用户数',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'userLoginNum',
        label: '用户登录数',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'applicationAccessNum',
        label: '应用访问数',
        align: 'center',
        showOverflowTooltip: true,
    },
];
