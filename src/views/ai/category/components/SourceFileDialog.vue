<template>
  <el-dialog
    v-model="visible"
    :title="`算法名称：${categoryItem?.alarmTypeName || ''}`"
    width="940px"
    destroy-on-close
    @open="getList"
  >
    <el-form :model="queryParams" inline>
      <el-form-item label="文件名称">
        <el-input
          v-model="queryParams.fileName"
          clearable
          placeholder="请输入文件名称"
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>源文件列表</span>
          <el-button type="primary" @click="uploadVisible = true">上传源文件</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        height="300"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column width="50">
          <template #default="{ row }">
            <el-radio
              v-model="selectedId"
              :label="row.id"
              :disabled="row.uploadComplete !== 1"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fileName" label="文件名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="totalSize" label="文件大小" width="120">
          <template #default="{ row }">{{ formatFileSize(row.totalSize) }}</template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="下载地址" min-width="220" show-overflow-tooltip />
        <el-table-column prop="uploadComplete" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.uploadComplete === 1 ? 'success' : 'danger'">
              {{ row.uploadComplete === 1 ? '上传完成' : '上传中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              link
              :disabled="row.isUse === 1"
              :loading="deleteLoading"
              @click="remove(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="getList"
      />
    </el-card>

    <UploadSourceFileDialog
      v-model="uploadVisible"
      :alarm-type-id="categoryItem?.id || -1"
      @success="getList"
    />

    <template #footer>
      <el-button type="primary" :loading="bindLoading" @click="bindFile">绑定算法</el-button>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bindAlarmCategory, deleteFile, listFile } from '@/api/ai/upload'
import { formatFileSize, normalizeList } from '../../utils'
import UploadSourceFileDialog from './UploadSourceFileDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  categoryItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const uploadVisible = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const bindLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedId = ref()
const selectedRow = ref()
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  fileName: undefined
})

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
  if (!value) {
    selectedId.value = undefined
    selectedRow.value = undefined
    queryParams.page = 1
    queryParams.fileName = undefined
  }
})

function getList() {
  if (!visible.value) return
  loading.value = true
  listFile({
    ...queryParams,
    alarmTypeId: props.categoryItem?.id || -1
  }).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
    const used = data.list.find((item) => item.isUse === 1)
    if (used) {
      selectedId.value = used.id
      selectedRow.value = used
    }
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.page = 1
  getList()
}

function resetQuery() {
  queryParams.fileName = undefined
  handleQuery()
}

function handleCurrentChange(row) {
  if (!row || row.uploadComplete !== 1) return
  selectedId.value = row.id
  selectedRow.value = row
}

function remove(row) {
  ElMessageBox.confirm('确定删除该源文件吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteLoading.value = true
    deleteFile({ id: row.id }).then(() => {
      ElMessage.success('操作成功')
      getList()
      emit('success')
    }).finally(() => {
      deleteLoading.value = false
    })
  }).catch(() => {})
}

function bindFile() {
  if (!selectedRow.value) {
    ElMessage.warning('请选择需要绑定的文件')
    return
  }
  if (selectedRow.value.uploadComplete !== 1) {
    ElMessage.warning('文件未上传完成')
    return
  }
  bindLoading.value = true
  bindAlarmCategory({
    alarmTypeId: props.categoryItem?.id || -1,
    fileId: selectedRow.value.id
  }).then(() => {
    ElMessage.success('绑定成功')
    getList()
    emit('success')
  }).finally(() => {
    bindLoading.value = false
  })
}
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

