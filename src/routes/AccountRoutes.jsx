import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "../page/account/HomePage";
import { ServicePage } from "../page/testservice/TestServicePage";
import Login from "../page/login";
import Register from "../page/Register";
import Appointment from "../page/Appointment";
import PaymentAppointment from "../page/Payment/PaymentAppointment";

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
            <ServicePage />
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
      <Route
        path="/appointment"
        element={
          <LayoutAccount>
            <Appointment />
          </LayoutAccount>
        }
      />
      <Route
        path="/paymentappointment"
        element={
          <LayoutAccount>
            <PaymentAppointment />
          </LayoutAccount>
        }
      />
    </>
  );
}
