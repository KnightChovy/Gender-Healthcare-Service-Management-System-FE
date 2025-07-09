import React from "react";
import { Route } from "react-router-dom";

const LayoutStaff = React.lazy(() =>
  import("../components/Layouts/LayoutStaff/LayoutStaff")
);
const StaffRoute = React.lazy(() => import("./StaffRouter"));

function StaffRoutes() {
  return (
    <Route
      path="/staff"
      element={
        <StaffRoute>
          <LayoutStaff></LayoutStaff>
        </StaffRoute>
      }
    ></Route>
  );
}

export default StaffRoutes;
