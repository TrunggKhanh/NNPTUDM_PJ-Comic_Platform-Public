import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  fetchBoTruyenById,
  followComic,
  unfollowComic,
  checkPremiumAccess,
  fetchChaptersByComicId,
  fetchRecommendedBoTruyen,
  saveBoTruyenHistory,
  findCTBoTruyen,
} from "../../services/BoTruyenServices";
import iconPremium from "../../assets/PreDark.png";
import Loader from "../../components/Element/Loader";
import RecommendComics from '../../components/Home/RecommendComics';
const CtBoTruyen = () => {

  // các usestate cho Botruyen
  const { id } = useParams();
  const navigate = useNavigate();
  const [boTruyen, setBoTruyen] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [userTickets, setUserTickets] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [rating, setRating] = useState(null);
  const [contentExpanded, setContentExpanded] = useState(false);
  const [recommendedComics, setRecommendedComics] = useState([]);
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setUser(parsedUser); // Lưu thông tin user vào state
      setIsAuthenticated(true); // Đánh dấu trạng thái đăng nhập
    }
  }, []);


  useEffect(() => {
    const loadBoTruyen = async () => {
      try {
        const data = await fetchBoTruyenById(id);
        setBoTruyen(data);
        setUserTickets(data.userTickets || 0);
        setIsPremium(data.isPremium || false);
        setRating(data.danhgia || 0);

        const chaptersData = await fetchChaptersByComicId(id); // Lấy danh sách chương
        setChapters(chaptersData);

        // Nếu user đã đăng nhập, lưu lịch sử đọc
        if (isAuthenticated && user) {
          const latestChapter = data.latestChapter?.SttChap || null;
          console.log("Gọi API với:", { comicId: id, userId: user.id, latestChapter });
          await saveBoTruyenHistory(id, user.id, latestChapter);
          console.log("Lịch sử đọc đã được lưu thành công!");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin bộ truyện hoặc lưu lịch sử:", error);
      }
    };

    if (id) {
      loadBoTruyen(); // Chỉ gọi khi `id` tồn tại
    }
  }, [id, isAuthenticated, user]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookId = "67507c32968ff0f3ba4c2c25";
        const [recommendedData] = await Promise.all([
          fetchRecommendedBoTruyen(bookId),
        ]);
        setRecommendedComics(recommendedData);
      } catch (err) {
        // setError(err.message);
        console.error("Lỗi khi lấy thông tin CTBoTruyen:", err.message);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {`  `
    const fetchCTBoTruyen = async () => {
      try {
        if (!id || !user?.id) return;

        const result = await findCTBoTruyen(id, user.id);
        if (result && result.data) {
          setFollowed(result.data.theodoi || false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin CTBoTruyen:", error.message);
      }
    };

    fetchCTBoTruyen();
  }, [id, user]);

  // Hàm handleFollow tích hợp với API follow/unfollow
  const handleFollow = async () => {
    try {
      if (followed) {
        // Gọi API hủy theo dõi
        console.log("unfollowComic");
        const response = await unfollowComic(id, user.id);
        console.log("unfollowComic", response);
        if (response.success) {
          setFollowed(false);
        }

      } else {
        // Gọi API theo dõi
        const response = await followComic(id, user.id);
        if (response.success) {
          setFollowed(true);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái theo dõi:", error.message);
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái theo dõi.", "error");
    }
  };

  const handleReadChapter = async (chapter) => {
    try {
      const hasAccess = await checkPremiumAccess(
        chapter._id,
        user.id,
        isPremium,
        userTickets,
        chapter.ticket_cost
      );
      if (hasAccess) {
        navigate(`/chapter/${chapter._id}`);
      } else {
        Swal.fire(
          "Thông báo",
          "Bạn cần mua vé hoặc nâng cấp tài khoản Premium để đọc chương này.",
          "warning"
        );
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể mở chương truyện.", error);
    }
  };

  const toggleContent = () => setContentExpanded(!contentExpanded);
  const handleChapterClick = (id_bo, stt_chap) => {
    navigate(`/chapter/${id_bo}/${stt_chap}`);

  };

  if (!boTruyen) {
    return <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
  }

  return (
    <div className="main__top containers">
      <div className="detail__container ">
        {/* Phần thông tin chính */}
        <div className="detail__infor ">
          <div className="bg__detail">
            <div className="bg">
              {boTruyen.banner && (
                <img
                  src={`http://localhost:5000${boTruyen.banner}`}
                  alt="bg-item"
                  className="bg-main"
                />
              )}
              <div className=" bg__detail-infor">
                <div className="infor">
                  <div className="pre">
                    <img src={iconPremium} alt="Gói Premium" />
                  </div>
                  <h3 className="item-title">{boTruyen.tenbo}</h3>
                  <div className="rating">
                    {[...Array(5)].map((_, idx) => (
                      <i
                        key={idx}
                        className={`ri-star-fill ${idx < rating ? "active" : ""}`}
                        style={idx < rating ? { color: "#FAB818" } : {}}
                      />
                    ))}
                    <hr />
                    <span className="rating-review">
                      Average Rating: {rating} ({boTruyen.TongLuotXem || 0} Views)
                    </span>
                    <hr />
                  </div>
                  <div className="author-title">
                    Author: <span>{boTruyen.tacgia}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="background-item"></div>
            <div className="poster-detail">
              {chapters.length > 0 ? (
                <div className="background-detail">
                  <div className="bg-item"></div>
                  <a className="btn-read" onClick={() => navigate(`/chapter/${chapters[0]._id}`)}>
                    <i className="ri-book-open-fill" title="Click to Read"></i>
                  </a>
                </div>
              ) : (
                <div className="background-detail">
                  <div className="bg-item"></div>
                </div>
              )}
              {boTruyen.poster && (
                <img
                  src={`http://localhost:5000${boTruyen.poster}`}
                  alt="Poster"
                  style={{ maxWidth: "224px", maxHeight: "336px", objectFit: "scale-down" }}
                />
              )}
            </div>
          </div>

        </div>

        {/* Nội dung chính */}
        <div className="content-detail">
          <div className="time-detail">
            <i className="ri-time-line"></i>
            {boTruyen.latestChapter ? (
              <span className="time">{boTruyen.latestChapter.ThoiGian}</span>
            ) : (
              <span className="time">NaN</span>
            )}
          </div>
          <div className="type-detail">
            {boTruyen.listloai?.map((genre, index) => (
              <a
                key={index}
                href={`/${genre._id}`}
                className="item-type"
              >
                {genre.ten_loai}
              </a>
            ))}
          </div>
          {/* Nút thao tác */}
          <div className="btn-detail">
            <div className="btn__follow">
              {followed ? (
                <a
                  className="btn-unfollow"
                  // style={{ backgroundColor: "#FE0000", borderRadius: "5px" }}
                  onClick={handleFollow}
                >
                  <i className="ri-close-fill"></i>
                  <span>HỦY THEO DÕI</span>
                </a>
              ) : (
                <a
                  className="btn-follow"
                  // style={{ backgroundColor: "#8f8f8f", color: "#fff" }}
                  onClick={handleFollow}
                >
                  <i className="fa-solid fa-heart"></i>
                  <span> THEO DÕI</span>
                </a>
              )}
            </div>

            <div className="btn-follow">
              {chapters.length > 0 && (
                <a
                  className="btn__action"
                  style={{
                    // pointerEvents: isPremium || userTickets >= 1 ? "auto" : "none",
                    // backgroundColor:
                    //   isPremium || userTickets > 0 ? "#007BFF" : "#8f8f8f",
                  }}
                  onClick={handleReadChapter}
                >
                  Đọc tiếp chap{" "}
                  <span className="chapter">{chapters[0]?.stt || "N/A"}</span>
                </a>
              )}
            </div>
            <div className="btn-follow">
              {chapters.length > 0 && (
                <a
                  className="btn__action"
                  style={{
                    // pointerEvents: isPremium || userTickets > 1 ? "auto" : "none",
                    // backgroundColor:
                    //   isPremium || userTickets > 0 ? "#007BFF" : "#8f8f8f",
                  }}
                  onClick={handleReadChapter}
                >
                  Đọc mới nhất{" "}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={`content-main ${contentExpanded ? "active-content" : ""}`}>
          <div className="content-title">
            <i className="ri-file-text-line"></i> Nội dung
          </div>
          <div className="content">
            <p>{boTruyen.mota || "Không có nội dung mô tả"}</p>
          </div>
          <div className="content-More">
            <div className="content-title">
              <i className="fa-solid fa-circle-info"></i> Thông tin thêm
            </div>
            <div className="content">
              <div className="chapter">
                <i className="fa-solid fa-user-pen"></i> Tác giả:{" "}
                <span className="count">{boTruyen.tacgia || "Không rõ"}</span>
              </div>
              <div className="chapter">
                <i className="ri-send-plane-fill"></i>
                <span className="count">{chapters.length || 0}</span> Chương đã đăng
              </div>
              <div className="view">
                <i className="ri-eye-line"></i>
                <span className="count">{boTruyen.TongLuotXem || 0}</span> Lượt xem
              </div>
              <div className="review">
                <i className="ri-message-2-fill"></i>
                <span className="count">{boTruyen.theodoi || 0}</span> Lượt Theo Dõi
              </div>
            </div>
            <div className="content-close" onClick={toggleContent}>
              {contentExpanded ? "Thu gọn" : "Xem thêm"}
            </div>
          </div>
        </div>
        <div className="detail__list">
          <div className="content-title">
            <i className="fa-solid fa-list"></i> DANH SÁCH CHƯƠNG TRUYỆN
          </div>
          <div className="chapter-list">
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className="chapter-item"
                  onClick={() => handleChapterClick(boTruyen._id, chapter.stt_chap)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="row">
                    <div className="col chapter chap-col">Chương {chapter.stt_chap}</div>
                    <div className="col-6 content chap-col">{chapter.ten_chap}</div>
                    <div className="col time chap-col">
                      {new Date(chapter.thoi_gian).toLocaleDateString()}
                    </div>
                    <div className="col view chap-col">
                      {chapter.luotxem || 0} lượt xem
                    </div> 
                    <div className="col view chap-col">
                      {chapter.Premium ? (
                        <div className="col view chap-col position-relative">
                          <img
                            style={{ width: '65px', height: '27px', borderRadius: '0' }}
                            src={iconPremium}
                            alt="Premium Icon"
                          />
                        </div>
                      ) : (
                        <div className="col-1 view chap-col position-relative"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Không có chương nào.</div>
            )}
          </div>

        </div>
        <RecommendComics comics={recommendedComics} title="Bộ truyện tương tự" />
      </div>
    </div>
  );
};

export default CtBoTruyen;
