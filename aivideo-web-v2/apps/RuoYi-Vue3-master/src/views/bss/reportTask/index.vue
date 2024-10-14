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
            <el-button type="primary" icon="Plus" @click="handleAdd"
                >新增</el-button
            >
            <el-button
                type="primary"
                icon="EditPen"
                size="samll"
                :disabled="ids.length != 1"
                @click="handleUpdate(ids)"
                >修改</el-button
            >
            <el-button
                type="danger"
                icon="Delete"
                :disabled="!ids.length"
                @click="handleDelete"
                >删除</el-button
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
                    >修改</el-button
                >
                <el-button
                    size="small"
                    link
                    @click="handleDelete(row)"
                    type="danger"
                    >删除</el-button
                >
                <el-button
                    type="primary"
                    size="small"
                    link
                    @click="handleState(row)"
                    >{{ row.state != 0 ? '停用' : '启用 ' }}</el-button
                >
            </template>

            <template #state="{ row }">
                {{ row.state == 0 ? '停用' : '启用' }}
            </template>
        </listTable>
    </ContentModule>

    <!-- 添加或修改企业活跃度政策信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            label-position="top"
        >
            <el-form-item label="任务名称" prop="taskName">
                <el-input
                    v-model="form.taskName"
                    placeholder="请输入任务名称"
                />
            </el-form-item>

            <el-form-item label="选择模板" prop="templateId">
                <el-select
                    v-model="form.templateId"
                    placeholder="请选择模板"
                    style="width: 100%"
                    @change="handleChange"
                >
                    <el-option
                        v-for="item in templateList"
                        :label="item.templateTitle"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number
                    v-model="form.sort"
                    :min="1"
                    style="width: 100%;"
                    placeholder="请输入排序"
                />
            </el-form-item>
            <el-form-item label="模板标题" prop="templateTitle">
                <el-input
                    v-model="form.templateTitle"
                    placeholder="请选择模板"
                    :disabled="true"
                />
            </el-form-item>

            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="form.state">
                    <el-radio label="1" size="large">启用</el-radio>
                    <el-radio label="0" size="large">停用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="报告生成时间" prop="createTime">
                <el-date-picker
                    v-model="form.createTime"
                    type="datetime"
                    placeholder="请选择报告生成时间"
                    style="width: 100%"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    popper-class="picker"
                    placement="top-start"
                />
            </el-form-item>

            <el-form-item label="是否重复发送" prop="isRepeatSend">
                <el-radio-group v-model="form.isRepeatSend">
                    <el-radio label="1" size="large">是</el-radio>
                    <el-radio label="0" size="large">否</el-radio>
                </el-radio-group>
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
</template>

<script setup>
import {
    listReportTask,
    getReportTask,
    delReportTask,
    addReportTask,
    updateReportTask,
} from '@/api/bss/reportTask';
import { listAutoTemplate } from '@/api/bss/autoTemplate';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { config, column, rules } from './config';
const buttonLoading = ref(false);
const ids = ref([]);
const title = ref('');
const open = ref(false);
const form = ref({});
const ruleFormRef = ref();
const { proxy } = getCurrentInstance();

const listData = ref([]);
const doQuery = () => {
    loading.value = true;
    listReportTask({
        ...queryParams.value,
        pageNum: current.value,
        pageSize: pageSize.value,
    }).then((response) => {
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
    form.value = {};
    title.value = '新增';
};
const resetForm = () => {
    if (!ruleFormRef.value) return;
    ruleFormRef.value.resetFields();
};
const handleSelectionChange = (selection) => {
    ids.value = selection.map((item) => item.id);
};
const handleUpdate = (row) => {
    loading.value = true;
    resetForm();
    const id = row.id||row[0];
    getReportTask(id).then((response) => {
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = '修改企业活跃度报告任务';
    });
};
const submitForm = async () => {
    await ruleFormRef.value.validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateReportTask({ ...form.value })
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
                addReportTask({ ...form.value })
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
    ElMessageBox.confirm(
        '是否确认删除企业活跃度报告任务编号为"' + selectkeys + '"的数据项？',
    )
        .then(() => {
            loading.value = true;
            return delReportTask(selectkeys);
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
const templateList = ref([]);
const getTemplateList = () => {
    listAutoTemplate({
        pageNum: 1,
        pageSize: 100,
    }).then((res) => {
        templateList.value = res.rows;
    });
};
const handleExport = () => {
    proxy.download(
        'bss/policyInfo/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `policyInfo_${new Date().getTime()}.xlsx`,
    );
};
const handleState = (row) => {
    updateReportTask({ ...row, state: row.state == 0 ? 1 : 0 })
        .then((response) => {
            ElMessage({
                message: response.msg,
                type: 'success',
            });
            doQuery();
        })
        .finally(() => {});
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
getTemplateList();

const handleChange = (value) => {
    form.value.templateTitle = templateList.value.find(
        (v) => v.id == value,
    )?.templateTitle;
};



</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    align-items: center;
    justify-content: right;
}
</style>

<!-- <style lang="scss">
.picker {
    width: 600px;
    .el-date-picker {
        width: 100%;
    }
    .el-picker-panel__body {
        .el-picker-panel__content {
            width: 100%;
        }
    }
    :deep(.el-date-picker) {
        background-color: red;
    }
}
</style> -->
