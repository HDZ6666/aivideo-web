<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-11-03 15:23:26
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-30 14:07:18
-->
<template>
    <div class="b_Modal">
        <div class="select">
            <div class="city">
                <zSelect v-model:value="city" @change="onChange">
                    <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                </zSelect>
            </div>

            <div class="quarter">
                <zSelect v-model:value="quarter" @change="onChange">
                    <el-option
                        v-for="item in timeList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                </zSelect>
            </div>
        </div>
        <div class="rabio">
            <el-radio-group v-model="radio" @change="handleChange">
                <el-radio :label="3">按行业</el-radio>
                <el-radio :label="6">按地区</el-radio>
                <el-radio :label="9">活跃度</el-radio>
            </el-radio-group>
        </div>
        <div class="content">
            <charts v-show="radio == 3" />
            <div class="histogram" ref="target" v-if="radio == 6"></div>
            <div class="histogram" ref="target" v-if="radio == 9"></div>
        </div>
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
import { zSelect, zPagination } from '@/components/elComponents/index';
import { cityList } from '@/assets/echarts/moni.js';
import { mockFn2 } from '@/hook/useMockData.js';
import { setHeight, setWeigth } from '@/utils/setSize';
import { setFontSize } from '@/utils/setFontSize';
import charts from './charts.vue';
const props = defineProps({});
const city = ref('广东省');
const quarter = ref(1);
const radio = ref(2);
const timeList = [
    {
        id: '23',
        label: '2023年·第一季度',
        value: 0,
    },
    {
        id: '43',
        label: '2023年·第二季度',
        value: 1,
    },
    {
        id: '233',
        label: '2023年·第三季度',
        value: 2,
    },
    {
        id: '2333',
        label: '2023年·第四季度',
        value: 3,
    },
];
const column = [
    { type: 'index', label: '排名', align: 'center', minWidth: '25%' },
    { prop: 'title', label: '地区', align: 'center', minWidth: '25%' },
    { prop: 'dec', label: '活跃度', align: 'center', minWidth: '25%' },
    { prop: 'value', label: '上季度活跃度', align: 'center', minWidth: '25%' },
];
const onChange = (v) => {
    mockFn2(data.value, ['dec', 'value'], 60, 90);
};
const handleChange = (v) => {
    if (v == 6 || v == 9) {
        clearInterval(timer);
        init();
    }
};
const Echarts = inject('$echarts');
let mChart = null;
const target = ref(null);
const label = [
    '深圳市',
    '广州市',
    '中山市',
    '肇庆市',
    '阳江市',
    '惠州市',
    '江门市',
    '潮州市',
    '佛山市',
    '汕头市',
    '湛江市',
    '东莞市',
    '揭阳市',
    '梅州市',
    '珠海市',
    '汕尾市',
    '韶关市',
    '云浮市',
    '清远市',
    '茂名市',
    '河源市',
];
let defaultLabel = [
    '深圳市',
    '广州市',
    '中山市',
    '肇庆市',
    '阳江市',
    '惠州市',
    '江门市',
    '潮州市',
    '佛山市',
    '汕头市',
    '湛江市',
    '东莞市',
    '揭阳市',
];
let data1 = [
    2.12, 4.92, 7.23, 23.13, 25.63, 76.71, 135.61, 4.93, 7.32, 21.21, 25.63, 76.73, 35.62,
];
let data2 = [
    20.32, 50.42, 30.56, 23.24, 25.63, 76.75, 135.62, 4.95, 7.23, 23.25, 25.64, 76.78, 135.63,
];

let timer = null;
const init = () => {
    mChart = markRaw(Echarts.init(target.value));

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['本季活跃度', '上季度活跃度'],
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
            // position:'top',1
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
                rich: {},
            },

            // axisLabel: {
            //     interval: 1, // 设置每隔一个刻度显示标签
            // },
        },
        yAxis: {
            name: radio.value == 6 ? '地区' : '活跃度',
            type: 'value',
            offset: 15,
            axisLabel: {
                color: '#E6F7FF',
                fontSize: setFontSize(40),
            },
            nameTextStyle: {
                fontSize: setFontSize(40),
                color: 'rgba(230, 247, 255, 0.70)',
                align: 'right',
                padding: [0, 0, 15, 0],
            },
        },
        series: [
            {
                name: '本季活跃度',
                symbol: 'circle',
                type: 'bar',
                data: data1,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: '#4A90E2',
                    shadowBlur: 10,
                    shadowColor: '#4A90E2',
                },
                barWidth: 20, // 设置柱子宽度为30
            },
            {
                name: '上季度活跃度',
                symbol: 'circle',
                type: 'bar',
                data: data2,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#fff',
                    color: '#00E7C0',
                    shadowBlur: 10,
                    shadowColor: '#00E7C0',
                },
                barWidth: 20, // 设置柱子宽度为30
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
        data2.push(+(Math.random() * 100 + 5).toFixed(0));
        data1.push(+(Math.random() * 100 + 8).toFixed(0));
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
    // window.addEventListener('resize', function () {
    //     mChart.resize();
    // });
});
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.b_Modal {
    padding: 44px 36px;
    .rabio {
        display: flex;
        width: 100%;
        justify-content: right;
        :deep .el-radio {
            .el-radio__label {
                font-size: 20px;
            }
            /* .el-radio__input{
                .el-radio__inner::after{
                    width: 20px;
                    height: 20px;
                }
            } */
        }
        .item {
            display: flex;
            .dot {
                width: 22px;
                height: 22vh * $h;
                border: 2px solid #a2cdff;
                border-radius: 50%;
                padding: 10px;
                overflow: hidden;
                .bg {
                    background-color: #4a90e2;
                }
            }
        }
    }
    .select {
        height: 46vh * $h;
        margin-bottom: 25px;
        display: flex;

        .city {
            width: 130px;
            margin-right: 24px;
        }

        .quarter {
            width: 236vh * $h;
        }
    }

    .content {
        height: 600vh * $h;
        width: 100%;
        .histogram {
            height: 600vh * $h;
            width: 100%;
        }
    }
}
</style>
