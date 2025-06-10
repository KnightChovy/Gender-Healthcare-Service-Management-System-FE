import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./page/account/HomePage";
import { LayoutAccount } from "./components/Layouts/LayoutAccount/LayoutAccount";
import Login from "./page/login";
import Register from "./page/Register";
import LayoutAdmin from "./components/Layouts/LayoutAdmin/LayoutAdmin";
import Blog from "./page/blog/Blog";
import { AdminRouter } from "./routes/AdminRouter";
import { TestServicePage } from "./page/testservice/TestServicePage";
import ScrollToTop from "./components/ui/ScrollToTop";
import MeetWidget from "./components/ui/MeetWidget";
function App() {
  return (
    <>
      <Routes>
        <Route
          path=""
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
          path="/admin"
          element={
            <AdminRouter>
              <LayoutAdmin />
            </AdminRouter>
          }
        ></Route>
      </Routes>
      <MeetWidget />
      <ScrollToTop />
    </>
  );
}

export default App;
