/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2023-10-19 16:53:31
 * @LastEditors: ZCR
 * @LastEditTime: 2023-11-23 10:11:13
 */

import { ref, computed, onMounted, watch } from 'vue';

export const useTablePagination = (callBack, paginationConfig) => {
    let current = ref(1);
    let total = ref(0);
    let pageSize = ref(10);
    let loading = ref(false);
    const queryParams = ref({});

    const pagination = computed(() => ({
        total: total.value,
        current: current.value,
        pageSize: pageSize.value,
        background: true,
        pageSizes: [5, 10, 20, 30],
        layout: ' prev, pager, next,sizes,jumper',
        position: 'right',
        // small:true,
        ...paginationConfig,
    }));

    const handleTableChange = (pag) => {
        let maxPage = Math.ceil(total.value / pag.pageSize);
        if (pag.current > maxPage) return;
        current.value = pag.current;
        pageSize.value = pag.pageSize;
        callBack && callBack();
    };
    /* 查询 */
    const onQuery = () => {
        current.value = 1;
        callBack && callBack();
    };
    /* 重置 */
    const onReset = () => {
        current.value = 1;
        queryParams.value = {};
        callBack && callBack();
    };

    return {
        current,
        total,
        pagination,
        handleTableChange,
        pageSize,
        loading,
        onQuery,
        onReset,
        queryParams,
    };
};

export const useRowSelection = (obj) => {
    const listTableRef = ref();
    let selectedAllRows = ref([]);
    const selectKeys = ref([]);

    const handleSelectionChange = (val) => {
        selectedAllRows.value = val;
    };
    
    watch(
        () => selectedAllRows,
        (val) => {
            let data = [];
            selectedAllRows.value.map((v) => {
                data.push(v[obj.key]);
            });
            selectKeys.value = data;
        },
        { deep: true, immediate: true },
    );

    return {
        handleSelectionChange,
        selectKeys,
        selectedAllRows,
    };
};
