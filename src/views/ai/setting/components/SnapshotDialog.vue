<template>
  <el-dialog v-model="visible" title="历史快照" width="900px" destroy-on-close @open="getList">
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      height="360"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column v-if="select" width="50">
        <template #default="{ row }">
          <el-radio v-model="selectedId" :label="row.id">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column label="快照" width="130">
        <template #default="{ row }">
          <el-image
            :src="toImageUrl(row.imgLink || row.alarmImg)"
            :preview-src-list="[toImageUrl(row.imgLink || row.alarmImg)]"
            :z-index="4000"
            fit="cover"
            preview-teleported
            class="snapshot-img"
          />
        </template>
      </el-table-column>
      <el-table-column prop="imgLink" label="地址" min-width="220" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" min-width="160" />
      <el-table-column v-if="!select" label="操作" width="100" fixed="right">
        <template #default="{ row }">
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

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="select" type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteSnapshot, listSnapshot } from '@/api/ai/rule'
import { normalizeList, toImageUrl } from '../../utils'

const props = defineProps({
  modelValue: Boolean,
  select: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const loading = ref(false)
const deleteLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedId = ref()
const selectedRow = ref()
const queryParams = reactive({
  page: 1,
  pageSize: 10
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
  }
})

function getList() {
  loading.value = true
  listSnapshot(queryParams).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

function handleCurrentChange(row) {
  if (!props.select || !row) return
  selectedRow.value = row
  selectedId.value = row.id
}

function confirm() {
  if (!selectedRow.value) {
    ElMessage.warning('请选择图片')
    return
  }
  emit('confirm', selectedRow.value.imgLink || selectedRow.value.alarmImg || '')
  visible.value = false
}

function remove(row) {
  ElMessageBox.confirm('确定删除该快照吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteLoading.value = true
    deleteSnapshot({ id: row.id }).then(() => {
      ElMessage.success('操作成功')
      getList()
    }).finally(() => {
      deleteLoading.value = false
    })
  }).catch(() => {})
}
</script>

<style scoped>
.snapshot-img {
  width: 96px;
  height: 72px;
  background: #000;
}
</style>
