export const config = [
    {
        type: 'el-input',
        prop: 'id',
        label: '任务id',
    },
    {
        type: 'el-input',
        prop: 'templateId',
        label: '模版id',
    },

    {
        type: 'el-input',
        prop: 'templateTitle',
        label: '模板名称',
    },
    {
        type: 'el-date-picker',
        prop: 'lastUpdateTime',
        label: '最后修改时间',
        attrs: {
            valueFormat: 'YYYY-MM-DD',
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
        },
    },
];

export const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop:"taskName",
        label:"任务名称",
        align:'center'
    },
    {
        prop: 'id',
        label: '任务id',
        align: 'center',
    },

    {
        prop: 'templateId',
        label: '模版id',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'templateTitle',
        label: '模板标题',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'state',
        label: '状态',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'createBy',
        label: '创建人',
        align: 'center',
    },

    {
        prop: 'lastUpdateTime',
        label: '最后修改时间',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'createTime',
        label: '创建时间',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'operation',
        label: '操作',
        align: 'center',
    },
];

export const rules = {
    taskName: [
        {
            required: true,
            message: '任务名称不能为空',
            trigger: 'blur',
        },
    ],
    templateId: [
        {
            required: true,
            message: '模版id不能为空',
            trigger: 'blur',
        },
    ],

    state: [
        {
            required: true,
            message: '状态不能为空',
            trigger: 'blur',
        },
    ],
    createTime: [
        {
            required: true,
            message: '报告生成时间不能为空',
            trigger: 'blur',
        },
    ],

    isRepeatSend: [
        {
            required: true,
            message: '是否重复发送不能为空',
            trigger: 'blur',
        },
    ],
};
