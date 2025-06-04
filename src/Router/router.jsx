import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../page/login";
import Register from "../page/register";
import ForgetPassword from "../page/ForgetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  }
]);

export default router;
