import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../page/login";
import Register from "../page/register";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
