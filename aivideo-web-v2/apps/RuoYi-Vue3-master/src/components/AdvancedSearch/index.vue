<!--
 * @Description: 
 * @Autor: cirao
 * @Date: 2023-11-22 16:02:26
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-19 17:44:39
-->
<template>
    <Search-module>
        <el-row>
            <el-col :span="20">
                <el-form
                    :inline="true"
                    :model="queryData"
                    label-position="right"
                    class="advanced-form"
                >
                    <el-form-item
                        :label="item.label"
                        :prop="item.prop"
                        v-for="(item, index) in props.config"
                        :label-width="item.labelWidth || '100px'"
                        :key="item.prop"
                    >
                        <slot
                            :name="item.slotName || item.prop"
                            v-bind="{ ...item, width: componentWidth }"
                        >
                            <component
                                :is="item.type"
                                :style="{
                                    maxWidth: '400px',
                                    minWidth: '200px',
                                    width: item.width
                                        ? item.width
                                        : componentWidth,
                                    ...item.style,
                                }"
                                v-model="queryData[item.prop]"
                                :placeholder="
                                    item.placeholder
                                        ? item.placeholder
                                        : `${
                                              ['el-select'].includes(item.type)
                                                  ? '请选择'
                                                  : '请输入'
                                          }${item.label}`
                                "
                                :options="item.options"
                                :clearable="item.clearable || true"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                v-bind="item.attrs"
                                v-on="item.on || {}"
                                @keyup.enter.native="handleEnter"
                            >
                                <template v-if="item.type == 'el-select'">
                                    <el-option
                                        v-for="v in item.options"
                                        :key="v.value"
                                        :label="v.label"
                                        :value="v.value"
                                    />
                                </template>
                            </component>
                        </slot>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <div class="btn">
                    <el-button type="primary" @click="onQuery">查询</el-button>
                    <el-button @click="onReset">重置</el-button>
                </div>
            </el-col>
        </el-row>
    </Search-module>
</template>
<script setup>
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import { watch, ref, onMounted, reactive } from 'vue';
const props = defineProps({
    config: {
        type: Array,
        default: () => [],
    },
    value: {
        type: Object,
        default: () => {},
    },
});
const componentWidth = '250px';
const instance = getCurrentInstance();
const queryData = ref({ ...props.value });

const emit = defineEmits(['update:value', 'onQuery', 'onReset']);
const onQuery = () => {
    emit('onQuery', queryData.value);
};
const onReset = () => {
    queryData.value = {};
    emit('onReset', {});
};
const handleEnter = () => {
    emit('update:value', queryData.value);
};
watch(
    () => queryData.value,
    (val) => {
        emit('update:value', queryData.value);
    },
    { deep: true },
);
</script>

<style scoped lang="scss">
.advanced-form {
    .el-form-item--default {
        // margin-bottom: 16px;
        // :deep(.el-form-item__content) {
        //     width: 280px;
        //     min-width: 260px;
        //     max-width: 300px;
        // }
    }
    &.el-form--inline {
        .el-form-item {
            margin-right: 24px;
        }
    }
    .el-form-item--default {
    }
    .el-form-item__content {
    }
}
.btn {
    width: 100%;
    display: flex;
    justify-content: left;
}
</style>
