import api from "./api";

export const getQuesioners = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_QUESIONERS);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getQuestions = async (keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_QUESTIONS, {
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

export const getQuestionsByQuesionerID = async (id, keyword, page, limit) => {
  try {
    const response = await api.get(
      import.meta.env.VITE_API_GET_QUESTIONS_BY_QUESIONER_ID + `/${id}`,
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

export const getQuestionsByQuesionerIDWithoutPagination = async (id) => {
  try {
    const response = await api.get(
      import.meta.env
        .VITE_API_GET_QUESTIONS_BY_QUESIONER_ID_WITHOUT_PAGINATION + `/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateQuestion = async (id, data) => {
  try {
    const response = await api.put(
      import.meta.env.VITE_API_GET_QUESTIONS_BY_QUESIONER_ID + `/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
