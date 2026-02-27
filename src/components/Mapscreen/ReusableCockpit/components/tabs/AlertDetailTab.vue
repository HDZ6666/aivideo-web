<template>
    <div class="alert-detail-tab">
   
      <!-- 实时视频区域 -->
      <div class="video-section">
              <div class="section-header">
                <div class="section-icon">📹</div>
                <div class="section-title">实时视频监控</div>
                <div class="video-status">
                  <span class="status-indicator online"></span>
                  摄像头在线
                </div>
              </div>
              
              <div class="video-container">
                <!-- 视频播放器 -->         
                <div class="video-player">
                    <!-- 视频播放器 -->
                    <!-- 【已注释】录播视频播放，现在只播放实时视频 -->
                    <!-- <video 
                      ref="videoElement"
                      class="video-element"
                      :src="!isRealTimeMode ? videoUrl : ''"
                      controls
                    >
                      您的浏览器不支持视频播放
                    </video> -->
                    
                    <!-- 实时视频播放器 -->
                    <JessibucaPlayer
                      v-if="currentStreamUrl"
                      ref="playerRef"
                      :key="`player-${currentStreamUrl}`"
                      class="video-element"
                      :video-url="currentStreamUrl"
                      :auto-play="true"
                      :muted="true"
                      :debug="false"
                      :show-operate-btns="true"
                    />
                    <div v-else class="video-placeholder">
                      <span class="video-subtext">暂无实时视频流</span>
                    </div>
                    
                    <!-- 简化的控制栏 -->
                    <div class="video-controls">
                      <button class="control-btn" @click="takeSnapshot">
                        <span class="btn-icon">📸</span>
                        截图
                      </button>
                      <!-- 【已注释】切换按钮，现在只播放实时视频 -->
                      <!-- <button 
                        class="control-btn" 
                        :class="{ 'active': isRealTimeMode }"
                        @click="switchToRealTime"
                        :disabled="!canSwitchToRealTime"
                      >
                        <span class="btn-icon">🔴</span>
                        {{ isRealTimeMode ? '实时视频' : '切换到实时' }}
                      </button> -->
                      <span class="video-text">{{ buildingData?.name }} - 实时监控</span>
                    </div>
                  </div>
                <!-- 摄像头信息 -->
                <div class="camera-info">
                  <div class="info-card">
                    <div class="card-header">
                      <div class="card-icon">🚨</div>
                      <div class="card-title">告警检测信息</div>
                    </div>
                    <div class="card-content">
                      <!-- 检测类型（支持多个） -->
                      <div class="info-item">
                        <span class="label">该摄像头检测类型:</span>
                        <div class="value-container">
                          <span 
                            v-for="(type, index) in alertData.detectionTypes" 
                            :key="index"
                            class="tag"
                          >
                            {{ type }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- 置信度 -->
                      <!-- <div class="info-item">
                        <span class="label">置信度:</span>
                        <span class="value confidence">{{ alertData.confidence }}</span>
                      </div> -->
                      
                      <!-- 设备名称 -->
                      <div class="info-item">
                        <span class="label">设备名称:</span>
                        <span class="value">{{ alertData.deviceName }}</span>
                      </div>
                      
                      <!-- 通知方式 -->
                      <div class="info-item">
                        <span class="label">通知方式:</span>
                        <span class="value notification">{{ alertData.notificationMethod }}</span>
                      </div>
                      
                      <!-- 告警时间 -->
                      <div class="info-item">
                        <span class="label">设备更新时间:</span>
                        <span class="value time">{{ alertData.alertTime }}</span>
                      </div>

                           
                      <!-- 生产厂家 -->
                      <div class="info-item">
                        <span class="label">摄像头生产厂家:</span>
                        <span class="value time">{{ alertData.manufacture }}</span>
                      </div>
                      
                      <!-- 安装位置 -->
                      <!-- <div class="info-item">
                        <span class="label">安装位置:</span>
                        <span class="value">{{ buildingData?.address }}</span>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
      <!-- 告警信息区域 -->
      <!-- <div class="alert-info-section">
        <div class="section-header">
          <div class="section-icon">🚨</div>
          <div class="section-title">告警详细信息</div>
          <div class="alert-status">
            <span :class="['status-badge', getAlertStatusClass()]">
              {{ getAlertStatusText() }}
            </span>
          </div>
        </div> -->
  
        <!-- 当前告警状态 -->
        <!-- <div class="current-alert-status">
          <div class="alert-summary">
            <div class="summary-item">
              <div class="summary-label">最近告警</div>
              <div class="summary-value">{{ getLatestAlertTime() }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">告警级别</div>
              <div :class="['summary-value', getAlertLevelClass()]">
                {{ getAlertLevelText() }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">处理状态</div>
              <div :class="['summary-value', getProcessStatusClass()]">
                {{ getProcessStatus() }}
              </div>
            </div>
          </div>
        </div> -->
  
        <!-- 告警详细信息 -->
        <!-- <div class="alert-details">
          <div class="info-card">
            <div class="card-header">
              <div class="card-icon">📝</div>
              <div class="card-title">告警详情</div>
            </div>
            <div class="card-content detailed-info">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">设备ID:</span>
                  <span class="detail-value">{{ alertData.deviceId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">告警类型:</span>
                  <span class="detail-value">


                    <div class="value-container">
                          <span 
                            v-for="(type, index) in alertData.detectionTypes" 
                            :key="index"
                            class="tag"
                          >
                            {{ type }}
                          </span>
                        </div>
                    
                  </span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">发生时间:</span>
                  <span class="detail-value">{{ getLatestAlertTime() }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">持续时长:</span>
                  <span class="detail-value">{{ getAlertDuration() }}</span>
                </div>
              </div>
              <div class="detail-row full-width">
                <div class="detail-item">
                  <span class="detail-label">告警位置:</span>
                  <span class="detail-value">{{ buildingData?.address }}</span>
                </div>
              </div>
              <div class="detail-row full-width">
                <div class="detail-item">
                  <span class="detail-label">告警描述:</span>
                  <span class="detail-value description">{{ getAlertDescription() }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">处理人员:</span>
                  <span class="detail-value">{{ getProcessor() }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">联系方式:</span>
                  <span class="detail-value">{{ getContactInfo() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->
  
  
  
        <!-- 告警证据 -->
        <!-- <div class="alert-evidence" v-if="hasAlertEvidence">
          <div class="section-header">
            <div class="section-icon">🖼️</div>
            <div class="section-title">告警证据</div>
            <div class="evidence-count">{{ alertImages.length }} 张图片</div>
          </div> -->
          
         <!-- 可点击放大的版本 -->
          <!-- <div class="evidence-grid">
            <div class="evidence-item" v-for="(img, index) in alertImages" :key="index">
              <div class="evidence-image-container" @click="previewImage(img)">
                <img :src="img" :alt="`告警截图 ${index + 1}`" class="evidence-image" />
                <div class="image-badge">#{{ index + 1 }}</div>
                <div class="image-overlay">
                  <span class="zoom-icon">🔍</span>
                </div>
              </div>
              <div class="image-meta">
                <div class="image-time">{{ getImageTime(index) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
</template>
  
  <script setup> 
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import JessibucaPlayer from '@/components/player/JessibucaPlayer.vue'
 
// 瀵煎叆璁惧绠楁硶璇︽儏鎺ュ彛锛坉eviceAlgorithmDetail锛?
import { getDeviceAlgorithmDetail } from "@/api/datav/cockpit"

  // 鎺ユ敹鐖剁粍浠朵紶閫掔殑鏁版嵁
  const props = defineProps({
    buildingData: {
      type: Object,
      default: () => ({})
    }
  })

  // 鍝嶅簲寮忔暟鎹?
  const isPlaying = ref(true)
  const alertImages = ref([])
  const alertData = ref({})
  // 銆愬凡娉ㄩ噴銆戝綍鎾棰戠浉鍏崇姸鎬侊紝鐜板湪鍙挱鏀惧疄鏃惰棰?
  // const videoUrl = ref('')
  // const originalVideoUrl = ref('') // 淇濆瓨鍘熷鐨勫綍鎾棰慤RL
  
  // 瀹炴椂瑙嗛鐩稿叧鐘舵€?
  const isRealTimeMode = ref(true) // 濮嬬粓涓哄疄鏃惰棰戞ā寮?
  const realTimeFlvUrl = ref('') // 淇濆瓨瀹炴椂瑙嗛 FLV 鍦板潃锛堜粠 aiStreamInfo.FLV 鑾峰彇锛?
  const playerRef = ref(null) // Jessibuca 播放器实例引用
  const currentStreamUrl = ref('') // 当前实时视频流地址


  // 鍒濆鍖栨暟鎹?
  onMounted(() => {
    console.log('AlertDetailTab mounted, start fetchAlertData')
    fetchAlertData() 
  })

  // // 鍔犺浇鍛婅鏁版嵁
  // const loadAlertData = () => {
  //   // 杩欓噷妯℃嫙API璋冪敤锛屽疄闄呬娇鐢ㄦ椂鏇挎崲涓虹湡瀹炵殑API璋冪敤
  //   // const apiData = mockApiResponse.data
  

  //   fetchAlertData()
  //   const apiData = fetchAlertData.data
  //   //鏄犲皠鍚庣鏁版嵁鍒板墠绔粨鏋?
  //   alertData.value = {
  //     hasAlert: apiData.status === 0, // 鏍规嵁status鍒ゆ柇鏄惁鏈夊憡璀?
  //     alertLevel: getAlertLevel(apiData.confidence_level),
  //     alertType: apiData.alarm_type_name,
  //     alertTime: apiData.alarm_time,
  //     alertDescription: `妫€娴嬪埌${apiData.alarm_type_name}锛岀疆淇″害${apiData.confidence_level}%`,
  //     processStatus: 'pending',
  //     processor: '',
  //     alertId: apiData.alarm_id,
  //     contactInfo: '13800138000',
  //     duration: '2鍒?5绉?,
      
  //     // 鏂板瀛楁 - 鐩存帴浣跨敤鍚庣鏁版嵁
  //     detectionTypes: [apiData.alarm_type_name], // 妫€娴嬬被鍨嬫暟缁?
  //     confidence: `${apiData.confidence_level}%`, // 缃俊搴?
  //     deviceName: apiData.device_name, // 璁惧鍚嶇О
  //     notificationMethod: Array.isArray(apiData.notice_types) ? apiData.notice_types.join('、') : '微信',
  //     alarmImg: apiData.alarm_img // 鍛婅鍥剧墖
  //   }
    
  //   // 璁剧疆瑙嗛URL
  //   videoUrl.value = apiData.videoUrl
    
  //   // 璁剧疆鍛婅鍥剧墖
  //   if (apiData.alarm_img) {
  //     alertImages.value = [apiData.alarm_img]
  //   }
  // }

  // 鏍规嵁缃俊搴﹀垽鏂憡璀︾骇鍒?
  const getAlertLevel = (confidence) => {
    if (confidence >= 80) return 'high'
    if (confidence >= 60) return 'medium'
    return 'low'
  }

  // 鍏朵粬璁＄畻鏂规硶淇濇寔涓嶅彉...
  const getAlertStatusText = () => {
    return alertData.value.hasAlert ? '存在告警' : '正常'
  }

  const getAlertStatusClass = () => {
    return alertData.value.hasAlert ? 'status-active' : 'status-inactive'
  }

  const getAlertLevelText = () => {
    const textMap = {
      high: '高危',
      medium: '中危',
      low: '低危'
    }
    return textMap[alertData.value.alertLevel] || '未知'
  }

  const getAlertLevelClass = () => {
    const classMap = {
      high: 'highlight',
      medium: 'warning',
      low: 'info'
    }
    return classMap[alertData.value.alertLevel] || ''
  }

  const getAlertType = () => {
    return alertData.value.alertType
  }

  const getLatestAlertTime = () => {
    return alertData.value.alertTime
  }

  const getLatestAlertId = () => {
    return alertData.value.alertId
  }

  const getAlertDescription = () => {
    return alertData.value.alertDescription
  }

  const getAlertDuration = () => {
    return alertData.value.duration
  }

  const getProcessStatus = () => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      resolved: '已处理'
    }
    return statusMap[alertData.value.processStatus] || '未知'
  }

  const getProcessStatusClass = () => {
    const classMap = {
      pending: 'status-inactive',
      processing: 'status-suspended',
      resolved: 'status-active'
    }
    return classMap[alertData.value.processStatus] || ''
  }

  const getProcessor = () => {
    return alertData.value.processor || '未分配'
  }

  const getContactInfo = () => {
    return alertData.value.contactInfo || '暂无'
  }

  const hasAlertEvidence = computed(() => {
    return alertImages.value.length > 0
  })

  const getImageTime = (index) => {
    // 浣跨敤瀹為檯鐨勫憡璀︽椂闂?
    return alertData.value.alertTime || '未知时间'
  }



  // 鍛婅澶勭悊鐩稿叧鏂规硶
  const handleProcessAlert = () => {
    alertData.value.processStatus = 'processing'
    alertData.value.processor = '管理员'
    console.log('开始处理告警')
  }

  const handleIgnoreAlert = () => {
    console.log('忽略告警')
  }

  const handleViewHistory = () => {
    console.log('查看历史告警')
  }

  const handleExportReport = () => {
    console.log('导出告警报告')
  }

  const viewImage = (index) => {
    console.log('查看图片:', alertImages.value[index])
    // 瀹為檯浣跨敤鏃跺彲浠ユ墦寮€鍥剧墖棰勮妯℃€佹
    window.open(alertImages.value[index], '_blank')
  }

  const downloadImage = (index) => {
    console.log('下载图片:', alertImages.value[index])
    // 瀹為檯浣跨敤鏃跺疄鐜板浘鐗囦笅杞介€昏緫
    const link = document.createElement('a')
    link.href = alertImages.value[index]
    link.download = `告警图片_${alertData.value.alertId}_${index + 1}.jpg`
    link.click()
  }



  // 淇鍚庣殑 API 璋冪敤鏂规硶

const fetchAlertData = async () => {
  try {
    console.log('🟡 开始请求告警数据（deviceAlgorithmDetail）...')

    // 浠?props 鑾峰彇 deviceId 鍜?channelId
    const deviceId = props.buildingData?.deviceId || props.buildingData?.device_id
    const channelId = props.buildingData?.channelId || props.buildingData?.channel_id

    if (!deviceId || !channelId) {
      console.warn('🟡 缺少 deviceId 或 channelId，使用 Mock 数据')
      useMockData()
      return
    }

    const params = {
      deviceId: String(deviceId),
      channelId: String(channelId),
    }

    // 璋冪敤灏佽濂界殑鍚庣鎺ュ彛
    const result = await getDeviceAlgorithmDetail(params)
    console.log('🟢 API 响应数据:', result)

    if (result && (result.code === 200 || result.code === 0)) {
      console.log('🟢 数据处理中...')
      processApiData(result.data)
    } else {
      console.warn('🟡 API 返回非成功状态码:', result?.msg)
      useMockData()
    }
  } catch (error) {
    console.error('🔴 获取告警数据失败:', error)
    console.log('🟡 切换到Mock数据...')
    useMockData()
  }
}

// ================== 婧愬疄鐜颁繚鐣欙紙浣跨敤 fetch 鐨勭増鏈紝浠呬綔鍙傝€冿紝宸茬敱涓婃柟 getDeviceAlgorithmDetail 鏇夸唬锛?==================
// const fetchAlertData = async () => {
//   try {
//     console.log('馃煛 寮€濮嬭姹傚憡璀︽暟鎹?..')
//     
//     // 浠?props 鑾峰彇 alarm_id锛屽鏋滄病鏈夊垯浣跨敤榛樿鍊?
//     // const alarmId = props.buildingData?.id || '30107'
//     // console.log('馃數 浣跨敤鐨?alarm_id:', alarmId)
//     
//     // 娣诲姞鏌ヨ鍙傛暟锛屼粠 buildingData 涓幏鍙?deviceId 鍜?channelId,娴嬭瘯褰㈠紡鍚庨潰涓や釜涓嶈
//     // const deviceId = props.buildingData?.deviceId || props.buildingData?.device_id || "41010500001320000104"
//     // const channelId = props.buildingData?.channelId || props.buildingData?.channel_id || "41010500001320000104"
//     const deviceId = props.buildingData?.deviceId
//     const channelId = props.buildingData?.channelId 
//     
//     const params = new URLSearchParams({
//       deviceId: String(deviceId),
//       channelId: String(channelId)
//     })
//     
//     // 浣跨敤鐩稿璺緞锛岄€氳繃 nginx 浠ｇ悊鍒板悗绔?
//     // 鍓嶇鍦板潃: http://183.239.58.28:13001
//     // nginx 閰嶇疆: location ^~ /ai/api/ { proxy_pass http://web-backend; }
//     // 鍚庣鍦板潃: http://172.16.2.80:18080
// 
//     // const url = `/ai/api/alarm/alarmDeviceDetail?${params}`
//     const url = `/ai/api/device/query/deviceAlgorithmDetail?${params}`
//     console.log('馃數 瀹屾暣璇锋眰URL (閫氳繃nginx浠ｇ悊):', url)
// 
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders()
//     })
// 
//     console.log('馃煛 鏀跺埌鍝嶅簲锛岀姸鎬佺爜:', response.status)
//     console.log('馃數 鍝嶅簲ok:', response.ok)
// 
//     if (!response.ok) {
//       const errorText = await response.text()
//       console.log('馃敶 鏈嶅姟鍣ㄩ敊璇鎯?', errorText)
//       throw new Error(`HTTP 閿欒! 鐘舵€佺爜: ${response.status}`)
//     }
// 
//     const result = await response.json()
//     console.log('馃煝 API 鍝嶅簲鏁版嵁:', result)
// 
//     if (result.code === 0) {
//       console.log('馃煝 鏁版嵁澶勭悊涓?..')
//       processApiData(result.data)
//     } else {
//       console.warn('馃煛 API 杩斿洖闈為浂鐘舵€佺爜:', result.msg)
//       // 涓氬姟閿欒涔熶娇鐢∕ock鏁版嵁
//       useMockData()
//     }
//     
//   } catch (error) {
//     console.error('馃敶 鑾峰彇鍛婅鏁版嵁澶辫触:', error)
//     console.log('馃煛 鍒囨崲鍒癕ock鏁版嵁...')
//     useMockData()
//   }
// }

  
  // 澶勭悊API杩斿洖鐨勬暟鎹?
  const processApiData = (apiData) => {

    console.log('🔵 原始API数据:', apiData) 
    alertData.value = {
      hasAlert: apiData.status === 0,
      alertLevel: getAlertLevel(apiData.confidence_level),
      alertType: apiData.alarm_type_name,
      alertTime: apiData.updateTime,
      manufacture: apiData.manufacture,
      // alertDescription: `妫€娴嬪埌${apiData.alarm_type_name}锛岀疆淇″害${apiData.confidence_level}%`,
      processStatus: 'pending',
      processor: '',
      alertId: apiData.alarm_id,
      deviceId: apiData.device_id,
      // contactInfo: '13800138000',
      // duration: '2鍒?5绉?,
      
      // detectionTypes: [apiData.alarm_type_name_list],
      
      // 鉁?淇鍚庣殑姝ｇ‘鏄犲皠
      detectionTypes: apiData.
      alarmTypeNameList 
        ? apiData.alarmTypeNameList.map(item => item.alarmTypeName)  // 鎻愬彇 alarmTypeName
        : ['行人识别', '越界识别'],  // 备用值


      // confidence: `${apiData.confidence_level}%`,
      deviceName: apiData.name,
      notificationMethod: Array.isArray(apiData.notice_types) ? apiData.notice_types.join('、') : '微信',
      alarmImg: apiData.alarm_img
    }
    //瑙嗛鍦板潃閰嶇疆
    
    if (apiData.alarm_img) {
      alertImages.value = [apiData.alarm_img]
      console.log('图片链接', alertImages)
    }
    
    // 銆愬凡娉ㄩ噴銆戝綍鎾棰戝湴鍧€锛岀幇鍦ㄥ彧鎾斁瀹炴椂瑙嗛
    // videoUrl.value = apiData.videoUrl || ''
    // originalVideoUrl.value = apiData.videoUrl || '' // 淇濆瓨鍘熷褰曟挱瑙嗛URL
    
    // 仅使用接口返回的实时 FLV 地址
    if (apiData.aiStreamInfo && apiData.aiStreamInfo.FLV) {
      realTimeFlvUrl.value = apiData.aiStreamInfo.FLV
      nextTick(() => {
        startRealTimeVideo()
      })
    } else {
      realTimeFlvUrl.value = ''
      currentStreamUrl.value = ''
      console.warn('API 响应中未返回 aiStreamInfo.FLV，跳过实时播放')
    }

    console.log('实时视频 FLV 地址:', realTimeFlvUrl.value)
  }

    // 鍥剧墖閿欒澶勭悊
  const handleImageError = (event) => {
    console.warn('图片加载失败:', event.target.src)
    // 鍙互璁剧疆榛樿鍥剧墖鎴栭殣钘忓鐞?
    event.target.style.display = 'none'
  }

    // 鍥剧墖棰勮鏂规硶
  const previewImage = (imgUrl) => {
    window.open(imgUrl, '_blank')
    // 鎴栬€呬娇鐢ㄦā鎬佹棰勮
    // showImagePreview(imgUrl)
  }

 // 瑙嗛閾炬帴鐩存帴鎾斁鏂规硶锛堟渶绠€鍗曪級
  // 鎴浘鍔熻兘
  const takeSnapshot = () => {
    if (playerRef.value?.screenshot) {
      playerRef.value.screenshot()
      return
    }
    console.warn('播放器未就绪，无法截图')
  }

  // 銆愬凡娉ㄩ噴銆戣绠楀睘鎬э細鏄惁鍙互鍒囨崲鍒板疄鏃惰棰戯紝鐜板湪鑷姩鎾斁锛屼笉闇€瑕佸垏鎹?
  // const canSwitchToRealTime = computed(() => {
  //   // 浼樺厛妫€鏌ユ槸鍚︽湁 FLV 鍦板潃锛屽鏋滄病鏈夊垯妫€鏌ユ槸鍚︽湁璁惧ID鍜岄€氶亾ID锛堝鐢ㄦ柟妗堬級
  //   return !!(realTimeFlvUrl.value || (deviceId.value && channelId.value))
  // })

  // 閿€姣丗LV鎾斁鍣?
  // 已切换为 JessibucaPlayer 播放，旧 flv.js 初始化逻辑已移除

  // 銆愬凡娉ㄩ噴銆戝垏鎹㈠埌瀹炴椂瑙嗛鍑芥暟锛岀幇鍦ㄨ嚜鍔ㄦ挱鏀惧疄鏃惰棰戯紝涓嶉渶瑕佸垏鎹?
  // const switchToRealTime = async () => {
  //   // 濡傛灉宸茬粡鏄疄鏃舵ā寮忥紝鍒囨崲鍥炲綍鎾?
  //   if (isRealTimeMode.value) {
  //     
  //     // 閿€姣丗LV鎾斁鍣?
  //     destroyFlvPlayer()
  //     
  //     // 鎭㈠褰曟挱瑙嗛
  //     await nextTick()
  //     videoUrl.value = originalVideoUrl.value
  //     isRealTimeMode.value = false
  //     
  //     // 閲嶆柊鍔犺浇褰曟挱瑙嗛
  //     if (videoElement.value) {
  //       videoElement.value.load()
  //     }
  //     
  //     return
  //   }

  //   // 妫€鏌ユ槸鍚︽湁 FLV 鍦板潃鎴栬澶囦俊鎭?
  //   if (!realTimeFlvUrl.value && (!deviceId.value || !channelId.value)) {
  //     console.error('馃敶 缂哄皯瀹炴椂瑙嗛 FLV 鍦板潃鎴栬澶囦俊鎭紝鏃犳硶鍒囨崲鍒板疄鏃惰棰?)
  //     alert('鏃犳硶鍒囨崲鍒板疄鏃惰棰戯細缂哄皯瑙嗛娴佸湴鍧€鎴栬澶囦俊鎭?)
  //     return
  //   }

  //   try {
  //     console.log('馃煛 寮€濮嬪垏鎹㈠埌瀹炴椂瑙嗛...')
  //     
  //     // 浼樺厛浣跨敤 API 杩斿洖鐨?FLV 鍦板潃锛屽鏋滄病鏈夊垯鎵嬪姩鏋勫缓锛堝鐢ㄦ柟妗堬級
  //     let flvUrl = ''
  //     if (realTimeFlvUrl.value) {
  //       // 浣跨敤 API 杩斿洖鐨?FLV 鍦板潃
  //       flvUrl = realTimeFlvUrl.value
  //       console.log('鉁?浣跨敤 API 杩斿洖鐨?FLV 鍦板潃:', flvUrl)
  //     } else {
  //       // 澶囩敤鏂规锛氭墜鍔ㄦ瀯寤?FLV 鍦板潃
  //       flvUrl = `${VIDEO_STREAM_URL}/rtp/${deviceId.value}_${channelId.value}.live.flv`
  //       console.log('鈿狅笍 API 鏈繑鍥?FLV 鍦板潃锛屼娇鐢ㄥ鐢ㄦ柟妗堟瀯寤?', flvUrl)
  //       console.log('馃數 璁惧ID:', deviceId.value, '閫氶亾ID:', channelId.value)
  //     }

  //     // 鍒囨崲鍒板疄鏃舵ā寮?
  //     isRealTimeMode.value = true

  //     // 绛夊緟DOM鏇存柊鍚庡垵濮嬪寲FLV鎾斁鍣?
  //     await nextTick()
  //     initFlvPlayer(flvUrl)

  //     console.log('馃煝 宸插垏鎹㈠埌瀹炴椂瑙嗛妯″紡')
  //   } catch (error) {
  //     console.error('馃敶 鍒囨崲鍒板疄鏃惰棰戝け璐?', error)
  //     alert('鍒囨崲鍒板疄鏃惰棰戝け璐? ' + error.message)
  //     isRealTimeMode.value = false
  //   }
  // }

  // 鑷姩鎾斁瀹炴椂瑙嗛
  const startRealTimeVideo = async () => {
    if (!realTimeFlvUrl.value) {
      currentStreamUrl.value = ''
      console.warn('缺少 aiStreamInfo.FLV，无法播放实时视频')
      return
    }

    try {
      const flvUrl = realTimeFlvUrl.value
      isRealTimeMode.value = true

      await nextTick()
      if (currentStreamUrl.value === flvUrl) {
        currentStreamUrl.value = ''
        await nextTick()
      }
      currentStreamUrl.value = flvUrl
      console.log('实时视频开始播放')
    } catch (error) {
      console.error('播放实时视频失败:', error)
      alert('播放实时视频失败: ' + error.message)
    }
  }

  // 缁勪欢鍗歌浇鏃舵竻鐞?
  onUnmounted(() => {
    currentStreamUrl.value = ''
  }) 

// // 瀹炴椂瑙嗛鍙栨祦鏂规硶
// // import { ref, onMounted, onUnmounted } from 'vue'
// import flvjs from 'flv.js'

// // 鍝嶅簲寮忔暟鎹?
// const videoElement = ref(null)
// // const isPlaying = ref(false)
// const videoLoading = ref(false)
// const videoError = ref('')
// const currentTime = ref('00:00')
// const duration = ref('00:00')
// const videoResolution = ref('640x360')
// const streamStatus = ref('瀹炴椂')
// const flvPlayer = ref(null)

// // 鍒濆鍖栬棰?
// const initVideo = async () => {
//   if (!videoElement.value) return
  
//   videoLoading.value = true
//   videoError.value = ''
  
//   try {
//     // 鑾峰彇瀹炴椂瑙嗛娴乁RL锛堜娇鐢‵LV鏍煎紡锛?
//     const videoUrl = await fetchRealTimeVideo()
    
//     if (flvjs.isSupported()) {
//       // 閿€姣佷箣鍓嶇殑鎾斁鍣?
//       if (flvPlayer.value) {
//         flvPlayer.value.destroy()
//       }
      
//       // 鍒涘缓鏂扮殑FLV鎾斁鍣?
//       flvPlayer.value = flvjs.createPlayer({
//         type: 'flv',
//         url: videoUrl,
//         isLive: true,
//         hasAudio: false
//       })
      
//       flvPlayer.value.attachMediaElement(videoElement.value)
//       flvPlayer.value.load()
      
//       // 鐩戝惉浜嬩欢
//       flvPlayer.value.on(flvjs.Events.LOADING_COMPLETE, () => {
//         videoLoading.value = false
//         isPlaying.value = true
//       })
      
//       flvPlayer.value.on(flvjs.Events.ERROR, (error) => {
//         videoLoading.value = false
//         videoError.value = '瑙嗛鍔犺浇澶辫触'
//         console.error('FLV鎾斁閿欒:', error)
//       })
      
//     } else {
//       videoError.value = '娴忚鍣ㄤ笉鏀寔FLV鎾斁'
//     }
    
//   } catch (error) {
//     videoLoading.value = false
//     videoError.value = '鑾峰彇瑙嗛娴佸け璐?
//     console.error('鍒濆鍖栬棰戝け璐?', error)
//   }
// }

// // 鑾峰彇瀹炴椂瑙嗛URL
// const fetchRealTimeVideo = async () => {
//   try {
//     const response = await fetch('浣犵殑瀹炴椂瑙嗛API鍦板潃', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Token': '浣犵殑token'
//       },
//       body: JSON.stringify({
//         deviceId: props.buildingData?.deviceId
//       })
//     })
    
//     const result = await response.json()
//     if (result.code === 0) {
//       // 浣跨敤FLV鏍煎紡锛屼篃鍙互閫夋嫨HLS
//       return result.data.flv || result.data.hls
//     } else {
//       throw new Error(result.msg)
//     }
//   } catch (error) {
//     throw new Error('鑾峰彇瑙嗛娴乁RL澶辫触: ' + error.message)
//   }
// }

// // 鎺у埗鏂规硶
// const togglePlay = () => {
//   if (!videoElement.value) return
  
//   if (isPlaying.value) {
//     videoElement.value.pause()
//   } else {
//     videoElement.value.play()
//   }
//   isPlaying.value = !isPlaying.value
// }

// const takeSnapshot = () => {
//   if (!videoElement.value) return
  
//   const canvas = document.createElement('canvas')
//   canvas.width = videoElement.value.videoWidth
//   canvas.height = videoElement.value.videoHeight
//   const ctx = canvas.getContext('2d')
//   ctx.drawImage(videoElement.value, 0, 0)
  
//   // 鍒涘缓涓嬭浇閾炬帴
//   const link = document.createElement('a')
//   link.download = `snapshot_${new Date().getTime()}.png`
//   link.href = canvas.toDataURL()
//   link.click()
  
//   console.log('鎴浘鎴愬姛')
// }

// const toggleFullscreen = () => {
//   if (!videoElement.value) return
  
//   if (document.fullscreenElement) {
//     document.exitFullscreen()
//   } else {
//     videoElement.value.requestFullscreen()
//   }
// }

// // 鐢熷懡鍛ㄦ湡
// onMounted(() => {
//   initVideo()
// })

// onUnmounted(() => {
//   if (flvPlayer.value) {
//     flvPlayer.value.destroy()
//   }
// })


  
  

  </script>
  
  <style scoped>
  .alert-detail-tab {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    overflow-y: auto;
  }
  
  /* 瑙嗛鍖哄煙鏍峰紡 */
  .video-section {
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.4) 0%, rgba(25, 55, 125, 0.6) 100%);
    border: 1px solid rgba(0, 149, 255, 0.2);
    border-radius: 8px;
    padding: 20px;
  }
  
  .video-container {
    display: flex;
    gap: 20px;
    margin-top: 15px;
  }
  
  .video-player {
    flex: 1;
    background: rgba(20, 50, 120, 0.6);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(0, 149, 255, 0.3);
  }
  
  .video-placeholder {
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.8) 0%, rgba(25, 55, 125, 0.9) 100%);
    color: white;
    gap: 12px;
  }
  
  .video-icon {
    font-size: 48px;
    opacity: 0.8;
  }
  
  .video-text {
    font-size: 18px;
    font-weight: 600;
    color: #00feff;
    text-shadow: 0 0 8px rgba(0, 254, 255, 0.3);
  }
  
  .video-subtext {
    font-size: 14px;
    opacity: 0.7;
  }
  
  .video-controls {
    padding: 12px 16px;
    background: rgba(20, 50, 120, 0.8);
    border-top: 1px solid rgba(0, 149, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .control-group {
    display: flex;
    gap: 8px;
  }
  
  .control-btn {
    padding: 6px 12px;
    background: rgba(0, 149, 255, 0.2);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 4px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .control-btn:hover {
    background: rgba(0, 149, 255, 0.4);
    border-color: rgba(0, 149, 255, 0.5);
  }
  
  .btn-icon {
    font-size: 14px;
  }
  
  .video-info {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .camera-info {
    width: 320px;
  }
  
  .video-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 6px rgba(0, 255, 136, 0.5);
  }
  
  .status-indicator.online {
    background: #00ff88;
  }

  /* 鍦?.status-indicator.online 鍚庨潰娣诲姞杩欎簺鏂版牱寮?*/

  .tag {
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .confidence {
    color: #ffa726;
    font-weight: 600;
  }

  .notification {
    color: #42a5f5;
    font-weight: 500;
  }

  .time {
    color: #00feff;
    font-family: monospace;
  }

  /* 淇敼淇℃伅椤规牱寮?- 鏇挎崲鍘熸湁鐨?.info-item 鐩稿叧鏍峰紡 */
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;  /* 鏀逛负flex-start */
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 149, 255, 0.1);
  }

  .info-item .label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    min-width: 80px;
    margin-right: 10px;  /* 鏂板鍙宠竟璺?*/
  }

  .info-item .value {
    color: #00feff;
    font-weight: 500;
    font-size: 14px;
    text-align: right;
    flex: 1;
  }

  /* 鏂板鏍峰紡锛氬憡璀︽娴嬩俊鎭?*/
  .value-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  /* 鍛婅淇℃伅鍖哄煙鏍峰紡 */
  .alert-info-section {
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.4) 0%, rgba(25, 55, 125, 0.6) 100%);
    border: 1px solid rgba(0, 149, 255, 0.2);
    border-radius: 8px;
    padding: 20px;
  }
  
  .current-alert-status {
    margin-bottom: 20px;
  }
  
  .alert-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  .summary-item {
    background: rgba(20, 50, 120, 0.6);
    border: 1px solid rgba(0, 149, 255, 0.2);
    border-radius: 6px;
    padding: 12px;
    text-align: center;
  }
  
  .summary-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 6px;
  }
  
  .summary-value {
    font-size: 16px;
    font-weight: 600;
    color: #00feff;
  }
  
  .summary-value.highlight {
    color: #ff6b6b;
  }
  
  .summary-value.warning {
    color: #ffa726;
  }
  
  .summary-value.info {
    color: #42a5f5;
  }
  
  /* 璇︾粏鍛婅淇℃伅 */
  .detailed-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .detail-row {
    display: flex;
    gap: 20px;
  }
  
  .detail-row.full-width {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 149, 255, 0.1);
  }
  
  .detail-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    min-width: 80px;
  }
  
  .detail-value {
    color: #00feff;
    font-weight: 500;
    font-size: 14px;
    text-align: right;
    flex: 1;
    margin-left: 10px;
  }
  
  .detail-value.description {
    text-align: left;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* 鎿嶄綔鎸夐挳 */
  .alert-actions {
    margin: 20px 0;
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  
  .action-btn {
    padding: 10px 20px;
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .action-btn.primary {
    background: linear-gradient(135deg, rgba(0, 149, 255, 0.6) 0%, rgba(0, 254, 255, 0.4) 100%);
    color: white;
  }
  
  .action-btn.primary:hover {
    background: linear-gradient(135deg, rgba(0, 149, 255, 0.8) 0%, rgba(0, 254, 255, 0.6) 100%);
    border-color: rgba(0, 149, 255, 0.5);
    box-shadow: 0 0 15px rgba(0, 149, 255, 0.3);
  }
  
  .action-btn.secondary {
    background: rgba(20, 50, 120, 0.6);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .action-btn.secondary:hover {
    background: rgba(0, 149, 255, 0.2);
    border-color: rgba(0, 149, 255, 0.4);
  }
  
  /* 鍛婅璇佹嵁 */
  .alert-evidence {
    margin-top: 20px;
  }
  
  .evidence-count {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  

  /* 鏂规涓€锛氱畝娲佸浘鐗囩綉鏍兼牱寮?*/
  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200x, 1fr)); 
    gap: 20px;/* 澧炲ぇ闂磋窛 */
    padding: 20px 0;
  }

  .evidence-item {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .evidence-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .evidence-image-container {
    position: relative;
    width: 100%;
    height:700px;/* 鍦ㄨ繖閲岃缃浘鐗囧ぇ灏?*/
    overflow: hidden;
  }

  .evidence-image {
    width: 100%;
    height: 100%;
    object-fit: cover;/* 淇濇寔鍥剧墖姣斾緥 */
    display: block;
  }

  .image-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.image-meta {
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #f0f0f0;
}

.image-time {
  font-size: 12px;
  color: #666;
  text-align: center;
}
 
  .image-placeholder {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .image-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .image-text {
    font-size: 12px;
  }
  
  
  .image-actions {
    display: flex;
    gap: 6px;
  }
  
  .image-btn {
    flex: 1;
    padding: 4px 8px;
    background: rgba(0, 149, 255, 0.2);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 3px;
    color: white;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .image-btn:hover {
    background: rgba(0, 149, 255, 0.4);
  }

  .image-time {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 绌虹姸鎬佹牱寮?*/
.no-evidence {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-evidence-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-evidence-text {
  font-size: 14px;
}

/* 鍥剧墖鍔犺浇澶辫触澶勭悊 */
.evidence-image-container img[src=""] {
  display: none;
}

.evidence-image-container:has(img[src=""]) {
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.evidence-image-container:has(img[src=""])::before {
  content: "图片加载失败";
  color: #999;
  font-size: 12px;
}


/* .video-player {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.video-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #0095ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #0095ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.video-controls {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-group {
  display: flex;
  gap: 8px;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.video-info {
  display: flex;
  gap: 16px;
  color: #ccc;
  font-size: 12px;
}

.stream-status {
  color: #4CAF50;
  font-weight: bold;
} */

.video-player {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 400px;
  display: block;
}

.video-controls {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control-btn.active {
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.5);
}

.control-btn.active:hover {
  background: rgba(255, 0, 0, 0.4);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.video-text {
  color: white;
  font-size: 14px;
}

  
  /* 鍝嶅簲寮忚璁?*/
  @media (max-width: 1200px) {
    .video-container {
      flex-direction: column;
    }
    
    .camera-info {
      width: 100%;
    }
    
    .alert-summary {
      grid-template-columns: 1fr;
    }
  }
  </style>

