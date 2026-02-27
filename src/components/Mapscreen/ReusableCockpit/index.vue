<template>
  <div id="cockpit" class="dashboard-container w-full h-full relative overflow-hidden bg-[#001d58]" style="z-index: 1">
    <!-- 页面头部 -->
    
    <div class="header w-full h-[108px] bg-no-repeat bg-cover relative flex justify-between items-center header-padding flex-shrink-0 z-10" :style="{ backgroundImage: `url(${topBoderBg})` }">
      <!-- 左侧：时间 -->
       
      <div class="flex-shrink-0 header-left">
        <div 
          class="time-container bg-no-repeat bg-contain flex items-center justify-center relative"
          :style="{
            backgroundImage: `url(${timeBg})`,
            position: 'relative',
            height: '65px',
            minWidth: '200px',
            maxWidth: '341px',
            width: '100%'
          }"
        >
          <div 
            id="time"
            style="
              position: absolute !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              color: white !important;
              font-size: 16px !important;
              font-weight: 500 !important;
              white-space: nowrap !important;
              z-index: 1000 !important;
            "
          ></div>
        </div>
      </div>
      <!-- 中间：标题 -->

      
      <div class="flex-1 flex justify-center items-center header-center">
        <div class="title-container flex items-center justify-center relative mx-auto">
          <div class="dashboard-title-text">
            AI视频监控驾驶舱          </div>
        </div>
      </div>
      <!-- 右侧：按钮区域 -->

      
      <div class="flex-shrink-0 flex items-center gap-2 header-right">
        <!-- 保留占位：实时告警开关背景 -->
        <div 
          class="menu-container bg-no-repeat bg-contain flex items-center justify-center relative"
          :style="{
            backgroundImage: `url(${menuBg})`,
            position: 'relative',
            height: '61px',
            minWidth: '200px',
            maxWidth: '504px',
            width: '100%',
            display: 'none'
          }"
        >
        </div>

      
        <!-- 返回后台 -->
        <div 
          class="back-button flex items-center gap-2 px-3 rounded cursor-pointer whitespace-nowrap"
          style="
            background: linear-gradient(135deg, rgba(0, 29, 88, 0.9) 0%, rgba(0, 37, 84, 0.95) 50%, rgba(0, 29, 88, 0.9) 100%);
            border: 1px solid rgba(0, 149, 255, 0.6);
            color: #00feff;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(0, 149, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-shadow: 0 0 6px rgba(0, 254, 255, 0.3);
            height: 65px;
            line-height: 65px;
            width: auto;
            flex-shrink: 0;
          "
          @click="back"
        >
          <span>返回后台</span>
        </div>
      </div>
    </div>
    <!-- 页面内容 -->

   
    <div class="content-wrapper flex flex-col flex-1 min-h-0 gap-6 p-4">
      <!-- 主体 -->
      
      <div class="main-content flex flex-1 min-h-0 gap-6">
        <!-- 左侧面板 -->
        
        <div class="left-panel flex-1 flex flex-col min-h-0 gap-4">
          <!-- 统计卡片 -->
          
          <div class="stats-section flex-shrink-0">
            <div class="stats-container grid grid-cols-4 gap-3" style="display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 12px !important;">
              
              <div class="stat-card group" style="height: 60px !important; min-height: 60px !important;">
                <div class="stat-card-content">
                  <div class="stat-icon">
                    <div class="text-lg opacity-90" style="filter: drop-shadow(0 0 4px rgba(0, 254, 255, 0.6))">📷</div>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">设备总数</span>
                    <span class="stat-value">{{ alertData.deviceCount }}</span>
                  </div>
                </div>
                <div class="stat-glow"></div>
              </div>

              
              <div class="stat-card group" style="height: 60px !important; min-height: 60px !important;">
                <div class="stat-card-content">
                  <div class="stat-icon">
                    <div class="text-lg opacity-90" style="filter: drop-shadow(0 0 4px rgba(0, 254, 255, 0.6))">📶</div>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">在线设备数</span>
                    <span class="stat-value">{{ alertData.onlineDeviceCount }}</span>
                  </div>
                </div>
                <div class="stat-glow"></div>
              </div>

              
              <div class="stat-card group" style="height: 60px !important; min-height: 60px !important;">
                <div class="stat-card-content">
                  <div class="stat-icon">
                    <div class="text-lg opacity-90" style="filter: drop-shadow(0 0 4px rgba(0, 254, 255, 0.6))">🚨</div>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">告警总数</span>
                    <span class="stat-value">{{ alertData.alarmCount }}</span>
                  </div>
                </div>
                <div class="stat-glow"></div>
              </div>

              
              <div class="stat-card group" style="height: 60px !important; min-height: 60px !important;">
                <div class="stat-card-content">
                  <div class="stat-icon">
                    <div class="text-lg opacity-90" style="filter: drop-shadow(0 0 4px rgba(0, 254, 255, 0.6))">⏱️</div>
                  </div>
                  <div class="stat-info stat-info-center">
                    <span class="stat-label">未处理告警数</span>
                    <span class="stat-value">{{ alertData.pendingAlerts }}</span>
                  </div>
                </div>
                <div class="stat-glow"></div>
              </div>
            </div>
          </div>

          <!-- 地图区域 -->
          <div class="map-container flex-1 bg-[#14327814] rounded-md border border-[#0095ff33] flex flex-col min-h-0">
            <AMapComponent ref="amap" :center="mapCenter" :zoom="12" mapStyle="amap://styles/blue"
              @mapInit="handleMapInit" 
                /> 
          
          </div>
        </div>
      </div>
    </div>
    <!-- 详情弹窗 -->

    
    <DialogComponent :visible="dialogVisible" :building-data="selectedBuilding" @close="closeDialog" />
    <!-- 告警弹窗 -->

    
    <AlertDialog
      :enabled="realTimeAlert"
      :detail-page-open="dialogVisible"
      @close="handleAlertDialogClose"
      @image-switch="handleImageSwitch"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import AMapComponent from "@/components/AMapComponent/index.vue";
