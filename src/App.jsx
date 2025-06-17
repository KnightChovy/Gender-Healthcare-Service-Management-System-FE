import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/account/HomePage";
import { LayoutAccount } from "./components/Layouts/LayoutAccount/LayoutAccount";
import Login from "./page/login";
import Register from "./page/Register";
import ForgetPassword from "./page/ForgetPassword";
import LayoutAdmin from "./components/Layouts/LayoutAdmin/LayoutAdmin";
import Blog from "./page/blog/Blog";
import Appointment from "./page/Appointment";
import PaymentAppointment from "./page/Payment/PaymentAppointment";
import { AdminRoute } from "./routes/AdminRouter";
import { TestServicePage } from "./page/testservice/TestServicePage";
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
import Patients from "./page/Doctor/Patients";
import Profile from "./page/Doctor/Profile";
import { ConsultSchedulerManagerment } from "./page/manager/ConsultSchedulerManagerment/ConsultSchedulerManagerment";
function App() {
  return (
    <>
      <ToastContainer />
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
          path="/service"
          element={
            <LayoutAccount>
              <TestServicePage />
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
          path="/about"
          element={
            <LayoutAccount>
              <About />
            </LayoutAccount>
          }
        ></Route>

        <Route
          path="/paymentappointment"
          element={
            <LayoutAccount>
              <PaymentAppointment />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/appointment"
          element={
            <LayoutAccount>
              <Appointment />
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
          <Route path="employees" element={<EmployeesManagerment />}></Route>
        </Route>

        {/* Doctor */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="patients" element={<Patients />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Test Service */}

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
        </Route>
      </Routes>

      {/* <MeetWidget /> */}

      <ScrollToTop />
    </>
  );
}

export default App;
