import { defineStore } from 'pinia';
import { pinia } from '@/store';
import { ResumeApi, CertApi } from '@/api/modules';

interface ResumeState {
  basicInfo: ResumeApi.ResumeBasicInfo;
  certificates: CertApi.CertificateVO[]
}

export const useResumeStore = defineStore({
  id: 'resume',
  state: (): ResumeState => {
    return {
      basicInfo: {
        chineseName: '',
        mobilePhone: ''
      },
      certificates: []
    }
  },
  getters: {
    getBasicInfo() {
      return this.basicInfo;
    },
    getCertificates() {
      return this.certificates;
    },
    getServiceRecords() {
      return this.serviceRecords;
    }
  },
  actions: {
    setAppState(...args: any) {
      this.$patch({ [args[0]]: args[1] });
    },
    setBasicInfo(basicInfo: ResumeState['basicInfo']) {
      this.$patch({ basicInfo });
    },
    setCertificates(certificates: ResumeState['certificates']) {
      this.$patch({ certificates });
    },
    setServiceRecords(serviceRecords: any) {
      this.$patch({ serviceRecords });
    }
  },
  persist: {
    key: 'resume',
    storage: localStorage
  }
});

export function useResumeStoreHook() {
  return useResumeStore(pinia);
}
