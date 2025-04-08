import axios from 'axios';

// URL cơ bản cho API backend
const API_BASE_URL = '/api/botruyen';

// Lấy danh sách bộ truyện đang hoạt động
export const fetchActiveBoTruyen = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/active`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể tải danh sách bộ truyện hoạt động', error.response);
    }
};


export const fetchAllBoTruyen = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể tải danh sách bộ truyện ', error.response);
    }
};

// Gọi API để lấy danh sách bộ truyện được đề xuất
export const fetchRecommendedBoTruyen = async (bookId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/get-recommended-books`, {
            bookId: bookId,
        });
        return response.data.recommendedBooks;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bộ truyện đề xuất:', error.response || error.message);
        throw new Error(
            error.response?.data?.message || 'Không thể lấy danh sách bộ truyện đề xuất'
        );
    }
};


// Lấy danh sách bộ truyện mới nhất
export const fetchBoTruyenLatest = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/latest`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể tải danh sách bộ truyện moi nhat', error.response);
    }
};

export const fetchTopReadBoTruyen = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/top-read`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top-read comics:', error.response || error);
        throw new Error('Không thể tải  Top bộ truyện ', error.response);
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể tải danh sách loaitruyen', error.response);
    }
};



// Lấy thông tin chi tiết một bộ truyện
export const fetchBoTruyenById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data; // Trả về thông tin bộ truyện
    } catch (error) {
        console.error("Error fetching Bo Truyen by ID:", error);
        throw new Error('Không thể tải thông tin bộ truyện');
    }
};

export const saveBoTruyenHistory = async (comicId, userId, latestChapter) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/save-history/${comicId}`, {
            userId,
            latestChapter,
        });
        return response.data;
    } catch (error) {
        console.error("Error saving Bo Truyen history:", error);
        throw new Error("Không thể lưu lịch sử đọc bộ truyện");
    }
};

// Kiểm tra quyền truy cập chương Premium
export const checkPremiumAccess = async (chapterId, userId, isPremium, tickets, ticketCost) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/check-premium-access`, {
            chapterId,
            userId,
            isPremium,
            tickets,
            ticketCost,
        });
        return response.data;
    } catch (error) {
        console.error("Error checking premium access:", error);
        throw new Error("Không thể kiểm tra quyền truy cập chương Premium");
    }
};


// Lấy danh sách chương theo ID bộ truyện (nếu cần gọi riêng)
export const fetchChaptersByComicId = async (comicId) => {
    try {
        const response = await axios.get(`/api/botruyen/${comicId}/chapters`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapters for comic:", error.response?.data || error.message);
        throw new Error("Không thể tải danh sách chương của bộ truyện");
    }
};

// Tìm kiếm bộ truyện theo tên
export const searchBoTruyen = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, { params: { query } });
        return response.data; // Trả về kết quả tìm kiếm
    } catch (error) {
        throw new Error('Không thể tìm kiếm bộ truyện', error.response);
    }
};


export const searchAdvancedBoTruyen = async (query, trangthai, loaiTruyenId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search-advanced`, {
            params: { query, trangthai, loaiTruyenId },
        });
        return response.data;
    } catch (error) {
        console.error("Error performing advanced search:", error);
        throw new Error("Không thể thực hiện tìm kiếm nâng cao");
    }
};



// lấy danh sách truyen trending
export const fetchTrendingComics = async (page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trending`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching trending comics:', error);
        throw new Error('Không thể tải danh sách truyện Trending');
    }
};

// Lấy danh sách truyện mới cập nhật với phân trang
export const fetchLatestComics = async (page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/listlatest`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching latest comics:', error);
        throw new Error('Không thể tải danh sách truyện mới cập nhật');
    }
};


export const fetchBoTruyenByCategory = async (categoryId, page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching BoTruyen by category:", error);
        throw new Error("Không thể tải danh sách bộ truyện theo thể loại");
    }
};

// Lấy danh sách xếp hạng theo tiêu chí
export const fetchRankingsByType = async (type) => {
    try {
        const response = await axios.get(`/api/botruyen/rankings`, {
            params: { type },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching rankings:", error);
        throw new Error("Không thể tải danh sách xếp hạng");
    }
};


// Theo dõi bộ truyện
export const followComic = async (comicId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/follow/${comicId}`, { userId });
        return response.data;
    } catch (error) {
        console.error("Error following comic:", error);
        throw new Error("Không thể theo dõi bộ truyện");
    }
};

// Hủy theo dõi bộ truyện
export const unfollowComic = async (comicId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/unfollow/${comicId}`, {userId});
        return response.data;
    } catch (error) {
        console.error("Error unfollowing comic:", error);
        throw new Error("Không thể hủy theo dõi bộ truyện");
    }
};

export const findCTBoTruyen = async (comicId, userId) => {
    try {
        // Gọi API với comicId và userId
        const response = await axios.get(`${API_BASE_URL}/find/${comicId}`, {
            params: { userId }, // Truyền userId qua query params
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Error fetching CTBoTruyen:", error);
        throw new Error("Không thể tìm kiếm CTBoTruyen");
    }
};