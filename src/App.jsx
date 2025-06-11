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
        </Route>
      </Routes>

      {/* <MeetWidget /> */}

      <ScrollToTop />
    </>
  );
}

export default App;
