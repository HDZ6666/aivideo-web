<template>
  <div id="cockpit" class="dashboard-container">
    <div class="header">
      <div class="header-time">
        <div id="time" class="header-time__text"></div>
      </div>

      <div class="header-title">
        <div class="header-title__text">数据驾驶舱</div>
      </div>

      <div class="header-switch">
        <div class="header-switch__content">
          <span class="header-switch__label">实时告警</span>
          <el-switch v-model="realTimeAlert" size="large" active-color="#13ce66" inactive-color="#ff4949"
            active-text="开启" inactive-text="关闭" />
        </div>
      </div>

      <div class="back-button" @click="back">
        <div class="back-icon">←</div>
        <span class="back-text">返回后台</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="left-panel">
        <div class="stats-section">
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-card__content">
                <div class="stat-card__icon-wrap">
                  <div class="stat-icon">
                    <div class="stat-icon__emoji">🏪</div>
                  </div>
                </div>
                <div class="stat-card__info">
                  <div class="stat-value">{{ totalStores }}</div>
                  <div class="stat-label">门店总数</div>
                </div>
              </div>
              <div class="stat-glow"></div>
            </div>

            <div class="stat-card">
              <div class="stat-card__content">
                <div class="stat-card__icon-wrap">
                  <div class="stat-icon">
                    <div class="stat-icon__emoji">🚨</div>
                  </div>
                </div>
                <div class="stat-card__info">
                  <div class="stat-value">{{ todayAlerts }}</div>
                  <div class="stat-label">今日告警数</div>
                </div>
              </div>
              <div class="stat-glow"></div>
            </div>

            <div class="stat-card">
              <div class="stat-card__content">
                <div class="stat-card__icon-wrap">
                  <div class="stat-icon">
                    <div class="stat-icon__emoji">📊</div>
                  </div>
                </div>
                <div class="stat-card__info">
                  <div class="stat-card__trend-row">
                    <span class="stat-value">{{ weekAlerts }}</span>
                    <span class="stat-trend">{{ weekAlertsTrend }}</span>
                  </div>
                  <div class="stat-label">近7天告警数</div>
                </div>
              </div>
              <div class="stat-glow"></div>
            </div>

            <div class="stat-card">
              <div class="stat-card__content">
                <div class="stat-card__icon-wrap">
                  <div class="stat-icon">
                    <div class="stat-icon__emoji">⚠️</div>
                  </div>
                </div>
                <div class="stat-card__info">
                  <div class="stat-value">{{ pendingAlerts }}</div>
                  <div class="stat-label">未处理告警数</div>
                </div>
              </div>
              <div class="stat-glow"></div>
            </div>
          </div>
        </div>

        <div class="map-panel">
          <div class="map-panel__header">
            <div class="map-panel__header-inner">
              <div class="map-panel__title title-content">
                <div class="map-panel__title-icon">🗺️</div>
                <span class="map-panel__title-text">门店分布</span>
                <div class="title-glow"></div>
              </div>

              <div class="map-panel__filter tech-cascader">
                <span class="map-panel__filter-label">📍 区域筛选:</span>
                <el-cascader v-model="selectedArea" :options="areaOptions" placeholder="选择省/市/区"
                  @change="handleAreaChange" size="large" popper-class="tech-cascader-dropdown" :teleported="false"
                  clearable />
              </div>
            </div>
          </div>

          <div class="map-panel__body">
            <AMapComponent ref="amap" :center="mapCenter" :zoom="12" mapStyle="amap://styles/blue"
              @mapInit="handleMapInit" />
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="chart-wrapper">
          <AlertList />
        </div>

        <div class="chart-wrapper">
          <AlertTrend />
        </div>
      </div>
    </div>

    <DialogComponent :visible="dialogVisible" :building-data="selectedBuilding" @close="closeDialog" />

    <AlertDialog
      :enabled="realTimeAlert"
      :detail-page-open="dialogVisible"
      @close="handleAlertDialogClose"
      @image-switch="handleImageSwitch"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, provide } from "vue";
import { ElCascader } from "element-plus";
import AMapComponent from "@/components/AMapComponent/index.vue";
import DialogComponent from "./components/DialogComponent.vue";
import autofit from "autofit.js";

// 导入图表组件
import AlertList from "./components/AlertList.vue";
import AlertTrend from "./components/AlertTrend.vue";
import AlertDialog from "./components/AlertDialog.vue";
import { fa } from "element-plus/es/locales.mjs";

// 实时告警开关
const realTimeAlert = ref(false);

// 统计数据 - 4个关键指标
const totalStores = ref(356); // 门店总数
const todayAlerts = ref(12); // 今日告警数
const weekAlerts = ref(89); // 近7天告警数
const pendingAlerts = ref(8); // 未处理告警数
const weekAlertsTrend = ref("↑ 23%"); // 近7天告警增长值

