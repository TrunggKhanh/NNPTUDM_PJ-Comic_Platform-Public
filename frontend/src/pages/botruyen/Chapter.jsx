import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import iconPremium from "../../assets/PreDark.png";
import yuzu from '../../assets/yuzu.png';
import {
  followComic,
  unfollowComic,
  findCTBoTruyen,
  fetchChaptersByComicId,
} from "../../services/BoTruyenServices";


const Chapter = () => {
  const { id_bo, stt_chap } = useParams();
  const navigate = useNavigate();
  // transition 
  const [isVisible, setIsVisible] = useState(true); 
  const [scrollPosition, setScrollPosition] = useState(0);

  //state element
  const [chapterDetails, setChapterDetails] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState({});
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  // State user
  const [user, setUser] = useState(null);
  const [KH, setKH] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > scrollPosition) {
        setIsVisible(true); 
      } else {
        setIsVisible(false); 
      }
      setScrollPosition(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setUser(parsedUser); 
      setIsAuthenticated(true); 
      fetchKhachHangDetails(parsedUser.id);
      console.log(KH);
    }
  }, []);

  useEffect(() => {
    const fetchCTBoTruyen = async () => {
      try {
        if (!id_bo || !user?.id) return;

        const result = await findCTBoTruyen(id_bo, user.id);
        if (result && result.data) {
          setFollowed(result.data.theodoi || false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin CTBoTruyen:", error.message);
      }
    };

    fetchCTBoTruyen();
  }, [id_bo, user]);


  useEffect(() => {
    fetchChapterDetails();
    fetchChapterInfo();
  }, [id_bo, stt_chap]);

  const handleAuthAlert = ({width, height, title, text, imageUrl,textConfirm, onConfirm}) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-oke",
          cancelButton: "btn btn-danger mr-3",
          popup: "custom-swal-popup", 
          title: "custom-swal-title",
          htmlContainer: "custom-swal-text",
        },
        buttonsStyling: false,
      });
    
      swalWithBootstrapButtons
        .fire({
          title,
          text,
          imageUrl,
          imageWidth: width,
          imageHeight: height,
          imageAlt: "Custom image",
          showCancelButton: true,
          confirmButtonText: textConfirm,
          cancelButtonText: "Hủy",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            onConfirm();
          }
        });
    };

  // Lấy thông tin khách hànghàng
  const fetchKhachHangDetails= async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/KhachHang/${id}`);
      const data = response.data;
      setKH(data);
    } catch (error) {
      console.error("Error fetching chapter info:", error);
      Swal.fire("Lỗi", "Không thể tải thông tin chương", "error");
    }
  };  

  // Lấy chi tiết chương
  const fetchChapterDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chapter/${id_bo}/${stt_chap}/pages`
      );
      
      const data = response.data.data;
      setChapterDetails(data.chi_tiet || []); 
      setCurrentChapter((prev) => ({
        ...prev,
        ten_bo: data.ten_bo,
        ten_chap: data.ten_chap,
        thoi_gian: data.thoi_gian,
        luot_xem: data.luot_xem,
      }));
      const chaptersData = await fetchChaptersByComicId(id_bo);
      setChapters(chaptersData);
  
    } catch (error) {
      console.error("Error fetching chapter details:", error);
      Swal.fire("Lỗi", "Không thể tải thông tin chi tiết chương", "error");
    }
  };
  

  // Lấy thông tin chương hiện tại, chương trước, và chương tiếp theo
  const fetchChapterInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chapter/by-book/${id_bo}`);
      const chapters = Array.isArray(response.data) ? response.data : []; 
      const current = chapters.find((c) => c.stt_chap === parseInt(stt_chap));
      const prev = chapters.find((c) => c.stt_chap === parseInt(stt_chap) - 1);
      const next = chapters.find((c) => c.stt_chap === parseInt(stt_chap) + 1);
  
      setCurrentChapter((prev) => ({
        ...prev,
        ...current,
      }));
  
      setPrevChapter(prev || null); 
      setNextChapter(next || null);
      setChapters(chapters);
    } catch (error) {
      console.error("Error fetching chapter info:", error);
      Swal.fire("Lỗi", "Không thể tải thông tin chương", "error");
    }
  };  
  

  const handlePremiumClick = (chap) => {
    if (!user || !isAuthenticated) {
      handleAuthAlert({
        width: 200,
        height: 100,
        title: "Login Now",
        text: `Bạn cần đăng nhập để đọc chapter này!!`,
        imageUrl: yuzu,
        cancelButtonText: "Hủy",
        textConfirm:"Đăng nhập",
        onConfirm: () => navigate("/loginlogin"), 
      });
    } else if (!KH.ActivePremium && KH.TicketSalary < chap.ticket_cost) {
      handleAuthAlert({
        width: 200,
        height: 100,
        title: "OPPS!!",
        text: `Chương này yêu cầu ${chap.ticket_cost} vé. Bạn cần mua vé hoặc nâng cấp tài khoản để đọc!`,
        imageUrl: yuzu,
        textConfirm: chap.ticket_cost > 0 ? "Mua vé" : "Nâng cấp",
        cancelButtonText: "Hủy",
        onConfirm: () => navigate("/payment"),
      });
    }else if(KH.ActivePremium && KH.TicketSalary > chap.ticket_cost){
      handleNavigationPre(chap.stt_chap);
    } else {
      handleNavigation(chap.stt_chap);
    }
  };
  
  const handleNavigationPre = (newSttChap) => {
    if (newSttChap) {
      navigate(`/chapter/${id_bo}/${newSttChap}`);
    } else {
      Swal.fire("Thông báo", "Chương không hợp lệ", "warning");
    }
  };

  // Điều hướng đến chương mới
  const handleNavigation = (newSttChap) => {
    if (newSttChap) {
      navigate(`/chapter/${id_bo}/${newSttChap}`);
    } else {
      Swal.fire("Thông báo", "Chương không hợp lệ", "warning");
    }
  };

  // Hàm handleFollow tích hợp với API follow/unfollow
  const handleFollow = async () => {
    try {
      if (followed) {
        const response = await unfollowComic(id_bo, user.id);
        console.log("unfollowComic", response);
        if (response.success) {
          setFollowed(false);
        }

      } else {
        const response = await followComic(id_bo, user.id);
        console.log("response", response);
        if (response.success) {
          setFollowed(true);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái theo dõi:", error.message);
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái theo dõi.", "error");
    }
  };
  const handleNavigationWithPremiumCheck = (chap) => {
    if (!chap) {
      Swal.fire("Thông báo", "Không còn chương nào trước đó", "info");
      return;
    }
    if (chap.premium) {
      handlePremiumClick(chap);
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
      handleNavigation(chap.stt_chap);
      
    }
  };
  
  

  // useEffect(() => {
  //   fetchAllChapters();
  // }, [id_bo]);

  return (
    <div className="reading">
      <div className="reading__container">
        <div className="links">
          <a className="home" href="/">
            <i className="ri-home-4-fill"></i> Trang chủ
          </a>{" "}
          /{" "}
          <a href={`/comic/${id_bo}`} className="truyen">
            {currentChapter.ten_bo || "Tên bộ truyện"}
          </a>{" "}
          /{" "}
          <a href={`/chapter/${id_bo}/${stt_chap}`} className="chapter">
            Chap {stt_chap}
          </a>
        </div>

        <div className="infor">
          <div className="detail">
            <h3 className="name">
              {currentChapter.ten_chap || "Chương"} - chap {stt_chap}
            </h3>
          </div>
          <span className="time">
            Cập nhật lúc:{" "}
            {currentChapter.thoi_gian
              ? new Date(currentChapter.thoi_gian).toLocaleString()
              : "N/A"}
          </span>
          <h4 className="note">Nội dung: {currentChapter.ten_chap}</h4>
          <div className="btn__error">
            <a href="/contact" className="error">
              Báo lỗi
            </a>
          </div>
        </div>
      </div>
      <div className={`control ${isVisible ? "visible" : "hidden"}`} id="control">
        {/* Nút về trang chủ */}
        <a href="/" className="btn-home">
          <i className="fa-solid fa-house"></i>
        </a>

        {/* Nút về danh sách truyện */}
        <a href={`/comic/${id_bo}`} className="btn-home">
          <i className="fa-solid fa-bars"></i>
        </a>

        {/* Nút chương trước */}
        {prevChapter ? (
          <a
            className="btn-prev"
            onClick={() => handleNavigationWithPremiumCheck(prevChapter)}
          >
            <i className="fa-solid fa-angle-left"></i>
          </a>
        ) : (
          <a className="btn-prev" disabled style={{ backgroundColor: "#8f8f8f" }}>
            <i className="fa-solid fa-angle-left"></i>
          </a>
        )}

        {/* Dropdown danh sách chương */}
        <div className="dropdown dropdown-chapter">
          <a className="btn dropdown-btn" data-bs-toggle="dropdown" aria-expanded="false">
            Chap {stt_chap} <i className="ri-arrow-down-s-line"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-chap">
            {chapters.map((chap) => (
              <li key={chap._id}>
                <a
                  className={`dropdown-item ${chap.premium ? "premium-chap" : ""}`}
                  onClick={() => handlePremiumClick(chap)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span>
                    Chap {chap.stt_chap} - {chap.ten_chap}
                  </span>
                  {chap.premium && (
                    <img
                      style={{ width: "40px", height: "15px", marginLeft: "10px" }}
                      src={iconPremium}
                      alt="Premium"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Nút chương tiếp theo */}
        {nextChapter ? (
          <a
            className="btn-next"
            onClick={() => handleNavigationWithPremiumCheck(nextChapter)}
          >
            <i className="fa-solid fa-angle-right"></i>
          </a>
        ) : (
          <a className="btn-next" style={{ backgroundColor: "#8f8f8f" }}>
            <i className="fa-solid fa-angle-right"></i>
          </a>
        )}

        {/* Nút theo dõi hoặc hủy theo dõi */}
        {followed ? (
          <a className="btn-unfollow" onClick={handleFollow}>
            <i className="ri-close-fill"></i>
            <span>Hủy Theo Dõi</span>
          </a>
        ) : (
          <a className="btn-follow" onClick={handleFollow}>
            <i className="fa-solid fa-heart"></i>
            <span>Theo Dõi</span>
          </a>
        )}
      </div>



      <div className="reading-detail ">
        {chapterDetails.length > 0 ? (
          chapterDetails.map((page, index) => (
            <div key={index} className="page-chapter">
              <img
                loading="lazy"
                // src={`http://localhost:5000${page.anh_trang}`}
                src={page.anh_trang}
                alt={`Trang ${page.so_trang}`}
              />
            </div>
          ))
        ) : (
          <div>Không có hình ảnh cho chương này.</div>
        )}
      </div>

      <div className="control p-3 mt-4" style={{ gap: "1.2rem" }}>
        {prevChapter ? (
          <a
            className="btn-prev"
            onClick={() => handleNavigation(prevChapter.stt_chap)}
          >
            <i className="ri-arrow-left-s-line"></i><span style={{fontSize:'1rem'}}>Prev</span>
          </a>
        ) : (
          <a
            className="btn-prev"
            style={{ backgroundColor: "#8f8f8f", color: "#000", pointerEvents: "none" }}
          >
            <i className="ri-arrow-left-s-line"></i><span style={{fontSize:'1rem'}}>Prev</span>
          </a>
        )}
        {nextChapter ? (
          <a
            className="btn-next"
            onClick={() => handleNavigation(nextChapter.stt_chap)}
          >
            <i className="ri-arrow-right-s-line"></i> <span style={{fontSize:'1rem'}}>Tiếp</span>
          </a>
        ) : (
          <a
            className="btn-next"
            style={{ backgroundColor: "#8f8f8f", color: "#000", pointerEvents: "none" }}
          >
            <i className="ri-arrow-right-s-line"></i> <span style={{fontSize:'1rem'}}>Tiếp</span>
          </a>
        )}
      </div>
      <div className="reading__container">

        <div className="infor">
          <div className="detail">
            <h3 className="name">
              END!!
            </h3>
          </div>
          <div className="btn__error">
            <a href="/contact" className="error">
              Báo lỗi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter;