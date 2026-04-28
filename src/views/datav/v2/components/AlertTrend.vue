<template>
  <div class="alert-trend">
    <div class="alert-trend__background"></div>

    <div class="alert-trend__content">
      <div class="alert-trend__title-bar">
        <div class="title-content">
          <div class="alert-trend__title-icon">📊</div>
          <span class="alert-trend__title-text">告警增长趋势</span>
          <div class="title-glow"></div>
        </div>
      </div>

      <div ref="chartRef" class="alert-trend__chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

// 图表引用
const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  initChart();
  // 添加窗口大小变化的监听，自动调整图表大小
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 清除图表实例
  chartInstance && chartInstance.dispose();
  // 移除窗口大小变化的监听
  window.removeEventListener("resize", handleResize);
});

// 处理窗口大小变化，调整图表大小
const handleResize = () => {
  chartInstance && chartInstance.resize();
};

// 初始化图表
const initChart = () => {
  // 检查DOM元素是否存在
  if (!chartRef.value) return;

  // 如果图表实例已存在，则销毁
  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartRef.value, "macarons");

  // 模拟数据 - 告警数量和增长率
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const alertCount = [45, 52, 38, 67, 73, 89, 95, 78, 82, 91, 105, 118]; // 告警数量
  const growthRate = [0, 15.6, -26.9, 76.3, 9.0, 21.9, 6.7, -17.9, 5.1, 11.0, 15.4, 12.4]; // 增长率(%)

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#00feff",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      data: ["告警数量", "增长率"],
      textStyle: {
        color: "#fff",
      },
      top: "5%",
      selectedMode: true,
      selected: {
        告警数量: true,
        增长率: true,
      },
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "8%",
      top: "20%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: months,
        axisPointer: {
          type: "shadow",
        },
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "#1a5cd7",
          },
        },
        axisLabel: {
          color: "#fff",
          fontSize: 12,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "告警数量",
        min: 0,
        max: Math.max(...alertCount) * 1.2,
        nameTextStyle: {
          color: "#fff",
          fontSize: 12,
          align: "right",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(26, 92, 215, 0.3)",
            type: "dashed",
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#fff",
          fontSize: 10,
        },
      },
      {
        type: "value",
        name: "增长率(%)",
        nameTextStyle: {
          color: "#fff",
          fontSize: 12,
          align: "left",
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#fff",
          fontSize: 10,
          formatter: "{value}%",
        },
      },
    ],
    series: [
      {
        name: "告警数量",
        type: "bar",
        yAxisIndex: 0,
        data: alertCount,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#00feff" },
            { offset: 1, color: "#027eff" },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#4dffff" },
              { offset: 1, color: "#0099ff" },
            ]),
          },
        },
        barWidth: "60%",
      },
      {
        name: "增长率",
        type: "line",
        yAxisIndex: 1,
        data: growthRate,
        lineStyle: {
          color: "#ff6b6b",
          width: 3,
        },
        itemStyle: {
          color: "#ff6b6b",
          borderColor: "#fff",
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255, 107, 107, 0.3)" },
            { offset: 1, color: "rgba(255, 107, 107, 0.05)" },
          ]),
        },
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        emphasis: {
          itemStyle: {
            color: "#ff8e8e",
            borderColor: "#fff",
            borderWidth: 3,
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);
};
</script>

<style lang="scss" scoped>
.alert-trend {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.alert-trend__background {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.8;
  background: no-repeat center/100% 100% url("@/assets/datav/cockpit/bg/border.png");
}

.alert-trend__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.alert-trend__title-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 70px;
  margin-bottom: 20px;
}

.title-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  margin: 0 16px;
  white-space: nowrap;
}

.alert-trend__title-icon {
  font-size: 30px;
  filter: drop-shadow(0 0 5px rgba(0, 254, 255, 0.5));
}

.alert-trend__title-text {
  color: #00feff;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-shadow: 0 0 10px rgba(0, 254, 255, 0.5);
}

.title-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(0, 254, 255, 0.1), transparent);
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.alert-trend__chart {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  background: rgba(20, 50, 120, 0.08);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 6px;
}

/* 悬停时的发光效果 */
.title-content:hover .title-glow {
  opacity: 1 !important;
}
</style>
