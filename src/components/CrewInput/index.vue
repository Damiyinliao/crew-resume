<template>
  <div class="crew-input-container" :style="rootStyle">
    <div class="crew-input-title">
      <div class="crew-input-cn-title">{{ cnTitle }}</div>
      <div class="crew-input-en-title">{{ enTitle }}</div>
    </div>
    <div class="crew-input-content">
      <nut-input v-if="inputType === 'input'" v-model="value" />
      <div
        v-else-if="inputType === 'date'"
        class="custom-cell"
        @click="onShowDatePopup"
      >
        {{
          props.modelValue ? dayjs(props.modelValue).format('YYYY-MM-DD') : ''
        }}
      </div>
      <div
        v-else-if="inputType === 'select'"
        class="custom-cell"
        @click="onSelect"
      >
        <span>{{ pickerValue }}</span>
        <i-icon class="down-icon" icon="formkit:down"></i-icon>
      </div>
      <div class="mail-input" v-else-if="inputType === 'mail'">
        <nut-input
          v-model="value"
          @focus="handleFocus"
          @blur="handleBlur"
        ></nut-input>
        <div class="suggestion-field" v-if="mailSuggestionVisible">
          <ul class="suggesstion-list">
            <li
              v-for="(item, index) in mailSuggestionData"
              :key="index"
              @click="mailSuggestionItemTap(item)"
            >
              <template v-if="$slots.default">
                <slot :row="item"></slot>
              </template>
              <template v-else>
                {{ item.value }}
              </template>
            </li>
          </ul>
        </div>
      </div>
      <slot v-else-if="inputType === 'custom'" name="custom"></slot>
    </div>

    <van-popup
      v-model:show="showBottom"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-date-picker
        v-if="props.type === 'date'"
        v-model="date"
        title="选择日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="closeDatePopup"
      />
      <van-picker
        v-else-if="props.type === 'select'"
        :columns="columns"
        @cancel="showBottom = false"
        @confirm="onPickerConfirm"
      />
    </van-popup>
  </div>
</template>
<script lang="ts" name="CrewInpput" setup>
import dayjs from 'dayjs';
import { computed, ref, onMounted, watch } from 'vue';
import { DictApi } from '@/api/modules';

interface Props {
  cnTitle: string;
  enTitle: string;
  modelValue?: string | number;
  type?: string;
  titleColor?: string;
  dictType?: string;
  showTip?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'input',
  titleColor: '#fff',
});

const inputType = computed(() => (props.type ? props.type : 'input'));

const emit = defineEmits(['update:modelValue']);
const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const minDate = new Date(1970, 1, 1);
const maxDate = new Date(2025, 1, 1);
const showBottom = ref(false);
const date = ref([]);
const columns = ref<{ text: string; value: string | number }[]>([]);
const pickerValue = ref('');
const rootStyle = computed(() => ({
  '--crew-title-color': props.titleColor,
}));
const dictList = ref<DictApi.DictType[]>([]);

const mailSuggestionVisible = ref(false);
const mailSuggestionData = ref<{ value: string; label: string }[]>([
  { value: '', label: '@qq.com' },
  { value: '', label: '@163.com' },
  { value: '', label: '@outlook.com' },
  { value: '', label: '@gmail.com' },
  { value: '', label: '@icloud.com' },
]);

const yesornoList = [
  { id: 0, label: '是', value: 0, dictType: 'yesorno' },
  { id: 0, label: '否', value: 1, dictType: 'yesorno' },
];

watch(
  () => props.modelValue,
  (val) => {
    if (inputType.value === 'select') {
      pickerValue.value = dictList.value.find(
        (item) => item.value === val
      )?.label;
    }
  }
);

