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
            <el-form-item label="资源项编码" prop="resProCode">
                <el-input
                    v-model="queryParams.resProCode"
                    placeholder="请输入资源项编码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="资源项名称" prop="resProName">
                <el-input
                    v-model="queryParams.resProName"
                    placeholder="请输入资源项名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="资源项目内容" prop="resProContent">
                <el-input
                    v-model="queryParams.resProContent"
                    placeholder="请输入资源项目内容"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="数据目录" prop="dataCatalog">
                <el-input
                    v-model="queryParams.dataCatalog"
                    placeholder="请输入数据目录"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="资源项分类" prop="resProClassifyId">
                <el-input
                    v-model="queryParams.resProClassifyId"
                    placeholder="请输入资源项分类"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="资源项URL" prop="resProUrl">
                <el-input
                    v-model="queryParams.resProUrl"
                    placeholder="请输入资源项URL"
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
                    v-hasPermi="['bss:resourcesProject:export']"
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
            :data="resourcesProjectList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="主键id"
                align="center"
                prop="id"
                v-if="true"
            />
            <el-table-column
                label="资源项编码"
                align="center"
                prop="resProCode"
            />
            <el-table-column
                label="资源项名称"
                align="center"
                prop="resProName"
            />
            <el-table-column
                label="资源项目内容"
                align="center"
                prop="resProContent"
            />
            <el-table-column
                label="数据目录"
                align="center"
                prop="dataCatalog"
            />
            <el-table-column
                label="资源项分类"
                align="center"
                prop="resProClassifyId"
            />
            <el-table-column
                label="资源项URL"
                align="center"
                prop="resProUrl"
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

        <!-- 添加或修改资源项管理对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="资源项编码" prop="resProCode">
                    <el-input
                        v-model="form.resProCode"
                        placeholder="请输入资源项编码"
                    />
                </el-form-item>
                <el-form-item label="资源项名称" prop="resProName">
                    <el-input
                        v-model="form.resProName"
                        placeholder="请输入资源项名称"
                    />
                </el-form-item>
                <el-form-item label="资源项目内容" prop="resProContent">
                    <el-input
                        v-model="form.resProContent"
                        placeholder="请输入资源项目内容"
                    />
                </el-form-item>
                <el-form-item label="数据目录" prop="dataCatalog">
                    <el-input
                        v-model="form.dataCatalog"
                        placeholder="请输入数据目录"
                    />
                </el-form-item>
                <el-form-item label="资源项分类" prop="resProClassifyId">
                    <el-input
                        v-model="form.resProClassifyId"
                        placeholder="请输入资源项分类"
                    />
                </el-form-item>
                <el-form-item label="资源项URL" prop="resProUrl">
                    <el-input
                        v-model="form.resProUrl"
                        placeholder="请输入资源项URL"
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
    listResourcesProject,
    getResourcesProject,
    delResourcesProject,
    addResourcesProject,
    updateResourcesProject,
} from '@/api/bss/resourcesProject';

export default {
    name: 'ResourcesProject',
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
            // 资源项管理表格数据
            resourcesProjectList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                resProCode: undefined,
                resProName: undefined,
                resProContent: undefined,
                dataCatalog: undefined,
                resProClassifyId: undefined,
                resProUrl: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [
                    {
                        required: true,
                        message: '主键id不能为空',
                        trigger: 'blur',
                    },
                ],
                resProCode: [
                    {
                        required: true,
                        message: '资源项编码不能为空',
                        trigger: 'blur',
                    },
                ],
                resProName: [
                    {
                        required: true,
                        message: '资源项名称不能为空',
                        trigger: 'blur',
                    },
                ],
                resProContent: [
                    {
                        required: true,
                        message: '资源项目内容不能为空',
                        trigger: 'blur',
                    },
                ],
                dataCatalog: [
                    {
                        required: true,
                        message: '数据目录不能为空',
                        trigger: 'blur',
                    },
                ],
                resProClassifyId: [
                    {
                        required: true,
                        message: '资源项分类不能为空',
                        trigger: 'blur',
                    },
                ],
                resProUrl: [
                    {
                        required: true,
                        message: '资源项URL不能为空',
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
                updateBy: [
                    {
                        required: true,
                        message: '修改人不能为空',
                        trigger: 'blur',
                    },
                ],
                updateTime: [
                    {
                        required: true,
                        message: '修改时间不能为空',
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
        /** 查询资源项管理列表 */
        getList() {
            this.loading = true;
            listResourcesProject(this.queryParams).then((response) => {
                this.resourcesProjectList = response.rows;
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
                resProCode: undefined,
                resProName: undefined,
                resProContent: undefined,
                dataCatalog: undefined,
                resProClassifyId: undefined,
                resProUrl: undefined,
                createTime: undefined,
                createBy: undefined,
                updateBy: undefined,
                updateTime: undefined,
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
            this.title = '添加资源项管理';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getResourcesProject(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改资源项管理';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateResourcesProject(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addResourcesProject(this.form)
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
                .confirm('是否确认删除资源项管理编号为"' + ids + '"的数据项？')
                .then(() => {
                    this.loading = true;
                    return delResourcesProject(ids);
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
                'bss/resourcesProject/export',
                {
                    ...this.queryParams,
                },
                `resourcesProject_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>
