import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchReadHistory, deleteReadHistory } from "../../services/KhachHangServices"; // Service lấy lịch sử đọc
import yuzu from '../../assets/yuzu.png';

const History = () => {
  const [history, setHistory] = useState([]); // Danh sách lịch sử đọc
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lỗi khi tải dữ liệu

  const [user, setUser] = useState(null); // Thông tin user
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái đăng nhập

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setUser(parsedUser); // Lưu thông tin user vào state
      setIsAuthenticated(true); // Đánh dấu trạng thái đăng nhập
    }
  }, []);

  // Gọi API để lấy lịch sử đọc
  useEffect(() => {
    const loadHistory = async () => {
      if (!isAuthenticated || !user) return; // Kiểm tra trạng thái đăng nhập và user

      setLoading(true);
      setError(null);
      try {
        // Gọi service lấy lịch sử đọc từ API
        const result = await fetchReadHistory(user.id);
        setHistory(result.data); // Cập nhật danh sách lịch sử đọc
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải lịch sử đọc.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, isAuthenticated]); // Chạy khi user hoặc trạng thái đăng nhập thay đổi

  // Xử lý xóa lịch sử đọc
  const handleDeleteHistory = async (userId, comicId) => {
    try {
      // Gọi API xóa lịch sử đọc
      const response = await deleteReadHistory(userId, comicId);

      if (response.success) {
        console.log("Lịch sử đọc đã được xóa:", response.message);

        // Xóa bộ truyện khỏi state để cập nhật giao diện
        setHistory((prev) => prev.filter((item) => item.id !== comicId));
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử đọc:", error.message);
    }
  };

  // Trạng thái Loading
  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }
  // Giao diện hiển thị lịch sử đọc
  return (
    <div className="main__top containers">
      <div className="list__container list">
        <div
          className="top__content"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem 0",
          }}
        >
          <h2 className="section__subtitle">
            <i
              className="fa-solid fa-clock-rotate-left"
              style={{ fontSize: "30px", paddingRight: "1rem" }}
            ></i>
            LỊCH SỬ ĐỌC TRUYỆN
          </h2>
        </div>
  
        {/* Hiển thị khi có lỗi hoặc không có lịch sử */}
        {error || !history || history.length === 0 ? (
          <div className="section-bottom container w-100" style={{ height: "50vh" }}>
            <img src={yuzu} alt="cat Image" />
            <span>
              Opps!!! <br />
              {error || "Có vẻ như bạn chưa có lịch sử đọc mới"} <br />
              Đi đến trang chủ ngay
            </span>
            <Link to="/">Trang Chủ</Link>
          </div>
        ) : (
          // Hiển thị danh sách lịch sử khi có dữ liệu
          <div className="container w-100">
            <div className="row justify-content-center">
              {history.map((item) => (
                <div key={item.IbBo} className="item col-2 update-item">
                  <Link to={`/comic/${item.id}`}>
                    <figure className="position-relative">
                      {item.poster && (
                        <img
                          loading="lazy"
                          src={`http://localhost:5000${item.poster}`}
                          alt="Truyện Image"
                          className="d-block w-100 poster"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/path/to/default-image.jpg";
                          }}
                        />
                      )}
                      <figcaption>
                        <h6 className="item-title">
                          <Link to={`/comic/${item.id}`}>{item.tenbo}</Link>
                        </h6>
                        <Link
                          to={`/comic/${item.IbBo}/chapter/${item.LsMoi}`}
                          className="item-chapter"
                          style={{ fontSize: "13px" }}
                        >
                          <span className="chap" style={{ marginRight: "10px" }}>
                            Đọc tiếp chapter {item.ls_moi || "..."}
                          </span>
                        </Link>
                      </figcaption>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Ngăn chặn sự kiện từ thẻ cha
                          handleDeleteHistory(user.id, item.id);
                        }}
                        className="unfollow"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "var(--containers-color-alt)",
                          color: "#fff",
                          padding: ".2rem .6rem",
                          borderBottomLeftRadius: "5px",
                          border: "none",
                          zIndex: "10000",
                          cursor: "pointer",
                        }}
                      >
                        <i style={{ color: "#fff" }} className="fa-solid fa-trash-can"></i>
                      </button>
                    </figure>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default History;
