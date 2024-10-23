<template>  
    <div class="app">  
        <div class="container">  
            <div class="camera-container">  
                <form @submit.prevent="routesubmit">  
                    <label for="routeName">巡逻路线名称:</label>  
                    <input type="text" id="routeName" v-model="routeName" /><br><br>  
                
                    <label>选择摄像头:</label><br><br>  
                    <div class="camera-and-button-container">  
                        <el-tree
                            ref="groupTree"
                            node-key="id"
                            default-expand-all
                            :data="deviceGroupList"
                            :props="treeProps"
                            :expand-on-click-node="false"
                            highlight-current
                            @selection-change="handleSelectionChange_group"
                            show-checkbox
                            > 
                        </el-tree>
                        <button type="submit">添加路线</button> 
                    </div>  
                </form><br><br><br><br><br><br><br><br><br>
            </div>  
            
            <div class="route-container">  
                <form @submit.prevent="tasksubmit">  
                    <el-table
                        :data="paginatedrouteList"
                        style="width: 100%;height:155px;font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */  "    
                        header-row-class-name="table-header"
                        @selection-change="handleSelectionChange"  
                        >
                        <el-table-column type="selection" width="55" ></el-table-column> 
                        <el-table-column prop="routeId" label="路线编号" width="70" align="center"></el-table-column>
                        <el-table-column prop="routeName" label="路线名称" width="90" align="center"></el-table-column>
                        <el-table-column prop="selectedCameras" label="所选摄像头"  width="230" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"  width="160" align="center"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间"  width="160" align="center"></el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-edit" type="text" @click="editroute(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteroute(scope.row)"
                                style="color: #f56c6c">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button
                        icon="el-icon-refresh-right"
                        circle
                        size="mini"
                        :loading="refreshRouteListLoading"
                        @click="refreshRouteList"
                        style="float: right ;margin-top: 1px"
                    ></el-button>
                    <el-pagination
                        style="float: right"  
                        @size-change="handleSizeChange_route"  
                        @current-change="handleCurrentChange_route"  
                        :current-page="currentPage_route"  
                        :page-size="count_route"  
                        :page-sizes="[2, 20, 30, 50]"  
                        layout="total, sizes, prev, pager, next"  
                        :total="total_route" 
                    ></el-pagination><br><br>

                    <label>设置任务日期:</label>
                    <label for="startDate">从</label>  
                    <input type="date" v-model="startDate" /> 
                    <label for="endDate">到</label>  
                    <input type="date" v-model="endDate" /> 
                    <label for="unlimited">
                        <input type="checkbox" id="unlimited" v-model="Unlimited" /> 无限期
                    </label><br>
                
                    <label>设置任务时间:</label>
                    <div class="time-and-button-container">  
                        <Day/>  
                        <button type="submit">添加任务</button>  
                    </div>
                </form>
            </div>
        </div>  
        
        <div class="task-container">  
            <el-table
                :data="paginatedtaskList"
                style="width: 100%;height:170px;font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */  "    
                header-row-class-name="table-header"
                >
                <el-table-column prop="taskID" label="任务编号" width="70" align="center"></el-table-column>
                <el-table-column prop="routename" label="路线名称" width="90" align="center"></el-table-column>
                <el-table-column prop="selectedCameras" label="所选摄像头"  width="200" align="center"></el-table-column>
                <el-table-column prop="startDate" label="开始日期"  width="100" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束日期"  width="100" align="center"></el-table-column>
                <el-table-column prop="selectedHours" label="所选时间段"  width="350" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"  width="130" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"  width="130" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-edit" type="text" @click="edittask(scope.row)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-delete" type="text" @click="deletetask(scope.row)"
                        style="color: #f56c6c">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                icon="el-icon-refresh-right"
                circle
                size="mini"
                :loading="refreshTaskListLoading"
                @click="refreshTaskList()"
                style="float: right ;margin-top: 1px"
            ></el-button>
            <el-pagination
                style="float: right"  
                @size-change="handleSizeChange_task"  
                @current-change="handleCurrentChange_task"  
                :current-page="currentPage_task"  
                :page-size="count_task"  
                :page-sizes="[2, 20, 30, 50]"  
                layout="total, sizes, prev, pager, next"  
                :total="taskList.length" 
            ></el-pagination><br>
            <br><br><br><br><br>
        </div> 

        <routeEdit ref="routeEdit":selectedCamerasId="selectedCamerasId" ></routeEdit> 
        <taskEdit ref="taskEdit"></taskEdit> 
        <div v-if="refreshRouteListLoading">Loading route list...</div>  
        <div v-if="refreshTaskListLoading">Loading task list...</div>
    </div> 
</template>  
        
<script>  
import { reactive, ref,onMounted } from 'vue'; 
import axios from 'axios';
import Day from "./Day.vue";
import { Pagination } from 'element-ui';  
import routeEdit from "./dialog/routeEdit.vue"; 
import taskEdit from "./dialog/taskEdit.vue"; 
    
export default {  
    name: 'patrolManager', 
    components: {
        Day,
        routeEdit,
        taskEdit,
        'el-pagination': Pagination,
    },
     
    setup() {
        const deviceGroupList = ref([]); 
        const getDeviceGroupLoading = ref(false); 
        const treeProps = {
            children: "children",
            label: "group_name"
        }; 
        const routeName = ref('');
        const routeId = ref('');
        const selectedCamerasId = ref([]); 
        const selectedCameras = ref(''); 
        const routeList = ref([]);  
        const startDate = ref(null);  
        const endDate = ref(null);  
        const multipleSelection = ref([]); 
        const Unlimited = ref(false); 
        const allHours = ref([]); 
        const selectedHours = ref([]); 
        const taskList = ref([]);   
        const paginatedrouteList = ref([]); 
        const paginatedtaskList = ref([]); 
        const currentPage_route = ref(1);
        const count_route = ref(2);
        const total_route = ref(0);
        const currentPage_task = ref(1);
        const count_task = ref(2);
        const total_task = ref(0);
        const refreshRouteListLoading = ref(false);  
        const refreshTaskListLoading = ref(false);  
        const routeEdit = ref(null);  
        const taskEdit = ref(null);  
    
        //处理选中的摄像头
        const handleSelectionChange_group = (val) => {  
            selectedCamerasId.value = val.map(item => item.id);  
            selectedCameras.value = val.map(item => item.group_name).join(',');  
            console.log(selectedCameras.value); // 打印选中的摄像头名称  
        };  
        
        //处理分页
        const handleSizeChange_route = (newSize) => {
            count_route.value = newSize;
            getRouteList();
        }
        const handleSizeChange_task = (newSize) => {
            count_task.value = newSize;
            getTaskList();
        }
        const handleCurrentChange_route = (newPage) => {
            currentPage_route.value = newPage;
            getRouteList();
        }
        const handleCurrentChange_task = (newPage) => {
            currentPage_task.value = newPage;
            getTaskList();
        }

        //获取摄像头分组列表    
        const getDeviceGroupList = () => {  
            getDeviceGroupLoading.value = true;  
            axios.get('/ai/api/device/group/cameraGroupList')  
            .then(res => {  
                deviceGroupList.value = res.data.data;  
                getDeviceGroupLoading.value = false;  
            })  
            .catch(err => {  
                console.log(err);  
                getDeviceGroupLoading.value = false;  
            });  
        };  
        
        //添加路线
        const routesubmit = async () => {  
          try {  
              const response = await axios.post('/api/patrol/route/add', 
              {  
              routeName: routeName.value,  
              selectedCameras: selectedCameras.value,  
              }); 
              routeList.value.push(response.data);   
              console.log('添加路线成功:', response.data);  
          } catch (error) {  
              console.error('添加路线失败:', error);  
          }  
        }; 
        
        //获取路线列表  
        const getRouteList = () => {  
            axios.get('/api/patrol/route/list', {  
                params: {  
                    page: currentPage_route.value,  
                    count: count_route.value,  
                }  
            })  
            .then(res => {  
                routeList.value = res.data.data.list;  
                total_route.value = res.data.data.total;  
                paginatedrouteList.value = routeList.value.map(item => {  
                    return {  
                        routeId: item.routeId,  
                        routeName: item.routeName,  
                        selectedCameras: item.selectedCameras,
                        createTime: item.createTime,  
                        updateTime: item.updateTime,  
                    };  
                });  
            })  
            .catch(err => {  
                console.log(err);  
            });  
        };  
        
        //编辑路线
        const editroute = (row) => { 
            if (routeEdit.value) {  
                routeEdit.value.openDialog(row, () => {  
                    routeEdit.value.close();    
                    alert("路线修改成功"); 
                    setTimeout(getRouteList, 200); 
                });  
            } else {  
                console.error('请先引入 routeEdit 组件');  
            }  
        }; 
        
        const updateSelectedCamerasId = (newIds) => {  
            selectedCamerasId.value = newIds;  
        };  

        // 删除路线  
        const deleteroute = (row) => {  
            axios.delete(`/api/patrol/route/del`, {  
                params: { routeId: row.routeId}  
            })  
            .then(res => {  
                alert('删除成功');  
                getRouteList();  
            })  
            .catch(err => {  
                console.log(err);  
                alert('删除失败');  
            }); 
        };  
        
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
                        taskID: item.taskID,  
                        routeName: item.routeName,  
                        selectedCameras: item.selectedCameras.map(camera => camera.group_name).join(','),  
                        startDate: item.startDate,  
                        endDate: item.endDate,  
                        selectedHours: item.selectedHours.map(hour => hour.hour).join(','),  
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
        const tasksubmit = async () => {  
            try {  
                const response = await axios.post('/api/patrol/route_task/add', 
                {
                routeId: routeId.value,
                selectedCameras: selectedCameras.value,  
                startDate: startDate.value,  
                endDate: endDate.value, 
                selectedHours: selectedHours.value,  
                }); 
                taskList.value.push(response.data);   
                console.log('添加任务成功:', response.data);  
            } catch (error) {  
                console.error('添加任务失败:', error);  
            }  
        };
        
        //编辑任务
        const edittask = (row) => {  
            this.$refs.taskEdit.show(row);  
        };  
        
        //删除任务
        const deletetask = (row) => {  
            axios.post('/api/patrol/task/delete', {  
                taskID: row.taskID,  
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
        
        //刷新路线列表
        const refreshRouteList = () => {  
            refreshRouteListLoading.value = true;  
            try {  
                const response = axios.get('/api/patrol/route/list', {  
                    params: {  
                        page: currentPage_route.value,  
                        count: count_route.value,  
                    }  
                })  
                .then(res => {  
                    routeList.value = res.data.data.list;  
                    total_route.value = res.data.data.total;  
                    paginatedrouteList.value = routeList.value.map(item => {  
                        return {  
                            routeId: item.routeId,  
                            routeName: item.routeName,  
                            selectedCameras: item.selectedCameras,
                            createTime: item.createTime,  
                            updateTime: item.updateTime,  
                        };  
                    });  
                })  
            } catch (error) {  
                console.error('Error fetching route list:', error);  
            } finally {  
                refreshRouteListLoading.value = false;  
            }  
        };  
        
        //刷新任务列表
        const refreshTaskList = () => {  
            refreshTaskListLoading.value = true;  
            try {  
                const response = axios.get('/api/patrol/task_list');  
                paginatedtaskList.value = response.data;  
                total_task.value = response.total;  
            } catch (error) {  
                console.error('Error fetching task list:', error);  
            } finally {  
                refreshTaskListLoading.value = false;  
            }  
        };  
        
        const handleSelectionChange = (val) => {  
            routeId.value = val[0].routeId;  
            selectedCameras.value = val[0].selectedCameras;  
            startDate.value = val[0].startDate;  
            endDate.value = val[0].endDate;  
            selectedHours.value = val[0].selectedHours;  
            console.log(routeId.value, selectedCameras.value, startDate.value, endDate.value, selectedHours.value); // 打印选中的任务信息  
        };   

        //初始化
        onMounted(() => {  
            getDeviceGroupList();  
            getRouteList();  
            getTaskList();  
        });  
        
        return {  
            deviceGroupList,  
            getDeviceGroupLoading,  
            treeProps,  
            routeName, 
            routeId, 
            selectedCamerasId,  
            selectedCameras,  
            routeList,  
            startDate,  
            endDate,  
            multipleSelection,  
            Unlimited,  
            allHours,  
            selectedHours,  
            taskList,  
            paginatedrouteList,  
            paginatedtaskList,  
            currentPage_route,  
            count_route,  
            total_route,  
            currentPage_task,  
            count_task,  
            total_task,  
            refreshRouteListLoading,  
            refreshTaskListLoading,  
            routeEdit,  
            taskEdit,  
            handleSelectionChange_group,  
            handleSizeChange_route,  
            handleCurrentChange_route,  
            handleSizeChange_task,  
            handleCurrentChange_task,  
            getDeviceGroupList,  
            routesubmit,  
            getRouteList,  
            editroute,  
            updateSelectedCamerasId,  
            deleteroute,  
            getTaskList,  
            tasksubmit,  
            edittask,  
            deletetask,  
            refreshRouteList,  
            refreshTaskList,  
            handleSelectionChange,
        };  
    }    
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
    
    .container {  
        display: flex; /* 使用 flex 布局 */  
        justify-content: space-between; /* 子元素之间的空间平均分布 */  
        align-items: flex-start; /* 子元素顶部对齐（可选，根据需要调整） */  
        width:  120%; /* 或指定具体宽度，根据需要 */  
        padding: 10px; /* 根据需要添加内边距 */  
        max-width: 1390px; 
    } 

    /* 文本和表单样式 */  
    .camera-container {  
        position: relative;   
        width: 400px;
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 470px;
    } 

    .camera-and-button-container .el-tree {  
        height: 375px; /* 设置固定高度 */ 
        width: 250px; 
        overflow-y: auto; /* 允许垂直滚动 */  
        border: 1px solid #ccc; /* 添加方框 */  
        background-color: #f9f9f9; /* 设置背景色 */  
    }

    .route-container {  
        position: relative;   
        width: 950px; 
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 470px;
    } 
    label {  
        font-size: 16px; /* 增大标签字体大小 */  
        color: #333; /* 深色字体，提高对比度 */  
        margin-bottom: 5px; /* 标签与输入框间距 */ 
        text-align: left; /* 左对齐 */  
    }  
    
    input[type="text"],  
    input[type="date"],  
    select,  
    input[type="radio"] + label {  
        font-size: 14px; /* 输入框和选择框字体大小 */  
        padding: 8px; /* 输入框内边距 */  
        border: 1px solid #ccc; /* 边框颜色 */  
        border-radius: 4px; /* 圆角边框 */  
        color: #333; /* 字体颜色 */ 
        text-align: left; /* 左对齐 */   
    }  
    
    input[type="checkbox"] + label {  
        font-size: 14px; /* 复选框标签字体大小 */  
        margin-left: 5px; /* 复选框与标签间距 */  
    }  

    /* 摄像头选择和按钮容器的样式 */    
    .camera-and-button-container {  
        display: flex; /* 启用Flexbox */  
        justify-content: space-between; /* 子元素在主轴上的分布方式 */  
        align-items: center; /* 子元素在交叉轴上的对齐方式 */  
        width: 100%; 
        height:360px; 
    }
    
    .fixed-height-select {  
        height: 250px; 
        flex: 1; /* 允许<select>元素占据剩余空间 */  
    }  
    
    .camera-and-button-container button[type="submit"] {  
        margin-right: 20px;
        margin-top: 330px; 
    }  

    /* 时间选择和按钮容器的样式 */  
    .time-and-button-container {  
        display: flex; /* 启用Flexbox */  
        justify-content: space-between; /* 子元素在主轴上的分布方式 */  
        align-items: center; /* 子元素在交叉轴上的对齐方式 */  
        width: 100%; /* 根据需要设置宽度 */ 
        height:250px; /* 设置高度 */  
        margin-top: -10px; 
    }  
    
    .time-and-button-container button[type="submit"] {  
        margin-right: 20px;
        margin-top: 160px; 
    }  

    /* 表格样式 */
    .task-container {  
        position: relative;
        top: 0px;  
        width: 1380px; 
        height: 190px; 
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
    } 

    /* 时间选择样式 */  
    .hour-row {  
        display: flex;  
        justify-content: space-between;  
        margin-bottom: 10px; /* 分组之间的间距 */  
    }  
    
    .hour-item {  
        display: inline-block;  
        margin-right: 10px;  
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
    