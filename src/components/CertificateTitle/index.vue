<template>
  <div class="cert-title">
    <div class="line-one">{{ title }}</div>
    <div class="line-two mt-1">{{ enTitle }}</div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'CertificateTitle' });
defineProps({
  title: {
    type: String,
    required: true,
  },
  enTitle: {
    type: String,
    required: true,
  },
});
</script>
<style lang="scss">
.cert-title {
  width: 100%;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.64);
  font-size: 29px;
  .line-one,
  .line-two {
    text-align: center;
  }
}
</style>
