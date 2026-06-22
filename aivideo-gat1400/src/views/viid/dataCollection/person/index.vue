<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>人员采集管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">
            新增采集
          </el-button>
        </div>
      </template>
      
      <!-- 查询条件 -->
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="姓名" prop="personName">
          <el-input
            v-model="queryParams.personName"
            placeholder="请输入人员姓名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="queryParams.idCard"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter="handleQuery"
          />
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
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
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
      <div class="person-card-container" v-loading="loading">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in personList" :key="item.id">
            <el-card class="person-card" shadow="hover">
              <!-- 人员头像 -->
              <div class="person-image-container">
                <el-image
                  :src="item.avatar"
                  :preview-src-list="[item.avatar]"
                  fit="cover"
                  class="person-image"
                  :preview-teleported="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><User /></el-icon>
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
              <div class="person-info">
                <div class="info-row">
                  <span class="info-label">设备名称：</span>
                  <span class="info-value">{{ item.deviceName }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">设备编号：</span>
                  <span class="info-value">{{ item.deviceCode }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">姓名：</span>
                  <span class="info-value">{{ item.Name || '未知' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">性别：</span>
                  <span class="info-value">
                    <el-tag :type="item.GenderCode === '1' ? 'primary' : 'success'" size="small">
                      {{ item.GenderCode === '1' ? '男' : '女' }}
                    </el-tag>
                  </span>
                </div>
                <div class="info-row ">
                  <span class="time-value">{{ formatTime(item.PersonAppearTime) }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="person-actions">
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
        <el-empty v-if="!loading && personList.length === 0" description="暂无数据" />
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

    <!-- 添加或修改人员采集对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="personRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="personName">
              <el-input v-model="form.personName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别" style="width: 240px">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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

    <!-- 人员详情对话框 -->
    <el-dialog title="人员详情" v-model="detailOpen" width="800px" append-to-body>
      <div class="detail-container">
        <!-- 人员头像 -->
        <div class="detail-image-section">
          <el-image
            :src="detailForm.avatar"
            :preview-src-list="[detailForm.avatar]"
            fit="cover"
            class="detail-person-image"
            :preview-teleported="true"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><User /></el-icon>
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
                <el-descriptions-item label="人员ID" :span="2">
                  <el-text size="small" type="info" class="long-id-text">{{ detailForm.PersonID }}xxxxxxxxxxxxxxxxxx</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="信息类别">{{ detailForm.InfoKind }}</el-descriptions-item>
                <el-descriptions-item label="来源ID">
                  <span class="long-id-text">{{ detailForm.SourceID }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="设备ID">{{ detailForm.DeviceID }}</el-descriptions-item>
                <el-descriptions-item label="设备名称">{{ detailForm.deviceName }}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{ detailForm.Name || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="性别">
                  <el-tag :type="detailForm.GenderCode === '1' ? 'primary' : 'success'" size="small">
                    {{ detailForm.GenderCode === '1' ? '男' : '女' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="年龄范围">
                  {{ detailForm.AgeLowerLimit }}{{ detailForm.AgeUpLimit && detailForm.AgeLowerLimit !== detailForm.AgeUpLimit ? ` - ${detailForm.AgeUpLimit}` : '' }}岁
                </el-descriptions-item>
                <el-descriptions-item label="出现时间">{{ formatTime(detailForm.PersonAppearTime) }}</el-descriptions-item>
                <el-descriptions-item label="消失时间">{{ formatTime(detailForm.PersonDisAppearTime) }}</el-descriptions-item>
                <el-descriptions-item label="位置标记时间" :span="2">{{ formatTime(detailForm.LocationMarkTime) }}</el-descriptions-item>
                <el-descriptions-item label="位置坐标" :span="2">
                  ({{ detailForm.LeftTopX }}, {{ detailForm.LeftTopY }}) - ({{ detailForm.RightBtmX }}, {{ detailForm.RightBtmY }})
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 身份信息 -->
            <el-tab-pane label="身份信息" name="identity">
              <el-descriptions :column="2" border label-width="100px" size="small">
                <el-descriptions-item label="曾用名">{{ detailForm.UsedName || '无' }}</el-descriptions-item>
                <el-descriptions-item label="别名">{{ detailForm.Alias || '无' }}</el-descriptions-item>
                <el-descriptions-item label="证件类型">{{ getIDTypeName(detailForm.IDType) }}</el-descriptions-item>
                <el-descriptions-item label="证件号码">{{ detailForm.IDNumber }}</el-descriptions-item>
                <el-descriptions-item label="护照类型">{{ detailForm.PassportType || '无' }}</el-descriptions-item>
                <el-descriptions-item label="移民类型">{{ detailForm.ImmigrantTypeCode || '无' }}</el-descriptions-item>
                <el-descriptions-item label="民族">{{ getEthicName(detailForm.EthicCode) }}</el-descriptions-item>
                <el-descriptions-item label="国籍">{{ getNationalityName(detailForm.NationalityCode) }}</el-descriptions-item>
                <el-descriptions-item label="籍贯">{{ detailForm.NativeCityCode || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="居住地">{{ detailForm.ResidenceAdminDivision || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="口音">{{ detailForm.ChineseAccentCode || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="所属组织">{{ detailForm.PersonOrg || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="职业类别">{{ detailForm.JobCategory || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="陪同人数">{{ detailForm.AccompanyNumber || '0' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 联系信息 -->
            <el-tab-pane label="联系信息" name="contact">
              <el-descriptions :column="2" border label-width="100px" size="small">
                <el-descriptions-item label="手机号码">{{ detailForm.phoneNumber || detailForm.PhoneNumber }}</el-descriptions-item>
                <el-descriptions-item label="固定电话">{{ detailForm.TelephoneNumber || '无' }}</el-descriptions-item>
                <el-descriptions-item label="电子邮箱">{{ detailForm.EmailAddress || '无' }}</el-descriptions-item>
                <el-descriptions-item label="QQ号码">{{ detailForm.QQNumber || '无' }}</el-descriptions-item>
                <el-descriptions-item label="微信号">{{ detailForm.WeChatNumber || '无' }}</el-descriptions-item>
                <el-descriptions-item label="微博账号">{{ detailForm.WeiboAccount || '无' }}</el-descriptions-item>
                <el-descriptions-item label="现住址" :span="2">{{ detailForm.address || detailForm.ResidenceAddress }}</el-descriptions-item>
                <el-descriptions-item label="户籍地址" :span="2">{{ detailForm.RegisteredAddress || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="紧急联系人">{{ detailForm.EmergencyContact || '无' }}</el-descriptions-item>
                <el-descriptions-item label="紧急联系电话">{{ detailForm.EmergencyPhone || '无' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 外貌特征 -->
            <el-tab-pane label="外貌特征" name="appearance">
              <el-descriptions :column="2" border label-width="100px" size="small">
                <el-descriptions-item label="身高范围">
                  {{ detailForm.HeightLowerLimit }}{{ detailForm.HeightUpLimit && detailForm.HeightLowerLimit !== detailForm.HeightUpLimit ? ` - ${detailForm.HeightUpLimit}` : '' }}cm
                </el-descriptions-item>
                <el-descriptions-item label="体型">{{ getBodyTypeName(detailForm.BodyType) }}</el-descriptions-item>
                <el-descriptions-item label="肤色">{{ detailForm.SkinColor || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="发型">{{ detailForm.HairStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="发色">{{ detailForm.HairColor || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="脸型">{{ detailForm.FaceStyle || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="面部特征">{{ detailForm.FacialFeature || '无' }}</el-descriptions-item>
                <el-descriptions-item label="体貌特征">{{ detailForm.PhysicalFeature || '无' }}</el-descriptions-item>
                <el-descriptions-item label="身体特征">{{ detailForm.BodyFeature || '无' }}</el-descriptions-item>
                <el-descriptions-item label="特殊标记">{{ detailForm.BodySpeciallMark || '无' }}</el-descriptions-item>
                <el-descriptions-item label="姿态">{{ detailForm.Gesture || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="状态">{{ detailForm.Status || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="习惯性动作">{{ detailForm.HabitualMovement || '无' }}</el-descriptions-item>
                <el-descriptions-item label="行为">{{ detailForm.Behavior || '未知' }}</el-descriptions-item>
                <el-descriptions-item label="行为描述" :span="2">{{ detailForm.BehaviorDescription || '无' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 服饰配件 -->
            <el-tab-pane label="服饰配件" name="clothing">
              <el-descriptions :column="2" border label-width="100px" size="small">
                <el-descriptions-item label="附属物">{{ detailForm.Appendant || '无' }}</el-descriptions-item>
                <el-descriptions-item label="附属物描述">{{ detailForm.AppendantDescription || '无' }}</el-descriptions-item>
                <el-descriptions-item label="雨伞颜色">{{ detailForm.UmbrellaColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="口罩颜色">{{ detailForm.RespiratorColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="帽子款式">{{ detailForm.CapStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="帽子颜色">{{ detailForm.CapColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="眼镜款式">{{ detailForm.GlassStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="眼镜颜色">{{ detailForm.GlassColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="围巾颜色">{{ detailForm.ScarfColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="包款式">{{ detailForm.BagStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="包颜色">{{ detailForm.BagColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="上衣款式">{{ detailForm.CoatStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="上衣长度">{{ detailForm.CoatLength || '无' }}</el-descriptions-item>
                <el-descriptions-item label="上衣颜色">{{ detailForm.CoatColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="裤子款式">{{ detailForm.TrousersStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="裤子颜色">{{ detailForm.TrousersColor || '无' }}</el-descriptions-item>
                <el-descriptions-item label="裤子长度">{{ detailForm.TrousersLen || '无' }}</el-descriptions-item>
                <el-descriptions-item label="鞋子款式">{{ detailForm.ShoesStyle || '无' }}</el-descriptions-item>
                <el-descriptions-item label="鞋子颜色">{{ detailForm.ShoesColor || '无' }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <!-- 标识信息 -->
            <el-tab-pane label="标识信息" name="flags">
              <el-descriptions :column="2" border label-width="100px" size="small">
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
                <el-descriptions-item label="风险等级">
                  <el-tag :type="getRiskLevelType(detailForm.RiskLevel)" size="small">
                    {{ getRiskLevelName(detailForm.RiskLevel) }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
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

<script setup name="PersonCollection">
import { User, View, Edit, Delete } from '@element-plus/icons-vue'
// 导入必要的API和工具函数
// import { listPerson, getPerson, delPerson, addPerson, updatePerson } from "@/api/dataCollection/person"

const { proxy } = getCurrentInstance()

// 响应式数据
const personList = ref([])
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
  pageSize: 10,
  personName: null,
  idCard: null,
  collectTime: null,
  status: null
})

// 表单数据
const form = ref({})
const detailForm = ref({})

// 表单验证规则
const rules = {
  personName: [
    { required: true, message: "姓名不能为空", trigger: "blur" }
  ],
  idCard: [
    { required: true, message: "身份证号不能为空", trigger: "blur" },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: "身份证号格式不正确", trigger: "blur" }
  ],
  phoneNumber: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "手机号码格式不正确", trigger: "blur" }
  ]
}

/** 查询人员采集列表 */
function getList() {
  loading.value = true
  // TODO: 调用API获取数据
  // 模拟数据（按照标准Schema结构）
  setTimeout(() => {
    personList.value = [
      {
        // 基础标识信息
        id: 1,
        PersonID: "130304211911908010010220250919214943000150600001",
        InfoKind: 2,
        SourceID: "13030421191190801001022025091921494300001",
        DeviceID: "13030421191190801001",

        // 位置坐标信息
        LeftTopX: 100,
        LeftTopY: 50,
        RightBtmX: 300,
        RightBtmY: 400,
        LocationMarkTime: "20231201103000",

        // 时间信息
        PersonAppearTime: "20231201103000",
        PersonDisAppearTime: "20231201103500",

        // 设备信息（用于卡片显示）
        deviceName: '大厅摄像头01',
        deviceCode: 'CAM001',

        // 身份证件信息
        IDType: "1",
        IDNumber: "110101199503151234",
        PassportType: null,
        ImmigrantTypeCode: null,

        // 基本个人信息
        Name: "张三",
        UsedName: "张小三",
        Alias: null,
        GenderCode: "1",
        AgeUpLimit: 30,
        AgeLowerLimit: 25,
        EthicCode: "01",
        NationalityCode: "156",
        NativeCityCode: "110100",
        ResidenceAdminDivision: "110105",
        ChineseAccentCode: "11",

        // 社会属性信息
        PersonOrg: "北京科技有限公司",
        JobCategory: "专业技术人员",
        AccompanyNumber: 0,

        // 体貌特征信息
        HeightUpLimit: 180,
        HeightLowerLimit: 170,
        BodyType: "2",
        SkinColor: "黄色",
        HairStyle: "短发",
        HairColor: "黑色",
        FaceStyle: "椭圆形",
        FacialFeature: "无明显特征",
        PhysicalFeature: "体型匀称",
        BodyFeature: "无特殊标记",
        BodySpeciallMark: null,

        // 行为姿态信息
        Gesture: "站立",
        Status: "正常",
        HabitualMovement: null,
        Behavior: "正常行走",
        BehaviorDescription: "正常通行",

        // 服饰配件信息
        Appendant: null,
        AppendantDescription: null,
        UmbrellaColor: null,
        RespiratorColor: null,
        CapStyle: null,
        CapColor: null,
        GlassStyle: null,
        GlassColor: null,
        ScarfColor: null,
        BagStyle: "双肩包",
        BagColor: "黑色",
        CoatStyle: "西装",
        CoatLength: "中长",
        CoatColor: "深蓝色",
        TrousersStyle: "西裤",
        TrousersColor: "黑色",
        TrousersLen: "长裤",
        ShoesStyle: "皮鞋",
        ShoesColor: "黑色",

        // 身份标识信息（必填）
        IsDriver: 1,
        IsForeigner: 0,
        IsSuspectedTerrorist: 0,
        IsCriminalInvolved: 0,
        IsDetainees: 0,
        IsVictim: 0,
        IsSuspiciousPerson: 0,

        // 涉恐相关信息
        SuspectedTerroristNumber: null,

        // 涉案相关信息
        CriminalInvolvedSpecilisationCode: null,
        CrimeMethod: null,
        CrimeCharacterCode: null,
        EscapedCriminalNumber: null,

        // 在押人员信息
        DetentionHouseCode: null,
        DetaineesIdentity: null,
        DetaineesSpecialIdentity: null,
        MemberTypeCode: null,

        // 受害人信息
        VictimType: null,
        InjuredDegree: null,
        CorpseConditionCode: null,

        // 图像信息
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "13030421191190801001022025091921494300001",
              EventSort: 12,
              DeviceID: "13030421191190801001",
              StoragePath: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              Type: "04",
              FileFormat: "jpg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20231201103000"
            }
          ]
        },

        // 兼容字段
        status: '0',
        remark: '正常采集'
      },
      {
        // 基础标识信息
        id: 2,
        PersonID: "130304211911908010010220250919214943000150600002",
        InfoKind: 2,
        SourceID: "13030421191190801001022025091921494300002",
        DeviceID: "13030421191190801002",

        // 位置坐标信息
        LeftTopX: 150,
        LeftTopY: 80,
        RightBtmX: 350,
        RightBtmY: 450,
        LocationMarkTime: "20231201111500",

        // 时间信息
        PersonAppearTime: "20231201111500",
        PersonDisAppearTime: "20231201112000",

        // 设备信息（用于卡片显示）
        deviceName: '访客接待摄像头',
        deviceCode: 'CAM002',

        // 身份证件信息
        IDType: "1",
        IDNumber: "110101199108201234",
        PassportType: null,
        ImmigrantTypeCode: null,

        // 基本个人信息
        Name: "李四",
        UsedName: null,
        Alias: "小李",
        GenderCode: "2",
        AgeUpLimit: 35,
        AgeLowerLimit: 30,
        EthicCode: "01",
        NationalityCode: "156",
        NativeCityCode: "310100",
        ResidenceAdminDivision: "310115",
        ChineseAccentCode: "31",

        // 社会属性信息
        PersonOrg: "上海贸易公司",
        JobCategory: "商业服务人员",
        AccompanyNumber: 1,

        // 体貌特征信息
        HeightUpLimit: 170,
        HeightLowerLimit: 165,
        BodyType: "1",
        SkinColor: "黄色",
        HairStyle: "长发",
        HairColor: "棕色",
        FaceStyle: "圆形",
        FacialFeature: "双眼皮",
        PhysicalFeature: "身材苗条",
        BodyFeature: "无特殊标记",
        BodySpeciallMark: null,

        // 行为姿态信息
        Gesture: "行走",
        Status: "正常",
        HabitualMovement: null,
        Behavior: "快速行走",
        BehaviorDescription: "访客登记",

        // 服饰配件信息
        Appendant: "手提包",
        AppendantDescription: "黑色皮质手提包",
        UmbrellaColor: null,
        RespiratorColor: null,
        CapStyle: null,
        CapColor: null,
        GlassStyle: null,
        GlassColor: null,
        ScarfColor: "红色",
        BagStyle: "手提包",
        BagColor: "黑色",
        CoatStyle: "风衣",
        CoatLength: "中长",
        CoatColor: "米色",
        TrousersStyle: "牛仔裤",
        TrousersColor: "蓝色",
        TrousersLen: "长裤",
        ShoesStyle: "高跟鞋",
        ShoesColor: "黑色",

        // 身份标识信息（必填）
        IsDriver: 0,
        IsForeigner: 0,
        IsSuspectedTerrorist: 0,
        IsCriminalInvolved: 0,
        IsDetainees: 0,
        IsVictim: 0,
        IsSuspiciousPerson: 0,

        // 图像信息
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "13030421191190801001022025091921494300002",
              EventSort: 12,
              DeviceID: "13030421191190801002",
              StoragePath: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              Type: "04",
              FileFormat: "jpg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20231201111500"
            }
          ]
        },

        // 兼容字段
        status: '0',
        remark: '访客登记'
      },
      {
        // 基础标识信息
        id: 3,
        PersonID: "130304211911908010010220250919214943000150600003",
        InfoKind: 2,
        SourceID: "13030421191190801001022025091921494300003",
        DeviceID: "13030421191190801003",

        // 位置坐标信息
        LeftTopX: 200,
        LeftTopY: 100,
        RightBtmX: 400,
        RightBtmY: 500,
        LocationMarkTime: "20231201142000",

        // 时间信息
        PersonAppearTime: "20231201142000",
        PersonDisAppearTime: "20231201142500",

        // 设备信息（用于卡片显示）
        deviceName: '会议室摄像头',
        deviceCode: 'CAM003',

        // 身份证件信息
        IDType: "1",
        IDNumber: "110101197806121234",
        PassportType: null,
        ImmigrantTypeCode: null,

        // 基本个人信息
        Name: "王五",
        UsedName: null,
        Alias: null,
        GenderCode: "1",
        AgeUpLimit: 50,
        AgeLowerLimit: 40,
        EthicCode: "01",
        NationalityCode: "156",
        NativeCityCode: "440100",
        ResidenceAdminDivision: "440106",
        ChineseAccentCode: "44",

        // 社会属性信息
        PersonOrg: "广州建设集团",
        JobCategory: "企业管理人员",
        AccompanyNumber: 2,

        // 体貌特征信息
        HeightUpLimit: 185,
        HeightLowerLimit: 175,
        BodyType: "3",
        SkinColor: "黄色",
        HairStyle: "短发",
        HairColor: "黑色",
        FaceStyle: "方形",
        FacialFeature: "浓眉",
        PhysicalFeature: "体格健壮",
        BodyFeature: "左手有疤痕",
        BodySpeciallMark: "左手背疤痕",

        // 行为姿态信息
        Gesture: "坐立",
        Status: "正常",
        HabitualMovement: "习惯性摸下巴",
        Behavior: "商务交谈",
        BehaviorDescription: "参加会议讨论",

        // 服饰配件信息
        Appendant: "公文包",
        AppendantDescription: "棕色皮质公文包",
        UmbrellaColor: null,
        RespiratorColor: null,
        CapStyle: null,
        CapColor: null,
        GlassStyle: "框架眼镜",
        GlassColor: "黑色",
        ScarfColor: null,
        BagStyle: "公文包",
        BagColor: "棕色",
        CoatStyle: "西装",
        CoatLength: "标准",
        CoatColor: "深灰色",
        TrousersStyle: "西裤",
        TrousersColor: "深灰色",
        TrousersLen: "长裤",
        ShoesStyle: "皮鞋",
        ShoesColor: "棕色",

        // 身份标识信息（必填）
        IsDriver: 1,
        IsForeigner: 0,
        IsSuspectedTerrorist: 0,
        IsCriminalInvolved: 0,
        IsDetainees: 0,
        IsVictim: 0,
        IsSuspiciousPerson: 0,

        // 图像信息
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        SubImageList: {
          SubImageInfoObject: [
            {
              ImageID: "13030421191190801001022025091921494300003",
              EventSort: 12,
              DeviceID: "13030421191190801003",
              StoragePath: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              Type: "04",
              FileFormat: "jpg",
              Width: 1920,
              Height: 1080,
              ShotTime: "20231201142000"
            }
          ]
        },

        // 兼容字段
        status: '0',
        remark: '会议参与者'
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
    personName: null,
    gender: null,
    idCard: null,
    phoneNumber: null,
    avatar: null,
    address: null,
    status: "0",
    remark: null
  }
  proxy.resetForm("personRef")
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
  title.value = "添加人员采集"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  // TODO: 获取详细信息
  form.value = { ...row }
  open.value = true
  title.value = "修改人员采集"
}

/** 查看按钮操作 */
function handleView(row) {
  detailForm.value = { ...row }
  detailOpen.value = true
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["personRef"].validate(valid => {
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
  const personIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除人员采集编号为"' + personIds + '"的数据项？').then(function() {
    return Promise.resolve()
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('dataCollection/person/export', {
    ...queryParams.value
  }, `person_${new Date().getTime()}.xlsx`)
}

/** 格式化身份证号 */
function formatIdCard(idCard) {
  if (!idCard) return '未知'
  if (idCard.length === 18) {
    return idCard.substring(0, 6) + '****' + idCard.substring(14)
  }
  return idCard
}

/** 格式化手机号 */
function formatPhone(phone) {
  if (!phone) return '未知'
  if (phone.length === 11) {
    return phone.substring(0, 3) + '****' + phone.substring(7)
  }
  return phone
}

/** 格式化时间 */
function formatTime(timeStr) {
  if (!timeStr) return '未知'
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

/** 格式化日期 */
function formatDate(dateStr) {
  if (!dateStr) return '未知'
  if (dateStr.length === 8) {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${year}-${month}-${day}`
  }
  return dateStr
}

/** 计算年龄 */
function calculateAge(birthDate) {
  if (!birthDate) return '未知'
  const birth = new Date(formatDate(birthDate))
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
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
  const ethicMap = {
    '01': '汉族',
    '02': '蒙古族',
    '03': '回族',
    '04': '藏族',
    '05': '维吾尔族'
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
  }
  return nationalityMap[nationalityCode] || `国家编码: ${nationalityCode}`
}

/** 获取政治面貌名称 */
function getPoliticalStatusName(statusCode) {
  if (!statusCode) return '未知'
  const statusMap = {
    '01': '中共党员',
    '02': '中共预备党员',
    '03': '共青团员',
    '13': '群众'
  }
  return statusMap[statusCode] || `政治面貌编码: ${statusCode}`
}

/** 获取婚姻状况名称 */
function getMaritalStatusName(statusCode) {
  if (!statusCode) return '未知'
  const statusMap = {
    '10': '未婚',
    '20': '已婚',
    '21': '初婚',
    '22': '再婚',
    '23': '复婚',
    '30': '丧偶',
    '40': '离婚',
    '90': '未说明'
  }
  return statusMap[statusCode] || `婚姻状况编码: ${statusCode}`
}

/** 获取学历名称 */
function getEducationName(educationCode) {
  if (!educationCode) return '未知'
  const educationMap = {
    '10': '研究生',
    '20': '大学本科',
    '30': '大学专科',
    '40': '中等专业学校',
    '50': '技工学校',
    '60': '高中',
    '70': '初中',
    '80': '小学',
    '90': '文盲或半文盲'
  }
  return educationMap[educationCode] || `学历编码: ${educationCode}`
}

/** 获取血型名称 */
function getBloodTypeName(bloodType) {
  if (!bloodType) return '未知'
  const typeMap = {
    'A': 'A型',
    'B': 'B型',
    'AB': 'AB型',
    'O': 'O型'
  }
  return typeMap[bloodType] || bloodType
}

/** 获取风险等级名称 */
function getRiskLevelName(riskLevel) {
  const levelMap = {
    1: '低风险',
    2: '中风险',
    3: '高风险',
    4: '极高风险'
  }
  return levelMap[riskLevel] || '未知'
}

/** 获取风险等级标签类型 */
function getRiskLevelType(riskLevel) {
  const typeMap = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'danger'
  }
  return typeMap[riskLevel] || 'info'
}

/** 获取体型名称 */
function getBodyTypeName(bodyType) {
  const typeMap = {
    '1': '瘦弱',
    '2': '标准',
    '3': '肥胖',
    '4': '强壮'
  }
  return typeMap[bodyType] || '未知'
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

.person-card-container {
  min-height: 400px;
}

.person-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.person-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.person-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.person-image {
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

.person-info {
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
  padding-bottom: 0;
}

.person-actions {
  padding: 12px 16px;
  background: transparent;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

.person-actions .el-button {
  padding: 4px 8px;
  font-size: 13px;
  color: #606266;
  transition: color 0.3s ease;
}

.person-actions .el-button:hover {
  color: #409eff;
}

.person-actions .el-button .el-icon {
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

.detail-person-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.detail-info-section {
  flex: 1;
  min-width: 0;
  height: 420px;
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
