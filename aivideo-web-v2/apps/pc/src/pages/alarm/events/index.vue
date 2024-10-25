<template>
  <t-card>
    <t-space direction="vertical" style="width: 100%">
      <t-form v-show="showSearch" ref="queryRef" :data="queryParams" layout="inline" label-width="calc(6em + 12px)">
        <t-form-item label="告警级别" name="alarmLevel">
          <t-input
            v-model="queryParams.alarmLevel"
            placeholder="请输入告警级别"
            clearable
            style="width: 240px"
            @enter="handleQuery"
          />
        </t-form-item>
        <t-form-item label="告警类型编号" name="alarmTypeId">
          <t-input
            v-model="queryParams.alarmTypeId"
            placeholder="请输入告警类型编号"
            clearable
            style="width: 240px"
            @enter="handleQuery"
          />
        </t-form-item>
        <t-form-item label="告警类型名称" name="alarmTypeName">
          <t-input
            v-model="queryParams.alarmTypeName"
            placeholder="请输入告警类型名称"
            clearable
            style="width: 240px"
            @enter="handleQuery"
          />
        </t-form-item>
        <!--        <t-form-item label="创建时间" style="width: 340px">-->
        <!--          <t-date-range-picker-->
        <!--            v-model="dateRange"-->
        <!--            allow-input-->
        <!--            clearable-->
        <!--            separator="-"-->
        <!--            :placeholder="['开始日期', '结束日期']"-->
        <!--          />-->
        <!--        </t-form-item>-->
        <t-form-item label-width="0px">
          <t-button theme="primary" @click="handleQuery">
            <template #icon>
              <search-icon/>
            </template>
            搜索
          </t-button>
          <t-button theme="default" @click="resetQuery">
            <template #icon>
              <refresh-icon/>
            </template>
            重置
          </t-button>
        </t-form-item>
      </t-form>

      <t-table
        v-model:column-controller-visible="columnControllerVisible"
        :loading="loading"
        hover
        row-key="id"
        :data="RulesList"
        :columns="columns"
        :selected-row-keys="ids"
        select-on-row-click
        :pagination="pagination"
        :column-controller="{
          hideTriggerButton: true,
        }"
        :sort="sort"
        show-sort-column-bg-color
        @sort-change="handleSortChange"
        @select-change="handleSelectionChange"
      >
        <template #topContent>
          <t-row>
            <t-col flex="auto">
              <t-button v-hasPermi="['system:dict:add']" theme="primary" @click="handleAdd">
                <template #icon>
                  <add-icon/>
                </template>
                新增
              </t-button>
              <t-button
                v-hasPermi="['system:dict:edit']"
                theme="default"
                variant="outline"
                :disabled="single"
                @click="handleUpdate()"
              >
                <template #icon>
                  <edit-icon/>
                </template>
                修改
              </t-button>
              <t-button
                v-hasPermi="['system:dict:remove']"
                theme="danger"
                variant="outline"
                :disabled="multiple"
                @click="handleDelete()"
              >
                <template #icon>
                  <delete-icon/>
                </template>
                删除
              </t-button>
              <!--              <t-button v-hasPermi="['system:dict:export']" theme="default" variant="outline" @click="handleExport">-->
              <!--                <template #icon> <download-icon /> </template>-->
              <!--                导出-->
              <!--              </t-button>-->
              <!--              <t-button-->
              <!--                v-hasPermi="['system:dict:remove']"-->
              <!--                theme="danger"-->
              <!--                variant="outline"-->
              <!--                @click="handleRefreshCache"-->
              <!--              >-->
              <!--                <template #icon> <refresh-icon /> </template>-->
              <!--                刷新缓存-->
              <!--              </t-button>-->
              <span class="selected-count">已选 {{ ids.length }} 项</span>
            </t-col>
            <t-col flex="none">
              <t-button theme="default" shape="square" variant="outline" @click="showSearch = !showSearch">
                <template #icon>
                  <search-icon/>
                </template>
              </t-button>
              <t-button theme="default" variant="outline" @click="columnControllerVisible = true">
                <template #icon>
                  <setting-icon/>
                </template>
                列配置
              </t-button>
            </t-col>
          </t-row>
        </template>
