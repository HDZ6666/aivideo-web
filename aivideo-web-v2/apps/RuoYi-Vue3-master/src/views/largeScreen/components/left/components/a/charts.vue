<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-11-03 15:23:26
 * @LastEditors: lhl
 * @LastEditTime: 2023-12-07 17:01:45
-->
<template>
    <div class="b_Modal">
        <div class="value" ref="target"></div>
    </div>
</template>
<script setup>
import {
    ref,
    nextTick,
    inject,
    markRaw,
    onMounted,
    onBeforeUnmount,
} from 'vue';
import { setFontSize } from '@/utils/setFontSize';
import { setHeight, setWeigth } from '@/utils/setSize';
const Echarts = inject('$echarts');
let mChart = null;
const target = ref(null);
let timer = null;
let data1 = [2, 5, 7, 23, 25, 77, 136];
let data2 = [20, 50, 30, 23, 26, 77, 136];
const label = [
    '公共管理、社会保障和社会组织',
    '电力、热力、燃气及水生产和供应业',
    '住宿和餐饮业',
    '文化、体育和娱乐业',
    '科学研究和技术服务业',
    '租赁和商务服务业',
    '卫生和社会工作',
    '批发和零售业',
    '水利、环境和公共设施管理业',
    '交通运输、仓储和邮政业',
    '制造业',
    '信息传输、软件和信息技术服务业',
    '建筑业',
    '居民服务、修理和其他服务业',
    '国际组织',
    '房地产业',
    '教育',
    '金融业',
    '采矿业',
    '农、林、牧、渔业',
];

let defaultLabel = [
    '公共管理、社会保障和社会组织',
    '电力、热力、燃气及水生产和供应业',
    '住宿和餐饮业',
    '文化、体育和娱乐业',
    '科学研究和技术服务业',
    '租赁和商务服务业',
    '卫生和社会工作',
];
const props = defineProps({});
const init = () => {
    mChart = markRaw(Echarts.init(target.value));

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['活跃度', '活跃企业数'],
            icon: 'rect',
            itemWidth: setWeigth(54), // 长方形宽度
            itemHeight: setHeight(8), // 长方形高度
            right: '0%',
            textStyle: {
                color: '#fff',
                fontSize: setFontSize(30),
            },
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '6%',
            containLabel: true,
        },
        xAxis: {
            // offset: 20,
            type: 'category',
            // boundaryGap: false,
            data: defaultLabel,
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
                fontSize: setFontSize(32),
                color: 'rgba(230, 247, 255, 0.50)',
                interval: 0,
                formatter: function (value) {
                    return '{a|' + value + '}';
                },
                rich: {
                    a: {
                        color: '#fff',
                        align: 'center',
                        // fontSize: 15,
                        // width: 144,
                        // height: 160
                    },
                },
            },

            // axisLabel: {
            //     interval: 1, // 设置每隔一个刻度显示标签
            // },
        },
        yAxis: {
            type: 'value',
            offset: 15,
            axisLabel: {
                color: '#E6F7FF',
                fontSize: setFontSize(40),
            },
        },
        series: [
            {
                name: '活跃度',
                symbol: 'circle',
                type: 'bar',
                data: data1,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: '#4A90E2',
                    // shadowBlur: 10,
                    shadowColor: '#4A90E2',
                },
                barWidth: 20,
            },
            {
                name: '活跃企业数',
                symbol: 'circle',
                type: 'bar',
                data: data2,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: '#00E7C0',
                    // shadowBlur: 10,
                    shadowColor: '#00E7C0',
                },
                barWidth: 20,
            },
        ],
    };

    mChart.setOption({ ...option });

    setValue();
};
let labelLength = defaultLabel.length;
let index = labelLength;
const setValue = () => {
    timer = setInterval(() => {
        index++;
        // if(index>label.length){
        //     index = labelLength
        // }
        if (index > label.length - 1) {
            index = 0;
        }
        defaultLabel.shift();
        defaultLabel.push(label[index]);
        data1.shift();
        data2.shift();
        data2.push(+(Math.random() * 100 + 5).toFixed(1));
        data1.push(+(Math.random() * 100 + 8).toFixed(1));
        mChart.setOption({
            xAxis: [
                {
                    data: defaultLabel,
                },
            ],
            series: [
                {
                    data: data1,
                },
                {
                    data: data2,
                },
            ],
        });
    }, 1000 * 2);
};

onBeforeUnmount(() => {
    clearInterval(timer);
});
onMounted(() => {
    nextTick(() => {
        init();
    });
});
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.b_Modal {
    width: 100%;
    height: 100%;

    .select {
        height: 46vh * $h;
        margin-bottom: 65vh * $h;
        display: flex;

        .city {
            width: 130px;
            margin-right: 24vh * $h;
        }

        .quarter {
            width: 236px;
        }
    }

    .value {
        margin-top: 80vh * $h;
        width: 100%;
        height: 100%;
    }
}
</style>
