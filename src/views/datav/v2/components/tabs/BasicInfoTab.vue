<template>
  <!-- 门店基本信息 Tab -->
  <div class="tab-pane">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在获取门店详细信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchStoreDetail" class="retry-btn">重试</button>
    </div>

    <!-- 正常内容 -->
    <div v-else class="info-layout">
      <!-- 门店图片区域 -->
      <div class="store-image-section">
        <div class="image-container">
          <img :src="currentStoreData.image || ''" alt="门店图片" v-if="currentStoreData.image">
          <div v-else class="image-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="currentColor"/>
            </svg>
            <p>暂无图片</p>
          </div>
        </div>
        <div class="store-name">{{ currentStoreData.name || '暂无数据' }}</div>
      </div>

      <!-- 门店信息区域 -->
      <div class="store-info-section">
        <div class="info-cards">
          <!-- 基本信息卡片 -->
          <div class="info-card">
            <div class="card-header">
              <span class="card-icon">🏪</span>
              <span class="card-title">门店基本信息</span>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">门店名称</span>
                <span class="value">{{ currentStoreData.name || '暂无数据' }}</span>
              </div>
              <div class="info-item">
                <span class="label">门店地址</span>
                <span class="value">{{ currentStoreData.address || '暂无数据' }}</span>
              </div>
              <div class="info-item">
                <span class="label">营业状态</span>
                <span class="value" >{{ currentStoreData.status || '未知状态' }}</span>
              </div>
              <div class="info-item">
                <span class="label">门店类型</span>
                <span class="value">{{ currentStoreData.storeType || '标准门店' }}</span>
              </div>
            </div>
          </div>

          <!-- 告警信息总览卡片 -->
          <div class="info-card alert-overview">
            <div class="card-header">
              <span class="card-icon">🚨</span>
              <span class="card-title">告警信息总览</span>
            </div>
            <div class="card-content">
              <div class="alert-stats">
                <div class="alert-stat-item">
                  <div class="stat-number danger">{{ currentStoreData.alertCount || 0 }}</div>
                  <div class="stat-label">今日告警</div>
                </div>
                <div class="alert-stat-item">
                  <div class="stat-number warning">{{ currentStoreData.todayAlerts || 0 }}</div>
                  <div class="stat-label">本周告警</div>
                </div>
                <div class="alert-stat-item">
                  <div class="stat-number info">{{ currentStoreData.weekAlerts || 0 }}</div>
                  <div class="stat-label">本月告警</div>
                </div>
                <div class="alert-stat-item">
                  <div class="stat-number success">{{ currentStoreData.resolvedAlerts || 0 }}</div>
                  <div class="stat-label">已处理</div>
                </div>
              </div>

              <!-- 最近告警类型 -->
              <div class="recent-alerts">
                <div class="recent-alerts-title">近七天告警次数最多</div>
                <div class="alert-types">
                  <div v-for="alertType in currentStoreData.recentAlertTypes || []"
                       :key="alertType.type"
                       class="alert-type-tag"
                       :class="getAlertTypeClass(alertType.type)">
                    <span class="alert-type-text">{{ alertType.type }}</span>
                  </div>
                  <div v-if="!currentStoreData.recentAlertTypes || currentStoreData.recentAlertTypes.length === 0"
                       class="no-alerts">
                    <span class="no-alerts-icon">✅</span>
                    <span class="no-alerts-text">暂无告警</span>
                  </div>
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
import { defineProps, ref, onMounted, computed } from 'vue';

const props = defineProps({
  buildingData: {
    type: Object,
    default: () => ({})
  }
});

// 响应式数据
const loading = ref(false);
const storeDetail = ref({});
const error = ref('');

// 计算属性：优先使用API获取的详细数据，否则使用传入的基础数据
const currentStoreData = computed(() => {
  return Object.keys(storeDetail.value).length > 0 ? storeDetail.value : props.buildingData;
});

// 获取门店详细信息
const fetchStoreDetail = async () => {
  if (!props.buildingData?.id) {
    error.value = '无效的门店ID';
    return;
  }

  loading.value = true;
  error.value = '';

  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 生成模拟的告警数据
  const mockAlertTypes = [
    { type: '鼠患检测', count: 2, icon: '🐭' },
    { type: '厨师帽检测', count: 1, icon: '👨‍🍳' },
    { type: '手套检测', count: 3, icon: '🧤' },
    { type: '厨师服检测', count: 1, icon: '👔' }
  ];

  // 随机选择1-3个告警类型
  const randomAlertTypes = mockAlertTypes
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);

  // 使用模拟数据
  storeDetail.value = {
    ...props.buildingData,
    storeType: '标准门店',
    dailySales: Math.floor(Math.random() * 5000) + 5000, // 5000-10000
    monthlySales: Math.floor(Math.random() * 100000) + 150000, // 150000-250000
    businessHours: '09:00-22:00',
    staffCount: Math.floor(Math.random() * 10) + 8, // 8-18人
    alertCount: props.buildingData.alertCount || Math.floor(Math.random() * 5),
    todayAlerts: Math.floor(Math.random() * 8) + 2,
    weekAlerts: Math.floor(Math.random() * 20) + 10,
    resolvedAlerts: Math.floor(Math.random() * 50) + 20,
    recentAlertTypes: randomAlertTypes,
    image: null // 暂无图片
  };

  loading.value = false;
};

