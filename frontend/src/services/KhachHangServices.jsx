import axios from 'axios';

const API_BASE_URL = '/api/khachhang';

// lấy danh sách lịch sử đọc bộ truyện của khách hàng
export const fetchReadHistory = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/read-history/${userId}`);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Error fetching read history:", error);
        throw new Error("Không thể lấy lịch sử đọc bộ truyện");
    }
};

// xóa lịch sử đọc (cập nhật ls_moi thành null)
export const deleteReadHistory = async (userId, comicId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/delete-read-history`, {
            userId,
            comicId,
        });
        return response.data; // Trả về kết quả thành công từ API
    } catch (error) {
        console.error("Error deleting read history:", error);
        throw new Error("Không thể xóa lịch sử đọc bộ truyện");
    }
};


// Lấy danh sách theo dõi
export const fetchFollowing = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/following/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching following list:", error);
        throw new Error("Không thể lấy danh sách theo dõi");
    }
};

// Bỏ theo dõi
export const unfollowComic = async (userId, comicId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/unfollow`, { userId, comicId });
        return response.data;
    } catch (error) {
        console.error("Error unfollowing comic:", error);
        throw new Error("Không thể bỏ theo dõi");
    }
};