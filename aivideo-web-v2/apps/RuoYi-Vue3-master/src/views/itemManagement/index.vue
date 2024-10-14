<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <advanced-search
            :config="config"
            v-model:value="queryParams"
            @onQuery="handleQuery"
            @onReset="resetQuery"
        >
            <template #dateRange="row">
                <el-date-picker
                    v-model="dateRange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 250px"
                ></el-date-picker>
            </template>
        </advanced-search>
        <!-- 表格数据 -->
        <content-module>
            <template #operation>
                <el-button
                    type="primary"
                    icon="Plus"
                    @click="handleAdd"
                    v-hasPermi="['system:menu:add']"
                    >新增</el-button
                >
                <el-button
                    type="primary"
                    icon="Edit"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['system:role:edit']"
                    >修改</el-button
                >
                <el-button
                    plain
                    icon="Download"
                    @click="handleExport"
                    v-hasPermi="['system:role:export']"
                    >批量导出</el-button
                >
                <el-button
                    type="danger"
                    icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['system:role:remove']"
                    >批量删除</el-button
                >
            </template>
            <el-table
                v-loading="loading"
                :data="itemManagementList"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="数据项编码" align="center" prop="id" />
                <el-table-column
                    label="数据项名称"
                    align="center"
                    prop="name"
                />
                <el-table-column
                    label="数据项内容"
                    align="center"
                    prop="content"
                />
                <el-table-column
                    label="数据目录"
                    align="center"
                    prop="directory"
                />
                <el-table-column
                    label="数据项关联关系"
                    align="center"
                    prop="association"
                />
                <el-table-column
                    label="创建时间"
                    align="center"
                    prop="createTime"
                    width="180"
                >
                    <!-- <template #default="scope">
                        <span>{{
                            parseTime(scope.row.createTime, '{y}-{m}-{d}')
                        }}</span>
                    </template> -->
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
                            v-hasPermi="['system:itemManagement:edit']"
                            >修改</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            link
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:itemManagement:remove']"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"
        /></content-module>
        <!-- 添加或修改数据项管理对话框 -->
        <el-dialog :title="title" v-model="open" width="70%" append-to-body>
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="120px"
                label-position="top"
            >
                <el-form-item label="数据项名称" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入数据项名称"
                    />
                </el-form-item>
                <el-form-item label="数据项内容">
                    <!-- <editor v-model="form.content" :min-height="192" /> -->
                    <el-input
                        v-model="form.content"
                        placeholder="请输入数据项内容"
                    />
                </el-form-item>
                <el-form-item label="数据目录" prop="directory">
                    <el-input
                        v-model="form.directory"
                        placeholder="请输入数据目录"
                    />
                </el-form-item>
                <el-form-item label="数据项关联关系" prop="association">
                    <el-input
                        v-model="form.association"
                        placeholder="请输入数据项关联关系"
                    />
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker
                        clearable
                        v-model="form.createTime"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择创建时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button
                        :loading="buttonLoading"
                        type="primary"
                        @click="submitForm"
                        >确 定</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    listItemManagement,
    getItemManagement,
    delItemManagement,
    addItemManagement,
    updateItemManagement,
} from '@/api/system/itemManagement';
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
export default {
    name: 'ItemManagement',
    components: { AdvancedSearch, SearchModule, ContentModule },
    data() {
        return {
            /** 搜索栏*/
            config: [
                {
                    type: 'el-input',
                    prop: 'name',
                    label: '数据项名称',
                    attrs: {},
                },
                {
                    type: 'el-input',
                    prop: 'id',
                    label: '数据项编码',
                    attrs: {},
                },
                {
                    type: 'el-input',
                    prop: 'directory',
                    label: '数据目录',
                },
                {
                    type: 'el-date-picker',
                    prop: 'dateRange',
                    width:"500px",
                    attrs:{
                        valueFormat: 'YYYY-MM-DD',
                        type: 'datetimerange',
                        dateFormat: 'YYYY-MM-DD',
                    },
                    label: '创建时间',
                },
            ],
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
            // 数据项管理表格数据
            itemManagementList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                id: undefined,
                name: undefined,
                directory: undefined,
            },
            dateRange: [],
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询数据项管理列表 */
        getList() {
            this.loading = true;
            const body = {
                ...this.queryParams,
                beginTime: this.dateRange[0],
                endTime: this.dateRange[1],
            };
            listItemManagement(body).then((response) => {
                console.log('response', response);
                this.itemManagementList = response.rows;
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
                name: undefined,
                content: undefined,
                directory: undefined,
                association: undefined,
                createBy: undefined,
                createTime: undefined,
                updateBy: undefined,
                updateTime: undefined,
                remark: undefined,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置搜索栏 */
        initForm() {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = 10;
            this.queryParams.id = '';
            this.queryParams.name = '';
            this.queryParams.directory = undefined;
            this.dateRange = [];
        },
        /** 重置按钮操作 */
        resetQuery() {
            // this.resetForm('queryForm');
            this.initForm();
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
            this.title = '添加数据项管理';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getItemManagement(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改数据项管理';
            });
        },
        /** 提交按钮 */
        submitForm() {
            console.log(this.form, '999999');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateItemManagement(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addItemManagement(this.form)
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
                .confirm('是否确认删除数据项管理编号为"' + ids + '"的数据项？')
                .then(() => {
                    this.loading = true;
                    return delItemManagement(ids);
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
                'system/itemManagement/export',
                {
                    ...this.queryParams,
                },
                `itemManagement_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>
