<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-23 10:46:56
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-21 10:33:54
-->
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
            <el-button
                type="primary"
                icon="Download"
                size="mini"
                @click="handleExport"
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
        </listTable>
    </ContentModule>
</template>

<script setup>
import {
    listAreaAccessStatistics,
    getAreaAccessStatistics,
    delAreaAccessStatistics,
    addAreaAccessStatistics,
    updateAreaAccessStatistics,
} from '@/api/bss/areaAccessStatistics';
import AdvancedSearch from '@/components/AdvancedSearch';
import { ContentModule } from '@/components/ContentLayout';
import { useTablePagination } from '@/hook/useTable';
import listTable from '@/components/listTable';
import { config, column } from './config';
const ids = ref([]);
const { proxy } = getCurrentInstance();
const { area_data } =
    proxy.useDict(
        'area_data'
);
const listData = ref([]);
const doQuery = () => {
    loading.value = true;
    listAreaAccessStatistics({
        ...queryParams.value,
        pageNum: current.value,
        pageSize: pageSize.value,
    }).then((response) => {
        listData.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
};

const handleSelectionChange = (selection) => {
    ids.value = selection.map((item) => item.id);
};

const handleExport = () => {
    proxy.download(
        'bss/areaAccessStatistics/export',
        {
            ...queryParams.value,
            pageNum: current.value,
            pageSize: pageSize.value,
        },
        `areaAccessStatistics_${new Date().getTime()}.xlsx`,
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
