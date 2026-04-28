<template>
  <div v-if="visible" class="dialog-container" @click.self="closeDialog">
    <div class="dialog-content">
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
      <div class="close-btn" @click="closeDialog">
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
          <span class="title-icon">🏢</span>
          {{ buildingData.name || "楼宇详情" }}
        </h2>
        <div class="title-line"></div>
      </div>

      <!-- Tab导航 -->
      <div class="tab-nav">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          <span class="tab-text">{{ tab }}</span>
          <div class="tab-indicator"></div>
        </div>
      </div>

      <!-- Tab内容 -->
      <div class="tab-content">
        <!-- 基本信息 Tab -->
        <BasicInfoTab v-if="activeTab === 0" :building-data="buildingData" />

        <!-- 告警列表 Tab -->
        <AlertListTab v-if="activeTab === 1" :building-data="buildingData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BasicInfoTab from "./tabs/BasicInfoTab.vue";
import AlertListTab from "./tabs/AlertListTab.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  buildingData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["close"]);

// Tab相关
const tabs = ["基本信息", "告警列表"];
const activeTab = ref(0);

// 关闭对话框
const closeDialog = () => {
  // 重置到基本信息Tab
  activeTab.value = 0;
  emit("close");
};
</script>

<style lang="scss" scoped>
/* 对话框容器 */
.dialog-container {
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 对话框主体 */
.dialog-content {
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

@keyframes slideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
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

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-br {
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

.edge-top,
.edge-bottom {
  height: 1px;
  left: 50px;
  right: 50px;
}

.edge-top {
  top: 10px;
}
.edge-bottom {
  bottom: 10px;
}

.edge-left,
.edge-right {
  width: 1px;
  top: 50px;
  bottom: 50px;
  background: linear-gradient(180deg, transparent, #00feff, transparent);
}

.edge-left {
  left: 10px;
}
.edge-right {
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

/* Tab导航 */
.tab-nav {
  display: flex;
  gap: 2px;
  margin-bottom: 25px;
  background: rgba(20, 50, 120, 0.5);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(0, 149, 255, 0.2);
}

.tab-item {
  position: relative;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  background: transparent;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
  overflow: hidden;
}

.tab-text {
  position: relative;
  z-index: 2;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.tab-item.active .tab-text {
  color: #00feff;
  text-shadow: 0 0 8px rgba(0, 254, 255, 0.5);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00feff, transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-item.active .tab-indicator {
  transform: scaleX(1);
}

.tab-item.active {
  background: linear-gradient(135deg, rgba(0, 149, 255, 0.1) 0%, rgba(0, 254, 255, 0.05) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
}

.tab-item:hover:not(.active) {
  background: rgba(0, 149, 255, 0.05);
}

.tab-item:hover:not(.active) .tab-text {
  color: rgba(255, 255, 255, 0.9);
}

/* Tab内容区域 */
.tab-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: rgba(20, 50, 120, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(0, 149, 255, 0.1);
}

.tab-pane {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 自定义滚动条 */
.tab-pane::-webkit-scrollbar {
  width: 6px;
}

.tab-pane::-webkit-scrollbar-track {
  background: rgba(20, 50, 120, 0.3);
  border-radius: 3px;
}

.tab-pane::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00feff, rgba(0, 149, 255, 0.8));
  border-radius: 3px;
  box-shadow: inset 0 0 3px rgba(0, 254, 255, 0.3);
}

.tab-pane::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00feff, #0095ff);
}

/* 基本信息Tab布局 */
.info-layout {
  display: flex;
  gap: 25px;
  height: 100%;
}

/* 楼宇图片区域 */
.building-image-section {
  width: 320px;
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
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.6) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.image-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(0, 254, 255, 0.1) 50%, transparent 70%);
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
  gap: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.image-placeholder svg {
  opacity: 0.6;
}

.building-name {
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

/* 楼宇信息区域 */
.building-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.info-card {
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.4) 0%, rgba(25, 55, 125, 0.6) 100%);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 254, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.info-card:hover::before {
  left: 100%;
}

.info-card:hover {
  border-color: rgba(0, 149, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 149, 255, 0.1);
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
}

.card-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
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

/* 表格相关样式 */
.table-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 租控图样式 */
.rental-control-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 内联图例样式 */
.legend-section-inline {
  border-radius: 8px;
  margin-bottom: 15px;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 149, 255, 0.2);
}

.legend-title {
  font-size: 16px;
  color: #00feff;
  font-weight: 600;
}

.legend-summary {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.legend-item.clickable {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
}

.legend-item.clickable:hover {
  background: rgba(0, 149, 255, 0.1);
  border-color: rgba(0, 149, 255, 0.3);
}

.legend-item.disabled {
  opacity: 0.5;
}

.legend-item.disabled span {
  text-decoration: line-through;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.rental-grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.3) 0%, rgba(25, 55, 125, 0.5) 100%);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.rental-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  flex: 1;
}

.rental-unit {
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.rental-unit:hover {
  transform: scale(1.05);
  border-color: #00feff;
  box-shadow: 0 0 10px rgba(0, 254, 255, 0.3);
}

.rental-unit.hidden {
  opacity: 0.3;
  filter: grayscale(100%);
}

.unit-number {
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

.rental-unit .company-name {
  font-size: 9px;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  line-height: 1.2;
  margin-top: 2px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.6) 0%, rgba(25, 55, 125, 0.8) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 8px;
}

.section-icon {
  font-size: 18px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #00feff;
  flex: 1;
}

.tenant-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 149, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 149, 255, 0.3);
}

/* 筛选器样式 */
.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.filter-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.filter-select {
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.9) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  padding: 6px 12px;
  font-size: 14px;
  min-width: 120px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #00feff;
  box-shadow: 0 0 8px rgba(0, 254, 255, 0.3);
}

.filter-select option {
  background: rgba(20, 50, 120, 0.95);
  color: #fff;
  padding: 8px;
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 8px;
  background: rgba(20, 50, 120, 0.3);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 800px;
}

.data-table th {
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.9) 100%);
  color: #00feff;
  font-weight: 600;
  padding: 12px 8px;
  text-align: center;
  border-bottom: 2px solid rgba(0, 149, 255, 0.3);
  border-right: 1px solid rgba(0, 149, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th:last-child {
  border-right: none;
}

.data-table td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 149, 255, 0.1);
  border-right: 1px solid rgba(0, 149, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.data-table td:last-child {
  border-right: none;
}

.data-table tbody tr:nth-child(even) {
  background: rgba(25, 55, 125, 0.3);
}

.data-table tbody tr:nth-child(odd) {
  background: rgba(20, 50, 120, 0.2);
}

.data-table tbody tr:hover {
  background: rgba(0, 149, 255, 0.1);
  transform: scale(1.01);
}

.data-table .company-name {
  color: #00feff;
  font-weight: 600;
  text-align: left;
}

.data-table .building-name {
  color: #00feff;
  font-weight: 600;
}

.data-table .highlight {
  color: #00ff88;
  font-weight: 600;
}

.data-table .industry {
  color: #ffa726;
  font-weight: 500;
}

.data-table .floor-number {
  color: #9c27b0;
  font-weight: 600;
  text-align: center;
}

.data-table .price {
  color: #ff6b6b;
  font-weight: 600;
}

.data-table .demand-content,
.data-table .issue-content {
  text-align: left;
  max-width: 200px;
  word-wrap: break-word;
  line-height: 1.4;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* 状态标签样式 */
.status-badge,
.type-badge,
.intention-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
  display: inline-block;
  text-align: center;
  min-width: 60px;
}

/* 企业状态样式 */
.status-active {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
}

.status-inactive {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.status-suspended {
  color: #ffa726;
  background: rgba(255, 167, 38, 0.1);
  border-color: rgba(255, 167, 38, 0.3);
}

.status-unknown {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 诉求类型样式 */
.type-maintenance {
  color: #42a5f5;
  background: rgba(66, 165, 245, 0.1);
  border-color: rgba(66, 165, 245, 0.3);
}

.type-environment {
  color: #66bb6a;
  background: rgba(102, 187, 106, 0.1);
  border-color: rgba(102, 187, 106, 0.3);
}

.type-security {
  color: #ef5350;
  background: rgba(239, 83, 80, 0.1);
  border-color: rgba(239, 83, 80, 0.3);
}

.type-service {
  color: #ab47bc;
  background: rgba(171, 71, 188, 0.1);
  border-color: rgba(171, 71, 188, 0.3);
}

.type-network {
  color: #26c6da;
  background: rgba(38, 198, 218, 0.1);
  border-color: rgba(38, 198, 218, 0.3);
}

.type-parking {
  color: #ffca28;
  background: rgba(255, 202, 40, 0.1);
  border-color: rgba(255, 202, 40, 0.3);
}

.type-equipment {
  color: #ff7043;
  background: rgba(255, 112, 67, 0.1);
  border-color: rgba(255, 112, 67, 0.3);
}

.type-default {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 意向类型样式 */
.intention-rent {
  color: #29b6f6;
  background: rgba(41, 182, 246, 0.1);
  border-color: rgba(41, 182, 246, 0.3);
}

.intention-buy {
  color: #66bb6a;
  background: rgba(102, 187, 106, 0.1);
  border-color: rgba(102, 187, 106, 0.3);
}

.intention-default {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 分页组件样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.4) 0%, rgba(25, 55, 125, 0.6) 100%);
  border-top: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 0 0 8px 8px;
}

.pagination-info {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(0, 149, 255, 0.6) 0%, rgba(0, 254, 255, 0.4) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(0, 149, 255, 0.8) 0%, rgba(0, 254, 255, 0.6) 100%);
  border-color: rgba(0, 149, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 149, 255, 0.3);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(25, 55, 125, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 55, 125, 0.6);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  background: rgba(0, 149, 255, 0.3);
  border-color: rgba(0, 149, 255, 0.4);
  color: white;
}

.page-number.active {
  background: linear-gradient(135deg, rgba(0, 149, 255, 0.8) 0%, rgba(0, 254, 255, 0.6) 100%);
  border-color: rgba(0, 149, 255, 0.6);
  color: white;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(0, 149, 255, 0.4);
}

/* 数据统计Tab */
.stats-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.6) 0%, rgba(25, 55, 125, 0.8) 100%);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 254, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  border-color: rgba(0, 149, 255, 0.5);
  box-shadow: 0 0 25px rgba(0, 149, 255, 0.2);
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 149, 255, 0.1);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 50%;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #00feff;
  text-shadow: 0 0 10px rgba(0, 254, 255, 0.3);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.chart-placeholder {
  flex: 1;
  background: linear-gradient(135deg, rgba(20, 50, 120, 0.3) 0%, rgba(25, 55, 125, 0.5) 100%);
  border: 1px solid rgba(0, 149, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.chart-placeholder::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(0, 254, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 149, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  position: relative;
}

.placeholder-content svg {
  opacity: 0.6;
}

.placeholder-content p {
  font-size: 16px;
  margin: 0;
}

</style>
