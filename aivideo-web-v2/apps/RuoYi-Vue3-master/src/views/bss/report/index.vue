<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-14 16:49:00
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-27 15:49:37
-->
<template>
    <AdvancedSearch
        :config="config"
        v-model:value="queryParams"
        @onQuery="onQuery"
        @onReset="onReset"
    >
    </AdvancedSearch>
    <ContentModule>
        <template #operation>
            <el-upload
                multiple
                :limit="1"
                :show-file-list="false"
                style="display: flex; align-items: center; margin: 0 10px"
                :http-request="handleFileUpload"
            >
                <el-button icon="DocumentAdd">导入</el-button>
            </el-upload>
            <!-- <el-button type="primary" icon="Plus" @click="handleAdd"
                >新增</el-button
            > -->
            <!-- <el-button
                type="success"
                icon="el-icon-edit"
                size="samll"
                :disabled="single"
                @click="handleUpdate"
                >修改</el-button
            > -->
            <el-button
                type="danger"
                icon="Delete"
                :disabled="!ids.length"
                @click="handleDelete"
                >删除</el-button
            >
            <!-- <el-button type="primary" :disabled="!ids.length" icon="Download" @click="handleExport"
                >导出</el-button
            > -->

            <el-button type="primary" icon="Download" @click="handleExport"
                >对比报告</el-button
            >
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
                    @click="handleUpdate(row)"
                    type="primary"
                    >查看</el-button
                >

                <el-button
                    size="small"
                    link
                    type="primary"
                    @click="handleExportFile(row)"
                >
                    导出
                </el-button>

                <el-button
                    size="small"
                    link
                    @click="handleRecord(row)"
                    type="primary"
                    >导出记录</el-button
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
    </ContentModule>

    <!-- 添加或修改企业活跃度政策信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px">
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label="序号" prop="rowNum">
                <el-input v-model="form.rowNum" placeholder="请输入序号" />
            </el-form-item>
            <el-form-item label="报告标题" prop="reportTitle">
                <el-input
                    v-model="form.reportTitle"
                    placeholder="请输入报告格式"
                />
            </el-form-item>

            <el-form-item label="报告格式" prop="reportFormat">
                <el-input
                    v-model="form.reportFormat"
                    placeholder="请输入报告格式"
                />
            </el-form-item>
            <el-form-item label="模版id" prop="templateId">
                <el-input
                    v-model="form.templateId"
                    placeholder="请输入模版id"
                />
            </el-form-item>
            <el-form-item label="报告字数" prop="reportStrNum">
                <el-input
                    v-model="form.reportStrNum"
                    placeholder="请输入报告字数"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button
                :loading="buttonLoading"
                type="primary"
                @click="submitForm"
                >确 定</el-button
            >
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>

    <el-dialog title="导出记录" v-model="reportVisited" width="60%">
        <reportModal :reportObj="reportObj" />
    </el-dialog>
</template>

