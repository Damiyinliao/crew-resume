<template>
  <div class="loading-mask" v-if="visible">
    <div class="loading-mask__inner">
      <div class="ball ball1"></div>
      <div class="ball ball2"></div>
      <div class="ball ball3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
/* 动画的关键帧 */
@keyframes move {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.loading-mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  &__inner {
    display: flex;
    justify-content: space-around;
    width: 120px; /* 调整小球排列的宽度 */
  }
  .ball {
    width: 25px;
    height: 25px;
    background: #bfdbd1;
    border-radius: 100%;
    display: inline-block;
    animation: move 1.4s infinite ease-in-out both;
  }
  .ball1 {
    animation-delay: 0.16s;
  }

  .ball2 {
    animation-delay: 0.32s;
  }

  .ball3 {
    animation-delay: 0.48s;
  }
}
</style>