<!--        <template #enabled="{ row }">-->
<!--          <t-tag v-if="row.enabled" theme="success">可用</t-tag>-->
<!--          <t-tag v-else>不可用</t-tag>-->
<!--        </template>-->
        <template #operation="{ row }">
          <t-space :size="8" break-line>
            <t-link v-hasPermi="['system:dict:query']" theme="primary" hover="color" @click.stop="handleDetail(row)">
              <browse-icon/>
              详情
            </t-link>
            <t-link v-hasPermi="['system:dict:edit']" theme="primary" hover="color" @click.stop="handleUpdate(row)">
              <edit-icon/>
              修改
            </t-link>
            <t-link v-hasPermi="['system:dict:remove']" theme="danger" hover="color" @click.stop="handleDelete(row)">
              <delete-icon/>
              删除
            </t-link>
          </t-space>
        </template>
      </t-table>
    </t-space>

    <!-- 添加或修改参数配置对话框 -->
    <t-dialog
      v-model:visible="open"
      :header="title"
      destroy-on-close
      :close-on-overlay-click="false"
      width="500px"
      attach="body"
      :confirm-btn="{
        loading: eLoading,
      }"
      @confirm="onConfirm"
    >
      <t-loading :loading="eLoading" size="small">
        <t-form ref="dictRef" label-align="right" :data="form" :rules="rules" label-width="120px" @submit="submitForm">
          <t-form-item label="设备ID" name="deviceId">
            <t-input v-model="form.deviceId" placeholder="请输入设备ID"/>
          </t-form-item>
          <t-form-item label="视频通道ID" name="channelId">
            <t-input v-model="form.channelId" placeholder="视频通道ID"/>
          </t-form-item>
          <t-form-item label="告警级别" name="alarmLevel">
            <t-radio-group v-model="form.alarmLevel" :options="options" placeholder="请选择告警级别">
            </t-radio-group>
          </t-form-item>
          <t-form-item label="告警类型编号" name="alarmTypeId">
            <t-input v-model="form.alarmTypeId" placeholder="请输入告警类型编号"></t-input>
          </t-form-item>
          <t-form-item label="告警类型名称" name="alarmTypeName">
            <t-select v-model="form.alarmTypeName" :options="options" placeholder="请输入告警类型名称"></t-select>
          </t-form-item>
          <t-form-item label="资源存储类型" name="assetStore">
            <t-input v-model="form.assetStore" placeholder="请输入资源存储类型"></t-input>
          </t-form-item>
          <t-form-item label="告警图片" name="imageUrl">
            <t-input v-model="form.imageUrl" placeholder="请输入告警图片"/>
          </t-form-item>
          <t-form-item label="原始图片" name="imageOrigin">
            <t-input v-model="form.imageOrigin" placeholder="原始图片"/>
          </t-form-item>
          <t-form-item label="告警视频" name="videoUrl">
            <t-input v-model="form.videoUrl" placeholder="请输入告警视频"/>
          </t-form-item>
          <t-form-item label="告警视频时长" name="videoDuration">
            <t-input v-model="form.videoDuration" placeholder="告警视频时长"/>
          </t-form-item>
          <t-form-item label="经度" name="longitude">
            <t-input v-model="form.longitude" placeholder="请输入经度"/>
          </t-form-item>
          <t-form-item label="纬度" name="latitude">
            <t-input v-model="form.latitude" placeholder="请输入纬度"/>
          </t-form-item>
          <t-form-item label="描述" name="description">
            <t-input v-model="form.description" placeholder="请输入描述"/>
          </t-form-item>
        </t-form>
      </t-loading>
    </t-dialog>

    <!-- 字典类型详情 -->
    <t-dialog
      v-model:visible="openView"
      header="详情"
      placement="center"
      width="700px"
      attach="body"
      :footer="false"
    >
      <t-descriptions :loading="openViewLoading">
        <t-descriptions-item label="设备ID">{{ form.deviceId }}</t-descriptions-item>
        <t-descriptions-item label="告警级别">{{ form.alarmLevel }}</t-descriptions-item>
        <t-descriptions-item label="告警类型编号">{{ form.alarmTypeId }}</t-descriptions-item>
        <t-descriptions-item label="告警类型名称">{{ form.alarmTypeName }}</t-descriptions-item>
        <t-descriptions-item label="资源存储类型">{{ form.assetStore }}</t-descriptions-item>
        <t-descriptions-item label="告警图片">{{ form.imageUrl }}</t-descriptions-item>
        <t-descriptions-item label="原始图片">{{ form.imageOrigin }}</t-descriptions-item>
        <t-descriptions-item label="告警视频">{{ form.videoUrl }}</t-descriptions-item>
        <t-descriptions-item label="告警视频时长">{{ form.videoDuration }}</t-descriptions-item>
        <t-descriptions-item label="经度">{{ form.longitude }}</t-descriptions-item>
        <t-descriptions-item label="纬度">{{ form.latitude }}</t-descriptions-item>
        <t-descriptions-item label="描述">{{ form.description }}</t-descriptions-item>
      </t-descriptions>
    </t-dialog>
  </t-card>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'rules',
});
import {
  AddIcon,
  BrowseIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  RefreshIcon,
  SearchIcon,
  SettingIcon,
} from 'tdesign-icons-vue-next';
import {
  FormInstanceFunctions,
  FormRule, MessagePlugin,
  PageInfo,
  PrimaryTableCol,
  SubmitContext,
  TableSort,
} from 'tdesign-vue-next';
import {computed, getCurrentInstance, nextTick, reactive, ref} from 'vue';

