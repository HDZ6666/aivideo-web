<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-21 11:32:25
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-14 14:48:40
-->
<template>
    <section class="app-main">
        <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="tagsViewStore.cachedViews">
                    <div :key="route.path">
                        <component
                        v-if="!route.meta.link"
                        :is="Component"
                        :key="route.path"
                    />
                    </div>
                </keep-alive>
            </transition>
        </router-view>
        <iframe-toggle />
    </section>
</template>

<script setup>
import iframeToggle from './IframeToggle/index';
import useTagsViewStore from '@/store/modules/tagsView';

const tagsViewStore = useTagsViewStore();
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #f0f2f5;
    padding: 16px 16px 16px 16px;
    padding-top: 0;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 6px;
    }
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 3px;
}
</style>
