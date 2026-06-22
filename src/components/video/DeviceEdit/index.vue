<template>
  <el-dialog
    v-model="showDialog"
    title="设备编辑"
    width="80%"
    top="2rem"
    :close-on-click-modal="false"
    destroy-on-close
    @close="close"
  >
    <div v-loading="isLoading" class="device-edit-body">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="200px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceId">
              <el-input v-if="isEdit" v-model="form.deviceId" disabled />
              <el-input v-else v-model="form.deviceId" clearable />
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" clearable />
            </el-form-item>
            <el-form-item label="设备分组" prop="groupId">
              <el-tree-select
                v-model="form.groupId"
                :data="groupList"
                :props="treeProps"
                node-key="id"
                check-strictly
                clearable
                placeholder="请选择"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item v-if="isEdit" label="目录订阅" title="0为取消订阅" prop="subscribeCycleForCatalog">
              <el-input v-model="form.subscribeCycleForCatalog" clearable />
            </el-form-item>
            <el-form-item v-if="isEdit" label="位置订阅" title="0为取消订阅" prop="subscribeCycleForMobilePosition">
              <el-input v-model="form.subscribeCycleForMobilePosition" clearable />
            </el-form-item>
            <el-form-item label="地理坐标系" prop="geoCoordSys">
              <el-select v-model="form.geoCoordSys" style="width: 100%">
                <el-option key="WGS84" label="WGS84" value="WGS84" />
                <el-option key="GCJ02" label="GCJ02" value="GCJ02" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="字符集" prop="charset">
              <el-select v-model="form.charset" style="width: 100%">
                <el-option key="GB2312" label="GB2312" value="gb2312" />
                <el-option key="UTF-8" label="UTF-8" value="utf-8" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" clearable />
            </el-form-item>
            <el-form-item label="收流IP" prop="sdpIp">
              <el-input v-model="form.sdpIp" clearable />
            </el-form-item>
            <el-form-item label="流媒体ID" prop="mediaServerId">
              <el-select v-model="form.mediaServerId" style="width: 100%">
                <el-option key="auto" label="自动负载最小" value="auto" />
                <el-option
                  v-for="item in mediaServerList"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.subscribeCycleForMobilePosition > 0"
              label="移动位置报送间隔"
              prop="mobilePositionSubmissionInterval"
            >
              <el-input v-model="form.mobilePositionSubmissionInterval" clearable />
            </el-form-item>
            <el-form-item label="主子码流开关" prop="switchPrimarySubStream">
              <el-select v-model="form.switchPrimarySubStream" style="width: 100%">
                <el-option label="开启" :value="true" />
                <el-option label="关闭" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="其他选项">
              <el-checkbox v-model="form.ssrcCheck" label="SSRC校验" />
              <el-checkbox v-model="form.asMessageChannel" label="作为消息通道" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const showDialog = ref(false)
const isLoading = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const mediaServerList = ref([])
const groupList = ref([])
const listChangeCallback = ref(null)
const form = reactive({})

const rules = {
  deviceId: [{ required: true, message: '请输入设备编号', trigger: 'blur' }]
}
const treeProps = {
  children: 'children',
  label: 'group_name',
  value: 'id'
}

onMounted(() => {
  getGroupList()
})

function getGroupList() {
  request({
    method: 'get',
    url: '/ai/api/device/group/cameraGroupList'
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        groupList.value = res.data
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function openDialog(row, callback) {
  showDialog.value = true
  isEdit.value = !!row
  listChangeCallback.value = callback
  resetForm()

  if (row != null) {
    Object.assign(form, { ...row, groupId: !row.groupId ? '' : Number(row.groupId) })
  }

  getMediaServerList()
}

function getMediaServerList() {
  request({
    method: 'get',
    url: '/api/server/media_server/online/list'
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        mediaServerList.value = res.data
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function onSubmit() {
  form.subscribeCycleForCatalog = form.subscribeCycleForCatalog || 0
  form.subscribeCycleForMobilePosition = form.subscribeCycleForMobilePosition || 0
  form.mobilePositionSubmissionInterval = form.mobilePositionSubmissionInterval || 0

  formRef.value?.validate((valid) => {
    if (!valid) return
    isLoading.value = true
    request({
      method: 'post',
      url: `/api/device/query/device/${isEdit.value ? 'update' : 'add'}/`,
      params: form
    })
      .then((res) => {
        if (res.code === 0 || res.code === '0') {
          listChangeCallback.value?.()
        } else {
          ElMessage.error(res.msg)
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}

function resetForm() {
  Object.keys(form).forEach((key) => delete form[key])
}

function close() {
  showDialog.value = false
  nextTick(() => {
    formRef.value?.resetFields()
    resetForm()
  })
}

defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.device-edit-body {
  margin-top: 1rem;
  margin-right: 100px;
}
</style>
