<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-29 16:20:51
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-28 09:43:46
-->
<template>
    <AdvancedSearch
        :config="config"
        v-model:value="queryParams"
        @onQuery="onQuery"
        @onReset="onReset"
    >
        <template #state="row">
            <el-select
                v-model="queryParams[row.prop]"
                placeholder="请选择状态"
                :style="{
                    width: row.width,
                }"
            >
                <el-option
                    v-for="item in sys_line_status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </template>
    </AdvancedSearch>
    <content-module>
        <template #operation>
            <el-button icon="Plus" type="primary" @click="handleAdd"
                >新增</el-button
            >
            <el-button
                type="primary"
                icon="EditPen"
                @click="handleUpdate"
                :disabled="idKey.length != 1"
                >修改</el-button
            >
            <el-button
                type="primary"
                @click="handleonLine({}, 1)"
                style="width: 78px"
                :disabled="!idKey.length"
                >上线</el-button
            >

            <el-button
                type="primary"
                @click="handleonLine({}, 0)"
                style="width: 78px"
                :disabled="!idKey.length"
                >下线</el-button
            >

            <el-upload
                multiple
                :limit="1"
                :show-file-list="false"
                style="display: flex; align-items: center; margin: 0 10px"
                :http-request="handleFileUpload"
            >
                <el-button icon="DocumentAdd">导入数据</el-button>
            </el-upload>

            <el-button
                type="danger"
                icon="Delete"
                @click="handleDelete"
                :disabled="!idKey.length"
                >批量删除</el-button
            >
            <!-- <el-button type="primary" icon="Download" @click="handleExport"
                >导出</el-button
            > -->
        </template>
        <listTable
            :column="column"
            :listData="listData"
            :pagination="pagination"
            @handleTableChange="handleTableChange"
            v-loading="loading"
            @selection-change="handleSelectionChange"
        >
            <template #operation="{ row }">
                <el-button
                    size="small"
                    link
                    @click="handleonLine(row, row.state == 1 ? 0 : 1)"
                    type="primary"
                    >{{ row.state == 1 ? '下线' : '上线' }}</el-button
                >

                <el-button
                    size="small"
                    link
                    @click="handleUpdate(row)"
                    type="primary"
                    >修改</el-button
                >
                <el-button
                    size="small"
                    link
                    @click="handleDelete(row)"
                    type="danger"
                    >删除</el-button
                >
            </template>
        </listTable>
    </content-module>

    <el-dialog :title="title" v-model="open" width="90%" append-to-body>
        <automatedReport :currentFrom="currentFrom" @reset="reset" />
    </el-dialog>
</template>

<script setup>
import {
    listAutoTemplate,
    getAutoTemplate,
    delAutoTemplate,
    batchUpdateState,
    upload,
} from '@/api/bss/autoTemplate';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import listTable from '@/components/listTable';
import { useTablePagination } from '@/hook/useTable';
import automatedReport from './automatedReport/index.vue';
import { ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();
const { sys_line_status } = proxy.useDict('sys_line_status');
import { ElMessage } from 'element-plus';

const config = [
    {
        type: 'el-input',
        prop: 'templateTitle',
        label: '模板标题',
    },
    {
        type: 'el-input',
        prop: 'templateFormat',
        label: '模板格式',
    },

    {
        type: 'el-select',
        prop: 'state',
        label: '状态',
    },
    {
        type: 'el-input',
        prop: 'createBy',
        label: '创建人',
    },
    {
        type: 'el-date-picker',
        prop: 'lastUpdateTime',
        label: '最后修改时间',
        attrs: {
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            type: 'datetime',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
        },
    },
];
const column = [
    { type: 'selection', align: 'center', width: '50px' },

    {
        prop: 'lineNum',
        label: '序号',
        align: 'center',
        width: '50px',
    },
    {
        prop: 'templateTitle',
        label: '模板标题',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'templateFormat',
        label: '模板格式',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'stateStr',
        label: '状态',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'templateStrNum',
        label: '模版字数',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'createBy',
        label: '创建人',
        align: 'center',
        showOverflowTooltip: true,
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
const currentFrom = ref({});
const listData = ref([]);
const title = ref('');
let idKey = ref([]);

const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append('uploadFile', file.file);
    upload(formData).then((res) => {
        if (res.code == 200) {
            doQuery();
            ElMessageBox.msgSuccess(res.msg);
        }
    });
};
const handleSelectionChange = (selection) => {
    idKey.value = selection.map((item) => item.id);
};
const doQuery = () => {
    loading.value = true;
    /* const newQuertParams = {}
    Object.keys(queryParams.value).map((key)=>{
        if(key!='lastUpdateTime'){
            newQuertParams[key] = queryParams.value[key]
        }else{
            newQuertParams['b']
        }
    }) */
    listAutoTemplate({
        ...queryParams.value,
        pageNum: current.value,
        pageSize: pageSize.value,
    }).then((response) => {
        listData.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
};
const open = ref(false);
const handleAdd = () => {
    open.value = true;
    currentFrom.value = {};
    title.value = '添加企业活跃自动化报告分析';
};
const handleUpdate = (row) => {
    const id = row.id;
    open.value = true;
    getAutoTemplate(id).then((res) => {
        if (res.code == 200) {
            currentFrom.value = res.data;
            title.value = '修改企业活跃自动化报告分析';
        }
    });
};

const reset = () => {
    currentFrom.value = {};
    open.value = false;
    doQuery();
};
const handleDelete = (row) => {
    const ids = row.id || idKey.value;
    ElMessageBox.confirm(
        '是否确认删除企业活跃自动化报告分析编号为"' + ids + '"的数据项？',
    )
        .then(() => {
            loading.value = true;
            return delAutoTemplate(ids);
        })
        .then(() => {
            loading.value = false;
            doQuery();
            ElMessageBox.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
            loading.value = false;
        });
};
const handleExport = () => {
    proxy.download(
        'bss/autoTemplate/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `autoTemplate_${new Date().getTime()}.xlsx`,
    );
};
const handleonLine = (row, state) => {
    const ids = row.id || idKey.value;
    batchUpdateState({
        id: Array.isArray(ids) ? ids : [ids],
        state: state,
    }).then((res) => {
        ElMessage({
            message: res.msg,
            type: 'success',
        });
        doQuery();
    });
};
const handleImport = (file) => {
    const value = JSON.stringify(file);
    upload(value).then((res) => {});
};
const {
    current,
    total,
    pagination,
    handleTableChange,
    pageSize,
    loading,
    onQuery,
    onReset,
    queryParams,
} = useTablePagination(doQuery);
doQuery();
</script>
