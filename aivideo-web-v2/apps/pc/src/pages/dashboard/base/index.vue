<template>
  <div>
    
    <!-- 顶部 card  -->
    <top-panel class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
    <!-- 列表排名 -->
    <rank-list class="row-container" />
    <!-- 出入库概览 -->
    <output-overview class="row-container" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase',
};
</script>

<script setup lang="ts">
import { packageInfo as common } from '@aivideo/common';
import { packageInfo as rest } from '@aivideo/rest';
import MiddleChart from './components/MiddleChart.vue';
import OutputOverview from './components/OutputOverview.vue';
import RankList from './components/RankList.vue';
import TopPanel from './components/TopPanel.vue';
console.log(common.name + ' version:' + common.version);
console.log(rest.name + ' version:' + rest.version);
</script>

<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
</style>
