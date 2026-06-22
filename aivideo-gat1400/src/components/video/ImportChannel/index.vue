<template>
  <el-dialog
    v-model="open"
    title="导入通道数据"
    width="520px"
    top="2rem"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-upload
      class="upload-box"
      drag
      name="file"
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">只能上传 csv / xls / xlsx 文件</div>
      </template>
    </el-upload>

    <ImportChannelErrorData ref="errorDataRef" :gb-ids="errorGBIds" :streams="errorStreams" />
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { VIDEO_ACCESS_TOKEN, VIDEO_API_BASE_URL } from '@/utils/video/request'
import ImportChannelErrorData from '@/components/video/ImportChannelErrorData/index.vue'

const open = ref(false)
const callbackRef = ref(null)
const errorDataRef = ref(null)
const errorGBIds = ref([])
const errorStreams = ref([])

const uploadUrl = computed(() => `${VIDEO_API_BASE_URL}/api/push/upload`)
const headers = computed(() => ({
  'access-token': VIDEO_ACCESS_TOKEN
}))

function openDialog(callback) {
  callbackRef.value = callback
  open.value = true
}

function handleSuccess(response) {
  if (response.code === 0 || response.code === '0') {
    ElMessage.success(response.msg || '导入成功')
    callbackRef.value?.()
    return
  }

  if (response.code === 1 || response.code === '1') {
    errorGBIds.value = response.data?.gbId || []
    errorStreams.value = response.data?.stream || []
    errorDataRef.value?.openDialog()
    callbackRef.value?.()
    return
  }

  ElMessage.error(response.msg || '导入失败')
}

function handleError(error) {
  ElMessage.error(error?.message || '导入失败')
}

function handleClosed() {
  errorGBIds.value = []
  errorStreams.value = []
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.upload-box {
  text-align: center;
}

.upload-icon {
  margin-bottom: 8px;
  font-size: 42px;
  color: var(--el-color-primary);
}
</style>
