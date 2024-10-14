<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-13 17:17:32
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-14 09:33:48
-->
<template>
    <div class="dataSelection borderStyle">
        <div class="title">数据选取</div>
        <div class="table">
            <listTable
                :column="column"
                :listData="listData"
                :pagination="pagination"
                @handleTableChange="handleTableChange"
                v-loading="loading"
            >
                <template #operation="{ row }">
                    <el-button
                        size="small"
                        link
                        @click="handlePreview(row)"
                        type="primary"
                        >预览</el-button
                    >
                    <el-button
                        size="small"
                        link
                        @click="handleSelect(row)"
                        type="primary"
                        >选择</el-button
                    >
                </template>
            </listTable>
        </div>
    </div>
</template>
<script setup>
import listTable from '@/components/listTable';
import { useTablePagination } from '@/hook/useTable';

const props = defineProps({});
const column = [
    // { type: 'selection', align: 'center', width: '50px' },

    {
        prop: 'id',
        label: 'id',
        align: 'center',
    },

    {
        prop: 'name',
        label: '名称',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'fileUrl',
        label: '数据类型',
        align: 'center',
        showOverflowTooltip: true,
    },

    {
        prop: 'state',
        label: '入参要求',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'operation',
        label: '操作',
        align: 'center',
    },
];
const listData = ref([{}]);

const handleSelect = () => {};
const handlePreview = () => {};
const doQuery = () => {};
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
</script>

<style scoped lang="scss">
.dataSelection {
    padding: 17px 40px 0 20px;
    min-height: 600px;

    .title {
        color: #1f2126;
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 26px; /* 162.5% */
        letter-spacing: 1px;
        margin-bottom: 20px;
    }
    .table {
        width: 100%;
    }
}
.borderStyle {
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
:deep(.z-listData-pagination) {
    .pagination-container {
        padding: 0;
        height: auto;
        .el-pagination {
            position: static;
        }
    }
}
</style>