import DialogComponent from "./components/DialogComponent.vue";
import AlertDialog from "./components/AlertDialog.vue";
import autofit from "autofit.js";
import { getCameraListAlgorithm } from "@/api/datav/cockpit";

import timeBg from "@/assets/datav/cockpit/bg/datatime.png";
import menuBg from "@/assets/datav/cockpit/bg/menu.png";
import topBoderBg from "@/assets/datav/cockpit/bg/top-boder.png";

// 实时告警开关
const realTimeAlert = ref(false);

// 顶部统计数据
const alertData = ref({
  deviceCount: 0,
  onlineDeviceCount: 0,
  alarmCount: 0,
  pendingAlerts: 0,
});

// 地图相关状态
const amap = ref(null);
const mapCenter = ref([114.109497, 22.548578]);
const buildingMarkers = ref([]);
const buildingsList = ref([]);

// 弹窗状态
const dialogVisible = ref(false);
const selectedBuilding = ref(null);

// 时间定时器
let timeInterval = null;

// 无经纬度时的兜底坐标
const defaultLocations = [
  { longitude: 114.109497, latitude: 22.548578 },
  { longitude: 114.115497, latitude: 22.552578 },
  { longitude: 114.120497, latitude: 22.545578 },
  { longitude: 114.125497, latitude: 22.540578 },
  { longitude: 114.085497, latitude: 22.535578 },
  { longitude: 114.130497, latitude: 22.535578 },
  { longitude: 114.105497, latitude: 22.542578 },
  { longitude: 114.110497, latitude: 22.550578 },
  { longitude: 114.125497, latitude: 22.545578 },
  { longitude: 114.100497, latitude: 22.538578 },
];

