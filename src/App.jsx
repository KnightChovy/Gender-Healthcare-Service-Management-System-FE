import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/HomePage";
import Register from "./page/Register";
import TestOrder from "./page/TestOrder";
import Login from "./page/Login";
import Appointment from "./page/Appointment";
import MenstrualCycle from "./page/MenstrualCycle";
import ForgetPassword from "./page/ForgetPassword";
import Payment from "./page/Payment";
import MyAppointments from "./page/MyAppointments";
import RatingsView from "./page/RatingsView";
import PrescriptionView from "./page/PrescriptionView";
import BlogPage from "./page/BlogPage";
import BlogDetailPage from "./page/BlogDetailPage";
import NotFound from "./page/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorDashboard from "./page/Doctor/DoctorDashboard";
import ManagerDashboard from "./page/Manager/ManagerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route 
        path="/test-order" 
        element={
          <ProtectedRoute>
            <TestOrder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/appointment" 
        element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/menstrual-cycle" 
        element={
          <ProtectedRoute>
            <MenstrualCycle />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-appointments" 
        element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment/:id" 
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor-dashboard" 
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manager-dashboard" 
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ratings" 
        element={
          <ProtectedRoute requiredRole="manager">
            <RatingsView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/prescriptions" 
        element={
          <ProtectedRoute>
            <PrescriptionView />
          </ProtectedRoute>
        } 
      />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;