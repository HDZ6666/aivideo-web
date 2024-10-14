<template>
    <div class="center-content">
        <!-- <pie class="pie-chart"></pie>
        <pie class="pie-chart" :color="color" :data="pieData"></pie> -->
        <zTable
            :column="column"
            :listData="data"
            :max-height="setFontSize(610) + 'px'"
            class="carousel-table"
            :span-method="arraySpanMethod"
            :row-class-name="tableRowClassName"
        >
            <template #address="{ row }">
                <span style="color: #43e6ff">{{ row.address }}</span>
            </template>
        </zTable>
        <span>详情</span>
        <zModal
        :model-value="modalVisible"
        title="通知公告"
        @onClose="onClose"
    >
        <div class="tableList">
            <listTable :listData="data" :column="column" :pagination="pagination"></listTable>
        </div>
    </zModal>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import pie from "../echarts/pie.vue"
import { setFontSize } from '@/utils/setFontSize';
import { zTable ,zModal} from '../elComponents/index';
import listTable from "../elComponents/listTable/index.vue"
const color = ['#14cc8f','#ff6629','#fad905']
const pieData = [{
    value:45,
    name:"人脸打卡"
},{
    value:30,
    name:"指纹打卡"
},{
    value:25,
    name:"刷卡打卡"
}]
const column = [
            {
                prop: 'title',
                label: '车牌号',
                align: 'center',
                showOverflowTooltip: true,
            },
            {
                prop: 'name',
                label: '时间',
                align: 'center',
            },
            {
                prop: 'address',
                label: '地点',
                align: 'center',
            },
];
const modalVisible = ref(false)
const pagination = ref({
    total: 100,
    current: 1,
    pageSize: 10,
    background: true,
    autoScroll: true,
    hidden: false,
    
    currentPage: 1,
})
const data = [
    { title: '海水养殖', name: '71.51', address: '70.42' },
    { title: '海水捕捞', name: '71.94', address: '71.86' },
    { title: '海洋石油开采', name: '75.23', address: '75.45' },
    { title: '探设备制造', name: '75.53', address: '75.31' },
    { title: '海洋查研究', name: '76.13', address: '71.93' },
    { title: '海洋生命科学研究', name: '75.84', address: '73.21' },
    { title: '海洋新材料研究开发', name: '70.51', address: '66.51' },
    { title: '海洋信息技术研发', name: '73.89', address: '70.35' },
    { title: '海及休闲娱乐', name: '72.18', address: '71.78' },
];
const onClose = ()=>{
    modalVisible.value = false
}
</script>

<style lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.center-content{
    width: 480px;
    height: 962vh * $h;
    //background: red;
    .pie-chart{
        width: 400px;
        height: 400px;
    }
}
</style>
