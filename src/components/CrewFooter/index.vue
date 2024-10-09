<template>
  <div class="crew-footer">
    <nut-button
      class="crew-footer__btn"
      :color="props.color"
      shape="round"
      block
    >
      <text class="bottom-text">
        <slot></slot>
      </text>
    </nut-button>
    <div class="company">浙江蔚海海洋科技有限公司</div>
  </div>
</template>
<script lang="ts" name="CrewFooter" setup>
interface Props {
  color?: string;
  position?: 'fixed' | 'position' | 'relative';
}

const props = withDefaults(defineProps<Props>(), {
  color: '#bfdbd1',
  position: 'fixed',
});
</script>
<style lang="scss" scoped>
.crew-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 135px;
  padding-bottom: 22px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 60px;
  &__btn {
    height: 75px;
    border-radius: 53px;
  }
  .bottom-text {
    color: rgba(19, 91, 70, 0.81);
    font-weight: bold;
    font-size: 21px;
  }
  .company {
    font-size: 18px;
    color: #f4f4f4;
    letter-spacing: 4px;
  }
}
</style>
