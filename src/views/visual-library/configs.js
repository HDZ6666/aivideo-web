const yesNoOptions = [
  { label: '是', value: true },
  { label: '否', value: false }
]

const onlineOptions = [
  { label: '在线', value: true },
  { label: '离线', value: false }
]

const genderOptions = [
  { label: '未知', value: '0' },
  { label: '男', value: '1' },
  { label: '女', value: '2' },
  { label: '未说明', value: '3' }
]

const statusOptions = [
  { label: '正常', value: '1' },
  { label: '停用', value: '0' }
]

const imageTypeOptions = [
  { label: 'JPEG', value: 'JPEG' },
  { label: 'JPG', value: 'JPG' },
  { label: 'PNG', value: 'PNG' }
]

const deviceFilter = [
  { label: '设备', prop: 'deviceId', type: 'remoteDevice' },
  { label: '关键字', prop: 'keyword' },
  { label: '开始时间', prop: 'startTime', type: 'datetime' },
  { label: '结束时间', prop: 'endTime', type: 'datetime' }
]

const dataTimeColumns = [
  { label: '设备编号', prop: 'deviceId', minWidth: 150 },
  { label: '设备名称', prop: 'deviceName', minWidth: 150 },
  { label: '场景图片', prop: 'largeImage', type: 'image', width: 100 },
  { label: '数据时间', prop: 'datetime', minWidth: 160 }
]

const subImageFields = [
  { label: '事件类型', prop: 'EventSort' },
  { label: '拍摄时间', prop: 'ShotTime', type: 'datetime' },
  { label: '设备编号', prop: 'DeviceID', type: 'remoteDevice' },
  { label: '图片类型', prop: 'Type', type: 'select', options: imageTypeOptions },
  { label: '图片地址', prop: 'StoragePath' }
]

const baseManualFields = [
  { label: '设备编号', prop: 'DeviceID', type: 'remoteDevice', required: true },
  { label: '位置标记时间', prop: 'LocationMarkTime', type: 'datetime' },
  { label: '名称', prop: 'Name' },
  { label: '证件号码', prop: 'IDNumber' },
  { label: '性别', prop: 'GenderCode', type: 'select', options: genderOptions },
  { label: '年龄下限', prop: 'AgeLowerLimit', type: 'number' },
  { label: '年龄上限', prop: 'AgeUpLimit', type: 'number' },
  { label: '图片列表', prop: 'SubImageList', type: 'subImages', fields: subImageFields }
]

