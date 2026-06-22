<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>车辆采集管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">
            新增采集
          </el-button>
        </div>
      </template>

      <!-- 查询条件 -->
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="queryParams.deviceCode" placeholder="请输入设备编号" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="车牌号" prop="plateNo">
          <el-input v-model="queryParams.plateNo" placeholder="请输入车牌号" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="车身颜色" prop="vehicleColor">
          <el-select v-model="queryParams.vehicleColor" placeholder="请选择车身颜色" clearable style="width: 240px">
            <el-option label="白色" value="1" />
            <el-option label="银色" value="2" />
            <el-option label="灰色" value="3" />
            <el-option label="黑色" value="4" />
            <el-option label="红色" value="5" />
            <el-option label="蓝色" value="6" />
            <el-option label="黄色" value="7" />
            <el-option label="绿色" value="8" />
            <el-option label="棕色" value="9" />
            <el-option label="其他" value="99" />
          </el-select>
        </el-form-item>
        <el-form-item label="采集时间" prop="collectTime">
          <el-date-picker v-model="queryParams.collectTime" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px">
            <el-option label="正常" value="0" />
            <el-option label="可疑" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 卡片列表 -->
      <div class="vehicle-card-container" v-loading="loading">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in vehicleList" :key="item.id">
            <el-card class="vehicle-card" shadow="hover">
              <!-- 车辆图片 -->
              <div class="vehicle-image-container">
                <el-image :src="item.StorageUrl1" :preview-src-list="[item.StorageUrl1]" fit="cover"
                  class="vehicle-image" :preview-teleported="true">
                  <template #error>
                    <div class="image-slot">
                      <el-icon>
                        <Van />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
                <!-- 状态标签 -->
                <div class="status-tag">
                  <el-tag :type="item.IsSuspicious === 1 ? 'danger' : 'success'" size="small">
                    {{ item.IsSuspicious === 1 ? '可疑' : '正常' }}
                  </el-tag>
                </div>
              </div>

              <!-- 信息内容 -->
              <div class="vehicle-info">
                <div class="info-row">
                  <span class="info-label">设备名称：</span>
                  <span class="info-value">{{ item.deviceName }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">设备编号：</span>
                  <span class="info-value">{{ item.deviceCode }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">车牌号：</span>
                  <span class="info-value">
                    <el-tag :type="item.PlateNo === '无车牌' ? 'warning' : 'primary'" size="small">
                      {{ item.PlateNo }}
                    </el-tag>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">车身颜色：</span>
                  <span class="info-value">
                    <el-tag :color="getVehicleColorHex(item.VehicleColor)" size="small" style="color: white;">
                      {{ getVehicleColorName(item.VehicleColor) }}
                    </el-tag>
                  </span>
                </div>
                <div class="info-row">
                  <span class="time-value">{{ formatTime(item.AppearTime) }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="vehicle-actions">
                <el-button link @click="handleView(item)">
                  <el-icon>
                    <View />
                  </el-icon>
                  查看
                </el-button>
                <el-button link @click="handleUpdate(item)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  修改
                </el-button>
                <el-button link @click="handleDelete(item)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  删除
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="!loading && vehicleList.length === 0" description="暂无数据" />
      </div>

      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改车辆采集对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="vehicleRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="form.deviceCode" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="plateNo">
              <el-input v-model="form.plateNo" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车身颜色" prop="vehicleColor">
              <el-select v-model="form.vehicleColor" placeholder="请选择车身颜色" style="width: 240px">
                <el-option label="白色" value="1" />
                <el-option label="银色" value="2" />
                <el-option label="灰色" value="3" />
                <el-option label="黑色" value="4" />
                <el-option label="红色" value="5" />
                <el-option label="蓝色" value="6" />
                <el-option label="黄色" value="7" />
                <el-option label="绿色" value="8" />
                <el-option label="棕色" value="9" />
                <el-option label="其他" value="99" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="车辆图片" prop="vehicleImage">
              <el-upload class="upload-demo" drag :auto-upload="false" :show-file-list="false" accept="image/*"
                :on-change="handleImageChange">
                <el-image v-if="form.vehicleImage" :src="form.vehicleImage" fit="cover"
                  style="width: 200px; height: 120px;" />
                <div v-else class="upload-placeholder">
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 车辆详情对话框 -->
    <el-dialog title="车辆详情" v-model="detailOpen" width="800px" append-to-body>
      <div class="detail-container">
        <!-- 车辆图片 -->
        <div class="detail-image-section">
          <el-image :src="detailForm.StorageUrl1 || detailForm.SubImageList?.SubImageInfoObject?.[0]?.StoragePath"
            :preview-src-list="[detailForm.StorageUrl1 || detailForm.SubImageList?.SubImageInfoObject?.[0]?.StoragePath]"
            fit="cover" class="detail-vehicle-image" :preview-teleported="true">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <Van />
                </el-icon>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 详细信息 -->
        <div class="detail-info-section">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="basic">
              <el-descriptions :column="2" border label-width="100px" size="small">
                <el-descriptions-item label="车辆ID" :span="2">
                  <el-text size="small" type="info" class="long-id-text">{{ detailForm.MotorVehicleID }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="设备ID">{{ detailForm.DeviceID }}</el-descriptions-item>
                <el-descriptions-item label="设备名称">{{ detailForm.deviceName }}</el-descriptions-item>
                <el-descriptions-item label="车牌号">
                  <el-tag :type="detailForm.PlateNo === '无车牌' ? 'warning' : 'primary'" size="small">
                    {{ detailForm.PlateNo }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="车身颜色">
                  <el-tag :color="getVehicleColorHex(detailForm.VehicleColor)" size="small" style="color: white;">
                    {{ getVehicleColorName(detailForm.VehicleColor) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="出现时间">{{ formatTime(detailForm.AppearTime) }}</el-descriptions-item>
                <el-descriptions-item label="消失时间">{{ formatTime(detailForm.DisappearTime) }}</el-descriptions-item>
                <el-descriptions-item label="标记时间" :span="2">{{ formatTime(detailForm.MarkTime)
                  }}</el-descriptions-item>
                <el-descriptions-item label="通过道路" :span="2">{{ detailForm.NameOfPassedRoad || '未知'
                  }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 车牌信息 -->
            <el-tab-pane label="车牌信息" name="plate">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="是否有车牌">
                  <el-tag :type="detailForm.HasPlate ? 'success' : 'warning'" size="small">
                    {{ detailForm.HasPlate ? '有' : '无' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="车牌号码">
                  <el-tag :type="detailForm.PlateNo === '无车牌' ? 'warning' : 'primary'" size="small">
                    {{ detailForm.PlateNo }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="车牌分类">
                  {{ getPlateClassName(detailForm.PlateClass) }}
                </el-descriptions-item>
                <el-descriptions-item label="车牌颜色">
                  {{ getPlateColorName(detailForm.PlateColor) }}
                </el-descriptions-item>
                <el-descriptions-item label="车牌附加信息">
                  {{ detailForm.PlateNoAttach || '无' }}
                </el-descriptions-item>
                <el-descriptions-item label="车牌描述">
                  {{ detailForm.PlateDescribe || '无' }}
                </el-descriptions-item>
                <el-descriptions-item label="是否套牌">
                  <el-tag :type="detailForm.IsDecked === 1 ? 'danger' : 'success'" size="small">
                    {{ detailForm.IsDecked === 1 ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否变造">
                  <el-tag :type="detailForm.IsAltered === 1 ? 'danger' : 'success'" size="small">
                    {{ detailForm.IsAltered === 1 ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否遮挡">
                  <el-tag :type="detailForm.IsCovered === 1 ? 'danger' : 'success'" size="small">
                    {{ detailForm.IsCovered === 1 ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="车牌可信度">
                  {{ detailForm.PlateReliability || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车牌字符可信度">
                  {{ detailForm.PlateCharReliability || '未知' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 车辆特征 -->
            <el-tab-pane label="车辆特征" name="features">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="车辆类型">
                  {{ getVehicleClassName(detailForm.VehicleClass) }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆品牌">
                  {{ getVehicleBrandName(detailForm.VehicleBrand) }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆型号">
                  {{ detailForm.VehicleModel || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆款式">
                  {{ detailForm.VehicleStyles || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车身颜色">
                  <el-tag :color="getVehicleColorHex(detailForm.VehicleColor)" size="small" style="color: white;">
                    {{ getVehicleColorName(detailForm.VehicleColor) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="颜色深浅">
                  {{ detailForm.VehicleColorDepth || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆长度">
                  {{ detailForm.VehicleLength ? detailForm.VehicleLength + 'mm' : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆宽度">
                  {{ detailForm.VehicleWidth ? detailForm.VehicleWidth + 'mm' : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车辆高度">
                  {{ detailForm.VehicleHeight ? detailForm.VehicleHeight + 'mm' : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="乘客数量">
                  {{ detailForm.NumOfPassenger || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="品牌可信度">
                  {{ detailForm.BrandReliability || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="是否改装">
                  <el-tag :type="detailForm.IsModified === 1 ? 'warning' : 'success'" size="small">
                    {{ detailForm.IsModified === 1 ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 行驶信息 -->
            <el-tab-pane label="行驶信息" name="driving">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="行驶速度">
                  {{ detailForm.Speed ? detailForm.Speed + ' km/h' : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="行驶方向">
                  {{ getDirectionName(detailForm.Direction) }}
                </el-descriptions-item>
                <el-descriptions-item label="行驶状态">
                  {{ detailForm.DrivingStatusCode || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="使用性质">
                  {{ detailForm.UsingPropertiesCode || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="遮阳板">
                  <el-tag :type="detailForm.Sunvisor === 1 ? 'success' : 'info'" size="small">
                    {{ detailForm.Sunvisor === 1 ? '打开' : '关闭' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="安全带">
                  <el-tag :type="detailForm.SafetyBelt === 1 ? 'success' : 'danger'" size="small">
                    {{ detailForm.SafetyBelt === 1 ? '系' : '未系' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="打电话">
                  <el-tag :type="detailForm.Calling === 1 ? 'warning' : 'success'" size="small">
                    {{ detailForm.Calling === 1 ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="撞击痕迹">
                  {{ detailForm.HitMarkInfo || '无' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 车身部件 -->
            <el-tab-pane label="车身部件" name="parts">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="引擎盖">
                  {{ detailForm.VehicleHood || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="后备箱">
                  {{ detailForm.VehicleTrunk || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车轮">
                  {{ detailForm.VehicleWheel || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="轮胎花纹">
                  {{ detailForm.WheelPrintedPattern || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车窗">
                  {{ detailForm.VehicleWindow || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车顶">
                  {{ detailForm.VehicleRoof || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车门">
                  {{ detailForm.VehicleDoor || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车身侧面">
                  {{ detailForm.SideOfVehicle || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="车厢">
                  {{ detailForm.CarOfVehicle || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="后视镜">
                  {{ detailForm.RearviewMirror || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="底盘">
                  {{ detailForm.VehicleChassis || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="遮挡物">
                  {{ detailForm.VehicleShielding || '无' }}
                </el-descriptions-item>
                <el-descriptions-item label="贴膜颜色">
                  {{ detailForm.FilmColor || '无' }}
                </el-descriptions-item>
                <el-descriptions-item label="车身描述">
                  {{ detailForm.VehicleBodyDesc || '无' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 图像信息 -->
            <el-tab-pane label="图像信息" name="images" v-if="detailForm.SubImageList?.SubImageInfoObject?.length">
              <div v-for="(image, index) in detailForm.SubImageList.SubImageInfoObject" :key="index"
                class="image-info-item">
                <el-descriptions :column="2" border size="small" label-width="100px" :title="`图像 ${index + 1}`">
                  <el-descriptions-item label="图像ID" :span="2">
                    <el-text size="small" type="info" class="long-id-text">{{ image.ImageID }}</el-text>
                  </el-descriptions-item>
                  <el-descriptions-item label="事件类型">{{ getEventSortName(image.EventSort) }}</el-descriptions-item>
                  <el-descriptions-item label="设备ID">{{ image.DeviceID }}</el-descriptions-item>
                  <el-descriptions-item label="图像格式">{{ image.FileFormat?.toUpperCase() }}</el-descriptions-item>
                  <el-descriptions-item label="图像类型">{{ getImageTypeName(image.Type) }}</el-descriptions-item>
                  <el-descriptions-item label="图像尺寸">{{ image.Width }} × {{ image.Height }}</el-descriptions-item>
                  <el-descriptions-item label="拍摄时间">{{ formatTime(image.ShotTime) }}</el-descriptions-item>
                  <el-descriptions-item label="存储路径" :span="2">
                    <el-link :href="image.StoragePath" target="_blank" type="primary" size="small">
                      查看原图
                    </el-link>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="VehicleCollection">
import { Van, View, Edit, Delete, UploadFilled } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 响应式数据
const vehicleList = ref([])
const open = ref(false)
const detailOpen = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const activeTab = ref("basic")

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 12,
  deviceName: null,
  deviceCode: null,
  plateNo: null,
  vehicleColor: null,
  collectTime: null,
  status: null
})

// 表单数据
const form = ref({})
const detailForm = ref({})

// 表单验证规则
const rules = {
  deviceName: [
    { required: true, message: "设备名称不能为空", trigger: "blur" }
  ],
  deviceCode: [
    { required: true, message: "设备编号不能为空", trigger: "blur" }
  ],
  plateNo: [
    { required: true, message: "车牌号不能为空", trigger: "blur" }
  ],
  vehicleColor: [
    { required: true, message: "车身颜色不能为空", trigger: "change" }
  ]
}

/** 查询车辆采集列表 */
function getList() {
  loading.value = true

  // 模拟数据
  setTimeout(() => {
    vehicleList.value = [
      {
        id: 1,
        MotorVehicleID: "431002000013200010030220250924183633101620210162",
        InfoKind: 1,
        SourceID: "43100200001320001003022025092418363310162",
        TollgateID: "43100200001210001003",
        DeviceID: "43100200001320001003",
        deviceName: '高速收费站01',
        deviceCode: 'CAM001',
        LeftTopX: 142,
        LeftTopY: 256,
        RightBtmX: 1764,
        RightBtmY: 1008,
        MarkTime: "20250924183633",
        AppearTime: "20250924183633",
        DisappearTime: "20250924183633",
        LaneNo: 1,
        HasPlate: false,
        PlateClass: "99",
        PlateColor: "99",
        PlateNo: "无车牌",
        PlateNoAttach: null,
        PlateDescribe: null,
        IsDecked: null,
        IsAltered: null,
        IsCovered: null,
        Speed: 0,
        Direction: "9",
        DrivingStatusCode: null,
        UsingPropertiesCode: null,
        VehicleClass: "K11",
        VehicleBrand: "57",
        VehicleModel: "ZK5156XYL4",
        VehicleStyles: "未知",
        VehicleLength: null,
        VehicleWidth: null,
        VehicleHeight: null,
        VehicleColor: "2",
        VehicleColorDepth: null,
        VehicleHood: null,
        VehicleTrunk: null,
        VehicleWheel: null,
        WheelPrintedPattern: null,
        VehicleWindow: null,
        VehicleRoof: null,
        VehicleDoor: null,
        SideOfVehicle: null,
        CarOfVehicle: null,
        RearviewMirror: null,
        VehicleChassis: null,
        VehicleShielding: null,
        FilmColor: null,
        IsModified: null,
        HitMarkInfo: null,
        VehicleBodyDesc: null,
        VehicleFrontItem: null,
        DescOfFrontItem: null,
        VehicleRearItem: null,
        DescOfRearItem: null,
        NumOfPassenger: null,
        PassTime: "20250924183633",
        NameOfPassedRoad: null,
        IsSuspicious: null,
        Sunvisor: 0,
        SafetyBelt: 1,
        Calling: 0,
        PlateReliability: null,
        PlateCharReliability: null,
        BrandReliability: null,
        StorageUrl1: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        StorageUrl2: null,
        StorageUrl3: null,
        StorageUrl4: null,
        StorageUrl5: null,
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "43100200001320001003022025092418363310162",
              EventSort: 12,
              DeviceID: "43100200001320001003",
              StoragePath: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              Type: "14",
              FileFormat: "Jpeg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20250924183633",
              Data: null
            },
            {
              ImageID: "43100200001320001003022025092418363310163",
              EventSort: 12,
              DeviceID: "43100200001320001003",
              StoragePath: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              Type: "09",
              FileFormat: "Jpeg",
              Width: 800,
              Height: 600,
              ShotTime: "20250924183633",
              Data: null
            }
          ]
        }
      },
      {
        id: 2,
        MotorVehicleID: "431002000013200010030220250924190000101620210163",
        InfoKind: 1,
        SourceID: "43100200001320001003022025092419000010163",
        TollgateID: "43100200001210001004",
        DeviceID: "43100200001320001004",
        deviceName: '城市路口02',
        deviceCode: 'CAM002',
        LeftTopX: 200,
        LeftTopY: 300,
        RightBtmX: 1600,
        RightBtmY: 900,
        MarkTime: "20250924190000",
        AppearTime: "20250924190000",
        DisappearTime: "20250924190030",
        LaneNo: 2,
        HasPlate: true,
        PlateClass: "02",
        PlateColor: "1",
        PlateNo: "京B67890",
        PlateNoAttach: null,
        PlateDescribe: null,
        IsDecked: 0,
        IsAltered: 0,
        IsCovered: 0,
        Speed: 45,
        Direction: "1",
        DrivingStatusCode: null,
        UsingPropertiesCode: null,
        VehicleClass: "K14",
        VehicleBrand: "02",
        VehicleModel: "BMW X5",
        VehicleStyles: "SUV",
        VehicleLength: 4930,
        VehicleWidth: 2004,
        VehicleHeight: 1776,
        VehicleColor: "4",
        VehicleColorDepth: "深色",
        VehicleHood: "正常",
        VehicleTrunk: "正常",
        VehicleWheel: "铝合金轮毂",
        WheelPrintedPattern: "运动型",
        VehicleWindow: "深色贴膜",
        VehicleRoof: "天窗",
        VehicleDoor: "四门",
        SideOfVehicle: "正常",
        CarOfVehicle: "正常",
        RearviewMirror: "电动",
        VehicleChassis: "正常",
        VehicleShielding: null,
        FilmColor: "深灰色",
        IsModified: 0,
        HitMarkInfo: null,
        VehicleBodyDesc: "豪华SUV，状态良好",
        VehicleFrontItem: null,
        DescOfFrontItem: null,
        VehicleRearItem: null,
        DescOfRearItem: null,
        NumOfPassenger: 2,
        PassTime: "20250924190000",
        NameOfPassedRoad: "长安街",
        IsSuspicious: 0,
        Sunvisor: 0,
        SafetyBelt: 1,
        Calling: 0,
        PlateReliability: 95,
        PlateCharReliability: 98,
        BrandReliability: 92,
        StorageUrl1: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        StorageUrl2: null,
        StorageUrl3: null,
        StorageUrl4: null,
        StorageUrl5: null,
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "43100200001320001004022025092419000010163",
              EventSort: 12,
              DeviceID: "43100200001320001004",
              StoragePath: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              Type: "14",
              FileFormat: "Jpeg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20250924190000",
              Data: null
            },
            {
              ImageID: "43100200001320001004022025092419000010164",
              EventSort: 12,
              DeviceID: "43100200001320001004",
              StoragePath: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              Type: "09",
              FileFormat: "Jpeg",
              Width: 800,
              Height: 600,
              ShotTime: "20250924190000",
              Data: null
            }
          ]
        }
      },
      {
        id: 3,
        MotorVehicleID: "431002000013200010030220250924200000101620210164",
        InfoKind: 1,
        SourceID: "43100200001320001003022025092420000010164",
        TollgateID: "43100200001210001005",
        DeviceID: "43100200001320001005",
        deviceName: '停车场出入口03',
        deviceCode: 'CAM003',
        LeftTopX: 100,
        LeftTopY: 200,
        RightBtmX: 1500,
        RightBtmY: 800,
        MarkTime: "20250924200000",
        AppearTime: "20250924200000",
        DisappearTime: "20250924200015",
        LaneNo: 1,
        HasPlate: true,
        PlateClass: "02",
        PlateColor: "1",
        PlateNo: "粤C11111",
        PlateNoAttach: null,
        PlateDescribe: null,
        IsDecked: 0,
        IsAltered: 0,
        IsCovered: 0,
        Speed: 20,
        Direction: "5",
        DrivingStatusCode: null,
        UsingPropertiesCode: null,
        VehicleClass: "K14",
        VehicleBrand: "04",
        VehicleModel: "Accord",
        VehicleStyles: "轿车",
        VehicleLength: 4893,
        VehicleWidth: 1862,
        VehicleHeight: 1449,
        VehicleColor: "2",
        VehicleColorDepth: "中等",
        VehicleHood: "正常",
        VehicleTrunk: "正常",
        VehicleWheel: "标准轮毂",
        WheelPrintedPattern: "标准",
        VehicleWindow: "透明",
        VehicleRoof: "标准",
        VehicleDoor: "四门",
        SideOfVehicle: "正常",
        CarOfVehicle: "正常",
        RearviewMirror: "标准",
        VehicleChassis: "正常",
        VehicleShielding: null,
        FilmColor: null,
        IsModified: 0,
        HitMarkInfo: null,
        VehicleBodyDesc: "标准轿车",
        VehicleFrontItem: null,
        DescOfFrontItem: null,
        VehicleRearItem: null,
        DescOfRearItem: null,
        NumOfPassenger: 1,
        PassTime: "20250924200000",
        NameOfPassedRoad: "停车场内部道路",
        IsSuspicious: 0,
        Sunvisor: 0,
        SafetyBelt: 1,
        Calling: 0,
        PlateReliability: 98,
        PlateCharReliability: 99,
        BrandReliability: 95,
        StorageUrl1: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        StorageUrl2: null,
        StorageUrl3: null,
        StorageUrl4: null,
        StorageUrl5: null,
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "43100200001320001005022025092420000010164",
              EventSort: 12,
              DeviceID: "43100200001320001005",
              StoragePath: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              Type: "14",
              FileFormat: "Jpeg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20250924200000",
              Data: null
            },
            {
              ImageID: "43100200001320001005022025092420000010165",
              EventSort: 12,
              DeviceID: "43100200001320001005",
              StoragePath: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              Type: "09",
              FileFormat: "Jpeg",
              Width: 800,
              Height: 600,
              ShotTime: "20250924200000",
              Data: null
            }
          ]
        }
      }
    ]
    total.value = 3
    loading.value = false
  }, 1000)
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: null,
    deviceName: null,
    deviceCode: null,
    plateNo: null,
    vehicleColor: null,
    vehicleImage: null,
    location: null,
    remark: null
  }
  proxy.resetForm("vehicleRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加车辆采集"
}

/** 查看按钮操作 */
function handleView(row) {
  detailForm.value = { ...row }
  detailOpen.value = true
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  form.value = { ...row }
  open.value = true
  title.value = "修改车辆采集"
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vehicleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        proxy.$modal.msgSuccess("修改成功")
        open.value = false
        getList()
      } else {
        proxy.$modal.msgSuccess("新增成功")
        open.value = false
        getList()
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const vehicleIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除车辆采集编号为"' + vehicleIds + '"的数据项？').then(function () {
    return Promise.resolve()
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('dataCollection/vehicle/export', {
    ...queryParams.value
  }, `vehicle_${new Date().getTime()}.xlsx`)
}

/** 图片上传处理 */
function handleImageChange(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.vehicleImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 车辆颜色映射
const vehicleColorMap = {
  '1': '白色',
  '2': '银色',
  '3': '灰色',
  '4': '黑色',
  '5': '红色',
  '6': '蓝色',
  '7': '黄色',
  '8': '绿色',
  '9': '棕色',
  '99': '其他'
}

// 车辆颜色十六进制映射
const vehicleColorHexMap = {
  '1': '#FFFFFF',
  '2': '#C0C0C0',
  '3': '#808080',
  '4': '#000000',
  '5': '#FF0000',
  '6': '#0000FF',
  '7': '#FFFF00',
  '8': '#008000',
  '9': '#A52A2A',
  '99': '#666666'
}

/** 获取车辆颜色名称 */
function getVehicleColorName(colorCode) {
  return vehicleColorMap[colorCode] || '未知'
}

/** 获取车辆颜色十六进制值 */
function getVehicleColorHex(colorCode) {
  return vehicleColorHexMap[colorCode] || '#666666'
}

/** 格式化时间 */
function formatTime(timeStr) {
  if (!timeStr) return ''
  // 将 20250924183633 格式转换为 2025-09-24 18:36:33
  if (timeStr.length === 14) {
    const year = timeStr.substring(0, 4)
    const month = timeStr.substring(4, 6)
    const day = timeStr.substring(6, 8)
    const hour = timeStr.substring(8, 10)
    const minute = timeStr.substring(10, 12)
    const second = timeStr.substring(12, 14)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  return timeStr
}

// 车牌分类映射
const plateClassMap = {
  '01': '大型汽车号牌',
  '02': '小型汽车号牌',
  '03': '使馆汽车号牌',
  '04': '领馆汽车号牌',
  '05': '境外汽车号牌',
  '06': '外籍汽车号牌',
  '07': '两、三轮摩托车号牌',
  '08': '轻便摩托车号牌',
  '09': '使馆摩托车号牌',
  '10': '领馆摩托车号牌',
  '11': '境外摩托车号牌',
  '12': '外籍摩托车号牌',
  '13': '低速车号牌',
  '14': '拖拉机号牌',
  '15': '挂车号牌',
  '16': '教练汽车号牌',
  '17': '教练摩托车号牌',
  '18': '试验汽车号牌',
  '19': '试验摩托车号牌',
  '20': '临时入境汽车号牌',
  '21': '临时入境摩托车号牌',
  '22': '临时行驶车号牌',
  '23': '警用汽车号牌',
  '24': '警用摩托车号牌',
  '99': '其他号牌'
}

// 车牌颜色映射
const plateColorMap = {
  '1': '蓝色',
  '2': '黄色',
  '3': '白色',
  '4': '黑色',
  '5': '绿色',
  '99': '其他'
}

// 车辆类型映射
const vehicleClassMap = {
  'K11': '大型客车',
  'K12': '重型半挂牵引车',
  'K13': '中型客车',
  'K14': '小型客车',
  'K21': '重型货车',
  'K22': '中型货车',
  'K23': '轻型货车',
  'K31': '重型专项作业车',
  'K32': '中型专项作业车',
  'K33': '轻型专项作业车',
  'K41': '重型半挂车',
  'K42': '中型半挂车',
  'K43': '轻型半挂车'
}

// 车辆品牌映射（部分）
const vehicleBrandMap = {
  '57': '宇通',
  '01': '奥迪',
  '02': '宝马',
  '03': '奔驰',
  '04': '本田',
  '05': '别克',
  '06': '标致',
  '07': '比亚迪',
  '08': '长安',
  '09': '长城',
  '10': '大众'
}

// 行驶方向映射
const directionMap = {
  '1': '上行',
  '2': '下行',
  '3': '左转',
  '4': '右转',
  '5': '直行',
  '6': '掉头',
  '7': '左转弯',
  '8': '右转弯',
  '9': '未知'
}

/** 获取车牌分类名称 */
function getPlateClassName(classCode) {
  return plateClassMap[classCode] || '未知'
}

/** 获取车牌颜色名称 */
function getPlateColorName(colorCode) {
  return plateColorMap[colorCode] || '未知'
}

/** 获取车辆类型名称 */
function getVehicleClassName(classCode) {
  return vehicleClassMap[classCode] || '未知'
}

/** 获取车辆品牌名称 */
function getVehicleBrandName(brandCode) {
  return vehicleBrandMap[brandCode] || '未知'
}

/** 获取行驶方向名称 */
function getDirectionName(directionCode) {
  return directionMap[directionCode] || '未知'
}

/** 获取事件类型名称 */
function getEventSortName(eventSort) {
  const eventMap = {
    '1': '人员出入',
    '2': '车辆出入',
    '3': '物品识别',
    '12': '车辆识别',
    '13': '行为分析',
    '14': '车辆抓拍'
  }
  return eventMap[eventSort] || `事件类型: ${eventSort}`
}

/** 获取图像类型名称 */
function getImageTypeName(imageType) {
  const typeMap = {
    '01': '全景图',
    '02': '局部图',
    '03': '特写图',
    '04': '人脸图',
    '05': '证件照',
    '09': '车牌图',
    '14': '车辆图'
  }
  return typeMap[imageType] || `图像类型: ${imageType}`
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.vehicle-card-container {
  min-height: 400px;
}

.vehicle-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.vehicle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.vehicle-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.status-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.vehicle-info {
  padding: 16px;
  background: #fff;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #606266;
  margin-right: 8px;
  white-space: nowrap;
  font-weight: 500;
}

.info-value {
  color: #303133;
  flex: 1;
  word-break: break-all;
}

.time-value {
  color: #909399;
  font-size: 14px;
  font-weight: normal;
}

.vehicle-actions {
  padding: 12px 16px;
  padding-bottom: 0;
  background: transparent;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

.vehicle-actions .el-button {
  padding: 4px 8px;
  font-size: 13px;
  color: #606266;
  transition: color 0.3s ease;
}

.vehicle-actions .el-button:hover {
  color: #409eff;
}

.vehicle-actions .el-button .el-icon {
  margin-right: 4px;
  font-size: 14px;
}


/* 详情对话框样式 */
.detail-container {
  display: flex;
  gap: 20px;
}

.detail-image-section {
  flex-shrink: 0;
  width: 200px;
}

.detail-vehicle-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.detail-info-section {
  flex: 1;
  min-width: 0;
  height: 400px;
}

.detail-info-section .el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-info-section .el-tabs__content {
  flex: 1;
  overflow: hidden;
}

.detail-info-section .el-tab-pane {
  height: 100%;
  overflow-y: auto;
  padding: 16px 0;
}

.image-info-item {
  margin-bottom: 16px;
}

.image-info-item:last-child {
  margin-bottom: 0;
}

/* 长ID文本样式 */
.long-id-text {
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #606266;
  background-color: #f5f7fa;
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
  max-width: 100%;
}

/* 详情页el-descriptions表格布局 */
:deep(.el-descriptions__body .el-descriptions__table) {
  table-layout: fixed !important;
}
</style>
