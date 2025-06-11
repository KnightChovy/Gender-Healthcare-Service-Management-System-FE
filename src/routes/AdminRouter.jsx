import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return accessToken && isAdmin ? children : <Navigate to={"/"} />;
};
