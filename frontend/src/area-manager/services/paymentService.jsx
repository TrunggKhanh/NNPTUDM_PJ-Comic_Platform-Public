import axios from "axios";

const API_BASE_URL = "/api/payment";

// Lấy danh sách thanh toán
export const fetchPayments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error.response?.data || error;
  }
};

// Lấy danh sách thanh toán theo khách hàng (IdUser)
export const fetchPaymentsByCustomer = async (IdUser) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/${IdUser}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payments for customer ${IdUser}:`, error);
    throw error.response?.data || error;
  }
};

// Lấy dữ liệu nhóm theo phương thức thanh toán
export const fetchPaymentsByMethod = async () => {
  const response = await axios.get(`${API_BASE_URL}/group-by-method`);
  return response.data;
};

// Lấy dữ liệu nhóm theo trạng thái thanh toán
export const fetchPaymentsByStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/group-by-status`);
  return response.data;
};

// Lấy dữ liệu nhóm theo ngày
export const fetchPaymentsByDate = async () => {
  const response = await axios.get(`${API_BASE_URL}/group-by-date`);
  return response.data;
};

export const fetchLineChartData = async () => {
  const response = await axios.get(`${API_BASE_URL}/line`);
  return response.data;
};