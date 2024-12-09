<template> 
    <div class="app"> 
        <div class="container"> 
            <div class="filter-container"> 
                <!-- 日期筛选 --> 
                <el-date-picker 
                    v-model="filterDate" 
                    type="date" 
                    placeholder="选择日期" 
                ></el-date-picker> 

                <!-- 路线名称筛选 --> 
                <el-input 
                    v-model="filterTaskName" 
                    placeholder="输入任务名称" 
                ></el-input> 

                <!-- 摄像头名称筛选 --> 
                <el-input 
                    v-model="filterSelectedCameras" 
                    placeholder="输入摄像头名称" 
                ></el-input> 

                <!-- 是否异常筛选 --> 
                <el-select 
                    v-model="filterAbnormality" 
                    placeholder="选择是否异常" 
                > 
                    <el-option 
                        v-for="status in uniqueAbnormalities" 
                        :key="status" 
                        :label="status" 
                        :value="status" 
                    ></el-option> 
                </el-select> 

                <!-- 按钮 --> 
                <el-button class="btn-search" type="primary" @click="applyFilter">查询</el-button>
                <el-button class="btn-reset" type="primary" @click="resetFilter">重置</el-button>
                <el-button class="btn-reset" type="primary" @click="exportList">导出</el-button>
            </div> 

            <div class="table-container"> 
                <el-table
                    :data="paginatedreportList"
                    style="font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */ "
                    :header-cell-style="headerCellStyle"
                >
                    <el-table-column prop="reportId" label="报告编号" width=80 align="center"></el-table-column>
                    <el-table-column prop="taskName" label="任务名称" width="120" align="center"></el-table-column >
                    <el-table-column prop="selectedCameras" label="选择的摄像头" width="300" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="执行时间" width="200" align="center"></el-table-column>
                    <el-table-column prop="abnormality" label="是否异常" width="100" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.abnormality === '是'" style="color: red">异常</span>
                            <span v-else>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="巡逻报告" width="380" align="center">
                        <template slot-scope="scope">
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-document" type="text" @click="viewReport(scope.row)">查看报告</el-button>
                            <el-button size="medium" icon="el-icon-download" type="text" @click="exportReport(scope.row)">导出报告</el-button>
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
                    :total="total_report"
                ></el-pagination>
            </div> 
        </div> 
        <showReport ref="showReport"></showReport> 
    </div> 
</template> 
        
