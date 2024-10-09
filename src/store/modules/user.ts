import { defineStore } from 'pinia';
import { pinia } from '@/store';
import wx from 'weixin-js-sdk-ts';

interface UserState {
  avatar: string;
  marinerId: number;
  userName: string;
  token: string;
  refreshToken: string;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    avatar: "",
    marinerId: void 0,
    userName: "",
    token: "",
    refreshToken: ""
  }),
  getters: {
    getUserToken() {
      return this.token
    },
    getRefreshToken() {
      return this.refreshToken
    }
  },
  actions: {
    setUserState(...args: any) {
      this.$patch({ [args[0]]: args[1] });
    },
    setToken(token: string) {
      this.token = token;
    },
    setRefreshToken(refrsh_token: string) {
      this.refreshToken = refrsh_token;
    },
    logout() {
      this.$reset();
      localStorage.clear();
      wx.miniProgram.reLaunch({ url: "/pages/mine_old/index" });
    }
  },
  persist: {
    key: 'user',
    storage: localStorage
  }
})