// 兼容后端成功码
const isSuccessCode = (code) => code === 200 || code === 0 || code === "0";

// 提取摄像头列表数据
const pickCameraList = (result) => {
  if (Array.isArray(result?.data?.list)) return result.data.list;
  if (Array.isArray(result?.rows)) return result.rows;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.list)) return result.list;
  if (Array.isArray(result)) return result;
  return [];
};

// 处理顶部统计数据
const processApiData = (apiData = {}) => {
  const alarmList = Array.isArray(apiData.alarmList) ? apiData.alarmList : [];

  const alarmCount = alarmList.length
    ? alarmList.reduce((sum, item) => sum + (Number(item?.sevenDayAlarmCount) || 0), 0)
    : Number(apiData.alarmCount) || 0;

  const pendingAlerts = alarmList.length
    ? alarmList.reduce((sum, item) => sum + (Number(item?.sevenDayAlarmNoHandleCount) || 0), 0)
    : Number(apiData.pendingAlerts) || 0;

  alertData.value = {
    deviceCount: Number(apiData.deviceCount) || 0,
    onlineDeviceCount: Number(apiData.onlineDeviceCount) || 0,
    alarmCount,
    pendingAlerts,
  };
};

// 处理摄像头列表并做坐标兜底
const processCameraListData = (cameraList) => {
  buildingsList.value = (Array.isArray(cameraList) ? cameraList : []).map((camera, index) => {
    let longitude = camera?.longitude != null ? Number(camera.longitude) : 0;
    let latitude = camera?.latitude != null ? Number(camera.latitude) : 0;

    if (Number.isNaN(longitude)) longitude = 0;
    if (Number.isNaN(latitude)) latitude = 0;

    if (longitude === 0 && latitude === 0) {
      const randomLocation = defaultLocations[Math.floor(Math.random() * defaultLocations.length)];
      longitude = randomLocation.longitude;
      latitude = randomLocation.latitude;
    }

    return {
      id: camera?.id || camera?.deviceId || `camera-${index}`,
      name: camera?.name || camera?.deviceName || `Camera-${index + 1}`,
      longitude: String(longitude),
      latitude: String(latitude),
      deviceId: String(camera?.deviceId || camera?.device_id || ""),
      channelId: String(camera?.channelId || camera?.channel_id || ""),
    };
  });
};

// 拉取驾驶舱数据（一次请求同时处理统计和点位）
const fetchCockpitData = async () => {
  try {
    const result = await getCameraListAlgorithm({
      pageNum: 1,
      pageSize: 999,
      page: 1,
    });

    if (!isSuccessCode(result?.code)) {
      console.warn("获取驾驶舱数据失败:", result?.msg || result?.message);
      processApiData({});
      buildingsList.value = [];
      return;
    }

    processApiData(result?.data || {});
    processCameraListData(pickCameraList(result));
  } catch (error) {
    console.error("获取驾驶舱数据失败:", error);
    processApiData({});
    buildingsList.value = [];
  }
};

// 转换为地图标注结构
const getBuildingsForMap = () => {
  return buildingsList.value
    .filter((building) => {
      const lon = parseFloat(building.longitude);
      const lat = parseFloat(building.latitude);
      return !Number.isNaN(lon) && !Number.isNaN(lat) && lon !== 0 && lat !== 0;
    })
    .map((building) => ({
      id: building.id,
      name: building.name,
      position: [parseFloat(building.longitude), parseFloat(building.latitude)],
      data: building,
    }));
};

// 清空地图标注
const clearAllMarkers = () => {
  if (!amap.value?.map || buildingMarkers.value.length === 0) return;
  buildingMarkers.value.forEach((marker) => {
    amap.value.map.remove(marker);
  });
  buildingMarkers.value = [];
};

