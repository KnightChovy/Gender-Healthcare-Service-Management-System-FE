import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/account/HomePage";
import { LayoutAccount } from "./components/Layouts/LayoutAccount/LayoutAccount";
import Login from "./page/login";
import Register from "./page/Register";
import ForgetPassword from "./page/ForgetPassword";
import LayoutAdmin from "./components/Layouts/LayoutAdmin/LayoutAdmin";
import Blog from "./page/blog/Blog";
import BlogDetail from "./page/blog/BlogDetail";
import Appointment from "./page/Appointment";
import PaymentAppointment from "./page/Payment/PaymentAppointment";
import PaymentSuccess from "./page/Payment/PaymentSuccess";
import PaymentCancel from "./page/Payment/PaymentCancel";
import { AdminRoute } from "./routes/AdminRouter";
import TestServicePage from "./page/testservice";
import { ServicePage } from "./page/Services/ServicePage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MeetWidget from "./components/ui/MeetWidget";
import About from "./page/AboutUs/About";
import { ToastContainer } from "react-toastify";
import { EmployeesManagerment } from "./page/admin/EmployeesManagerment/EmployeesManagerment";
import DashboardAdmin from "./page/admin/DashboardAdmin";
import ManagerRoute from "./routes/ManagerRouter";
import LayoutManager from "./components/Layouts/LayoutManager/LayoutManager";
import { DashboardManager } from "./page/manager/DashboardManager";
import DoctorRoute from "./routes/DoctorRoute";
import DoctorLayout from "./components/Layouts/LayoutDoctor/DoctorLayout";
import DoctorDashboard from "./page/Doctor/Dashboard";
import Appointments from "./page/Doctor/Appointments";
import Schedule from "./page/Doctor/Schedule";
import Profile from "./page/Doctor/Profile";
import { ConsultSchedulerManagerment } from "./page/manager/ConsultSchedulerManagerment/ConsultSchedulerManagerment";
import AddEmployees from "./page/admin/EmployeesManagerment/AddEmployees";
import ProfilePage from "./page/profile";
import { ChangePassword } from "./page/changePassword/ChangePassword";
import MyAppointments from "./page/account/MyAppointments";
import GeminiChatbot from "./components/ui/GeminiChatbot";
import FeedbackAppointment from "./page/Feedback/FeedbackAppointment";
import Feedback from "./page/Feedback/Feedback";
import MenstrualCycle from "./page/MenstrualCycle";
// Staff imports
import StaffRoute from "./routes/StaffRouter";
import LayoutStaff from "./components/Layouts/LayoutStaff/LayoutStaff";
import { DashboardStaff } from "./page/staff/DashboardStaff";
import { TestManagement as StaffTestManagement } from "./page/staff/TestManagement";

import { useEffect, useState } from "react";
import { TestAppointment } from "./page/manager/TestAppointment/TestAppointment";
import { ScrollTop } from "./components/ui/ScrollTop";
import UserManagement from "./page/admin/UserManagement";
import RevenueManagement from "./page/manager/RevenueManagement";
function App() {
  const [isAuthen, setIsAuthen] = useState(false);
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthen(!!token);
    };
    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);

    const authCheckInterval = setInterval(checkAuthStatus, 5000);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      clearInterval(authCheckInterval);
    };
  }, []);
  return (
    <>
      <ToastContainer />
      <ScrollTop />
      <Routes>
        <Route
          path="/"
          element={
            <LayoutAccount>
              <HomePage />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/services"
          element={
            <LayoutAccount>
              <ServicePage />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <LayoutAccount>
              <Register />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <LayoutAccount>
              <Login />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/blog"
          element={
            <LayoutAccount>
              <Blog />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/blog/:id"
          element={
            <LayoutAccount>
              <BlogDetail />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <LayoutAccount>
              <About />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/paymentappointment/:appointmentId"
          element={
            <LayoutAccount>
              <PaymentAppointment />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/services/appointment-consultation"
          element={
            <LayoutAccount>
              <Appointment />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/my-appointments"
          element={
            <LayoutAccount>
              <MyAppointments />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/forgetpassword"
          element={
            <LayoutAccount>
              <ForgetPassword />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <LayoutAccount>
              <ProfilePage />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/changepassword"
          element={
            <LayoutAccount>
              <ChangePassword />
            </LayoutAccount>
          }
        />
        <Route
          path="/success"
          element={
            <LayoutAccount>
              <PaymentSuccess />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/cancel"
          element={
            <LayoutAccount>
              <PaymentCancel />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/feedback/consultation/:appointmentId"
          element={
            <LayoutAccount>
              <FeedbackAppointment />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/feedback"
          element={
            <LayoutAccount>
              <Feedback />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/services/menstrual-cycle"
          element={
            <LayoutAccount>
              <MenstrualCycle />
            </LayoutAccount>
          }
        ></Route>
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <LayoutAdmin />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="employees" element={<EmployeesManagerment />} />
          <Route path="employees/addEmployees" element={<AddEmployees />} />
          <Route path="users" element={<UserManagement />} />
        </Route>{" "}
        {/* Doctor */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Test Service */}
        <Route
          path="/services/test"
          element={
            <LayoutAccount>
              <TestServicePage />
            </LayoutAccount>
          }
        ></Route>
        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ManagerRoute>
              <LayoutManager />
            </ManagerRoute>
          }
        >
          <Route index element={<DashboardManager />} />
          <Route
            path="/manager/consultScheduler"
            element={<ConsultSchedulerManagerment />}
          />
          <Route
            path="/manager/test_appointment"
            element={<TestAppointment />}
          />
          <Route
            path="/manager/revenuamanagerment"
            element={<RevenueManagement />}
          />
        </Route>
        {/* Staff */}
        <Route
          path="/staff"
          element={
            <StaffRoute>
              <LayoutStaff />
            </StaffRoute>
          }
        >
          <Route index element={<DashboardStaff />} />
          <Route path="test-management" element={<StaffTestManagement />} />
        </Route>
      </Routes>

      {/* <MeetWidget /> */}
      {isAuthen && <GeminiChatbot />}
      <ScrollToTop />
    </>
  );
}

export default App;
