<template>
  <div v-if="visible" class="alert-dialog-overlay">
    <div class="alert-dialog-container">
<div class="tech-border">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
        <div class="edge edge-top"></div>
        <div class="edge edge-bottom"></div>
        <div class="edge edge-left"></div>
        <div class="edge edge-right"></div>
      </div>
<div v-if="showCloseButton" class="close-btn" @click="handleClose">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
      </div>
<div class="dialog-header">
        <div class="title-line"></div>
        <h2 class="dialog-title">
          {{ `${currentAlertData.storeName} - ${currentAlertData.alertType}` }}
        </h2>
        <div class="title-line"></div>
      </div>
<div class="dialog-content">
<div class="image-section">
<div class="main-image-container">
            <el-image
              v-if="currentImage"
              :src="currentImage"
              :alt="currentAlertData.alertType"
              class="main-image"
              fit="contain"
            />
            <div v-else class="no-image-placeholder">
              <span class="placeholder-icon">🖼️</span>
              <span class="placeholder-text">暂无告警图片</span>
            </div>
          </div>
<div v-if="currentAlertData.images && currentAlertData.images.length > 1" class="thumbnail-section">
            <div
              v-for="(image, index) in currentAlertData.images"
              :key="index"
              :class="['thumbnail-item', { active: currentImageIndex === index }]"
              @click="switchImage(index)"
            >
              <el-image :src="image" :alt="`告警图片${index + 1}`" class="thumbnail-image" fit="cover" />
            </div>
          </div>
        </div>
<div class="info-section">
<div class="alert-header">
            <div class="alert-type-badge" :class="getAlertTypeStyle(currentAlertData.alertType)">
              <div class="badge-icon">
                <svg-icon icon-class="alert" class="icon-size" />
              </div>
              <div class="badge-text">{{ currentAlertData.alertType }}</div>
            </div>
            <div class="alert-status" :class="getStatusStyle(currentAlertData.processStatus)">
              {{ currentAlertData.processStatus }}
            </div>
          </div>
<div class="description-card">
            <div class="card-header">
              <div class="header-icon">
                <svg-icon icon-class="description" class="icon-size" />
              </div>
              <div class="header-title">告警详情</div>
            </div>
            <div class="card-body">
              <p class="description-text">{{ currentAlertData.alertDescription }}</p>
            </div>
          </div>
<div class="info-grid">
            <div class="grid-item time-item">
              <div class="item-icon">
                <svg-icon icon-class="time" class="icon-size" />
              </div>
              <div class="item-content">
                <div class="item-label">告警时间</div>
                <div class="item-value">{{ currentAlertData.alertTime }}</div>
              </div>
            </div>

            <div v-if="currentAlertData.deviceName" class="grid-item device-item">
              <div class="item-icon">
                <svg-icon icon-class="device" class="icon-size" />
              </div>
              <div class="item-content">
                <div class="item-label">设备名称</div>
                <div class="item-value">{{ currentAlertData.deviceName }}</div>
              </div>
            </div>

            <div class="grid-item location-item">
              <div class="item-icon">
                <svg-icon icon-class="location" class="icon-size" />
              </div>
              <div class="item-content">
                <div class="item-label">告警位置</div>
                <div class="item-value">{{ currentAlertData.storeName }}</div>
              </div>
            </div>
          </div>
<div class="action-buttons">
            <button class="action-btn primary-btn">
              <span class="btn-icon">
                <svg-icon icon-class="check" class="icon-size" />
              </span>
              <span class="btn-text">标记已处理</span>
            </button>
            <button class="action-btn secondary-btn">
              <span class="btn-icon">
                <svg-icon icon-class="phone" class="icon-size" />
              </span>
              <span class="btn-text">联系门店</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { createRandomDialogAlert, dialogAlertMockData } from "../alarmMockData";

const props = defineProps({
  enabled: {
    type: Boolean,
    default: false,
  },
  showDuration: {
    type: Number,
    default: 10000,
  },
  hideDuration: {
    type: Number,
    default: 5000,
  },
  featchDuration: {
    type: Number,
    default: 5000,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  detailPageOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "image-switch"]);

const visible = ref(false);
const currentImageIndex = ref(0);
const currentAlertData = ref({
  images: [],
  storeName: "",
  alertType: "",
  alertDescription: "",
  alertTime: "",
  processStatus: "",
  deviceName: "",
});

const alertQueue = ref([]);
const lastAlertIds = ref(new Set());

let apiTimer = null;
let displayTimer = null;
let hideTimer = null;
let resumeTimer = null;

const currentImage = computed(() => {
  if (currentAlertData.value.images && currentAlertData.value.images.length > 0) {
    return currentAlertData.value.images[currentImageIndex.value];
  }
  return null;
});

const getMockAlertData = () =>
  dialogAlertMockData.map((alert) => ({
    ...alert,
    images: [...alert.images],
    displayed: false,
  }));

const clearAllTimers = () => {
  if (apiTimer) {
    clearInterval(apiTimer);
    apiTimer = null;
  }
  if (displayTimer) {
    clearTimeout(displayTimer);
    displayTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (resumeTimer) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
};

const fetchAlertData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alerts = getMockAlertData();
      if (Math.random() > 0.7) {
        alerts.unshift(createRandomDialogAlert());
      }
      resolve(alerts);
    }, 100);
  });
};

