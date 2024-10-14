<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <advanced-search
            :config="config"
            v-model:value="queryParams"
            @onQuery="handleQuery"
            @onReset="resetQuery"
        >
            <template #city="row">
                <el-select
                    v-model="queryParams.city"
                    placeholder="请选择地市"
                    clearable
                    style="width: 250px"
                >
                    <el-option
                        v-for="dict in sys_city_code"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </template>
            <template #unit="row">
                <el-select
                    v-model="queryParams.unit"
                    placeholder="请选择单位"
                    clearable
                    style="width: 250px"
                >
                    <el-option
                        v-for="dict in sys_dept_unit"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </template>
            <template #dateRange="row">
                <el-date-picker
                    v-model="dateRange"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 250px"
                ></el-date-picker>
            </template>
        </advanced-search>
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
                :data="userList"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column
                    label="用户编号"
                    align="center"
                    key="userId"
                    prop="userId"
                    v-if="columns[0].visible"
                />
                <el-table-column
                    label="用户名称"
                    align="center"
                    key="userName"
                    prop="userName"
                    v-if="columns[1].visible"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="登录账号"
                    align="center"
                    key="nickName"
                    prop="nickName"
                    v-if="columns[2].visible"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="地市"
                    align="center"
                    key="city"
                    prop="dept.city"
                    v-if="columns[3].visible"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        {{ translateDict(sys_city_code, scope.row.city) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="单位"
                    align="center"
                    key="unit"
                    prop="unit"
                    v-if="columns[4].visible"
                    width="120"
                >
                    <template #default="scope">
                        {{ translateDict(sys_dept_unit, scope.row.unit) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="手机号"
                    align="center"
                    key="phonenumber"
                    prop="phonenumber"
                    v-if="columns[5].visible"
                    width="120"
                >
                    <template #default="scope">
                        {{ scope.row.phonenumber }}
                        <!-- {{ translateDict(sys_dept_phonenumber, scope.row.phonenumber) }} -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    key="status"
                    v-if="columns[6].visible"
                >
                    <template #default="scope">
                        <dict-tag
                            :options="sys_normal_disable"
                            :value="scope.row.status"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    align="center"
                    prop="createTime"
                    v-if="columns[7].visible"
                    width="160"
                >
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="300"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-button
                            v-if="scope.row.userId !== 1"
                            link
                            type="primary"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:user:edit']"
                            >修改</el-button
                        >
                        <el-button
                            v-if="scope.row.userId !== 1"
                            link
                            type="primary"
                            @click="handleResetPwd(scope.row)"
                            v-hasPermi="['system:user:resetPwd']"
                            >重置密码</el-button
                        >
                        <el-button
                            v-if="scope.row.userId !== 1"
                            link
                            type="primary"
                            @click="handleAuthRole(scope.row)"
                            v-hasPermi="['system:user:edit']"
                            >分配角色</el-button
                        >
                        <el-button
                            v-if="scope.row.userId !== 1"
                            link
                            type="danger"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:user:remove']"
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
            />
        </content-module>

        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" v-model="open" width="70%" append-to-body>
            <el-form
                :model="form"
                :rules="rules"
                ref="userRef"
                label-width="80px"
                label-position="top"
            >
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="登录账号" prop="nickName">
                            <el-input
                                v-model="form.nickName"
                                placeholder="请输入登录账号"
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            v-if="form.userId == undefined"
                            label="用户名称"
                            prop="userName"
                        >
                            <el-input
                                v-model="form.userName"
                                placeholder="请输入用户名称"
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            v-if="form.userId == undefined"
                            label="用户密码"
                            prop="password"
                        >
                            <el-input
                                v-model="form.password"
                                placeholder="请输入用户密码"
                                type="password"
                                maxlength="20"
                                show-password
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="角色">
                            <el-select
                                v-model="form.roleIds"
                                multiple
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in roleOptions"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId"
                                    :disabled="item.status == 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地市" prop="city">
                            <el-select
                                v-model="form.city"
                                placeholder="请选择地市"
                                clearable
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="dict in sys_city_code"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input
                                v-model="form.phonenumber"
                                placeholder="请输入手机号码"
                                maxlength="11"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="邮箱" prop="email">
                            <el-input
                                v-model="form.email"
                                placeholder="请输入邮箱"
                                maxlength="50"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio
                                    v-for="dict in sys_normal_disable"
                                    :key="dict.value"
                                    :label="dict.value"
                                    >{{ dict.label }}</el-radio
                                >
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位">
                            <el-select
                                v-model="form.unit"
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in sys_dept_unit"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.status == 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="备注">
                            <el-input
                                v-model="form.remark"
                                type="textarea"
                                placeholder="请输入内容"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="submitForm"
                        >确 定</el-button
                    >
                </div>
            </template>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog
            :title="upload.title"
            v-model="upload.open"
            width="400px"
            append-to-body
        >
            <el-upload
                ref="uploadRef"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip text-center">
                        <div class="el-upload__tip">
                            <el-checkbox
                                v-model="upload.updateSupport"
                            />是否更新已经存在的用户数据
                        </div>
                        <span>仅允许导入xls、xlsx格式文件。</span>
                        <el-link
                            type="primary"
                            :underline="false"
                            style="font-size: 12px; vertical-align: baseline"
                            @click="importTemplate"
                            >下载模板</el-link
                        >
                    </div>
                </template>
            </el-upload>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm"
                        >确 定</el-button
                    >
                    <el-button @click="upload.open = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 角色分配 -->
        <e-dialog
            :open="dialogOpen"
            :title="dialogTitle"
            :width="'70%'"
            :dialogLoading="dialogLoading"
            @close="handleDialogClose"
            @submit="handleDialogSubmit"
        >
            <e-form
                ref="eformRef"
                v-model:formModel="formModel"
                :formConfigs="formConfigs"
            ></e-form>
            <div class="section-title">分配信息</div>
            <el-table
                ref="roleRef"
                v-loading="roleListLoading"
                :row-key="getRowKey"
                @row-click="clickRow"
                :data="roleList"
                @selection-change="handleSelectionChangeRole"
            >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column
                    label="角色编号"
                    align="center"
                    key="roleId"
                    prop="roleId"
                />
                <el-table-column
                    label="角色名称"
                    align="center"
                    key="roleName"
                    prop="roleName"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="创建时间"
                    align="center"
                    key="createTime"
                    prop="createTime"
                />
            </el-table>
            <!-- <pagination
                v-show="roleListTotal > 0"
                :total="roleListTotal"
                v-model:page="roleListQueryParams.pageNum"
                v-model:limit="roleListQueryParams.pageSize"
                @pagination="getRoleList"
            /> -->
        </e-dialog>
    </div>
</template>

<script setup name="User">
import AdvancedSearch from '@/components/AdvancedSearch';
import { SearchModule, ContentModule } from '@/components/ContentLayout';
import EDialog from '@/components/e-dialog';
import EForm from '@/components/e-form';
import { useDialog } from '@/components/e-dialog/useDialog.js';
import { useForm } from '@/components/e-form/useForm.js';
import { useTablePagination } from '@/hook/useTable';
import { getToken } from '@/utils/auth';
import {
    changeUserStatus,
    listUser,
    resetUserPwd,
    delUser,
    getUser,
    updateUser,
    addUser,
    deptTreeSelect,
    getAuthRole,
    updateAuthRole,
} from '@/api/system/user';
import { listRole } from '@/api/system/role';
import { computed, reactive } from 'vue';

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex, sys_city_code, sys_dept_unit ,sys_dept_phonenumber} =
    proxy.useDict(
        'sys_normal_disable',
        'sys_user_sex',
        'sys_city_code',
        'sys_dept_unit',
        'sys_dept_phonenumber'
    );
const translateDict = (data, key) => {
    const Obj = {};
    data.forEach((ele) => {
        Obj[ele.value]= ele.label;
    });
    return Obj[key];
};
/** 搜索栏*/
const config = [
    {
        type: 'el-input',
        prop: 'userName',
        label: '用户名称',
        attrs: {},
    },
    {
        type: 'el-input',
        prop: 'phonenumber',
        label: '手机号码',
        attrs: {},
    },
    {
        type: 'el-select',
        prop: 'city',
        label: '地市',
    },
    {
        type: 'el-date-picker',
        prop: 'dateRange',
        label: '创建时间',
    },
    {
        type: 'el-select',
        prop: 'unit',
        label: '单位',
        attrs: {},
    },
    {
        type: 'el-input',
        prop: 'nickName',
        label: '登录账号',
        attrs: {},
    },
];
const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const deptName = ref('');
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: '',
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: 'Bearer ' + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData',
});
// 列显隐信息
const columns = ref([
    { key: 0, label: `用户编号`, visible: true },
    { key: 1, label: `用户名称`, visible: true },
    { key: 2, label: `用户昵称`, visible: true },
    { key: 3, label: `部门`, visible: true },
    { key: 4, label: `单位`, visible: true },
    { key: 5, label: `手机号码`, visible: true },
    { key: 6, label: `状态`, visible: true },
    { key: 7, label: `创建时间`, visible: true },
]);

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        city:undefined,
        nickName:undefined,
        unit:undefined
    },
    rules: {
        userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
            {
                min: 2,
                max: 20,
                message: '用户名称长度必须介于 2 和 20 之间',
                trigger: 'blur',
            },
        ],
        nickName: [
            { required: true, message: '用户昵称不能为空', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '用户密码不能为空', trigger: 'blur' },
            {
                min: 5,
                max: 20,
                message: '用户密码长度必须介于 5 和 20 之间',
                trigger: 'blur',
            },
        ],
        email: [
            {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'change'],
            },
        ],
        phonenumber: [
            {
                pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                message: '请输入正确的手机号码',
                trigger: 'blur',
            },
        ],
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, (val) => {
    proxy.$refs['deptTreeRef'].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
    deptTreeSelect().then((response) => {
        deptOptions.value = response.data;
    });
}
/** 查询用户列表 */
function getList() {
    const pageNum  = Math.ceil(total.value/(queryParams.value.pageSize||10))
    if(pageNum>=queryParams.value.pageNum||pageNum==0){
        listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(
            (res) => {
                loading.value = false;
                userList.value = res.rows;
                total.value = res.total;
            },
        );
    }
    
}
/** 节点单击事件 */
function handleNodeClick(data) {
    queryParams.value.deptId = data.id;
    handleQuery();
}
/** 重置搜索栏 */
function initForm() {
    queryParams.value.pageNum = 1;
    queryParams.value.pageSize = 10;
    queryParams.value.userName = undefined;
    queryParams.value.phonenumber = undefined;
    queryParams.value.status = undefined;
    queryParams.value.city = undefined
    queryParams.value.nickName = undefined
    queryParams.value.unit = undefined
    dateRange.value = [];
}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}
/** 重置按钮操作 */
function resetQuery() {
    initForm();
    handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
    const userIds = row.userId || ids.value;
    proxy.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
            return delUser(userIds);
        })
        .then(() => {
            getList();
            proxy.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        'system/user/export',
        {
            ...queryParams.value,
        },
        `user_${new Date().getTime()}.xlsx`,
    );
}
/** 用户状态修改  */
function handleStatusChange(row) {
    let text = row.status === '0' ? '启用' : '停用';
    proxy.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗?')
        .then(function () {
            return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
            proxy.$modal.msgSuccess(text + '成功');
        })
        .catch(function () {
            row.status = row.status === '0' ? '1' : '0';
        });
}
/** 更多操作 */
function handleCommand(command, row) {
    switch (command) {
        case 'handleResetPwd':
            handleResetPwd(row);
            break;
        case 'handleAuthRole':
            handleAuthRole(row);
            break;
        default:
            break;
    }
}
/** 角色分配 */
// function handleAuthRole(row) {
//     const userId = row.userId;
//     router.push('/system/user-auth/role/' + userId);
// }
/** 查询角色列表 */
const roleList = ref([]);
const roleListLoading = ref(false);
const roleIds = ref([]);
// const roleListTotal = ref(0);
// const roleListQueryParams = reactive({
//     pageNum: 1,
//     pageSize: 10,
// });
// function getRoleList() {
//     roleListLoading.value = true;
//     listRole(roleListQueryParams).then((response) => {
//         roleList.value = response.rows;
//         roleListTotal.value = response.total;
//         roleListLoading.value = false;
//     });
// }
const dialogConfigs = {
    title: '分配角色',
    onSubmit: () => {
        submitFormRole();
    },
    onClose: () => {},
};
const {
    open: dialogOpen,
    title: dialogTitle,
    handleOpen,
    dialogLoading,
    handleDialogSubmit,
    handleDialogClose,
} = useDialog(dialogConfigs);
const { eformRef, formModel, formConfigs } = useForm();
formConfigs.value = [
    {
        label: '用户昵称',
        prop: 'nickName',
        type: 'input',
        span: 12,
        disabled: true,
    },
    {
        label: '登录账号',
        prop: 'userName',
        type: 'input',
        span: 12,
        disabled: true,
    },
];
const getAuthRoleDetail = (userId) => {
    if (userId) {
        roleListLoading.value = true;
        getAuthRole(userId).then((response) => {
            formModel.value = response.data.user;
            roleList.value = response.data.roles;
            // roleListTotal.value = roleList.value.length;
            nextTick(() => {
                roleList.value.forEach((row) => {
                    if (row.flag) {
                        proxy.$refs['roleRef'].toggleRowSelection(row);
                    }
                });
            });
            roleListLoading.value = false;
        });
    }
};
/** 单击选中行数据 */
function clickRow(row) {
    proxy.$refs['roleRef'].toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChangeRole(selection) {
    roleIds.value = selection.map((item) => item.roleId);
    console.log(roleIds.value, 'roleIds.value');
}
/** 保存选中的数据编号 */
function getRowKey(row) {
    return row.roleId;
}
/** 提交按钮 */
function submitFormRole() {
    const userId = formModel.value.userId;
    const rIds = roleIds.value.join(',');
    updateAuthRole({ userId: userId, roleIds: rIds }).then((response) => {
        proxy.$modal.msgSuccess('授权成功');
        handleDialogClose();
    });
}
function handleAuthRole(row) {
    const userId = row.userId;
    // getRoleList();
    getAuthRoleDetail(userId);
    handleOpen();
}
/** 重置密码按钮操作 */
function handleResetPwd(row) {
    proxy
        .$prompt('请输入"' + row.userName + '"的新密码', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            inputPattern: /^.{5,20}$/,
            inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
        })
        .then(({ value }) => {
            resetUserPwd(row.userId, value).then((response) => {
                proxy.$modal.msgSuccess('修改成功，新密码是：' + value);
            });
        })
        .catch(() => {});
}
/** 选择条数  */
function handleSelectionChange(selection) {
    ids.value = selection.map((item) => item.userId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}
/** 导入按钮操作 */
function handleImport() {
    upload.title = '用户导入';
    upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
    proxy.download(
        'system/user/importTemplate',
        {},
        `user_template_${new Date().getTime()}.xlsx`,
    );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    upload.open = false;
    upload.isUploading = false;
    proxy.$refs['uploadRef'].handleRemove(file);
    proxy.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
            response.msg +
            '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true },
    );
    getList();
};
/** 提交上传文件 */
function submitFileForm() {
    proxy.$refs['uploadRef'].submit();
}
/** 重置操作表单 */
function reset() {
    form.value = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        roleIds: [],
    };
    proxy.resetForm('userRef');
}
/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}
/** 新增按钮操作 */
function handleAdd() {
    reset();
    getUser().then((response) => {
        console.log('response', response);
        postOptions.value = response.data.posts;
        roleOptions.value = response.data.roles;
        open.value = true;
        title.value = '添加用户';
        form.value.password = initPassword.value;
    });
}
/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const userId = row.userId || ids.value;
    getUser(userId).then((response) => {
        form.value = response.data.user;
        postOptions.value = response.data.posts;
        roleOptions.value = response.data.roles;
        form.value.postIds = response.data.postIds;
        form.value.roleIds = response.data.roleIds;
        open.value = true;
        title.value = '修改用户';
        form.password = '';
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs['userRef'].validate((valid) => {
        if (valid) {
            if (form.value.userId != undefined) {
                updateUser(form.value).then((response) => {
                    proxy.$modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                addUser(form.value).then((response) => {
                    proxy.$modal.msgSuccess('新增成功');
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

getDeptTree();
getList();
</script>
<style lang="scss" scoped>
.section-title {
    margin: 44px 0 20px 0;
    color: #1f2126;
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 162.5% */
}
</style>
