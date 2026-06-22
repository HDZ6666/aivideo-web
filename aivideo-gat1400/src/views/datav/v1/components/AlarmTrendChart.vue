<template>
    <div class="box box3">
        <div class="box-header">
            <span class="box-title">告警趋势</span>
        </div>
        <div class="box-content">
            <div class="chart-label">告警数量：次</div>
            <div ref="chartRef" class="chart"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// Props
const props = defineProps({
    trendData: {
        type: Array,
        default: () => []
    }
})

// Chart 实例
const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return

    chartInstance = echarts.init(chartRef.value, 'macarons')

    const xData = props.trendData.map(item => item.alarmDate.slice(5))
    const yData = props.trendData.map(item => item.alarmCount)

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            textStyle: {
                color: '#000'
            },
            axisPointer: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255, 224, 144, 0)'
                        }, {
                            offset: 0.5,
                            color: 'rgba(255, 224, 144, 1)',
                        }, {
                            offset: 1,
                            color: 'rgba(255, 224, 144, 0)'
                        }],
                        global: false
                    }
                }
            }
        },
        grid: {
            top: '25',
            left: '55',
            right: '20',
            bottom: '20',
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#3F4F5E',
                    width: 1,
                }
            },
            splitArea: {
                show: false,
                color: '#f00',
                lineStyle: {
                    show: false,
                    color: '#fff'
                },
            },
            axisLabel: {
                color: '#B4C0CC',
                fontSize: 10
            },
            splitLine: {
                show: false
            },
            boundaryGap: false,
            data: xData
        }],
        yAxis: [{
            type: 'value',
            nameTextStyle: {
                color: "#fff"
            },
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#0a79a6'
                }
            },
            axisLabel: {
                show: true,
                margin: 10,
                textStyle: {
                    color: '#B4C0CC',
                    fontSize: 10
                },
            },
            axisTick: {
                show: false,
            },
        }],
        series: [{
            name: '数量',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 0,
            lineStyle: {
                normal: {
                    color: "#FFE090",
                    shadowColor: 'rgba(255, 224, 144, .3)',
                    shadowBlur: 0,
                    shadowOffsetY: 0,
                    shadowOffsetX: 0,
                },
            },
            itemStyle: {
                color: "#FFE090",
                borderColor: "#FFE090",
                borderWidth: 1,
                shadowColor: 'rgba(255, 224, 144, .3)',
                shadowBlur: 0,
                shadowOffsetY: 0,
                shadowOffsetX: 0,
            },
            tooltip: {
                show: true
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255, 224, 144, .3)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(255, 224, 144, 0)'
                    }
                    ], false),
                    shadowColor: 'rgba(2, 191, 239, 0.9)',
                    shadowBlur: 100
                }
            },
            data: yData
        }]
    }

    chartInstance.setOption(option)
}

// 更新图表数据
const updateChart = () => {
    if (!chartInstance) return

    const xData = props.trendData.map(item => item.alarmDate.slice(5))
    const yData = props.trendData.map(item => item.alarmCount)

    chartInstance.setOption({
        xAxis: [{ data: xData }],
        series: [{ data: yData }]
    })
}

// 窗口大小变化时调整图表
const handleResize = () => {
    chartInstance?.resize()
}

// 监听数据变化
watch(() => props.trendData, () => {
    updateChart()
}, { deep: true })

onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
}

.box3 {
    flex: 1;
}

.box-header {
    position: relative;
    width: 100%;
    height: 45px;
    background: url("@/assets/datav/v1/card_title_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    box-sizing: border-box;

    &::before {
        content: '';
        position: absolute;
        width: 21px;
        height: 27px;
        top: 10px;
        left: 10px;
        background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
        background-size: 100% 100%;
    }
}

.box-title {
    color: #fff;
    text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
    font-family: ysbthFont;
    font-size: 21px;
    font-weight: 400;
}

.box-content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    overflow: hidden;
}

.chart-label {
    color: #a0aec0;
    position: absolute;
    font-size: 14px;
}

.chart {
    width: 100%;
    height: 100%;
}
</style>
