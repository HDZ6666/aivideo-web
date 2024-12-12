<template>
  <div>
    <button class="btn-primary" @click="resetSelection" style="float: left;">重置</button><br>
    <table>
      <thead>
        <tr>
          <th>星期/时间段</th>
          <th v-for="(hour, index) in 24" :key="index">{{ index.toString() }} <!-- 上方时间从00到23显示 --></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, weekday) in weekDays" :key="weekday">
          <td>{{ day }}</td> <!-- 左侧周几显示 -->
          <td
              v-for="(isSelected, hours) in selectedTimes[weekday]"
              :key="`${weekday}-${hours}`"
              :class="{ 'selected': isSelected }"
              @mousedown="handleMouseDown(weekday, hours, $event)"
              @click="toggleSelection(weekday, hours)"
          >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { emit } from 'node-notifier';

export default {
  data() {
      return {
          weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          selectedTimes: Array.from({ length: 7 }, () => Array(24).fill(false)),// 选中时间数组，默认全为false
          dragStart: null,// 用于存储鼠标按下时的位置
          dragging: false,// 用于标记是否处于拖动状态
          startDragTimeout: null, // 用于存储 setTimeout 的句柄
          dragListeners: null, // 用于存储事件监听器的对象
          lastCopiedSourceIndex: null // 用于存储最近复制的源行索引
      };
  },
  methods: {
      // 处理鼠标按下事件
      startDrag(weekday, hours, event) {  
        clearTimeout(this.startDragTimeout);  
        this.dragging = true;  
        this.dragStart = { weekday, hours };  
        event.preventDefault();   
        document.addEventListener('mousemove', this.onDrag);  
        document.addEventListener('mouseup', this.stopDrag); 
      },  
      // 处理鼠标移动事件
      stopDrag(event) {  
        clearTimeout(this.startDragTimeout);  
        this.dragging = false;  
        document.removeEventListener('mousemove', this.onDrag);  
        document.removeEventListener('mouseup', this.stopDrag);  
         // 调用 selected_hours 方法并传递结果给父组件  
        const selectedHours = this.selected_hours();  
        this.$emit('selected-hours-changed', selectedHours);  
      },  
      // 处理鼠标松开事件
      handleMouseDown(weekday, hours, event) {  
        this.startDragTimeout = setTimeout(() => {  
          this.toggleSelection(weekday, hours);  
        }, 1000);  
        this.startDrag(weekday, hours, event);  
      },  
      // 处理点击事件
      toggleSelection(weekday, hours, isDragging = false) {
          // 如果是在拖动模式下，则更新整个拖动区域
          if (isDragging && this.dragging && this.dragStart) {
              const { weekday: startDay, hours: startHour } = this.dragStart;
              for (let d = Math.min(startDay, weekday); d <= Math.max(startDay, weekday); d++) {
                  for (let h = Math.min(startHour, hours); h <= Math.max(startHour, hours); h++) {
                      this.$set(this.selectedTimes[d], h, true);
                  }
              }
          } else {
          // 处理单个点击逻辑,如果当前格子已经被选中，则取消选中；否则，选中它
              const newSelectedTimes = [...this.selectedTimes];
              newSelectedTimes[weekday][hours] = !newSelectedTimes[weekday][hours];
              this.selectedTimes = newSelectedTimes;
              const selectedHours = this.selected_hours();  
              this.$emit('selected-hours-changed', selectedHours);  

          // 为下一次可能的拖动做准备
              if (!isDragging) {
                  this.dragStart = { weekday, hours };
              }
          }
      },

      // 处理拖动时的选中
      onDrag(event) {  
        if (!this.dragging) return;  
        const { weekday, hours } = this.getCurrentIndexes(event);  
        // 更新结束位置为当前鼠标位置  
        const endDrag = { weekday, hours };  
        this.updateSelectionRange(this.dragStart, endDrag);  
      },  
      // 计算拖动区域的起始和结束位置  
      updateSelectionRange(start, end) {  
        for (let d = Math.min(start.weekday, end.weekday); d <= Math.max(start.weekday, end.weekday); d++) {  
          for (let h = Math.min(start.hours, end.hours); h <= Math.max(start.hours, end.hours); h++) {  
            this.$set(this.selectedTimes[d], h, true);  
          }  
        }  
      }, 
      // 计算当前鼠标位置对应的小时索引和周几索引
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
            return { weekday: -1, hours: -1 };  
        } else {  
            // 从x值中减去空白列的宽度  
            adjustedX -= blankColWidth;  
        }  
      
        // 计算点击位置对应的列索引（hours），只考虑小时列  
        const hours = Math.floor(adjustedX / hourColWidth);  
      
        // 计算行索引（weekday）  
        const rowHeight = table.rows[0].cells[1].offsetHeight; // 使用第二行的高度（假设第一行是表头）  
        const weekday = Math.floor(y / rowHeight);  
        // 限制索引在有效范围内  
        return {  
          weekday: Math.min(Math.max(0, weekday), 6), // 0 到 6 对应周一到周日  
            hours: Math.min(Math.max(0, hours), 23) // 0 到 23 对应0点到23点  
        };  
      },
      // 将选中时间数组转换为json对象
      selected_hours() {  
        const selectedTimesMap = {}; // 使用一个对象来跟踪每个周几被选中的小时  
        for (let i = 0; i < 7; i++) {  
            selectedTimesMap[i] = []; // 初始化每个周几的小时数组  
            for (let j = 0; j < 24; j++) {  
                if (this.selectedTimes[i][j]) {  
                    selectedTimesMap[i].push(j); // 将被选中的小时添加到对应周几的数组中  
                }  
            }  
            
            // 如果该周几有被选中的小时，则将其转换为逗号分隔的字符串  
            if (selectedTimesMap[i].length > 0) {  
                selectedTimesMap[i] = selectedTimesMap[i].join(',');  
            } else {  
                // 如果没有被选中的小时，可以选择删除该属性或保留为空数组（这里选择删除）  
                delete selectedTimesMap[i];  
            }  
        } 
        
        // 创建一个最终的对象数组，只包含有选中小时的周几  
        const finalSelectedHours = [];  
        for (const [weekdayIndex, hoursString] of Object.entries(selectedTimesMap)) {  
            finalSelectedHours.push({  
                weekday: parseInt(weekdayIndex, 10)+1, 
                hours: hoursString   
            });  
        }     
        console.log("finalSelectedHours", finalSelectedHours);  
      
        // 如果没有任何小时被选中，则返回一个空数组（或空对象，根据您的需求）  
        return finalSelectedHours.length > 0 ? finalSelectedHours : {};  
      },

      // 重置选中状态
      resetSelection() {  
        this.selectedTimes = Array.from({ length: 7 }, () => Array(24).fill(false));  
      }, 
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
      background-color: #007bff; /* 绿色背景 */
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
      border: 1px solid #d2d2d2;
      padding: 1px;
      text-align: left; 
      font-size: 14px;
      background-color: #f2f2f2; 
  }

  th, td:first-child {
    background-color: #fff;
    text-align: center; 
    width: 80px; 
    min-width: 80px;
    max-width: 80px; 
  }

  th:not(:first-child) {
    width: 27px;
    min-width: 27px;
    max-width: 27px;
  }

  th {
      background-color: #fff;
  }

  .btn-primary {
    color: #007bff;
    background-color: #fff;
    border-color: #f2f2f2;
  }

</style>
