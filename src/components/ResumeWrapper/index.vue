<template>
  <div class="resume-wrapper">
    <div class="head-title text-center">
      <div class="head-cn-title">船员简历表</div>
      <div class="head-en-title">
        <text>{{ "SEAFERERS' CURRICULUM VITAE FORM" }}</text>
      </div>
    </div>
    <div class="content">
      <div class="shallow-bg">
        <div class="ellipse">
          <div class="line-one">{{ title }}</div>
          <div class="line-two">{{ enTitle }}</div>
        </div>
        <div class="input-container">
          <slot name="input-container"></slot>
        </div>
        <div v-if="$slots.extra" class="flex-center">
          <slot name="extra"></slot>
        </div>
        <slot name="footer" v-if="$slots.footer"></slot>
        <div class="operate-btns" v-if="!$slots.footer">
          <nut-button color="rgba(19, 91, 70, 0.81)" @click="handleSave">
            {{ props.leftBtnName }}
          </nut-button>
          <nut-button color="rgba(19, 91, 70, 0.81)" @click="handleNavigate">
            {{ props.rightBtnName }}
          </nut-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ResumeWrapper' });
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  enTitle: {
    type: String,
    required: true,
  },
  leftBtnName: {
    type: String,
    default: '保存',
  },
  rightBtnName: {
    type: String,
    default: '下一步',
  },
});
const emit = defineEmits(['next', 'save']);

const handleNavigate = () => {
  emit('next');
};

const handleSave = () => {
  emit('save');
};
</script>
<style lang="scss">
.resume-wrapper {
  position: relative;
  background: rgba(36, 130, 220);
  color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  .head-title {
    padding: 100px 0 200px 0;
    .head-cn-title {
      font-size: 44px;
      font-weight: bold;
      letter-spacing: 20px;
    }
    .head-en-title {
      font-size: 18px;
      font-weight: 400;
      color: #f4f4f4;
      letter-spacing: 2px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
  .content {
    background: #fff;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    .shallow-bg {
      height: auto;
      background: rgba(39, 129, 208, 0.66);
      position: relative;
      padding-top: 190px;
      flex: 1;
      .ellipse {
        width: 100%;
        position: absolute;
        top: -190px;
        left: 0;
        height: 380px;
        background: rgba(104, 163, 215, 1);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .line-one {
          font-weight: bold;
          color: #222;
          font-size: 44px;
        }
        .line-two {
          color: #434545;
          font-size: 26px;
          font-weight: normal;
          margin-top: 15px;
        }
      }
      .input-container {
        display: flex;
        flex-direction: column;
        gap: 47px;
        position: relative;
      }
    }
  }
  .operate-btns {
    padding: 160px 58px 82px 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 68px;
    .nut-button {
      width: 261px;
      height: 77px;
      box-shadow: 0rpx 7rpx 44rpx 0rpx rgba(0, 0, 0, 0.25);
      border: none;
      font-size: 28px;
      border-radius: 55px;
    }
  }
}
</style>
