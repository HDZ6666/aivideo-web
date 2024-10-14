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
            <el-form-item label="监测区名称" prop="monitorAreaName">
                <el-input
                    v-model="queryParams.monitorAreaName"
                    placeholder="请输入监测区名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="城市" prop="cityCode">
                <el-input
                    v-model="queryParams.cityCode"
                    placeholder="请输入城市"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="城镇" prop="townCode">
                <el-input
                    v-model="queryParams.townCode"
                    placeholder="请输入城镇"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input
                    v-model="queryParams.address"
                    placeholder="请输入地址"
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
                    v-hasPermi="['bss:monitorArea:add']"
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
                    v-hasPermi="['bss:monitorArea:edit']"
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
                    v-hasPermi="['bss:monitorArea:remove']"
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
                    v-hasPermi="['bss:monitorArea:export']"
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
            :data="monitorAreaList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="监测区id"
                align="center"
                prop="id"
                v-if="true"
            />
            <el-table-column
                label="监测区名称"
                align="center"
                prop="monitorAreaName"
            />
            <el-table-column label="城市" align="center" prop="cityCode" />
            <el-table-column label="城镇" align="center" prop="townCode" />
            <el-table-column label="地址" align="center" prop="address" />
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

        <!-- 添加或修改企业监测区标绘对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="监测区名称" prop="monitorAreaName">
                    <el-input
                        v-model="form.monitorAreaName"
                        placeholder="请输入监测区名称"
                    />
                </el-form-item>
                <el-form-item label="城市" prop="cityCode">
                    <el-input
                        v-model="form.cityCode"
                        placeholder="请输入城市"
                    />
                </el-form-item>
                <el-form-item label="城镇" prop="townCode">
                    <el-input
                        v-model="form.townCode"
                        placeholder="请输入城镇"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入地址" />
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
    listMonitorArea,
    getMonitorArea,
    delMonitorArea,
    addMonitorArea,
    updateMonitorArea,
} from '@/api/bss/monitorArea';

export default {
    name: 'MonitorArea',
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
            // 企业监测区标绘表格数据
            monitorAreaList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                monitorAreaName: undefined,
                cityCode: undefined,
                townCode: undefined,
                address: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [
                    {
                        required: true,
                        message: '监测区id不能为空',
                        trigger: 'blur',
                    },
                ],
                monitorAreaName: [
                    {
                        required: true,
                        message: '监测区名称不能为空',
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
                cityCode: [
                    {
                        required: true,
                        message: '城市不能为空',
                        trigger: 'blur',
                    },
                ],
                townCode: [
                    {
                        required: true,
                        message: '城镇不能为空',
                        trigger: 'blur',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '地址不能为空',
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
        /** 查询企业监测区标绘列表 */
        getList() {
            this.loading = true;
            listMonitorArea(this.queryParams).then((response) => {
                this.monitorAreaList = response.rows;
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
                monitorAreaName: undefined,
                createBy: undefined,
                createTime: undefined,
                cityCode: undefined,
                townCode: undefined,
                address: undefined,
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
            this.title = '添加企业监测区标绘';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const id = row.id || this.ids;
            getMonitorArea(id).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = '修改企业监测区标绘';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.id != null) {
                        updateMonitorArea(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addMonitorArea(this.form)
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
                    '是否确认删除企业监测区标绘编号为"' + ids + '"的数据项？',
                )
                .then(() => {
                    this.loading = true;
                    return delMonitorArea(ids);
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
                'bss/monitorArea/export',
                {
                    ...this.queryParams,
                },
                `monitorArea_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>
