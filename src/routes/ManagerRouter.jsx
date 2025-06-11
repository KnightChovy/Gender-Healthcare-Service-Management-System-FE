import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ManagerRoute({ children }) {
  const { accessToken, user } = useSelector((state) => state.auth);

  const isManager = user?.role?.toLowerCase() === "manager";
  console.log(isManager, "ismanager");

  return accessToken && isManager ? children : <Navigate to={"/"} />;
}

export default ManagerRoute;
