<template>
  <div class="basic-page">
    <div class="head-title">
      <div class="head-cn-title">船员简历表</div>
      <div class="head-en-title">
        <text>{{ "SEAFERERS' CURRICULUM VITAE FORM" }}</text>
      </div>
    </div>
    <div class="basic-container">
      <div class="basic-content">
        <div class="shallow-bg">
          <div class="ellipse flex-column-center">
            <div class="line-one">基本信息</div>
            <div class="line-two">PERSONAL INFORMATION</div>
          </div>
          <div class="upload-wrapper flex-center">
            <Avatar v-model="basicInfo.avatar" @success="handleUpdate" />
          </div>
          <div class="input-container">
            <CrewInput
              v-for="item in basicResumeList"
              :key="item.key"
              :cn-title="item.title"
              :en-title="item.enTitle"
              :model-value="basicInfo[item.key]"
              :type="item.type"
              :dict-type="item.dictType"
              @update:model-value="updateBasicInfoValue(item.key, $event)"
            />
          </div>
          <div class="operate-btns">
            <nut-button :color="btnColor" @click="handleSave">
              <span>{{ basicInfo.marinerId ? "更新" : "保存" }}</span>
            </nut-button>
            <nut-button :color="btnColor" @click="handleNext">
              <span>下一步</span>
            </nut-button>
          </div>
        </div>
      </div>
    </div>
    <Loading :visible="loading" />
  </div>
</template>
<script lang="ts" name="BasicPage" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules";
import { ResumeApi } from "@/api/modules";
import { MaritimeDictionaryType } from "@/config/enums/resumeEnum";
import * as Vant from "vant";
import Avatar from "@/components/Avatar/index.vue";
import Loading from "@/components/Loading/index.vue";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const btnColor = "rgba(19, 91, 70, 0.81)";
const basicResumeList = [
  {
    key: "expectedPosition",
    title: "职 务",
    enTitle: "Position",
    type: "select",
    dictType: MaritimeDictionaryType.MaritimePosition,
  },
  { key: "chineseName", title: "姓 名", enTitle: "Name" },
  { key: "englishName", title: "英文名", enTitle: "EN Name" },
  { key: "mobilePhone", title: "手 机", enTitle: "Cell Phone" },
  { key: "idCardNumber", title: "身份证号", enTitle: "ID Card No." },
  {
    key: "birthday",
    title: "出生日期",
    enTitle: "Date of Birth",
    type: "date",
  },
  { key: "birthplace", title: "出生地", enTitle: "BirthPlace" },
  { key: "qq", title: "QQ/MSN", enTitle: "QQ" },
  { key: "email", title: "邮箱", enTitle: "E-mail", type: "mail" },
  { key: "height", title: "身高", enTitle: "Height" },
  { key: "weight", title: "体重", enTitle: "Weight" },
  // { key: 'shoeSize', title: '鞋码', enTitle: 'Shoe Size' },
  {
    key: "maritalStatus",
    title: "婚否",
    enTitle: "Married",
    type: "select",
    dictType: "yesorno",
  },
  { key: "familyName", title: "家属姓名", enTitle: "Family Name" },
  { key: "familyRelationship", title: "关系", enTitle: "Family Relation" },
  { key: "familyMobile", title: "家属电话", enTitle: "Family Mobile" },
  { key: "graduationSchool", title: "毕业院校", enTitle: "College" },
  { key: "schoolYear", title: "学年", enTitle: "Academic Year" },
  { key: "major", title: "专业", enTitle: "Major" },
  { key: "contactAddress", title: "通讯地址", enTitle: "Address" },
];
const basicInfo = ref<ResumeApi.ResumeBasicInfo>({
  chineseName: "",
  marinerId: 0,
  mobilePhone: "",
});
/** 更新基本信息单个key-value */
function updateBasicInfoValue(key: string, value: any) {
  if (basicInfo.value) {
    basicInfo.value[key] = value;
  }
}
/** 获取基本信息 */
async function getResumeBasic() {
  try {
    loading.value = true;
    const res = await ResumeApi.getCrewResume();
    loading.value = false;
    if (!res.data) return;
    basicInfo.value = res.data;
    const { marinerId, chineseName } = res.data;
    userStore.setUserState("marinerId", marinerId);
    userStore.setUserState("userName", chineseName);
  } catch (error) {
    loading.value = false;
    console.warn("获取船员基本信息失败", error);
  }
}
/** 下一步 */
function handleNext() {
  basicInfo.value.marinerId
    ? router.push("/certificate")
    : Vant.showToast({
        message: "请先填写基本信息并保存！",
        icon: "fail",
        duration: 2000,
      });
}
/** 保存 */
function handleSave() {
  if (basicInfo.value.marinerId) {
    handleUpdate();
  } else {
    handleCreate();
  }
}

/** 保存基本信息并上传 */
async function handleCreate() {
  try {
    const res = await ResumeApi.createBasic({ ...basicInfo.value });
    res.data &&
      Vant.showToast({
        message: "保存成功",
        icon: "success",
        duration: 2000,
      });
    getResumeBasic();
  } catch (error) {
    console.error(error);
  }
}

/** update basicinfo */
async function handleUpdate() {
  try {
    const res = await ResumeApi.updateBasic({ ...basicInfo.value });
    res.data &&
      Vant.showToast({
        message: "更新成功",
        icon: "success",
        duration: 2000,
      });
  } catch (error) {
    console.warn("更新基本信息失败", error);
  }
}

onMounted(() => {
  getResumeBasic();
});
</script>
<style lang="scss" scoped>
.basic-page {
  position: relative;
  background: rgba(36, 130, 220);
  padding-top: 100px;
  --nut-button-default-font-size: 28px;
  --van-picker-confirm-action-color: #212121;
  .head-title {
    text-align: center;
    color: #fff;
    background: rgba(36, 130, 220);
    padding-bottom: 10px;
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
      margin-top: 10px;
    }
  }
  .basic-container {
    padding-top: 190px;
    position: relative;
  }
  .basic-content {
    width: 100%;
    position: relative;
    background-color: #fff;
    .shallow-bg {
      width: 100%;
      height: auto;
      background: rgba(39, 129, 208, 0.66);
      position: relative;
      padding-top: 430px;
      .ellipse {
        position: absolute;
        left: 0;
        right: 0;
        top: -190px;
        height: 380px;
        background: rgba(104, 163, 215, 1);
        border-radius: 50%;
        .line-one {
          font-weight: bold;
          color: #222;
          font-size: 44px;
        }
        .line-two {
          color: #434545;
          font-size: 26px;
          font-weight: normal;
          margin-top: 10px;
        }
      }
      .upload-wrapper {
        margin-top: 80px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .input-container {
        display: flex;
        flex-direction: column;
        gap: 47px;
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
      box-shadow: 0 7px 44px 0px rgba(0, 0, 0, 0.25);
      border: none;
      border-radius: 55px;
    }
  }
}
</style>
