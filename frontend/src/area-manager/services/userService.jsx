import axios from "axios";

const API_BASE_URL = "/api/staff";

// Lấy danh sách nhân viên
export const fetchStaffs = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// Thêm nhân viên mới
export const addStaff = async (staffData) => {
    
      // Thêm logic bổ sung nếu cần
      const response = await axios.post(`${API_BASE_URL}/add-mod`, {
        username: staffData.username,
        email: staffData.email,
        password: staffData.password,
        fullName: staffData.fullName,
        phone: staffData.phone,
        birth: staffData.birth,
        gender: staffData.gender,
      });
      return response.data;

  };

// Xóa nhân viên
export const deleteStaff = async (staffId) => {
    const response = await axios.delete(`${API_BASE_URL}/${staffId}`);
    return response.data;
};

// Cập nhật thông tin nhân viên
export const updateStaff = async (staffId, updatedData) => {
    const response = await axios.put(`${API_BASE_URL}/${staffId}`, updatedData);
    return response.data;
};

// Thay đổi trạng thái hoạt động
export const toggleStaffActive = async (staffId) => {
    const response = await axios.put(`${API_BASE_URL}/${staffId}/toggle-active`);
    return response.data;
};

const API_BASE_URL_c = "/api/customer";

// Lấy danh sách khách hàng
export const fetchCustomers = async () => {
    const response = await axios.get(API_BASE_URL_c);
    return response.data;
};

// Xóa khách hàng
export const deleteCustomer = async (customerId) => {
    const response = await axios.delete(`${API_BASE_URL_c}/${customerId}`);
    return response.data;
};

// Thay đổi trạng thái Premium
export const toggleCustomerActive = async (customerId) => {
    const response = await axios.put(`${API_BASE_URL_c}/${customerId}/toggle-premium`);
    return response.data;
};