// 格式化数字
const formatNumber = (num) => {
  if (!num || num === '暂无数据') return '暂无数据';
  return Number(num).toLocaleString();
};

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    '正常营业': 'status-normal',
    '暂停营业': 'status-paused',
    '装修中': 'status-renovation',
    '已关闭': 'status-closed'
  };
  return statusMap[status] || 'status-unknown';
};

// 获取告警类型样式类
const getAlertTypeClass = (type) => {
  const typeMap = {
    '鼠患检测': 'alert-danger',
    '厨师帽检测': 'alert-info',
    '手套检测': 'alert-warning',
    '厨师服检测': 'alert-success'
  };
  return typeMap[type] || 'alert-default';
};


// 组件挂载时获取详细信息
onMounted(() => {
  fetchStoreDetail();
});
</script>

<style lang="scss" scoped>
/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #00feff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 254, 255, 0.3);
  border-top: 3px solid #00feff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #ff6b6b;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #00feff 0%, #0095ff 100%);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: linear-gradient(135deg, #0095ff 0%, #00feff 100%);
  transform: translateY(-1px);
}

/* 基本信息Tab布局 */
.info-layout {
  display: flex;
  gap: 20px;
  height: 100%;
}

.store-image-section {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-container {
  width: 100%;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 149, 255, 0.3);
  background: linear-gradient(135deg,
    rgba(20, 50, 120, 0.8) 0%,
    rgba(25, 55, 125, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    transparent 30%,
    rgba(0, 254, 255, 0.1) 50%,
    transparent 70%);
  pointer-events: none;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}

.image-placeholder svg {
  opacity: 0.6;
}

.store-name {
  font-size: 20px;
  font-weight: 600;
  color: #00feff;
  text-align: center;
  padding: 12px;
  background: rgba(20, 50, 120, 0.6);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 8px;
  text-shadow: 0 0 8px rgba(0, 254, 255, 0.3);
}

.store-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-normal {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-normal .status-dot {
  background: #00ff88;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.6);
}

.status-paused {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.status-paused .status-dot {
  background: #ffd700;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
}

.status-renovation {
  color: #ff9500;
  background: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.status-renovation .status-dot {
  background: #ff9500;
  box-shadow: 0 0 6px rgba(255, 149, 0, 0.6);
}

.status-closed {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.status-closed .status-dot {
  background: #ff6b6b;
  box-shadow: 0 0 6px rgba(255, 107, 107, 0.6);
}

/* 门店信息区域 */
.store-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
}

.info-card {
  background: linear-gradient(135deg,
    rgba(20, 50, 120, 0.4) 0%,
    rgba(25, 55, 125, 0.6) 100%);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00feff, #027eff);
}

.info-card:hover {
  border-color: rgba(0, 149, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 149, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 149, 255, 0.2);
}

.card-icon {
  font-size: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #00feff;
  flex: 1;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
}

.value {
  color: #00feff;
  font-weight: 500;
  font-size: 15px;
}

.value.highlight {
  color: #00ff88;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
}

/* 滚动条样式 */
.info-cards::-webkit-scrollbar {
  width: 6px;
}

.info-cards::-webkit-scrollbar-track {
  background: rgba(20, 50, 120, 0.3);
  border-radius: 3px;
}

.info-cards::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00feff, rgba(0, 149, 255, 0.8));
  border-radius: 3px;
  box-shadow: inset 0 0 3px rgba(0, 254, 255, 0.3);
}

.info-cards::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00feff, #0095ff);
}

/* 告警信息总览样式 */
.alert-overview .card-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.alert-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 149, 255, 0.05);
  border: 1px solid rgba(0, 149, 255, 0.15);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.alert-stat-item:hover {
  background: rgba(0, 149, 255, 0.1);
  border-color: rgba(0, 149, 255, 0.3);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 0 8px currentColor;
}

.stat-number.danger {
  color: #ff6b6b;
}

.stat-number.warning {
  color: #ffd700;
}

.stat-number.info {
  color: #00feff;
}

.stat-number.success {
  color: #00ff88;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.recent-alerts-title {
  font-size: 14px;
  font-weight: 600;
  color: #00feff;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 149, 255, 0.2);
}

.alert-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.alert-type-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.alert-type-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.alert-danger {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.alert-info {
  background: rgba(0, 254, 255, 0.15);
  color: #00feff;
  border: 1px solid rgba(0, 254, 255, 0.3);
}

.alert-warning {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.alert-success {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.alert-type-icon {
  font-size: 14px;
}

.alert-type-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

.no-alerts {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 8px;
  font-size: 14px;
}

.no-alerts-icon {
  font-size: 16px;
}
</style>
