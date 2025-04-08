import { Link } from 'react-router-dom';
import iconPremium from '../../assets/PreDark.png';
const TopRankingBanner = ({ topComics }) => {
    if (!topComics || topComics.length === 0) {
        console.warn('Top comics list is empty or undefined!');
        return null;
    }

    const topComic = topComics[0]; // Lấy bộ truyện đầu tiên
    console.log('Top Comic:', topComic); // Debug kiểm tra giá trị topComic

    return (
        <section className="new-update TopRank__container sections" id="update">
            <div className="update__container grids">
                <div className="top__content">
                    <div className="title-infor">
                        <span className="section__subtitle">Top xếp hạng Hôm nay</span>
                        {/* <p className="section__des">Top 1 Lượt đọc hôm nay</p> */}
                    </div>
                </div>
                {/* <div className="containers"> */}
                    <div className="justify-content-center w-100 position-relative">
                        <div className="position-relative " style={{ padding: "1rem 0" }}>
                            {topComic.banner && (
                                <img
                                    loading="lazy"
                                    src={`http://localhost:5000${topComic.banner}`}
                                    alt={topComic.tenbo || "Không có tên bộ truyện"}
                                    className="img-poster"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            )}
                            <div className="background-item  w-100" style={{ zIndex: 0 }}></div>
                            {topComic.premium && (
                                <div className="position-absolute pre-poster">
                                    <img
                                        loading="lazy"
                                        src={iconPremium}
                                        alt="Premium Image"
                                        style={{ width: "100px", height: "40px", borderRadius: 0 }}
                                    />
                                </div>
                            )}
                            {/* Hiển thị thông tin truyện */}
                            <div className="position-absolute name-poster ">
                                <h3>{topComic.tenbo || "Không có tên bộ truyện"}</h3>
                                <div>
                                    {/* Hiển thị đánh giá */}
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <i
                                            key={i}
                                            className="ri-star-fill"
                                            style={{
                                                color: i < topComic.danhgia ? "#FAB818" : "#ccc",
                                            }}
                                        ></i>
                                    ))}
                                </div>
                                <div className="author-title">
                                    Author: <span>{topComic.ta}</span>
                                </div>
                                <div className="item-des">
                                    <p>{topComic.mota}</p>
                                </div>
                            </div>
                            {/* Nút xem ngay */}
                            <div className="position-absolute btn-poster">
                                <Link
                                    to={`/comic/${topComic._id}`}
                                    className="btn-poster-detail"
                                >
                                    XEM NGAY <i className="fa-solid fa-square-caret-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </section>
    );
};

export default TopRankingBanner;

