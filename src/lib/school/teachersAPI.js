import api from "../api";

export const getTeachers = async (keyword, page, limit, token) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_TEACHERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: keyword,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createTeacher = async (data, accessToken) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_ADD_TEACHERS,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const putTeacher = async (id, data) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_UPDATE_TEACHERS}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const dropTeacher = async (id) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_DELETE_TEACHERS}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
