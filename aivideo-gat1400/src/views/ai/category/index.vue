<template>
  <div class="app-container ai-category-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="算法名称" prop="alarmTypeName">
        <el-input
          v-model="queryParams.alarmTypeName"
          placeholder="请输入算法名称"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openAdd">新增算法</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="tableData" row-key="id" border>
      <el-table-column label="序号" type="index" width="70" align="center" />
      <el-table-column prop="alarmTypeName" label="算法名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="alarmCode" label="唯一识别码" min-width="140" align="center">
        <template #default="{ row }">
          <el-tag type="info">{{ row.alarmCode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isUse" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.isUse === 1"
            :loading="statusLoading"
            active-text="启用"
            inactive-text="禁用"
            @change="(checked) => changeStatus(row, checked)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="已绑定源文件" min-width="170" align="center">
        <template #default="{ row }">
          <el-tag :type="row.fileName ? 'success' : 'warning'">{{ row.fileName || '未绑定' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="170" align="center" />
      <el-table-column label="操作" width="250" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="openSourceFile(row)">源文件管理</el-button>
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" link :loading="deleteLoading" @click="remove(row)">删除</el-button>
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

    <CategoryEditDialog
      v-model="addVisible"
      title="新增算法"
      :data="{}"
      :loading="submitLoading"
      :show-status="false"
      @submit="submitAdd"
    />

    <CategoryEditDialog
      v-model="editVisible"
      title="修改算法"
      :data="currentRow"
      :loading="submitLoading"
      @submit="submitEdit"
    />

    <SourceFileDialog
      v-model="sourceFileVisible"
      :category-item="currentRow"
      @success="getList"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addCategory, changeCategoryStatus, deleteCategory, listCategory, updateCategory } from '@/api/ai/category'
import { normalizeList, cloneJson } from '../utils'
import CategoryEditDialog from './components/CategoryEditDialog.vue'
import SourceFileDialog from './components/SourceFileDialog.vue'

const queryRef = ref()
const showSearch = ref(true)
const loading = ref(false)
const submitLoading = ref(false)
const deleteLoading = ref(false)
const statusLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const addVisible = ref(false)
const editVisible = ref(false)
const sourceFileVisible = ref(false)
const currentRow = ref({})
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  alarmTypeName: undefined
})

function getList() {
  loading.value = true
  listCategory(queryParams).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.page = 1
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

function openAdd() {
  addVisible.value = true
}

function openEdit(row) {
  currentRow.value = cloneJson(row)
  editVisible.value = true
}

function openSourceFile(row) {
  currentRow.value = cloneJson(row)
  sourceFileVisible.value = true
}

function submitAdd(values) {
  submitLoading.value = true
  addCategory({
    alarmTypeName: values.alarmTypeName,
    alarmCode: values.alarmCode,
    isUse: 0
  }).then(() => {
    ElMessage.success('新增算法成功')
    addVisible.value = false
    getList()
  }).finally(() => {
    submitLoading.value = false
  })
}

function submitEdit(values) {
  submitLoading.value = true
  updateCategory({
    id: values.id,
    alarmTypeName: values.alarmTypeName,
    alarmCode: values.alarmCode,
    isUse: values.isUse
  }).then(() => {
    ElMessage.success('修改算法成功')
    editVisible.value = false
    getList()
  }).finally(() => {
    submitLoading.value = false
  })
}

function changeStatus(row, checked) {
  if (checked && !row.fileId) {
    ElMessage.warning('请先绑定源文件再启用算法')
    return
  }
  statusLoading.value = true
  changeCategoryStatus({
    id: row.id,
    isUse: checked ? 1 : 0
  }).then(() => {
    ElMessage.success('更改状态成功')
    getList()
  }).finally(() => {
    statusLoading.value = false
  })
}

function remove(row) {
  ElMessageBox.confirm('确定删除该算法吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteLoading.value = true
    deleteCategory({ id: row.id }).then(() => {
      ElMessage.success('删除算法成功')
      getList()
    }).finally(() => {
      deleteLoading.value = false
    })
  }).catch(() => {})
}

getList()
</script>

