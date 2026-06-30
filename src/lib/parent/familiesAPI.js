import api from "../api";

export const getFamily = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_FAMILIES);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getFamilyMember = async (token, keyword, page, limit) => {
  try {
    const response = await api.get(
      import.meta.env.VITE_API_GET_FAMILIES_MEMBER,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: keyword,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getParentFamilyMember = async (id, token) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_GET_PARENT}/${id}/parents`,
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

export const createFamilyMember = async (data, accessToken) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_ADD_FAMILIES,
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

export const putFamilyMember = async (id, data) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_UPDATE_FAMILIES}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const dropFamilyMember = async (id) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_DELETE_FAMILIES}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