import {addRules, delRules, getRules, listRules, updateRules} from '@/api/alarm/events';
import type {RulesForm, RulesQuery, RulesVo} from '@/api/model/alarm/eventsModel';
// import useDictStore from '@/store/modules/dict';
// import { ArrayOps } from '@/utils/array';

const {proxy} = getCurrentInstance();

const openView = ref(false);
const openViewLoading = ref(false);
const RulesList = ref<RulesVo[]>([]);
const open = ref(false);
const loading = ref(false);
const eLoading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const columnControllerVisible = ref(false);
const dictRef = ref<FormInstanceFunctions>(null);
const queryRef = ref<FormInstanceFunctions>(null);
const sort = ref<TableSort>();
const deleteDialog = ref(false);

// 校验规则
const rules = ref<Record<string, Array<FormRule>>>({
  dictName: [{required: true, message: '字典名称不能为空'}],
  dictRules: [{required: true, message: '字典类型不能为空'}],
});

// 列显隐信息
const columns = ref<Array<PrimaryTableCol>>([
  {title: `选择列`, colKey: 'row-select', type: 'multiple', width: 50, align: 'center'},
  {title: `流数据点编号`, colKey: 'streamPointId', align: 'center', ellipsis: true},
  {title: `设备ID`, colKey: 'deviceId', align: 'center', ellipsis: true},
  {title: `告警级别`, colKey: 'alarmLevel', align: 'center', ellipsis: true},
  {title: `告警类型编号`, colKey: 'alarmTypeId', align: 'center', ellipsis: true},
  {title: `告警类型名称`, colKey: 'alarmTypeName', align: 'center', ellipsis: true},
  {title: `告警时间`, colKey: 'alarmTime', align: 'center', ellipsis: true},
  {title: `资源存储`, colKey: 'assetStore', align: 'center', ellipsis: true},
  {title: `告警视频时长`, colKey: 'videoDuration', align: 'center', ellipsis: true},
  {title: `经度`, colKey: 'longitude', align: 'center', ellipsis: true},
  {title: `纬度`, colKey: 'latitude', align: 'center', ellipsis: true},
  {title: `描述`, colKey: 'description', align: 'center', ellipsis: true},
  {title: `操作`, colKey: 'operation', align: 'center', width: 180},
]);
// 提交表单对象
const form = ref<RulesForm>({});
// 查询对象
const queryParams = ref<RulesQuery>({
  pageNum: 1,
  pageSize: 10
});