<script setup>
import {
    listReport,
    getReport,
    delReport,
    addReport,
    updateReport,
    downloadLocal,
    upload,
} from '@/api/bss/report';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { parseTime } from '@/utils/ruoyi';
import { blobValidate } from '@/utils/ruoyi';
import { saveAs } from 'file-saver';
import reportModal from './reportModal.vue';
const buttonLoading = ref(false);
const ids = ref([]);
const title = ref('');
const open = ref(false);
const form = ref({});
const reportVisited = ref(false);
const ruleFormRef = ref();
const reportObj = ref({});
const { proxy } = getCurrentInstance();
const config = [
    {
        type: 'el-input',
        prop: 'reportTitle',
        label: '报告标题',
    },

    {
        type: 'el-input',
        prop: 'reportFormat',
        label: '报告格式',
    },
    {
        type: 'el-input',
        prop: 'templateId',
        label: '模版id',
    },
    {
        type: 'el-date-picker',
        prop: 'beginTime',
        label: '生成时间',
        attrs: {
            valueFormat: 'YYYY-MM-DD',
            type: 'daterange',
            dateFormat: 'YYYY-MM-DD',
        },
        on: {
            change: (times) => {
                if (times && times.length) {
                    let value1 = times[0] + ' ' + '00:00:00';
                    let value2 = times[1] + ' ' + '23:59:59';
                    queryParams.value.beginTime = [value1, value2];
                }
            },
        },
    },
];
const column = [
    { type: 'selection', align: 'center', width: '50' },
    {
        prop: 'rowNum',
        label: '序号',
        align: 'center',
        width: '50',
    },
    {
        prop: 'reportTitle',
        label: '报告标题',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'reportFormat',
        label: '报告格式',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'templateId',
        label: '模版id',
        align: 'center',
    },

    {
        prop: 'reportStrNum',
        label: '报告字数',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'createTime',
        label: '生成时间',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'operation',
        label: '操作',
        align: 'center',
    },
];
const rules = {
    id: [
        {
            required: true,
            message: '报告id不能为空',
            trigger: 'blur',
        },
    ],
    rowNum: [
        {
            required: true,
            message: '序号不能为空',
            trigger: 'blur',
        },
    ],
    reportTitle: [
        {
            required: true,
            message: '报告标题不能为空',
            trigger: 'blur',
        },
    ],
    reportFormat: [
        {
            required: true,
            message: '报告格式不能为空',
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
    reportStrNum: [
        {
            required: true,
            message: '报告字数不能为空',
            trigger: 'blur',
        },
    ],
    createTime: [
        {
            required: true,
            message: '创建时间不能为空',
            trigger: 'blur',
        },
    ],
    createBy: [
        {
            required: true,
            message: '创建人不能为空',
            trigger: 'blur',
        },
    ],
    delFlag: [
        {
            required: true,
            message: '删除标识不能为空',
            trigger: 'blur',
        },
    ],
};
const listData = ref([]);
const doQuery = () => {
    loading.value = true;
    let data = {
        ...queryParams.value,
        pageNum: current.value,
        pageSize: pageSize.value,
    };
    if (queryParams.value.beginTime && queryParams.value.beginTime.length) {
        data.beginTime = queryParams.value.beginTime[0];
        data.endTime = queryParams.value.beginTime[1];
    }
    listReport(data).then((response) => {
        listData.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
};
const cancel = () => {
    resetForm();
    open.value = false;
};
const handleAdd = () => {
    resetForm();
    open.value = true;
    title.value = '添加报告';
};
const resetForm = () => {
    form.value = {};
    if (!ruleFormRef.value) return;
    ruleFormRef.value.resetFields();
};
const handleSelectionChange = (selection) => {
    ids.value = selection.map((item) => item.id);
};
const handleUpdate = (row) => {
    loading.value = true;
    resetForm();
    const id = row.id;
    getReport(id).then((response) => {
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = '修改报告';
    });
};
const submitForm = async () => {
    await ruleFormRef.value.validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateReport({ ...form.value })
                    .then((response) => {
                        ElMessage({
                            message: response.msg,
                            type: 'success',
                        });
                        open.value = false;
                        doQuery();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            } else {
                addReport({ ...form.value })
                    .then((response) => {
                        ElMessage({
                            message: response.msg,
                            type: 'success',
                        });
                        open.value = false;
                        doQuery();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            }
        }
    });
};
const handleDelete = (row) => {
    const selectkeys = row.id || ids.value;
    ElMessageBox.confirm('是否确认删除报告编号为"' + selectkeys + '"的数据项？')
        .then(() => {
            loading.value = true;
            return delReport(selectkeys);
        })
        .then(() => {
            loading.value = false;
            doQuery();
            ElMessage.success('删除成功');
        })
        .catch(() => {})
        .finally(() => {
            loading.value = false;
        });
};

const handleExport = () => {
    proxy.download(
        'bss/report/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `report_${new Date().getTime()}.xlsx`,
    );
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
//文件流转地h
function previewAS(blob, filename) {
    let blobs = new Blob([blob], {
        type: blob.type + ';chartset=UTF-8',
    });
    let fileUrl = URL.createObjectURL(blobs);
    window.open(fileUrl);
}
const handleExportFile = (row) => {
    downloadLocal({
        id: row.id,
    }).then(async (res) => {
        const isBlob = blobValidate(res);
        if (isBlob) {
            const blob = new Blob([res]);
            saveAs(blob, row.reportTitle + '.' + row.reportFormat);
            previewAS(blob);
        } else {
            const resText = await res.text();
            const rspObj = JSON.parse(resText);
            const errMsg =
                errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
            ElMessage.error(errMsg);
        }
    });
    // var name = row.reportTitle;
    // var url = 'http://192.168.0.171:8080/bss' + row.fileUrl;
    // // var suffix = url.substring(url.lastIndexOf("."),url.length);
    // const a = document.createElement('a');
    // a.setAttribute('download', name + '.' + row.reportFormat);
    // a.setAttribute('target', '_blank');
    // a.setAttribute('href', url);
    // a.click();
};

const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append('uploadFile', file.file);
    upload(formData).then((res) => {
        if (res.code == 200) {
            doQuery();
            ElMessage.success(res.msg);
        }
    });
};

const handleRecord = (row) => {
    reportVisited.value = true;
    reportObj.value = row;
};
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    align-items: center;
    justify-content: right;
}
</style>
