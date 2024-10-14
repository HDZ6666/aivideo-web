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
            <el-form-item label="模版标题" prop="templateTitle">
                <el-input
                    v-model="queryParams.templateTitle"
                    placeholder="请输入模版标题"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-input
                    v-model="queryParams.state"
                    placeholder="请输入状态"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="模版格式" prop="templateFormat">
                <el-input
                    v-model="queryParams.templateFormat"
                    placeholder="请输入模版格式"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="最后更新时间">
                <el-date-picker
                    v-model="daterangeLastUpdateTime"
                    style="width: 240px"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
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
                    v-hasPermi="['bss:templateDraft:add']"
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
                    v-hasPermi="['bss:templateDraft:edit']"
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
                    v-hasPermi="['bss:templateDraft:remove']"
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
                    v-hasPermi="['bss:templateDraft:export']"
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
            :data="templateDraftList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="模版草稿id"
                align="center"
                prop="id"
                v-if="true"
            />
            <el-table-column label="序号" align="center" prop="lineNum" />
            <el-table-column
                label="模版标题"
                align="center"
                prop="templateTitle"
            />
            <el-table-column label="状态" align="center" prop="state" />
            <el-table-column
                label="文件地址url"
                align="center"
                prop="fileUrl"
            />
            <el-table-column
                label="模版格式"
                align="center"
                prop="templateFormat"
            />
            <el-table-column
                label="最后更新时间"
                align="center"
                prop="lastUpdateTime"
                width="180"
            >
                <template #default="scope">
                    <span>{{
                        parseTime(scope.row.lastUpdateTime, '{y}-{m}-{d}')
                    }}</span>
                </template>
            </el-table-column>
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
                        v-hasPermi="['bss:templateDraft:edit']"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['bss:templateDraft:remove']"
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

        <!-- 添加或修改模版草稿对话框 -->
        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="序号" prop="lineNum">
                    <el-input v-model="form.lineNum" placeholder="请输入序号" />
                </el-form-item>
                <el-form-item label="模版标题" prop="templateTitle">
                    <el-input
                        v-model="form.templateTitle"
                        placeholder="请输入模版标题"
                    />
                </el-form-item>
                <el-form-item label="模版格式" prop="templateFormat">
                    <el-input
                        v-model="form.templateFormat"
                        placeholder="请输入模版格式"
                    />
                </el-form-item>
                <el-form-item label="创建人" prop="createBy">
                    <el-input
                        v-model="form.createBy"
                        placeholder="请输入创建人"
                    />
                </el-form-item>
                <el-form-item label="最后更新时间" prop="lastUpdateTime">
                    <el-date-picker
                        clearable
                        v-model="form.lastUpdateTime"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择最后更新时间"
                    >
                    </el-date-picker>
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
    listTemplateDraft,
    getTemplateDraft,
    delTemplateDraft,
    addTemplateDraft,
    updateTemplateDraft,
} from '@/api/templateDraft/templateDraft';

export default {
    name: 'TemplateDraft',
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
            // 模版草稿表格数据
            templateDraftList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 最后更新时间时间范围
            daterangeLastUpdateTime: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                templateTitle: undefined,
                state: undefined,
                templateFormat: undefined,
                createBy: undefined,
                lastUpdateTime: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [
                    {
                        required: true,
                        message: '模版草稿id不能为空',
                        trigger: 'blur',
                    },
                ],
                lineNum: [
                    {
                        required: true,
                        message: '序号不能为空',
                        trigger: 'blur',
                    },
                ],
                templateTitle: [
                    {
                        required: true,
                        message: '模版标题不能为空',
                        trigger: 'blur',
                    },
                ],
                state: [
                    {
                        required: true,
                        message: '状态不能为空',
                        trigger: 'blur',
                    },
                ],
                fileUrl: [
                    {
                        required: true,
                        message: '文件地址url不能为空',
                        trigger: 'blur',
                    },
                ],
                templateFormat: [
                    {
                        required: true,
                        message: '模版格式不能为空',
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
                lastUpdateTime: [
                    {
                        required: true,
                        message: '最后更新时间不能为空',
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
        /** 查询模版草稿列表 */
        getList() {
            this.loading = true;
            this.queryParams.params = {};
            if (
                null != this.daterangeLastUpdateTime &&
                '' != this.daterangeLastUpdateTime
            ) {
                this.queryParams.params['beginLastUpdateTime'] =
                    this.daterangeLastUpdateTime[0];
                this.queryParams.params['endLastUpdateTime'] =
                    this.daterangeLastUpdateTime[1];
            }
            listTemplateDraft(this.queryParams).then((response) => {
                this.templateDraftList = response.rows;
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
                lineNum: undefined,
                templateTitle: undefined,
                state: undefined,
                fileUrl: undefined,
                templateFormat: undefined,
                createBy: undefined,
                lastUpdateTime: undefined,
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
            this.daterangeLastUpdateTime = [];
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
            this.title = '添加模版草稿';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getTemplateDraft(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改模版草稿';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateTemplateDraft(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addTemplateDraft(this.form)
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
                .confirm('是否确认删除模版草稿编号为"' + ids + '"的数据项？')
                .then(() => {
                    this.loading = true;
                    return delTemplateDraft(ids);
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
                'templateDraft/templateDraft/export',
                {
                    ...this.queryParams,
                },
                `templateDraft_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    align-items: center;
    justify-content: right;
}
</style>
