import api from "./api";

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
