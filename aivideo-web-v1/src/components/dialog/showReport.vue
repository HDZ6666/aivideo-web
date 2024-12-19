<template>  
  <div id="showReport">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      class="custom-dialog"
      title="巡逻报告"  
      width="70%"  
      top="4rem"  
      @close="handleClose"  
    >
      <div class="dialog-content-wrapper">
        <el-divider></el-divider>  
        <el-form :model="reportForm" class="form-container" label-position="left">  
          <el-row> 
            <el-col :span="5">  
              <el-form-item label="报告编号:" :label-width="formLabelWidth">  
                <span class="form-item">{{ reportForm.reportId }}</span>  
              </el-form-item>  
            </el-col>  
            <el-col :span="6">  
              <el-form-item label="任务名称:" :label-width="formLabelWidth">  
                <span class="form-item">{{ reportForm.taskName }}</span>  
              </el-form-item>  
            </el-col>   
            <el-col :span="8">  
              <el-form-item label="生成时间:" :label-width="formLabelWidth">  
                <span class="form-item">{{ reportForm.createTime }}</span>  
              </el-form-item>  
            </el-col>
            <el-col :span="5">  
              <el-form-item label="报告状态:" :label-width="formLabelWidth">  
                <span class="form-item">{{ reportForm.reportStatusStr }}</span>  
              </el-form-item>  
            </el-col>
          </el-row>  
          <el-row>  
              <el-form-item label="巡逻总结:" :label-width="formLabelWidth"> 
                <span class="form-item">{{ reportForm.summarize }}</span> 
              </el-form-item>  
          </el-row>
          <el-row>  
              <el-form-item label="具体情况:" :label-width="formLabelWidth"></el-form-item> 
          </el-row>  
          <el-row>  
            <el-table  
              :data="filteredReportList"  
              class="custom-table"
              style="width: 100%; font-size: 12px;"
              header-row-class-name="table-header"  
            >  
              <el-table-column label="序号" width="110">  
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>  
              </el-table-column>
              <el-table-column prop="cameraName" label="摄像头名称" width="240"></el-table-column>  
              <el-table-column label="巡逻拍照图片" width="210">  
                <template slot-scope="scope">  
                  <img 
                    :src="scope.row.imageUrl" 
                    style="width: 100px; height: 75px; cursor: pointer;"
                    @click="handleClick(scope.row.imageUrl)"  
                    />  
                </template>  
              </el-table-column>  
              <!-- <el-table-column label="是否有告警" width="120">  
                <template slot-scope="scope">  
                  <el-tag :type="scope.row.alarmName !== null ? 'danger' : 'success'">{{ scope.row.abnormality }}</el-tag>
                </template>  
              </el-table-column>   -->
              <el-table-column label="告警名称" width="210">  
                <template slot-scope="scope">  
                  <el-tag :type="scope.row.alarmName !== null ? 'danger' : 'success'">{{ scope.row.alarmName || '无告警' }}</el-tag>
                </template>  
              </el-table-column>  
              <el-table-column label="告警时间" width="210">  
                <template slot-scope="scope">  
                  <el-tag :type="scope.row.alarmName !== null ? 'danger' : 'success'">{{ scope.row.alarmTime }}</el-tag>
                </template>  
              </el-table-column>
            </el-table> 
          </el-row>
        </el-form> 
        <div slot="footer" class="dialog-footer">  
          <el-button type="primary" @click="exportReport">导出报告</el-button>  
        </div>
      </div>   
    </el-dialog> 
    
    <el-dialog  
      title="查看图片"  
      :visible.sync="showImageDialogVisible"  
      width="80%" 
      top="5vh"  
      :before-close="handleImageClose"  
    >  
      <img :src="imageSrc" style="width: 100%; height: 100%;margin-top: -20px;" />  
    </el-dialog>  
  </div>  
</template>  
  
<script>  
import { emit } from 'node-notifier';
import { ref } from 'vue';
import axios from 'axios';

