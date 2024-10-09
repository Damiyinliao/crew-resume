import { http } from "@/api/service";

interface TokenRes {
  accessToken: string;
  refreshToken: string;
}

/** 刷新token */
export function refreshToken(refresh_token: string) {
  return http.post<TokenRes>(`/app-api/member/auth/refresh-token?refreshToken=${refresh_token}`)
}
