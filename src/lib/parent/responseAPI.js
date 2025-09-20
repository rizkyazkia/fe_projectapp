import api from "../api";

export const getResponseQuesioner = async (token, page, limit) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}responses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getResponseQuesionerInstitution = async (
  id,
  token,
  keyword,
  page,
  limit
) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_GET_REPONSE_INSTITUTION}/${id}`,
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
    throw error.response?.data;
  }
};

export const createResponseQuesioner = async (id, data, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_CREATE_RESPONSE}/${id}`,
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

export const createResponseQuesionerInstitution = async (id, data, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_CREATE_RESPONSE_INSTITUTION}/${id}`,
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

export const checkingAnsweredQuesioner = async (id, token) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_CHECKING_RESPONSE}/checking/${id}`,
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

export const checkingAnsweredQuesionerInstitution = async (id, token) => {
  try {
    const response = await api.get(
      `${
        import.meta.env.VITE_API_CHECKING_RESPONSE_INSTITUTION
      }/checking/institution/${id}`,
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

export const updateResponseQuesioner = async (id, data) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_UPDATE_RESPONSE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const showResponseForParent = async (
  id,
  userId,
  keyword,
  page,
  limit,
  token
) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_SHOW_RESPONSE_PARENT}/${userId}/${id}`,
      {
        params: {
          search: keyword,
          page,
          limit,
        },
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

export const showResponseForInstitution = async (
  id,
  user_id,
  keyword,
  page,
  limit
) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_SHOW_RESPONSE_INSTITUTION}/${user_id}/${id}`,
      {
        params: {
          search: keyword,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
