import { useState, useEffect } from 'react';
import { fetchTopReadBoTruyen, fetchBoTruyenLatest, fetchRecommendedBoTruyen } from '../services/BoTruyenServices'; // Import thêm service
import { fetchActiveLoaiTruyen } from '../services/LoaiTruyenService';
import CarouselComponent from '../components/Home/CarouselComics';
import ComicList from '../components/Home/ComicsList';
import CategoryList from '../components/Home/CategoryList';
import TopRankingBanner from '../components/Home/TopRankingBanner';
import RecommendType from '../components/Home/RecommendTypeList';
import ShowListComics from '../components/Home/ShowListComics';
import RecommendBanner from '../components/Home/RecommendBanner';
import Loader from "../components/Element/Loader";
import Swal from 'sweetalert2';
const Home = () => {
    const [comicsLatest, setLatestComics] = useState([]);
    const [topReadComics, setTopReadComics] = useState([]);
    const [recommendedComics, setRecommendedComics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookId = "67507c32968ff0f3ba4c2c25";
                const [topReadData, categoryData, latestData, recommendedData] = await Promise.all([
                    fetchTopReadBoTruyen(),
                    fetchActiveLoaiTruyen(),
                    fetchBoTruyenLatest(),
                    fetchRecommendedBoTruyen(bookId),
                ]);
                setTopReadComics(topReadData);
                setCategories(categoryData);
                setLatestComics(latestData);
                setRecommendedComics(recommendedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentStatus = queryParams.get('paymentStatus');
    
        if (paymentStatus === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công!',
            text: 'Cảm ơn bạn đã sử dụng dịch vụ.',
          });
        } else if (paymentStatus === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Thanh toán thất bại!',
            text: 'Vui lòng thử lại hoặc liên hệ hỗ trợ.',
          });
        }
      }, []);

    if (loading) {
        return  <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
    }

    if (error) {
        return <div className="error-container">Lỗi: {error}</div>;
    }

    return (
        <div className="home-container">
            <CarouselComponent comics={topReadComics.slice(0, 10)} />
            <ComicList comics={recommendedComics} title="Đề Cử Hôm Nay" />
            
            <ShowListComics 
                comics={comicsLatest}
                subtitle="Mới Cập Nhật"
                description="Danh sách các truyện mới nhất với chất lượng cao."
                link="http://localhost:5173/latest"
            />
            <RecommendType />
            
            <ShowListComics 
                comics={comicsLatest}
                subtitle="Danh Sách Truyện"
                description="Danh sách các truyện cập nhật liên tục."
                link="http://localhost:5173/trending"
            />
            
            <TopRankingBanner topComics={topReadComics} />
            <CategoryList categories={categories} title={"Loại truyện phổ biến"} />
            <RecommendBanner />
        </div>
    );
};

export default Home;
