<template>
  <div class="rule-timeline">
    <div class="timeline-toolbar">
      <el-button type="danger" link @click="clearAll">全部删除</el-button>
    </div>
    <div class="timeline-table">
      <div v-for="(day, dayIndex) in innerValue" :key="day.day" class="timeline-row">
        <div class="timeline-day">{{ day.day }}</div>
        <div class="timeline-content">
          <el-tag
            v-for="(item, index) in day.timelines"
            :key="`${day.day}-${item.startTime}-${item.endTime}-${index}`"
            closable
            type="success"
            @close="removeTimeline(dayIndex, index)"
          >
            {{ item.startTime }} - {{ item.endTime }}
          </el-tag>
          <el-time-picker
            v-model="drafts[dayIndex]"
            is-range
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            class="time-picker"
          />
          <el-button size="small" type="primary" @click="addTimeline(dayIndex)">添加</el-button>
          <el-button size="small" @click="copyToAll(dayIndex)">复制到全部</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneJson, normalizeTimelines } from '../../utils'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const innerValue = reactive(normalizeTimelines(props.modelValue))
const drafts = reactive(innerValue.map(() => []))

watch(
  () => props.modelValue,
  (value) => {
    const next = normalizeTimelines(value)
    innerValue.splice(0, innerValue.length, ...next)
    drafts.splice(0, drafts.length, ...next.map(() => []))
  },
  { deep: true }
)

function sync() {
  emit('update:modelValue', cloneJson(innerValue))
}

function addTimeline(dayIndex) {
  const draft = drafts[dayIndex]
  if (!Array.isArray(draft) || draft.length !== 2) {
    ElMessage.warning('请选择时间段')
    return
  }
  const [startTime, endTime] = draft
  if (!startTime || !endTime || startTime >= endTime) {
    ElMessage.warning('结束时间必须大于开始时间')
    return
  }
  const timelines = innerValue[dayIndex].timelines
  const overlap = timelines.some((item) => startTime < item.endTime && endTime > item.startTime)
  if (overlap) {
    ElMessage.warning('时间段不能重叠')
    return
  }
  timelines.push({ startTime, endTime })
  timelines.sort((a, b) => a.startTime.localeCompare(b.startTime))
  drafts[dayIndex] = []
  sync()
}

function removeTimeline(dayIndex, index) {
  innerValue[dayIndex].timelines.splice(index, 1)
  sync()
}

function copyToAll(dayIndex) {
  const source = cloneJson(innerValue[dayIndex].timelines)
  innerValue.forEach((item) => {
    item.timelines = cloneJson(source)
  })
  sync()
}

function clearAll() {
  ElMessageBox.confirm('确定删除全部检查时间吗？', '提示', {
    type: 'warning'
  }).then(() => {
    innerValue.forEach((item) => {
      item.timelines = []
    })
    sync()
  }).catch(() => {})
}
</script>

<style scoped>
.rule-timeline {
  width: 100%;
}

.timeline-toolbar {
  margin-bottom: 6px;
}

.timeline-table {
  border: 1px solid var(--el-border-color);
}

.timeline-row {
  display: flex;
  min-height: 44px;
  border-bottom: 1px solid var(--el-border-color);
}

.timeline-row:last-child {
  border-bottom: 0;
}

.timeline-day {
  width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border-right: 1px solid var(--el-border-color);
  flex: 0 0 auto;
}

.timeline-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 6px 8px;
}

.time-picker {
  width: 220px;
}
</style>

