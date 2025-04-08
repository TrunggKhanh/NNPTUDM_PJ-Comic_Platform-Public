import axios from "axios";

const BASE_URL = "/api/comic";

// API thêm bộ truyện
export const addComic = async (comicData) => {
  try {
    // Gửi trực tiếp dữ liệu JSON
    const response = await axios.post(`${BASE_URL}/add-comic`, comicData);
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.error("Error adding comic:", error);
    throw new Error("Không thể thêm bộ truyện mới");
  }
};


// API lấy danh sách bộ truyện
export const fetchComics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API fetchComics:", error);
    throw error; // Đẩy lỗi lên để xử lý tại component
  }
};

// API xóa bộ truyện
export const deleteComic = async (comicId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${comicId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API deleteComic:", error);
    throw error; // Đẩy lỗi lên để xử lý tại component
  }
};

// API cập nhật bộ truyện
export const updateComic = async (comicId, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${comicId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API updateComic:", error);
    throw error; // Đẩy lỗi lên để xử lý tại component
  }
};

export const uploadImagesToCloudinary = async (comicId, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/${comicId}/upload-images`, formData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};

// API cập nhật stats cho bộ truyện
export const updateComicStats = async (comicId, statsData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${comicId}/update-stats`, statsData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API updateComicStats:", error);
    throw error;
  }
};


////////////////////////// chapter    


export const fetchChaptersByComicId = async (comicId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${comicId}/chapters`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy danh sách chương:", error);
    throw error;
  }
};

// API thêm chương mới
export const addChapter = async (chapterData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-chapter`, chapterData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm chương mới:", error);
    throw error;
  }
};

export const addImagesToChapter = async (id_chapter, formData) => {
  try {
    const response = await axios.post(`/api/comic/${id_chapter}/add-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm ảnh:", error);
    throw error;
  }
};



// API hoàn tất chương
export const completeChapter = async (chapterId) => {
  try {
    const response = await axios.put(`${BASE_URL}/complete-chapter/${chapterId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hoàn tất chương:", error);
    throw error;
  }
};

export const checkChapterExists = async (comicId, chapterNumber) => {
  try {
    const response = await axios.get(`/api/comic/${comicId}/check-chapter`, {
      params: { stt_chap: chapterNumber },
    });
    return response.data.exists;
  } catch (error) {
    console.error("Lỗi khi kiểm tra số chương:", error);
    throw error;
  }
};

export const deleteChapter = async (chapterId) => {
  try {
    const response = await axios.delete(`/api/comic/chapter/${chapterId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa chương:", error);
    throw error;
  }
};

export const fetchChapterDetails = async (chapterId) => {
  if (!chapterId || !chapterId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("ID chương không hợp lệ!");
  }
  try {
    const response = await axios.get(`/api/comic/${chapterId}`);
    return response.data.chapter;
  } catch (error) {
    console.error("Lỗi khi gọi API fetchChapterDetails:", error.response || error);
    throw error;
  }
};

export const fetchComicById = async (comicId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${comicId}`);
    return response.data; // Return the comic data
  } catch (error) {
    console.error(`Error fetching comic with ID ${comicId}:`, error);
    throw new Error("Không thể tải thông tin bộ truyện!");
  }
};