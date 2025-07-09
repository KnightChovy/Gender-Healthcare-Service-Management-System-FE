import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function StaffRoute({ children }) {
  const { accessToken, user } = useSelector((state) => state.auth);

  const isStaff = user?.role?.toLowerCase() === "staff";
  console.log(isStaff, "isStaff");

  return accessToken && isStaff ? children : <Navigate to={"/"} />;
}

export default StaffRoute;
