
<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-11 11:04:49
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-28 09:49:28
-->
<template>
    <div class="work">
        <div class="tool">
            <div class="title">客服工作监督工作月报</div>
            <div class="btn">
                <el-button type="primary">刷新</el-button>
                <el-button type="primary">预览</el-button>
                <el-button type="primary">保存</el-button>
                <el-button type="primary">暂存</el-button>
            </div>
        </div>
        <div class="content">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="content-text borderStyle">
                        <content />
                    </div>
                </el-col>
                <el-col :span="6">
             
                    <element class="text-element pad borderStyle" />
                </el-col>
                <el-col :span="6">
                      
                    <configuration class="report-configuration pad borderStyle"/>
                </el-col>
            </el-row>
        </div>
    </div>
    <el-dialog
        title="数据绑定器-表格"
        v-model="open"
        width="90%"
        append-to-body
    >
        <dataModal />
    </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue';
import { addAutoTemplate, updateAutoTemplate } from '@/api/bss/autoTemplate';
import { ElMessage } from 'element-plus';
import dataModal from './dataModal/index.vue';
import content from './content';
import element from './element';
import configuration  from './configuration'
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


const open = ref(false);
watch(
    () => props.currentFrom,
    (val) => {
        form.value = val;
    },
    { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.work {
    .tool {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            color: #1f2126;
            font-family: PingFang SC;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 26px; /* 162.5% */
            letter-spacing: 1px;
        }
    }
    .content {
        min-height: 500px;
        .content-text {
        }

     

        .borderStyle {
            border-radius: 4px;
            background: #fff;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        }
    }

    .pad {
        padding: 11px 30px 0 16px;
    }
}
.dialog-footer {
    display: flex;
    justify-content: right;
}
</style>
