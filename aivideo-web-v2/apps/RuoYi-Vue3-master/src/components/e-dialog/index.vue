<!--
 * @Author: Hewei
 * @Date: 2023-12-8
 * @Description: 动态表单弹窗
 * @Version: 1.0
 * @LastEditors: Hewei
 * @LastEditTime: 2023-12-13 09:32:49
-->
<template>
    <div>
        <el-dialog
            v-model="visible"
            v-bind="$attrs"
            :title="title ?? '标题'"
            :width="width ?? '30%'"
            :before-close="handleClose"
        >
            <div v-loading="dialogLoading">
                <slot></slot>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">{{
                        closeText ?? '取消'
                    }}</el-button>
                    <el-button type="primary" @click="handleOK">
                        {{ comfirmText ?? '确认' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
const props = defineProps({
    open: {
        required: true,
        type: Boolean,
        default: false,
    },
    dialogLoading: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '弹窗标题',
    },
    width: {
        type: String,
        default: '40%',
    },
    closeText: {
        type: String,
        default: '取消',
    },
    comfirmText: {
        type: String,
        default: '确定',
    },
});
const { open } = toRefs(props);
const visible = computed({
    get: () => {
        return open.value;
    },
    set: () => {},
});
const emits = defineEmits(['close', 'submit']);
const handleClose = () => {
    emits('close');
};
const handleOK = () => {
    emits('submit');
};
</script>
<style scoped lang="scss"></style>
