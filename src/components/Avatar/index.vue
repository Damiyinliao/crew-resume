<template>
  <div class="avatar-comp">
    <div class="avatar-wrapper" v-if="avatar">
      <img :src="avatar" class="w-full" @error="handleImgError" @click="onAvatarTap"></img>
    </div>
    <div class="avatar-wrapper" v-else @click="triggerFileInput">
      <svg-icon class="avatar-icon" name="avatar"></svg-icon>
      <text class="mt-4">请上传照片</text>
    </div>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    >
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      description="请选择相应的操作"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<script setup name="Avatar" lang="ts">
import { ref, computed } from 'vue';
import * as Vant from 'vant';
import { ResumeApi } from "@/api/modules";

interface Props {
  modelValue?: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'success', 'del']);

const avatar = computed({
  get() {
    return props.modelValue || ''
  },
  set(val: string) {
    emit('update:modelValue', val)
  }
})

// watch(() => props.modelValue, (val) => {
//   console.log(val)
// }, {
//   immediate: true
// })

const actions = [
  { name: '查看大图', type: 'preview' },
  { name: '更换', type: 'change' },
  // { name: '删除', type: 'delete' },
];
const show = ref(false);
/** input ref */
const fileInput = ref<HTMLInputElement | null>(null);

function handleImgError(e) {
console.log("🚀 ~ handleImgError ~ e:", e)

}

function onAvatarTap() {
  show.value = true;
}

function triggerFileInput() {
  fileInput.value?.click();
}
/** 上传图片 */
async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      Vant.showLoadingToast({
        message: '上传中...',
        forbidClick: true,
      });
      const formData = new FormData();
      formData.append('file', file);
      const res = await ResumeApi.uploadFile(formData);
      avatar.value = res.data;
      emit('success');
      Vant.showToast({
        message: '上传成功',
        icon: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      Vant.showToast({
        message: '上传失败，请重试',
        icon: 'fail',
        duration: 2000
      });
    } finally {
      Vant.closeToast();
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  }
}


/** 选择 */
function onSelect(e: (typeof actions)[0]) {
  if (e.type === 'preview') {
    Vant.showImagePreview([props.modelValue]);
  } else if (e.type === 'change') {
    triggerFileInput();
  }
}

</script>

<style lang="scss">
.avatar-wrapper {
  width: 224px;
  height: 263px;
  background: #fff;
  border-radius: 18px;
  opacity: 1;
  border: 2px solid #3a766a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  .avatar-icon {
    width: 90px;
    height: 90px;
  }
}
</style>
