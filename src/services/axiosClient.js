import axios from "axios";
import { store } from "../store/store";
import { doLogin, logout } from "../store/feature/auth/authenSlice";
const BASE_URL = "http://52.4.72.106:3000";
const rawAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
// gắn accessToken vào mọi request
axiosClient.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  if (accessToken) {
    config.headers = {
      ...config.headers,
      "x-access-token": accessToken,
    };
  }
  //nếu có config.pathParams thì thay thế URL
  if (config.pathParams) {
    Object.entries(config.pathParams).forEach(([key, value]) => {
      config.url = config.url.replace(`${key}`, value);
    });
  }
  return config;
});
// tự động refresh token khi lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/v1/auth/refresh-token") &&
      !originalRequest.url.includes("/v1/auth/login")
    ) {
      originalRequest._retry = true;
      try {
        // Dùng raw axios không có interceptor để gọi refresh
        const res = await rawAxios.post("/v1/auth/refresh-token");
        const { accessToken, user } = res.data;

        store.dispatch(doLogin({ user, access_token: accessToken }));
        originalRequest.headers = {
          ...originalRequest.headers,
          "x-access-token": accessToken,
        };
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi refresh token bằng tiếng Việt
        if (originalRequest.url.includes("/v1/auth/login")) {
          error.response.data = {
            ...error.response.data,
            message: "Tên đăng nhập hoặc mật khẩu không đúng",
          };
        } else {
          error.response.data = {
            ...error.response.data,
            message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          };
        }
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }

    // Xử lý các lỗi khác với thông báo tiếng Việt
    if (error.response?.status === 401) {
      if (originalRequest.url.includes("/v1/auth/login")) {
        error.response.data = {
          ...error.response.data,
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
        };
      }
    }

    return Promise.reject(error);
  }
);
export default axiosClient;
