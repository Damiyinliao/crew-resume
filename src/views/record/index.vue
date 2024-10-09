<template>
  <div class="service-page">
    <div class="service-page__inner">
      <ResumeWrapper
        title="服务资历"
        enTitle="SERVICE RECORDS"
        rightBtnName="提交审核"
        :left-btn-name="leftBtnName"
        @next="handleAudit"
        @save="handleSave"
      >
        <template #input-container>
          <div class="record-box">
            <van-collapse v-model="activeNames">
              <van-collapse-item
                v-for="(item, index) in recordList"
                :key="index"
                :name="index"
                style="margin-bottom: 15px"
              >
                <template #title>
                  <div class="flex items-center font-500 font-size-28px">
                    <span>{{ `资历${index + 1}` }}</span>
                    <i-icon
                      v-if="item.id"
                      icon="fluent:delete-12-regular"
                      class="ml-2 active:opacity-60"
                      style="width: 1.2em; height: 1.2em"
                      @click.stop="onDelRecord(item)"
                    />
                  </div>
                </template>
                <div class="exp-list">
                  <!-- <crew-input
                    v-model="item.marinerId"
                    cn-title="船员编号"
                    en-title=""
                    title-color="#000"
                  /> -->
                  <!-- <crew-input
                    v-model="item.contractId"
                    cn-title="合同编号"
                    en-title=""
                    title-color="#000"
                  /> -->
                  <!-- <crew-input
                    v-model="item.company"
                    cn-title="公司名称"
                    en-title=""
                    title-color="#000"
                  /> -->
                  <crew-input
                    v-model="item.shipName"
                    cn-title="船名"
                    en-title="Name of Vessel"
                    title-color="#000"
                  />
                  <crew-input
                    v-model="item.position"
                    cn-title="职务"
                    en-title="Rank"
                    title-color="#000"
                    type="select"
                    :dict-type="MaritimeDictionaryType.MaritimePosition"
                  />
                  <crew-input
                    v-model="item.shipType"
                    cn-title="船型"
                    en-title="Type of Vessel"
                    title-color="#000"
                  />
                  <!-- <crew-input
                    v-model="item.shipId"
                    cn-title="船旗"
                    en-title="Flag"
                    title-color="#000"
                  ></crew-input> -->
                  <crew-input
                    v-model="item.shipArea"
                    cn-title="航区"
                    en-title="Trade Area"
                    title-color="#000"
                  ></crew-input>
                  <crew-input
                    v-model="item.deadWeight"
                    cn-title="总吨/载重吨"
                    en-title="GRT/DWT"
                    title-color="#000"
                  ></crew-input>
                  <crew-input
                    v-model="item.outputPower"
                    cn-title="马力/功率"
                    en-title="BHP/KW"
                    title-color="#000"
                  ></crew-input>
                  <crew-input
                    v-model="item.startDate"
                    cn-title="上船"
                    en-title="Date of Sign-on"
                    title-color="#000"
                    type="date"
                  ></crew-input>
                  <crew-input
                    v-model="item.endDate"
                    cn-title="下船"
                    en-title="Date of Sign-off"
                    title-color="#000"
                    type="date"
                  ></crew-input>
                  <crew-input
                    cn-title="备注"
                    en-title="Remarks"
                    title-color="#000"
                    type="custom"
                  >
                    <template #custom>
                      <nut-textarea
                        v-model="item.remark"
                        :autosize="{ minHeight: 50 }"
                      />
                    </template>
                  </crew-input>
                  <div class="save-cert-item flex justify-center">
                    <nut-button
                      color="rgba(104, 163, 215, 1)"
                      @click="saveRecordInfo(item)"
                    >
                      {{ item.id ? '更新' : '保存' }}
                    </nut-button>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </template>
      </ResumeWrapper>
    </div>
    <van-floating-bubble
      icon="plus"
      @click="handlePlusExp"
      :gap="5"
      :offset="{ x: appStore.window.width - 32 - 5, y: 400 }"
    >
      <van-icon name="plus" color="#000" />
    </van-floating-bubble>
  </div>
</template>
<script lang="ts" name="ServiceRecord" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore, useResumeStore, useUserStore } from '@/store/modules';
import { ExpApi } from '@/api/modules';
import { MaritimeDictionaryType } from '@/config/enums/resumeEnum';
import * as Vant from 'vant';
import CrewInput from '@/components/CrewInput/index.vue';
import ResumeWrapper from '@/components/ResumeWrapper/index.vue';