export default {  
  name: 'ShowReport', 
  
  setup() {
    const dialogVisible = ref(false); 
    const showImageDialogVisible = ref(false);  
    const imageSrc = ref('');  
    const reportForm = ref({
      reportId: '',
      taskName: '',
      createTime: '', 
      abnormality: '',
      detailList: [],
    });  
    const originalReport = ref({}); 
    const filteredReportList = ref([]); 
    const formLabelWidth = '80px'; 
 

    //打开对话框时，传入报告数据  
    const openDialog =  (reportData) => { 
      dialogVisible.value = true;
      reportForm.value = { ...reportData }; 
      filteredReportList.value = reportData.detailList; 
      originalReport.value = {...reportData };
    };  

    // 点击图片时打开查看图片对话框  
    const handleClick = (imageUrl) => {  
      imageSrc.value = imageUrl;  
      showImageDialogVisible.value = true;  
    };

    // 关闭查看图片对话框  
    const handleImageClose = () => {  
      showImageDialogVisible.value = false;  
    };  

    // 关闭对话框  
    const handleClose = () => {  
      dialogVisible.value = false;  
    };  

    // 处理总结并调整输入框高度  
    // const handleSummarize = () => {  
    //   const abnormalityCount = reportForm.value.detailList.filter(item => item.alarmName !== null).length;  
    //   const cameraCount = reportForm.value.detailList.length;  
    //   let summarize = '';  
    //   if (abnormalityCount > 0) {  
    //     const uniqueAlarmNames = new Set(reportForm.value.detailList.filter(item => item.alarmName !== null).map(item => item.alarmName));  
    //     const alarmNameList = Array.from(uniqueAlarmNames); // 将 Set 转换回数组  
    //     const alarmName = alarmNameList.join('、');   
    //     summarize = `本次成功对${cameraCount}个摄像头进行自动巡逻，其中${abnormalityCount}个摄像头发现告警，告警内容包括${alarmName}等，请速通知负责人前往现场核实确认。`;  
    //   } else {  
    //     summarize = `本次成功对${cameraCount}个摄像头进行自动巡逻，未发现告警。`;  
    //   }  
    //   reportForm.value.summarize = summarize;  
    // }; 

    // 根据reportId从后端API（/api/patrol/report/download）获取url下载报告
    async function exportReport() {
      try {
        const response = await axios({
          method: 'get',
          url: `/api/patrol/report/download`,
          params: { reportId: reportForm.value.reportId }, 
        });

        // 检查响应是否包含有效的URL
        if (response.data && response.data.code === 0) {
          const downloadUrl = response.data.data;

          // 创建一个a标签用于下载
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `巡逻报告_${reportForm.value.reportId}.docx`; 

          // 触发下载
          document.body.appendChild(a); 
          a.click();
          document.body.removeChild(a); 
        } else {
          console.error('获取下载URL失败', response.data.msg || '未知错误');
        }
      } catch (error) {
        console.log('导出报告失败', error);
      }
    };

    return { 
      dialogVisible, showImageDialogVisible, imageSrc, reportForm, originalReport, filteredReportList, formLabelWidth, 
       openDialog, handleClick, handleImageClose, handleClose, exportReport,
    };
  }  
};  
</script>

<style scoped>
.custom-dialog {  
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);  
  border-radius: 8px;  
  text-align: left;  
  font-weight: bold; 
}  

.dialog-content-wrapper {
  margin-top: -50px; 
}

.form-container {  
  padding: 10px;  
  text-align: left; 
  margin-top: -10px;
  font-weight: normal;
}  

.form-item {  
  font-weight: bold;
  justify-content: left;
  line-height: 40px; 
}  

.custom-table {
  border: 1px solid #d2d2d2; /* 添加边框 */
  border-radius: 4px; /* 添加圆角 */
  overflow: hidden; /* 防止内容溢出 */
  margin-top: -10px;
}

.dialog-footer {  
  text-align: center;  
  padding: 10px 20px;   
  border-radius: 0 0 3px 3px;  
  margin-top:-10px;
}    

</style>  
