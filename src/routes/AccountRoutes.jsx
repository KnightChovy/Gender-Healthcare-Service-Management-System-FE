import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "../page/account/HomePage";
import { TestServicePage } from "../page/testservice/TestServicePage";
import Login from "../page/login/Login";
import Register from "../page/register/Register";

const LayoutAccount = React.lazy(() => {
  import("../components/Layouts/LayoutAccount/LayoutAccount");
});

export function AccountRoutes() {
  return (
    <>
      <Route
        path="/"
        element={
          <LayoutAccount>
            <HomePage />
          </LayoutAccount>
        }
      />
      <Route
        path="/service"
        element={
          <LayoutAccount>
            <TestServicePage />
          </LayoutAccount>
        }
      />
      <Route
        path="/login"
        element={
          <LayoutAccount>
            <Login />
          </LayoutAccount>
        }
      />
      <Route
        path="/register"
        element={
          <LayoutAccount>
            <Register />
          </LayoutAccount>
        }
      />
    </>
  );
}
