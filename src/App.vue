<template>
  <router-view />
</template>

<script lang="ts" name="App" setup>
import { useAppStore } from '@/store';
import { useWindowSize } from '@vueuse/core';

const appStore = useAppStore();

const { width: windowWidth, height: windowHeight } = useWindowSize();

appStore.setWindow({
  height: windowHeight,
  width: windowWidth,
});
</script>

<style></style>
