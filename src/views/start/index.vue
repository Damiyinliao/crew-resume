<template>
  <div class="start-page" @touchmove.prevent>
    <div class="start-container">
      <div class="encouraging">
        <div class="line-one span-left">
          <span class="bold">人</span>之所以能
        </div>
        <div class="line-two">是相信<span class="bold">能</span></div>
      </div>
      <div class="anzai-image">
        <svg-icon class="anzai-body" name="anzai-body"></svg-icon>
      </div>
    </div>
    <CrewFooter @click="handleStart">开始</CrewFooter>
  </div>
</template>
<script lang="ts" name="StartPage" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store";

const router = useRouter();
const userStore = useUserStore();

/**  */
function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  return {
    token,
    refreshToken,
  };
}
/** 开始 */
function handleStart() {
  router.push("/basic");
}

onMounted(() => {
  const { token, refreshToken } = getQueryParams();
  userStore.setToken(token);
  userStore.setRefreshToken(refreshToken);
});
</script>
<style lang="scss" scoped>
.start-page {
  min-height: 100vh;
  background: linear-gradient(
    rgba(1, 119, 251, 0.87) 0%,
    rgba(19, 91, 70, 0.81) 100%
  );
  position: relative;
}
.encouraging {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 50px;
  letter-spacing: 30px;
  width: 60%;
  .line-two {
    text-align: right;
    margin-top: 30px;
  }
  .bold {
    font-size: 55px;
    font-weight: bold;
  }
}
.anzai-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 679px;
  .anzai-body {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
