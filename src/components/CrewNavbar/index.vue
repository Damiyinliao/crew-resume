<template>
  <view class="crew-nav">
    <view class="arrow-left-wrapper" @click="onBack">
      <van-icon name="arrow-left" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
defineOptions({ name: 'CrewNav' });

const router = useRouter();
/** 返回 */
function onBack() {
  router.back();
}
</script>

<style lang="scss">
.crew-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 20px 30px;
  z-index: 9999;
  .arrow-left-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.7);
  }
}
</style>
