import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "../page/account/HomePage";
import TestServicePage from "../page/testservice/TestServicePage";
import Login from "../page/login";
import Register from "../page/Register";
import Appointment from "../page/Appointment";
import MyAppointments from "../page/account/MyAppointments";
import PaymentAppointment from "../page/Payment/PaymentAppointment";
import { ProfilePage } from "../page/profile";
import ServicePage from "../page/Services/ServicePage"; // Import trang dịch vụ mới

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
        path="/services" // Đường dẫn đến trang dịch vụ mới
        element={
          <LayoutAccount>
            <ServicePage />
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
      <Route
        path="/my-appointments"
        element={
          <LayoutAccount>
            <MyAppointments />
          </LayoutAccount>
        }
      />
      <Route
        path="/profile"
        element={
          <LayoutAccount>
            <ProfilePage />
          </LayoutAccount>
        }
      />
    </>
  );
}
