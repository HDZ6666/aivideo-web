<template>
  <el-dialog v-model="visible" title="上传源文件" width="820px" destroy-on-close @close="handleClose">
    <el-card shadow="never">
      <template #header>
        <el-space>
          <el-upload :auto-upload="false" :show-file-list="false" :on-change="selectFile">
            <el-button type="primary" icon="Upload">选择文件</el-button>
          </el-upload>
          <el-button type="primary" icon="Promotion" @click="uploadAll">上传文件</el-button>
        </el-space>
      </template>

      <el-empty v-if="files.length === 0" description="请选择源文件" />
      <el-scrollbar v-else max-height="420px">
        <div v-for="(item, index) in files" :key="item.uid" class="upload-item">
          <div class="upload-info">
            <div class="upload-title">文件名：<strong>{{ item.name }}</strong></div>
            <div class="upload-desc">
              <span>大小：{{ formatFileSize(item.size) }}</span>
              <span>分片：{{ item.chunkFileList.length || item.chunkCount }}</span>
              <span>标识：{{ item.md5 || `${item.md5Progress}%` }}</span>
            </div>
            <el-progress v-if="['uploading', 'success'].includes(item.status)" :percentage="item.progress" />
          </div>
          <el-tag :type="statusMap[item.status].type">{{ statusMap[item.status].text }}</el-tag>
          <el-button v-if="item.status === 'preupload'" type="danger" link @click="removeFile(index)">移除</el-button>
          <el-button v-if="item.status === 'uploading'" type="danger" link @click="stopUpload(index)">暂停</el-button>
        </div>
      </el-scrollbar>
    </el-card>
  </el-dialog>
</template>

<script setup>
import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPreSignUrl, getTaskInfo, initTask, mergeTask } from '@/api/ai/upload'
import { formatFileSize } from '../../utils'

const CHUNK_SIZE = 5 * 1024 * 1024
const CONCURRENCY = 3

const props = defineProps({
  modelValue: Boolean,
  alarmTypeId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const files = ref([])

const statusMap = {
  preparation: { type: 'warning', text: 'MD5计算中' },
  preupload: { type: 'info', text: '等待上传' },
  uploading: { type: 'primary', text: '上传中' },
  success: { type: 'success', text: '上传成功' },
  error: { type: 'danger', text: '上传失败' }
}

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
})

async function selectFile(uploadFile) {
  const raw = uploadFile.raw
  if (!raw) return
  const dataItem = {
    uid: uploadFile.uid,
    name: raw.name,
    size: raw.size || 0,
    md5: '',
    md5Progress: 0,
    progress: 0,
    file: raw,
    chunkCount: Math.ceil((raw.size || 0) / CHUNK_SIZE),
    chunkFileList: [],
    uploadedSize: 0,
    status: 'preparation'
  }
  files.value.push(dataItem)
  const item = files.value.find((file) => file.uid === dataItem.uid)

  try {
    const chunks = await cutFile(raw, (progress) => {
      item.md5Progress = progress
    })
    const merkleRoot = getMerkleRoot(chunks.map((chunk) => chunk.hash))
    item.md5 = merkleRoot
    item.chunkFileList = chunks.map((chunk) => chunk.blob)
    item.status = 'preupload'
  } catch (error) {
    item.status = 'error'
    ElMessage.error('文件标识计算失败')
  }
}

async function uploadAll() {
  for (const item of files.value) {
    if (item.md5 && item.status === 'preupload') {
      await uploadFile(item)
    }
  }
}

async function uploadFile(item) {
  try {
    let taskInfo = await getTaskInfo({
      alarmTypeId: props.alarmTypeId,
      identifier: item.md5
    })

    if (!taskInfo) {
      taskInfo = await initTask({
        identifier: item.md5,
        fileName: item.name,
        totalSize: item.size,
        chunkSize: CHUNK_SIZE,
        alarmTypeId: Number(props.alarmTypeId)
      })
    }

    if (taskInfo.finished) {
      item.progress = 100
      item.status = 'success'
      emit('success')
      return
    }

    item.status = 'uploading'
    const needUploadFile = initSliceFile(item, taskInfo.taskRecord)
    const needUploadSize = needUploadFile.reduce((sum, current) => sum + current.file.size, 0)
    item.uploadedSize = item.size - needUploadSize
    item.progress = Math.floor((item.uploadedSize / item.size) * 100)

    await runLimited(
      needUploadFile.map((chunk) => () => uploadChunkUrl(chunk, item)),
      CONCURRENCY
    )

    await mergeTask({
      alarmTypeId: props.alarmTypeId,
      identifier: item.md5
    })

    item.status = 'success'
    item.progress = 100
    emit('success')
  } catch (error) {
    item.status = 'error'
    ElMessage.error(`${item.name} 上传失败`)
  }
}

function initSliceFile(item, taskRecord = {}) {
  const needUploadFile = []
  const exitPartList = taskRecord.exitPartList || []
  const fileIdentifier = taskRecord.fileIdentifier || item.md5

  item.chunkFileList.forEach((file, index) => {
    const partNumber = index + 1
    if (!exitPartList.some((part) => part.partNumber === partNumber)) {
      needUploadFile.push({ fileIdentifier, partNumber, file })
    }
  })

  return needUploadFile
}

async function uploadChunkUrl(chunkItem, item) {
  const url = await getPreSignUrl({
    alarmTypeId: props.alarmTypeId,
    identifier: chunkItem.fileIdentifier,
    partNumber: chunkItem.partNumber
  })
  if (!url) throw new Error('preSignUrl empty')

  const res = await axios.put(url, chunkItem.file, {
    headers: { 'Content-Type': item.file.type || 'application/octet-stream' }
  })
  if (res.status !== 200) throw new Error('upload failed')

  item.uploadedSize += chunkItem.file.size
  item.progress = Math.min(99, Math.floor((item.uploadedSize / item.size) * 100))
}

function removeFile(index) {
  files.value.splice(index, 1)
}

function stopUpload(index) {
  files.value[index].status = 'error'
}

function handleClose() {
  emit('success')
}

async function cutFile(file, onProgress) {
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE)
  const chunks = []

  for (let index = 0; index < chunkCount; index++) {
    const start = index * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const blob = file.slice(start, end)
    const buffer = await readBlob(blob)
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(buffer)
    chunks.push({
      blob,
      start,
      end,
      index,
      hash: spark.end()
    })
    onProgress?.(Math.floor(((index + 1) / chunkCount) * 100))
  }

  return chunks
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}

function getMerkleRoot(hashList) {
  if (!hashList.length) return ''
  let nodes = hashList.slice()
  while (nodes.length > 1) {
    const next = []
    for (let index = 0; index < nodes.length; index += 2) {
      const left = nodes[index]
      const right = nodes[index + 1]
      next.push(right ? SparkMD5.hash(left + right) : left)
    }
    nodes = next
  }
  return nodes[0]
}

async function runLimited(tasks, limit) {
  const results = []
  const executing = []
  for (const task of tasks) {
    const promise = Promise.resolve().then(task)
    results.push(promise)
    executing.push(promise)
    const clean = () => executing.splice(executing.indexOf(promise), 1)
    promise.then(clean).catch(clean)
    if (executing.length >= limit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(results)
}
</script>

<style scoped>
.upload-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.upload-item:last-child {
  border-bottom: 0;
}

.upload-info {
  flex: 1;
  min-width: 0;
}

.upload-title {
  margin-bottom: 6px;
}

.upload-desc {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>

