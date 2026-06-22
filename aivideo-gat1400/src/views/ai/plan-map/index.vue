<template>
  <div class="app-container plan-map-list">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>平面图区域</span>
          <el-space>
            <el-input
              v-model="keyword"
              clearable
              placeholder="按区域名称搜索"
              prefix-icon="Search"
              style="width: 240px"
            />
            <el-button type="primary" icon="Plus" @click="openCreateDialog">新增区域</el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="filteredRegions" border>
        <el-table-column label="预览" width="150" align="center">
          <template #default="{ row }">
            <el-image v-if="row.imageUrl" :src="row.imageUrl" fit="cover" class="plan-thumb" />
            <div v-else class="plan-thumb empty">暂无图片</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="区域名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="摄像头" width="110" align="center">
          <template #default="{ row }">{{ row.cameras?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="已标注" width="110" align="center">
          <template #default="{ row }">{{ row.markers?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="goDetail(row)">查看</el-button>
            <el-button type="primary" link @click="goDetail(row)">编辑</el-button>
            <el-button type="danger" link @click="removeRegion(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新建平面图区域" width="560px" append-to-body>
      <el-form :model="createForm" label-width="96px">
        <el-form-item label="区域名称">
          <el-input v-model.trim="createForm.name" placeholder="请输入区域名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="平面图">
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            class="plan-uploader"
          >
            <div v-if="createForm.imageUrl" class="plan-preview">
              <img :src="createForm.imageUrl" alt="" />
              <div class="plan-mask">
                <el-icon><Refresh /></el-icon>
                <span>替换图片</span>
              </div>
            </div>
            <div v-else class="plan-placeholder">
              <el-icon><Picture /></el-icon>
              <span>拖拽图片到此处，或点击上传</span>
            </div>
          </el-upload>
          <div v-if="createForm.imageWidth" class="plan-meta">
            图片尺寸：{{ createForm.imageWidth }} x {{ createForm.imageHeight }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createRegion">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture, Refresh } from '@element-plus/icons-vue'
import { createPlanMapId, listPlanMaps, removePlanMap, upsertPlanMap } from './store'
import { fileToDataUrl, formatDate, loadImageMeta } from '../viid-utils'

const router = useRouter()
const regions = ref([])
const keyword = ref('')
const dialogVisible = ref(false)
const createForm = reactive({
  name: '',
  imageUrl: '',
  imageWidth: 0,
  imageHeight: 0
})

const filteredRegions = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  if (!key) return regions.value
  return regions.value.filter((item) => String(item.name || '').toLowerCase().includes(key))
})

loadRegions()

function loadRegions() {
  regions.value = listPlanMaps()
}

function openCreateDialog() {
  createForm.name = ''
  createForm.imageUrl = ''
  createForm.imageWidth = 0
  createForm.imageHeight = 0
  dialogVisible.value = true
}

async function handleImageChange(uploadFile) {
  const raw = uploadFile?.raw
  if (!raw) return
  const url = await fileToDataUrl(raw)
  const meta = await loadImageMeta(url)
  createForm.imageUrl = url
  createForm.imageWidth = meta.width
  createForm.imageHeight = meta.height
}

function createRegion() {
  const name = createForm.name.trim()
  if (!name) {
    ElMessage.warning('请输入区域名称')
    return
  }
  if (!createForm.imageUrl) {
    ElMessage.warning('请上传平面图')
    return
  }

  const now = Date.now()
  const region = {
    id: createPlanMapId(),
    name,
    imageUrl: createForm.imageUrl,
    imageWidth: createForm.imageWidth,
    imageHeight: createForm.imageHeight,
    cameras: [],
    markers: [],
    createdAt: now,
    updatedAt: now
  }
  upsertPlanMap(region)
  dialogVisible.value = false
  loadRegions()
  router.push(`/ai/plan-map/${region.id}`)
}

function goDetail(row) {
  router.push(`/ai/plan-map/${row.id}`)
}

function removeRegion(row) {
  ElMessageBox.confirm(`确认删除区域“${row.name}”？`, '提示', { type: 'warning' })
    .then(() => {
      removePlanMap(row.id)
      loadRegions()
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<style scoped>
.plan-thumb {
  width: 112px;
  height: 64px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #f8fafc;
}

.plan-thumb.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.plan-uploader {
  width: 100%;
}

.plan-uploader :deep(.el-upload),
.plan-uploader :deep(.el-upload-dragger) {
  width: 100%;
}

.plan-preview {
  position: relative;
  width: 100%;
  height: 180px;
}

.plan-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.plan-mask {
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

.plan-preview:hover .plan-mask {
  opacity: 1;
}

.plan-placeholder {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #909399;
}

.plan-placeholder .el-icon {
  font-size: 34px;
}

.plan-meta {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
