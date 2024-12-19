<template>
    <div class="app">
        <div class="container">
            <div class="task-container">
                <el-button class="btn-refresh" style="margin-bottom: 10px;margin-left: 10px;float: right;" type="primary" size="small" @click="refreshTaskList()">刷新</el-button>
                <el-button class="btn-add" style="float: right;" type="primary" size="small" @click="addtask()">新增</el-button>
                <el-table
                    :data="paginatedtaskList"
                    style="width: 100%;height:90%;font-size: 12px;overflow-y: auto;"
                    :header-cell-style="headerCellStyle"
                    >
                    <el-table-column prop="taskId" label="任务编号" width="70" align="center"></el-table-column>
                    <el-table-column prop="taskName" label="任务名称" width="100" align="center"></el-table-column>
                    <el-table-column prop="selectedCameras" label="所选摄像头" width="160" align="center" v-slot:default="scope">
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
                    <el-table-column prop="startDate" label="任务开始日期"  width="100" align="center"></el-table-column>
                    <el-table-column prop="endDate" label="任务结束日期"  width="100" align="center"></el-table-column>
                    <el-table-column label="所选时间段" width="220" align="center">
                        <template v-slot="scope">
                            <div style="display: flex;align-items: center;color:#409eff;">
                                <el-button type="text" size="mini" @click="toggleTimeSlots(scope.$index)">
                                    <i :class="scope.row.showAllTimeSlots ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                </el-button>
                                <div v-if="scope.row.showAllTimeSlots">
                                    <div v-for="(timeSlot, index) in scope.row.selectedHoursArray" :key="index">
                                        {{ formatTimeSlots(timeSlot.timeSlot) }}
                                    </div>
                                </div>
                                <div v-else>
                                    {{ getFirstTime(scope.row.selectedHours) }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间"  width="150" align="center"></el-table-column>
                    <el-table-column label="任务状态" width="140" align="center">
                        <template v-slot:default="scope">
                            <el-switch
                                v-model="scope.row.taskStatusSwitch"
                                :active-text="getTaskStatusText(scope.row, 'active')"
                                :inactive-text="getTaskStatusText(scope.row, 'inactive')"
                                @change="handleTaskStatusChange(scope.row)"
                                style="display: block; margin: 0 auto;"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="170" align="center">
                        <template slot-scope="scope">
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-edit" type="text" @click="editTask(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteTask(scope.row)"
                                style="color: #f56c6c">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right"
                    @size-change="handleSizeChange_task"
                    @current-change="handleCurrentChange_task"
                    :current-page="currentPage_task"
                    :page-size="count_task"
                    :page-sizes="[10, 20, 50]"
                    layout="total, sizes, prev, pager, next"
                    :total="total_task"
                ></el-pagination>
            </div>
        </div>

        <taskAdd ref="taskAdd" @success="refreshTaskList()"></taskAdd>
        <taskEdit ref="taskEdit" @success="refreshTaskList()"></taskEdit>
    </div>
</template>

<script>
import { reactive, ref,onMounted } from 'vue';
import axios from 'axios';
import { Pagination, Icon } from 'element-ui';
import taskAdd from "./dialog/taskAdd.vue";
import taskEdit from "./dialog/taskEdit.vue";
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Icon);

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
        const taskStatusSwitch = ref(false);


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
                    // 拆分 selectedCameras
                    const selectedCamerasArray = parseSelectedCameras(item.selectedCameras);
                    // 拆分 selectedHours
                    const selectedHoursArray = parseTimeSlots(item.selectedHours);
                    return {
                        taskId: item.taskId,
                        taskName: item.taskName,
                        selectedCameras: item.selectedCameras,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        selectedHours: item.selectedHours,
                        createTime: item.createTime,
                        updateTime: item.updateTime,
                        taskStatus: item.taskStatus,
                        taskStatusSwitch: item.taskStatus === 1,
                        taskRule: item.taskRule,
                        isUnlimited: item.isUnlimited === 'true' || item.isUnlimited,
                        selectedCamerasArray: selectedCamerasArray,
                        showAllCameras: false,
                        selectedHoursArray: selectedHoursArray,
                        showAllTimeSlots: false,
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
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
            paginatedtaskList.value[index].showAllCameras = !paginatedtaskList.value[index].showAllCameras;
        };

        // 格式化时间段字符串，分行显示
        const formatTimeSlots = (selectedHours) => {
            // 使用正则表达式匹配天数和时间
            const regex = /([周一二三四五六日]):(\d{2}:\d{2}-\d{2}:\d{2})/g;
            let formatted = selectedHours.replace(regex, '$1<span class="time">$2</span><br/>');
            formatted += ' ';
            formatted = formatted.replace(/(\s*<br\/?>)$/, '');
            return formatted.trim();
        };
        // 将时间段字符串转换成数组
        const parseTimeSlots = (selectedHours) => {
            const result = [];
            // 按照换行符分隔
            const selectedHoursArray = selectedHours.split('\n');
            selectedHoursArray.forEach(timeSlot => {
                result.push({
                    timeSlot: timeSlot,
                })
            });
            return result;
        };
        // 获取第一个时间段
        const getFirstTime = (selectedHours) => {
            const selectedHoursArray = parseTimeSlots(selectedHours);
            return selectedHoursArray[0].timeSlot;
        };
        // 展开/收起所选时间段
        const toggleTimeSlots = (index) => {
            paginatedtaskList.value[index].showAllTimeSlots = !paginatedtaskList.value[index].showAllTimeSlots;
        };

        //添加任务，当total_task大于10，提示任务配置数量已超限10条，请删除部分任务后再新增
        const addtask = (row) => {
            if (total_task.value >= 10) {
                alert('任务配置数量已超限10条，请删除部分任务后再新增');
                return;
            }
            if (taskAdd.value) {
                taskAdd.value.openDialog(row, () => {
                    taskAdd.value.close();
                    refreshTaskList();
                });
            } else {
                console.error('请先引入 taskAdd 组件');
            }
        };

        //编辑任务
        const editTask = (row) => {
            // 检查任务状态，若任务处于启动状态，则不能编辑
            if (row.taskStatus === 1) {
                alert('任务处于启动状态，不能编辑');
                return;
            }
            if (taskEdit.value) {
                taskEdit.value.openDialog(row, () => {
                    taskEdit.value.close();
                });
            } else {
                console.error('请先引入 taskEdit 组件');
            }
        };

        //删除任务, 任务处于启动状态时不能删除，且删除时提醒确认
        const deleteTask = (row) => {
            if (row.taskStatus === 1) {
                alert('任务处于启动状态，不能删除');
                return;
            }
            if (!confirm('确认删除该任务吗？')) {
                return;
            }
            axios.delete('/api/patrol/route_task/del', {
                params: { taskId: row.taskId }
            })
            .then(res => {
                alert('删除成功');
                refreshTaskList();
            })
            .catch(err => {
                console.log(err);
                alert('删除失败');
            });
        };

        //刷新任务列表
        const refreshTaskList = () => {
            refreshTaskListLoading.value = true;
            getTaskList()
        };

        //获取当前日期
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        };

        //获取任务状态文本
        const getTaskStatusText = (row, status) => {
            const endDate = row.endDate;
            const currentDate = getCurrentDate();
            if (new Date(currentDate) > new Date(endDate)) {
                return status === 'active' ? '重启' : '结束';
            } else {
                return status === 'active' ? '启用' : '停用';
            }
        };

        //启用/停用任务，并对endDate进行判断，如当前日期大于endDate，则提示无法启用任务
        const toggleTaskStatus = (row) => {
            if (row.taskStatusSwitch) {
                if (new Date().getTime() > new Date(row.endDate).getTime()) {
                    alert('当前日期大于任务结束日期，无法启用任务');
                    row.taskStatusSwitch = false;
                    return;
                }
            }
            const newStatus = row.taskStatusSwitch ? 1 : 0; // 切换状态
            axios.post('/api/patrol/route_task/edit_task_status', {
                taskId: row.taskId,
                taskStatus: newStatus,
            })
            .then(res => {
                alert('任务状态修改成功');
                // 找到 taskList 中对应的项并更新它
                const updatedItem = taskList.value.find(item => item.taskId === row.taskId);
                if (updatedItem) {
                    updatedItem.taskStatus = newStatus;
                    const index = paginatedtaskList.value.findIndex(item => item.taskId === row.taskId);
                    if (index !== -1) {
                        paginatedtaskList.value[index].taskStatusSwitch = newStatus === 1;
                    }
                }
                refreshTaskList();
            })
            .catch(err => {
                console.log(err);
                alert('任务状态修改失败');
            });
        };

        // 处理任务状态变化
        const handleTaskStatusChange = (row) => {
            const isRestart = getTaskStatusText(row, 'active') === '重启';
            if (isRestart) {
                // 打开编辑对话框
                if (taskEdit.value) {
                taskEdit.value.openDialog(row, () => {
                    taskEdit.value.close();
                    refreshTaskList();
                });
                } else {
                console.error('请先引入 taskEdit 组件');
                }
            } else {
                // 直接切换任务状态
                toggleTaskStatus(row);
            }
        };
        // 表头样式
        const headerCellStyle = {
            backgroundColor: '#f5f7f9',
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#303133',
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
            toggleTaskStatus,
            taskStatusSwitch,
            handleTaskStatusChange,
            getTaskStatusText,
            headerCellStyle,
            toggleCameras,
            parseSelectedCameras,
            getFirstCamera,
            formatTimeSlots,
            toggleTimeSlots,
            parseTimeSlots,
            getFirstTime,
        };
    }
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

    /* 表格样式 */
    .task-container {
        position: relative;
        top: 0px;
        width: 100%;
        height: 670px;
        background-color: #fff; /* 轻微背景色增加可读性 */
        border-radius: 3px; /* 圆角边框 */
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    }

    /* 按钮样式 */
    .btn-add {
        margin-left: 1vw; /* 左侧外边距 */
        font-size: 13px;
        padding: 10px 20px; /* 按钮内边距 */
        border: none; /* 去除边框 */
        border-radius: 4px; /* 圆角边框 */
        background-color: #409eff; /* 按钮背景色 */
        color: white; /* 按钮字体颜色 */
        cursor: pointer; /* 鼠标悬停时显示指针 */
    }

    .btn-refresh {
        font-size: 13px;
        padding: 10px 20px; /* 按钮内边距 */
        border: none; /* 去除边框 */
        border-radius: 4px; /* 圆角边框 */
        background-color: white; /* 按钮背景色 */
        color: black; /* 按钮字体颜色 */
        cursor: pointer; /* 鼠标悬停时显示指针 */
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.04);
    }

    .time-slots {
        white-space: pre-wrap; /* 保留空白符序列，但是正常地进行换行 */
        word-break: break-all; /* 在长单词或 URL 地址内部进行换行 */
        color: #409eff;
    }



   .el-pager li {
    border:black;
   }


</style>