// 省市区筛选
const selectedArea = ref([]);
const areaOptions = ref([
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "shenzhen",
        label: "深圳市",
        children: [
          { value: "futian", label: "福田区" },
          { value: "luohu", label: "罗湖区" },
          { value: "nanshan", label: "南山区" },
          { value: "baoan", label: "宝安区" },
          { value: "longgang", label: "龙岗区" },
          { value: "yantian", label: "盐田区" },
        ],
      },
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          { value: "tianhe", label: "天河区" },
          { value: "yuexiu", label: "越秀区" },
          { value: "haizhu", label: "海珠区" },
          { value: "liwan", label: "荔湾区" },
        ],
      },
    ],
  },
  {
    value: "shanghai",
    label: "上海市",
    children: [
      {
        value: "shanghai",
        label: "上海市",
        children: [
          { value: "huangpu", label: "黄浦区" },
          { value: "xuhui", label: "徐汇区" },
          { value: "changning", label: "长宁区" },
          { value: "jingan", label: "静安区" },
          { value: "putuo", label: "普陀区" },
          { value: "hongkou", label: "虹口区" },
        ],
      },
    ],
  },
  {
    value: "beijing",
    label: "北京市",
    children: [
      {
        value: "beijing",
        label: "北京市",
        children: [
          { value: "dongcheng", label: "东城区" },
          { value: "xicheng", label: "西城区" },
          { value: "chaoyang", label: "朝阳区" },
          { value: "haidian", label: "海淀区" },
          { value: "fengtai", label: "丰台区" },
        ],
      },
    ],
  },
]);

const handleAreaChange = (value) => {
  console.log("选择的区域:", value);
  // 后续将根据选择的区域筛选门店
};

// 地图实例
const amap = ref(null);
const mapCenter = ref([114.109497, 22.548578]); // 以万达店为中心
const buildingMarkers = ref([]);

// 楼宇数据
const buildingsList = ref([]);
// 小区数据已移除

// 向子组件提供楼宇数据
provide("buildingsList", buildingsList);

// 对话框相关
const dialogVisible = ref(false);
const selectedBuilding = ref(null);



// 模拟门店数据
const fetchBuildingsList = async () => {
  // 使用模拟数据替代API调用
  buildingsList.value = [
    {
      id: 1,
      name: "万达店",
      longitude: "114.109497",
      latitude: "22.548578",
      address: "深圳市南山区万达广场",
      status: "正常营业",
      companies: 25,
      taxRevenue: 1200000,
    },
    {
      id: 2,
      name: "银泰店",
      longitude: "114.115497",
      latitude: "22.552578",
      address: "深圳市南山区银泰中心",
      status: "正常营业",
      dailySales: 8500,
      alertCount: 2,
    },
    {
      id: 3,
      name: "大悦城店",
      longitude: "114.120497",
      latitude: "22.545578",
      address: "深圳市南山区大悦城购物中心",
      status: "正常营业",
      dailySales: 9200,
      alertCount: 0,
    },
    {
      id: 4,
      name: "海岸城店",
      longitude: "114.125497",
      latitude: "22.540578",
      address: "深圳市南山区海岸城购物中心",
      status: "正常营业",
      dailySales: 7800,
      alertCount: 1,
    },
    {
      id: 5,
      name: "华强北店",
      longitude: "114.085497",
      latitude: "22.535578",
      address: "深圳市福田区华强北路",
      status: "正常营业",
      dailySales: 10200,
      alertCount: 3,
    },
    {
      id: 6,
      name: "欢乐海岸店",
      longitude: "114.130497",
      latitude: "22.535578",
      address: "深圳市南山区欢乐海岸",
      status: "正常营业",
      dailySales: 8900,
      alertCount: 1,
    },
  ];
  console.log("加载模拟楼宇数据:", buildingsList.value);

  // 如果地图已初始化，更新地图显示
  if (amap.value && amap.value.map) {
    addBuildingMarkers();
  }
};

// 将楼宇数据转换为地图标记格式
const getBuildingsForMap = () => {
  return buildingsList.value
    .filter((building) => building.longitude && building.latitude)
    .map((building) => ({
      id: building.id,
      name: building.name,
      position: [parseFloat(building.longitude), parseFloat(building.latitude)],
      data: building, // 保存完整的楼宇数据
    }));
};

// 监听实时告警开关变化
watch(realTimeAlert, (newValue) => {
  console.log(`实时告警${newValue ? "开启" : "关闭"}`);
  // 这里可以添加实时告警的逻辑
});

// 更新地图显示
const updateMapDisplay = () => {
  if (!amap.value || !amap.value.map) return;

  // 清除所有标记
  clearAllMarkers();

  // 显示楼宇标记
  addBuildingMarkers();
};

// 清除所有标记
const clearAllMarkers = () => {
  // 清除楼宇标记
  if (buildingMarkers.value.length > 0) {
    buildingMarkers.value.forEach((marker) => {
      amap.value.map.remove(marker);
    });
    buildingMarkers.value = [];
  }
};

onMounted(async () => {
  // 初始化时间显示
  initTime();
  // 用了默认参数，等价于 autofit.init()
  autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#cockpit",
    resize: true,
  });

  // 加载模拟楼宇数据
  await fetchBuildingsList();
});

onUnmounted(() => {
  timeInterval && clearInterval(timeInterval);
});