const showNextAlert = () => {
  if (!props.enabled || props.detailPageOpen || visible.value) {
    return;
  }

  if (displayTimer) {
    clearTimeout(displayTimer);
    displayTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  const nextAlert = alertQueue.value.shift();
  if (!nextAlert) {
    return;
  }

  currentAlertData.value = {
    ...nextAlert,
    images: nextAlert.images?.length ? [nextAlert.images[0]] : [],
  };
  currentImageIndex.value = 0;
  visible.value = true;

  displayTimer = setTimeout(() => {
    visible.value = false;
    hideTimer = setTimeout(() => {
      showNextAlert();
    }, props.hideDuration);
  }, props.showDuration);
};

const fetchAndProcessAlerts = async () => {
  if (!props.enabled) {
    return;
  }

  try {
    const alerts = await fetchAlertData();
    if (!props.enabled) {
      return;
    }

    const newAlerts = alerts
      .filter((alert) => !lastAlertIds.value.has(alert.id))
      .map((alert) => ({
        ...alert,
        displayed: false,
      }));

    alerts.forEach((alert) => lastAlertIds.value.add(alert.id));

    if (newAlerts.length > 0) {
      alertQueue.value = [...newAlerts, ...alertQueue.value];
      if (!visible.value && !props.detailPageOpen) {
        showNextAlert();
      }
    }
  } catch (error) {
    console.error("获取告警数据失败:", error);
  }
};

const startRealTimeAlert = () => {
  clearAllTimers();
  lastAlertIds.value = new Set();
  alertQueue.value = [];
  fetchAndProcessAlerts();
  apiTimer = setInterval(() => {
    fetchAndProcessAlerts();
  }, props.featchDuration);
};

const stopRealTimeAlert = () => {
  clearAllTimers();
  visible.value = false;
  alertQueue.value = [];
  lastAlertIds.value = new Set();
};

const switchImage = (index) => {
  currentImageIndex.value = index;
  emit("image-switch", index);
};

const handleClose = () => {
  if (displayTimer) {
    clearTimeout(displayTimer);
    displayTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (resumeTimer) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }

  visible.value = false;

  if (props.enabled && alertQueue.value.length > 0 && !props.detailPageOpen) {
    resumeTimer = setTimeout(() => {
      showNextAlert();
    }, props.hideDuration);
  }

  emit("close");
};

const getAlertTypeStyle = (alertType) => {
  const styleMap = {
    老鼠识别: "alert-type-danger",
    垃圾桶满溢: "alert-type-warning",
    厨师服和口罩: "alert-type-info",
    未佩戴厨师帽: "alert-type-danger",
  };
  return styleMap[alertType] || "alert-type-default";
};

const getStatusStyle = (status) => {
  const styleMap = {
    未处理: "status-danger",
    待处理: "status-danger",
    处理中: "status-warning",
    已处理: "status-success",
  };
  return styleMap[status] || "status-default";
};

watch(
  () => props.enabled,
  (newVal) => {
    if (newVal) {
      startRealTimeAlert();
    } else {
      stopRealTimeAlert();
    }
  }
);

watch(
  () => props.detailPageOpen,
  (newVal) => {
    if (newVal) {
      if (displayTimer) {
        clearTimeout(displayTimer);
        displayTimer = null;
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      visible.value = false;
      return;
    }

    if (props.enabled && alertQueue.value.length > 0 && !visible.value) {
      showNextAlert();
    }
  }
);

onMounted(() => {
  if (props.enabled) {
    startRealTimeAlert();
  }
});

onBeforeUnmount(() => {
  clearAllTimers();
});

onUnmounted(() => {
  stopRealTimeAlert();
});
</script>

<style lang="scss" scoped>
.alert-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background: radial-gradient(ellipse at center, rgba(20, 50, 120, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

.alert-dialog-container {
  position: relative;
  width: 1400px;
  height: 800px;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.95) 0%, rgba(25, 55, 125, 0.98) 50%, rgba(20, 50, 120, 0.95) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 12px;
  padding: 30px;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 50px rgba(0, 149, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideIn 0.4s ease-out;
}
.tech-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 12px;
  overflow: hidden;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #00feff;
}

.corner.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner.corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

.edge {
  position: absolute;
  background: linear-gradient(90deg, transparent, #00feff, transparent);
  opacity: 0.6;
}

.edge.edge-top,
.edge.edge-bottom {
  height: 1px;
  left: 50px;
  right: 50px;
}

.edge.edge-top {
  top: 10px;
}

.edge.edge-bottom {
  bottom: 10px;
}

.edge.edge-left,
.edge.edge-right {
  width: 1px;
  top: 50px;
  bottom: 50px;
  background: linear-gradient(180deg, transparent, #00feff, transparent);
}

.edge.edge-left {
  left: 10px;
}

.edge.edge-right {
  right: 10px;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00feff;
  cursor: pointer;
  background: rgba(20, 50, 120, 0.8);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 149, 255, 0.2);
  border-color: #00feff;
  box-shadow: 0 0 15px rgba(0, 254, 255, 0.3);
  transform: scale(1.05);
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  gap: 15px;
}

.title-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00feff, transparent);
  opacity: 0.6;
}

.dialog-title {
  font-size: 28px;
  font-weight: 600;
  color: #00feff;
  text-shadow: 0 0 10px rgba(0, 254, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.title-icon {
  font-size: 20px;
}

.dialog-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  gap: 40px;
  overflow: hidden;
}

.image-section {
  display: flex;
  flex: 1.5;
  flex-direction: column;
  gap: 16px;
}

.main-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 600px;
  overflow: hidden;
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(34, 211, 238, 0.5);
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 14px;
  opacity: 0.8;
}

.thumbnail-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
}

.thumbnail-item {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  border: 2px solid rgba(0, 149, 255, 0.3);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: rgba(0, 254, 255, 0.6);
  box-shadow: 0 0 12px rgba(0, 149, 255, 0.4);
  transform: scale(1.05);
}

.thumbnail-item.active {
  border-color: #00feff;
  box-shadow: 0 0 16px rgba(0, 254, 255, 0.6);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 8px;
}
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-type-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
}

