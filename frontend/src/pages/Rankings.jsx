import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchRankingsByType } from "../services/BoTruyenServices";

const Rankings = () => {
    const { type } = useParams(); // Lấy loại xếp hạng từ URL
    const navigate = useNavigate();
    const [rankings, setRankings] = useState([]); // Danh sách bảng xếp hạng
    const [activeType, setActiveType] = useState(type || "1"); // Loại xếp hạng hiện tại

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const data = await fetchRankingsByType(activeType);
                setRankings(data);
            } catch (error) {
                console.error("Error fetching rankings:", error);
            }
        };

        fetchRankings();
    }, [activeType]);

    // Handle type change
    const handleTypeChange = (newType) => {
        navigate(`/rankings/${newType}`);
        setActiveType(newType);
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const filledStars = Math.min(Math.max(parseInt(rating, 10), 0), 5);
        const emptyStars = 5 - filledStars;

        return (
            <>
                {[...Array(filledStars)].map((_, i) => (
                    <i key={`filled-${i}`} className="ri-star-fill" style={{ color: "#FAB818" }}></i>
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`} className="ri-star-fill"></i>
                ))}
            </>
        );
    };

    return (
        <div className="home-container ">
            <div className="main__top sections" >
                <div className=" rank__container">
                    <div className="rank">
                        <h2 className="section__subtitle">Bảng Xếp Hạng</h2>
                        <p className="section__des">
                            Xếp hạng các bộ truyện theo xu hướng lượt xem, độ ưa thích từ độc giả và các mốc thời gian
                        </p>
                    </div>

                    {/* Ranking Types */}
                    <div className="rank-top rank">
                        <ul className="rank__type" id="rank__type">
                            {[
                                { id: "1", name: "LƯỢT ĐỌC" },
                                { id: "2", name: "THEO DÕI" },
                                { id: "3", name: "ĐÁNH GIÁ" },
                                { id: "4", name: "HÔM NAY" },
                                { id: "5", name: "THÁNG NÀY" },
                            ].map((item) => (
                                <li
                                    key={item.id}
                                    className={`nav__item ${activeType === item.id ? "active-rank" : ""}`}
                                >
                                    <a
                                        onClick={() => handleTypeChange(item.id)}
                                        className="nav__link"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rank-content rank">
                        <span className="section__title">BẢNG XẾP HẠNG<span className="rank-content-type"> THEO LƯỢT THEO DÕI</span></span>
                    </div>



                    {/* Rankings List */}
                    <div className="rank__infor rank">
                        <ul className="rank__list">
                            {/* Top 1 */}
                            {rankings.length > 0 && (
                                <li id="firstRank" className="rank-item">
                                    <div
                                        className="bg-img"
                                        style={{
                                            backgroundImage: `url(${rankings[0].banner
                                                ? `http://localhost:5000${rankings[0].banner}`
                                                : `http://localhost:5000${rankings[0].poster}`
                                                })`,
                                        }}
                                    ></div>

                                    <span className="item-number">01</span>
                                    <div className="item-content item-rank">
                                        <Link to={`/comic/${rankings[0]._id}`}>
                                            <img
                                                loading="lazy"
                                                src={`http://localhost:5000${rankings[0].poster}`}
                                                alt="Comic Thumbnail"
                                                className="rank-img"
                                            />
                                        </Link>
                                        <div className="item-infor firstRank-infor" style={{ padding: "0 20px" }}>
                                            <Link to={`/comic/${rankings[0]._id}`}>
                                                <h3 className="item-title ">{rankings[0].TenBo}</h3>
                                            </Link>
                                            <h6 className="item-type">
                                                <span style={{ color: "#FAB818", fontSize: "20px", fontWeight: 600 }}>
                                                    {rankings[0].TongLuotXem}
                                                </span>{" "}
                                                Lượt xem
                                            </h6>
                                            <p className="item-type" style={{ marginBottom: ".5rem" }}>
                                                {rankings[0].listLoai && rankings[0].listLoai.length > 0
                                                    ? rankings[0].listLoai.join(", ")
                                                    : ""}
                                            </p>
                                            <div className="rating">{renderStars(rankings[0].danhgia)}</div>
                                        </div>
                                    </div>
                                    <div className="background-item rounded-3"></div>
                                </li>
                            )}

                            {/* Remaining Rankings */}
                            {rankings.slice(1).map((item, index) => (
                                <li key={item._id} className="rank-item">
                                    <span className="item-number" style={{ color: "#FE3200" }}>
                                        {String(index + 2).padStart(2, "0")}
                                    </span>
                                    <div className="item-content">
                                        <Link to={`/comic/${item._id}`}>
                                            <img
                                                loading="lazy"
                                                src={`http://localhost:5000${item.poster}`}
                                                alt=""
                                                className="rank-img"
                                            />
                                        </Link>
                                        <div className="item-infor" style={{ padding: "10px 20px" }}>
                                            <h3 className="rank-title">{item.TenBo}</h3>
                                            <h6 >
                                                <span style={{ color: "#fff" }}>{item.TongLuotXem}</span> Lượt xem
                                            </h6>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                
                                                {item.listLoai && item.listLoai.length > 0 ? (
                                                    
                                                    item.listLoai.map((loai, index) => (
                                                        <p
                                                            key={index}
                                                            className="item-type"
                                                            style={{ marginBottom: ".5rem", cursor:'pointer'}}>
                                                            {loai}
                                                            
                                                        </p>
                                                        
                                                    ))
                                                    
                                                ) : (
                                                    <p className="item-type" style={{ marginBottom: ".5rem" }}>
                                                        Chưa có loại truyện
                                                    </p>
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rank__item-infor ml-auto">
                                        <div className="rating">{renderStars(item.danhgia)}</div>
                                        <div className="d-flex flex-row gap-4">
                                            {item.latestChapter ? (
                                                <>
                                                    <span className="chapter">Chap {item.latestChapter.SttChap}</span>
                                                    <span className="chapter">{item.latestChapter.ThoiGian}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="chapter">Chap...</span>
                                                    <span className="chapter">....time</span>
                                                </>
                                            )}
                                        </div>
                                        <span>{item.theodoi} Lượt theo dõi</span>

                                    </div>

                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rankings;
