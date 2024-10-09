<template>
  <div class="attachment-comp">
    <div
      class="attachment-box"
      v-for="(item, index) in data"
      @click="showActionsPanel(item, index)"
    >
      <svg-icon name="file-check" class="file-check"></svg-icon>
      <div>{{ getFileName(item) }}</div>
    </div>
    <i-icon
      :class="{ 'ml-2': props.modelValue.length > 0 }"
      icon="streamline:add-1"
      @click="triggerFileInput"
    />
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    />
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

<script setup name="Attachment" lang="ts">
import { ref, computed } from 'vue';
import { ResumeApi } from '@/api/modules';
import * as Vant from 'vant';

interface Props {
  modelValue: string[];
  marinerId: number;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:modelValue', 'update']);

const data = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
const fileInput = ref<HTMLInputElement | null>(null);

const show = ref(false);
const fileIndex = ref(0);
const operatingFile = ref('');
const actions = [
  { name: '预览', type: 'preview' },
  { name: '删除', type: 'delete' },
];

function getFileName(url: string) {
  const a = url.split('/');
  return a[a.length - 1];
}

function showActionsPanel(fileUrl: string, idx: number) {
  show.value = true;
  operatingFile.value = fileUrl;
  fileIndex.value = idx;
}

/** 选择 */
function onSelect(e: (typeof actions)[0]) {
  if (e.type === 'preview') {
    Vant.showImagePreview({
      images: props.modelValue,
      startPosition: fileIndex.value,
    });
  } else if (e.type === 'delete') {
    emit(
      'update:modelValue',
      props.modelValue.filter((item) => item !== operatingFile.value)
    );
  }
}

/** 上传附件 */
function triggerFileInput() {
  fileInput.value?.click();
}

/** 上传图片 */
async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  console.log('🚀 ~ handleFileChange ~ file:', file);
  // 根据文件名取出文件的类型
  const ftarr = file.name.split('.');
  const fileType = ftarr[ftarr.length - 1];
  // 重新取名
  const fileName = `fujian${props.modelValue.length + 1}.${fileType}`;
  const path = `crew/${props.marinerId}/certificate/${fileName}`;
  if (file) {
    try {
      Vant.showLoadingToast({
        message: '上传中...',
        forbidClick: true,
      });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);
      const res = await ResumeApi.uploadFile(formData);
      emit('update:modelValue', [...props.modelValue, res.data]);
      Vant.showToast({
        message: '上传成功',
        icon: 'success',
        duration: 2000,
      });
      emit('update');
    } catch (error) {
      console.error('Avatar upload error:', error);
      Vant.showToast({
        message: '上传失败，请重试',
        icon: 'fail',
        duration: 2000,
      });
    } finally {
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-comp {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.attachment-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: 18px;
  gap: 10px;
  .file-check {
    height: 60px;
    width: 60px;
    color: gray;
  }
}
</style>
