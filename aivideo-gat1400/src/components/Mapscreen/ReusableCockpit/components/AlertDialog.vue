<template>
  <div v-if="visible" class="alert-dialog-overlay">
    <div class="alert-dialog-container">
      <!-- 科技风边框装饰 -->
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

      <!-- 关闭按钮 -->
      <div v-if="showCloseButton" class="close-btn" @click="handleClose">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
      </div>

      <!-- 标题区域 -->
      <div class="dialog-header">
        <div class="title-line"></div>
        <h2 class="dialog-title">
          {{ `${currentAlertData.storeName} - ${currentAlertData.alertType}` }}
        </h2>
        <div class="title-line"></div>
      </div>

      <!-- 内容区域 -->
      <div class="dialog-content flex gap-10 relative z-[2] flex-1 overflow-hidden">
        <!-- 图片展示区域 -->
        <div class="image-section flex-[1.5] flex flex-col gap-4">
          <!-- 主图显示区域 -->
          <!-- <div
            class="main-image-container w-full h-[600px] rounded-lg border border-cyan-400/30 overflow-hidden bg-black/30 flex items-center justify-center"
          >
            <el-image
              v-if="currentImage"
              :src="currentImage"
              :alt="currentAlertData.alertType"
              class="main-image"
              fit="contain"
            />
            <div v-else class="no-image-placeholder flex flex-col items-center gap-2 text-cyan-400/50">
              <span class="placeholder-icon text-5xl opacity-60">📷</span>
              <span class="placeholder-text text-sm opacity-80">暂无图片</span>
            </div>
          </div> -->

          <!-- 缩略图区域 - 有图片时就显示，靠左对齐 -->
          <!-- <div
            v-if="currentAlertData.images && currentAlertData.images.length > 0"
            class="thumbnail-section flex gap-2 justify-start flex-wrap"
          >
            <div
              v-for="(image, index) in currentAlertData.images"
              :key="index"
              :class="[
                'thumbnail-item w-[70px] h-[70px] rounded-md border-2 overflow-hidden cursor-pointer transition-all duration-300',
                currentImageIndex === index
                  ? 'active border-cyan-400 shadow-lg shadow-cyan-400/30'
                  : 'border-cyan-400/30 hover:border-cyan-400/60',
              ]"
              @click="switchImage(index)"
            >
              <el-image :src="image" :alt="`告警图片${index + 1}`" class="thumbnail-image" fit="cover" />
            </div>
          </div> -->
        </div>

        <!-- 信息展示区域 -->
        <div class="info-section">
          <!-- 告警标题区域 -->
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

          <!-- 告警描述卡片 -->
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

          <!-- 详细信息网格 -->
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
                <div class="item-label">监控设备</div>
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

          <!-- 操作按钮区域 -->
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

// 告警图片资源（使用 datav 迁移后的占位图）
import defaultAlarmImage from "@/assets/datav/alarm_pic.png";

const alarmImages = Array.from({ length: 20 }, () => defaultAlarmImage);
const [
  alarmImg1,
  alarmImg2,
  alarmImg3,
  alarmImg4,
  alarmImg5,
  alarmImg6,
  alarmImg7,
  alarmImg8,
  alarmImg9,
  alarmImg10,
  alarmImg11,
  alarmImg12,
  alarmImg13,
  alarmImg14,
  alarmImg15,
  alarmImg16,
  alarmImg17,
  alarmImg18,
  alarmImg19,
  alarmImg20
] = alarmImages;

// 组件属性定义
const props = defineProps({
  // 是否启用实时告警功能
  enabled: {
    type: Boolean,
    default: false,
  },
  // 显示持续时间（毫秒）
  showDuration: {
    type: Number,
    default: 10000,
  },
  // 隐藏持续时间（毫秒）
  hideDuration: {
    type: Number,
    default: 5000,
  },
  featchDuration: {
    type: Number,
    default: 5000,
  },
  // 是否显示关闭按钮
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  // 详情页是否打开（用于控制告警弹窗的显示逻辑）
  detailPageOpen: {
    type: Boolean,
    default: false,
  },
});

// 事件定义
const emit = defineEmits(["close", "image-switch"]);

// 响应式数据
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

// 告警队列和管理
const alertQueue = ref([]);
const lastAlertIds = ref(new Set()); // 用于跟踪已知的告警ID

// 定时器管理
let apiTimer = null;
let displayTimer = null;
let hideTimer = null;
let resumeTimer = null; // 添加恢复定时器的引用
let detailPageWaitTimer = null; // 等待详情页关闭的定时器

// 状态管理
const isWaitingForDetailPageClose = ref(false); // 是否正在等待详情页关闭

