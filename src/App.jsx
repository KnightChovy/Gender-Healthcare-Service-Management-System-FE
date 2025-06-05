import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/HomePage";
import Register from "./page/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;