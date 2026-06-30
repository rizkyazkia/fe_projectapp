import api from "./api";

export const getClasses = async (token, keyword, page, limit) => {
  if (!token) {
    return;
  }
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_CLASSES, {
      params: {
        search: keyword,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error.response?.data;
  }
};

export const createClasses = async (data, token) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_ADD_CLASSES,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const putClasses = async (id, data, token) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_UPDATE_CLASSES}/${id}`,
      data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const dropClasses = async (id, token) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_DELETE_CLASSES}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getAllClass = async (schoolId) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}classes/institution/${schoolId}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error.response?.data;
  }
};