// 计算属性
const currentImage = computed(() => {
  if (currentAlertData.value.images && currentAlertData.value.images.length > 0) {
    return currentAlertData.value.images[currentImageIndex.value];
  }
  return null;
});

// 可用的告警图片列表 - 使用本地导入的图片
const availableImages = [
  alarmImg1, alarmImg2, alarmImg3, alarmImg4, alarmImg5,
  alarmImg6, alarmImg7, alarmImg8, alarmImg9, alarmImg10,
  alarmImg11, alarmImg12, alarmImg13, alarmImg14, alarmImg15,
  alarmImg16, alarmImg17, alarmImg18, alarmImg19, alarmImg20
];

// 模拟告警数据 - 使用本地导入的图片
const mockAlertData = [
  {
    id: 1,
    images: [alarmImg1, alarmImg2], // 使用本地图片
    storeName: "袁记云饺(万达店)",
    alertType: "鼠患检测",
    alertDescription: "检测到厨房区域有鼠类活动，请立即处理",
    alertTime: new Date().toLocaleString(),
    processStatus: "未处理",
    deviceName: "厨房监控摄像头-01",
    displayed: false, // 新增字段：是否已显示过
  },
  {
    id: 2,
    images: [alarmImg3], // 使用本地图片
    storeName: "袁记云饺(银泰店)",
    alertType: "厨师帽检测",
    alertDescription: "检测到工作人员未佩戴厨师帽",
    alertTime: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(),
    processStatus: "处理中",
    deviceName: "操作台监控摄像头-02",
    displayed: false, // 新增字段：是否已显示过
  },
  {
    id: 3,
    images: [alarmImg4, alarmImg5], // 使用本地图片
    storeName: "袁记云饺(大悦城店)",
    alertType: "手套检测",
    alertDescription: "检测到工作人员未佩戴手套进行食品处理",
    alertTime: new Date(Date.now() - 10 * 60 * 1000).toLocaleString(),
    processStatus: "未处理",
    deviceName: "包装区监控摄像头-03",
    displayed: false, // 新增字段：是否已显示过
  },
  {
    id: 4,
    images: [alarmImg6], // 使用本地图片
    storeName: "袁记云饺(华强北店)",
    alertType: "厨师服检测",
    alertDescription: "检测到工作人员着装不规范",
    alertTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
    processStatus: "未处理",
    deviceName: "后厨监控摄像头-04",
    displayed: false, // 新增字段：是否已显示过
  },
];

//   // 初始化数据
//   onMounted(() => {
//     console.log('🟡 组件挂载，开始获取告警数据')
//     catchAlertData() 
//   })

//     // 修正后的 API 调用方法
// const catchAlertData = async () => {
//   try {
//     console.log('🟡 开始请求告警数据...')
    
//     // 使用完整的 Mock URL
//     const response = await fetch('https://m1.apifoxmock.com/m1/7311000-7039960-default/api/alarm/alarmRecordDetail', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         "Access-Token": 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNzk2NDZjNGRiYzQwODM4M2E5ZWVkMDlmMmI4NWFlIn0.eyJqdGkiOiI4OW9uTVhwbGJHV3VQMDZiRzhURGx3IiwiaWF0IjoxNzYxNTM0MDU4LCJleHAiOjE3NjQxMjYwNTgsIm5iZiI6MTc2MTUzNDA1OCwic3ViIjoibG9naW4iLCJhdWQiOiJBdWRpZW5jZSIsInVzZXJOYW1lIjoiYWRtaW4ifQ.AOIzFLJWvPxvJ03k_dCo-HCuqs7NqXMMuCWgfWQN9hrQydmMqbIsUYWGZXdPlIbGs3pi_wiZm21VQW8CIUjN2JpI2fyif0SomaLA9zprDvtsw8n_mbv0QA0oF2Xvrogf_z3Q3oIao68onfUDXC-PZJ_FuSEaYb4yRGsrsP-Sz3McQZjiBrT5BCKXRltih9maD-p27jj6cqTZvfAnEnOnVT5Q5NlZL8V_-b0w9_kVJ5TKE-yn7loDXh9N6RegmU7ME67pluR1pUV3Ih18y43S4V3Tl8LfUKgkPYx-cjubVIX8AeJbX7n-_dpz6Y8OMSMb0WdpRAqcAPf4oQvW0qYfSQ'
//       },
//       body: JSON.stringify({
//         alarm_id: props.buildingData?.id || '30107' // 添加默认值，防止undefined
//       })
//     })

//     // 检查 HTTP 状态码
//     if (!response.ok) {
//       throw new Error(`HTTP 错误! 状态码: ${response.status}`)
//     }

//     // 解析响应数据
//     const result = await response.json()
//     console.log('🟢 API 响应数据:', result)

