import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authenSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
