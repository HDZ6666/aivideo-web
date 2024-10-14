<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-24 10:25:41
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-10 16:16:34
-->

 
<!--https://juejin.cn/post/7218916720323985463?searchId=202310161556103B2C28145DE45925E0B7 -->
<template>
    <el-table-column v-if="col.type === 'selection'" v-bind="col" />
    <el-table-column v-else-if="col.type === 'index'" v-bind="col" />
    <template v-else>
        <el-table-column v-if="!col.children" v-bind="col">
            <template #default="scope">
                <slot :name="col.slotName || col.prop" v-bind="scope">
                    <span>
                        {{ scope.row[col.prop] }}
                    </span>
                </slot>
            </template>
        </el-table-column>
    </template>

    <el-table-column v-if="col.children" v-bind="col">
        <column v-for="t in col.children" :key="t.prop || t.label" :col="t">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope" :key="t.prop || t.label">
                <slot :name="slot" v-bind="scope" />
            </template>
        </column>
    </el-table-column>
</template>
  
<script setup name="column">

const { col } = defineProps({
    col: {
        type: Object,
        default: () => { }
    }
})

</script>

  
<style lang="scss" scoped></style>
  
  
  