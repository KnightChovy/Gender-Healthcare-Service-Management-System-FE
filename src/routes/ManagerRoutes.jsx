import React from "react";
import { Route } from "react-router-dom";

const LayoutManager = React.lazy(() =>
  import("../components/Layouts/LayoutManager/LayoutManager")
);
const ManagerRoute = React.lazy(() => import("./ManagerRouter"));

function ManagerRoutes() {
  return (
    <Route
      path="/manager"
      element={
        <ManagerRoute>
          <LayoutManager></LayoutManager>
        </ManagerRoute>
      }
    ></Route>
  );
}

export default ManagerRoutes;
