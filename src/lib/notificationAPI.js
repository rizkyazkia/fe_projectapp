import api from "./api";

export const getNotifications = async (token, { page = 0, limit = 20 } = {}) => {
  try {
    const response = await api.get("notifications", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getUnreadCount = async (token) => {
  try {
    const response = await api.get("notifications/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const markAsRead = async (id, token) => {
  try {
    const response = await api.patch(
      `notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const markAllAsRead = async (token) => {
  try {
    const response = await api.patch(
      "notifications/read-all",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