//     // 检查业务状态码
//     if (result.code === 0) {
//       console.log('🟢 数据处理中...')
//       processApiData(result.data)
//     } else {
//       console.warn('🟡 API 返回非零状态码:', result.msg)
//     }
    
//   } catch (error) {
//     console.error('🔴 获取告警数据失败:', error)
//   }
// }



// 清理所有定时器的通用函数
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

  if (detailPageWaitTimer) {
    clearTimeout(detailPageWaitTimer);
    detailPageWaitTimer = null;
  }
};

// 查找下一个未显示的告警，直接返回告警对象
const findNextUnDisplayedAlert = () => {
  // 优先查找未显示的告警
  const unDisplayedAlert = alertQueue.value.find((alert) => !alert.displayed);

  if (unDisplayedAlert) {
    console.log("📍 找到未显示的告警:", unDisplayedAlert.storeName, "-", unDisplayedAlert.alertType);
    return unDisplayedAlert;
  }

  // 如果所有告警都显示过了，重置所有状态并从头开始
  console.log("🔄 所有告警已显示完毕，重置显示状态");
  alertQueue.value.forEach((alert) => (alert.displayed = false));

  // 返回第一个告警（如果队列不为空）
  return alertQueue.value.length > 0 ? alertQueue.value[0] : null;
};

// 监听enabled属性变化
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

// 监听详情页状态变化
watch(
  () => props.detailPageOpen,
  (newVal, oldVal) => {
    console.log("📋 详情页状态变化:", oldVal, "->", newVal);

    if (newVal && visible.value) {
      // 详情页打开时，如果告警弹窗正在显示，则关闭告警弹窗并标记等待状态
      console.log("📋 详情页打开，关闭告警弹窗并等待详情页关闭");
      isWaitingForDetailPageClose.value = true;
      visible.value = false;

      // 清除当前的显示定时器
      if (displayTimer) {
        clearTimeout(displayTimer);
        displayTimer = null;
      }

      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    } else if (!newVal && oldVal && isWaitingForDetailPageClose.value) {
      // 详情页关闭时，如果之前在等待状态，则恢复告警显示
      console.log("📋 详情页关闭，恢复告警显示");
      isWaitingForDetailPageClose.value = false;

      // 延迟一小段时间后恢复告警显示，避免界面切换过于突兀
      detailPageWaitTimer = setTimeout(() => {
        if (props.enabled && alertQueue.value.length > 0) {
          showNextAlert();
        }
      }, 1000); // 1秒延迟
    }
  }
);

// 模拟API调用获取告警数据
const fetchAlertData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟API返回数据，有30%概率生成新告警
      let alerts = [...mockAlertData];

      if (Math.random() > 0.7) {
        // 生成新告警
        const randomImages = [];
        const imageCount = Math.floor(Math.random() * 2) + 1; // 1-2张图片
        for (let i = 0; i < imageCount; i++) {
          const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
          if (!randomImages.includes(randomImage)) {
            randomImages.push(randomImage);
          }
        }

        const newAlert = {
          id: Date.now(),
          images: randomImages,
          storeName: mockAlertData[Math.floor(Math.random() * mockAlertData.length)].storeName,
          alertType: mockAlertData[Math.floor(Math.random() * mockAlertData.length)].alertType,
          alertDescription: "新检测到的告警信息",
          alertTime: new Date().toLocaleString(),
          processStatus: "未处理",
          deviceName:
            "监控摄像头-" +
            Math.floor(Math.random() * 10 + 1)
              .toString()
              .padStart(2, "0"),
          displayed: false,
        };
        alerts.unshift(newAlert);
      }

      resolve(alerts);
    }, 100); // 模拟网络延迟
  });
};

// 开始实时告警
const startRealTimeAlert = () => {
  console.log("🚨 开启实时告警");

  // 初始化数据
  lastAlertIds.value = new Set();
  alertQueue.value = [];

  // 立即获取一次数据
  fetchAndProcessAlerts();

  // 设置定时器每秒调用API
  apiTimer = setInterval(() => {
    fetchAndProcessAlerts();
  }, props.featchDuration);
};

// 停止实时告警
const stopRealTimeAlert = () => {
  console.log("🔕 关闭实时告警");

  // 清除所有定时器
  clearAllTimers();

  // 隐藏弹框
  visible.value = false;

  // 清空数据
  alertQueue.value = [];
  lastAlertIds.value = new Set();
};

