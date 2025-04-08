import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "../components/Login/HeaderLogin";
import registerImage from "../assets/img_regis.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Xử lý sự kiện khi người dùng nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
  
      if (response.data.success) {
        localStorage.setItem("session", JSON.stringify(response.data.session));
        localStorage.setItem("user", JSON.stringify({
          id: response.data.user.id,
          username: response.data.user.username,
          avatar: response.data.user.avatar,
        }));

        setSuccessMessage("Đăng ký thành công! Đang chuyển hướng...");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/infor", {
            state: {
              user: {
                id: response.data.user.id, 
                username: response.data.user.username,
                avatar: response.data.user.avatar,
                email: response.data.user.email,
              },
            },
          });
        }, 2000);
      } else {
        setErrorMessage(response.data.message || "Đăng ký thất bại!");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.", error);
      setSuccessMessage("");
    }
  };
  
  

  return (
    <>
      <HeaderLogin />
      <div className="main-register">
        <div className="main-login__content w-100">
          <h3 className="main__title">REGISTER NOW!</h3>
          <form className="form-login" onSubmit={handleSubmit}>
            <div className="content-login form-group">
              {/* Tên đăng nhập */}
              <div className="inputBox">
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  placeholder="Username"
                />
                <span>Username</span>
                <i></i>
              </div>

              {/* Email */}
              <div className="inputBox">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  placeholder="Email Address"
                />
                <span>Email Address</span>
                <i></i>
              </div>

              {/* Mật khẩu */}
              <div className="inputBox">
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Password"
                />
                <span>Password</span>
                <i></i>
              </div>

              {/* Hiển thị thông báo lỗi */}
              {errorMessage && <div className="text-danger">{errorMessage}</div>}

              {/* Hiển thị thông báo thành công */}
              {successMessage && <div className="text-success">{successMessage}</div>}
              <div className="login">
                <input type="submit" value="Đăng ký" />
              </div>

              <h6>or</h6>
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
              <div className="regis">
                Bạn đã có tài khoản?{" "}
                <a href="/login" className="register-link">
                  ĐĂNG NHẬP
                </a>
              </div>
            </div>

            {/* Hình ảnh trang đăng ký */}
            <div className="img">
              <img src={registerImage} alt="Đăng ký" className="img-regis" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
