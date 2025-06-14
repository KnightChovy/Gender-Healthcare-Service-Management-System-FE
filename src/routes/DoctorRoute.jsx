import React from "react";
import { Route } from "react-router-dom";
import DoctorLayout from "../components/Layouts/LayoutDoctor/DoctorLayout";
import DoctorDashboard from "../page/Doctor/Dashboard";
import Schedule from "../page/Doctor/Schedule";
import Appointments from "../page/Doctor/Appointments";
import Patients from "../page/Doctor/Patients";
import Profile from "../page/Doctor/Profile";

const DoctorRoute = () => [
  <Route key="doctor-route" path="/doctor" element={<DoctorLayout />}>
    <Route index element={<DoctorDashboard />} />
    <Route path="/dashboard" element={<DoctorDashboard />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/patients" element={<Patients />} />
    <Route path="/profile" element={<Profile />} />
  </Route>,
];

export default DoctorRoute;