// 添加地图标注
const addBuildingMarkers = () => {
  if (!amap.value?.map || !window.AMap) return;

  const mapInstance = amap.value.map;
  const data = getBuildingsForMap();
  if (data.length === 0) return;

  const iconImage = "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";

  data.forEach((item) => {
    const marker = new window.AMap.Marker({
      position: item.position,
      title: item.name,
      icon: new window.AMap.Icon({
        image: iconImage,
        size: new window.AMap.Size(32, 32),
        imageSize: new window.AMap.Size(32, 32),
      }),
      offset: new window.AMap.Pixel(-16, -32),
      extData: item,
    });
    marker.on("click", handleBuildingClick);
    mapInstance.add(marker);
    buildingMarkers.value.push(marker);

    const text = new window.AMap.Text({
      text: item.name,
      position: item.position,
      offset: new window.AMap.Pixel(0, -45),
      style: {
        padding: "5px 10px",
        "background-color": "rgba(0,61,122,0.7)",
        "border-color": "rgba(0,149,255,0.5)",
        color: "white",
        "border-radius": "3px",
        "border-width": "1px",
        "box-shadow": "0 2px 6px 0 rgba(0, 0, 0, .3)",
        "text-align": "center",
        "font-size": "12px",
        lineHeight: "14px",
        cursor: "pointer",
      },
      extData: item,
    });
    text.on("click", handleBuildingClick);
    mapInstance.add(text);
    buildingMarkers.value.push(text);
  });

  const markersOnly = buildingMarkers.value.filter((m) => m instanceof window.AMap.Marker);
  if (markersOnly.length > 0) {
    mapInstance.setFitView(markersOnly, false, [50, 50, 50, 50], 16);
  }
};

// 刷新地图展示
const updateMapDisplay = () => {
  if (!amap.value?.map) return;
  clearAllMarkers();
  addBuildingMarkers();
};

watch(
  buildingsList,
  (newList) => {
    if (!amap.value?.map) return;
    if (newList.length > 0) {
      updateMapDisplay();
    } else {
      clearAllMarkers();
    }
  },
  { deep: true }
);

