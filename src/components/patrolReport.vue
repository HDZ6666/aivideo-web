<template> 
    <div class="app"> 
        <div class="filter-container"> 
            <!-- 日期筛选 --> 
            <el-date-picker 
                v-model="filterDate" 
                type="date" 
                placeholder="选择日期" 
            ></el-date-picker> 

            <!-- 路线名称筛选 --> 
            <el-input 
                v-model="filterrouteName" 
                placeholder="输入路线名称" 
            ></el-input> 

            <!-- 摄像头名称筛选 --> 
            <el-input 
                v-model="filterSelectedCameras" 
                placeholder="输入摄像头名称" 
            ></el-input> 

            <!-- 是否异常筛选 --> 
            <!-- <el-select 
                v-model="filterAbnormality" 
                placeholder="选择是否异常" 
            > 
                <el-option 
                    v-for="status in uniqueAbnormalities" 
                    :key="status" 
                    :label="status" 
                    :value="status" 
                ></el-option> 
            </el-select>  -->

            <!-- 按钮 --> 
            <el-button type="primary" @click="applyFilter">筛选</el-button>
            <el-button type="primary" @click="resetFilter">重置</el-button>
            <el-button type="primary" @click="exportList">导出</el-button>
        </div> 

        <div class="table-container"> 
            <el-table
                :data="paginatedreportList"
                style="font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */ "
                header-row-class-name="table-header"
            >
                <el-table-column prop="reportId" label="报告编号" width=80 align="center"></el-table-column>
                <el-table-column prop="routeName" label="路线名称" width="120" align="center"></el-table-column >
                <el-table-column prop="selectedCameras" label="选择的摄像头" width="300" align="center"></el-table-column>
                <el-table-column prop="createTime" label="执行时间" width="180" align="center"></el-table-column>
                <el-table-column prop="abnormality" label="是否异常" width="100" align="center"></el-table-column>
                <el-table-column label="巡逻报告" width="370" align="center">
                    <template slot-scope="scope">
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-document" type="text" @click="viewReport(scope.row)">查看报告</el-button>
                        <!-- 从子组件showReport中调用reportForm，传递数据到本组件并通过按钮触发导出报告功能 -->
                        <el-button size="medium" icon="el-icon-download" type="text" @click="exportReport(scope.row)">导出报告</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                style="float: right"
                @size-change="handleSizeChange_report"
                @current-change="handleCurrentChange_report"
                :current-page="currentPage_report"
                :page-size="count_report"
                :page-sizes="[15, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="total_report"
            ></el-pagination> -->
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
        const reportId = ref('');
        const createTime = ref('');
        const abnormality = ref('');
        const routeName = ref('');
        const selectedCameras = ref('');
        const paginatedreportList = ref([]); 
        // const currentPage_report = ref(1);
        // const count_report = ref(15);
        // const total_report = ref(0);

        //获取报告列表  
        // const getReportList = () => {  
        //     axios.get('/api/patrol/report/list', {  
        //         params: {  
        //             page: currentPage_report.value,  
        //             count: count_report.value,  
        //         }  
        //     })  
        //     .then(res => {  
        //         reportList.value = res.data.data.list;  
        //         total_report.value = res.data.data.total;  
        //         paginatedreportList.value = reportList.value.map(item => {  
        //             return {  
        //                 reportId: item.reportId, 
        //                 routeName: item.routeName, 
        //                 selectedCameras: item.selectedCameras, 
        //                 createTime: item.createTime, 
        //                 abnormality: item.abnormalityStr,
        //                 detailList: item.detailList,
        //             };  
        //         });  
        //     })  
        //     .catch(err => {  
        //         console.log(err);  
        //     }); 
        // };  

        // //处理分页
        // const handleSizeChange_report = (size) => {  
        //     count_report.value = size;  
        //     getReportList();  
        // };  
        // const handleCurrentChange_report = (page) => {  
        //     currentPage_report.value = page;  
        //     getReportList();  
        // };
        
        //初始化
        // onMounted(() => {  
        //     getReportList(); 
        // }); 

        return {
            reportId, 
            routeName, 
            createTime, 
            abnormality, 
            selectedCameras, 
            reportList, 
            // getReportList, 
            paginatedreportList, 
            // currentPage_report, 
            // count_report, 
            // total_report, 
            // handleSizeChange_report, 
            // handleCurrentChange_report,
            exportReport,
        }; 
    }, 

    data() { 
        return { 
            filterDate: '', 
            filterrouteName: '',
            filterSelectedCameras: '', 
            filterAbnormality: '', 
            uniqueAbnormalities: [],
            // paginatedreportList样例数据
            paginatedreportList: [
                {
                    reportId: '1', 
                    routeName: '路线1',
                    selectedCameras: '摄像头1,摄像头2', 
                    createTime: '2024-11-14 10:10:10', 
                    abnormality: '异常',
                    detailList: [
                        {
                            cameraName: '摄像头1',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '是',
                            alarmName: '电子围栏',
                            createTime: '2024-11-14 10:00:00',
                        },
                        {
                            cameraName: '摄像头2',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '否',
                            alarmName: '',
                            createTime: '',
                        },
                        {
                            cameraName: '摄像头3',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '是',
                            alarmName: '电子围栏',
                            createTime: '2024-11-14 10:00:00',
                        }, 
                    ],
                },
                {
                    reportId: '2', 
                    routeName: '路线2',
                    selectedCameras: '摄像头3,摄像头4', 
                    createTime: '2024-11-14 11:10:10', 
                    abnormality: '正常',
                    detailList: [
                        {
                            cameraName: '摄像头3',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '否',
                            alarmName: '',
                            createTime: '',
                        },
                        {
                            cameraName: '摄像头4',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '否',
                            alarmName: '',
                            createTime: '',
                        },
                        {
                            cameraName: '摄像头5',
                            imageUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                            abnormality: '否',
                            alarmName: '',
                            createTime: '',
                        }, 
                    ],
                },
            ],
        }; 
    }, 

    // created() { 
    //     // 获取异常状态列表
    //     this.getExcuteAbnormality(); 
    // },

    methods: { 
        // 根据abnormality去重获取异常状态列表
        // getExcuteAbnormality() {
        //     const uniqueAbnormalities = [];
        //     this.reportList.forEach(report => {
        //         if (!uniqueAbnormalities.includes(report.abnormality)) {
        //             uniqueAbnormalities.push(report.abnormality);
        //         }
        //     });
        //     this.uniqueAbnormalities = uniqueAbnormalities;
        // },

        // 应用筛选条件
        applyFilter() { 
            // 根据筛选条件过滤数据 
            const filteredList = this.reportList.filter(report => { 
                const dateMatch = !this.filterDate || new Date(report.createTime.split(' ')[0]).toDateString() === new Date(this.filterDate).toDateString(); 
                const routeNameMatch = !this.filterrouteName || report.routeName.toLowerCase().includes(this.filterrouteName.toLowerCase()); 
                const selectedCamerasMatch = !this.filterSelectedCameras || report.selectedCameras.toLowerCase().includes(this.filterSelectedCameras.toLowerCase()); 
                // const abnormalityMatch = !this.filterAbnormality || report.abnormality === this.filterAbnormality; 
                return dateMatch && routeNameMatch && selectedCamerasMatch ; 
            }); 
            // 更新分页后的数据 
            this.paginatedreportList = filteredList; 
        }, 

        // 重置筛选条件
        resetFilter() { 
            this.filterDate = ''; 
            this.filterrouteName = ''; 
            this.filterSelectedCameras = ''; 
            this.filterExcuteStatus = ''; 
            this.filterAbnormality = ''; 
            this.applyFilter(); 
        },

        // 根据前端筛选条件直接导出报告列表，不需要分页
        exportList() {
            const filteredList = this.reportList.filter(report => { 
                const dateMatch = !this.filterDate || new Date(report.createTime.split(' ')[0]).toDateString() === new Date(this.filterDate).toDateString(); 
                const routeNameMatch = !this.filterrouteName || report.routeName.toLowerCase().includes(this.filterrouteName.toLowerCase()); 
                const selectedCamerasMatch = !this.filterSelectedCameras || report.selectedCameras.toLowerCase().includes(this.filterSelectedCameras.toLowerCase()); 
                const abnormalityMatch = !this.filterAbnormality || report.abnormality === this.filterAbnormality; 
                return dateMatch && routeNameMatch && selectedCamerasMatch && abnormalityMatch; 
            });
            // 将过滤后的报告列表转换为 CSV 内容  
            const csvContent = this.reportListToCsv(filteredList);  
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
        },

        // 报告列表转csv格式
        reportListToCsv(reportList) {
            let csv = "报告编号,路线名称,选择的摄像头,执行时间,是否异常\n";
            reportList.forEach(report => {
                const selectedCamerasEscaped = '"' + report.selectedCameras.replace(/"/g, '""') + '"';  
                csv += `${report.reportId},"${report.routeName}",${selectedCamerasEscaped},"${report.createTime}","${report.abnormalityStr}"\n`; 
            });
            return csv;
        },

        //查看报告
        viewReport(row) {
            this.$refs.showReport.openDialog(row);
        },
        
    },
}; 
</script> 

<style scoped>  
.app {  
    display: flex;  
    flex-direction: column; /* 使用列方向布局 */  
    width: 80vw; 
    height: 87vh; /* 使容器高度为窗口高度的90%（同理） */  
    box-sizing: border-box; /* 包括内边距和边框在内计算宽度 */  
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
  
.el-button {  
    width: 10vw; /* 使用视口单位设置按钮宽度 */  
}  
  
.table-container {  
    position: relative;  
    height: 100%;
    padding: 1vw; /* 使用视口单位设置内边距 */  
    background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
    border-radius: 0.8vw; /* 使用视口单位设置圆角边框 */  
    box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1); /* 使用视口单位设置阴影效果 */  
    overflow-y: auto; /* 允许垂直滚动，如果内容超出容器高度 */   
}  
</style>
      
    