export const entityConfigs = {
  resourceInstance: {
    title: '视图库',
    endpoint: 'instance',
    idField: 'id',
    filters: [
      { label: '视图库名称', prop: 'instanceName' },
      { label: '视图库类型', prop: 'category', type: 'select', options: [{ label: '下级', value: '1' }, { label: '上级', value: '2' }] },
      { label: '在线状态', prop: 'isOnline', type: 'select', options: onlineOptions }
    ],
    columns: [
      { label: '视图库编号', prop: 'instanceId', minWidth: 180 },
      { label: '视图库名称', prop: 'instanceName', minWidth: 150 },
      { label: '视图库地址', prop: 'host', minWidth: 180, join: ['scheme', 'host', 'port'] },
      { label: '节点类别', prop: 'category', width: 100 },
      { label: '状态', prop: 'online', type: 'boolean', width: 90 },
      { label: '是否启用', prop: 'enabled', type: 'boolean', width: 100 },
      { label: '最后在线', prop: 'lastOnline', minWidth: 160 }
    ],
    formFields: [
      { label: '视图库编号', prop: 'instanceId', required: true },
      { label: '视图库名称', prop: 'instanceName', required: true },
      { label: '节点类别', prop: 'category', type: 'select', options: [{ label: '下级', value: '1' }, { label: '上级', value: '2' }] },
      { label: '协议', prop: 'scheme', type: 'select', options: [{ label: 'HTTP', value: 'http' }, { label: 'HTTPS', value: 'https' }] },
      { label: '主机地址', prop: 'host', required: true },
      { label: '端口', prop: 'port', type: 'number' },
      { label: '我方授权用户', prop: 'username' },
      { label: '我方授权密码', prop: 'password', type: 'password' },
      { label: '对方授权用户', prop: 'activeUser' },
      { label: '对方授权密码', prop: 'activePwd', type: 'password' },
      { label: '是否启用', prop: 'enabled', type: 'switch' },
      { label: '心跳保活', prop: 'keepalive', type: 'switch' },
      { label: '代理网络', prop: 'proxyNetwork', type: 'switch' }
    ],
    rowActions: [
      { label: '注册', url: '/api/viid/instance/register', method: 'post', params: (row) => ({ instanceId: row.instanceId }) },
      { label: '保活', url: '/api/viid/instance/keepalive', method: 'post', params: (row) => ({ instanceId: row.instanceId }) },
      { label: '下线', url: '/api/viid/instance/force/offline', method: 'put' }
    ]
  },
  resourceDevice: {
    title: '设备',
    endpoint: 'device',
    idField: 'id',
    filters: [
      { label: '设备名称', prop: 'name' },
      { label: '地区编码', prop: 'placeCode' },
      { label: '在线状态', prop: 'isOnline', type: 'select', options: onlineOptions }
    ],
    columns: [
      { label: '设备编号', prop: 'ApeID', minWidth: 180 },
      { label: '设备名称', prop: 'Name', minWidth: 150 },
      { label: '设备型号', prop: 'Model', minWidth: 120 },
      { label: 'IP端口', prop: 'IPAddr', minWidth: 160, join: ['IPAddr', 'Port'] },
      { label: '经纬度', prop: 'Longitude', minWidth: 160, join: ['Longitude', 'Latitude'] },
      { label: '位置名', prop: 'Place', minWidth: 160 },
      { label: '状态', prop: 'IsOnline', type: 'boolean', width: 90 },
      { label: '最后在线', prop: 'LastOnline', minWidth: 160 }
    ],
    formFields: [
      { label: '设备编号', prop: 'ApeID', required: true },
      { label: '设备名称', prop: 'Name', required: true },
      { label: '设备型号', prop: 'Model' },
      { label: 'IPV4地址', prop: 'IPAddr' },
      { label: 'IPV6地址', prop: 'IPV6Addr' },
      { label: '端口号', prop: 'Port', type: 'number' },
      { label: '经度', prop: 'Longitude' },
      { label: '纬度', prop: 'Latitude' },
      { label: '账户', prop: 'UserId' },
      { label: '口令', prop: 'Password', type: 'password' },
      { label: '位置编码', prop: 'PlaceCode' },
      { label: '位置名', prop: 'Place' },
      { label: '管辖单位代码', prop: 'OrgCode' },
      { label: '挂载卡口', prop: 'TollgateID', type: 'remoteTollgate' }
    ],
    rowActions: [
      { label: '强制下线', url: '/api/viid/device/force/offline', method: 'put' }
    ]
  },
  resourceTollgate: {
    title: '卡口',
    endpoint: 'tollgate',
    idField: 'id',
    filters: [
      { label: '卡口名称', prop: 'name' },
      { label: '位置编码', prop: 'placeCode' },
      { label: '管辖单位', prop: 'OrgCode' }
    ],
    columns: [
      { label: '卡口编号', prop: 'TollgateID', minWidth: 180 },
      { label: '卡口名称', prop: 'Name', minWidth: 150 },
      { label: '经纬度', prop: 'Longitude', minWidth: 160, join: ['Longitude', 'Latitude'] },
      { label: '位置名', prop: 'Place', minWidth: 160 },
      { label: '状态', prop: 'online', type: 'boolean', width: 90 },
      { label: '管辖单位代码', prop: 'OrgCode', minWidth: 150 },
      { label: '启用时间', prop: 'ActiveTime', minWidth: 160 }
    ],
    formFields: [
      { label: '卡口编号', prop: 'TollgateID', required: true },
      { label: '卡口名称', prop: 'Name', required: true },
      { label: '经度', prop: 'Longitude' },
      { label: '纬度', prop: 'Latitude' },
      { label: '位置编码', prop: 'PlaceCode' },
      { label: '位置名', prop: 'Place' },
      { label: '车道数量', prop: 'LaneNum', type: 'number' },
      { label: '管辖单位代码', prop: 'OrgCode' },
      { label: '卡口状态', prop: 'Status', type: 'select', options: statusOptions },
      { label: '卡口类型', prop: 'TollgateCat' },
      { label: '卡口用途', prop: 'TollgateUsage' },
      { label: '启用时间', prop: 'ActiveTime', type: 'datetime' }
    ]
  },
  resourceLane: {
    title: '车道',
    endpoint: 'lane',
    idField: 'id',
    filters: [
      { label: '绑定卡口', prop: 'tollgateId', type: 'remoteTollgate' },
      { label: '车道名称', prop: 'name' }
    ],
    columns: [
      { label: '卡口', prop: 'TollgateID', minWidth: 180 },
      { label: '车道编号', prop: 'LaneNo', minWidth: 120 },
      { label: '车道名称', prop: 'Name', minWidth: 150 },
      { label: '车道方向', prop: 'Direction', minWidth: 120 },
      { label: '限速', prop: 'MaxSpeed', width: 100 },
      { label: '车道描述', prop: 'Desc', minWidth: 180 }
    ],
    formFields: [
      { label: '绑定卡口', prop: 'TollgateID', type: 'remoteTollgate', required: true },
      { label: '车道编号', prop: 'LaneNo', required: true },
      { label: '车道名称', prop: 'Name', required: true },
      { label: '车道方向', prop: 'Direction' },
      { label: '车道描述', prop: 'Desc', type: 'textarea' },
      { label: '限速', prop: 'MaxSpeed', type: 'number' },
      { label: '出入城', prop: 'CityPass' },
      { label: '绑定设备', prop: 'ApeID', type: 'remoteDevice' }
    ]
  },
  resourceUnit: {
    title: '组织机构',
    endpoint: 'unit',
    listUrl: '/api/viid/unit/table',
    tableMode: true,
    idField: 'id',
    filters: [{ label: '组织机构名称', prop: 'unitName' }],
    columns: [
      { label: '组织机构编码', prop: 'unitCode', minWidth: 200 },
      { label: '组织机构名称', prop: 'unitName', minWidth: 180 },
      { label: '上级机构', prop: 'parentCode', minWidth: 160 }
    ],
    formFields: [
      { label: '组织机构编码', prop: 'unitCode', required: true },
      { label: '组织机构名称', prop: 'unitName', required: true },
      { label: '上级机构节点', prop: 'parentCode' }
    ]
  },
  subscribeDown: {
    title: '下级订阅',
    endpoint: 'subscribe',
    deleteUrl: '/api/viid/subscribes',
    saveSuffix: '/1',
    updateSuffix: '/1',
    idField: 'id',
    fixedParams: { subscribeType: '1' },
    filters: [
      { label: '订阅标题', prop: 'title' },
      { label: '订阅节点', prop: 'instanceId', type: 'remoteInstance' }
    ],
    columns: [
      { label: '订阅编号', prop: 'subscribeId', minWidth: 180 },
      { label: '订阅标题', prop: 'title', minWidth: 150 },
      { label: '订阅类型', prop: 'subscribeDetail', minWidth: 120 },
      { label: '订阅资源', prop: 'resourceUri', minWidth: 180 },
      { label: '订阅时间', prop: 'beginTime', minWidth: 160 },
      { label: '回调地址', prop: 'receiveAddr', minWidth: 180 },
      { label: '订阅状态', prop: 'subscribeStatus', width: 120 },
      { label: '应用信息', prop: 'applicantInfo', minWidth: 160 }
    ],
    formFields: [
      { label: '订阅目标节点', prop: 'instanceId', type: 'remoteInstance', required: true },
      { label: '订阅编号', prop: 'subscribeId' },
      { label: '订阅标题', prop: 'title', required: true },
      { label: '订阅类型', prop: 'subscribeDetail', type: 'remoteSubscribeDetail' },
      { label: '资源类型', prop: 'resourceClass' },
      { label: '订阅资源', prop: 'resourceUri' },
      { label: '回调地址', prop: 'receiveAddr' },
      { label: '推送间隔', prop: 'reportInterval', type: 'number' },
      { label: '申请人', prop: 'applicationName' },
      { label: '申请单位', prop: 'applicationOrg' },
      { label: '理由', prop: 'reason', type: 'textarea' }
    ],
    rowActions: [
      { label: '重载', url: '/api/viid/subscribes/reload', method: 'post' },
      { label: '取消', url: '/api/viid/subscribe/cancel', method: 'delete', data: (row) => ({ subscribeId: row.subscribeId }) }
    ]
  },
  subscribeUp: {
    title: '上级订阅',
    endpoint: 'subscribe',
    deleteUrl: '/api/viid/subscribes',
    saveSuffix: '/2',
    updateSuffix: '/2',
    idField: 'id',
    fixedParams: { subscribeType: '2' },
    filters: [
      { label: '订阅标题', prop: 'title' },
      { label: '订阅节点', prop: 'instanceId', type: 'remoteInstance' }
    ],
    columns: [
      { label: '订阅编号', prop: 'subscribeId', minWidth: 180 },
      { label: '订阅标题', prop: 'title', minWidth: 150 },
      { label: '订阅类型', prop: 'subscribeDetail', minWidth: 120 },
      { label: '订阅时间', prop: 'beginTime', minWidth: 160 },
      { label: '回调地址', prop: 'receiveAddr', minWidth: 180 },
      { label: '订阅状态', prop: 'subscribeStatus', width: 120 },
      { label: '状态描述', prop: 'description', minWidth: 160 },
      { label: '推送进度', prop: 'progress', type: 'progress', minWidth: 150 }
    ],
    formFields: [
      { label: '订阅目标节点', prop: 'instanceId', type: 'remoteInstance', required: true },
      { label: '订阅编号', prop: 'subscribeId' },
      { label: '订阅标题', prop: 'title', required: true },
      { label: '订阅类型', prop: 'subscribeDetail', type: 'remoteSubscribeDetail' },
      { label: '资源类型', prop: 'resourceClass' },
      { label: '订阅资源', prop: 'resourceUri' },
      { label: '图片格式', prop: 'imageFormat', type: 'select', options: imageTypeOptions },
      { label: '回调地址', prop: 'receiveAddr' },
      { label: '推送间隔', prop: 'reportInterval', type: 'number' },
      { label: '申请人', prop: 'applicationName' },
      { label: '申请单位', prop: 'applicationOrg' },
      { label: '理由', prop: 'reason', type: 'textarea' }
    ],
    rowActions: [
      { label: '重载', url: '/api/viid/subscribes/reload', method: 'post' }
    ]
  },
  subscribeDownNotification: {
    title: '下级订阅通知',
    endpoint: 'subscribe/notification',
    listUrl: '/api/viid/subscribe/notification/page',
    deleteUrl: '/api/viid/subscribe/notification',
    readonly: true,
    fixedParams: { subscribeType: '1' },
    filters: [
      { label: '订阅节点', prop: 'instanceId', type: 'remoteInstance' },
      { label: '订阅编号', prop: 'subscribeId' }
    ],
    columns: [
      { label: '通知编号', prop: 'notificationId', minWidth: 180 },
      { label: '订阅编号', prop: 'subscribeId', minWidth: 180 },
      { label: '订阅标题', prop: 'title', minWidth: 150 },
      { label: '触发时间', prop: 'triggerTime', minWidth: 160 },
      { label: '节点名称', prop: 'ownerApsName', minWidth: 150 },
      { label: '通知结果', prop: 'resultStatus', minWidth: 120 },
      { label: '耗时', prop: 'cost', width: 100 }
    ]
  },
  subscribeUpNotification: {
    title: '上级订阅通知',
    endpoint: 'subscribe/notification',
    listUrl: '/api/viid/subscribe/notification/page',
    deleteUrl: '/api/viid/subscribe/notification',
    readonly: true,
    fixedParams: { subscribeType: '2' },
    filters: [
      { label: '订阅节点', prop: 'instanceId', type: 'remoteInstance' },
      { label: '订阅编号', prop: 'subscribeId' }
    ],
    columns: [
      { label: '通知编号', prop: 'notificationId', minWidth: 180 },
      { label: '订阅编号', prop: 'subscribeId', minWidth: 180 },
      { label: '订阅标题', prop: 'title', minWidth: 150 },
      { label: '触发时间', prop: 'triggerTime', minWidth: 160 },
      { label: '节点名称', prop: 'ownerApsName', minWidth: 150 },
      { label: '通知结果', prop: 'resultStatus', minWidth: 120 },
      { label: '耗时', prop: 'cost', width: 100 }
    ]
  },
  dispositionDown: {
    title: '下级布控',
    endpoint: 'disposition',
    saveSuffix: '/1',
    updateSuffix: '/1',
    idField: 'id',
    fixedParams: { dispositionType: '1' },
    filters: [
      { label: '布控标题', prop: 'title' },
      { label: '布控节点', prop: 'instanceId', type: 'remoteInstance' }
    ],
    columns: [
      { label: '布控编号', prop: 'dispositionId', minWidth: 180 },
      { label: '布控标题', prop: 'title', minWidth: 150 },
      { label: '布控目标', prop: 'targetFeature', minWidth: 160 },
      { label: '布控时间', prop: 'beginTime', minWidth: 160 },
      { label: '告警地址', prop: 'receiveAddr', minWidth: 180 },
      { label: '布控范围', prop: 'dispositionRange', width: 100 },
      { label: '布控状态', prop: 'dispositionStatus', width: 120 },
      { label: '申请信息', prop: 'applicantInfo', minWidth: 160 }
    ],
    formFields: [
      { label: '布控目标节点', prop: 'instanceId', type: 'remoteInstance', required: true },
      { label: '布控编号', prop: 'dispositionId' },
      { label: '布控标题', prop: 'title', required: true },
      { label: '布控类别', prop: 'dispositionCategory' },
      { label: '人名', prop: 'feature.name' },
      { label: '证件号码', prop: 'feature.idNumber' },
      { label: '车牌', prop: 'feature.plateNo' },
      { label: '关键字', prop: 'feature.keyword' },
      { label: '目标图片', prop: 'targetImageUri' },
      { label: '布控范围', prop: 'dispositionRange' },
      { label: '优先等级', prop: 'priorityLevel', type: 'number' },
      { label: '回调地址', prop: 'receiveAddr' },
      { label: '申请人', prop: 'applicantName' },
      { label: '申请人联系方式', prop: 'applicantInfo' },
      { label: '申请单位', prop: 'applicantOrg' },
      { label: '理由', prop: 'reason', type: 'textarea' },
      { label: '图片列表', prop: 'SubImageList', type: 'subImages', fields: subImageFields }
    ],
    rowActions: [
      { label: '撤控', url: '/api/viid/disposition/revoke', method: 'delete', data: (row) => ({ dispositionId: row.dispositionId }) }
    ]
  },
  dispositionDownNotification: {
    title: '下级布控预警',
    endpoint: 'disposition/notification',
    listUrl: '/api/viid/disposition/notification/page',
    deleteUrl: '/api/viid/disposition/notification',
    readonly: true,
    fixedParams: { dispositionType: '1' },
    filters: [
      { label: '布控节点', prop: 'instanceId', type: 'remoteInstance' },
      { label: '布控编号', prop: 'dispositionId' }
    ],
    columns: [
      { label: '通知编号', prop: 'notificationId', minWidth: 180 },
      { label: '布控编号', prop: 'dispositionId', minWidth: 180 },
      { label: '布控标题', prop: 'title', minWidth: 150 },
      { label: '触发时间', prop: 'triggerTime', minWidth: 160 },
      { label: '节点名称', prop: 'ownerApsName', minWidth: 150 },
      { label: '通知结果', prop: 'resultStatus', minWidth: 120 },
      { label: '耗时', prop: 'cost', width: 100 }
    ]
  },
  dataFace: {
    title: '人脸数据',
    endpoint: 'faces',
    readonly: true,
    filters: [{ label: '设备', prop: 'deviceId', type: 'remoteDevice' }, { label: '性别', prop: 'keyword', type: 'select', options: genderOptions }, { label: '开始时间', prop: 'startTime', type: 'datetime' }, { label: '结束时间', prop: 'endTime', type: 'datetime' }],
    columns: [
      { label: '人脸标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '性别', prop: 'gender', width: 100 },
      { label: '年龄段', prop: 'age', width: 100 }
    ]
  },
  dataPerson: {
    title: '人员数据',
    endpoint: 'persons',
    readonly: true,
    filters: [{ label: '设备', prop: 'deviceId', type: 'remoteDevice' }, { label: '性别', prop: 'keyword', type: 'select', options: genderOptions }, { label: '开始时间', prop: 'startTime', type: 'datetime' }, { label: '结束时间', prop: 'endTime', type: 'datetime' }],
    columns: [
      { label: '人员标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '性别', prop: 'gender', width: 100 },
      { label: '年龄段', prop: 'age', width: 100 }
    ]
  },
  dataMotorVehicle: {
    title: '车辆数据',
    endpoint: 'motorvehicles',
    readonly: true,
    filters: deviceFilter,
    columns: [
      { label: '车辆标识', prop: 'id', minWidth: 180 },
      { label: '卡口编号', prop: 'tollgateId', minWidth: 150 },
      ...dataTimeColumns,
      { label: '车牌号', prop: 'plateNo', minWidth: 120 }
    ]
  },
  dataNonMotorVehicle: {
    title: '非机动车数据',
    endpoint: 'nonmotorvehicles',
    readonly: true,
    filters: deviceFilter,
    columns: [
      { label: '非机动车标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '车牌号', prop: 'plateNo', minWidth: 120 },
      { label: '车身颜色', prop: 'vehicleColor', minWidth: 120 }
    ]
  },
  dataScene: {
    title: '物品数据',
    endpoint: 'scenes',
    readonly: true,
    filters: deviceFilter,
    columns: [
      { label: '物品标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '事件分类', prop: 'eventSort', minWidth: 120 }
    ]
  },
  dataThing: {
    title: '场景数据',
    endpoint: 'things',
    readonly: true,
    filters: deviceFilter,
    columns: [
      { label: '场景标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '事件分类', prop: 'eventSort', minWidth: 120 }
    ]
  },
  dataImage: {
    title: '图像数据',
    endpoint: 'images',
    readonly: true,
    filters: deviceFilter,
    columns: [
      { label: '图片标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '事件分类', prop: 'eventSort', minWidth: 120 }
    ]
  },
  dataVideoSlice: {
    title: '视频片段',
    endpoint: 'videoslice',
    readonly: true,
    cardView: true,
    filters: deviceFilter,
    columns: [
      { label: '片段标识', prop: 'id', minWidth: 180 },
      { label: '设备编号', prop: 'deviceId', minWidth: 150 },
      { label: '设备名称', prop: 'deviceName', minWidth: 150 },
      { label: '视频地址', prop: 'storagePath', minWidth: 220 },
      { label: '数据时间', prop: 'datetime', minWidth: 160 }
    ]
  },
  manualFace: {
    title: '人工采集人脸',
    endpoint: 'faces',
    filters: entityFiltersWithGender(),
    columns: entityColumns('人脸标识'),
    formFields: [
      ...baseManualFields.slice(0, 2),
      { label: '人脸出现时间', prop: 'FaceAppearTime', type: 'datetime' },
      { label: '人脸消失时间', prop: 'FaceDisAppearTime', type: 'datetime' },
      ...baseManualFields.slice(2)
    ]
  },
  manualPerson: {
    title: '人工采集人员',
    endpoint: 'persons',
    filters: entityFiltersWithGender(),
    columns: entityColumns('人员标识'),
    formFields: [
      ...baseManualFields.slice(0, 2),
      { label: '人员出现时间', prop: 'PersonAppearTime', type: 'datetime' },
      { label: '人员消失时间', prop: 'PersonDisAppearTime', type: 'datetime' },
      ...baseManualFields.slice(2),
      { label: '身高下限', prop: 'HeightLowerLimit', type: 'number' },
      { label: '身高上限', prop: 'HeightUpLimit', type: 'number' },
      { label: '行为描述', prop: 'BehaviorDescription', type: 'textarea' }
    ]
  },
  manualMotorVehicle: {
    title: '人工采集车辆',
    endpoint: 'motorvehicles',
    saveUrl: '/api/viid/motorvehicles',
    filters: deviceFilter,
    columns: [
      { label: '车辆标识', prop: 'id', minWidth: 180 },
      { label: '卡口编号', prop: 'tollgateId', minWidth: 150 },
      ...dataTimeColumns,
      { label: '车牌号', prop: 'plateNo', minWidth: 120 }
    ],
    formFields: [
      { label: '卡口编号', prop: 'TollgateID', type: 'remoteTollgate' },
      { label: '设备编号', prop: 'DeviceID', type: 'remoteDevice', required: true },
      { label: '经过时刻', prop: 'PassTime', type: 'datetime' },
      { label: '有无车牌', prop: 'HasPlate', type: 'select', options: yesNoOptions },
      { label: '号牌种类', prop: 'PlateClass' },
      { label: '号牌颜色', prop: 'PlateColor' },
      { label: '车牌号', prop: 'PlateNo' },
      { label: '车身颜色', prop: 'VehicleColor' },
      { label: '速度', prop: 'Speed', type: 'number' },
      { label: '车辆品牌', prop: 'VehicleBrand' },
      { label: '车辆款型', prop: 'VehicleModel' },
      { label: '图片列表', prop: 'SubImageList', type: 'subImages', fields: subImageFields }
    ]
  },
  manualNonMotorVehicle: {
    title: '人工采集非机动车',
    endpoint: 'nonmotorvehicles',
    filters: deviceFilter,
    columns: [
      { label: '非机动车标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '车牌号', prop: 'plateNo', minWidth: 120 },
      { label: '车身颜色', prop: 'vehicleColor', minWidth: 120 }
    ],
    formFields: [
      { label: '设备编号', prop: 'DeviceID', type: 'remoteDevice', required: true },
      { label: '位置标记时间', prop: 'MarkTime', type: 'datetime' },
      { label: '车辆出现时间', prop: 'AppearTime', type: 'datetime' },
      { label: '车辆消失时间', prop: 'DisappearTime', type: 'datetime' },
      { label: '有无车牌', prop: 'HasPlate', type: 'select', options: yesNoOptions },
      { label: '号牌种类', prop: 'PlateClass' },
      { label: '号牌颜色', prop: 'PlateColor' },
      { label: '车牌号', prop: 'PlateNo' },
      { label: '车身颜色', prop: 'VehicleColor' },
      { label: '图片列表', prop: 'SubImageList', type: 'subImages', fields: subImageFields }
    ]
  },
  manualImage: {
    title: '人工采集图像',
    endpoint: 'images',
    filters: deviceFilter,
    columns: [
      { label: '图片标识', prop: 'id', minWidth: 180 },
      ...dataTimeColumns,
      { label: '事件分类', prop: 'eventSort', minWidth: 120 }
    ],
    formFields: [
      { label: '事件分类', prop: 'EventSort' },
      { label: '设备编号', prop: 'DeviceID', type: 'remoteDevice', required: true },
      { label: '拍摄时间', prop: 'ShotTime', type: 'datetime' },
      { label: '题名', prop: 'Title' },
      { label: '密级代码', prop: 'SecurityLevel' },
      { label: '场景图地址', prop: 'StoragePath' },
      { label: '图像来源', prop: 'ImageSource' },
      { label: '题名补充', prop: 'TitleNote', type: 'textarea' }
    ]
  }
}

export const settingConfigs = {
  instance: {
    title: '当前节点',
    mode: 'selfInstance',
    fields: [
      { label: '节点编号', prop: 'instanceId', disabled: true },
      { label: '节点名称', prop: 'instanceName', required: true },
      { label: '协议', prop: 'scheme', type: 'select', options: [{ label: 'HTTP', value: 'http' }, { label: 'HTTPS', value: 'https' }] },
      { label: '节点地址', prop: 'host', required: true },
      { label: '节点端口', prop: 'port', type: 'number' },
      { label: '授权用户', prop: 'username' },
      { label: '授权密码', prop: 'password', type: 'password' }
    ]
  },
  storage: {
    title: '存储配置',
    mode: 'setting',
    fields: [
      { label: '存储组件', prop: 'storage', type: 'select', options: [{ label: 'OSS存储', value: 's3' }, { label: '文件系统', value: 'filesystem' }] },
      { label: '图片压缩', prop: 'compress', type: 'switch' },
      { label: '图片路径前缀', prop: 'domain' },
      { label: 'OSS端点', prop: 'endpoint' },
      { label: '授权 Key', prop: 'accessKey' },
      { label: '授权 Secret', prop: 'accessSecret', type: 'password' },
      { label: '存储桶名称', prop: 'bucket' },
      { label: '文件系统路径', prop: 'diskDirectory' }
    ]
  },
  customizer: {
    title: '行为配置',
    mode: 'setting',
    fields: [
      { label: '设备注册校验密码', prop: 'validate', type: 'switch' },
      { label: '严格校验订阅编号', prop: 'subscribeStrict', type: 'switch' },
      { label: '数据回收天数', prop: 'dataRecycleDays', type: 'number' },
      { label: '图片回收天数', prop: 'imageRecycleDays', type: 'number' }
    ]
  }
}

function entityFiltersWithGender() {
  return [
    { label: '设备', prop: 'deviceId', type: 'remoteDevice' },
    { label: '性别', prop: 'keyword', type: 'select', options: genderOptions },
    { label: '开始时间', prop: 'startTime', type: 'datetime' },
    { label: '结束时间', prop: 'endTime', type: 'datetime' }
  ]
}

function entityColumns(idLabel) {
  return [
    { label: idLabel, prop: 'id', minWidth: 180 },
    ...dataTimeColumns,
    { label: '性别', prop: 'gender', width: 100 },
    { label: '年龄段', prop: 'age', width: 100 }
  ]
}