watch(
  () => value,
  (val) => {
    if (inputType.value === 'mail') {
      let list = mailSuggestionData.value;
      mailSuggestionData.value = list.map((item) => {
        return {
          ...item,
          value: val + item.label,
        };
      });
    }
  }
);
/** 选择日期 */
function onDateConfirm(value: {
  selectedValues: string[];
  selectedOptions: { text: string; value: string }[];
  selectedIndexes: number[];
}) {
  emit('update:modelValue', dayjs(value.selectedValues.join('-')).valueOf());
  closeDatePopup();
}
/** 开启日期选择器 */
function onShowDatePopup() {
  showBottom.value = true;
}
/** 关闭底部弹窗 */
function closeDatePopup() {
  showBottom.value = false;
}
/** 选择 */
async function onSelect() {
  showBottom.value = true;
}
/** 获取字典 */
async function getDict() {
  if (!props.dictType) return;
  if (props.dictType === 'yesorno') {
    columns.value = yesornoList.map((item) => {
      return {
        text: item.label,
        value: item.value,
      };
    });
    dictList.value = yesornoList;
    return;
  }
  try {
    const res = await DictApi.getDictType(props.dictType);
    columns.value = res.data.map((item: DictApi.DictType) => {
      return {
        text: item.label,
        value: item.value,
      };
    });
    dictList.value = res.data;
    if (props.modelValue) {
      pickerValue.value = res.data.find(
        (item) => item.value === props.modelValue
      )?.label;
    }
  } catch (error) {
    console.warn('获取字典信息失败', error);
  }
}

function onPickerConfirm(e: {
  selectedValues: string[];
  selectedOptions: { text: string; value: string }[];
  selectedIndexes: number[];
}) {
  emit('update:modelValue', e.selectedOptions[0].value);
  pickerValue.value = e.selectedOptions[0].text;
  console.log('🚀 ~ pickerValue.value:', pickerValue.value);
  showBottom.value = false;
}

/** 邮箱 建议选择 */
function mailSuggestionItemTap(item: { value: string; label: string }) {
  emit('update:modelValue', item.value);
  mailSuggestionVisible.value = false;
}

/** 输入框聚焦时 */
function handleFocus() {
  if (inputType.value === 'mail') {
    mailSuggestionVisible.value = true;
  }
}
/** 输入框失焦时 */
function handleBlur() {
  mailSuggestionVisible.value = false;
}

onMounted(() => {
  if (props.type === 'select') {
    getDict();
  }
  // 获取今天的日期
  if (props.type === 'date') {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    date.value = props.modelValue
      ? dayjs(props.modelValue).format('YYYY-MM-DD').split('-')
      : [year, month, day];
  }
});
</script>
<style lang="scss">
.crew-input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .crew-input-title {
    width: 200px;
    font-size: 26px;
    font-weight: 500;
    color: var(--crew-title-color);
    .crew-input-cn-title {
      text-align: right;
      width: 100%;
    }
    .crew-input-en-title {
      text-align: right;
      width: 100%;
      white-space: nowrap;
      direction: rtl;
    }
  }
  .crew-input-content {
    width: 400px;
    margin-left: 60px;
    .custom-cell {
      padding: 0;
      height: 65px;
      line-height: 65px;
      border-radius: 18px;
      opacity: 1;
      border: 2px solid #3a766a;
      background: #fff;
      padding: 0 10px;
      position: relative;
      .down-icon {
        width: 1.2em;
        height: 1.2em;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .nut-input {
      padding: 0;
      height: 65px;
      line-height: 65px;
      border-radius: 18px;
      opacity: 1;
      border: 2px solid #3a766a;
      .nut-input-value {
        .nut-input-inner {
          height: 63px;
          line-height: 65px;
          .nut-input-box {
            padding-left: 20px;
            .input-text {
              font-size: 28px;
              color: #3d3d3d;
            }
          }
        }
      }
    }
  }
  .mail-input {
    position: relative;
    padding: 0;
    height: 65px;
    line-height: 65px;
    border-radius: 18px;
    opacity: 1;
    // border: 2px solid #3a766a;
    background: #fff;
    .suggestion-field {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      z-index: 1;
      background: #fff;
      ul {
        list-style: none;
        padding-inline-start: 0px;
      }
      .suggesstion-list {
        border-radius: 8px;
        box-shadow: 0 0 5px #999;
        padding: 10px 0 10px 10px;
        li {
          padding-bottom: 10px;
          text-align: left;
          + li {
            padding-top: 10px;
            border-top: 1px solid #f5f5f5;
          }
        }
      }
    }
  }
}
</style>
