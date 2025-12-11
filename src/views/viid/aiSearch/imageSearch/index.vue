<template>
  <div class="app-container">
    <el-row :gutter="20" class="search-layout">
      <!-- 左侧搜索区域 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="6" class="search-left">
        <el-card class="search-panel">
          <template #header>
            <div class="card-header">
              <span>图片搜索</span>
            </div>
          </template>

          <el-form :model="searchParams" ref="searchRef" label-width="80px" label-position="top">
            <!-- 图片上传 -->
            <el-form-item label="上传图片" prop="searchImage">
              <el-upload class="upload-demo" drag :auto-upload="false" :show-file-list="false" accept="image/*"
                :on-change="handleImageChange">
                <el-image v-if="searchParams.searchImage" :src="searchParams.searchImage" fit="cover"
                  style="width: 100%; height: 160px;" />
                <div v-else class="upload-placeholder">
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip">支持 jpg/png 格式</div>
                </div>
              </el-upload>
            </el-form-item>

            <!-- 搜索类型 -->
            <el-form-item label="搜索类型" prop="searchType">
              <el-select v-model="searchParams.searchType" placeholder="请选择搜索类型" style="width: 100%">
                <el-option label="人脸搜索" value="face" />
                <el-option label="人员搜索" value="person" />
                <el-option label="车辆搜索" value="vehicle" />
                <el-option label="非机动车搜索" value="nonMotorVehicle" />
              </el-select>
            </el-form-item>

            <!-- 操作按钮 -->
            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button type="primary" icon="Search" @click="handleSearch" :loading="searching"
                    :disabled="!searchParams.searchImage || !searchParams.searchType" style="width: 100%;">
                    搜索
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button icon="Refresh" @click="resetSearch" style="width: 100%;">重置</el-button>
                </el-col>
              </el-row>
            </el-form-item>


          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧结果展示区域 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="18" class="search-right">
        <el-card class="results-panel" v-loading="searching">
          <!-- 搜索结果展示 -->
          <div class="search-card-container" v-if="searchResults.length > 0 || searching">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" v-for="item in searchResults" :key="item.id">
                <el-card class="search-result-card" shadow="hover">
                  <!-- 匹配图片 -->
                  <div class="result-image-container">
                    <el-image :src="item.matchedImage" :preview-src-list="[item.matchedImage]" fit="cover"
                      class="result-image" :preview-teleported="true">
                      <template #error>
                        <div class="image-slot">
                          <el-icon>
                            <Picture />
                          </el-icon>
                        </div>
                      </template>
                    </el-image>
                    <!-- 相似度标签 -->
                    <div class="similarity-tag">
                      <el-tag :type="getSimilarityType(item.similarity)" size="small">
                        {{ item.similarity }}%
                      </el-tag>
                    </div>
                  </div>

                  <!-- 信息内容 -->
                  <div class="result-info">
                    <div class="info-row">
                      <span class="info-label">设备名称：</span>
                      <span class="info-value">{{ item.deviceName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">设备编号：</span>
                      <span class="info-value">{{ item.deviceCode }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">搜索类型：</span>
                      <span class="info-value">
                        <el-tag size="small">{{ getSearchTypeName(item.searchType) }}</el-tag>
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="time-value">{{ formatTime(item.collectTime) }}</span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="result-actions">
                    <el-button link @click="handleView(item)">
                      <el-icon>
                        <View />
                      </el-icon>
                      查看详情
                    </el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 空状态 -->
            <el-empty v-if="!searching && searchResults.length === 0 && hasSearched" description="未找到匹配结果" />

            <!-- 分页组件 -->
            <div class="pagination-container" v-if="total > pageSize">
              <pagination v-show="total > 0" :total="total" v-model:page="currentPage" v-model:limit="pageSize"
                @pagination="handlePagination" />
            </div>
          </div>

          <!-- 未搜索状态 -->
          <div class="empty-search" v-if="!hasSearched && searchResults.length === 0">
            <el-empty description="请在左侧上传图片并选择搜索类型开始搜索">
              <template #image>
                <el-icon size="100" color="#909399">
                  <Search />
                </el-icon>
              </template>
            </el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情对话框 -->
    <el-dialog title="搜索结果详情" v-model="detailOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border size="small" label-width="100px" v-if="detailForm">
        <el-descriptions-item label="设备名称">{{ detailForm.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ detailForm.deviceCode }}</el-descriptions-item>
        <el-descriptions-item label="搜索类型">{{ getSearchTypeName(detailForm.searchType) }}</el-descriptions-item>
        <el-descriptions-item label="相似度">
          <el-tag :type="getSimilarityType(detailForm.similarity)" size="small">
            {{ detailForm.similarity }}%
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="采集时间" :span="2">{{ formatTime(detailForm.collectTime) }}</el-descriptions-item>
        <el-descriptions-item label="匹配图片" :span="2">
          <el-image :src="detailForm.matchedImage" :preview-src-list="[detailForm.matchedImage]" fit="cover"
            style="width: 200px; height: 120px;" :preview-teleported="true" />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailOpen = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ImageSearch">
import { UploadFilled, Picture, Search, View } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 响应式数据
const searchParams = ref({
  searchImage: null,
  searchType: null
})
const searchResults = ref([])
const allResults = ref([]) // 存储所有搜索结果
const searching = ref(false)
const hasSearched = ref(false)
const detailOpen = ref(false)
const detailForm = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(6) // 每页显示8个结果
const total = ref(0)

// 搜索类型映射
const searchTypeMap = {
  'face': '人脸搜索',
  'person': '人员搜索',
  'vehicle': '车辆搜索',
  'nonMotorVehicle': '非机动车搜索'
}

/** 图片上传处理 */
function handleImageChange(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    searchParams.value.searchImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

/** 开始搜索 */
function handleSearch() {
  if (!searchParams.value.searchImage || !searchParams.value.searchType) {
    proxy.$modal.msgWarning("请上传图片并选择搜索类型")
    return
  }

  searching.value = true
  hasSearched.value = true
  currentPage.value = 1

  // 模拟搜索延迟
  setTimeout(() => {
    allResults.value = generateMockResults()
    total.value = allResults.value.length
    updatePageResults()
    searching.value = false
    proxy.$modal.msgSuccess(`搜索完成，找到 ${total.value} 个匹配结果`)
  }, 2000)
}

/** 重置搜索 */
function resetSearch() {
  searchParams.value = {
    searchImage: null,
    searchType: null
  }
  searchResults.value = []
  allResults.value = []
  hasSearched.value = false
  currentPage.value = 1
  total.value = 0
}

/** 分页处理 */
function handlePagination() {
  updatePageResults()
}

/** 更新当前页结果 */
function updatePageResults() {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  searchResults.value = allResults.value.slice(start, end)
}

/** 查看详情 */
function handleView(row) {
  detailForm.value = { ...row }
  detailOpen.value = true
}

/** 获取搜索类型名称 */
function getSearchTypeName(type) {
  return searchTypeMap[type] || '未知'
}

/** 获取相似度标签类型 */
function getSimilarityType(similarity) {
  if (similarity >= 90) return 'success'
  if (similarity >= 70) return 'warning'
  return 'danger'
}

/** 格式化时间 */
function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
}

/** 生成模拟搜索结果 */
function generateMockResults() {
  const type = searchParams.value.searchType
  const baseResults = []

  // 根据搜索类型生成不同的模拟数据
  if (type === 'face') {
    const faceImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]

    // 生成15个人脸搜索结果
    for (let i = 1; i <= 15; i++) {
      baseResults.push({
        id: i,
        deviceName: `监控设备${String(i).padStart(2, '0')}`,
        deviceCode: `CAM${String(i).padStart(3, '0')}`,
        searchType: type,
        similarity: Math.floor(Math.random() * 30) + 70, // 70-99的随机相似度
        matchedImage: faceImages[i % faceImages.length],
        collectTime: `202509251${String(Math.floor(Math.random() * 6) + 3)}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })
    }
  } else if (type === 'person') {
    const personImages = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]

    // 生成12个人员搜索结果
    for (let i = 1; i <= 12; i++) {
      baseResults.push({
        id: i + 100,
        deviceName: `人员监控${String(i).padStart(2, '0')}`,
        deviceCode: `PER${String(i).padStart(3, '0')}`,
        searchType: type,
        similarity: Math.floor(Math.random() * 25) + 75, // 75-99的随机相似度
        matchedImage: personImages[i % personImages.length],
        collectTime: `202509251${String(Math.floor(Math.random() * 6) + 3)}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })
    }
  } else if (type === 'vehicle') {
    const vehicleImages = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]

    // 生成18个车辆搜索结果
    for (let i = 1; i <= 18; i++) {
      baseResults.push({
        id: i + 200,
        deviceName: `车辆监控${String(i).padStart(2, '0')}`,
        deviceCode: `VEH${String(i).padStart(3, '0')}`,
        searchType: type,
        similarity: Math.floor(Math.random() * 30) + 70, // 70-99的随机相似度
        matchedImage: vehicleImages[i % vehicleImages.length],
        collectTime: `202509251${String(Math.floor(Math.random() * 6) + 3)}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })
    }
  } else if (type === 'nonMotorVehicle') {
    const nonMotorImages = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1544191696-15693072e0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]

    // 生成10个非机动车搜索结果
    for (let i = 1; i <= 10; i++) {
      baseResults.push({
        id: i + 300,
        deviceName: `非机动车监控${String(i).padStart(2, '0')}`,
        deviceCode: `NMV${String(i).padStart(3, '0')}`,
        searchType: type,
        similarity: Math.floor(Math.random() * 25) + 75, // 75-99的随机相似度
        matchedImage: nonMotorImages[i % nonMotorImages.length],
        collectTime: `202509251${String(Math.floor(Math.random() * 6) + 3)}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })
    }
  }

  return baseResults
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
/* 左右布局样式 */
.search-left {
  margin-bottom: 20px;
}

.search-right {
  height: calc(100vh - 160px);
}

.search-panel {
  border-radius: 8px;
}

.results-panel {
  height: 100%;
  border-radius: 8px;
  overflow-y: auto;
}

.search-card-container {
  height: 100%;
  border-radius: 8px;
}

.search-card-container .el-row {
  margin: 0 !important;
}

.search-card-container .el-col {
  padding: 10px;
}

.results-count {
  color: #909399;
  font-size: 14px;
  font-weight: normal;
}

.search-result-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.search-result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.result-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.similarity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.result-info {
  padding: 16px;
  background: #fff;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #606266;
  margin-right: 8px;
  white-space: nowrap;
  font-weight: 500;
}

.info-value {
  color: #303133;
  flex: 1;
  word-break: break-all;
}

.time-value {
  color: #909399;
  font-size: 14px;
  font-weight: normal;
}

.result-actions {
  padding: 12px 16px;
  padding-bottom: 0;
  background: transparent;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

.result-actions .el-button {
  padding: 4px 8px;
  font-size: 13px;
  color: #606266;
  transition: color 0.3s ease;
}

.result-actions .el-button:hover {
  color: #409eff;
}

.result-actions .el-button .el-icon {
  margin-right: 4px;
  font-size: 14px;
}

.upload-placeholder {
  text-align: center;
  padding: 30px 20px;
}

.upload-placeholder .el-icon--upload {
  font-size: 36px;
  color: #c0c4cc;
  margin-bottom: 12px;
}

.upload-placeholder .el-upload__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}

.upload-placeholder .el-upload__tip {
  color: #909399;
  font-size: 11px;
  margin-top: 6px;
}

.empty-search {
  margin-top: 60px;
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 上传组件样式 */
.upload-demo {
  width: 100%;
}

.upload-demo .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 160px;
}

.upload-demo .el-upload:hover {
  border-color: #409eff;
}
</style>
