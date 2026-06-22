<template>
  <div class="app-container image-search-page">
    <el-row :gutter="16" class="image-search-main">
      <el-col :lg="6" :md="8" :sm="24" class="image-search-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <span>图片搜索</span>
          </template>

          <div class="form-label">上传图片</div>
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            class="search-uploader"
          >
            <div v-if="uploadUrl" class="search-preview">
              <img :src="uploadUrl" alt="" />
              <div class="search-mask">
                <el-icon><Refresh /></el-icon>
                <span>替换图片</span>
              </div>
            </div>
            <div v-else class="search-placeholder">
              <el-icon><Picture /></el-icon>
              <span>拖拽图片到此处，或点击上传</span>
            </div>
          </el-upload>

          <div class="form-label mt20">搜索类型</div>
          <el-select v-model="searchType" placeholder="请选择类型" style="width: 100%">
            <el-option label="人脸搜索" value="face" />
            <el-option label="人员搜索" value="person" />
            <el-option label="机动车搜索" value="motorvehicle" />
            <el-option label="非机动车搜索" value="nonmotorvehicle" />
          </el-select>

          <div class="form-label mt20">时间范围</div>
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />

          <el-button type="primary" class="search-button" :loading="loading" @click="handleSearch">
            开始 AI 检索
          </el-button>
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="image-search-result">
        <el-card shadow="never" class="result-card" v-loading="loading" element-loading-text="正在进行 AI 比对...">
          <div class="summary-row">
            <div class="summary-item">
              <el-icon><Search /></el-icon>
              <span>类型：<strong>{{ searchTypeText }}</strong></span>
            </div>
            <div class="summary-item">
              <el-icon><DocumentCopy /></el-icon>
              <span>结果：<strong>{{ total }}</strong> 条</span>
            </div>
            <div v-if="loading || costTime > 0" class="summary-item">
              <el-icon><Clock /></el-icon>
              <span>耗时：{{ costTime }}s</span>
            </div>
          </div>

          <div class="result-scroll">
            <el-row v-if="results.length && !loading" :gutter="16">
              <el-col v-for="item in results" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" class="result-col">
                <el-card shadow="hover" :body-style="{ padding: '0' }" class="result-item">
                  <div class="result-image-box">
                    <el-image
                      :src="item.images?.[0]"
                      :preview-src-list="item.images"
                      :z-index="4000"
                      fit="cover"
                      preview-teleported
                      class="result-image"
                    >
                      <template #error>
                        <div class="image-error"><el-icon><Picture /></el-icon></div>
                      </template>
                    </el-image>
                    <div class="score" :style="{ backgroundColor: getSimilarityColor(item.similarity) }">
                      {{ item.similarity }}%
                    </div>
                  </div>

                  <div class="result-info">
                    <div class="info-text" :title="item.deviceName">设备：{{ item.deviceName }}</div>
                    <template v-if="['face', 'person'].includes(searchType)">
                      <div class="info-text">性别：{{ item.gender }}</div>
                      <div class="info-text">年龄：{{ item.age }}</div>
                    </template>
                    <template v-else>
                      <div class="info-text">车牌：{{ item.plateNo || '无' }}</div>
                      <div class="info-text">详情：{{ item.vehicleColor || '-' }} {{ item.vehicleBrand || '' }}</div>
                    </template>
                    <div class="result-footer">
                      <span>{{ item.datetime }}</span>
                      <el-button type="primary" link @click="viewDetail(item)">详情</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <div v-if="!loading && results.length === 0" class="empty-wrap">
              <el-empty description="暂无检索结果" :image-size="150" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="detailVisible" title="检索详情" size="45%">
      <pre class="detail-json">{{ JSON.stringify(currentItem, null, 2) }}</pre>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, DocumentCopy, Picture, Refresh, Search } from '@element-plus/icons-vue'
import { searchFaces } from '@/api/viid/ai-search'

const useMockSearch = true
const loading = ref(false)
const uploadUrl = ref('')
const uploadFile = ref(null)
const searchType = ref('face')
const searchTime = ref([])
const results = ref([])
const total = ref(0)
const detailVisible = ref(false)
const currentItem = ref({})
const costTime = ref(0)

