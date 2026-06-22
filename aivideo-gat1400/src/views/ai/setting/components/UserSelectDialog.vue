<template>
  <el-dialog v-model="visible" title="通知人员" width="820px" destroy-on-close @open="handleOpen">
    <el-form :model="queryParams" inline>
      <el-form-item label="名称">
        <el-input
          v-model="queryParams.username"
          clearable
          placeholder="请输入名称"
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-alert :title="`已选中 ${selectedRows.length} 项`" type="info" show-icon :closable="false" class="mb8" />

    <el-table
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      row-key="id"
      height="320"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="username" label="名称" min-width="180" />
      <el-table-column prop="mobile" label="手机" min-width="180" />
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.count"
      :total="total"
      @pagination="getList"
    />

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { listPushUser } from '@/api/ai/user'
import { normalizeList, cloneJson } from '../../utils'

const props = defineProps({
  modelValue: Boolean,
  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const tableRef = ref()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const queryParams = reactive({
  page: 1,
  count: 10,
  username: undefined
})

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
})

function handleOpen() {
  selectedRows.value = cloneJson(props.selected || [])
  getList()
}

function getList() {
  loading.value = true
  listPushUser(queryParams).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
    nextTick(() => {
      tableRef.value?.clearSelection()
      tableData.value.forEach((row) => {
        if (selectedRows.value.some((item) => item.id === row.id)) {
          tableRef.value?.toggleRowSelection(row, true)
        }
      })
    })
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.page = 1
  getList()
}

function resetQuery() {
  queryParams.username = undefined
  handleQuery()
}

function handleSelectionChange(selection) {
  const pageIds = tableData.value.map((item) => item.id)
  const outside = selectedRows.value.filter((item) => !pageIds.includes(item.id))
  selectedRows.value = outside.concat(selection.map((item) => ({
    id: item.id,
    name: item.username || item.name || ''
  })))
}

function confirm() {
  emit('confirm', cloneJson(selectedRows.value))
  visible.value = false
}
</script>