// 时间显示初始化
const initTime = () => {
  const updateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];

    const timeElement = document.getElementById("time");
    if (timeElement) {
      timeElement.innerHTML = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds} ${week}`;
    }
  };

  updateTime();
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  timeInterval = setInterval(updateTime, 1000);
};

// 地图初始化回调
const handleMapInit = (mapInstance) => {
  if (window.AMap?.TileLayer?.Traffic) {
    mapInstance.add(new window.AMap.TileLayer.Traffic());
  }
  if (window.AMap?.TileLayer?.Satellite) {
    mapInstance.add(new window.AMap.TileLayer.Satellite());
  }

  if (buildingsList.value.length > 0) {
    updateMapDisplay();
  }
};

// 标注点击事件
const handleBuildingClick = (e) => {
  const building = e?.target?.getExtData?.()?.data;
  if (!building) return;
  selectedBuilding.value = building;
  dialogVisible.value = true;
};

// 关闭详情弹窗
const closeDialog = () => {
  dialogVisible.value = false;
};

// 关闭告警弹窗回调
const handleAlertDialogClose = () => {
  console.log("告警弹窗手动关闭");
};

// 告警图片切换回调
const handleImageSwitch = (index) => {
  console.log("告警图片切换:", index);
};

// 返回后台
const back = () => {
  try {
    const targetWindow = window.top || window;
    const currentHref = targetWindow.location.href;
    targetWindow.location.href = currentHref.replace(/#.*$/, "") + "#/datav";
  } catch (error) {
    const currentHref = window.location.href;
    window.location.href = currentHref.replace(/#.*$/, "") + "#/datav";
  }
};

// 生命周期：挂载
onMounted(async () => {
  initTime();
  autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#cockpit",
    resize: true,
  });

  await fetchCockpitData();
});

// 生命周期：卸载
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  clearAllMarkers();
});
</script>

<style scoped>

/* 容器与整体布局 */
.dashboard-container {
  width: 100%;
  height: 100%;
  
}


/* 统计卡片 */
.stats-section {
  margin-bottom: 16px;
}

.stats-container {
  gap: 12px;
}

.stat-card {
  position: relative;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.9) 50%, rgba(20, 50, 120, 0.8) 100%);
  border: 1px solid rgba(0, 149, 255, 0.4);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100px;
  box-shadow: 0 0 20px rgba(0, 149, 255, 0.2);
}

.stat-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 100%;
  padding: 0 8px;
}

.stat-info {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 16px;
  text-align: left;
}

.stat-info-center {
  align-items: baseline;
  justify-content: center;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 254, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 149, 255, 0.3), 0 0 30px rgba(0, 254, 255, 0.2);
}

.stat-card:hover .stat-glow {
  opacity: 1;
}


.stat-card::before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  background: linear-gradient(90deg, #00feff, #027eff, #00feff);
  border-radius: 8px 8px 0 0;
}

.stat-card::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  background: linear-gradient(90deg, #027eff, #00feff, #027eff);
  border-radius: 0 0 8px 8px;
}

.stat-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 254, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}


.stat-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 254, 255, 0.15);
  border-radius: 50%;
  border: 1px solid rgba(0, 254, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 254, 255, 0.3);
}


.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #00feff;
  font-family: "Consolas", "Monaco", monospace;
  text-shadow: 0 0 12px rgba(0, 254, 255, 0.5);
  line-height: 1;
}


.stat-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  line-height: 1.2;
}


.title-content:hover .title-glow {
  opacity: 1 !important;
}


.right-panel {
  display: flex;
  flex-direction: column;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}


.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  height: 65px;
  line-height: 65px;
  background: linear-gradient(135deg, rgba(0, 29, 88, 0.9) 0%, rgba(0, 37, 84, 0.95) 50%, rgba(0, 29, 88, 0.9) 100%);
  border: 1px solid rgba(0, 149, 255, 0.6);
  border-radius: 6px;
  color: #00feff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 149, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 6px rgba(0, 254, 255, 0.3);
  width: auto;
  flex-shrink: 0;
  white-space: nowrap;
}

.back-icon {
  font-size: 16px;
  font-weight: bold;
  color: #00feff;
  transition: transform 0.3s ease;
}

.back-text {
  white-space: nowrap;
  font-size: 13px;
}

.back-button:hover {
  background: linear-gradient(135deg, rgba(0, 37, 84, 0.95) 0%, rgba(0, 149, 255, 0.3) 50%, rgba(0, 37, 84, 0.95) 100%);
  border-color: rgba(0, 254, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 149, 255, 0.4), 0 0 20px rgba(0, 254, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.back-button:hover .back-icon {
  transform: translateX(-2px);
}

.back-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 149, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}




/* 级联选择器样式（当前模板未启用，保留） */
.tech-cascader :deep(.el-cascader .el-input__wrapper) {
  background: linear-gradient(135deg, rgba(0, 29, 88, 0.9) 0%, rgba(0, 37, 84, 0.95) 50%, rgba(0, 29, 88, 0.9) 100%) !important;
  border: 1px solid rgba(0, 149, 255, 0.6) !important;
  border-radius: 6px !important;
  backdrop-filter: blur(8px) !important;
  box-shadow: 0 2px 8px rgba(0, 149, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease !important;
}


.tech-cascader :deep(.el-cascader .el-input__wrapper:hover) {
  border-color: rgba(0, 254, 255, 0.8) !important;
  box-shadow: 0 4px 12px rgba(0, 149, 255, 0.4), 0 0 20px rgba(0, 254, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}


.tech-cascader :deep(.el-cascader .el-input__wrapper.is-focus) {
  border-color: rgba(0, 254, 255, 1) !important;
  box-shadow: 0 0 0 2px rgba(0, 254, 255, 0.2), 0 4px 12px rgba(0, 149, 255, 0.4), 0 0 20px rgba(0, 254, 255, 0.3) !important;
}


.tech-cascader :deep(.el-cascader .el-input__inner) {
  color: #00feff !important;
  background: transparent !important;
  text-shadow: 0 0 6px rgba(0, 254, 255, 0.3) !important;
  font-weight: 500 !important;
  font-size: 18px !important;
}


.tech-cascader :deep(.el-cascader .el-input__inner::placeholder) {
  color: rgba(0, 254, 255, 0.5) !important;
  text-shadow: none !important;
}


.tech-cascader :deep(.el-cascader .el-input__suffix) {
  color: #00feff !important;
}

.tech-cascader :deep(.el-cascader .el-icon) {
  color: #00feff !important;
  filter: drop-shadow(0 0 3px rgba(0, 254, 255, 0.5)) !important;
  transition: all 0.3s ease !important;
  font-size: 20px !important;
}


.tech-cascader :deep(.el-cascader .el-input__suffix-inner .el-icon) {
  font-size: 20px !important;
}


.tech-cascader :deep(.el-cascader .el-input__suffix .el-icon-circle-close) {
  font-size: 18px !important;
}

.tech-cascader :deep(.el-cascader .el-icon:hover) {
  transform: scale(1.1) !important;
  filter: drop-shadow(0 0 6px rgba(0, 254, 255, 0.8)) !important;
}



.tech-cascader :deep(.tech-cascader-dropdown) {
  background: linear-gradient(135deg, rgba(0, 29, 88, 0.95) 0%, rgba(0, 37, 84, 0.98) 50%, rgba(0, 29, 88, 0.95) 100%) !important;
  border: 1px solid rgba(0, 149, 255, 0.6) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: 0 8px 32px rgba(0, 149, 255, 0.3), 0 0 40px rgba(0, 254, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  z-index: 9999 !important;
  
  animation: techFadeIn 0.3s ease-out !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-panel) {
  background: transparent !important;
  border: none !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-menu) {
  background: transparent !important;
  border-right: 1px solid rgba(0, 149, 255, 0.3) !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-menu:last-child) {
  border-right: none !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node) {
  color: rgba(0, 254, 255, 0.8) !important;
  background: transparent !important;
  transition: all 0.3s ease !important;
  border-radius: 4px !important;
  margin: 2px 4px !important;
  font-weight: 500 !important;
  font-size: 16px;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node:hover) {
  background: linear-gradient(90deg, rgba(0, 149, 255, 0.2) 0%, rgba(0, 254, 255, 0.1) 100%) !important;
  color: #00feff !important;
  text-shadow: 0 0 6px rgba(0, 254, 255, 0.5) !important;
  box-shadow: 0 2px 8px rgba(0, 149, 255, 0.3) !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node.is-active) {
  background: linear-gradient(90deg, rgba(0, 254, 255, 0.3) 0%, rgba(0, 149, 255, 0.2) 100%) !important;
  color: #00feff !important;
  text-shadow: 0 0 8px rgba(0, 254, 255, 0.8) !important;
  box-shadow: 0 0 12px rgba(0, 254, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  font-weight: 600 !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node.is-selectable.in-active-path) {
  background: linear-gradient(90deg, rgba(0, 149, 255, 0.25) 0%, rgba(0, 254, 255, 0.15) 100%) !important;
  color: #00feff !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node__postfix) {
  color: rgba(0, 254, 255, 0.6) !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-cascader-node:hover .el-cascader-node__postfix) {
  color: #00feff !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-scrollbar__thumb) {
  background: rgba(0, 149, 255, 0.4) !important;
  border-radius: 4px !important;
}

.tech-cascader :deep(.tech-cascader-dropdown .el-scrollbar__thumb:hover) {
  background: rgba(0, 254, 255, 0.6) !important;
}



.tech-cascader :deep(.tech-cascader-dropdown.el-popper.is-light .el-popper__arrow:before) {
  background: linear-gradient(135deg, rgba(0, 29, 88, 0.95) 0%, rgba(0, 37, 84, 0.98) 50%, rgba(0, 29, 88, 0.95) 100%) !important;
  border: 1px solid rgba(0, 149, 255, 0.6) !important;
  border-bottom-color: transparent !important;
  border-right-color: transparent !important;
}


.content-wrapper {
  min-height: 0;
}

.left-panel, .right-panel {
  min-height: 0;
}


/* 统计卡片 */
.stats-section {
  flex-shrink: 0;
}


.flex-1 {
  min-height: 0;
}


/* 容器与整体布局 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  min-height: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}


.header {
  flex-shrink: 0;
  min-height: 108px;
  position: relative;
}


.header-padding {
  padding: 0 20px;
}

.header-left {
  flex: 0 0 auto;
  min-width: 0;
}

.header-center {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right {
  flex: 0 0 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}


@media (min-width: 1920px) {
  .header-padding {
    padding: 0 50px;
  }
  
  .time-container {
    width: 341px !important;
  }
  
  .title-container {
    width: 944px !important;
  }
  
  .menu-container {
    width: 504px !important;
    display: flex !important;
  }
}

@media (max-width: 1919px) and (min-width: 1600px) {
  .header-padding {
    padding: 0 30px;
  }
  
  .time-container {
    width: 280px !important;
  }
  
  .title-container {
    width: 700px !important;
  }
  
  .dashboard-title-text {
    font-size: 28px !important;
  }
}

@media (max-width: 1599px) and (min-width: 1366px) {
  .header-padding {
    padding: 0 20px;
  }
  
  .time-container {
    width: 240px !important;
  }
  
  .title-container {
    width: 600px !important;
  }
  
  .dashboard-title-text {
    font-size: 24px !important;
  }
}

@media (max-width: 1365px) {
  .header-padding {
    padding: 0 10px;
  }
  
  .time-container {
    width: 200px !important;
    min-width: 180px !important;
  }
  
  .title-container {
    width: 100% !important;
    max-width: 500px !important;
  }
  
  .dashboard-title-text {
    font-size: 20px !important;
  }
  
  .back-button {
    padding: 3px 12px !important;
    font-size: 12px !important;
    line-height: 1.3 !important;
  }
}


.content-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
}


.left-panel, .right-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}


/* 统计卡片 */
.stats-section {
  flex-shrink: 0;
}


.map-container, .alert-list-container, .trend-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}


.alert-list-container > *, .trend-container > * {
  flex: 1;
  min-height: 0;
}


/* 统计卡片 */
.stats-section {
  height: auto !important;
  min-height: 100px !important;
  margin-bottom: 16px !important;
  flex-shrink: 0 !important;
}

.stats-container {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 12px !important;
  width: 100% !important;
}

.stat-card {
  height: 100px !important;
  min-height: 100px !important;
  max-height: 100px !important;
  width: 100% !important;
  position: relative;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.9) 50%, rgba(20, 50, 120, 0.8) 100%) !important;
  border: 1px solid rgba(0, 149, 255, 0.4) !important;
  border-radius: 8px !important;
  padding: 16px !important;
  backdrop-filter: blur(10px) !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  box-shadow: 0 0 20px rgba(0, 149, 255, 0.2) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}


.left-panel {
  overflow: visible !important;
}

.content-wrapper {
  overflow: visible !important;
}




.header-center {
  position: relative !important;
}

.title-container {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: auto !important;
  height: auto !important;
}

.dashboard-title-text {
  color: white !important;
  font-size: 32px !important;
  font-weight: bold !important;
  text-shadow: 0 0 10px rgba(0, 254, 255, 0.8) !important;
  white-space: nowrap !important;
  text-align: center !important;
  margin: 0 auto !important;
}


/* 动画 */
@keyframes techFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
    filter: blur(2px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
</style>






