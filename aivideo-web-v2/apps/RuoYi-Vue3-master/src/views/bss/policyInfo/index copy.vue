<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="政策信息编号" prop="policyCode">
        <el-input
          v-model="queryParams.policyCode"
          placeholder="请输入政策信息编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="政策名称" prop="policyName">
        <el-input
          v-model="queryParams.policyName"
          placeholder="请输入政策名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="政策领域" prop="policyArea">
        <el-input
          v-model="queryParams.policyArea"
          placeholder="请输入政策领域"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="政策主要内容" prop="policyAreaContent">
        <el-input
          v-model="queryParams.policyAreaContent"
          placeholder="请输入政策主要内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="policyInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="政策信息管理表id" align="center" prop="id" v-if="true"/>
      <el-table-column label="政策信息编号" align="center" prop="policyCode" />
      <el-table-column label="政策名称" align="center" prop="policyName" />
      <el-table-column label="政策领域" align="center" prop="policyArea" />
      <el-table-column label="政策主要内容" align="center" prop="policyAreaContent" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改企业活跃度政策信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="政策信息编号" prop="policyCode">
          <el-input v-model="form.policyCode" placeholder="请输入政策信息编号" />
        </el-form-item>
        <el-form-item label="政策名称" prop="policyName">
          <el-input v-model="form.policyName" placeholder="请输入政策名称" />
        </el-form-item>
        <el-form-item label="政策领域" prop="policyArea">
          <el-input v-model="form.policyArea" placeholder="请输入政策领域" />
        </el-form-item>
        <el-form-item label="政策主要内容" prop="policyAreaContent">
          <el-input v-model="form.policyAreaContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPolicyInfo, getPolicyInfo, delPolicyInfo, addPolicyInfo, updatePolicyInfo } from "@/api/bss/policyInfo";

export default {
  name: "PolicyInfo",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 企业活跃度政策信息管理表格数据
      policyInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        policyCode: undefined,
        policyName: undefined,
        policyArea: undefined,
        policyAreaContent: undefined,
        createTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "政策信息管理表id不能为空", trigger: "blur" }
        ],
        policyCode: [
          { required: true, message: "政策信息编号不能为空", trigger: "blur" }
        ],
        policyName: [
          { required: true, message: "政策名称不能为空", trigger: "blur" }
        ],
        policyArea: [
          { required: true, message: "政策领域不能为空", trigger: "blur" }
        ],
        policyAreaContent: [
          { required: true, message: "政策主要内容不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询企业活跃度政策信息管理列表 */
    getList() {
      this.loading = true;
      listPolicyInfo(this.queryParams).then(response => {
        this.policyInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        policyCode: undefined,
        policyName: undefined,
        policyArea: undefined,
        policyAreaContent: undefined,
        createBy: undefined,
        createTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加企业活跃度政策信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getPolicyInfo(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改企业活跃度政策信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePolicyInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addPolicyInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除企业活跃度政策信息管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delPolicyInfo(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bss/policyInfo/export', {
        ...this.queryParams
      }, `policyInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
