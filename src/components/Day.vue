<template>
  <div>
    <button @click="resetSelection">重置</button><br>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="(hour, index) in 24" :key="index">{{ index.toString().padStart(2, '0') }} <!-- 上方时间从00到23显示 --></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, dayIndex) in weekDays" :key="dayIndex">
          <td>{{ day }}</td> <!-- 左侧周几显示 -->
          <td
              v-for="(isSelected, hourIndex) in selectedTimes[dayIndex]"
              :key="`${dayIndex}-${hourIndex}`"
              :class="{ 'selected': isSelected }"
              @mousedown="handleMouseDown(dayIndex, hourIndex, $event)"
              @click="toggleSelection(dayIndex, hourIndex)"
          >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
      return {
          weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          selectedTimes: Array.from({ length: 7 }, () => Array(24).fill(false)),
          dragStart: null,
          dragging: false,
          startDragTimeout: null, // 用于存储 setTimeout 的句柄
          dragListeners: null, // 用于存储事件监听器的对象
          lastCopiedSourceIndex: null // 用于存储最近复制的源行索引
      };
  },
  methods: {
      startDrag(dayIndex, hourIndex, event) {  
        clearTimeout(this.startDragTimeout);  
        this.dragging = true;  
        this.dragStart = { dayIndex, hourIndex };  
        event.preventDefault();   
        document.addEventListener('mousemove', this.onDrag);  
        document.addEventListener('mouseup', this.stopDrag);  
      },  

      stopDrag(event) {  
        clearTimeout(this.startDragTimeout);  
        this.dragging = false;  
        document.removeEventListener('mousemove', this.onDrag);  
        document.removeEventListener('mouseup', this.stopDrag);  
      },  

      handleMouseDown(dayIndex, hourIndex, event) {  
        this.startDragTimeout = setTimeout(() => {  
          this.toggleSelection(dayIndex, hourIndex);  
        }, 1000);  
        this.startDrag(dayIndex, hourIndex, event);  
      },  

      toggleSelection(dayIndex, hourIndex, isDragging = false) {
          // 如果是在拖动模式下，则更新整个拖动区域
          if (isDragging && this.dragging && this.dragStart) {
              const { dayIndex: startDay, hourIndex: startHour } = this.dragStart;
              for (let d = Math.min(startDay, dayIndex); d <= Math.max(startDay, dayIndex); d++) {
                  for (let h = Math.min(startHour, hourIndex); h <= Math.max(startHour, hourIndex); h++) {
                      this.$set(this.selectedTimes[d], h, true);
                  }
              }
          } else {
          // 处理单个点击逻辑,如果当前格子已经被选中，则取消选中；否则，选中它
              const newSelectedTimes = [...this.selectedTimes];
              newSelectedTimes[dayIndex][hourIndex] = !newSelectedTimes[dayIndex][hourIndex];
              this.selectedTimes = newSelectedTimes;

          // 为下一次可能的拖动做准备
              if (!isDragging) {
                  this.dragStart = { dayIndex, hourIndex };
              }
          }
      },

      // 处理拖动时的选中
      onDrag(event) {  
        if (!this.dragging) return;  
        const { dayIndex, hourIndex } = this.getCurrentIndexes(event);  
        // 更新结束位置为当前鼠标位置  
        const endDrag = { dayIndex, hourIndex };  
        this.updateSelectionRange(this.dragStart, endDrag);  
      },  

      updateSelectionRange(start, end) {  
        for (let d = Math.min(start.dayIndex, end.dayIndex); d <= Math.max(start.dayIndex, end.dayIndex); d++) {  
          for (let h = Math.min(start.hourIndex, end.hourIndex); h <= Math.max(start.hourIndex, end.hourIndex); h++) {  
            this.$set(this.selectedTimes[d], h, true);  
          }  
        }  
      }, 

      getCurrentIndexes(event) {  
        const table = this.$el.querySelector('table tbody');  
        const rect = table.getBoundingClientRect();  
        const x = event.clientX - rect.left;  
        const y = event.clientY - rect.top;  
      
        // 假设空白列是第一列，并且它的宽度不同  
        const blankColWidth = table.rows[0].cells[0].offsetWidth; // 获取空白列的宽度  
        const hourCols = 24; // 小时列的数量  
        // 计算小时列的宽度（排除空白列）  
        const hourColWidth = (table.offsetWidth - blankColWidth) / hourCols;  
      
        // 如果点击位置在空白列内，则调整x值以反映相对于小时列的位置  
        let adjustedX = x;  
        if (x < blankColWidth) {  
            return { dayIndex: -1, hourIndex: -1 };  
        } else {  
            // 从x值中减去空白列的宽度  
            adjustedX -= blankColWidth;  
        }  
      
        // 计算点击位置对应的列索引（hourIndex），只考虑小时列  
        const hourIndex = Math.floor(adjustedX / hourColWidth);  
      
        // 计算行索引（dayIndex）  
        const rowHeight = table.rows[0].cells[1].offsetHeight; // 使用第二行的高度（假设第一行是表头）  
        const dayIndex = Math.floor(y / rowHeight);  
      
        // 限制索引在有效范围内  
        return {  
            dayIndex: Math.min(Math.max(0, dayIndex), 6), // 0 到 6 对应周一到周日  
            hourIndex: Math.min(Math.max(0, hourIndex), 23) // 0 到 23 对应0点到23点  
        };  
      },

      resetSelection() {  
        this.selectedTimes = Array.from({ length: 7 }, () => Array(24).fill(false));  
      }, 
  },

  mounted() {  
    // 如果需要在组件挂载时添加额外的逻辑，可以在这里进行  
  },  

  beforeDestroy() {  
    // 清理全局事件监听器  
    clearTimeout(this.startDragTimeout);  
    document.removeEventListener('mousemove', this.onDrag);  
    document.removeEventListener('mouseup', this.stopDrag);  
  }  
}
</script>

<style scoped>
  .selected {
      background-color: #28a745; /* 绿色背景 */
      color: white;
      border: 1px solid #ccc;
      padding: 3px;
      text-align: center;
  }

  /* 表格样式调整 */
  table {
      width: 140%;
      border-collapse: collapse;
  }

  th, td {
      border: 1px solid #ddd;
      padding: 1px;
      text-align: left; /* 左侧列和文字对齐方式 */
      font-size: 14px;
  }

  th {
      background-color: #f2f2f2;
  }
</style>
