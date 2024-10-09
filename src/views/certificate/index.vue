<template>
  <div class="certificate-page">
    <div class="current-page">
      <ResumeWrapper
        title="证书"
        enTitle="CERTIFICATES"
        :left-btn-name="leftBtnName"
        @next="onNext"
        @save="handleSave"
      >
        <template #input-container>
          <div class="certificate-box">
            <van-collapse v-model="activeNames">
              <van-collapse-item
                v-for="(item, index) in dataList"
                :key="item.type"
                :title="item.name"
                :name="item.id"
                style="margin-bottom: 15px"
              >
                <template #title>
                  <div class="flex items-center font-500 font-size-28px">
                    {{ item.name }}
                    <i-icon
                      icon="fluent:delete-12-regular"
                      class="ml-2 active:opacity-60"
                      style="width: 1.2em; height: 1.2em"
                      @click.stop="onDelCert(item)"
                    />
                  </div>
                </template>
                <div class="cert-desc flex flex-col gap-2">
                  <crew-input
                    v-model="item.number"
                    cn-title="证书编号"
                    en-title=""
                    title-color="#3d3d3d"
                  ></crew-input>
                  <crew-input
                    v-model="item.issueDate"
                    type="date"
                    cn-title="签发日期"
                    en-title=""
                    title-color="#3d3d3d"
                  ></crew-input>
                  <crew-input
                    v-model="item.issuePlace"
                    cn-title="签发地点"
                    en-title=""
                    title-color="#3d3d3d"
                  ></crew-input>
                  <crew-input
                    v-model="item.expireDate"
                    type="date"
                    cn-title="到期日期"
                    en-title=""
                    title-color="#3d3d3d"
                  ></crew-input>
                  <crew-input
                    type="custom"
                    cn-title="附件"
                    en-title=""
                    title-color="#3d3d3d"
                  >
                    <template #custom>
                      <div
                        class="plus-box"
                        :class="{
                          layout1: item.fileUrl.length === 0,
                          layout2: item.fileUrl.length > 0,
                        }"
                      >
                        <Attachment
                          v-model="item.fileUrl"
                          :mariner-id="userStore.marinerId"
                          @update="saveCertificate(item)"
                        />
                      </div>
                    </template>
                  </crew-input>
                  <crew-input
                    cn-title="备注"
                    en-title=""
                    title-color="#3d3d3d"
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
                      @click="saveCertificate(item)"
                    >
                      {{ item.id ? '更新' : '保存' }}
                    </nut-button>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
            <div
              v-if="dataList.length === 0"
              class="plus-cert flex-center gap-2 p-8 active:opacity-60"
            >
              <div class="font-size-32px">
                <!-- 点击添加{{ dataList.length ? '其它' : '' }}证书 -->
                点击左侧
              </div>
              <i-icon icon="zondicons:add-outline"></i-icon>
              <div class="font-size-32px">按钮添加证书</div>
            </div>
          </div>
        </template>
      </ResumeWrapper>
    </div>
    <van-floating-bubble
      icon="plus"
      @click="handlePlusCert"
      :gap="5"
      :offset="{ x: appStore.window.width - 32 - 5, y: 400 }"
    >
      <van-icon name="plus" color="#000" />
    </van-floating-bubble>
    <van-popup v-model:show="showCertType" round position="bottom">
      <van-picker
        :columns="columns"
        @cancel="showCertType = false"
        @confirm="onPickerConfirm"
      />
    </van-popup>
    <Loading :visible="loading" />
  </div>
</template>

<script lang="ts" name="CertificatePage" setup>
import { computed, onMounted, ref } from 'vue';
import { useResumeStore, useAppStore, useUserStore } from '@/store/modules';
import { useRouter } from 'vue-router';
import { ResumeApi, CertApi } from '@/api/modules';
import * as Enums from '@/config/enums/resumeEnum';
import * as Vant from 'vant';

type CertificateType =
  (typeof Enums.Certificate)[keyof typeof Enums.Certificate];

const initialData: CertApi.CertificateVO = {
  name: '',
  number: '',
  type: 0,
  issueDate: 0,
  issuePlace: '',
  expireDate: 0,
  remark: '',
  fileUrl: [],
};
/** 证书列表 */
const columns = ref<{ text: string; value: CertificateType }[]>([]);
const loading = ref(false);
const resumeStore = useResumeStore();
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const showCertType = ref(false);
const activeNames = ref([]);
/** 填写的证书信息列表 */
const dataList = ref<CertApi.CertificateVO[]>([]);
/** 当前正在上传的证书附件的证书索引 */
const certindex = ref(0);
/** 当前操作暂时存储的证书信息 */
let currentCertOperating: Partial<CertApi.CertificateVO> = {};

/** 检测是否有新的证书添加 0 全部是新加的 1 全部是需要更新的 2 一半新一半旧  */
const hasNewFlag = computed(() => {
  let count = 0;
  dataList.value.forEach((item) => {
    if (item.id) {
      count++;
    }
  });
  if (count === 0) {
    return 0;
  } else if (count === dataList.value.length) {
    return 1;
  } else {
    return 2;
  }
});

const leftBtnName = computed(() => {
  return hasNewFlag.value === 0 ? '全部保存' : '全部更新';
});
/** 删除附件 */
function handleDelFile(
  data: CertApi.CertificateVO,
  link: string,
  index: number
) {
  const dataItem = dataList.value.find((item) => item.id === data.id);
  certindex.value = index;
  if (dataItem) {
    dataItem.fileUrl = dataItem.fileUrl.filter((item) => item !== link);
    // 更新
    saveCertificate(dataList.value[certindex.value]);
  }
}

