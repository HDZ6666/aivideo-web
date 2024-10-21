<template> 
    <div class="app"> 
        <div class="filter-container"> 
            <!-- 日期筛选 --> 
            <el-date-picker 
                v-model="filterDate" 
                type="date" 
                placeholder="选择日期" 
                @change="applyFilter" 
            ></el-date-picker> 

            <!-- 路线名称筛选 --> 
            <el-input 
                v-model="filterRoutename" 
                placeholder="输入路线名称" 
                @input="applyFilter" 
            ></el-input> 

            <!-- 执行状态筛选 --> 
            <el-select 
                v-model="filterExcuteStatus" 
                placeholder="选择执行状态" 
                @change="applyFilter" 
            > 
                <el-option 
                    v-for="status in excuteStatuses" 
                    :key="status" 
                    :label="status" 
                    :value="status" 
                ></el-option> 
            </el-select> 

            <!-- 是否异常筛选 --> 
            <el-select 
                v-model="filterAbnormality" 
                placeholder="选择是否异常" 
                @change="applyFilter" 
            > 
                <el-option 
                    v-for="status in excuteAbnormality" 
                    :key="status" 
                    :label="status" 
                    :value="status" 
                ></el-option> 
            </el-select> 

            <!-- 按钮 --> 
            <el-button type="primary" @click="applyFilter">筛选</el-button>
            <el-button type="primary" @click="resetFilter">重置</el-button>
            <el-button type="primary" @click="exportReportList">导出</el-button>
        </div> 

        <div class="table-container"> 
            <el-table
                :data="paginatedreportList"
                style="font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */ "
                header-row-class-name="table-header"
            >
                <el-table-column prop="reportID" label="报告编号" width=150 align="center"></el-table-column>
                <el-table-column prop="routename" label="路线名称" width="250" align="center"></el-table-column >
                <el-table-column prop="excuteStatus" label="执行状态" width="250" align="center"></el-table-column>
                <el-table-column prop="excuteTime" label="执行时间" width="250" align="center"></el-table-column>
                <el-table-column prop="abnormality" label="是否异常" width="220" align="center"></el-table-column>
                <el-table-column label="巡逻报告" width="250" align="center">
                    <template slot-scope="scope">
                    <div v-if="scope.row.excuteStatus === '巡逻成功'">
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-document" type="text" @click="viewReport(scope.row)">查看报告</el-button>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float: right"
                @size-change="handleSizeChange_report"
                @current-change="handleCurrentChange_report"
                :current-page="currentPage_report"
                :page-size="count_report"
                :page-sizes="[15, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="reportList.length"
            ></el-pagination>
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        </div> 

        <showReport ref="showReport"></showReport> 
    </div> 
</template> 
        
<script> 
import { reactive, ref,onMounted } from 'vue'; 
import axios from 'axios';
import { Pagination } from 'element-ui'; 
import showReport from "./dialog/showReport.vue"; 
    
export default { 
    name: 'patrolReport', 
    components: {
        'el-pagination': Pagination,
        showReport
    },
    
    setup() {
    const reportList = ref([]);
    const routeName = ref('');
    const selectedCameras = ref('');
    const paginatedreportList = ref([]); 
    const currentPage_report = ref(1);
    const count_report = ref(15);
    const total_report = ref(0);

    return {routeName, selectedCameras, reportList, paginatedreportList, currentPage_report, count_report, total_report }; 
    }, 

    data() { 
    return { 
        filterDate: '', 
        filterRoutename: '', 
        filterExcuteStatus: '', 
        filterAbnormality: '', 
        excuteStatuses: [ '巡逻成功', '巡逻失败'], 
        excuteAbnormality: ['有告警', '无告警'], 
        // 设置样例数据  
        reportList: [ 
        { reportID:1, routename: '路线1', selectedCameras: '摄像头1,摄像头2', excuteStatus: '巡逻成功', excuteTime: '2023-04-03 10:00', abnormality: '有告警' }, 
        { reportID:2, routename: '路线2', selectedCameras: '摄像头1,摄像头3,摄像头4', excuteStatus: '巡逻失败', excuteTime: '2023-04-02 09:00', abnormality: '巡逻失败' }, 
        { reportID:3, routename: '路线3', selectedCameras: '摄像头5,摄像头6', excuteStatus: '巡逻成功', excuteTime: '2023-04-01 12:00', abnormality: '无告警' }, 
        ], 
    }; 
    }, 

    methods: { 
    // 应用筛选条件
        applyFilter() { 
            // 根据筛选条件过滤数据 
            const filteredList = this.reportList.filter(report => { 
            const dateMatch = !this.filterDate || new Date(report.excuteTime).toDateString() === new Date(this.filterDate).toDateString(); 
            const routenameMatch = !this.filterRoutename || report.routename.toLowerCase().includes(this.filterRoutename.toLowerCase()); 
            const excuteStatusMatch = !this.filterExcuteStatus || report.excuteStatus === this.filterExcuteStatus; 
            const abnormalityMatch = !this.filterAbnormality || report.abnormality === this.filterAbnormality; 
            return dateMatch && routenameMatch && excuteStatusMatch && abnormalityMatch; 
            }); 
            // 更新分页后的数据 
            this.fetchData(filteredList); 
        }, 

        // 加载数据
        fetchData(filteredList = this.reportList) { 
            // 使用当前页码和每页数量来计算分页后的数据 
            const start_report = (this.currentPage_report - 1) * this.count_report; 
            const end_report = this.currentPage_report * this.count_report; 
            this.paginatedreportList = filteredList.slice(start_report, end_report); 
            this.total_report = filteredList.length; // 更新总记录数以反映筛选后的数量 
        }, 

        // 重置筛选条件
        resetFilter() { 
            this.filterDate = ''; 
            this.filterRoutename = ''; 
            this.filterExcuteStatus = ''; 
            this.filterAbnormality = ''; 
            this.fetchData(); 
        },
        
        // 导出报告列表
        exportReportList() {
            const url = '/api/exportPatrolReport';//假设接口地址为/api/exportPatrolReport
            const params = {    
                filterDate: this.filterDate,
                filterRoutename: this.filterRoutename,
                filterExcuteStatus: this.filterExcuteStatus,
                filterAbnormality: this.filterAbnormality,
            };
            axios.get(url, { params: params, responseType: 'blob' })
               .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '巡逻报告列表.xls');
                    document.body.appendChild(link);
                    link.click();
                })
               .catch(error => {
                    console.log(error);
                });
        },

        //查看报告
        viewReport: function(row) {
            this.$refs.showReport.openDialog(row);
        },

        // 处理分页 
        handleSizeChange_report(newSize) { 
            this.count_report = newSize; 
            this.fetchData(); 
        }, 
        handleCurrentChange_report(newPage) { 
            this.currentPage_report = newPage; 
            this.fetchData(); 
        }, 
        fetchData() { 
            // 这里用静态数据代替,正常情况下发送一个请求到服务器，根据currentPage和count来获取数据 
            // 例如：axios.get('/api/tasks', { params: { page: this.currentPage, limit: this.count } }) 
        
            // 使用当前页码和每页数量来计算分页后的数据 
            const start_report = (this.currentPage_report - 1) * this.count_report; 
            const end_report = this.currentPage_report * this.count_report; 
            this.paginatedreportList = this.reportList.slice(start_report, end_report); 
        }, 
    },

    mounted() {
        this.fetchData();  
    },  
}; 
</script> 

<style scoped>  
body, html {  
    margin: 0;  
    padding: 0;  
    width: 100%;  
    height: 100%;  
    font-family: Arial, sans-serif; /* 设置统一的字体 */  
} 

.app { 
    display: flex; 
    flex-direction: column; 
    height: 100vh; /* 使用视口高度 */ 
    width: 100%; /* 使用视口宽度 */ 
} 

.filter-container {  
    display: flex;  
    align-items: center; /* 垂直居中 */  
    gap: 10px; /* 组件之间的间距 */  
    margin-top: 10px;   
}  

.filter-item {  
    flex: 1; /* 使每个子元素尽可能平均分配空间 */  
    min-width: 150px; /* 设置最小宽度以防止内容溢出 */  
}  

.el-date-picker, .el-input, .el-select {  
    width: 100%; /* 使子元素填满其父容器的宽度 */  
    box-sizing: border-box; /* 包括内边距和边框在内计算元素的总宽度和高度 */  
} 

.el-button  {   
    width: 150px; 
} 

.table-container {  
    flex: 1; /* 占据剩余空间 */ 
    margin-top: 10px;
    padding: 10px;  
    background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
    border-radius: 8px; /* 圆角边框 */  
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
    overflow-y: auto; /* 允许垂直滚动，如果内容超出容器高度 */ 
}  
</style>
    
      
    