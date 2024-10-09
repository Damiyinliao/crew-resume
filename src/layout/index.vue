<script setup lang="ts" name="Layout">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import { useCachedViewStoreHook } from '@/store/modules/cachedView';
import CrewNav from '@/components/CrewNavbar/index.vue';

const route = useRoute();
const appWrapper = ref<HTMLDivElement>(null);
const { width: windowWidth, height: windowHeight } = useWindowSize();
const isStartPage = ref(false);

const backTopPosition = computed(() => {
  return {
    right: windowWidth.value - 30 - 40,
    bottom: 100,
  };
});

const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});

const themeVars = reactive({
  navBarBackground: 'transparent',
  backTopBackground: 'rgba(19, 91, 70, 0.81)',
});

watch(
  () => route.fullPath,
  (val) => {
    isStartPage.value = val === '/start';
  },
  { immediate: true }
);
</script>

<template>
  <div class="app-wrapper" ref="appWrapper">
    <van-config-provider
      id="van-config-provider"
      :theme-vars="themeVars"
      theme="light"
    >
      <!-- <Transition>
        <CrewNav v-if="showNav && !isStartPage"></CrewNav>
      </Transition> -->
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </van-config-provider>
    <van-back-top
      style="opacity: 0.7"
      :right="backTopPosition.right"
      :bottom="backTopPosition.bottom"
    />
  </div>
</template>

<style lang="less" scoped>
@import '@/styles/mixin.less';

.app-wrapper {
  .clearfix();
  position: relative;
  height: 100%;
  width: 100%;
  .van-config-provider {
    width: 100vw;
    height: 100vh;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