/** 选择证书 */
function onPickerConfirm(e: {
  selectedValues: CertificateType[];
  selectedOptions: { text: string; value: CertificateType }[];
  selectedIndexes: number[];
}) {
  const item = dataList.value.find((item) => item.type === e.selectedValues[0]);
  if (!item) {
    dataList.value.push({
      ...initialData,
      type: e.selectedOptions[0].value,
      name: e.selectedOptions[0].text,
    });
    activeNames.value = [e.selectedOptions[0].value];
  } else {
    Vant.showToast('该证书已存在');
  }
  showCertType.value = false;
}

/** 保存当前证书 */
async function saveCertificate(value: CertApi.CertificateVO) {
  const data = dataList.value.find((item) => item.type === value.type);
  if (!data) return;
  try {
    Vant.showLoadingToast('保存中...');
    const res = data.id
      ? await CertApi.updateCert(data)
      : await CertApi.createCert(data);
    res.data && getCertList();
    Vant.showToast({
      message: `${value.id ? '更新' : '保存'}成功`,
      icon: 'success',
      duration: 2000,
    });
  } catch (error) {
    console.warn('保存失败', error);
    Vant.showToast({
      message: `${value.id ? '更新' : '保存'}失败，请将信息填写完整`,
      duration: 2000,
    });
  }
}

/** 删除当前证书 */
function onDelCert(value: CertApi.CertificateVO) {
  Vant.showConfirmDialog({
    message: '确定删除该证书？',
  }).then(async () => {
    let list = dataList.value;
    dataList.value = list.filter((item) => item.type !== value.type);
    if (activeNames.value.some((item) => item === value.type)) {
      activeNames.value = activeNames.value.filter(
        (item) => item !== value.type
      );
    }
    if (!value.id) return;
    const res = await CertApi.delCert(value.id);
    res.code === 0 &&
      Vant.showToast({
        message: '删除成功',
        duration: 1500,
      });
  });
}
/** 添加证书 */
function handlePlusCert() {
  showCertType.value = true;
}

/** 全部更新 */
async function updateaAll() {
  const certificates = dataList.value;
  const data = {
    marinerId: certificates[0].marinerId,
    certificates,
  };
  try {
    const res = await CertApi.updateCertMultple(data);
    res.data && Vant.showToast('全部更新成功');
  } catch (error) {
    console.warn('全部更新失败', error);
  }
}

/** 保存 */
async function handleSave() {
  if (dataList.value.length === 0) {
    Vant.showToast('暂无证书可保存，请添加证书');
    return;
  }
  if (hasNewFlag.value === 0) {
    dataList.value.forEach(async (item) => {
      await CertApi.createCert(item);
    });
    Vant.showToast('全部保存成功');
  } else if (hasNewFlag.value === 1) {
    await updateaAll();
  } else if (hasNewFlag.value === 2) {
    Vant.showToast('请先保存未保存的证书');
  }
}
/** 下一步 */
function onNext() {
  if (dataList.value.length) {
    router.push('/record');
  } else {
    Vant.showToast('请添加证书');
  }
}

/** 上传附件 */
function uploadAttachment() {}

/** 获得证书信息列表 */
async function getCertList() {
  try {
    loading.value = true;
    const res = await CertApi.getCertPage({
      pageNo: 1,
      pageSize: 20,
    });
    loading.value = false;
    dataList.value = res.data.list.sort((a, b) => a.type - b.type);
    activeNames.value = [dataList.value[0].id];
  } catch (error) {
    console.warn('获得证书信息列表失败', error);
  }
}

/** 初始化获得证书类型列表 */
function initializeCertificateType() {
  const { certificateChineseMap } = Enums;
  // 获取第一个 key 和 value
  const [[firstKey, firstValue]] = certificateChineseMap.entries();
  dataList.value.push({
    ...initialData,
    type: firstKey,
    name: firstValue,
  });
  activeNames.value = [firstKey];
}

/** 提交证书 */

onMounted(() => {
  const certificates = resumeStore.getCertificates;
  if (certificates) {
    certificates.value = certificates;
  }
  columns.value = Array.from(Enums.certificateChineseMap, ([value, text]) => ({
    value,
    text,
  }));
  getCertList();
});

// initializeCertificateType();
</script>

<style lang="scss">
.certificate-page {
  background: #2482dc;
  --van-cell-background: transparent;
  --van-collapse-item-content-background: transparent;
  --van-cell-border-color: transparent;
  --van-border-color: transparent;
  --van-collapse-item-content-text-color: #3d3d3d;
  --van-cell-right-icon-color: #3d3d3d;
  --van-cell-text-color: #3d3d3d;
  --van-cell-active-color: transparent;
  --van-button-default-height: 60px;
  --nut-textarea-font: 28px;
  --van-picker-confirm-action-color: #212121;
  .certificate-box {
    padding: 32px;
    .van-collapse {
      .van-collapse-item {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 24px;
      }
    }
    .crew-input-title {
      width: 150px;
    }
    .nut-textarea {
      width: 400px;
      height: auto;
      border-radius: 18px;
      border: 2px solid #3a766a;
      padding: 20px 20px;
      &__textarea {
        line-height: 28px;
      }
    }
  }
  .plus-cert {
    color: #3d3d3d;
    .i-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }
  .plus-box {
    border: 2px solid #3a766a;
    border-radius: 18px;
    padding: 20px;
    &.layout1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.layout2 {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
}
.current-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .first-cert-title {
    margin-top: -90px;
  }
}

.save-cert-item {
  .nut-button {
    width: 200px;
    height: 60px;
    box-shadow: 0rpx 7rpx 44rpx 0rpx rgba(0, 0, 0, 0.25);
    border: none;
    font-size: 26px;
    border-radius: 55px;
  }
}
</style>
