<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="区域" prop="areaCode">
                <el-input
                    v-model="queryParams.areaCode"
                    placeholder="请输入区域"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="城市" prop="city">
                <el-input
                    v-model="queryParams.city"
                    placeholder="请输入城市"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="登录用户数" prop="loginUserNum">
                <el-input
                    v-model="queryParams.loginUserNum"
                    placeholder="请输入登录用户数"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户登录数" prop="userLoginNum">
                <el-input
                    v-model="queryParams.userLoginNum"
                    placeholder="请输入用户登录数"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="应用访问数" prop="applicationAccessNum">
                <el-input
                    v-model="queryParams.applicationAccessNum"
                    placeholder="请输入应用访问数"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
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
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    >修改</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    >导出</el-button
                >
            </el-col>
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="areaAccessStatisticsList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
<!--            <el-table-column-->
<!--                label="区域访问情况统计"-->
<!--                align="center"-->
<!--                prop="id"-->
<!--                v-if="true"-->
<!--            />-->
            <el-table-column label="区域" align="center" prop="areaCode" />
            <el-table-column label="城市" align="center" prop="city" />
            <el-table-column
                label="登录用户数"
                align="center"
                prop="loginUserNum"
            />
            <el-table-column
                label="用户登录数"
                align="center"
                prop="userLoginNum"
            />
            <el-table-column
                label="应用访问数"
                align="center"
                prop="applicationAccessNum"
            />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template #default="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改企业活跃度区域访问情况统计对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="区域" prop="areaCode">
                    <el-input
                        v-model="form.areaCode"
                        placeholder="请输入区域"
                    />
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="form.city" placeholder="请输入城市" />
                </el-form-item>
                <el-form-item label="登录用户数" prop="loginUserNum">
                    <el-input
                        v-model="form.loginUserNum"
                        placeholder="请输入登录用户数"
                    />
                </el-form-item>
                <el-form-item label="用户登录数" prop="userLoginNum">
                    <el-input
                        v-model="form.userLoginNum"
                        placeholder="请输入用户登录数"
                    />
                </el-form-item>
                <el-form-item label="应用访问数" prop="applicationAccessNum">
                    <el-input
                        v-model="form.applicationAccessNum"
                        placeholder="请输入应用访问数"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button
                    :loading="buttonLoading"
                    type="primary"
                    @click="submitForm"
                    >确 定</el-button
                >
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listAreaAccessStatistics,
    getAreaAccessStatistics,
    delAreaAccessStatistics,
    addAreaAccessStatistics,
    updateAreaAccessStatistics,
} from '@/api/bss/areaAccessStatistics';

export default {
    name: 'AreaAccessStatistics',
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
            // 企业活跃度区域访问情况统计表格数据
            areaAccessStatisticsList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                areaCode: undefined,
                city: undefined,
                loginUserNum: undefined,
                userLoginNum: undefined,
                applicationAccessNum: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [
                    {
                        required: true,
                        message: '区域访问情况统计不能为空',
                        trigger: 'blur',
                    },
                ],
                areaCode: [
                    {
                        required: true,
                        message: '区域不能为空',
                        trigger: 'blur',
                    },
                ],
                city: [
                    {
                        required: true,
                        message: '城市不能为空',
                        trigger: 'blur',
                    },
                ],
                loginUserNum: [
                    {
                        required: true,
                        message: '登录用户数不能为空',
                        trigger: 'blur',
                    },
                ],
                userLoginNum: [
                    {
                        required: true,
                        message: '用户登录数不能为空',
                        trigger: 'blur',
                    },
                ],
                applicationAccessNum: [
                    {
                        required: true,
                        message: '应用访问数不能为空',
                        trigger: 'blur',
                    },
                ],
                createBy: [
                    {
                        required: true,
                        message: '创建人不能为空',
                        trigger: 'blur',
                    },
                ],
                createTime: [
                    {
                        required: true,
                        message: '创建时间不能为空',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询企业活跃度区域访问情况统计列表 */
        getList() {
            this.loading = true;
            listAreaAccessStatistics(this.queryParams).then((response) => {
                this.areaAccessStatisticsList = response.rows;
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
                areaCode: undefined,
                city: undefined,
                loginUserNum: undefined,
                userLoginNum: undefined,
                applicationAccessNum: undefined,
                createBy: undefined,
                createTime: undefined,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加企业活跃度区域访问情况统计';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getAreaAccessStatistics(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改企业活跃度区域访问情况统计';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateAreaAccessStatistics(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addAreaAccessStatistics(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('新增成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(
                    '是否确认删除企业活跃度区域访问情况统计编号为"' +
                        ids +
                        '"的数据项？',
                )
                .then(() => {
                    this.loading = true;
                    return delAreaAccessStatistics(ids);
                })
                .then(() => {
                    this.loading = false;
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false;
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'bss/areaAccessStatistics/export',
                {
                    ...this.queryParams,
                },
                `areaAccessStatistics_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>
