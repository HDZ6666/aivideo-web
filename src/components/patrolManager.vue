<template>  
    <div class="app">  
        <div class="container">          
            <div class="task-container">  
                <el-button style="margin-bottom: 10px;margin-left: 10px;float: right;" type="primary" size="medium" @click="refreshTaskList()">刷新</el-button>
                <el-button style="float: right;" type="primary" size="medium" @click="addtask()">新增任务</el-button>  
                <el-table
                    :data="paginatedtaskList"
                    style="width: 100%;height:90%;font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */  "    
                    header-row-class-name="table-header"
                    >
                    <el-table-column prop="taskId" label="任务编号" width="70" align="center"></el-table-column>
                    <el-table-column prop="routeName" label="路线名称" width="70" align="center"></el-table-column>
                    <el-table-column prop="selectedCameras" label="所选摄像头"  width="200" align="center"></el-table-column>
                    <el-table-column prop="startDate" label="任务开始日期"  width="100" align="center"></el-table-column>
                    <el-table-column prop="endDate" label="任务结束日期"  width="100" align="center"></el-table-column>
                    <el-table-column prop="selectedHours" label="所选时间段"  width="220" align="center"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间"  width="140" align="center"></el-table-column>
                    <el-table-column prop="taskStatus" label="任务状态"  width="100" align="center"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-edit" type="text" @click="editTask(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteTask(scope.row)"
                            style="color: #f56c6c">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-star-on" type="text" @click="startTask(scope.row)">启用</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button size="medium" icon="el-icon-star-off" type="text" @click="stopTask(scope.row)"
                            style="color: #f56c6c">停用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right"  
                    @size-change="handleSizeChange_task"  
                    @current-change="handleCurrentChange_task"  
                    :current-page="currentPage_task"  
                    :page-size="count_task"  
                    :page-sizes="[10, 20, 30, 50]"  
                    layout="total, sizes, prev, pager, next"  
                    :total="total_task" 
                ></el-pagination><br>
            </div> 
        </div>

        <taskAdd ref="taskAdd"></taskAdd> 
        <taskEdit ref="taskEdit"></taskEdit> 
        <div v-if="refreshTaskListLoading">Loading task list...</div>
    </div> 
</template>  
        
<script>  
import { reactive, ref,onMounted } from 'vue'; 
import axios from 'axios';
import { Pagination } from 'element-ui';  
import taskAdd from "./dialog/taskAdd.vue";     
import taskEdit from "./dialog/taskEdit.vue"; 

    
export default {  
    name: 'patrolManager', 
    components: {
        taskAdd,
        taskEdit,
        'el-pagination': Pagination,
    },
     
    setup() {  
        const taskList = ref([]);   
        const paginatedtaskList = ref([]); 
        const currentPage_task = ref(1);
        const count_task = ref(10);
        const total_task = ref(0);
        const refreshTaskListLoading = ref(false);  
        const taskEdit = ref(null);  
        const taskAdd = ref(null);  
        
        //处理分页
        const handleSizeChange_task = (newSize) => {
            count_task.value = newSize;
            getTaskList();
        }
        const handleCurrentChange_task = (newPage) => {
            currentPage_task.value = newPage;
            getTaskList();
        }
        
        //获取任务列表  
        const getTaskList = () => {  
            axios.get('/api/patrol/route_task/list', {  
                params: {  
                    page: currentPage_task.value,  
                    count: count_task.value,  
                }  
            })  
            .then(res => {  
                taskList.value = res.data.data.list;  
                total_task.value = res.data.data.total;  
                paginatedtaskList.value = taskList.value.map(item => {  
                    return {  
                        taskId: item.taskId,  
                        routeName: item.routeName,  
                        selectedCameras: item.selectedCameras, 
                        startDate: item.startDate,  
                        endDate: item.endDate,  
                        selectedHours: item.selectedHours,
                        createTime: item.createTime,  
                        updateTime: item.updateTime,  
                    };  
                });  
            })  
            .catch(err => {  
                console.log(err);  
            });  
        };  

        //添加任务
        const addtask = (row) => { 
            if (taskAdd.value) {  
                taskAdd.value.openDialog(row, () => {  
                    taskAdd.value.close();    
                    alert("任务添加成功"); 
                    setTimeout(getTaskList, 200); 
                });  
            } else {  
                console.error('请先引入 taskAdd 组件');  
            }  
        };  

        //编辑任务
        const editTask = (row) => {  
            if (taskEdit.value) {  
                taskEdit.value.openDialog(row, () => {  
                    taskEdit.value.close();    
                    alert("任务修改成功"); 
                    setTimeout(getTaskList, 200); 
                });  
            } else {  
                console.error('请先引入 taskEdit 组件');  
            }  
        };  
        
        //删除任务
        const deleteTask = (row) => {  
            axios.delete('/api/patrol/route_task/del', {  
                params: { taskId: row.taskId }  
            })  
            .then(res => {  
                alert('删除成功');  
                getTaskList();  
            })  
            .catch(err => {  
                console.log(err);  
                alert('删除失败');  
            });  
        };  
        
        //刷新任务列表
        const refreshTaskList = () => {  
            refreshTaskListLoading.value = true;  
            try {  
                const response = axios.get('/api/patrol/route_task/list',{
                params: {  
                        page: currentPage_task.value,  
                        count: count_task.value,  
                    }  
                })  
                .then(res => {  
                    taskList.value = res.data.data.list;  
                    total_task.value = res.data.data.total;  
                    paginatedtaskList.value = taskList.value.map(item => {  
                        return {  
                            taskId: item.taskId,  
                            routeName: item.routeName,  
                            selectedCameras: item.selectedCameras,  
                            startDate: item.startDate,  
                            endDate: item.endDate,  
                            selectedHours: item.selectedHours,
                            createTime: item.createTime,  
                            updateTime: item.updateTime,  
                        };  
                    });  
                })  
            } catch (error) {  
                console.error('Error fetching task list:', error);  
            } finally {  
                refreshTaskListLoading.value = false;  
            }  
        };  

        //启用任务
        const startTask = (row) => {  
            axios.put('/api/patrol/route_task/start', { taskId: row.taskId })  // 假设启用接口为PUT /api/patrol/route_task/start
            .then(res => {  
                alert('启用成功');  
                getTaskList();  
            })  
            .catch(err => {  
                console.log(err);  
                alert('启用失败');  
            });  
        };  

        //停用任务
        const stopTask = (row) => {  
            axios.put('/api/patrol/route_task/stop', { taskId: row.taskId })  // 假设停用接口为PUT /api/patrol/route_task/stop
            .then(res => {  
                alert('停用成功');  
                getTaskList();  
            })  
            .catch(err => {  
                console.log(err);  
                alert('停用失败');  
            });  
        };  

        //初始化
        onMounted(() => {  
            getTaskList();  
        });  

        return {  
            taskList,  
            paginatedtaskList,  
            currentPage_task,  
            count_task,  
            total_task,  
            refreshTaskListLoading,
            taskAdd,  
            taskEdit,  
            addtask,  
            editTask,  
            deleteTask,  
            refreshTaskList,  
            handleSizeChange_task,  
            handleCurrentChange_task,  
            startTask,  
            stopTask,  
        };  
    }    
};  
</script>  
    
<style scoped>  
    html, body, #app, .app, .container {  
        margin: 0;  
        padding: 0;  
        height: 100%; /* 确保所有父元素都占据视口高度 */  
        box-sizing: border-box;  
    }  

    /* 表格样式 */
    .task-container {  
        position: relative;
        top: 0px;  
        width: 100%; 
        height: 100%;   
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
    } 

    
    /* 按钮样式 */  
    button[type="submit"] {  
        font-size: 16px; /* 按钮字体大小 */  
        padding: 10px 20px; /* 按钮内边距 */  
        border: none; /* 去除边框 */  
        border-radius: 4px; /* 圆角边框 */  
        background-color: #007bff; /* 按钮背景色 */  
        color: white; /* 按钮字体颜色 */  
        cursor: pointer; /* 鼠标悬停时显示指针 */ 
    }  
    
    button[type="submit"]:hover {  
        background-color: #0056b3; /* 按钮悬停背景色 */  
    }  
 
</style>
    