<template>
  <div class="alert-list">
    <div class="alert-list__background"></div>

    <div class="alert-list__content">
      <div class="alert-list__title-bar">
        <div class="title-content">
          <div class="alert-list__title-icon">🚨</div>
          <span class="alert-list__title-text">当日告警</span>
          <div class="title-glow"></div>
        </div>
      </div>

      <div class="alert-list__table-panel">
        <div class="table-header">
          <div class="table-header__row">
            <div class="table-header__cell table-header__cell--store">门店名称</div>
            <div class="table-header__cell">告警类型</div>
            <div class="table-header__cell">告警时间</div>
            <div class="table-header__cell table-header__cell--status">处理状态</div>
          </div>
        </div>

        <div class="alert-list__body">
          <div
            ref="scrollContainer"
            class="alert-scroll-container"
            :style="{ transform: `translateY(${scrollOffset}px)` }"
          >
            <div v-for="(alert, index) in alertList" :key="`${alert.id}-${index}`" class="alert-item">
              <div class="alert-item__cell alert-item__cell--store">
                <div class="alert-type-dot" :class="getAlertTypeColor(alert.alertType)"></div>
                <div class="alert-item__store-name">{{ alert.storeName }}</div>
              </div>

              <div class="alert-item__cell">
                <span class="alert-type-tag" :class="getAlertTypeStyle(alert.alertType)">
                  {{ alert.alertType }}
                </span>
              </div>

              <div class="alert-item__cell">
                <span class="alert-item__time">{{ alert.alertTime }}</span>
              </div>

              <div class="alert-item__cell alert-item__cell--status">
                <div class="status-tag" :class="getStatusStyle(alert.status)">
                  {{ alert.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { dashboardAlertMockData } from "../alarmMockData";

const scrollContainer = ref(null);
const scrollOffset = ref(0);
let scrollTimer = null;

const alertList = ref(dashboardAlertMockData);

const alertTypeColorMap = {
  老鼠识别: "alert-type-dot--danger",
  垃圾桶满溢: "alert-type-dot--warning",
  厨师服和口罩: "alert-type-dot--info",
  未佩戴厨师帽: "alert-type-dot--danger",
};

const alertTypeStyleMap = {
  老鼠识别: "alert-type-tag--danger",
  垃圾桶满溢: "alert-type-tag--warning",
  厨师服和口罩: "alert-type-tag--info",
  未佩戴厨师帽: "alert-type-tag--danger",
};

const statusStyleMap = {
  未处理: "status-tag--danger",
  待处理: "status-tag--danger",
  处理中: "status-tag--warning",
  已处理: "status-tag--success",
};

const getAlertTypeColor = (alertType) => {
  return alertTypeColorMap[alertType] || "alert-type-dot--default";
};

const getAlertTypeStyle = (alertType) => {
  return alertTypeStyleMap[alertType] || "alert-type-tag--default";
};

const getStatusStyle = (status) => {
  return statusStyleMap[status] || "status-tag--default";
};

const startScrolling = () => {
  const itemHeight = 50;
  const containerHeight = 250;
  const totalHeight = alertList.value.length * itemHeight;

  if (totalHeight <= containerHeight) {
    return;
  }

  scrollTimer = setInterval(() => {
    scrollOffset.value -= 1;
    if (Math.abs(scrollOffset.value) >= totalHeight) {
      scrollOffset.value = 0;
    }
  }, 50);
};

const stopScrolling = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer);
    scrollTimer = null;
  }
};

onMounted(() => {
  startScrolling();
});

onUnmounted(() => {
  stopScrolling();
});
</script>

<style lang="scss" scoped>
.alert-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.alert-list__background {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.8;
  background: no-repeat center/100% 100% url("@/assets/datav/cockpit/bg/border.png");
}

.alert-list__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.alert-list__title-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 70px;
  margin-bottom: 8px;
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

.alert-list__title-icon {
  font-size: 30px;
  filter: drop-shadow(0 0 5px rgba(0, 254, 255, 0.5));
}

.alert-list__title-text {
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

.alert-list__table-panel {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 6px;
  background: rgba(20, 50, 120, 0.08);
}

.table-header__row,
.alert-item {
  display: grid;
  grid-template-columns: 4fr 3fr 3fr 2fr;
  gap: 16px;
  align-items: center;
}

.table-header__cell {
  color: #00feff;
  font-size: 14px;
  font-weight: 700;
}

.table-header__cell--status,
.alert-item__cell--status {
  text-align: center;
}

.alert-list__body {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.alert-item__cell {
  min-width: 0;
}

.alert-item__cell--store {
  display: flex;
  align-items: center;
}

.alert-type-dot {
  width: 8px;
  height: 8px;
  margin-right: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.alert-item__store-name {
  overflow: hidden;
  color: #00feff;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-type-tag,
.status-tag {
  display: inline-block;
  border: 1px solid;
}

.alert-type-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
}

.alert-item__time {
  color: #00feff;
  font-size: 14px;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.alert-type-dot--danger {
  color: #ef4444;
  background: #ef4444;
}

.alert-type-dot--info {
  color: #3b82f6;
  background: #3b82f6;
}

.alert-type-dot--success {
  color: #22c55e;
  background: #22c55e;
}

.alert-type-dot--warning {
  color: #9333ea;
  background: #9333ea;
}

.alert-type-dot--default {
  color: #9ca3af;
  background: #9ca3af;
}

.alert-type-tag--danger {
  color: #fca5a5;
  border-color: #f87171;
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

.alert-type-tag--info {
  color: #93c5fd;
  border-color: #60a5fa;
  background: rgba(59, 130, 246, 0.2);
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
}

.alert-type-tag--success {
  color: #86efac;
  border-color: #4ade80;
  background: rgba(34, 197, 94, 0.2);
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.alert-type-tag--warning {
  color: #d8b4fe;
  border-color: #c084fc;
  background: rgba(147, 51, 234, 0.2);
  box-shadow: 0 0 6px rgba(147, 51, 234, 0.4);
}

.alert-type-tag--default {
  color: #d1d5db;
  border-color: #9ca3af;
  background: rgba(107, 114, 128, 0.2);
}

.status-tag--danger {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

.status-tag--success {
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.2);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
}

.status-tag--default {
  color: #9ca3af;
  border-color: rgba(107, 114, 128, 0.3);
  background: rgba(107, 114, 128, 0.2);
}
.title-content:hover .title-glow {
  opacity: 1 !important;
}
.alert-scroll-container {
  transition: transform 0.05s linear;
}
.table-header {
  padding: 12px;
  border-bottom: 1px solid rgba(0, 149, 255, 0.4);
  background: linear-gradient(90deg, rgba(25, 55, 125, 0.8) 0%, rgba(20, 50, 120, 0.8) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 149, 255, 0.2);
}
.alert-item {
  min-height: 50px;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.alert-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 254, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.alert-item:hover::before {
  left: 100%;
}

.alert-item:hover {
  background: linear-gradient(90deg, rgba(25, 55, 125, 0.8) 0%, transparent 100%);
  box-shadow: 0 2px 10px rgba(0, 149, 255, 0.2);
}
</style>
