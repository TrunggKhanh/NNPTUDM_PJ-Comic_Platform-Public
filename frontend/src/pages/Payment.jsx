import Swal from "sweetalert2";
import yuru from "../assets/img/log-in-yuzu.png";
// import imgInfo from '../assets/denied2.png';
import { useState, useEffect } from "react";
import PaymentModal from "components/Element/PaymentModal";
const Payment = () => {
  // Hàm xử lý khi người dùng chọn gói
  // const [inforUser, setInforUser] = useState(null);
  // const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      // const parsedUser = JSON.parse(userDataFromStorage);
      setIsAuthenticated(true);
      // setUser(parsedUser);
    }
  }, []);

  const handleCheckout = (packageId, packageInfo) => {
    if (!isAuthenticated) {
      // Yêu cầu đăng nhập
      Swal.fire({
        text: 'Bạn cần đăng nhập để đăng ký gói Thành Viên',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập ngay',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
    } else {
      setSelectedPackage(packageInfo);
      setShowModal(true);
    }
  };

  const handleModalConfirm = (paymentMethod) => {
    setShowModal(false); // Đóng modal
    Swal.fire({
      title: 'Xử lý thanh toán...',
      text: `Đang chuyển hướng đến cổng thanh toán ${paymentMethod.toUpperCase()}...`,
      timer: 2000,
      showConfirmButton: false,
      willClose: () => {
        // Điều hướng đến trang thanh toán
        window.location.href = `/payment/checkout/${selectedPackage}?method=${paymentMethod}`;
      },
    });
  };


  return (
    <div className="main__top">
      <div className="cx-decoration" style={{ zIndex: "1" }}><svg className="cx-decoration__lines cx-decoration__top-left-lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 388 727" data-t="lines-svg" aria-labelledby="lines-svg" role="img"><title id="lines-svg">Lines</title><path d="M168.269 66.4821L268.943 1.5908L268.401 0.750275L166.986 66.1194L1.1366 19.0246L0.863435 19.9866L165.874 66.8429L71.2691 127.822L0.729147 173.285L1.27088 174.126L95.4719 113.414L167.155 67.2068L291.724 102.579L143.515 419.707L1.41119 214.332L0.588844 214.901L143.025 420.756L0.546997 725.788L1.45303 726.212L143.684 421.711L223.665 537.305L224.487 536.736L144.175 420.662L292.701 102.855L386.952 129.618L387.226 128.656L293.131 101.937L340.122 1.38222L339.217 0.958847L292.156 101.66L168.269 66.4821Z" /></svg><svg className="cx-decoration__lines cx-decoration__top-right-lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 457 163" data-t="lines-svg" aria-labelledby="lines-svg" role="img"><title id="lines-svg">Lines</title><path d="M456.334 162.725L0.333679 1.85438L0.66637 0.911346L456.666 161.782L456.334 162.725Z" /></svg><svg className="cx-decoration__lines cx-decoration__bottom-left-lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205 92" data-t="lines-svg" aria-labelledby="lines-svg" role="img"><title id="lines-svg">Lines</title><path d="M1.0608 0.0432434L89.5033 39.4213L126.086 55.7013L125.68 56.6149L89.0967 40.3349L0.654053 0.956785L1.0608 0.0432434ZM133.478 58.9914L134.904 59.6264L204.699 90.5414L204.702 90.5429L204.301 91.4586L204.298 91.4572L189.498 85.0306L189.494 85.0288L134.501 60.5418L133.007 59.8799L133.478 58.9914Z" /></svg><svg className="cx-decoration__lines cx-decoration__bottom-right-lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 424" data-t="lines-svg" aria-labelledby="lines-svg" role="img"><title id="lines-svg">Lines</title><path d="M555.302 -0.000961304L813.364 273.714L812.636 274.4L554.574 0.685034L555.302 -0.000961304ZM0.224352 237.744L326.769 280.873L279.047 245.432L279.643 244.63L328.809 281.142L813.066 345.104L812.935 346.095L330.464 282.37L519.798 422.972L519.202 423.775L328.424 282.101L0.0934143 238.736L0.224352 237.744Z" /></svg></div>
      <div className="payment__header w-100 position-relative">
        <h2>PICK YOUR PREMIUM</h2>
        <div className="divider"></div>
      </div>

      <div className="payment__content w-100 position-relative">
        {/* CLASSIC Plan */}
        <div className="content content-basic">
          <h3>CLASSIC</h3>
          <h4>Free</h4>
          <ul>
            <li>Là gói dịch vụ cơ bản của Mangasmurf</li>
            <li>Đọc miễn phí các đầu truyện</li>
            <li>Đầu truyện và các chương truyện miễn phí mỗi ngày</li>
          </ul>
          <button
            className="btn-pay btn-basic"
            onClick={() => (window.location.href = "/trending")}
          >
            Watch Now
          </button>
        </div>

        {/* MEGA FAN Plan */}
        <div className="content content-mega">
          <h3>MEGA FAN</h3>
          <h4>₫69,000/ 129 <i className="ri-coins-fill"></i></h4>
          <h5>Là gói đặc quyền của hội viên Mangasmurf</h5>
          <ul>
            <li>Truy cập toàn bộ kho truyện của Mangasmurf</li>
            <li>Đọc sớm nhất các bộ truyện</li>
            <li>Sử dụng giao diện ZEN-UI nâng cao trải nghiệm</li>
          </ul>
          <button
            className="btn-pay btn-mega"
            onClick={() =>
              handleCheckout("P004", { name: "MEGA FAN", price: "69,000", ticket: "129"})
            }
          >
            Buy Now
          </button>
        </div>

        {/* FAN Plan */}
        <div className="content content-fan">
          <h3>FAN</h3>
          <h4>₫49,000/ 69 <i className="ri-coins-fill"></i></h4>
          <ul>
            <li>Là gói Thành viên của Mangasmurf</li>
            <li>Đọc miễn phí các đầu truyện</li>
            <li>Đọc các đầu truyện trả phí với giá phải chăng</li>
          </ul>
          <button
            className="btn-pay btn-fan"
            onClick={() =>
              handleCheckout("P005", { name: "FAN", price: "49,000"})
            }
          >
            Buy Now
          </button>
        </div>

        <div className="img-pre" style={{ right: "-3.5rem", top: "20rem", maxWidth: "250px" }}>
          <img src={yuru} alt="Premium illustration" />
        </div>

        
      </div>
      <PaymentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleModalConfirm}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default Payment;