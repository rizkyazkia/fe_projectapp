import api from "../../api";

export const getStaffs = async (token) => {
  try {
    const response = await api.get("staffs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createStaff = async (data, token) => {
  try {
    const response = await api.post("staffs", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateStaff = async (id, data, token) => {
  try {
    const response = await api.put(`staffs/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deleteStaff = async (id, token) => {
  try {
    const response = await api.delete(`staffs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
