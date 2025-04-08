import axios from "axios";

const API_BASE_URL = "/api/rbac";

// Lấy danh sách quyền
export const fetchPermissions = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addPermission = async (permissionData) => {
    try {
      const response = await axios.post(API_BASE_URL, {
        PermissionsName: permissionData.PermissionsName,
        Description: permissionData.Description,
        PermissionsStats: permissionData.PermissionsStats,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
// Xóa quyền
export const deletePermission = async (permissionId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${permissionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cập nhật quyền
export const updatePermission = async (permissionId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${permissionId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Thay đổi trạng thái hoạt động
export const togglePermissionActive = async (permissionId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${permissionId}/toggle-active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cập nhật trạng thái quyền
export const updatePermissionStats = async (permissionId, statsData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${permissionId}/update-stats`, statsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy danh sách nhân viên
export const fetchStaffs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staffs`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Lấy quyền của nhân viên
export const fetchStaffPermissions = async (IdUser) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff-permissions/${IdUser}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Thay đổi trạng thái hoạt động của quyền
export const toggleStaffPermissionActive = async (IdUser, IdPermissions) => {
  try {
    const response = await axios.put(`/api/rbac/${IdPermissions}/${IdUser}/toggle-permission-active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Cấp quyền cho nhân viên
export const grantPermission = async (IdUser, IdPermissions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/grant-permission`, {
      IdUser,
      IdPermissions,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