// 分页
const pagination = computed(() => {
  return {
    current: queryParams.value.pageNum,
    pageSize: queryParams.value.pageSize,
    total: total.value,
    showJumper: true,
    onChange: (pageInfo: PageInfo) => {
      queryParams.value.pageNum = pageInfo.current;
      queryParams.value.pageSize = pageInfo.pageSize;
      getList();
    },
  };
});
//"SYSTEM" | "DATAV" | "WEBHOOK"
const options = [
  {label: 'LOCAL', value: 'LOCAL',},
  {label: 'HTTP ', value: 'HTTP ',},
]

const enabledOptions = [
  {label: '可用', value: true},
  {label: '不可用', value: false},
]

/** 查询字典类型列表 */
function getList() {
  loading.value = true;
  listRules(queryParams.value)
    .then((response) => {
      console.log('getList', response)
      RulesList.value = response.data.data.records;
      total.value = response.data.data.total;
    })
    .finally(() => (loading.value = false));
}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    enabled: undefined,
    eventTypeId: undefined,
    notifierType: undefined,
    notifyStartLevel: undefined,
    notifyWindowSeconds: undefined
  };
  dictRef.value?.reset();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  queryRef.value.reset();
  queryParams.value.pageNum = 1;
  handleSortChange(null);
}

/** 排序触发事件 */
function handleSortChange(value?: TableSort) {
  sort.value = value;
  if (Array.isArray(value)) {
    queryParams.value.orderByColumn = value.map((item) => item.sortBy).join(',');
    queryParams.value.isAsc = value.map((item) => (item.descending ? 'descending' : 'ascending')).join(',');
  } else {
    queryParams.value.orderByColumn = value?.sortBy;
    queryParams.value.isAsc = value?.descending ? 'descending' : 'ascending';
  }
  getList();
}

/** 多选框选中数据 */
function handleSelectionChange(selection: Array<string | number>) {
  ids.value = selection;
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true;
  title.value = '添加';
}

/** 详情按钮操作 */
function handleDetail(row: RulesVo) {
  reset();
  openView.value = true;
  openViewLoading.value = true;
  const {id} = row;
  getRules(id).then((response) => {
    form.value = response.data.data;
    openViewLoading.value = false;
    console.log('handleDetail', form.value)
  });
}

/** 修改按钮操作 */
function handleUpdate(row?: RulesVo) {
  reset();
  open.value = true;
  title.value = '修改';
  eLoading.value = true;
  const id = row?.id || ids.value.at(0);
  getRules(id).then((response) => {
    form.value = response.data.data;
    eLoading.value = false;
  });
}

function onConfirm() {
  dictRef.value.submit();
}

/** 提交按钮 */
function submitForm({validateResult, firstError}: SubmitContext) {
  if (validateResult === true) {
    // const msgLoading = proxy.$modal.msgLoading('提交中...');
    if (form.value.id) {
      updateRules(form.value).then(() => {
        MessagePlugin.success('修改成功');
        open.value = false;
        getList();
      })
      // .finally(() => MessagePlugin.success(msgLoading));
    } else {
      addRules(form.value).then(() => {
        MessagePlugin.success('新增成功');
        open.value = false;
        getList();
      })
      // .finally(() => MessagePlugin.success(msgLoading));
    }
  } else {
    // proxy.$modal.msgError(firstError);
  }
}

/** 删除按钮操作 */
function handleDelete(row?: RulesVo) {
  const id = row?.id || ids.value;
  proxy.$modal.confirm(`是否确认删除字典编号为"${id}"的数据项？`, () => {
    return delRules(id).then(() => {
      // ids.value = ArrayOps.fastDeleteElement(ids.value, id);
      getList();
      MessagePlugin.success('删除成功');
    });
  });
}

/** 导出按钮操作 */
function handleExport() {
  // proxy.addDateRange(queryParams.value, dateRange.value);
  // proxy.download(
  //   'system/dict/Rules/export',
  //   {
  //     ...queryParams.value,
  //   },
  //   `dict_${new Date().getTime()}.xlsx`,
  // );
}

/** 刷新缓存按钮操作 */
function handleRefreshCache() {
  // proxy.$modal.confirm(`是否确认刷新字典缓存？`, () => {
  //   return refreshCache().then(() => {
  //     MessagePlugin.success('刷新成功');
  //     useDictStore().cleanDict();
  //   });
  // });
}

getList();
</script>
