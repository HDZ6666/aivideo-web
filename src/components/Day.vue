<template>  
  <div>  
    <table>  
      <thead>  
        <tr>  
          <th></th> <!-- 左侧空白列，用于对齐 -->  
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
          <!-- <td class="copy-button-cell">  
            <button @click="copySelection(dayIndex)">复制</button>
            <button @click="pasteSelection(dayIndex)">粘贴</button>  
          </td>   -->
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
          dragListeners: null, // 用于存储事件监听器的对象
          lastCopiedSourceIndex: null // 用于存储最近复制的源行索引    
      };  
  },  
  methods: {  
      startDrag(dayIndex, hourIndex, event) {  
        this.dragging = true;  
        this.dragStart = { dayIndex, hourIndex };  
  
        // 阻止默认行为  
        event.preventDefault();  
  
        // 添加事件监听器，但不使用 once: true  
        this.dragListeners = {  
            mousemove: this.onDrag.bind(this),  
            mouseup: this.stopDrag.bind(this),  
            mouseleave: this.stopDrag.bind(this)  
        };  
  
        Object.keys(this.dragListeners).forEach(eventType => {  
            document.addEventListener(eventType, this.dragListeners[eventType]);  
        });  
      },  
  
      stopDrag(event) {  
        this.dragging = false;  
  
        // 移除事件监听器  
        Object.keys(this.dragListeners).forEach(eventType => {  
            document.removeEventListener(eventType, this.dragListeners[eventType]);  
        });  
  
        // 清理 dragListeners 对象  
        this.dragListeners = null;  
  
        // 阻止冒泡到更高层级的元素  
        event.stopPropagation();  
      },  
      
      handleMouseDown(dayIndex, hourIndex, event) {  
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
          this.simulateDragSelection(dayIndex, hourIndex);  
      } ,

      simulateDragSelection(dayIndex, hourIndex) {  
          const { dayIndex: startDay, hourIndex: startHour } = this.dragStart;  
          for (let d = Math.min(startDay, dayIndex); d <= Math.max(startDay, dayIndex); d++) {  
              for (let h = Math.min(startHour, hourIndex); h <= Math.max(startHour, hourIndex); h++) {  
                  this.$set(this.selectedTimes[d], h, true);  
              }  
          }  
      },  

      getCurrentIndexes(event) {  
          const table = this.$el.querySelector('table');  
          const rect = table.getBoundingClientRect();  
          const x = event.clientX - rect.left;  
          const y = event.clientY - rect.top;  
      
          const cols = table.querySelectorAll('th, td').length / 7; // 一周7天，计算每列宽度  
          const rowHeight = table.rows[0].cells[0].offsetHeight; // 所有行高相等  
          const dayIndex = Math.floor(y / rowHeight);  
          const hourIndex = Math.floor(x / (table.offsetWidth / cols));  
      
          return {  
              dayIndex: Math.min(Math.max(0, dayIndex), 6), // 限制在0到6之间  
              hourIndex: Math.min(Math.max(0, hourIndex), 23) // 限制在0到23之间  
          };  
      },

      // // 复制指定行的选中状态，并更新 lastCopiedSourceIndex  
      // copySelection(sourceDayIndex) {  
      //   this.lastCopiedSourceIndex = sourceDayIndex; // 更新最近复制的源行索引  
      // },  
    
      // // 将最近复制的源行的选中状态粘贴到目标行  
      // pasteSelection(targetDayIndex) {  
      //   // 检查 lastCopiedSourceIndex 是否有效  
      //   if (this.lastCopiedSourceIndex === null || this.lastCopiedSourceIndex === undefined ||  
      //       this.lastCopiedSourceIndex < 0 || this.lastCopiedSourceIndex >= this.selectedTimes.length ||  
      //       targetDayIndex < 0 || targetDayIndex >= this.selectedTimes.length) {  
      //     console.error('Invalid source or target day index');  
      //     return;  
      //   }     
      //   // 将源行的选中状态复制到目标行  
      //   this.selectedTimes[targetDayIndex] = [...this.selectedTimes[this.lastCopiedSourceIndex]];  
 
      // }
  }
}
</script>  
  
<style scoped>  
  .selected {  
      background-color: #28a745; /* 绿色背景 */  
      color: white; 
      border: 1px solid #ccc;  
      padding: 5px;  
      text-align: center; 
  }  
      
  /* 表格样式调整 */  
  table {  
      width: 140%;  
      height:120%;  
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