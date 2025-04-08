import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("session"); // Kiểm tra trạng thái đăng nhập

  if (!isAuthenticated) {
    return <Navigate to="/manager/login" replace />; // Điều hướng về trang đăng nhập
  }

  return children;
};

export default PrivateRoute;
