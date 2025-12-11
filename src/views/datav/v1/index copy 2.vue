<template>
  <div id="cockpit" class="container">
    <div class="container-cover">
      <!-- 顶部导航栏 -->
      <div class="header">
        <!-- 左侧：时间显示 -->
        <div class="header-left">
          <div class="icon-time"></div>
          <div class="datetime">
            <span class="date">{{ dateStr }}</span>
            <span class="time">{{ timeStr }}</span>
            <span class="week">{{ weekStr }}</span>
          </div>
        </div>

        <!-- 中间：标题 -->
        <div class="header-center">
          <span class="title">{{ title }}</span>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="header-right">
          <!-- 告警开关 -->
          <div class="action-item">
            <span>{{ alarmActive ? '开启' : '关闭' }}告警</span>
            <el-switch v-model="alarmActive" class="alarm-switch" />
          </div>
          <!-- 地图大屏 -->
          <div class="action-item btn" @click="handleMapScreen">
            <span>地图大屏</span>
          </div>
          <!-- 后台管理 -->
          <div class="action-item btn" @click="gotoDashboard">
            <img src="@/assets/datav/v1/back.png" alt="" />
            <span>后台管理</span>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import autofit from "autofit.js";

// 页面标题
const title = ref('监控驾驶舱')

// 告警开关状态
const alarmActive = ref(false)

// 时间相关
const dateStr = ref('')
const timeStr = ref('')
const weekStr = ref('')
let timer = null

// 星期映射
const weekMap = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// 更新时间
const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  dateStr.value = `${year}/${month}/${day}`

  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  timeStr.value = `${hour}:${minute}:${second}`

  weekStr.value = weekMap[now.getDay()]
}

// 跳转后台管理
const gotoDashboard = () => {
  const currentHref = window.top.location.href
  const newUrl = currentHref.replace(/#.*$/, '#/index')
  window.top.location.href = newUrl
}

// 跳转地图大屏
const handleMapScreen = () => {
  // TODO: 实现地图大屏跳转逻辑
  console.log('跳转地图大屏')
}

onMounted(() => {
  updateDateTime()
  // autofit.js 自动缩放配置 - 禁用拉伸，保持1920x1080比例
  autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#cockpit",
    resize: false,  // 禁用拉伸，保持设计稿比例
  });

  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  // 清理 autofit
  autofit.off()
})
</script>
<style lang="scss" scoped>
// 基于 1920x1080 设计稿，使用 autofit.js 自动缩放
.container {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background: url("@/assets/datav/v1/home-bg.png") no-repeat center;
  background-size: 1920px 1080px;
}

.container-cover {
  width: 1920px;
  height: 1080px;
  background: radial-gradient(
    48.84% 50.6% at 50% 48.19%,
    rgba(0, 144, 225, 0.35) 0%,
    rgba(5, 118, 223, 0.03) 100%
  ), #000;
}
// 顶部导航栏 - 高度56px
.header {
  position: absolute;
  width: 1920px;
  z-index: 10;
  height: 56px;
  background: url("@/assets/datav/v1/head_bg.png") no-repeat center;
  background-size: 1920px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
}

// 左侧时间区域
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;

  .icon-time {
    width: 20px;
    height: 20px;
    background: url("@/assets/datav/v1/time.png") no-repeat center;
    background-size: 20px 20px;
  }

  .datetime {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: 16px;

    .date {
      white-space: nowrap;
    }

    .time {
      white-space: nowrap;
    }

    .week {
      white-space: nowrap;
    }
  }
}

// 中间标题
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(180deg, #ffffff 0%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 6px;
  }
}

// 右侧操作区域
.header-right {
  display: flex;
  align-items: center;
  gap: 24px;

  .action-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
    }

    &.btn:hover {
      color: #7dd3fc;
    }
  }

  // 自定义开关样式
  .alarm-switch {
    --el-switch-on-color: #00d4ff;
    --el-switch-off-color: #4a5568;
  }
}

// 主内容区域
.main {
  position: absolute;
  left: 0;
  width: 1920px;
  bottom: 0;
  top: 56px;
}
</style>

<!-- 全局样式：隐藏滚动条，防止页面溢出 -->
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
}
</style>