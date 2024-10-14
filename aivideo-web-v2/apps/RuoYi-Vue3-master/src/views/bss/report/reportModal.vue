<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-27 15:19:04
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-27 15:55:00
-->
<template>
    <div class="reportModal">
        <listTable
            :column="column"
            v-loading="loading"
            :listData="listData"
            :pagination="pagination"
            @handleTableChange="handleTableChange"
        ></listTable>
    </div>
</template>
<script setup>
import { reportExportRecord } from '@/api/bss/report';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
const props = defineProps({
    reportObj: {
        type: Object,
        defaults: () => {
            return {};
        },
    },
});
const column = [
    {
        prop: 'createTime',
        label: '导出时间',
        align: 'center',
        showOverflowTooltip: true,
    },
    {
        prop: 'createBy',
        label: '操作人',
        align: 'center',
    },
];
const listData = ref([]);

const doQuery = (id) => {
    loading.value = true;
    reportExportRecord({
        id,
        pageNum: current.value,
        pageSize: pageSize.value,
    }).then((res) => {
        total.value = res.total;
        listData.value = res.rows;
        loading.value = false;
    });
};

const { current, total, pagination, handleTableChange, pageSize, loading } =
    useTablePagination(doQuery);

watch(
    () => props.reportObj,
    (val) => {
        current.value = 1;
        pageSize.value = 10;
        console.log(val.id, 'val.id');
        doQuery(val.id);
    },
    { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.reportModal {
    width: 100%;
    // padding: 0 20px;
    :deep(.z-listData-pagination) {
        .pagination-container {
            .el-pagination {
                position: static;
            }
        }
    }
}
</style>
