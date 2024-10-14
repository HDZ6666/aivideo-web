<!--
 * @Author: Hewei
 * @Date: 2023-11-24 14:52:21
 * @Description: 表单动态配置
 * @LastEditors: Hewei
 * @LastEditTime: 2023-12-13 10:56:35
-->
<template>
    <div class="form-dynamic-container">
        <el-form ref="formRef" :model="formModel">
            <el-row :gutter="20">
                <template v-for="(item, index) in formConfigs" :key="index">
                    <el-col :span="item.span ?? 8">
                        <el-form-item
                            :label="item.label"
                            :prop="[item.prop]"
                            :rules="item.rules"
                        >
                            <!-- 1、文本输入框 -->
                            <el-input
                                v-if="item.type === 'input'"
                                v-model="formModel[item.prop]"
                                :type="item.type ?? 'text'"
                                :placeholder="item.placeholder || '请输入'"
                                :disabled="item.disabled"
                                :clearable="item.clearable ?? true"
                                v-bind="item.attrs"
                            />
                            <!-- 2、选择框 -->
                            <el-select
                                v-else-if="item.type === 'select'"
                                v-model="formModel[item.prop]"
                                :placeholder="
                                    item.options?.placeholder || '请选择'
                                "
                                :clearable="item.clearable ?? true"
                                v-bind="item.attrs"
                            >
                                <el-option
                                    v-for="it in item.options?.data"
                                    :key="it[item.options?.valueKey || 'value']"
                                    :label="
                                        it[item.options?.labelkey || 'label']
                                    "
                                    :value="
                                        it[item.options?.valueKey || 'value']
                                    "
                                />
                            </el-select>
                            <!-- 3、单选框 -->
                            <el-radio-group
                                v-else-if="item.type === 'radio'"
                                v-model="formModel[item.prop]"
                                :disabled="item.disabled"
                                v-bind="item.attrs"
                            >
                                <el-radio
                                    v-for="it in item.options?.data"
                                    :key="it[item.options?.valueKey || 'value']"
                                    :label="
                                        it[item.options?.valueKey || 'value']
                                    "
                                >
                                    {{ it[item.options?.labelkey || 'label'] }}
                                </el-radio>
                            </el-radio-group>
                            <!-- 其他自定义 -->
                            <section v-else-if="item.type === 'custom'">
                                <slot :data="item"></slot>
                            </section> 
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>
    </div>
</template>
<script setup>
const { proxy } = getCurrentInstance();
const props = defineProps({
    formConfigs: {
        required: false,
        type: Array,
        default: () => {
            return [
                {
                    label: '姓名',
                    prop: 'name',
                    type: 'input',
                    rules: [
                        {
                            required: true,
                            message: '姓名不能为空',
                            trigger: 'blur',
                        },
                    ],
                    placeholder: '请输入姓名',
                    clearable: false,
                },
                {
                    label: '性别',
                    prop: 'sex',
                    type: 'select',
                    rules: [
                        {
                            required: true,
                            message: '姓名不能为空',
                            trigger: 'change',
                        },
                    ],
                    placeholder: '请选择性别',
                    attrs: {
                        multiple: true,
                    },
                    options: {
                        valueKey: 'value',
                        labelKey: 'label',
                        data: [
                            {
                                value: 1,
                                label: 1,
                            },
                            {
                                value: 2,
                                label: 2,
                            },
                        ],
                    },
                },
                {
                    label: '性别',
                    prop: 'sex2',
                    type: 'radio',
                    rules: [
                        {
                            required: true,
                            message: '性别2不能为空',
                            trigger: 'change',
                        },
                    ],
                    options: {
                        valueKey: 'value',
                        labelKey: 'label',
                        data: [
                            {
                                value: 1,
                                label: '男',
                            },
                            {
                                value: 2,
                                label: '女',
                            },
                        ],
                    },
                },
                {
                    label: '自定义',
                    prop: 'custom',
                    type: 'custom',
                    rules: [
                        {
                            required: true,
                            message: '姓名3不能为空',
                            trigger: 'blur',
                        },
                    ],
                    placeholder: '请输入姓名3',
                    attrs: {
                        a: 1,
                    },
                },
            ];
        },
    },
    formModel: {
        required: true,
        type: Object,
        default: () => {
            return {
                name1: '',
                name2: '',
            };
        },
    },
});
const { formConfigs, formModel } = toRefs(props);
const emits = defineEmits(['update:formModel']);
const formRef = ref(null);
const validate = () => {
    return new Promise((resolve, reject) => {
        (async () => {
            const formEl = formRef.value;
            if (!formEl) {
                reject(new Error('formRef is null'));
            }
            await formEl.validate((valid, fields) => {
                if (valid) {
                    resolve({ valid, fields });
                } else {
                    reject({ valid, fields });
                }
            });
        })();
    });
};
const resetForm = () => {
    formRef.value.resetFields();
};
defineExpose({ validate, resetForm });
</script>
<style lang="scss" scoped></style>
