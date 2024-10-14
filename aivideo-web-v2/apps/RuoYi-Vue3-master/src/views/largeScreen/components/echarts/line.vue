<!--
 * @Author: zhangcirao
 * @Date: 2023-10-12 09:53:45
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-08 14:49:10
 * @FilePath: \active-enterprise\src\components\echarts\Line.vue
 * @Description: 线条图组件
-->
<template>
    <div ref="target" class="line"></div>
</template>

<script setup>
import { ref, onMounted, inject, markRaw, nextTick } from 'vue';
import { setFontSize } from '@/utils/setFontSize';
import { setHeight, setWeigth } from '@/utils/setSize';

const { optionData, myColor, myOption } = defineProps({
    optionData: {
        type: Array,
        required: true,
        default: [
            [12, 13, 10],
            [22, 18, 19],
        ],
    },
    myColor: {
        default: ['#4a90e2', '#FFB800',],
    },
    myOption: {},
});
const Echarts = inject('$echarts');
let mChart = null;
const target = ref(null);
onMounted(() => {
    renderChart();
    window.addEventListener('resize', () => {
        mChart.resize();
    });
    nextTick(() => {});
});

const renderChart = () => {
    mChart = markRaw(Echarts.init(target.value));

    const option = {
        color: myColor,
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: [
                '【疑似烟火】告警数',
                '【通道占用】告警数',
            ],
            icon: 'circle',
            right: '0%',
            itemWidth: setWeigth(15), // 长方形宽度
            itemHeight: setHeight(15), // 长方形高度
            itemGap:setWeigth(520),
            textStyle: {
                color: '#fff',
                fontSize: setFontSize(14),
            },
        },
        grid: {
            left: '2%',
            right: '4%',
            bottom: '10%',
            containLabel: true,
        },
        xAxis: {
            // offset: 20,
            type: 'category',
            // boundaryGap: false,
            data: ['2023.07', '2023.08', '2023.09'],
            offset: 20,
            // position:'top',
            axisTick: {
                show: true,
            },
            axisLine: {
                lineStyle: {
                    color: '#bae7ff',
                },
            },
            axisLabel: {
                fontSize: setFontSize(20),
                color: 'rgba(230, 247, 255, 0.50)',
            },
            // axisLabel: {
            //     interval: 1, // 设置每隔一个刻度显示标签
            // },
        },
        yAxis: [{
            name:"",
            type: 'value',
            
            position:"left",
            axisLabel: {
                color: '#E6F7FF',
                fontSize: setFontSize(20),
            },
        },{
            name:"",
            type: 'value',
        
            position:"right",
            axisLabel: {
                color: '#E6F7FF',
                fontSize: setFontSize(20),
            },
        }],
        series: [
            {
                name: '【疑似烟火】告警数',
                type: 'line',
                symbol: 'circle',
                // symbolSize: 8, // 小圆点的大小
                data: optionData[0],
                smooth: true,
                yAxisIndex:0,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: myColor[2],
                    shadowBlur: 10,
                    shadowColor: myColor[2],
                },
            },
            {
                name: '【通道占用】告警数',
                type: 'line',
                symbol: 'circle',
                // symbolSize: 8, // 小圆点的大小
                smooth: true,
                yAxisIndex:1,
                data: optionData[1],
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: myColor[1],
                    shadowBlur: 10,
                    shadowColor: myColor[1],
                },
            },
        ],
    };
    mChart.setOption({ ...option, ...myOption });
};
</script>

<style lang="scss" scoped>
.line {
    width: 100%;
    height: 100%;
}
</style>
