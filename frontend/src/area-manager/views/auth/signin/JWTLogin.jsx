import  { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JWTLogin = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Lưu vào localStorage với thời gian hết hạn
  const setWithExpiry = (key, value, ttl) => {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttl, // TTL: thời gian tồn tại (ms)
    };

    localStorage.setItem(key, JSON.stringify(item));
  };

  // // Lấy từ localStorage và kiểm tra hết hạn
  // const getWithExpiry = (key) => {
  //   const itemStr = localStorage.getItem(key);

  //   if (!itemStr) return null;

  //   const item = JSON.parse(itemStr);
  //   const now = new Date();

  //   if (now.getTime() > item.expiry) {
  //     localStorage.removeItem(key); // Xóa nếu hết hạn
  //     return null;
  //   }

  //   return item.value;
  // };

  // Xử lý đăng nhập
  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user-manager/login', {
        UserName: values.username.trim(),
        Password: values.password.trim(),
      });
  
      if (response.data.message === "Đăng nhập thành công") {
        const { data, permissions } = response.data;
        localStorage.setItem("session", JSON.stringify({ loggedIn: true }));
        console.log("Session set:", localStorage.getItem("session"));
        // Hợp nhất user data với permissions
        const userWithPermissions = {
          id: data.IdUser,
          username: data.UserName,
          email: data.Email,
          staffRole: data.StaffRole,
        };
  
        console.log("User Data:", userWithPermissions);
  
        // Store permissions as a direct array in localStorage
        if (Array.isArray(permissions)) {
          localStorage.setItem("permissions", JSON.stringify(permissions));
          console.log("Stored Permissions in LocalStorage:", permissions);
        } else {
          console.error("Permissions are not an array:", permissions);
        }
  
        // Lưu user data vào localStorage
        setWithExpiry("userM", userWithPermissions, 7200000); // Lưu trong 2 giờ
  
        // Chuyển hướng đến trang chính
        navigate("/manager");
      } else {
        setErrorMessage(response.data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(error.response?.data?.message || "Đăng nhập thất bại.");
    }
  };
  
  
  
  

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Username là bắt buộc'),
        password: Yup.string().required('Mật khẩu là bắt buộc'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleLogin(values).finally(() => setSubmitting(false));
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
              placeholder="Nhập vào Username"
            />
            {touched.username && errors.username && <small className="text-danger">{errors.username}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              placeholder="Nhập vào Password"
            />
            {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          {errorMessage && (
            <Col sm={12}>
              <Alert variant="danger">{errorMessage}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="primary"
              >
                Đăng nhập
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
