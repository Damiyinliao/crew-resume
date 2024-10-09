import Axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from "axios";
import { ContentTypeEnum, ResultEnum } from "@/config/enums/requestEnum";
import { showFailToast } from "vant";
import { useUserStore } from "@/store";
import { attemptTokenRefresh } from "./tokenHelper";
import NProgress from "@/utils/progress";
import "vant/es/toast/style";

const userStore = useUserStore()

// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    'tenant-id': '1',
    "Content-Type": ContentTypeEnum.JSON
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start();
        config.headers['Authorization'] = 'Bearer ' + userStore.getUserToken;
        return config;
      },
      (error: AxiosError) => {
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        NProgress.done();
        // 与后端协定的返回字段
        const { code } = response.data;
        // token失效 401 进行刷新token
        if (code === ResultEnum.UNAUTH) { // 假设ResultEnum.UNAUTH 是 401 未授权
          try {
            // 尝试刷新 token
            const newToken = await attemptTokenRefresh();

            // 更新请求头中的 Authorization
            response.config.headers['Authorization'] = 'Bearer ' + newToken;

            // 重新发起原始请求并返回新的响应
            return Http.axiosInstance.request(response.config);
          } catch (refreshError) {
            // 刷新 token 失败，跳转登录或其他处理
            showFailToast('登录已过期，请重新登录');
            userStore.logout();
            return Promise.reject(refreshError);
          }
        }

        // 判断请求是否成功
        const isSuccess =
          Reflect.has(response.data, "code") &&
          code === ResultEnum.SUCCESS;
        if (isSuccess) {
          return response.data;
        } else {
          // 处理请求错误
          showFailToast(response.data.msg);
          return Promise.reject(response.data);
        }
      },
      (error: AxiosError) => {
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "请求错误";
            break;
          case 401:
            message = "未授权，请登录";
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "请求超时";
            break;
          case 500:
            message = "服务器内部错误";
            break;
          case 501:
            message = "服务未实现";
            break;
          case 502:
            message = "网关错误";
            break;
          case 503:
            message = "服务不可用";
            break;
          case 504:
            message = "网关超时";
            break;
          case 505:
            message = "HTTP版本不受支持";
            break;
          default:
            message = "网络连接故障";
        }

        showFailToast(message);
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  get<T = any>(url: string, params?: any): Promise<HttpResponse<T>> {
    return this.request({
      method: "GET",
      url,
      params
    });
  }

  post<T>(url: string, data?: any): Promise<HttpResponse<T>> {
    return this.request({
      method: "POST",
      url,
      data
    });
  }

  delete<T = any>(url: string, params?: any): Promise<HttpResponse<T>> {
    return this.request({
      method: "DELETE",
      url,
      params
    });
  }

  put<T>(url: string, data?: any): Promise<HttpResponse<T>> {
    return this.request({
      method: "PUT",
      url,
      data
    });
  }

  upload<T>(file: File): Promise<HttpResponse<T>> {
    return this.request({
      method: "POST",
      url: "/app-api/infra/file/upload",
      headers: {
        "Content-Type": ContentTypeEnum.FORM_DATA
      },
      data: file
    });
  }
}

export const http = new Http(configDefault);
