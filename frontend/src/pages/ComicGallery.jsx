import { useState, useEffect } from "react";
import { fetchTrendingComics } from "../services/BoTruyenServices";
import { Link } from "react-router-dom";

import Loader from "../components/Element/Loader";
const ListTrendingComics = () => {
  const [comics, setComics] = useState([]); // Danh sách truyện
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  const loadComics = async (page) => {
    setLoading(true);
    try {
      const { comics: fetchedComics, totalPages } = await fetchTrendingComics(page);
      setComics(fetchedComics); // Cập nhật danh sách truyện
      setTotalPages(totalPages); // Cập nhật tổng số trang
    } catch (error) {
      console.error("Error fetching trending comics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComics(currentPage); // Tải danh sách truyện khi trang thay đổi
  }, [currentPage]);

  if (loading) {
    return <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
  }

  if (!comics || comics.length === 0) {
    return <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
  }

  return (
    <div className="main__top section">
      <div className="list__container containers list">
        {/* Tiêu đề và các nút điều khiển */}
        <div className="top__content">
          <span className="section__subtitle">DANH SÁCH TRUYỆN HOT</span>
          <div className="controls">
            <div className="dropdown">
              <button className="btn" type="button">
                <i className="ri-menu-2-fill"></i> STATUS
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link to="/listTruyen" className="dropdown-item">
                    Tất cả
                  </Link>
                </li>
                <li>
                  <Link to="/listTruyenTT/1" className="dropdown-item">
                    Hoàn thành
                  </Link>
                </li>
                <li>
                  <Link to="/listTruyenTT/0" className="dropdown-item">
                    Đang tiến hành
                  </Link>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button className="btn" type="button">
                <i className="ri-equalizer-2-line"></i> FILTER
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ maxHeight: "150px" }}>
                <li>
                  <Link to="#" className="dropdown-item">
                    Theo thời gian
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    View
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Đánh giá
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hiển thị danh sách truyện */}
        <div className="container w-100">
          <div className="row justify-content-center">
            {comics.map((comic) => (
              <div key={comic._id} className="item col-2 update-item">
                <Link to={`/boTruyen/${comic._id}`}>
                  <figure className="position-relative">
                    {comic.AnhBia && (
                      <>
                        <span className="hot-icon">HOT</span>
                        <img
                          loading="lazy"
                          src={`http://localhost:5000${comic.AnhBia}`}
                          alt="Truyện Image"
                          className="d-block w-100 poster"
                          onError={(e) => {
                            e.target.onerror = null; // Ngăn lỗi lặp lại
                            e.target.src = "/path/to/default-image.jpg"; // Đường dẫn ảnh mặc định
                          }}
                        />
                      </>
                    )}
                    <figcaption>
                      <h6 className="item-title">{comic.TenBo}</h6>
                      <div className="item-chapter" style={{ fontSize: "13px" }}>
                        <span className="chap" style={{ marginRight: "10px" }}>
                          {comic.latestChapter?.SttChap
                            ? `chap ${comic.latestChapter.SttChap}`
                            : "chap ..."}
                        </span>
                        <span className="time">
                          {comic.latestChapter?.ThoiGian
                            ? `${comic.latestChapter.ThoiGian} giờ trước`
                            : "... giờ trước"}
                        </span>
                      </div>
                    </figcaption>
                    {comic.TtPemium && (
                      <div className="item-vip">
                        <i className="fa-solid fa-crown"></i>
                      </div>
                    )}
                  </figure>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Điều khiển phân trang */}
        <ul className="listPage">
          <li>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          <li>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
          </li>
          <li>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};


export default ListTrendingComics;
