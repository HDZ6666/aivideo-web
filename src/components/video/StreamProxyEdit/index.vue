<template>
  <el-dialog v-model="open" :title="type === 'add' ? '添加代理' : '修改代理'" width="640px" append-to-body destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="128px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="分组" prop="categoryId">
        <el-tree-select
          v-model="form.categoryId"
          :data="groupList"
          :props="{ value: 'id', label: 'group_name', children: 'children' }"
          value-key="id"
          clearable
          check-strictly
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" style="width: 100%" :disabled="type === 'edit'">
          <el-option label="默认" value="default" />
          <el-option label="FFmpeg" value="ffmpeg" />
        </el-select>
      </el-form-item>
      <el-form-item label="流应用名" prop="app">
        <el-input v-model="form.app" clearable :disabled="type === 'edit'" />
      </el-form-item>
      <el-form-item label="流ID" prop="stream">
        <el-input v-model="form.stream" clearable :disabled="type === 'edit'" />
      </el-form-item>
      <el-form-item v-if="form.type === 'default'" label="拉流地址" prop="url">
        <el-input v-model="form.url" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 'ffmpeg'" label="拉流地址" prop="srcUrl">
        <el-input v-model="form.srcUrl" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 'ffmpeg'" label="超时毫秒" prop="timeoutMs">
        <el-input-number v-model="form.timeoutMs" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="节点选择" prop="mediaServerId">
        <el-select v-model="form.mediaServerId" style="width: 100%" @change="getFfmpegCmdList">
          <el-option v-for="item in mediaServerList" :key="item.id" :label="item.id" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type === 'ffmpeg'" label="命令模板" prop="ffmpegCmdKey">
        <el-select v-model="form.ffmpegCmdKey" style="width: 100%">
          <el-option v-for="key in Object.keys(ffmpegCmdList)" :key="key" :label="ffmpegCmdList[key]" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="国标编码" prop="gbId">
        <el-input v-model="form.gbId" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 'default'" label="拉流方式" prop="rtpType">
        <el-select v-model="form.rtpType" style="width: 100%">
          <el-option label="TCP" value="0" />
          <el-option label="UDP" value="1" />
          <el-option label="组播" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="无人观看">
        <el-radio-group v-model="form.noneReader">
          <el-radio label="0">不处理</el-radio>
          <el-radio label="1">停用</el-radio>
          <el-radio label="2">移除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="其他选项">
        <el-checkbox v-model="form.enable">启用</el-checkbox>
        <el-checkbox v-model="form.enableAudio">开启音频</el-checkbox>
        <el-checkbox v-model="form.enableMp4">录制</el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const open = ref(false)
const loading = ref(false)
const type = ref('add')
const formRef = ref(null)
const callbackRef = ref(null)
const groupList = ref([])
const mediaServerList = ref([])
const ffmpegCmdList = ref({})
const form = reactive(createForm())
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  app: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
  stream: [{ required: true, message: '请输入流ID', trigger: 'blur' }],
  url: [{ required: true, message: '请输入要代理的流', trigger: 'blur' }],
  srcUrl: [{ required: true, message: '请输入要代理的流', trigger: 'blur' }]
}

function createForm() {
  return {
    name: '',
    type: 'default',
    categoryId: null,
    app: '',
    stream: '',
    url: '',
    srcUrl: '',
    timeoutMs: 10000,
    ffmpegCmdKey: '',
    gbId: '',
    rtpType: '0',
    enable: true,
    enableAudio: true,
    enableMp4: false,
    noneReader: '0',
    enableRemoveNoneReader: false,
    enableDisableNoneReader: false,
    mediaServerId: ''
  }
}

function openDialog(row, callback, currentType = 'add', groups = []) {
  Object.assign(form, createForm(), row || {})
  if (form.enableRemoveNoneReader) form.noneReader = '2'
  else if (form.enableDisableNoneReader) form.noneReader = '1'
  else form.noneReader = '0'
  type.value = currentType
  groupList.value = groups || []
  callbackRef.value = callback
  open.value = true
  getMediaServerList()
}

function getMediaServerList() {
  request({ method: 'get', url: '/api/server/media_server/online/list' }).then((res) => {
    mediaServerList.value = res.data || []
    if (!form.mediaServerId && mediaServerList.value[0]) {
      form.mediaServerId = mediaServerList.value[0].id
    }
    getFfmpegCmdList()
  })
}

function getFfmpegCmdList() {
  if (!form.mediaServerId) return
  request({
    method: 'get',
    url: '/api/proxy/ffmpeg_cmd/list',
    params: { mediaServerId: form.mediaServerId }
  }).then((res) => {
    ffmpegCmdList.value = res.data || {}
    if (!form.ffmpegCmdKey) {
      form.ffmpegCmdKey = Object.keys(ffmpegCmdList.value)[0] || ''
    }
  })
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    const payload = { ...form }
    payload.enableDisableNoneReader = payload.noneReader === '1'
    payload.enableRemoveNoneReader = payload.noneReader === '2'
    loading.value = true
    request({
      method: 'post',
      url: type.value === 'edit' ? '/ai/api/device/queryManager/updateDeviceStreamProxy' : '/api/proxy/save',
      data: payload
    })
      .then((res) => {
        ElMessage.success(res.msg || '保存成功')
        callbackRef.value?.()
        close()
      })
      .finally(() => {
        loading.value = false
      })
  })
}

function close() {
  open.value = false
}

function reset() {
  formRef.value?.resetFields()
  Object.assign(form, createForm())
}

defineExpose({
  openDialog,
  close
})
</script>
