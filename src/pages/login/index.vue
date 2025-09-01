<!-- 登录页面路由配置 -->
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "登录"
  }
}
</route>

<script lang="ts" setup>
import type { ILoginParams } from '@/api/auth'
import { md5 } from 'js-md5'
import { computed, onMounted, ref } from 'vue'
import { getUserInfo, login } from '@/api/auth'
import { useUserStore } from '@/store/user'

// ==================== 页面配置 ====================
defineOptions({
  name: 'LoginPage',
})

// ==================== 状态管理 ====================
const userStore = useUserStore()

// 获取重定向URL
const redirectUrl = ref('')

// 登录表单数据
const loginForm = ref<ILoginParams>({
  username: '',
  password: '',
})

// 是否正在加载
const isLoading = ref(false)

// 是否可以登录
const canLogin = computed(() => {
  return loginForm.value.username.trim() !== ''
    && loginForm.value.password.trim() !== ''
    && !isLoading.value
})

/**
 * 处理登录
 */
async function handleLogin() {
  if (!canLogin.value) {
    return
  }

  try {
    isLoading.value = true

    // 加密密码
    const encryptedParams = {
      ...loginForm.value,
      password: md5(loginForm.value.password),
    }

    // 调用登录接口
    const response = await login(encryptedParams)
    if (response?.accessToken) {
      userStore.setTokenValue(response.accessToken)
    }

    // 获取完整的用户信息
    await getUserUserInfo()

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000,
    })

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      // 如果有重定向URL，跳转到指定页面，否则跳转到首页
      const targetUrl = redirectUrl.value || '/pages/home/index'
      uni.reLaunch({
        url: targetUrl,
      })
    }, 1500)
  }
  catch (error: any) {
    console.error('登录异常:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'error',
      duration: 3000,
    })
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 获取用户信息
 */
async function getUserUserInfo() {
  const response = await getUserInfo()
  const { user, roles: userRoles, permissions: userPermissions } = response

  // 设置用户信息
  userStore.setUserInfo(user)

  // 设置角色和权限
  if (userRoles && userRoles.length > 0) {
    userStore.setRoles(userRoles)
    userStore.setPermissions(userPermissions || ['*:*:*'])
  }
  else {
    userStore.setRoles(['ROLE_DEFAULT'])
    userStore.setPermissions(['*:*:*'])
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 获取页面参数中的重定向URL
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.redirect) {
    redirectUrl.value = decodeURIComponent(options.redirect)
  }

  if (userStore.isLoggedIn) {
    console.log('用户已登录，跳转到目标页面')
    const targetUrl = redirectUrl.value || '/pages/home/index'
    uni.reLaunch({
      url: targetUrl,
    })
  }
})
</script>

<template>
  <!-- 注释：sard-uniapp 组件库中没有 sar-page 组件，使用 view 作为页面容器 -->
  <view class="relative min-h-screen overflow-hidden bg-gray-50">
    <!-- 装饰动画圆圈 -->
    <view
      class="decoration-circle-1 absolute h-400rpx w-400rpx rounded-full from-blue-200 to-blue-400 bg-gradient-to-br opacity-25"
      style="top: -200rpx; right: -200rpx;"
    />
    <view
      class="decoration-circle-2 absolute h-300rpx w-300rpx rounded-full from-purple-200 to-purple-400 bg-gradient-to-tr opacity-25"
      style="bottom: -150rpx; left: -150rpx;"
    />
    <view
      class="decoration-circle-3 absolute h-200rpx w-200rpx rounded-full from-pink-200 to-pink-400 bg-gradient-to-bl opacity-20"
      style="top: 30%; left: 20%;"
    />

    <!-- 主要内容区域 -->
    <view class="py-safe min-h-screen flex flex-col justify-center px-64rpx">
      <!-- Logo和标题区域 -->
      <view class="mb-120rpx text-center">
        <!-- Logo容器 - 新拟态浮起效果 -->
        <view
          class="mx-auto mb-48rpx h-200rpx w-200rpx flex items-center justify-center rounded-32rpx bg-white shadow-gray-200/60 shadow-xl"
        >
          <!-- logo -->
          <view class="i-carbon-video h-80rpx w-80rpx text-blue-500" />
        </view>

        <!-- 标题文字 -->
        <text class="mb-24rpx block text-48rpx text-gray-800 font-bold">
          视频+AI管理平台
        </text>
        <text class="text-32rpx text-gray-600">
          移动端管理系统
        </text>
      </view>

      <!-- 登录表单 - 使用 sard-uniapp 表单组件 -->
      <sar-form>
        <!-- 表单卡片容器 - 新拟态浮起效果 -->
        <view class="mb-64rpx rounded-32rpx bg-white p-64rpx shadow-gray-200/60 shadow-xl">
          <!-- 用户名输入 - 使用 sard-uniapp 输入框 -->
          <sar-input
            v-model="loginForm.username" placeholder="请输入用户名" :disabled="isLoading" clearable
            class="mb-32rpx"
          />

          <!-- 密码输入 - 使用 sard-uniapp 输入框 -->
          <sar-input
            v-model="loginForm.password" type="password" clearable show-eye placeholder="请输入密码"
            :disabled="isLoading" class="mb-64rpx" @keyup.enter="handleLogin"
          />

          <!-- 登录按钮 - 使用 sard-uniapp 按钮 -->
          <sar-button
            type="default" size="large" :loading="isLoading" :disabled="!canLogin" class="mb-48rpx" block
            @click="handleLogin"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </sar-button>
        </view>
      </sar-form>

      <!-- 版本信息 -->
      <view class="text-center">
        <!-- 版本信息容器 - 新拟态浮起效果 -->
        <view class="inline-block rounded-24rpx bg-white px-32rpx py-16rpx shadow-gray-200/50 shadow-lg">
          <text class="text-28rpx text-gray-500">
            版本 v1.0.0
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sar-form {
  background-color: transparent;
}

/* 装饰圆圈浮动动画 - 仅用于UnoCSS无法实现的动画效果 */
.decoration-circle-1 {
  animation: float-1 8s ease-in-out infinite;
}

.decoration-circle-2 {
  animation: float-2 10s ease-in-out infinite;
}

.decoration-circle-3 {
  animation: float-3 6s ease-in-out infinite;
}

@keyframes float-1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }

  33% {
    transform: translate(20rpx, -30rpx) rotate(120deg) scale(1.05);
  }

  66% {
    transform: translate(-15rpx, 25rpx) rotate(240deg) scale(0.95);
  }
}

@keyframes float-2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }

  50% {
    transform: translate(-25rpx, -20rpx) rotate(180deg) scale(1.1);
  }
}

@keyframes float-3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(15rpx, -10rpx) scale(1.15);
  }

  50% {
    transform: translate(-10rpx, 20rpx) scale(0.9);
  }

  75% {
    transform: translate(20rpx, 10rpx) scale(1.05);
  }
}
</style>
