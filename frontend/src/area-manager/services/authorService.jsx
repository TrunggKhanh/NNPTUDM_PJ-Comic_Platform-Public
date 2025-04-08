import axios from "axios";

// URL cơ bản cho API backend
const API_BASE_URL = "/api/author";

/**
 * Lấy danh sách tất cả tác giả
 * @param {Object} filters - Bộ lọc (active, name)
 */
export const fetchAuthors = async (filters = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw new Error("Không thể tải danh sách tác giả");
  }
};

/**
 * Thêm mới tác giả
 * @param {Object} authorData - Dữ liệu tác giả
 */
export const addAuthor = async (authorData) => {
  try {
    const response = await axios.post(API_BASE_URL, authorData);
    return response.data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw new Error("Không thể thêm tác giả mới");
  }
};

/**
 * Cập nhật thông tin tác giả
 * @param {string} authorId - ID của tác giả
 * @param {Object} authorData - Dữ liệu cập nhật
 */
export const updateAuthor = async (authorId, authorData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${authorId}`, authorData);
    return response.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw new Error("Không thể cập nhật tác giả");
  }
};

/**
 * Xóa tác giả
 * @param {string} authorId - ID của tác giả
 */
export const deleteAuthor = async (authorId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw new Error("Không thể xóa tác giả");
  }
};

/**
 * Kích hoạt hoặc vô hiệu hóa trạng thái tác giả
 * @param {string} authorId - ID của tác giả
 */
export const toggleAuthorActive = async (authorId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${authorId}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error("Error toggling author status:", error);
    throw new Error("Không thể thay đổi trạng thái tác giả");
  }
};
