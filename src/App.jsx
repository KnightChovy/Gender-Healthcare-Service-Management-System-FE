import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/HomePage";
import Register from "./page/register";
import Login from "./page/login";
import ForgetPassword from "./page/forgetPassword";
import { DashboardCustomer } from "./components/Layouts/LayoutAccount/DashboardCustomer";
import { Services } from "./components/Layouts/LayoutAccount/Services";
import Appointment from "./page/Appointment";
import TestOrder from "./page/TestOrder";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/dashboardcustomer" element={<DashboardCustomer />} />
      <Route path="/services" element={<Services />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/testorder" element={<TestOrder />} />
    </Routes>
  );
}

export default App;
