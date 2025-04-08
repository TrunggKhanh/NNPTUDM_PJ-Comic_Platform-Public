import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import yuri from "../assets/img/log-in-yuzu.png";
import imgLogin from "../assets/img_login.png";
import HeaderLogin from "../components/Login/HeaderLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        localStorage.setItem("session", JSON.stringify(response.data.session));
        localStorage.setItem("user", JSON.stringify({
          id: response.data.user.IdUser,
          username: response.data.user.UserName,
          avatar: response.data.user.avatar || "/default-avatar.png",
        }));
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        setErrorMessage(response.data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error("Login error:", error);
    }
  };


  return (
    <>
      <HeaderLogin />
      <div className="main-login">
        <div className="main-login__content w-100">
          <h3 className="main__title">LOGIN</h3>
          <form className="form-login" onSubmit={handleSubmit}>
            <div className="content-login form-group">
              {/* Input cho tên đăng nhập */}
              <div className="inputBox">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="Username"
                />
                <span>Username</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Password"
                />
                <span>Password</span>
                <i></i>
              </div>
              {errorMessage && <div className="text-danger">{errorMessage}</div>}

              {/* Nút đăng nhập */}
              <div className="login">
                <input type="submit" value="Đăng nhập" />
              </div>

              <h6>or</h6>

              {/* Đăng nhập qua mạng xã hội */}
              <div className="other">
                <div className="facebook">
                  <a href="#">
                    <i className="ri-facebook-fill"></i>
                  </a>
                </div>
                <div className="google">
                  <a href={`http://localhost:5000/api/auth/google`}>
                    <i className="ri-google-fill"></i>
                  </a>
                </div>
              </div>

              {/* Đăng ký tài khoản mới */}
              <div className="regis">
                Bạn chưa có tài khoản?{" "}
                <a href="/register" className="register-link">
                  ĐĂNG KÝ
                </a>
              </div>
            </div>

            {/* Hình ảnh trang login */}
            <div className="img">
              <img src={imgLogin} alt="anh login" className="img-login" />
              <img src={yuri} alt="anh login" className="img-login-cat" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
