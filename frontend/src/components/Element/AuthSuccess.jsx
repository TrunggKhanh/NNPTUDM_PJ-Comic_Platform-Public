import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/success", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem("user", JSON.stringify({
            id: data.user.user.IdUser,
            username: data.user.user.UserName,
            avatar: data.user.khachHang.IdAvatar || "/default-avatar.png",
          }));

          navigate("/infor"); // Điều hướng đến trang cập nhật thông tin
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
