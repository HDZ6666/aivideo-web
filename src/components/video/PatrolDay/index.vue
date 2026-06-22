<template>
  <div class="patrol-day">
    <el-button text type="primary" icon="Refresh" class="reset-btn" @click="resetSelection">重置</el-button>
    <div class="day-table-wrap">
      <table class="day-table">
        <thead>
          <tr>
            <th>星期/时间段</th>
            <th v-for="hour in hours" :key="hour">{{ hour }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, weekday) in weekDays" :key="day">
            <td>{{ day }}</td>
            <td
              v-for="hour in hours"
              :key="`${weekday}-${hour}`"
              :class="{ selected: selectedTimes[weekday][hour] }"
              @mousedown.prevent="startDrag(weekday, hour)"
              @mouseenter="dragSelect(weekday, hour)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits(['selected-hours-changed'])

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const hours = Array.from({ length: 24 }, (_, index) => index)
const selectedTimes = ref(createEmptyTimes())
const dragging = ref(false)
const dragStart = ref(null)
const dragState = ref(true)

function createEmptyTimes() {
  return Array.from({ length: 7 }, () => Array(24).fill(false))
}

function startDrag(weekday, hour) {
  dragging.value = true
  dragStart.value = { weekday, hour }
  dragState.value = !selectedTimes.value[weekday][hour]
  applyRange(dragStart.value, dragStart.value, dragState.value)
  document.addEventListener('mouseup', stopDrag, { once: true })
}

function dragSelect(weekday, hour) {
  if (!dragging.value || !dragStart.value) return
  applyRange(dragStart.value, { weekday, hour }, dragState.value)
}

function stopDrag() {
  dragging.value = false
  dragStart.value = null
  emitSelectedHours()
}

function applyRange(start, end, value) {
  const startDay = Math.min(start.weekday, end.weekday)
  const endDay = Math.max(start.weekday, end.weekday)
  const startHour = Math.min(start.hour, end.hour)
  const endHour = Math.max(start.hour, end.hour)

  for (let day = startDay; day <= endDay; day++) {
    for (let hour = startHour; hour <= endHour; hour++) {
      selectedTimes.value[day][hour] = value
    }
  }
}

function getSelectedHours() {
  const result = []
  selectedTimes.value.forEach((dayHours, dayIndex) => {
    const values = dayHours
      .map((selected, hour) => (selected ? hour : null))
      .filter((hour) => hour !== null)

    if (values.length) {
      result.push({
        weekday: dayIndex + 1,
        hours: values.join(',')
      })
    }
  })
  return result.length ? result : []
}

function emitSelectedHours() {
  emit('selected-hours-changed', getSelectedHours())
}

function resetSelection() {
  selectedTimes.value = createEmptyTimes()
  emitSelectedHours()
}

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', stopDrag)
})

defineExpose({
  resetSelection,
  getSelectedHours
})
</script>

<style scoped>
.patrol-day {
  width: 100%;
}

.reset-btn {
  margin-bottom: 6px;
}

.day-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.day-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  table-layout: fixed;
}

.day-table th,
.day-table td {
  height: 24px;
  border: 1px solid #dcdfe6;
  text-align: center;
  font-size: 12px;
  background: #f5f7fa;
  user-select: none;
}

.day-table th:first-child,
.day-table td:first-child {
  width: 86px;
  background: #fff;
}

.day-table td:not(:first-child) {
  cursor: pointer;
}

.day-table td.selected {
  background: var(--el-color-primary);
}
</style>
