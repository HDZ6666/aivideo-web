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

    <ContentModule>
        <template #operation>
            <el-button type="primary" icon="Plus" @click="handleAdd"
                >新增</el-button
            >
            <el-button
                type="primary"
                icon="EditPen"
                :disabled="single"
                @click="handleUpdate"
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
                    v-hasPermi="['bss:templateDraft:edit']"
                    >修改</el-button
                >
                <el-button
                    size="small"
                    link
                    @click="handleDelete(row)"
                    type="danger"
                    v-hasPermi="['bss:templateDraft:remove']"
                    >删除</el-button
                >
            </template>

            <template #state="{ row }">
                <dict-tag :options="sys_line_status" :value="row.state" />
            </template>
        </listTable>
    </ContentModule>

    <!-- 添加或修改企业活跃度政策信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label="序号" prop="lineNum">
                <el-input v-model="form.lineNum" placeholder="请输入序号" />
            </el-form-item>
            <el-form-item label="模版标题" prop="templateTitle">
                <el-input
                    v-model="form.templateTitle"
                    placeholder="请输入模版标题"
                />
            </el-form-item>
            <el-form-item label="模版格式" prop="templateFormat">
                <el-input
                    v-model="form.templateFormat"
                    placeholder="请输入模版格式"
                />
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input v-model="form.createBy" placeholder="请输入创建人" />
            </el-form-item>
            <el-form-item label="最后更新时间" prop="lastUpdateTime">
                <el-date-picker
                    clearable
                    v-model="form.lastUpdateTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择最后更新时间"
                >
                </el-date-picker>
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
    listTemplateDraft,
    getTemplateDraft,
    delTemplateDraft,
    addTemplateDraft,
    updateTemplateDraft,
} from '@/api/templateDraft/templateDraft';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
const buttonLoading = ref(false);
const ids = ref([]);
const single = ref(true);
const title = ref('');
const open = ref(false);
const form = ref({});
const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const { sys_line_status } = proxy.useDict('sys_line_status');

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
        prop: 'beginLastUpdateTime',
        label: '最后修改时间',
        width: '800px',
        attrs: {
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            type: 'datetimerange',
            format: 'YYYY-MM-DD HH:mm:ss',
        },
    },
];
const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'lineNum',
        label: '序号',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'templateTitle',
        label: '模板标题',
        align: 'center',
    },
    {
        prop: 'templateFormat',
        label: '模板格式',
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
        showOverflowTooltip: true,
    },
    {
        prop: 'lastUpdateTime',
        label: '最后修改时间',
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
            message: '模版草稿id不能为空',
            trigger: 'blur',
        },
    ],
    lineNum: [
        {
            required: true,
            message: '序号不能为空',
            trigger: 'blur',
        },
    ],
    templateTitle: [
        {
            required: true,
            message: '模版标题不能为空',
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
    fileUrl: [
        {
            required: true,
            message: '文件地址url不能为空',
            trigger: 'blur',
        },
    ],
    templateFormat: [
        {
            required: true,
            message: '模版格式不能为空',
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
    lastUpdateTime: [
        {
            required: true,
            message: '最后更新时间不能为空',
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
    if (
        queryParams.value.beginLastUpdateTime &&
        queryParams.value.beginLastUpdateTime.length
    ) {
        data.beginLastUpdateTime = queryParams.value.beginLastUpdateTime[0];
        data.endLastUpdateTime = queryParams.value.beginLastUpdateTime[1];
    }
    listTemplateDraft({
        ...data,
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
    title.value = '添加企业活跃度政策信息管理';
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
    const id = row.id;
    getTemplateDraft(id).then((response) => {
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = '修改企业活跃度政策信息管理';
    });
};
const submitForm = async () => {
    await ruleFormRef.value.validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateTemplateDraft({ ...form.value })
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
                addTemplateDraft({ ...form.value })
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
        '是否确认删除企业活跃度政策信息管理编号为"' +
            selectkeys +
            '"的数据项？',
    )
        .then(() => {
            loading.value = true;
            return delTemplateDraft(selectkeys);
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
        'bss/templateDraft/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `templateDraft_${new Date().getTime()}.xlsx`,
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
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    align-items: center;
    justify-content: right;
}
</style>
