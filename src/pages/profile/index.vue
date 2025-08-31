<route lang="jsonc" type="page">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "我的"
  }
}
</route>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

defineOptions({
  name: 'ProfilePage',
})

// 获取用户store
const userStore = useUserStore()

// 登出处理
async function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({
            title: '退出中...',
            mask: true,
          })

          await userStore.logoutUser()

          uni.hideLoading()
          uni.showToast({
            title: '退出成功',
            icon: 'success',
          })

          // 跳转到登录页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/index',
            })
          }, 1500)
        }
        catch (error) {
          uni.hideLoading()
          uni.showToast({
            title: '退出失败',
            icon: 'error',
          })
          console.error('退出登录失败:', error)
        }
      }
    },
  })
}
</script>

<template>
  <view class="profile-page bg-gray-50">
    <sar-navbar title="我的" class="navbar-custom" />
    <view class="main-content">
      <view class="content-wrapper">
        <!-- 用户头像和基本信息 -->
        <view class="user-header">
          <view class="avatar-container">
            <image
              :src="userStore.avatar"
              class="user-avatar"
              mode="aspectFill"
            />
          </view>
          <view class="user-basic-info">
            <text class="username">
              {{ userStore.userName || '未登录' }}
            </text>
            <text class="user-id">
              ID: {{ userStore.userId || '--' }}
            </text>
          </view>
        </view>

        <!-- 操作按钮区域 -->
        <view class="action-section">
          <button
            class="logout-btn"
            type="default"
            @click="handleLogout"
          >
            <view class="logout-icon i-carbon-logout" />
            <text>退出登录</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  height: 100vh;
  overflow: hidden;
  padding-bottom: 100rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.navbar-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.content-wrapper {
  padding: 32rpx;
}

/* 用户头像和基本信息 */
.user-header {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

  .avatar-container {
    margin-right: 32rpx;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid #f0f0f0;
    }
  }

  .user-basic-info {
    flex: 1;

    .username {
      display: block;
      color: #333;
      font-size: 40rpx;
      font-weight: 600;
      margin-bottom: 12rpx;
    }

    .user-id {
      color: #666;
      font-size: 28rpx;
    }
  }
}

/* 操作按钮区域 */
.action-section {
  margin: 32rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    border-radius: 16rpx;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.3);

    .logout-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 16rpx;
    }

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
    }
  }
}
</style>
