<template>
  <el-dialog
    v-model="showDialog"
    :title="type === 'add' ? '添加分组' : '修改分组'"
    width="40%"
    top="2rem"
    :close-on-click-modal="false"
    destroy-on-close
    @close="close"
  >
    <div v-loading="isLoading" class="device-group-edit-body">
      <el-form ref="editGroupFormRef" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="editForm.groupName" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editForm.state" placeholder="请选择" style="width: 100%">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级分组" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.group_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const emit = defineEmits(['get-device-group'])

const type = ref('add')
const options = ref([])
const editGroupFormRef = ref(null)
const showDialog = ref(false)
const isLoading = ref(false)
const editForm = reactive({
  groupName: null,
  state: 1,
  parentId: null,
  isScreen: 0
})
const rules = {
  groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
}

function openDialog(dialogType, dialogOptions, groupObject) {
  type.value = dialogType
  options.value = dialogOptions || []

  if (dialogType === 'edit' && groupObject) {
    Object.assign(editForm, {
      id: groupObject.id,
      groupName: groupObject.group_name,
      state: groupObject.state,
      parentId: groupObject.parent_id === 0 ? null : groupObject.parent_id
    })
  }

  showDialog.value = true
}

function onSubmit() {
  editGroupFormRef.value?.validate((valid) => {
    if (!valid) return
    type.value === 'add' ? addGroup() : editGroup()
  })
}

function addGroup() {
  isLoading.value = true
  request({
    method: 'post',
    url: '/ai/api/device/group/addGroup',
    data: editForm
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        ElMessage.success('添加成功')
        emit('get-device-group')
        showDialog.value = false
      } else {
        ElMessage.error(res.msg)
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function editGroup() {
  isLoading.value = true
  request({
    method: 'post',
    url: '/ai/api/device/group/updateDeviceGroup',
    data: editForm
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        ElMessage.success('修改')
        emit('get-device-group')
        showDialog.value = false
      } else {
        ElMessage.error(res.msg)
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function close() {
  showDialog.value = false
  type.value = null
  options.value = []
  editGroupFormRef.value?.resetFields()
  Object.assign(editForm, {
    id: undefined,
    groupName: null,
    state: 1,
    parentId: null,
    isScreen: 0
  })
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.device-group-edit-body {
  margin-right: 20px;
}
</style>
