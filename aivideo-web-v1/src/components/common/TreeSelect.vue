<template>
  <el-select
    ref="select"
    :value="mValue"
    :multiple="multiple"
    :filter-method="dataFilter"
    @remove-tag="removeTag"
    @clear="clearAll"
    popper-class="t-tree-select"
    :style="{width: width||'100%'}"
    v-bind="attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      hidden
    ></el-option>
    <div class="check-box" v-if="multiple&&checkBoxBtn">
      <el-button type="text" @click="handlecheckAll">全选</el-button>
      <el-button type="text" @click="handleReset">清空</el-button>
    </div>
    <el-tree
      :data="treeOptions"
      class="tree-style"
      ref="treeNode"
      :expand-on-click-node="false"
      :show-checkbox="multiple"
      node-key="value"
      :filter-node-method="filterNode"
      :default-checked-keys="defaultCheckedKeys"
      :current-node-key="currentKey"
      @node-click="handleTreeClick"
      @check-change="handleNodeChange"
      v-bind="treeAttrs"
      v-on="$listeners"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip
          effect="dark"
          :content="node.label"
          :open-delay="300"
          :disabled="node.label.length < maxLen"
          placement="top-start"
        >
          <span
            :class="['tree-label',currentKey===data.value&&!multiple?'active':'']"
          >{{ node.label | textOverflow(maxLen)}}</span>
        </el-tooltip>
      </span>
    </el-tree>
  </el-select>
</template>

<script>
export default {
  name: "TreeSelect",
  model: {
    prop: "value", // 指定 v-model 要绑定的参数叫什么名字，来自于 props 中定义的参数
    event: "mChange" // 指定要触发的事件名字，将被用于 $emit
  },
  props: {
    value: {
      type: [Number, String, Array, undefined],
      require: true
    },
    // 多选默认值数组
    defaultValue: {
      type: Array,
      default: () => []
    },
    // 单选默认展示数据必须是{id:***,label:***}格式
    defaultData: {
      type: Object
    },
    // 可用选项的数组
    options: {
      type: Array,
      default: () => []
    },
    // 配置选项——>属性值为后端返回的对应的字段名
    treeProps: {
      type: Object,
      default: () => ({
        value: "value", // ID字段名
        label: "label", // 显示名称
        children: "children" // 子级字段名
      })
    },
    // 是否显示全选、反选、清空操作
    checkBoxBtn: {
      type: Boolean,
      default: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 选择框宽度
    width: {
      type: String
    },
    // 最大展示字符数
    maxLen: {
      type: Number,
      default: 10
    },
    showCheckedStrategy: {
      type: String,
      default: "SHOW_ALL" // SHOW_ALL | SHOW_PARENT | SHOW_CHILD
    }
  },
  data() {
    return {
      mValue: this.multiple ? [] : "",
      defaultCheckedKeys: [], //多选
      currentKey: null // 单选
    };
  },
  computed: {
    attrs() {
      return {
        "popper-append-to-body": false,
        clearable: true,
        filterable: true,
        ...this.$attrs
      };
    },
    // tree属性
    treeAttrs() {
      return {
        "default-expand-all": true,
        ...this.$attrs
      };
    },
    treeOptions() {
      return this.generateTreeOptions(this.options);
    },
    selectOptions() {
      return this.generateSelectOptions(this.treeOptions);
    }
  },
  filters: {
    textOverflow(val, maxLen) {
      return val.length > maxLen ? val.slice(0, maxLen) + "..." : val;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$nextTick(() => {
          this.mValue = val;
          // 多选
          if (this.multiple) {
            this.defaultCheckedKeys = val;
          } else {
            this.currentKey = val;
            this.$refs.treeNode.setCurrentKey(this.currentKey); //设置高亮
          }
        });
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 生成tree的option
    generateTreeOptions(options) {
      const treeProps = this.treeProps;
      return options.map(item => {
        const obj = {
          label: item[treeProps.label],
          value: item[treeProps.value]
        };
        if (item[treeProps.children] && item[treeProps.children].length > 0) {
          obj.children = this.generateTreeOptions(item[treeProps.children]);
        }
        return obj;
      });
    },
    // 生成select的option
    generateSelectOptions(treeData) {
      let arr = [];
      treeData.forEach(item => {
        arr.push({
          label: item.label,
          value: item.value
        });
        if (item.children && item.children.length > 0) {
          arr = [...arr, ...this.generateSelectOptions(item.children)];
        }
      });
      return arr;
    },
    // 全选
    handlecheckAll() {
      const keys = this.selectOptions.map(item => item.value);
      this.mValue = keys;
      this.$refs.treeNode.setCheckedKeys(keys);
      this.$emit("mChange", this.mValue);
    },
    // 清空
    handleReset() {
      this.mValue = [];
      this.$refs.treeNode.setCheckedKeys([]);
      this.$emit("mChange", this.mValue);
    },
    // 输入框关键字
    dataFilter(val) {
      this.$refs.treeNode.filter(val);
    },
    // 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 多选赋值组件
    handleNodeChange(data, node, checked) {
      const treeNode = this.$refs.treeNode;
      if (this.showCheckedStrategy === "SHOW_ALL") {
        this.mValue = treeNode.getCheckedKeys();
      } else if (this.showCheckedStrategy === "SHOW_PARENT") {
        this.mValue = this.getParent(treeNode).map(item => item.value);
      } else if (this.showCheckedStrategy === "SHOW_CHILD") {
        this.mValue = treeNode.getCheckedKeys(true);
      }
      this.$emit("mChange", this.mValue);
    },
    getParent(treeNode) {
      let checkNodeKeys = [];
      const childNodes = treeNode.root
        ? treeNode.root.childNodes
        : treeNode.childNodes;
      childNodes.forEach(item => {
        if (item.checked) {
          checkNodeKeys.push(item.data);
        }
        if (item.indeterminate) {
          // 有部分选中的情况,需要继续向上查找
          checkNodeKeys = [...checkNodeKeys, ...this.getParent(item)];
        }
      });
      return checkNodeKeys;
    },
    // 单选tree点击赋值
    handleTreeClick(data, node) {
      if (!this.multiple) {
        this.mValue = this.currentKey = data.value;
        this.$emit("mChange", this.mValue);
        this.$refs.select.blur();
      }
    },

    // 移除单个标签
    removeTag(value) {
      // 删除子节点的时候要把全选的父节点也删除
      this.$refs.treeNode.setChecked(value, false, true);
      this.mValue = this.$refs.treeNode.getCheckedKeys();
      this.$emit("mChange", this.mValue);
    },
    // 文本框清空
    clearAll() {
      this.mValue = this.multiple ? [] : "";
      this.$refs.treeNode.setCheckedKeys([]);
      this.$emit("mChange", this.mValue);
    }
  }
};
</script>

<style scoped >
.t-tree-select {
}

.check-box {
  padding: 0 20px;
  text-align: left;
}
.option-style {
  height: 100%;
  max-height: 300px;
  margin: 0;
  overflow-y: auto;
  cursor: default !important;
}

.el-select-dropdown__item.selected {
  font-weight: 500;
}
.el-input__inner {
  height: 36px;
  line-height: 36px;
}
.el-input__icon {
  line-height: 36px;
}
.el-tree-node__content {
  height: 32px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-label {
  text-align: left;
  display: block;
  width: 100%;
}

.active {
  color: #409eff;
  font-weight: 700;
}
</style>
