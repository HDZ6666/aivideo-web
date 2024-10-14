<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-10-16 14:39:30
 * @LastEditors: ZCR
 * @LastEditTime: 2023-11-23 09:18:59
-->
<template>
    <div class="z-table">
        <el-table :data="listData" style="width: 100%" v-bind="$attrs">
            <column-item
                v-for="item in column"
                :col="item"
                :key="item.prop || item.label"
            >
                <template
                    v-for="slot in Object.keys($slots)"
                    #[slot]="scope"
                    :key="t.prop || t.label"
                >
                    <slot :name="slot" v-bind="scope" />
                </template>
            </column-item>
        </el-table>
    </div>
</template>
<script setup>
import {} from 'vue';
import columnItem from './column.vue';
const { column, listData } = defineProps({
    /* 表头 */
    column: {
        type: Array,
        default: () => [],
    },
    /* 数据 */
    listData: {
        type: Array,
        default: () => [],
    },
});
</script>

<style scoped lang="scss">
.z-table {
    :deep(.el-table) {
        thead {
            height: 54px;
        }
    }
}
</style>
