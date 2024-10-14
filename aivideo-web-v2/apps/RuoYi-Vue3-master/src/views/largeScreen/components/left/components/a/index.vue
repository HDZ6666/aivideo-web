<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-11 14:16:45
 * @LastEditors: lhl
 * @LastEditTime: 2023-12-04 14:22:13
-->
<template>
    <div class="park">
        <div class="park_msg">
            <div class="parking-header">
                
            </div>
        </div>
        <div class="parkinglot">
            
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import moduleBox from '@/components/moduleBox/index.vue';
import { zModal } from '@/components/elComponents/index';
import modal from './modal.vue';
const visible = ref(false);
const handleMore = () => {
    visible.value = true;
};
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.areaActivity {
    height: 318vh * $h;
    padding: 21vh * $h;
    .item {
        padding: 0 34px;
    }
}
.park{

    //background-image: url('@/assets/images/largeSceen/home/background.png');
}

.park_msg{
    width: 100%;
    background-image: url('@/assets/images/largeSceen/home/background.png');
}

.parkinglot{
    background-image: url('@/assets/images/largeSceen/home/background.png');
    
}
</style>
