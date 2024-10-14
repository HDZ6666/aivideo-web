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
            <el-button type="primary" icon="Download" @click="handleExport"
                >导出</el-button
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
                        type="text"
                        @click="downLoadFile(row)"
                        >查看附件</el-button
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
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label="政策信息编号" prop="policyCode">
                <el-input
                    v-model="form.policyCode"
                    placeholder="请输入政策信息编号"
                />
            </el-form-item>
            <el-form-item label="政策名称" prop="policyName">
                <el-input
                    v-model="form.policyName"
                    placeholder="请输入政策名称"
                />
            </el-form-item>
            <el-form-item label="政策领域" prop="policyArea">
                <el-input
                    v-model="form.policyArea"
                    placeholder="请输入政策领域"
                />
            </el-form-item>
            <el-form-item label="政策主要内容" prop="policyAreaContent">
                <el-input
                    v-model="form.policyAreaContent"
                    type="textarea"
                    placeholder="请输入内容"
                />
            </el-form-item>
            <el-form-item label="上传文件" prop="uploadFile">
                <FileUpload :modelValue="fileList" @update:modelValue="newvalue=>fileList=newvalue" :limit="1" uploadUrl="/bss/policyInfo/upload"></FileUpload>
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
    listPolicyInfo,
    getPolicyInfo,
    delPolicyInfo,
    addPolicyInfo,
    updatePolicyInfo,
    lookDownLoadFile
} from '@/api/bss/policyInfo';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { saveAs } from 'file-saver';
import { blobValidate } from '@/utils/ruoyi';
const buttonLoading = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(false);
const policyInfoList = ref([]);
const title = ref('');
const open = ref(false);
const form = ref({});
const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const config = [
    {
        type: 'el-input',
        prop: 'policyCode',
        label: '政策信息编号',
    },
    {
        type: 'el-input',
        prop: 'policyName',
        label: '政策名称',
    },
    {
        type: 'el-input',
        prop: 'policyArea',
        label: '政策领域',
    },
    {
        type: 'el-input',
        prop: 'policyAreaContent',
        label: '政策主要内容',
    },
    {
        type: 'el-date-picker',
        prop: 'createTime',
        label: '创建时间',
        attrs: {
            type: 'date',
            valueFormat: 'YYYY-MM-DD',
        },
    },
];
const fileList = ref([])
const column = [
    { type: 'selection', align: 'center', width: '50px' },
    {
        prop: 'id',
        label: '政策信息管理表id',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'policyCode',
        label: '政策信息编号',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'policyName',
        label: '政策名称',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'policyArea',
        label: '政策领域',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'policyAreaContent',
        label: '政策主要内容',
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
const rules = {
    id: [
        {
            required: true,
            message: '政策信息管理表id不能为空',
            trigger: 'blur',
        },
    ],
    policyCode: [
        { required: true, message: '政策信息编号不能为空', trigger: 'blur' },
    ],
    policyName: [
        { required: true, message: '政策名称不能为空', trigger: 'blur' },
    ],
    policyArea: [
        { required: true, message: '政策领域不能为空', trigger: 'blur' },
    ],
    policyAreaContent: [
        { required: true, message: '政策主要内容不能为空', trigger: 'blur' },
    ],
    createBy: [{ required: true, message: '创建人不能为空', trigger: 'blur' }],
    createTime: [
        { required: true, message: '创建时间不能为空', trigger: 'blur' },
    ],
};
const listData = ref([]);
const doQuery = () => {
    loading.value = true;
    listPolicyInfo({
        ...queryParams.value,
        pageNum: current.value,
        pageSize: pageSize.value,
    }).then((response) => {
        listData.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
};
//文件流转地h
function previewAS(blob, filename) {
    let blobs = new Blob([blob], {
        type: blob.type + ';chartset=UTF-8',
    });
    let fileUrl = URL.createObjectURL(blobs);
    window.open(fileUrl);
}
const cancel = () => {
    resetForm();
    open.value = false;
};
const handleAdd = () => {
    resetForm();
    open.value = true;
    title.value = '添加企业活跃度政策信息管理';
};
// 查看附件
const downLoadFile= (row)=>{
    lookDownLoadFile(row.id).then(async (res)=>{
        const isBlob = blobValidate(res);
        if (isBlob) {
            const blob = new Blob([res]);
            const format = row.fileUrl.split('.')[1]||''
            //saveAs(blob, row.reportTitle + '.' + row.reportFormat);
            saveAs(blob, row.policyName + '.' + format);
            previewAS(blob);
        } else {
            const resText = await res.text();
            const rspObj = JSON.parse(resText);
            const errMsg =
                errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
            ElMessage.error(errMsg);
        }
    })
}
const resetForm = () => {
    if (!ruleFormRef.value) return;
    ruleFormRef.value.resetFields();
    fileList.value = []
};
const handleSelectionChange = (selection) => {
    ids.value = selection.map((item) => item.id);
};
const handleUpdate = (row) => {
    loading.value = true;
    resetForm();
    const id = row.id;
    getPolicyInfo(id).then((response) => {
        loading.value = false;
        form.value = response.data;
        fileList.value.push({
            url:response.data.fileUrl,
            name:response.data.fileUrl
        })
        open.value = true;
        title.value = '修改企业活跃度政策信息管理';
    });
};
const submitForm = async () => {
    await ruleFormRef.value.validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updatePolicyInfo({ ...form.value,fileUrl:fileList.value})
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
                addPolicyInfo({ ...form.value ,fileUrl:fileList.value})
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
            return delPolicyInfo(selectkeys);
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
        'bss/policyInfo/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `policyInfo_${new Date().getTime()}.xlsx`,
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
