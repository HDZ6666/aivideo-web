<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>人脸采集管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">
            新增采集
          </el-button>
        </div>
      </template>
      
      <!-- 查询条件 -->
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select style="width: 240px" v-model="queryParams.gender" placeholder="请选择性别" clearable>
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="采集时间" prop="collectTime">
          <el-date-picker
            v-model="queryParams.collectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
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
      <div class="face-card-container" v-loading="loading">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in faceList" :key="item.id">
            <el-card class="face-card" shadow="hover">
              <!-- 人脸图片 -->
              <div class="face-image-container">
                <el-image
                  :src="item.faceImage"
                  :preview-src-list="[item.faceImage]"
                  fit="cover"
                  class="face-image"
                  :preview-teleported="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <!-- 状态标签 -->
                <div class="status-tag">
                  <el-tag :type="item.status === '0' ? 'success' : 'danger'" size="small">
                    {{ item.status === '0' ? '正常' : '异常' }}
                  </el-tag>
                </div>
              </div>

              <!-- 信息内容 -->
              <div class="face-info">
                <div class="info-row">
                  <span class="info-label">设备名称：</span>
                  <span class="info-value">{{ item.deviceName }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">设备编号：</span>
                  <span class="info-value">{{ item.deviceCode }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">性别：</span>
                  <span class="info-value">
                    <el-tag :type="item.gender === '1' ? 'primary' : 'success'" size="small">
                      {{ item.gender === '1' ? '男' : '女' }}
                    </el-tag>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">年龄：</span>
                  <span class="info-value">{{ item.age }}岁</span>
                </div>
                <div class="info-row">
                  <span class="time-value">{{ item.collectTime }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="face-actions">
                <el-button link @click="handleView(item)">
                  <el-icon><View /></el-icon>
                  查看
                </el-button>
                <el-button link @click="handleUpdate(item)">
                  <el-icon><Edit /></el-icon>
                  修改
                </el-button>
                <el-button link @click="handleDelete(item)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="!loading && faceList.length === 0" description="暂无数据" />
      </div>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加或修改人脸采集对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="faceRef" :model="form" :rules="rules" label-width="80px">
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
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别" style="width: 240px">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" :min="1" :max="120" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="人脸图片" prop="faceImage">
          <image-upload v-model="form.faceImage" />
        </el-form-item>
        <el-form-item label="采集地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入采集地点" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 人脸详情对话框 -->
    <el-dialog title="人脸详情" v-model="detailOpen" width="800px" append-to-body>
      <div class="detail-container">
        <!-- 人脸图片 -->
        <div class="detail-image-section">
          <el-image
            :src="detailForm.faceImage || detailForm.SubImageList?.SubImageInfoObject?.[0]?.StoragePath"
            :preview-src-list="[detailForm.faceImage || detailForm.SubImageList?.SubImageInfoObject?.[0]?.StoragePath]"
            fit="cover"
            class="detail-face-image"
            :preview-teleported="true"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
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
                <el-descriptions-item label="人脸ID"  :span="2">
                  <el-text size="small" type="info" class="long-id-text">{{ detailForm.FaceID || detailForm.id }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="设备ID">{{ detailForm.DeviceID || detailForm.deviceCode }}</el-descriptions-item>
                <el-descriptions-item label="设备名称">{{ detailForm.deviceName }}</el-descriptions-item>
                <el-descriptions-item label="性别">
                  <el-tag :type="(detailForm.GenderCode || detailForm.gender) === '1' ? 'primary' : 'success'" size="small">
                    {{ (detailForm.GenderCode || detailForm.gender) === '1' ? '男' : '女' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="年龄范围">
                  {{ detailForm.AgeLowerLimit || detailForm.age }}{{ detailForm.AgeUpLimit && detailForm.AgeLowerLimit !== detailForm.AgeUpLimit ? ` - ${detailForm.AgeUpLimit}` : '' }}岁
                </el-descriptions-item>
                <el-descriptions-item label="出现时间">{{ formatTime(detailForm.FaceAppearTime) || detailForm.collectTime }}</el-descriptions-item>
                <el-descriptions-item label="消失时间">{{ formatTime(detailForm.FaceDisAppearTime) }}</el-descriptions-item>
                <el-descriptions-item label="位置标记时间" :span="2">{{ formatTime(detailForm.LocationMarkTime) }}</el-descriptions-item>
                <el-descriptions-item label="采集地点" :span="2">{{ detailForm.location }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 身份信息 -->
            <el-tab-pane label="身份信息" name="identity">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="姓名">{{ detailForm.Name || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="曾用名">{{ detailForm.UsedName || '无' }}</el-descriptions-item>
                <el-descriptions-item label="别名">{{ detailForm.Alias || '无' }}</el-descriptions-item>
                <el-descriptions-item label="证件类型">{{ getIDTypeName(detailForm.IDType) }}</el-descriptions-item>
                <el-descriptions-item label="证件号码" :span="2">{{ detailForm.IDNumber || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="民族">{{ getEthicName(detailForm.EthicCode) }}</el-descriptions-item>
                <el-descriptions-item label="国籍">{{ getNationalityName(detailForm.NationalityCode) }}</el-descriptions-item>
                <el-descriptions-item label="籍贯">{{ detailForm.NativeCityCode || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="居住地">{{ detailForm.ResidenceAdminDivision || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="职业类别">{{ detailForm.JobCategory || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="口音">{{ detailForm.ChineseAccentCode || '未知' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 外貌特征 -->
            <el-tab-pane label="外貌特征" name="appearance">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="肤色">{{ detailForm.SkinColor || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="发型">{{ detailForm.HairStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="发色">{{ detailForm.HairColor || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="脸型">{{ detailForm.FaceStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="眉毛">{{ detailForm.EyebrowStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="鼻子">{{ detailForm.NoseStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="胡须">{{ detailForm.MustacheStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="嘴唇">{{ detailForm.LipStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="帽子款式">{{ detailForm.CapStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="帽子颜色">{{ detailForm.CapColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="眼镜款式">{{ detailForm.GlassStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="眼镜颜色">{{ detailForm.GlassColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="口罩颜色">{{ detailForm.RespiratorColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="陪同人数">{{ detailForm.AccompanyNumber || '0' }}</el-descriptions-item>
                <el-descriptions-item label="面部特征" :span="2">{{ detailForm.FacialFeature || '无' }}</el-descriptions-item>
                <el-descriptions-item label="体貌特征" :span="2">{{ detailForm.PhysicalFeature || '无' }}</el-descriptions-item>
                <el-descriptions-item label="其他特征" :span="2">{{ detailForm.OtherFeature || '无' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 标识信息 -->
            <el-tab-pane label="标识信息" name="flags">
              <el-descriptions :column="2" border size="small" label-width="100px">
                <el-descriptions-item label="是否司机">
                  <el-tag :type="detailForm.IsDriver ? 'success' : 'info'" size="small">
                    {{ detailForm.IsDriver ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否外国人">
                  <el-tag :type="detailForm.IsForeigner ? 'warning' : 'info'" size="small">
                    {{ detailForm.IsForeigner ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否涉恐人员">
                  <el-tag :type="detailForm.IsSuspectedTerrorist ? 'danger' : 'success'" size="small">
                    {{ detailForm.IsSuspectedTerrorist ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否涉案人员">
                  <el-tag :type="detailForm.IsCriminalInvolved ? 'danger' : 'success'" size="small">
                    {{ detailForm.IsCriminalInvolved ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否在押人员">
                  <el-tag :type="detailForm.IsDetainees ? 'warning' : 'info'" size="small">
                    {{ detailForm.IsDetainees ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否受害人">
                  <el-tag :type="detailForm.IsVictim ? 'danger' : 'info'" size="small">
                    {{ detailForm.IsVictim ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否可疑人员">
                  <el-tag :type="detailForm.IsSuspiciousPerson ? 'warning' : 'success'" size="small">
                    {{ detailForm.IsSuspiciousPerson ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="相似度">{{ detailForm.Similaritydegree || '未知' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 图像信息 -->
            <el-tab-pane label="图像信息" name="image" v-if="detailForm.SubImageList?.SubImageInfoObject?.length">
              <div v-for="(image, index) in detailForm.SubImageList.SubImageInfoObject" :key="index" class="image-info-item">
                <el-descriptions :column="2" border size="small"  label-width="100px" :title="`图像 ${index + 1}`">
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

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailOpen = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="FaceCollection">
import { Picture, View, Edit, Delete } from '@element-plus/icons-vue'
// 导入必要的API和工具函数
// import { listFace, getFace, delFace, addFace, updateFace } from "@/api/dataCollection/face"

const { proxy } = getCurrentInstance()

// 响应式数据
const faceList = ref([])
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
  gender: null,
  collectTime: null
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
  gender: [
    { required: true, message: "性别不能为空", trigger: "change" }
  ],
  age: [
    { required: true, message: "年龄不能为空", trigger: "blur" },
    { type: 'number', min: 1, max: 120, message: "年龄必须在1-120之间", trigger: "blur" }
  ]
}

/** 查询人脸采集列表 */
function getList() {
  loading.value = true
  // TODO: 调用API获取数据
  // listFace(queryParams.value).then(response => {
  //   faceList.value = response.rows
  //   total.value = response.total
  //   loading.value = false
  // })

  // 模拟数据
  setTimeout(() => {
    faceList.value = [
      {
        id: 1,
        FaceID: "130304211911908010010220250919214943000150600014",
        faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '大厅摄像头01',
        deviceCode: 'CAM001',
        DeviceID: "13030421191190801001",
        gender: '1',
        GenderCode: '1',
        age: 28,
        AgeLowerLimit: 25,
        AgeUpLimit: 30,
        collectTime: '2023-12-01 10:30:00',
        FaceAppearTime: "20231201103000",
        FaceDisAppearTime: "20231201103500",
        LocationMarkTime: "20231201103000",
        location: '大厅入口',
        status: '0',
        remark: '正常采集',
        Name: '张三',
        IDType: '1',
        IDNumber: '110101199501011234',
        IsDriver: 0,
        IsForeigner: 0,
        IsSuspectedTerrorist: 0,
        IsCriminalInvolved: 0,
        IsDetainees: 0,
        IsVictim: 0,
        IsSuspiciousPerson: 0,
        HairStyle: '短发',
        HairColor: '黑色',
        SkinColor: '黄色',
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "13030421191190801001022025091921494300013",
              EventSort: 12,
              DeviceID: "34020000001190000001",
              StoragePath: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              Type: "04",
              FileFormat: "png",
              Width: 684,
              Height: 668,
              ShotTime: "20231201103000"
            }
          ]
        }
      },
      {
        id: 2,
        faceImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '门禁摄像头02',
        deviceCode: 'CAM002',
        gender: '0',
        age: 32,
        collectTime: '2023-12-01 11:15:00',
        location: '办公楼门禁',
        status: '0',
        remark: '访客登记'
      },
      {
        id: 3,
        faceImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '停车场摄像头03',
        deviceCode: 'CAM003',
        gender: '1',
        age: 45,
        collectTime: '2023-12-01 12:20:00',
        location: '地下停车场',
        status: '0',
        remark: '车主识别'
      },
      {
        id: 4,
        faceImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '电梯摄像头04',
        deviceCode: 'CAM004',
        gender: '0',
        age: 26,
        collectTime: '2023-12-01 13:45:00',
        location: '电梯间',
        status: '1',
        remark: '异常检测'
      },
      {
        id: 5,
        faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '会议室摄像头05',
        deviceCode: 'CAM005',
        gender: '1',
        age: 38,
        collectTime: '2023-12-01 14:10:00',
        location: '会议室A',
        status: '0',
        remark: '会议签到'
      },
      {
        id: 6,
        faceImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        deviceName: '食堂摄像头06',
        deviceCode: 'CAM006',
        gender: '0',
        age: 29,
        collectTime: '2023-12-01 15:30:00',
        location: '员工食堂',
        status: '0',
        remark: '就餐识别'
      }
    ]
    total.value = 6
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
    gender: null,
    age: null,
    faceImage: null,
    location: null,
    status: "0",
    remark: null
  }
  proxy.resetForm("faceRef")
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
  title.value = "添加人脸采集"
}

/** 查看按钮操作 */
function handleView(row) {
  detailForm.value = { ...row }
  detailOpen.value = true
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  // TODO: 获取详细信息
  // getFace(row.id).then(response => {
  //   form.value = response.data
  //   open.value = true
  //   title.value = "修改人脸采集"
  // })

  // 模拟数据
  form.value = { ...row }
  open.value = true
  title.value = "修改人脸采集"
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["faceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        // TODO: 更新数据
        // updateFace(form.value).then(response => {
        //   proxy.$modal.msgSuccess("修改成功")
        //   open.value = false
        //   getList()
        // })
        proxy.$modal.msgSuccess("修改成功")
        open.value = false
        getList()
      } else {
        // TODO: 添加数据
        // addFace(form.value).then(response => {
        //   proxy.$modal.msgSuccess("新增成功")
        //   open.value = false
        //   getList()
        // })
        proxy.$modal.msgSuccess("新增成功")
        open.value = false
        getList()
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const faceIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除人脸采集编号为"' + faceIds + '"的数据项？').then(function() {
    // TODO: 删除数据
    // return delFace(faceIds)
    return Promise.resolve()
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('dataCollection/face/export', {
    ...queryParams.value
  }, `face_${new Date().getTime()}.xlsx`)
}

/** 格式化时间 */
function formatTime(timeStr) {
  if (!timeStr) return '未知'
  if (timeStr.length === 14) {
    // 格式：20250917000000 -> 2025-09-17 00:00:00
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

/** 获取证件类型名称 */
function getIDTypeName(idType) {
  const typeMap = {
    '1': '身份证',
    '2': '护照',
    '3': '军官证',
    '4': '驾驶证',
    '5': '其他'
  }
  return typeMap[idType] || '未知'
}

/** 获取民族名称 */
function getEthicName(ethicCode) {
  if (!ethicCode) return '未知'
  // 这里可以根据实际的民族编码映射
  const ethicMap = {
    '01': '汉族',
    '02': '蒙古族',
    '03': '回族',
    '04': '藏族',
    '05': '维吾尔族'
    // ... 可以添加更多民族编码
  }
  return ethicMap[ethicCode] || `民族编码: ${ethicCode}`
}

/** 获取国籍名称 */
function getNationalityName(nationalityCode) {
  if (!nationalityCode) return '未知'
  const nationalityMap = {
    '156': '中国',
    '840': '美国',
    '392': '日本',
    '410': '韩国'
    // ... 可以添加更多国家编码
  }
  return nationalityMap[nationalityCode] || `国家编码: ${nationalityCode}`
}

/** 获取事件类型名称 */
function getEventSortName(eventSort) {
  const eventMap = {
    '1': '人员出入',
    '2': '车辆出入',
    '3': '物品识别',
    '12': '人脸识别',
    '13': '行为分析'
    // ... 可以添加更多事件类型
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
    '05': '证件照'
  }
  return typeMap[imageType] || `图像类型: ${imageType}`
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.face-card-container {
  min-height: 400px;
}

.face-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.face-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.face-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.face-image {
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
}

.face-info {
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
  font-weight: 500;
  min-width: 70px;
  flex-shrink: 0;
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

.face-actions {
  padding: 12px 16px;
  padding-bottom: 0;
  background: transparent;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

.face-actions .el-button {
  padding: 4px 8px;
  font-size: 13px;
  color: #606266;
  transition: color 0.3s ease;
}

.face-actions .el-button:hover {
  color: #409eff;
}

.face-actions .el-button .el-icon {
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

.detail-face-image {
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
