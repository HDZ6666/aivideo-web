<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-13 09:17:21
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-03 16:13:00
-->
<template>
    <div class="z-pagination">
        <el-pagination v-model:current-page="current" v-model:page-size="pageSize" v-bind="$attrs"
            popperClass="x-dropDown" />
    </div>
</template>
<script setup >
import { ref, watch } from 'vue'
const props = defineProps({
    current: {
        type: [String, Number],
        default: () => 1
    },
    pageSize: {
        type: [String, Number],
        default: () => 10
    }
})
const current = ref(props.current)
const pageSize = ref(props.pageSize)
const emit = defineEmits(["update:current-page", "update:page-size"]);
watch(() => current.value, (val) => {
    emit("update:current-page", current.value);
}, { deep: true, immediate: true })


watch(() => pageSize.value, (val) => {
    emit("update:page-size", pageSize.value);
}, { deep: true, immediate: true })
</script>


<style scoped lang='scss'>
.z-pagination {
    :deep(.el-pagination) {
        --el-pagination-button-width: 32px;
        --el-pagination-button-height: 32px;
        --el-pagination-button-bg-color: rgba(74, 144, 226, 0.30);
        --el-pagination-font-size: 14px;
        .el-pagination__jump{
            color: #fff;
        }
        .el-pagination__total {
            color: #fff;
        }
        .btn-prev {
            border-radius: 2px;
            border: 1px solid #4A90E2;
            background: rgba(74, 144, 226, 0.30);
            color: #fff;
        }

        .btn-next {
            border-radius: 2px;
            border: 1px solid #4A90E2;
            background: rgba(74, 144, 226, 0.30);
            color: #fff;


        }

        .el-pager {
            li {
                border-radius: 2px;
                border: 1px solid #4A90E2;
                background: rgba(74, 144, 226, 0.30);
                color: #fff;

                &.is-active {
                    background-color: #4A90E2;

                }

                // color:#fff 
            }
        }

        .el-input {
            --el-input-text-color: #fff;
            --el-input-border-color: #4A90E2;
            width: 85px;
            font-size: 14px;
            .el-input__wrapper {
                background: rgba(74, 144, 226, 0.30);
                border: 1px solid #4A90E2;
                height: 32px;

            }
        }
    }
}
</style>



<style lang="scss">
.x-dropDown {
    background-color: transparent !important;
    box-shadow: none !important;
    border: 1px solid #00B8DC !important;
    .el-pagination>.is-first{
        color: #fff;
    }
    // background-color: red;
    .el-select-dropdown__item {
        &:hover {
            background-color: rgba(76, 204, 229, 0.5);

        }

        .hover {
            background-color: rgba(76, 204, 229, 0.5);
        }

        &.selected {
            background-color: #00B8DC;
            color: #fff;
        }
    }

    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
        background-color: rgba(76, 204, 229, 0.5);
    }
}
</style>
