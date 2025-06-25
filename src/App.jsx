import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/HomePage";
import Register from "./page/Register";
import TestOrder from "./page/TestOrder";
import Login from "./page/Login";
import Appointment from "./page/Appointment";
import MenstrualCycle from "./page/MenstrualCycle";
import ForgetPassword from "./page/ForgetPassword";
import NotFound from "./page/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;