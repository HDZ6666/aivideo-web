<template>
  <el-dialog v-model="visible" title="设备列表" width="900px" destroy-on-close @open="handleOpen">
    <el-form :model="queryParams" inline>
      <el-form-item label="设备名称">
        <el-input
          v-model="queryParams.query"
          clearable
          placeholder="请输入设备名称"
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-alert :title="`已选中 ${selectedRows.length} 项`" type="info" show-icon :closable="false" class="mb8">
      <template #default>
        <el-button type="danger" link @click="selectedRows = []">全部清空</el-button>
      </template>
    </el-alert>

    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      height="330"
      border
      @selection-change="handleSelectionChange"
      ref="tableRef"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="name" label="设备名称" min-width="180" show-overflow-tooltip />
      <el-table-column prop="deviceId" label="设备ID" min-width="180" show-overflow-tooltip />
      <el-table-column prop="channelId" label="通道ID" min-width="180" show-overflow-tooltip />
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
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
import { listRuleDevices } from '@/api/ai/rule'
import { normalizeList, cloneJson } from '../../utils'

const props = defineProps({
  modelValue: Boolean,
  selected: {
    type: Array,
    default: () => []
  },
  alarmTypeId: {
    type: [String, Number],
    default: undefined
  },
  isBing: {
    type: Number,
    default: 0
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
  pageSize: 10,
  query: undefined,
  isBing: props.isBing,
  alarmTypeId: props.alarmTypeId
})

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.alarmTypeId, (value) => {
  queryParams.alarmTypeId = value
})

function handleOpen() {
  selectedRows.value = cloneJson(props.selected || [])
  getList()
}

function getList() {
  loading.value = true
  listRuleDevices(queryParams).then((res) => {
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
  queryParams.query = undefined
  handleQuery()
}

function handleSelectionChange(selection) {
  const pageIds = tableData.value.map((item) => item.id)
  const outside = selectedRows.value.filter((item) => !pageIds.includes(item.id))
  selectedRows.value = outside.concat(selection.map((item) => ({
    id: item.id,
    name: item.name,
    deviceId: item.deviceId,
    channelId: item.channelId
  })))
}

function confirm() {
  emit('confirm', cloneJson(selectedRows.value))
  visible.value = false
}
</script>