.alert-type-badge .badge-icon {
  font-size: 20px;
  color: inherit;
}

.alert-type-badge .badge-text {
  font-weight: 600;
}

.alert-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
}
.description-card {
  background: rgba(0, 149, 255, 0.08);
  border: 1px solid rgba(0, 149, 255, 0.25);
  border-radius: 12px;
  overflow: hidden;
}

.description-card .card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px 12px;
  background: rgba(0, 149, 255, 0.1);
  border-bottom: 1px solid rgba(0, 149, 255, 0.2);
}

.description-card .card-header .header-icon {
  font-size: 18px;
  color: #00feff;
}

.description-card .card-header .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #00feff;
}

.description-card .card-body {
  padding: 16px 20px;
}

.description-card .card-body .description-text {
  font-size: 15px;
  color: #fff;
  line-height: 1.6;
  margin: 0;
}
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(0, 149, 255, 0.05);
  border: 1px solid rgba(0, 149, 255, 0.15);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.grid-item:hover {
  background: rgba(0, 149, 255, 0.1);
  border-color: rgba(0, 149, 255, 0.3);
  transform: translateY(-1px);
}

.grid-item .item-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00feff;
  background: rgba(0, 149, 255, 0.15);
  border-radius: 10px;
  flex-shrink: 0;
}

.grid-item .item-content {
  flex: 1;
}

.grid-item .item-content .item-label {
  font-size: 13px;
  color: rgba(0, 254, 255, 0.8);
  margin-bottom: 6px;
  font-weight: 500;
}

.grid-item .item-content .item-value {
  font-size: 15px;
  color: #fff;
  font-weight: 600;
}
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn .btn-icon {
  font-size: 16px;
  color: inherit;
}

.action-btn.primary-btn {
  background: linear-gradient(135deg, #00d4aa, #00b894);
  color: #fff;
}

.action-btn.primary-btn:hover {
  background: linear-gradient(135deg, #00b894, #00a085);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 212, 170, 0.3);
}

.action-btn.secondary-btn {
  background: rgba(0, 149, 255, 0.1);
  color: #00feff;
  border: 1px solid rgba(0, 149, 255, 0.3);
}

.action-btn.secondary-btn:hover {
  background: rgba(0, 149, 255, 0.2);
  border-color: rgba(0, 149, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 149, 255, 0.2);
}
.alert-type-badge.alert-type-danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3));
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.alert-type-badge.alert-type-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3));
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.alert-type-badge.alert-type-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3));
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.5);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.alert-type-badge.alert-type-warning {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.3));
  color: #c4b5fd;
  border: 1px solid rgba(147, 51, 234, 0.5);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
}

.alert-type-badge.alert-type-default {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.3));
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.5);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
}
.alert-status,
.status {
  font-weight: 600;
}

.alert-status.status-danger,
.status.status-danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3));
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.alert-status.status-warning,
.status.status-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3));
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.alert-status.status-success,
.status.status-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3));
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.5);
}

.alert-status.status-default,
.status.status-default {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.3));
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.5);
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.bg-gradient-radial {
  background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
}
.icon-size {
  display: block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.badge-icon .icon-size {
  width: 20px;
  height: 20px;
}

.header-icon .icon-size {
  width: 18px;
  height: 18px;
}

.item-icon .icon-size {
  width: 24px;
  height: 24px;
}

.btn-icon .icon-size {
  width: 16px;
  height: 16px;
}
</style>
