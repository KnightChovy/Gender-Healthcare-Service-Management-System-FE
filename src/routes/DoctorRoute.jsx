import React from "react";
import { Route } from "react-router-dom";
import DoctorLayout from "../components/Layouts/LayoutDoctor/DoctorLayout";
import DoctorDashboard from "../page/Doctor/Dashboard";
import Schedule from "../page/Doctor/Schedule";
/**
 * Cấu hình routes cho Doctor, không sử dụng PrivateRoute
 */
const DoctorRoute = () => [
  <Route key="doctor-route" path="/doctor" element={<DoctorLayout />}>
    <Route index element={<DoctorDashboard />} />
    <Route path="dashboard" element={<DoctorDashboard />} />
    <Route path="schedule" element={<Schedule />} />
  </Route>,
];

export default DoctorRoute;
