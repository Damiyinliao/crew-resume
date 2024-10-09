import wx from "weixin-js-sdk-ts";
import { useUserStore } from "@/store";
import * as UserApi from "@/api/modules/user";

const userStore = useUserStore();

/** 刷新token */
export const attemptTokenRefresh = async () => {
  const refresh_token = userStore.getRefreshToken;
  const res = await UserApi.refreshToken(refresh_token);
  const { accessToken, refreshToken } = res.data;
  userStore.setToken(accessToken);
  userStore.setRefreshToken(refreshToken);
  wx.miniProgram.postMessage({
    data: {
      accessToken,
      refreshToken
    }
  })
  return accessToken;
};