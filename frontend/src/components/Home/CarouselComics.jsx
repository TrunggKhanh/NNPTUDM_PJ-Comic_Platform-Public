import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import iconPremium from "../../assets/PreDark.png";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CarouselComponent = ({ comics = [] }) => {
    const sliderRef = useRef(null); 
    const navigate = useNavigate(); 
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.split(" ").slice(0, maxLength).join(" ") + "...";
        }
        return text;
    };

    const handleRandomClick = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/botruyen/random");
            const randomComicId = response.data._id; 
            navigate(`/comic/${randomComicId}`); 
        } catch (error) {
            console.error("Lỗi khi lấy bộ truyện ngẫu nhiên:", error);
            alert("Không thể lấy bộ truyện ngẫu nhiên. Vui lòng thử lại!");
        }
    };

    return (
        <div className="main__bottom">
            <section className="home" id="home">
                <div className="home__container w-100">
                    <div className="carousel-container">
                        <Slider ref={sliderRef} {...settings}>
                            {comics.map((comic, index) => (
                                <div key={index} className="carousel-item w-100 main-Banner">
                                    {comic.banner && (
                                        <img
                                            loading="lazy"
                                            src={`http://localhost:5000${comic.banner}`}
                                            className="d-block w-100 rounded-1 banner-img"
                                            alt="Banner"
                                        />
                                    )}
                                    {comic.premium && (
                                        <div className="item-vip-banner">
                                            <img
                                                loading="lazy"
                                                src={iconPremium}
                                                alt="Premium"
                                                style={{ width: "100px", height: "40px", borderRadius: 0 }}
                                            />
                                        </div>
                                    )}
                                    <div className="background-item"></div>
                                    <div className="background-bottom"></div>
                                    <div className="item-infor">
                                        <div className="item-content">
                                            <div className="content">
                                                <a href={`/comic/${comic._id}`} style={{ display: "block" }}>
                                                    {comic.tenbo}
                                                </a>
                                                <div>
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className="ri-star-fill"
                                                            style={{
                                                                color: i < comic.danhgia ? "#FAB818" : "#ccc",
                                                            }}
                                                        ></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="item-des">
                                                <p>{truncateText(comic.mota, 35)}</p>
                                            </div>
                                            <div className=" btn-watch">
                                                <a href={`/comic/${comic._id}`}>
                                                    XEM NGAY <i className="fa-solid fa-square-caret-right"></i>
                                                </a>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                            ))}
                        </Slider>

                        <button
                            className="carousel-control-prev"
                            onClick={() => sliderRef.current.slickPrev()}
                        >
                            <div className="carousel-icon"> <span className="carousel-control-prev-icon" aria-hidden="true"></span></div>
                           
                        </button>
                        <button
                            className="carousel-control-next"
                            onClick={() => sliderRef.current.slickNext()}
                        >
                            <div className="carousel-icon"><span className="carousel-control-next-icon" aria-hidden="true"></span></div>
                            
                        </button>
                    </div>
                </div>
            </section>
            <div className="main__right">
                <div className="main__random">
                        <div className="content">
                            <a href="#">Hôm nay đọc gì?</a>
                        </div>
                        <div className="horizontal" style={{marginTop:'1rem'}}></div>
                        <div className="item-des" >
                            <p>Nếu bạn không biết đọc gì hôm nay. Hãy để tôi chọn cho bạn</p>
                        </div>
                        <div className="btn__regis" >
                            <a onClick={handleRandomClick}>ĐỌC NGẪU NHIÊN</a>
                        </div>
                </div>
                <div className="main__random bg-random">
                    <a href="/premium" id="btnPay" style={{ fontWeight: 600, letterSpacing: '1px' }} className="btn-pre nav__buttons-Pre">
                        <i className="fa-solid fa-crown"></i>
                        <span style={{ paddingRight: '.3rem', fontWeight: 500, color: '#FAB818' }}>Thử </span> Ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CarouselComponent;
