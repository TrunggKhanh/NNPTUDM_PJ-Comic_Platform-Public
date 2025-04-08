import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFollowing, unfollowComic } from "../../services/KhachHangServices";
import imgInfo from '../../assets/img/empty-cr-list.png';

const Following = () => {
    const [following, setFollowing] = useState([]); // Danh sách theo dõi
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

    // Gọi API để lấy danh sách theo dõi
    useEffect(() => {
        const loadFollowing = async () => {
            if (!isAuthenticated || !user) return;

            setLoading(true);
            setError(null);
            try {
                const result = await fetchFollowing(user.id);
                setFollowing(result.data); // Cập nhật danh sách theo dõi
            } catch (err) {
                setError(err.message || "Đã xảy ra lỗi khi tải danh sách theo dõi.");
            } finally {
                setLoading(false);
            }
        };

        loadFollowing();
    }, [user, isAuthenticated]);

    // Xử lý bỏ theo dõi
    const handleUnfollow = async (userId, comicId) => {
        try {
            const response = await unfollowComic(userId, comicId);

            if (response.success) {
                setFollowing((prev) => prev.filter((item) => item.id !== comicId)); 
            }
        } catch (error) {
            console.error("Lỗi khi bỏ theo dõi:", error.message);
        }
    };

    if (loading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

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
                            className="fa-solid fa-heart"
                            style={{ fontSize: "30px", paddingRight: "1rem" }}
                        ></i>
                        DANH SÁCH THEO DÕI
                    </h2>
                </div>

                {error || !following || following.length === 0 ? (
                    <div className="list__container list" style={{padding: '3rem', marginBottom:'1rem'}}>
                      <div className="section-bottom  w-100" style={{ height: "`550vh`" }}>
                          <img src={imgInfo} alt="cat Image" />
                          <span>
                          Opps!!! <br />
                          {error || "Có vẻ như bạn chưa theo dõi bộ truyện nào."} <br />
                          Đi đến danh sách truyện ngay!!
                          </span>
                          <Link to="/latest">List Truyện</Link>
                      </div>
                  </div>
                ) : (
                    <div className="container w-100">
                        <div className="row justify-content-center">
                            {following.map((item) => (
                                <div key={item.id} className="item col-2 update-item">
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
                                            </figcaption>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleUnfollow(user.id, item.id);
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
                                                <i
                                                    style={{ color: "#fff" }}
                                                    className="fa-solid fa-trash-can"
                                                ></i>
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

export default Following;