<script> 
import { ref,onMounted } from 'vue'; 
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
        const reportId = ref('');
        const createTime = ref('');
        const abnormality = ref('');
        const taskName = ref('');
        const selectedCameras = ref('');
        const paginatedreportList = ref([]); 
        const currentPage_report = ref(1);
        const count_report = ref(15);
        const total_report = ref(0);
        const uniqueAbnormalities = ref([]);
        const filterDate = ref('');
        const filterTaskName = ref('');
        const filterSelectedCameras = ref('');
        const filterAbnormality = ref('');

        // 根据abnormalityStr去重获取异常状态列表
        const getAbnormalityList = () => {
            axios.get('/api/patrol/report/list')  
            .then(res => {  
                const abnormalityList = res.data.data.list.map(item => item.abnormalityStr);  
                uniqueAbnormalities.value = [...new Set(abnormalityList)];  
            })  
            .catch(err => {  
                console.log(err);  
            }); 
        };

        // 应用筛选条件
        const applyFilter = () => {  
            // 根据筛选条件过滤数据 
            const filteredList = reportList.value.filter(report => { 
                const dateMatch = !filterDate || new Date(report.createTime.split(' ')[0]).toDateString() === new Date(filterDate).toDateString(); 
                const taskNameMatch = !filterTaskName || report.taskName.toLowerCase().includes(filterTaskName.toLowerCase()); 
                const selectedCamerasMatch = !filterSelectedCameras || report.selectedCameras.toLowerCase().includes(filterSelectedCameras.toLowerCase()); 
                const abnormalityMatch = !filterAbnormality || report.abnormality === filterAbnormality; 
                return dateMatch && taskNameMatch && selectedCamerasMatch && abnormalityMatch; 
            }); 
            // 更新分页后的数据 
            paginatedreportList.value = filteredList; 
        };  

        // 重置筛选条件
        const resetFilter = () => {  
            filterDate.value = '';  
            filterTaskName.value = '';  
            filterSelectedCameras.value = '';  
            filterAbnormality.value = '';  
            applyFilter();  
        };  

        // 根据前端筛选条件直接导出报告列表，不需要分页
        const exportList = () => {
            const filteredList = reportList.value.filter(report => { 
                const dateMatch = !filterDate || new Date(report.createTime.split(' ')[0]).toDateString() === new Date(filterDate).toDateString(); 
                const taskNameMatch = !filterTaskName || report.taskName.toLowerCase().includes(filterTaskName.toLowerCase()); 
                const selectedCamerasMatch = !filterSelectedCameras || report.selectedCameras.toLowerCase().includes(filterSelectedCameras.toLowerCase()); 
                const abnormalityMatch = !filterAbnormality || report.abnormality === filterAbnormality; 
                return dateMatch && taskNameMatch && selectedCamerasMatch && abnormalityMatch; 
            });
            // 将过滤后的报告列表转换为 CSV 内容  
            const csvContent = reportListToCsv(filteredList);  
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });  
            const url = URL.createObjectURL(blob);  
            // 生成包含当前时间的文件名  
            const currentTime = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_'); // 格式化为 YYYY-MM-DD_HH-MM-SS  
            const downloadFileName = `reportList_${currentTime}.csv`;  
            // 创建下载链接并触发下载
            const link = document.createElement("a");  
            link.href = url;  
            link.download = downloadFileName;  
            document.body.appendChild(link);  
            link.click();  
            document.body.removeChild(link);  
        };  
        // 报告列表转换为 CSV 内容  
        const reportListToCsv = (reportList) => {  
            const header = ['报告编号', '任务名称', '选择的摄像头', '执行时间', '是否异常', '巡逻报告'];  
            const rows = reportList.map(report => {  
                const detailList = report.detailList.map(detail => {  
                    return [detail.cameraName, detail.startTime, detail.endTime, detail.duration, detail.status];  
                });  
                const detailCsv = detailList.map(detail => detail.join(',')).join('\n');  
                return [report.reportId, report.taskName, report.selectedCameras, report.createTime, report.abnormalityStr, detailCsv];  
            });  
            const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');  
            return csvContent;  
        };

        // 获取报告列表  
        const getReportList = () => {  
            axios.get('/api/patrol/report/list', {  
                params: {  
                    page: currentPage_report.value,  
                    count: count_report.value,  
                }  
            })  
            .then(res => {  
                reportList.value = res.data.data.list;  
                total_report.value = res.data.data.total;  
                paginatedreportList.value = reportList.value.map(item => {  
                    return {  
                        reportId: item.reportId, 
                        taskName: item.taskName, 
                        selectedCameras: item.selectedCameras, 
                        createTime: item.createTime, 
                        abnormality: item.abnormalityStr,
                        detailList: item.detailList,
                    };  
                });  
            })  
            .catch(err => {  
                console.log(err);  
            }); 
        };  

        // 处理分页
        const handleSizeChange_report = (size) => {  
            count_report.value = size;  
            getReportList();  
        };  
        const handleCurrentChange_report = (page) => {  
            currentPage_report.value = page;  
            getReportList();  
        };

        // 查看报告
        const viewReport = (row) => {
            this.$refs.showReport.openDialog(row); 
        };

        // 根据reportId通过`/api/patrol/report/download`获取url下载报告
        async function exportReport (row) {
            try {
                const response = await axios ({
                    method: 'GET',
                    url: `/api/patrol/report/download`,
                    params: {
                        reportId: row.reportId
                    },
                });

                if (response.data && response.data.code === 0) {
                    const downloadUrl = response.data.data;
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `巡逻报告_${row.reportId}.docx`; 
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    console.log('下载失败');
                }
            } catch (error) {
                console.log(error);
            }
        };

        // 表头样式
        const headerCellStyle = {
            backgroundColor: '#f5f7f9',
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#303133',
        };
        
        // 初始化
        onMounted(() => {  
            getReportList();
            getAbnormalityList(); 
        }); 

        return {
            reportId, 
            taskName, 
            createTime, 
            abnormality, 
            selectedCameras, 
            reportList, 
            getReportList, 
            paginatedreportList, 
            currentPage_report, 
            count_report, 
            total_report, 
            handleSizeChange_report, 
            handleCurrentChange_report,
            getAbnormalityList,
            uniqueAbnormalities,
            filterDate,
            filterTaskName,
            filterSelectedCameras,
            filterAbnormality,
            applyFilter,
            resetFilter,
            exportList,
            viewReport,
            reportListToCsv,
            exportReport,
            headerCellStyle,
        }; 
    }, 

    methods: { 
        //查看报告
        viewReport(row) {
            this.$refs.showReport.openDialog(row);
        },
    },
}; 
</script> 

<style scoped>  
.app, .container {  
    margin: 0;  
    padding: 0; 
    width: 100%;
    height: 100%; /* 确保所有父元素都占据视口高度 */  
    box-sizing: border-box; 
}  

.filter-container {  
    display: flex; /* 使用行方向布局 */  
    justify-content: space-between; /* 两端对齐子元素 */  
    padding: 1vw; /* 添加一些内边距，使用视口单位 */  
    box-sizing: border-box; /* 包括内边距和边框在内计算宽度 */  
    width: 100%; /* 使容器宽度为父容器宽度 */  
    background-color: #f5f7fa; /* 可选：添加背景色 */  
}  
  
.filter-item {  
    flex: 1; /* 使每个子元素尽可能平均分配空间 */  
}  
  
.el-date-picker, .el-input, .el-select {  
    width: calc(100% - 2vw); /* 减去左右内边距，确保内容区域不会超出父容器宽度 */  
    box-sizing: border-box; /* 包括内边距和边框在内计算元素的总宽度和高度 */  
}  

.btn-search {  
    margin-left: 1vw; /* 左侧外边距 */  
    font-size: 13px;
    padding: 10px 20px; /* 按钮内边距 */  
    border: none; /* 去除边框 */  
    border-radius: 4px; /* 圆角边框 */ 
    background-color: #409eff; /* 按钮背景色 */ 
    color: white; /* 按钮字体颜色 */  
    cursor: pointer; /* 鼠标悬停时显示指针 */ 
}  

.btn-reset {  
    font-size: 13px;
    padding: 10px 20px; /* 按钮内边距 */  
    border: none; /* 去除边框 */  
    border-radius: 4px; /* 圆角边框 */ 
    background-color: white; /* 按钮背景色 */ 
    color: black; /* 按钮字体颜色 */  
    cursor: pointer; /* 鼠标悬停时显示指针 */   
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.04);
}
  
.table-container {  
    position: relative;  
    height: 580px; /* 设置表格容器高度 */  
    padding: 1vw; /* 使用视口单位设置内边距 */  
    background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
    box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1); /* 使用视口单位设置阴影效果 */  
    overflow-y: auto; /* 允许垂直滚动，如果内容超出容器高度 */   
}  
</style>
      
    