// 获取并处理告警数据
const fetchAndProcessAlerts = async () => {
  // 检查组件是否仍然启用，防止在组件销毁后继续执行
  if (!props.enabled) return;

  try {
    const alerts = await fetchAlertData();

    // 再次检查组件状态，防止异步操作完成后组件已销毁
    if (!props.enabled) return;

    // 识别新增告警
    const newAlerts = alerts.filter((alert) => !lastAlertIds.value.has(alert.id));

    if (newAlerts.length > 0) {
      console.log("📢 发现新告警:", newAlerts.length, "条");

      // 确保新告警有 displayed 字段（防止API返回的数据没有这个字段）
      const newAlertsWithStatus = newAlerts.map((alert) => ({
        ...alert,
        displayed: alert.displayed !== undefined ? alert.displayed : false,
      }));

      // 将新告警插入到队列前面
      alertQueue.value = [...newAlertsWithStatus, ...alertQueue.value];

      // 更新已知告警ID集合
      alerts.forEach((alert) => lastAlertIds.value.add(alert.id));

      // 如果当前没有显示告警且详情页未打开，立即开始显示
      if (!visible.value && alertQueue.value.length > 0 && props.enabled && !props.detailPageOpen) {
        showNextAlert();
      }
    }
  } catch (error) {
    console.error("获取告警数据失败:", error);
  }
};

// 显示下一个告警
const showNextAlert = () => {
  if (!props.enabled || alertQueue.value.length === 0) return;

  // 如果详情页正在打开，则不显示告警
  if (props.detailPageOpen) {
    console.log("📋 详情页正在打开，暂停告警显示");
    return;
  }

  // 清除之前的定时器，防止重复创建
  if (displayTimer) {
    clearTimeout(displayTimer);
    displayTimer = null;
  }

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  // 查找下一个未显示的告警，直接获取告警对象
  const alert = findNextUnDisplayedAlert();
  if (!alert) return;

  // 标记当前告警为已显示
  alert.displayed = true;

  // 设置当前告警数据
  currentAlertData.value = { ...alert };
  currentImageIndex.value = 0;
  visible.value = true;

  console.log("📢 显示告警:", alert.storeName, "-", alert.alertType);

  // 设置显示定时器
  displayTimer = setTimeout(() => {
    if (!props.enabled) return;

    // 隐藏当前告警
    visible.value = false;

    // 设置隐藏定时器
    hideTimer = setTimeout(() => {
      if (!props.enabled) return;

      // 显示下一个未显示的告警
      showNextAlert();
    }, props.hideDuration);
  }, props.showDuration);
};

// 切换图片
const switchImage = (index) => {
  currentImageIndex.value = index;
  emit("image-switch", index);
};

// 处理关闭
const handleClose = () => {
  // 清除显示相关定时器
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

  // 隐藏弹框
  visible.value = false;

  // 如果实时告警仍然开启且详情页未打开，等待关闭时候后重新启动下一个
  if (props.enabled && alertQueue.value.length > 0 && !props.detailPageOpen) {
    resumeTimer = setTimeout(() => {
      if (props.enabled && !props.detailPageOpen) {
        // 使用新的查找逻辑显示下一个未显示的告警
        showNextAlert();
      }
    }, props.hideDuration);
  }

  emit("close");
};

// 获取告警类型样式
const getAlertTypeStyle = (alertType) => {
  const styleMap = {
    鼠患检测: "alert-type-danger",
    厨师帽检测: "alert-type-info",
    手套检测: "alert-type-success",
    厨师服检测: "alert-type-warning",
  };
  return styleMap[alertType] || "alert-type-default";
};

// 获取处理状态样式
const getStatusStyle = (status) => {
  const styleMap = {
    未处理: "status-danger",
    处理中: "status-warning",
    已处理: "status-success",
  };
  return styleMap[status] || "status-default";
};

// 组件挂载时的处理
onMounted(() => {
  // 如果组件挂载时enabled为true，立即开始
  if (props.enabled) {
    startRealTimeAlert();
  }
});

// 组件卸载前清理定时器（额外安全措施）
onBeforeUnmount(() => {
  clearAllTimers();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  stopRealTimeAlert();
});
</script>

<style scoped>
/* 告警弹框样式 */
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

/* 科技风边框装饰 */
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

/* 关闭按钮 */
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

/* 标题区域 */
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

/* 内容区域样式已用Tailwind CSS替换 */

/* 图片展示区域样式已用Tailwind CSS替换 */

/* 主图容器样式已用Tailwind CSS替换 */

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

/* 无图片占位符样式已用Tailwind CSS替换 */

/* 缩略图区域样式已用Tailwind CSS替换 */

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

/* 信息展示区域 - 重新设计 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 8px;
  /* 与图片区域保持一定间距 */
}

/* 告警标题区域 */
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

/* 描述卡片 */
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

/* 信息网格 */
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

/* 操作按钮区域 */
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

/* 告警类型badge样式 */
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

/* 处理状态样式 */
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

/* 动画效果 */
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

/* Tailwind CSS 自定义样式 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.bg-gradient-radial {
  background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
}

/* SVG图标样式 */
.icon-size {
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
