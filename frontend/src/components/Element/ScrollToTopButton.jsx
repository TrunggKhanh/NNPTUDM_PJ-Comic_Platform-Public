import { useEffect, useState } from "react";
import { Button } from "react-bootstrap"; // Import từ React Bootstrap

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Kiểm tra khi cuộn trang
    const handleScroll = () => {
        if (window.scrollY > 20) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        let currentPosition = document.documentElement.scrollTop || document.body.scrollTop;

        if (currentPosition > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, currentPosition - currentPosition / 7);
        }
    };

    useEffect(() => {
        // Lắng nghe sự kiện cuộn trang
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <a
            onClick={scrollToTop}
            id="scrollToTopBtn"
            title="Go to top"
            className="scroll-to-top-btn"
            style={{
                display: isVisible ? "block" : "none",
            }}
        >
            <i className="ri-arrow-up-line"></i>
        </a>
    );
};

export default ScrollToTopButton;
