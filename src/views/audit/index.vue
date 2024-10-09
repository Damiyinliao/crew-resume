<template>
  <div class="audit-page">
    <div class="audit-page__header">
      <span class="header-text">
        {{ store.basicInfo.chineseName }} 欢迎您的加入！
      </span>
      <img class="header-img" :src="config.anzai.avatarUrl" />
    </div>
    <div class="audit-page__detail">
      <div
        class="detail-item"
        v-for="item in pageList"
        :key="item.title"
        @click="onNav(item.path)"
      >
        <div class="left">
          <div class="cn">
            <span>{{ item.title }}</span>
          </div>
          <div class="en">{{ item.enTitle }}</div>
        </div>
        <div class="right active:opacity-60">
          <RectRight width="1.5em" height="1.5em" />
        </div>
      </div>
    </div>
    <CrewFooter :color="btnColor" style="position: relative">
      <span :style="{ color: isAudit ? '#3e3e3e' : undefined }">
        {{ isAudit ? '待审核' : '审核完毕' }}
      </span>
    </CrewFooter>
  </div>
</template>
<script lang="ts" name="AuditPage" setup>
import wx from 'weixin-js-sdk-ts';
import config from '@/config/constants';
import { computed, ref } from 'vue';
import { RectRight } from '@nutui/icons-vue';
import { useRouter } from 'vue-router';
import { useResumeStore } from '@/store';

const router = useRouter();
const store = useResumeStore();

const isAudit = ref(true);
const btnColor = computed(() => {
  return isAudit.value ? '#B2B2B2' : ' #BFDBD1';
});
const pageList = [
  {
    title: '基 本 信 息',
    enTitle: 'PERSONAL INFORMATION',
    path: '/basic',
  },
  {
    title: '证    书',
    enTitle: 'CERTIFICATES',
    path: '/certificate',
  },
  {
    title: '服 务 资 历',
    enTitle: 'SERVICE RECORDS',
    path: '/record',
  },
  {
    title: '退    出',
    enTitle: 'EXIT',
    path: '/exit',
  },
];

function onNav(path: string) {
  // 退出并清除缓存
  if (path === '/exit') {
    localStorage.clear();
    wx.closeWindow();
  }
  router.push(path);
}
</script>
<style lang="scss">
.audit-page {
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(1, 119, 251, 0.87) 0%,
    rgba(19, 91, 70, 0.81) 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  &__header {
    padding-top: 150px;
    color: #fff;
    font-size: 44px;
    font-weight: 300;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 42px;
    .header-img {
      width: 277px;
      height: 225px;
    }
  }
  &__detail {
    flex: 1;
    padding: 140px 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 80px;
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      width: 100%;
      .left {
        display: flex;
        flex-direction: column;
        gap: 50px;
        .cn {
          font-size: 36px;
          font-weight: 900;
        }
        .en {
          font-size: 26px;
          font-weight: 300;
        }
      }
    }
  }
  .audit-btn {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 130px;
    text-align: center;
    .nut-button {
      width: 500px;
      height: 77px;
      border: none;
    }
    .btn-text {
      font-weight: 700;
      font-size: 21px;
    }
  }
}
</style>
