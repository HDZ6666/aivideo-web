<template>
    <div class="device_list">
        <div class="list">
            <div class="rows">
                <el-tree class="device-tree" :data="deviceTreeData" :expand-on-click-node="false" :props="treeProps"
                    :default-expand-all="false" lazy :load="loadTreeNode" @node-click="handleNodeClick">
                    <template #default="{ node, data: nodeData }">
                        <span class="custom-tree-node" :class="{ 'is-selected': selectedNodeId === nodeData.id }">
                            <span>{{ node.label }}</span>
                        </span>
                    </template>
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listDeviceGroup, listDeviceChildren } from '@/api/datav/monitor.js'

// Emits
const emit = defineEmits(['node-click'])

// 选中的节点 ID
const selectedNodeId = ref(null)

// 树配置
const treeProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'isLeaf'
}

// 设备树数据
const deviceTreeData = ref([])

// 获取设备分组列表（初始化树根节点）
const getDeviceGroupList = () => {
    listDeviceGroup({ parentId: 0 }).then(res => {
        const data = res.data || []
        // 构建树结构，保留默认的"全部设备"根节点结构
        const tree = [
            { id: '0', label: '全部设备', value: '0', type: 'all', isLeaf: true }
        ]
        data.forEach(item => {
            tree.push({
                id: item.id,
                label: item.group_name,
                value: item.id.toString(),
                type: 'group',
                isLeaf: false  // 分组节点有子节点
            })
        })
        deviceTreeData.value = tree
    }).catch(err => {
        // 获取设备分组失败
    })
}

// 树节点懒加载函数
const loadTreeNode = (node, resolve) => {
    const nodeData = node.data

    // 第一层：分组节点 -> 加载设备列表
    if (nodeData.type === 'group') {
        listDeviceChildren({ groupId: nodeData.id }).then(res => {
            const data = res.data || []
            const children = data.map(item => ({
                id: item.deviceId,
                label: item.name,
                value: item.deviceId,
                type: item.type,  // 'DEVICE'
                isLeaf: item.type === 'DEVICE' ? false : true  // DEVICE 还有子节点
            }))
            resolve(children)
        }).catch(err => {
            resolve([])
        })
    }
    // 第二层：DEVICE 节点 -> 加载设备通道
    else if (nodeData.type === 'DEVICE') {
        listDeviceChildren({ deviceId: nodeData.id }).then(res => {
            const data = res.data || []
            const children = data.map(item => ({
                id: item.deviceId,
                label: item.name,
                value: item.deviceId,
                type: item.type,  // 'DEVICE_CHANNEL'
                isLeaf: true  // 通道是叶子节点
            }))
            resolve(children)
        }).catch(err => {
            resolve([])
        })
    }
    // 其他情况
    else {
        resolve([])
    }
}

// 节点点击事件
const handleNodeClick = (data) => {
    selectedNodeId.value = data.id
    emit('node-click', data)
}

// 初始化
onMounted(() => {
    getDeviceGroupList()
})
</script>

<style lang="scss" scoped>
.device_list {
    width: 100%;
    height: calc(100% - 88px);
    margin-top: 88px;
    overflow: hidden;

    .list {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        /* 隐藏滚动条但保留滚动功能 */
        &::-webkit-scrollbar {
            display: none;
            width: 0;
        }

        scrollbar-width: none;
        -ms-overflow-style: none;

        .rows {
            padding: 5px 20px;
            color: #fff;
            font-size: 15px;
            padding-bottom: 20px;

            :deep(.device-tree) {
                background: transparent;
                color: #fff;

                .el-tree-node__content {
                    background-color: transparent !important;
                    height: 32px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1) !important;
                    }
                }

                .el-tree-node:focus>.el-tree-node__content {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }

                .custom-tree-node {
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    transition: all 0.3s;
                    color: #fff;
                    cursor: pointer;

                    &.is-selected {
                        color: #ffd700 !important;

                        span {
                            color: #ffd700 !important;
                        }
                    }

                    .node-icon {
                        margin-right: 8px;
                        display: flex;
                        align-items: center;
                    }

                    .status-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        display: inline-block;

                        &.online {
                            background-color: #00ff7f;
                            box-shadow: 0 0 5px #00ff7f;
                        }

                        &.offline {
                            background-color: #ff4d4f;
                            box-shadow: 0 0 5px #ff4d4f;
                        }
                    }
                }
            }
        }
    }
}
</style>