// 初始化时间显示
const initTime = () => {
  const updateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const week = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
    document.getElementById("time").innerHTML = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds} ${week}`;
  };

  updateTime();
  const timeInterval = setInterval(updateTime, 1000);
};

// 处理地图初始化完成事件
const handleMapInit = (mapInstance) => {
  console.log("地图初始化完成", mapInstance);

  // 添加交通图层
  const trafficLayer = new window.AMap.TileLayer.Traffic();
  mapInstance.add(trafficLayer);
  const satelliteLayer = new window.AMap.TileLayer.Satellite()
  mapInstance.add(satelliteLayer)

  // 添加楼宇标记点
  updateMapDisplay();
};

// 添加楼宇标记
const addBuildingMarkers = () => {
  if (!amap.value || !amap.value.map || !window.AMap) return;

  const mapInstance = amap.value.map;

  // 获取楼宇数据
  const data = getBuildingsForMap();
  console.log("添加楼宇标记数据:", data);

  const iconImage = "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";

  data.forEach((item) => {
    // 创建标记
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

    // 添加点击事件
    marker.on("click", handleBuildingClick);

    // 添加到地图
    mapInstance.add(marker);
    buildingMarkers.value.push(marker);

    // 添加文本标记（只显示title）
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

    // 为文本标记也添加点击事件
    text.on("click", handleBuildingClick);

    mapInstance.add(text);
    buildingMarkers.value.push(text);
  });
};

// 处理楼宇点击事件
const handleBuildingClick = (e) => {
  const building = e.target.getExtData().data;
  selectedBuilding.value = building;
  dialogVisible.value = true;
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 处理告警弹框关闭
const handleAlertDialogClose = () => {
  console.log('🔕 告警弹框手动关闭');
};

// 处理图片切换
const handleImageSwitch = (index) => {
  console.log('🖼️ 图片切换到索引:', index);
};

// 返回后台
const back = () => {
  const currentHref = window.top.location.href;
  const newUrl = currentHref.replace(/#.*$/, '#/aiView');
  window.top.location.href = newUrl;
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #001d58;
  z-index: 1;
}

.header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 108px;
  padding: 0 50px;
  background: no-repeat center/cover url("@/assets/datav/cockpit/bg/top-boder.png");
}

.header-time,
.header-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-repeat: no-repeat;
  background-size: contain;
}

.header-time {
  width: 341px;
  height: 65px;
  background-image: url("@/assets/datav/cockpit/bg/datatime.png");
}

.header-time__text,
.header-switch__content,
.header-title__text {
  color: #fff;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 944px;
  height: 69px;
  background: no-repeat center/contain url("@/assets/datav/cockpit/bg/标题.png");
}

.header-title__text {
  margin-left: 120px;
  font-size: 30px;
  font-weight: 700;
}

.header-switch {
  width: 504px;
  height: 61px;
  background-image: url("@/assets/datav/cockpit/bg/menu.png");
}

.header-switch__content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-switch__label {
  font-size: 18px;
}

.content-wrapper {
  display: flex;
  gap: 24px;
  height: 972px;
  padding: 16px;
}

.left-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.stats-section {
  margin-bottom: 16px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

.stat-card__content {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.stat-card__icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-card__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.stat-card__trend-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 254, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 149, 255, 0.3), 0 0 30px rgba(0, 254, 255, 0.2);
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

/* 科技感边框装饰效果 */
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

/* 统计卡片图标样式 */
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

.stat-icon__emoji {
  font-size: 18px;
  opacity: 0.9;
  filter: drop-shadow(0 0 4px rgba(0, 254, 255, 0.6));
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #00feff;
  font-family: "Consolas", "Monaco", monospace;
  text-shadow: 0 0 12px rgba(0, 254, 255, 0.5);
  line-height: 1;
}

.stat-trend {
  color: #4ade80;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 0 0 2px rgba(74, 222, 128, 0.6);
}

.stat-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  line-height: 1.2;
}

.title-content {
  position: relative;
  display: flex;
  align-items: center;
}

.title-glow {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  background: linear-gradient(135deg, transparent, rgba(0, 254, 255, 0.1), transparent);
}

.title-content:hover .title-glow {
  opacity: 1 !important;
}

.map-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 6px;
  background: rgba(20, 50, 120, 0.08);
}

.map-panel__header {
  z-index: 1000;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 149, 255, 0.4);
  background: linear-gradient(90deg, rgba(25, 55, 125, 0.8) 0%, rgba(20, 50, 120, 0.8) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 149, 255, 0.2);
}

.map-panel__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.map-panel__title {
  gap: 12px;
  padding: 0 24px;
  white-space: nowrap;
}

.map-panel__title-icon {
  font-size: 30px;
  filter: drop-shadow(0 0 5px rgba(0, 254, 255, 0.5));
}

.map-panel__title-text {
  color: #00feff;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.map-panel__filter {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.map-panel__filter-label {
  color: #00feff;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
}

.map-panel__body {
  flex: 1;
  min-height: 0;
  padding: 8px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 800px;
  height: 100%;
}

.chart-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.back-button {
  position: absolute;
  top: 28px;
  right: 80px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
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
