<template>
  <div class="app-container ai-setting-page">
    <template v-if="actionType === 'list'">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>算法配置</span>
            <el-space>
              <el-button type="primary" :disabled="!activeCategory" @click="actionType = 'add'">新增规则</el-button>
              <el-button type="warning" :disabled="selectedRows.length < 2" @click="batchEdit">批量配置</el-button>
              <el-button type="danger" :disabled="selectedRows.length < 2" @click="batchRemove">批量删除</el-button>
            </el-space>
          </div>
        </template>

        <el-tabs v-if="categories.length" v-model="activeAlarmTypeId" @tab-change="changeCategory">
          <el-tab-pane
            v-for="item in categories"
            :key="String(item.alarmTypeId || item.id)"
            :name="String(item.alarmTypeId || item.id)"
            :label="item.alarmTypeName"
          />
        </el-tabs>
        <el-empty v-else description="暂无启用算法，请先在算法库启用算法" />

        <el-form v-if="categories.length" :model="queryParams" inline class="mb12">
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

        <el-table
          v-if="categories.length"
          v-loading="loading || deleteLoading"
          :data="tableData"
          row-key="id"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" type="index" width="70" align="center" />
          <el-table-column label="设备名称" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ firstDevice(row)?.name || '-' }}</template>
          </el-table-column>
          <el-table-column label="设备ID" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ firstDevice(row)?.channelId || firstDevice(row)?.deviceId || '-' }}</template>
          </el-table-column>
          <el-table-column label="通知方式" min-width="120">
            <template #default="{ row }">{{ formatNoticeType(row.notificateType) }}</template>
          </el-table-column>
          <el-table-column label="通知人员" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">{{ formatPeople(row.notificatePeople) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="edit(row)">编辑</el-button>
              <el-button type="danger" link @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.pageSize"
          :total="total"
          @pagination="getRuleList"
        />
      </el-card>
    </template>

    <AddRule
      v-if="actionType === 'add'"
      :alarm-type-id="activeAlarmTypeId"
      @back="actionType = 'list'"
      @saved="getRuleList"
    />

    <EditRule
      v-if="actionType === 'edit'"
      :alarm-type-id="activeAlarmTypeId"
      :rule-id="currentRuleId"
      @back="actionType = 'list'"
      @saved="getRuleList"
    />

    <EditDeviceRule
      v-if="actionType === 'editDevice'"
      :alarm-type-id="activeAlarmTypeId"
      :selected-rows="selectedRows"
      @back="actionType = 'list'"
      @saved="getRuleList"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listCategory } from '@/api/ai/category'
import { batchDeleteRule, deleteRule, listRule } from '@/api/ai/rule'
import { NOTIFICATE_TYPE_OPTIONS, normalizeList } from '../utils'
import AddRule from './components/AddRule.vue'
import EditDeviceRule from './components/EditDeviceRule.vue'
import EditRule from './components/EditRule.vue'

const props = defineProps({
  alarmTypeId: {
    type: [String, Number],
    default: undefined
  },
  title: {
    type: String,
    default: ''
  }
})

const loading = ref(false)
const deleteLoading = ref(false)
const categories = ref([])
const activeAlarmTypeId = ref('')
const actionType = ref('list')
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const currentRuleId = ref()
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  query: undefined,
  alarmTypeId: undefined
})

const activeCategory = computed(() => categories.value.find((item) => String(item.alarmTypeId || item.id) === String(activeAlarmTypeId.value)))

watch(activeAlarmTypeId, (value) => {
  queryParams.alarmTypeId = value
})

function getCategories() {
  if (props.alarmTypeId) {
    categories.value = [{
      alarmTypeId: props.alarmTypeId,
      alarmTypeName: props.title || '算法配置'
    }]
    activeAlarmTypeId.value = String(props.alarmTypeId)
    getRuleList()
    return
  }

  listCategory({
    page: 1,
    pageSize: 1000
  }).then((res) => {
    const data = normalizeList(res)
    categories.value = data.list.filter((item) => item.isUse === 1)
    if (!activeAlarmTypeId.value && categories.value.length) {
      activeAlarmTypeId.value = String(categories.value[0].alarmTypeId || categories.value[0].id)
    }
    if (activeAlarmTypeId.value) getRuleList()
  })
}

function getRuleList() {
  if (!activeAlarmTypeId.value) return
  loading.value = true
  queryParams.alarmTypeId = activeAlarmTypeId.value
  listRule(queryParams).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
    selectedRows.value = []
  }).finally(() => {
    loading.value = false
  })
}

function changeCategory() {
  queryParams.page = 1
  queryParams.query = undefined
  getRuleList()
}

function handleQuery() {
  queryParams.page = 1
  getRuleList()
}

function resetQuery() {
  queryParams.query = undefined
  handleQuery()
}

function handleSelectionChange(selection) {
  selectedRows.value = selection
}

function edit(row) {
  currentRuleId.value = row.id
  actionType.value = 'edit'
}

function remove(row) {
  ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteLoading.value = true
    deleteRule({ ruleId: row.id }).then(() => {
      ElMessage.success('删除规则成功')
      getRuleList()
    }).finally(() => {
      deleteLoading.value = false
    })
  }).catch(() => {})
}

function batchEdit() {
  if (selectedRows.value.length < 2) {
    ElMessage.warning('请至少选择2条要编辑的规则')
    return
  }
  ElMessageBox.confirm(`是否批量设置 ${selectedRows.value.length} 条规则？已选中的规则会被覆盖为新的规则。`, '批量设置', {
    type: 'warning'
  }).then(() => {
    actionType.value = 'editDevice'
  }).catch(() => {})
}

function batchRemove() {
  if (selectedRows.value.length < 2) {
    ElMessage.warning('请至少选择2条要删除的规则')
    return
  }
  ElMessageBox.confirm(`是否批量删除 ${selectedRows.value.length} 条规则？删除后不可恢复。`, '批量删除', {
    type: 'warning'
  }).then(() => {
    deleteLoading.value = true
    batchDeleteRule(selectedRows.value.map((item) => item.id)).then(() => {
      ElMessage.success('批量删除规则成功')
      getRuleList()
    }).finally(() => {
      deleteLoading.value = false
    })
  }).catch(() => {})
}

function firstDevice(row) {
  return Array.isArray(row.device) && row.device.length ? row.device[0] : null
}

function formatNoticeType(value) {
  if (!Array.isArray(value) || value.length === 0) return '无'
  return value.map((item) => NOTIFICATE_TYPE_OPTIONS.find((option) => option.value === item)?.label || item).join(',')
}

function formatPeople(value) {
  if (!Array.isArray(value) || value.length === 0) return '无'
  return value.map((item) => item.name).join(', ')
}

getCategories()
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

