import axios from "axios";

const API_BASE_URL = "/api/genres";

/**
 * Lấy danh sách tất cả thể loại
 * @param {Object} filters - Bộ lọc (active, name)
 */
export const fetchGenres = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách thể loại:", error);
    throw new Error("Không thể tải danh sách thể loại");
  }
};

/**
 * Thêm mới thể loại
 * @param {Object} genreData - Dữ liệu thể loại
 */
export const addGenre = async (genreData) => {
  try {
    const response = await axios.post(API_BASE_URL, genreData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm thể loại:", error);
    throw new Error("Không thể thêm thể loại");
  }
};

/**
 * Cập nhật thông tin thể loại
 * @param {string} genreId - ID của thể loại
 * @param {Object} genreData - Dữ liệu cập nhật
 */
export const updateGenre = async (genreId, genreData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${genreId}`, genreData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thể loại:", error);
    throw new Error("Không thể cập nhật thể loại");
  }
};

/**
 * Xóa thể loại
 * @param {string} genreId - ID của thể loại
 */
export const deleteGenre = async (genreId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${genreId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa thể loại:", error);
    throw new Error("Không thể xóa thể loại");
  }
};

/**
 * Thay đổi trạng thái active của thể loại
 * @param {string} genreId - ID của thể loại
 */
export const toggleGenreActive = async (genreId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${genreId}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái:", error);
    throw new Error("Không thể thay đổi trạng thái thể loại");
  }
};

export const fetchTopComicsByGenre = async (genreId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${genreId}/top-comics`);
    return response.data.data; // Trả về danh sách top 5 bộ truyện
  } catch (error) {
    console.error("Lỗi khi tải top bộ truyện hot:", error);
    throw new Error("Không thể tải danh sách bộ truyện hot");
  }
};

