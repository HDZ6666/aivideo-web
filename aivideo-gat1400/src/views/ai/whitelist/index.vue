<template>
  <div class="app-container whitelist-list">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>白名单区域</span>
          <el-space>
            <el-input
              v-model="keyword"
              clearable
              placeholder="按区域名称搜索"
              prefix-icon="Search"
              style="width: 240px"
            />
            <el-button type="primary" icon="Plus" @click="createArea">新增区域</el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="filteredAreas" border>
        <el-table-column prop="name" label="区域名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="摄像头" width="110" align="center">
          <template #default="{ row }">{{ row.cameras?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="图片数量" width="110" align="center">
          <template #default="{ row }">{{ row.images?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="同步时间" width="180">
          <template #default="{ row }">{{ formatDate(row.syncAt) }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="editArea(row)">编辑</el-button>
            <el-button type="danger" link @click="removeArea(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listWhitelistAreas, removeWhitelistArea } from './store'
import { formatDate } from '../viid-utils'

const router = useRouter()
const areas = ref([])
const keyword = ref('')

const filteredAreas = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  if (!key) return areas.value
  return areas.value.filter((item) => String(item.name || '').toLowerCase().includes(key))
})

loadAreas()

function loadAreas() {
  areas.value = listWhitelistAreas()
}

function createArea() {
  router.push('/ai/whitelist/new')
}

function editArea(row) {
  router.push(`/ai/whitelist/${row.id}`)
}

function removeArea(row) {
  ElMessageBox.confirm(`确认删除白名单区域“${row.name}”？`, '提示', { type: 'warning' })
    .then(() => {
      removeWhitelistArea(row.id)
      loadAreas()
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>