const initialRecord: ExpApi.MarinerExperience = {
  endDate: 0,
  marinerId: void 0,
  position: '',
  shipName: '',
  startDate: 0,
  remark: '',
  shipCountry: '',
  shipArea: '',
  shipId: void 0,
  deadWeight: '',
  shipType: '',
  outputPower: '',
  company: '',
  contractId: void 0,
};

const router = useRouter();
// const resumeStore = useResumeStore();
const appStore = useAppStore();
const recordList = ref<ExpApi.MarinerExperience[]>([]);
const activeNames = ref([0]);
const userStore = useUserStore();
const loading = ref(false);
/** 检测是否有新的资历添加 0 全部是新加的 1 全部是需要更新的 2 一新一般旧  */
const hasNewFlag = computed(() => {
  let count = 0;
  recordList.value.forEach((item) => {
    if (item.id) {
      count++;
    }
  });
  if (count === 0) {
    return 0;
  } else if (count === recordList.value.length) {
    return 1;
  } else {
    return 2;
  }
});

const leftBtnName = computed(() => {
  return hasNewFlag.value === 0 ? '全部保存' : '全部更新';
});

/** 保存/更新资历信息 */
async function saveRecordInfo(value: ExpApi.MarinerExperience) {
  try {
    const res = value.id
      ? await ExpApi.updateExp(value)
      : await ExpApi.createExp({ ...value, marinerId: userStore.marinerId });
    res.data &&
      Vant.showToast({
        message: `${value.id ? '更新' : '保存'}成功`,
        duration: 2000,
      });
    getExpList();
  } catch (error) {
    console.warn(`${value.id ? '更新' : '保存'}失败`, error);
  }
}

/** 批量更新 */
async function updateMultiple() {
  const data = {
    marinerId: userStore.marinerId,
    experiences: recordList.value,
  };
  try {
    const res = await ExpApi.updateExpMultiple(data);
    res.data && Vant.showToast('全部更新成功');
  } catch (error) {
    console.warn('批量更新失败', error);
  }
}

/** 删除 */
async function onDelRecord(value: ExpApi.MarinerExperience) {
  Vant.showConfirmDialog({
    message: '删除将不可恢复，确定将此资历信息删除吗？',
  }).then(async () => {
    const res = await ExpApi.delExp(value.id);
    res.data &&
      Vant.showToast({
        message: '删除成功',
        duration: 2000,
        icon: 'success',
      });
  });
}
// 新增
function handlePlusExp() {
  const list = recordList.value;
  recordList.value = list.concat({ ...initialRecord });
}
/** 保存 */
async function handleSave() {
  if (recordList.value.length === 0) {
    Vant.showToast('暂无资历可保存，请添加资历');
    return;
  }
  if (hasNewFlag.value === 0) {
    recordList.value.forEach(async (item) => {
      await ExpApi.createExp(item);
    });
    Vant.showToast('全部保存成功');
  } else if (hasNewFlag.value === 1) {
    await updateMultiple();
  } else if (hasNewFlag.value === 2) {
    Vant.showToast('请先保存未保存的资历');
  }
}
/** 下一步 提交审核 */
const handleAudit = () => {
  router.push('/audit');
};

/** 获取资历列表 */
async function getExpList() {
  try {
    loading.value = true;
    const res = await ExpApi.getExpPage({
      pageNo: 1,
      pageSize: 20,
    });

    recordList.value = res.data.list;
    // 新增一个空的
    if (res.data.list.length === 0) {
      recordList.value.push({ ...initialRecord });
      activeNames.value = [0];
    }
  } catch (error) {
    console.warn('获取资历列表失败', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getExpList();
});
</script>
<style lang="scss">
.service-page {
  height: 100vh;
  background: rgba(39, 129, 208, 0.66);
  --van-cell-background: transparent;
  --van-collapse-item-content-background: transparent;
  --van-cell-border-color: transparent;
  --van-border-color: transparent;
  --van-collapse-item-content-text-color: #000;
  --van-cell-right-icon-color: #000;
  --van-cell-text-color: #000;
  --van-cell-active-color: transparent;
  --van-button-default-height: 60px;
  --nut-textarea-font: 28px;
  --van-picker-confirm-action-color: #212121;
  &__inner {
    .service-record-content {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }
  }
  .record-box {
    padding: 32px;
    .nut-textarea {
      height: auto;
      border-radius: 18px;
      border: 2px solid #3a766a;
      padding: 20px 20px;
      &__textarea {
        line-height: 28px;
      }
    }
    .van-collapse {
      .van-collapse-item {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 24px;
      }
    }
    .exp-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
  .save-cert-item {
    .nut-button {
      height: 60px;
      width: 180px;
      font-size: 28px;
      border-radius: 50px;
    }
  }
}
</style>
