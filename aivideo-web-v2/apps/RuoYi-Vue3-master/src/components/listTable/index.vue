<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-10-19 15:51:16
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-14 09:28:23
-->
<template>
    <div class="z-listData">
        <div class="z-listData-table">
            <zTable
                :listData="props.listData"
                :column="props.column"
                ref="multipleTableRef"
                v-bind="$attrs"
            >
                <template
                    v-for="slot in Object.keys($slots)"
                    #[slot]="scope"
                    :key="t.prop || t.label"
                >
                    <slot :name="slot" v-bind="scope" />
                </template>
            </zTable>
        </div>
        <div
            class="z-listData-pagination"
            :class="`pagination-${props.pagination.position}`"
            v-if="props.pagination"
        >
            <Pagination
                v-model:page="paginations.current"
                v-model:limit="paginations.pageSize"
                v-bind="props.pagination"
            />
        </div>
    </div>
</template>
<script setup>
import { watch, ref, onMounted, nextTick } from 'vue';
import zTable from '../z-table/index';
import Pagination from '../Pagination/index';
const props = defineProps({
    pagination: {
        type: Object,
        default: () => null,
    },
    listData: {
        type: Array,
        default: () => [],
    },
    column: {
        type: Array,
        default: () => [],
    },
    selectKeys: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['handleTableChange']);
const paginations = ref({
    current: props.pagination?.current || 1,
    pageSize: props.pagination?.pageSize || 10,
});
watch(
    () => paginations.value,
    (val) => {
        emit('handleTableChange', paginations.value);
    },
    { deep: true },
);

// watch(() => props.selectKeys, (val) => {
//     console.log(singleTableRef.value);
// })
</script>

<style scoped lang="scss">
.z-listData {
    .z-listData-table {
    }

    .z-listData-pagination {
        // margin-top: 24px;
        display: flex;
        justify-content: start;
        width: 100%;

        &.pagination-left {
            justify-content: start;
        }

        &.pagination-center {
            justify-content: center;
        }

        &.pagination-right {
            justify-content: right;
        }
    }
}
</style>