const faceMockData = [
  { similarity: 96, id: 'r1', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', datetime: '2025-08-22 17:47:09', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240'] },
  { similarity: 93, id: 'r2', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', datetime: '2025-08-22 17:47:04', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240'] },
  { similarity: 89, id: 'r3', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', datetime: '2025-08-22 17:41:24', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240'] },
  { similarity: 85, id: 'r4', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', datetime: '2025-08-22 17:41:15', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240'] },
  { similarity: 82, id: 'r5', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400', datetime: '2025-08-22 17:41:06', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1552058544-f2b08422138a?w=240'] },
  { similarity: 79, id: 'r6', deviceName: '十一楼摄像头', largeImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400', datetime: '2025-08-22 17:38:06', gender: '未知', age: '0 ~ 0', images: ['https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=240'] }
]

const searchTypeText = computed(() => {
  const types = {
    face: '人脸',
    person: '人员',
    motorvehicle: '机动车',
    nonmotorvehicle: '非机动车'
  }
  return types[searchType.value] || '未知'
})

function handleImageChange(file) {
  if (!file?.raw) return
  uploadFile.value = file.raw
  if (uploadUrl.value?.startsWith('blob:')) URL.revokeObjectURL(uploadUrl.value)
  uploadUrl.value = URL.createObjectURL(file.raw)
}

function handleSearch() {
  if (!uploadFile.value) {
    ElMessage.warning('请先上传图片')
    return
  }
  results.value = []
  total.value = 0
  costTime.value = 0
  loading.value = true

  if (useMockSearch) {
    const timer = window.setInterval(() => {
      costTime.value += 1
    }, 1000)
    window.setTimeout(() => {
      window.clearInterval(timer)
      results.value = faceMockData
      total.value = faceMockData.length
      loading.value = false
    }, 1200)
    return
  }

  const params = new FormData()
  params.append('file', uploadFile.value)
  params.append('pageNum', 1)
  params.append('pageSize', 24)
  if (searchTime.value?.length === 2) {
    params.append('startTime', searchTime.value[0])
    params.append('endTime', searchTime.value[1])
  }
  searchFaces(params)
    .then((response) => {
      const rows = response?.rows || response?.data?.rows || response?.data || []
      results.value = Array.isArray(rows) ? rows : []
      total.value = response?.total || results.value.length
    })
    .finally(() => {
      loading.value = false
    })
}

function getSimilarityColor(value) {
  if (value >= 90) return '#67c23a'
  if (value >= 80) return '#e6a23c'
  return '#f56c6c'
}

function viewDetail(item) {
  currentItem.value = item
  detailVisible.value = true
}
</script>

<style scoped>
.image-search-page,
.image-search-main,
.image-search-side,
.image-search-result,
.side-card,
.result-card {
  height: calc(100vh - 126px);
}

.side-card,
.result-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.result-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.form-label {
  margin-bottom: 8px;
  color: #606266;
  font-size: 13px;
  font-weight: 600;
}

.mt20 {
  margin-top: 20px;
}

.search-uploader,
.search-uploader :deep(.el-upload),
.search-uploader :deep(.el-upload-dragger) {
  width: 100%;
}

.search-preview {
  position: relative;
  height: 190px;
}

.search-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.search-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: rgba(0, 0, 0, 0.42);
  opacity: 0;
  transition: opacity 0.2s;
}

.search-preview:hover .search-mask {
  opacity: 1;
}

.search-placeholder {
  height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #909399;
}

.search-placeholder .el-icon {
  font-size: 34px;
}

.search-button {
  width: 100%;
  margin-top: 24px;
}

.result-card :deep(.el-card__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.summary-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid #ebeef5;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.summary-item strong {
  color: #409eff;
}

.result-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.result-col {
  margin-bottom: 16px;
}

.result-item {
  border: 1px solid #ebeef5;
}

.result-image-box {
  position: relative;
  height: 190px;
}

.result-image,
.image-error {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  background: #f8fafc;
  font-size: 28px;
}

.score {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.result-info {
  padding: 12px;
}

.info-text {
  margin-bottom: 5px;
  color: #606266;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

.empty-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-json {
  padding: 16px;
  margin: 0;
  background: #f8fafc;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
