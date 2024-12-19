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
                        v-for="item in uniqueAbnormalities" 
                        :key="item" 
                        :label="item" 
                        :value="item" 
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
                    <el-table-column prop="reportId" label="报告编号" width=90 align="center"></el-table-column>
                    <el-table-column prop="taskName" label="任务名称" width="160" align="center"></el-table-column >
                    <el-table-column prop="selectedCameras" label="选择的摄像头" width="200" align="center" v-slot:default="scope">
                        <template>
                            <div style="display: flex;align-items: center;color:#409eff;">
                                <el-button type="text" size="mini" @click="toggleCameras(scope.$index)">
                                    <i :class="scope.row.showAllCameras ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                </el-button>
                                <div v-if="scope.row.showAllCameras">
                                    <div v-for="(camera, index) in scope.row.selectedCamerasArray" :key="index">
                                        {{ camera.cameraId }}
                                    </div>
                                </div>
                                <div v-else>
                                    {{ getFirstCamera(scope.row.selectedCameras) }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="报告生成时间" width="200" align="center"></el-table-column>
                    <el-table-column prop="reportStatusStr" label="报告状态" width="150" align="center"></el-table-column>
                    <el-table-column prop="abnormalityStr" label="是否异常" width="80" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.abnormalityStr === '异常'" style="color: red">异常</span>
                            <span v-else>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="巡逻报告" width="300" align="center">
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
        const abnormalityStr = ref('');
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

        // 按照“正常”和“异常”筛选
        const abnormalityOptions = ['正常', '异常'];
        uniqueAbnormalities.value = abnormalityOptions;
        
        // 处理filterDate为日期格式
        const handleFilterDate = (date) => {
            if (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            return '';
        };
        // 应用筛选条件
       const applyFilter = () => {
            // 根据筛选条件过滤数据
            const filteredList = reportList.value.filter(report => { 
                const dateMatch = !filterDate.value || report.createTime.split(' ')[0] === handleFilterDate(filterDate.value);          
                const taskNameMatch = !filterTaskName.value || report.taskName.toLowerCase().includes(filterTaskName.value.toLowerCase());      
                const selectedCamerasMatch = !filterSelectedCameras.value || report.selectedCameras.toLowerCase().includes(filterSelectedCameras.value.toLowerCase());      
                const abnormalityMatch = !filterAbnormality.value || report.abnormalityStr === filterAbnormality.value;     
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
                const dateMatch = !filterDate.value || report.createTime.split(' ')[0] === handleFilterDate(filterDate.value);          
                const taskNameMatch = !filterTaskName.value || report.taskName.toLowerCase().includes(filterTaskName.value.toLowerCase());      
                const selectedCamerasMatch = !filterSelectedCameras.value || report.selectedCameras.toLowerCase().includes(filterSelectedCameras.value.toLowerCase());      
                const abnormalityMatch = !filterAbnormality.value || report.abnormality === filterAbnormality.value;     
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
            URL.revokeObjectURL(url); // 清理对象URL
        };  
        // 报告列表转换为 CSV 内容  
        const reportListToCsv = (reportList) => {  
            const header = ['报告编号', '任务名称', '选择的摄像头', '报告生成时间', '是否异常'];  
            const escapeCsvValue = (value) => {
                // 如果字段值包含逗号、换行符或引号，则需要用双引号包围，并转义内部的双引号
                if (/[,"\n]/.test(value)) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            };
            const rows = reportList.map(report => {  
                return [report.reportId, report.taskName, escapeCsvValue(report.selectedCameras), report.createTime, report.abnormalityStr];  
            });  
            const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');  
            console.log(csvContent);
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
                     // 拆分 selectedCameras
                     const selectedCamerasArray = parseSelectedCameras(item.selectedCameras); 
                    return {  
                        reportId: item.reportId, 
                        taskName: item.taskName, 
                        selectedCameras: item.selectedCameras, 
                        createTime: item.createTime, 
                        abnormalityStr: item.abnormalityStr,
                        detailList: item.detailList,
                        selectedCamerasArray: selectedCamerasArray,
                        showAllCameras: false,
                        summarize: item.summarize,
                        reportStatusStr: item.reportStatusStr,
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

        //解析 selectedCameras 字符串为数组
        const parseSelectedCameras = (selectedCameras) => {
            const result = [];
            const selectedCamerasArray = selectedCameras.split(',');
            selectedCamerasArray.forEach(cameraId => {
                result.push({
                    cameraId: cameraId,
                });
            });
            return result;
        };
        // 获取第一个摄像头
        const getFirstCamera = (selectedCameras) => {
            const selectedCamerasArray = parseSelectedCameras(selectedCameras);
            return selectedCamerasArray[0].cameraId;
        };
        //展开/收起摄像头
        const toggleCameras = (index) => {
            paginatedreportList.value[index].showAllCameras = !paginatedreportList.value[index].showAllCameras;
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
        }); 

        return {
            reportId, 
            taskName, 
            createTime, 
            abnormalityStr, 
            selectedCameras, 
            reportList, 
            getReportList, 
            paginatedreportList, 
            currentPage_report, 
            count_report, 
            total_report, 
            handleSizeChange_report, 
            handleCurrentChange_report,
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
            handleFilterDate,
            parseSelectedCameras,
            getFirstCamera,
            toggleCameras,
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
      
    