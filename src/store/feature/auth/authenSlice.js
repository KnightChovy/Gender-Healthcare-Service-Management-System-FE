import { createSlice } from "@reduxjs/toolkit";
const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem("user");
    // Kiểm tra cả trường hợp chuỗi "undefined"
    if (!userString || userString === "undefined") return null;
    return JSON.parse(userString);
  } catch (error) {
    console.error("Lỗi khi parse dữ liệu user từ localStorage:", error);
    localStorage.removeItem("user"); // Xóa dữ liệu không hợp lệ
    return null;
  }
};
const initialState = {
  user: getUserFromStorage(),
  accessToken: localStorage.getItem("accessToken") || null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    doLogin: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", access_token);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});
export const { doLogin, logout } = authSlice.actions;
export default authSlice.reducer;
