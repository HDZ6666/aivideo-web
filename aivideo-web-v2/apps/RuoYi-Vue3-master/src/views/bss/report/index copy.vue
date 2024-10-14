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
            <el-form-item label="序号" prop="rowNum">
                <el-input
                    v-model="queryParams.rowNum"
                    placeholder="请输入序号"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="报告标题" prop="reportTitle">
                <el-input
                        v-model="queryParams.reportTitle"
                        placeholder="请输入报告报告标题"
                        clearable
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>

            <el-form-item label="报告格式" prop="reportFormat">
                <el-input
                    v-model="queryParams.reportFormat"
                    placeholder="请输入报告格式"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="模版id" prop="templateId">
                <el-input
                    v-model="queryParams.templateId"
                    placeholder="请输入模版id"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="报告字数" prop="reportStrNum">
                <el-input
                    v-model="queryParams.reportStrNum"
                    placeholder="请输入报告字数"
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
            :data="reportList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="报告id"
                align="center"
                prop="id"
                v-if="true"
            />
            <el-table-column label="序号" align="center" prop="rowNum" />
            <el-table-column
                    label="报告标题"
                    align="center"
                    prop="reportTitle"
            />
            <el-table-column
                label="报告格式"
                align="center"
                prop="reportFormat"
            />
            <el-table-column label="模版id" align="center" prop="templateId" />
            <el-table-column
                label="报告字数"
                align="center"
                prop="reportStrNum"
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

        <!-- 添加或修改报告对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="序号" prop="rowNum">
                    <el-input v-model="form.rowNum" placeholder="请输入序号" />
                </el-form-item>
                <el-form-item label="报告标题" prop="reportTitle">
                    <el-input
                            v-model="form.reportTitle"
                            placeholder="请输入报告格式"
                    />
                </el-form-item>

                <el-form-item label="报告格式" prop="reportFormat">
                    <el-input
                        v-model="form.reportFormat"
                        placeholder="请输入报告格式"
                    />
                </el-form-item>
                <el-form-item label="模版id" prop="templateId">
                    <el-input
                        v-model="form.templateId"
                        placeholder="请输入模版id"
                    />
                </el-form-item>
                <el-form-item label="报告字数" prop="reportStrNum">
                    <el-input
                        v-model="form.reportStrNum"
                        placeholder="请输入报告字数"
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
    listReport,
    getReport,
    delReport,
    addReport,
    updateReport,
} from '@/api/bss/report';

export default {
    name: 'Report',
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
            // 报告表格数据
            reportList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                rowNum: undefined,
                reportTitle: undefined,
                reportFormat: undefined,
                templateId: undefined,
                reportStrNum: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [
                    {
                        required: true,
                        message: '报告id不能为空',
                        trigger: 'blur',
                    },
                ],
                rowNum: [
                    {
                        required: true,
                        message: '序号不能为空',
                        trigger: 'blur',
                    },
                ],
                reportTitle: [
                    {
                        required: true,
                        message: '报告标题不能为空',
                        trigger: 'blur',
                    },
                ],
                reportFormat: [
                    {
                        required: true,
                        message: '报告格式不能为空',
                        trigger: 'blur',
                    },
                ],
                templateId: [
                    {
                        required: true,
                        message: '模版id不能为空',
                        trigger: 'blur',
                    },
                ],
                reportStrNum: [
                    {
                        required: true,
                        message: '报告字数不能为空',
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
                createBy: [
                    {
                        required: true,
                        message: '创建人不能为空',
                        trigger: 'blur',
                    },
                ],
                delFlag: [
                    {
                        required: true,
                        message: '删除标识不能为空',
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
        /** 查询报告列表 */
        getList() {
            this.loading = true;
            listReport(this.queryParams).then((response) => {
                this.reportList = response.rows;
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
                rowNum: undefined,
                reportTitle: undefined,
                reportFormat: undefined,
                templateId: undefined,
                reportStrNum: undefined,
                createTime: undefined,
                createBy: undefined,
                delFlag: undefined,
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
            this.title = '添加报告';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getReport(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改报告';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateReport(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addReport(this.form)
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
                .confirm('是否确认删除报告编号为"' + ids + '"的数据项？')
                .then(() => {
                    this.loading = true;
                    return delReport(ids);
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
                'bss/report/export',
                {
                    ...this.queryParams,
                },
                `report_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>
