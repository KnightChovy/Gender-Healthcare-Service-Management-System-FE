import React from "react";
import { Route } from "react-router-dom";
import { EmployeesManagerment } from "../page/admin/EmployeesManagerment/EmployeesManagerment";

const LayoutAdmin = React.lazy(() =>
  import("../components/Layouts/LayoutAdmin/LayoutAdmin")
);
const AdminRoute = React.lazy(() => import("./AdminRouter"));

export function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <LayoutAdmin></LayoutAdmin>
        </AdminRoute>
      }
    ></Route>
  );
}
