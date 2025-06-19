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
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // Dùng raw axios không có interceptor để gọi refresh
        const res = await rawAxios.post("/refresh");
        const { accessToken, user } = res.data;

        store.dispatch(doLogin({ user, access_token: accessToken }));
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return axiosClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
  }
);
export default axiosClient;
