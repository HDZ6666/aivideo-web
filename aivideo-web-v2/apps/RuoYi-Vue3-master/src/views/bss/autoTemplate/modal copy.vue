<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-11 11:04:49
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-13 16:14:28
-->
<template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
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
        <el-form-item label="文件地址url" prop="fileUrl">
            <el-input v-model="form.fileUrl" placeholder="请输入文件地址url" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="模版字数" prop="templateStrNum">
            <el-input
                v-model="form.templateStrNum"
                placeholder="请输入模版字数"
            />
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { addAutoTemplate, updateAutoTemplate } from '@/api/bss/autoTemplate';
import { ElMessage } from 'element-plus';

const props = defineProps({
    currentFrom: {
        type: Object,
        default: () => {},
    },
});
const form = ref({ ...props.currentFrom });
const buttonLoading = ref(false);
const ruleFormRef = ref();
const rules = {
    id: [
        {
            required: true,
            message: '自动化报告模版id不能为空',
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
    templateFormat: [
        {
            required: true,
            message: '模版格式不能为空',
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
    state: [
        {
            required: true,
            message: '状态不能为空',
            trigger: 'blur',
        },
    ],
    templateStrNum: [
        {
            required: true,
            message: '模版字数不能为空',
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
};
const emit = defineEmits(['reset']);

const submitForm = async () => {
    await ruleFormRef.value.validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            let fn = addAutoTemplate;
            if (form.value.id) {
                fn = updateAutoTemplate;
            }
            fn(form.value)
                .then((res) => {
                    if (res.code == 200) {
                        ElMessage({
                            message: res.msg,
                            type: 'success',
                        });
                        resetForm();
                        emit('reset');
                    }
                })
                .finally(() => {
                    buttonLoading.value = false;
                });
        }
    });
};
const resetForm = () => {
    if (!ruleFormRef.value) return;
    ruleFormRef.value.resetFields();
};
const cancel = () => {
    emit('reset');
};
watch(
    () => props.currentFrom,
    (val) => {
        form.value = val;
    },
    { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.dialog-footer {
    display: flex;
    justify-content: right;
}
</style>
